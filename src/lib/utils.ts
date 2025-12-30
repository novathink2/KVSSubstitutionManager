import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a proper UUID v4
 * Note: For database inserts, prefer letting the DB auto-generate UUIDs
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generate a unique employee code for contractual teachers
 * Format: C + timestamp (last 6 digits) + random 2 digits
 * Example: C240151
 */
export function generateContractualEmployeeCode(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `C${timestamp}${random}`;
}

export function generateUsername(schoolCode: string, employeeCode: string): string {
  return `${schoolCode}.${employeeCode}`;
}

/**
 * Check if an employee code is for a contractual teacher
 */
export function isContractualEmployeeCode(employeeCode: string): boolean {
  return employeeCode.startsWith('C');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDayName(date: string): string {
  const dayIndex = new Date(date).getDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex].toUpperCase();
}

export function isSunday(date: string): boolean {
  return new Date(date).getDay() === 0;
}

export function generateEmptyTimetable(): string[][] {
  return Array(6).fill(null).map(() => Array(8).fill(''));
}

export function parseTimetableCSV(csv: string): string[][] {
  const lines = csv.trim().split('\n');
  return lines.map(line => {
    const cells: string[] = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }
    cells.push(cell.trim());
    
    return cells;
  });
}

export function timetableToCSV(timetable: string[][]): string {
  return timetable.map(row => 
    row.map(cell => {
      if (cell.includes(',') || cell.includes('"')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  ).join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Extract class number from class name (e.g., "5A" -> 5, "10B" -> 10)
 */
export function getClassNumber(className: string): number {
  const match = className.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Determine if a class is primary (1-5) or secondary (6-12)
 */
export function isPrimaryClass(className: string): boolean {
  const classNum = getClassNumber(className);
  return classNum >= 1 && classNum <= 5;
}

export function isSecondaryClass(className: string): boolean {
  const classNum = getClassNumber(className);
  return classNum >= 6 && classNum <= 12;
}

/**
 * Check if a teacher can substitute for a class based on designation and class level
 * Rules:
 * - PRT teachers can only teach Primary (Classes 1-5)
 * - TGT and PGT teachers can teach Secondary (Classes 6-12)
 * - TGT and PGT can substitute for each other in secondary classes
 */
export function canTeachClass(teacherDesignation: string, className: string): boolean {
  const isPrimary = isPrimaryClass(className);
  const isSecondary = isSecondaryClass(className);
  
  if (isPrimary && teacherDesignation === 'PRT') {
    return true;
  }
  
  if (isSecondary && (teacherDesignation === 'TGT' || teacherDesignation === 'PGT')) {
    return true;
  }
  
  return false;
}
