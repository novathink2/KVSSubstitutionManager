import { useState, useEffect } from 'react';
import { User, Designation, SubstitutionPlan, SubstitutionHistory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUsersBySchool, addHistory } from '@/lib/api';
import { getDayName, isSunday, generateId, getInitials, canTeachClass, isPrimaryClass } from '@/lib/utils';
import { generateSmartSubstitutions, generateSubstitutionSummary } from '@/lib/substitution-algorithm';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Zap, Inbox } from 'lucide-react';

interface AdminCreatePlanProps {
  user: User;
}

export default function AdminCreatePlan({ user }: AdminCreatePlanProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [filterDesignation, setFilterDesignation] = useState<Designation | 'ALL'>('ALL');
  const [absentTeachers, setAbsentTeachers] = useState<Map<string, string>>(new Map());
  const [substitutions, setSubstitutions] = useState<Map<string, SubstitutionPlan[]>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTeachers();
  }, [user.schoolId]);

  const loadTeachers = async () => {
    try {
      const data = await getUsersBySchool(user.schoolId);
      setTeachers(data.filter(u => u.role === 'TEACHER'));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load teachers.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    filterDesignation === 'ALL' || t.designation === filterDesignation
  );

  const handleToggleAbsent = (teacherId: string) => {
    const newAbsent = new Map(absentTeachers);
    if (newAbsent.has(teacherId)) {
      newAbsent.delete(teacherId);
    } else {
      newAbsent.set(teacherId, '');
    }
    setAbsentTeachers(newAbsent);
  };

  const handleReasonChange = (teacherId: string, reason: string) => {
    const newAbsent = new Map(absentTeachers);
    newAbsent.set(teacherId, reason);
    setAbsentTeachers(newAbsent);
  };

  const handleGenerate = async () => {
    if (!selectedDate) {
      toast({
        title: 'Select Date',
        description: 'Please select a date first.',
        variant: 'destructive',
      });
      return;
    }

    if (isSunday(selectedDate)) {
      toast({
        title: 'Invalid Date',
        description: 'Cannot create plan for Sunday.',
        variant: 'destructive',
      });
      return;
    }

    if (absentTeachers.size === 0) {
      toast({
        title: 'No Absences',
        description: 'Please mark at least one teacher as absent.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    const newSubstitutions = new Map<string, SubstitutionPlan[]>();
    const absentTeacherIdSet = new Set(absentTeachers.keys());

    try {
      for (const [teacherId, reason] of absentTeachers) {
        const absentTeacher = teachers.find(t => t.id === teacherId);
        if (!absentTeacher) continue;

        // Use smart algorithm to generate substitutions
        const subs = generateSmartSubstitutions(
          absentTeacher,
          selectedDate,
          teachers,
          absentTeacherIdSet
        );

        newSubstitutions.set(teacherId, subs);

        // Save to history
        const historyItem: Omit<SubstitutionHistory, 'id'> = {
          date: selectedDate,
          absentTeacherId: teacherId,
          absentTeacherName: absentTeacher.name,
          reason: reason || 'Not specified',
          leaveType: 'FULL_DAY',
          substitutions: subs,
          createdAt: new Date().toISOString(),
          createdBy: user.id,
        };
        await addHistory(historyItem as SubstitutionHistory);
      }

      setSubstitutions(newSubstitutions);
      
      // Generate summary for toast
      const totalSubstitutions = Array.from(newSubstitutions.values())
        .reduce((sum, subs) => sum + subs.length, 0);
      
      toast({
        title: 'Substitutions Generated',
        description: `Successfully generated ${totalSubstitutions} substitution${totalSubstitutions !== 1 ? 's' : ''} for ${absentTeachers.size} teacher${absentTeachers.size !== 1 ? 's' : ''}.`,
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error.message || 'Failed to generate substitutions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left: Selection */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle>Select Date:</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDate && (
                <p className="text-sm font-semibold text-primary">
                  {getDayName(selectedDate)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mark Absences</CardTitle>
            <div className="flex gap-2 mt-4">
              {['PGT', 'TGT', 'PRT', 'OTHER'].map((des) => (
                <Button
                  key={des}
                  variant={filterDesignation === des ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterDesignation(des as Designation)}
                >
                  {des}
                </Button>
              ))}
              <Button
                variant={filterDesignation === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterDesignation('ALL')}
              >
                All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTeachers.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No teachers found in this section.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                            {getInitials(teacher.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{teacher.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {teacher.designation} {teacher.subject && `(${teacher.subject})`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`status-dot ${absentTeachers.has(teacher.id) ? 'status-dot-absent' : 'status-dot-active'}`} />
                          <input
                            type="checkbox"
                            checked={absentTeachers.has(teacher.id)}
                            onChange={() => handleToggleAbsent(teacher.id)}
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                      {absentTeachers.has(teacher.id) && (
                        <Input
                          placeholder="Reason for absence"
                          value={absentTeachers.get(teacher.id) || ''}
                          onChange={(e) => handleReasonChange(teacher.id, e.target.value)}
                          className="ml-13"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || absentTeachers.size === 0}
                  className="w-full mt-4"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating Smart Substitutions...' : 'Generate Substitutions'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Results */}
      <Card>
        <CardHeader>
          <CardTitle>Substitution Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {substitutions.size === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Inbox className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a date and mark absent teachers to generate a plan.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from(substitutions.entries()).map(([teacherId, plans]) => {
                const teacher = teachers.find(t => t.id === teacherId);
                if (!teacher) return null;

                return (
                  <div key={teacherId} className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <div className="w-8 h-8 bg-destructive/10 text-destructive rounded-full flex items-center justify-center text-sm font-bold">
                        {getInitials(teacher.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">{absentTeachers.get(teacherId)}</p>
                      </div>
                    </div>

                    {plans.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No classes scheduled for this day.</p>
                    ) : (
                      <div className="space-y-2">
                        {plans.map((plan, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                            <div className="flex items-start justify-between mb-1">
                              <span className="font-semibold text-sm">Period {plan.period} - {plan.className}</span>
                              {plan.substituteTeacherId && (
                                <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">Assigned</span>
                              )}
                              {!plan.substituteTeacherId && (
                                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded">Unassigned</span>
                              )}
                            </div>
                            <p className="text-sm text-foreground font-medium">
                              {plan.substituteTeacherId ? (
                                <span className="text-primary">→ {plan.substituteTeacherName}</span>
                              ) : (
                                <span className="text-muted-foreground">{plan.substituteTeacherName}</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                              <span className="opacity-50">•</span>
                              <span>{plan.reason}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
