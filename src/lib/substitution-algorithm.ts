import { User, SubstitutionPlan, Designation } from '@/types';
import { isPrimaryClass, canTeachClass } from '@/lib/utils';

interface PeriodInfo {
  period: number;
  className: string;
}

interface AvailableTeacher {
  teacher: User;
  score: number;
  reason: string;
}

/**
 * Smart substitution algorithm that prioritizes teachers already teaching the class
 */
export function generateSmartSubstitutions(
  absentTeacher: User,
  selectedDate: string,
  allTeachers: User[],
  absentTeacherIds: Set<string>
): SubstitutionPlan[] {
  const dayIndex = new Date(selectedDate).getDay() - 1; // 0 = Monday
  if (dayIndex < 0 || dayIndex > 5) return [];

  // Safety check: ensure timetable exists and is properly initialized
  if (!absentTeacher.timetable || !Array.isArray(absentTeacher.timetable) || absentTeacher.timetable.length === 0) {
    console.warn(`Teacher ${absentTeacher.name} has no timetable data`);
    return [];
  }

  // Safety check: ensure the day exists in timetable
  if (!absentTeacher.timetable[dayIndex] || !Array.isArray(absentTeacher.timetable[dayIndex])) {
    console.warn(`Teacher ${absentTeacher.name} has no timetable for day index ${dayIndex}`);
    return [];
  }

  // Get all periods the absent teacher was supposed to teach
  const periodsToCover: PeriodInfo[] = [];
  absentTeacher.timetable[dayIndex].forEach((className, periodIndex) => {
    if (className && className.trim()) {
      periodsToCover.push({
        period: periodIndex + 1,
        className: className.trim(),
      });
    }
  });

  if (periodsToCover.length === 0) return [];

  const substitutions: SubstitutionPlan[] = [];
  const teacherWorkload = new Map<string, number>(); // Track how many periods assigned to each teacher

  // Process each period
  for (const { period, className } of periodsToCover) {
    const periodIndex = period - 1;
    const isPrimary = isPrimaryClass(className);

    // Get all eligible teachers (free and right designation)
    const eligibleTeachers = allTeachers.filter(teacher => {
      // Skip if teacher is absent or is the absent teacher
      if (teacher.id === absentTeacher.id || absentTeacherIds.has(teacher.id)) {
        return false;
      }

      // Safety check: ensure teacher has timetable
      if (!teacher.timetable || !Array.isArray(teacher.timetable) || 
          !teacher.timetable[dayIndex] || !Array.isArray(teacher.timetable[dayIndex])) {
        return false;
      }

      // Check if teacher is free this period
      const teacherClass = teacher.timetable[dayIndex]?.[periodIndex];
      if (teacherClass && teacherClass.trim()) {
        return false;
      }

      // Check designation compatibility
      if (isPrimary && teacher.designation !== 'PRT') {
        return false;
      }
      if (!isPrimary && teacher.designation === 'PRT') {
        return false;
      }

      return canTeachClass(teacher.designation, className);
    });

    // PHASE 1: Try to find teachers who ALREADY TEACH this class
    const classTeachers = eligibleTeachers.filter(teacher => {
      // Safety check
      if (!teacher.timetable || !Array.isArray(teacher.timetable)) {
        return false;
      }
      return teacher.timetable.some(day => 
        Array.isArray(day) && day.some(c => c === className)
      );
    });

    let availableTeachers: AvailableTeacher[];

    if (classTeachers.length > 0) {
      // Use ONLY teachers who already teach this class
      availableTeachers = classTeachers
        .map(teacher => scoreTeacher(teacher, className, absentTeacher, allTeachers, dayIndex, teacherWorkload, true))
        .sort((a, b) => b.score - a.score);
    } else {
      // PHASE 2: No class teachers available, use other eligible teachers
      availableTeachers = eligibleTeachers
        .map(teacher => scoreTeacher(teacher, className, absentTeacher, allTeachers, dayIndex, teacherWorkload, false))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
    }

    if (availableTeachers.length === 0) {
      // No substitute available
      substitutions.push({
        period,
        className,
        substituteTeacherId: '',
        substituteTeacherName: 'No substitute available',
        reason: 'All eligible teachers are occupied or absent',
      });
    } else {
      // Pick the best teacher
      const best = availableTeachers[0];
      const currentWorkload = teacherWorkload.get(best.teacher.id) || 0;
      teacherWorkload.set(best.teacher.id, currentWorkload + 1);

      substitutions.push({
        period,
        className,
        substituteTeacherId: best.teacher.id,
        substituteTeacherName: best.teacher.name,
        reason: best.reason,
      });
    }
  }

  return substitutions;
}

/**
 * Score a teacher's suitability for substitution
 * Higher score = better match
 * @param isClassTeacher - Whether this teacher already teaches this class (phase 1)
 */
function scoreTeacher(
  teacher: User,
  className: string,
  absentTeacher: User,
  allTeachers: User[],
  dayIndex: number,
  currentWorkload: Map<string, number>,
  isClassTeacher: boolean
): AvailableTeacher {
  let score = 0;
  const reasons: string[] = [];
  const workload = currentWorkload.get(teacher.id) || 0;

  if (isClassTeacher) {
    // PHASE 1: Scoring for teachers who already teach this class
    score += 1000; // Very high base score to ensure they're always picked first
    reasons.push('already teaches this class');

    // Same subject gets bonus
    if (teacher.subject && absentTeacher.subject && 
        teacher.subject.toLowerCase() === absentTeacher.subject.toLowerCase()) {
      score += 50;
      reasons.push(`${teacher.subject} subject expert`);
    }

    // Lower workload is preferred
    score -= workload * 10;
  } else {
    // PHASE 2: Scoring for other teachers (only used if no class teachers available)
    reasons.push('covering for absent colleague');

    // Same subject as absent teacher
    if (teacher.subject && absentTeacher.subject && 
        teacher.subject.toLowerCase() === absentTeacher.subject.toLowerCase()) {
      score += 50;
      reasons.push(`${teacher.subject} subject expert`);
    }

    // Same designation (TGT for TGT, PGT for PGT, etc.)
    if (teacher.designation === absentTeacher.designation) {
      score += 30;
      reasons.push(`same level (${teacher.designation})`);
    } else if (
      // TGT and PGT are interchangeable for secondary classes
      (teacher.designation === 'TGT' && absentTeacher.designation === 'PGT') ||
      (teacher.designation === 'PGT' && absentTeacher.designation === 'TGT')
    ) {
      score += 20;
      reasons.push(`qualified for this level (${teacher.designation})`);
    }

    // Lower current workload (distribute fairly)
    score -= workload * 10;
    
    // General availability bonus
    score += 10;
  }

  // Build reason string
  let reason = '';
  if (reasons.length > 0) {
    reason = reasons.join(', ');
    // Capitalize first letter
    reason = reason.charAt(0).toUpperCase() + reason.slice(1);
  } else {
    reason = `Available ${teacher.designation}`;
    if (teacher.subject) {
      reason += ` (${teacher.subject})`;
    }
  }

  // Add workload info if teacher has multiple substitutions
  if (workload > 0) {
    reason += ` [${workload + 1} period${workload + 1 > 1 ? 's' : ''} today]`;
  }

  return {
    teacher,
    score,
    reason,
  };
}

/**
 * Generate a summary report of substitutions
 */
export function generateSubstitutionSummary(
  substitutions: SubstitutionPlan[],
  absentTeacherName: string
): string {
  if (substitutions.length === 0) {
    return `${absentTeacherName} has no classes scheduled for this day.`;
  }

  const lines = [`Substitution Plan for ${absentTeacherName}:\n`];
  
  substitutions.forEach(sub => {
    lines.push(
      `Period ${sub.period} (${sub.className}): ${sub.substituteTeacherName} - ${sub.reason}`
    );
  });

  const uniqueSubstitutes = new Set(
    substitutions
      .filter(s => s.substituteTeacherId)
      .map(s => s.substituteTeacherName)
  );

  lines.push(`\nTotal periods: ${substitutions.length}`);
  lines.push(`Substitutes assigned: ${uniqueSubstitutes.size}`);

  return lines.join('\n');
}
