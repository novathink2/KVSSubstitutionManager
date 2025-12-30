export type UserRole = 'ADMIN' | 'TEACHER';

export type Designation = 'PGT' | 'TGT' | 'PRT' | 'OTHER';

export type EmploymentType = 'PERMANENT' | 'CONTRACTUAL';

export type RequestType = 'INTERCHANGE' | 'EXTRA_CLASS';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LeaveType = 'FULL_DAY' | 'PARTIAL_DAY';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  password: string;
  role: UserRole;
  designation: Designation;
  subject?: string;
  employeeCode: string;
  employmentType: EmploymentType;
  dateOfBirth?: string;
  dateOfJoiningKV?: string;
  dateOfJoiningPresentPost?: string;
  phone?: string;
  profilePicture?: string;
  schoolId: string;
  timetable: string[][]; // 6 days x 8 periods
}

export interface Leave {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string;
  type: LeaveType;
  startTime?: string;
  endTime?: string;
  reason: string;
  documentUrl?: string;
  createdAt: string;
}

export interface Request {
  id: string;
  teacherId: string;
  teacherName: string;
  type: RequestType;
  details: string;
  status: RequestStatus;
  createdAt: string;
  respondedAt?: string;
}

export interface SubstitutionPlan {
  period: number;
  className: string;
  substituteTeacherId: string;
  substituteTeacherName: string;
  reason: string;
}

export interface SubstitutionHistory {
  id: string;
  date: string;
  absentTeacherId: string;
  absentTeacherName: string;
  reason: string;
  leaveType: LeaveType;
  startTime?: string;
  endTime?: string;
  substitutions: SubstitutionPlan[];
  createdAt: string;
  createdBy: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  documentUrl?: string;
  createdBy?: string;
  schoolId: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
