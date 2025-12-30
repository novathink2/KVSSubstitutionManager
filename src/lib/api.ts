import { supabase } from './supabase';
import { User, Leave, Request, SubstitutionHistory } from '@/types';

// ========== USERS ==========

export const getUsers = async (schoolId?: string): Promise<User[]> => {
  let query = supabase
    .from('users')
    .select('*');
  
  if (schoolId) {
    query = query.eq('school_id', schoolId);
  }
  
  const { data, error } = await query.order('name');
  
  if (error) throw error;
  
  return (data || []).map(dbUser => {
    // Safely parse timetable with fallback to empty array
    let timetable: string[][] = [];
    try {
      if (dbUser.timetable && Array.isArray(dbUser.timetable)) {
        timetable = dbUser.timetable as string[][];
      } else {
        timetable = Array(6).fill(null).map(() => Array(8).fill(''));
      }
    } catch {
      timetable = Array(6).fill(null).map(() => Array(8).fill(''));
    }

    return {
      id: dbUser.id,
      name: dbUser.name,
      username: dbUser.username,
      email: dbUser.email || undefined,
      password: dbUser.password,
      role: dbUser.role as 'ADMIN' | 'TEACHER',
      designation: dbUser.designation as any,
      subject: dbUser.subject || undefined,
      employeeCode: dbUser.employee_code,
      employmentType: dbUser.employment_type as any,
      dateOfBirth: dbUser.date_of_birth || undefined,
      dateOfJoiningKV: dbUser.date_of_joining_kv || undefined,
      dateOfJoiningPresentPost: dbUser.date_of_joining_present_post || undefined,
      phone: dbUser.phone || undefined,
      schoolId: dbUser.school_id,
      profilePicture: dbUser.profile_picture || undefined,
      timetable,
    };
  });
};

export const getUsersBySchool = async (schoolId: string): Promise<User[]> => {
  return getUsers(schoolId);
};

export const addUser = async (user: User): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email || null,
      password: user.password,
      role: user.role,
      designation: user.designation,
      subject: user.subject || null,
      employee_code: user.employeeCode,
      employment_type: user.employmentType,
      date_of_birth: user.dateOfBirth || null,
      date_of_joining_kv: user.dateOfJoiningKV || null,
      date_of_joining_present_post: user.dateOfJoiningPresentPost || null,
      phone: user.phone || null,
      school_id: user.schoolId,
      profile_picture: user.profilePicture || null,
      timetable: user.timetable || [],
    });

  if (error) throw error;
};

export const updateUser = async (user: User): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({
      name: user.name,
      email: user.email || null,
      password: user.password,
      subject: user.subject || null,
      date_of_birth: user.dateOfBirth || null,
      date_of_joining_kv: user.dateOfJoiningKV || null,
      date_of_joining_present_post: user.dateOfJoiningPresentPost || null,
      phone: user.phone || null,
      profile_picture: user.profilePicture || null,
      timetable: user.timetable || [],
    })
    .eq('id', user.id);

  if (error) throw error;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  if (!data) return null;

  // Safely parse timetable
  let timetable: string[][] = [];
  try {
    if (data.timetable && Array.isArray(data.timetable)) {
      timetable = data.timetable as string[][];
    } else {
      timetable = Array(6).fill(null).map(() => Array(8).fill(''));
    }
  } catch {
    timetable = Array(6).fill(null).map(() => Array(8).fill(''));  }

  return {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email || undefined,
    password: data.password,
    role: data.role as 'ADMIN' | 'TEACHER',
    designation: data.designation as any,
    subject: data.subject || undefined,
    employeeCode: data.employee_code,
    employmentType: data.employment_type as any,
    dateOfBirth: data.date_of_birth || undefined,
    dateOfJoiningKV: data.date_of_joining_kv || undefined,
    dateOfJoiningPresentPost: data.date_of_joining_present_post || undefined,
    phone: data.phone || undefined,
    schoolId: data.school_id,
    profilePicture: data.profile_picture || undefined,
    timetable,
  };
};

export const getUserByCredentials = async (
  identifier: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .eq('password', password)
    .single();

  if (error || !data) return null;

  // Safely parse timetable
  let timetable: string[][] = [];
  try {
    if (data.timetable && Array.isArray(data.timetable)) {
      timetable = data.timetable as string[][];
    } else {
      timetable = Array(6).fill(null).map(() => Array(8).fill(''));
    }
  } catch {
    timetable = Array(6).fill(null).map(() => Array(8).fill(''));
  }

  return {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email || undefined,
    password: data.password,
    role: data.role as 'ADMIN' | 'TEACHER',
    designation: data.designation as any,
    subject: data.subject || undefined,
    employeeCode: data.employee_code,
    employmentType: data.employment_type as any,
    dateOfBirth: data.date_of_birth || undefined,
    dateOfJoiningKV: data.date_of_joining_kv || undefined,
    dateOfJoiningPresentPost: data.date_of_joining_present_post || undefined,
    phone: data.phone || undefined,
    schoolId: data.school_id,
    profilePicture: data.profile_picture || undefined,
    timetable,
  };
};

export const checkSchoolExists = async (schoolId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('school_id', schoolId)
    .limit(1);

  return (data?.length || 0) > 0;
};

// ========== LEAVES ==========

export const getLeaves = async (schoolId?: string): Promise<Leave[]> => {
  let query = supabase.from('leaves').select('*');
  
  if (schoolId) {
    // Join with users table to filter by school
    const users = await getUsersBySchool(schoolId);
    const teacherIds = users.map(u => u.id);
    query = query.in('teacher_id', teacherIds);
  }
  
  const { data, error } = await query.order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(dbLeave => ({
    id: dbLeave.id,
    teacherId: dbLeave.teacher_id,
    teacherName: dbLeave.teacher_name,
    date: dbLeave.date,
    type: dbLeave.type as 'FULL' | 'PARTIAL',
    startTime: dbLeave.start_time || undefined,
    endTime: dbLeave.end_time || undefined,
    reason: dbLeave.reason,
    documentUrl: dbLeave.document_url || undefined,
    createdAt: dbLeave.created_at,
  }));
};

export const addLeave = async (leave: Leave): Promise<void> => {
  const { error } = await supabase
    .from('leaves')
    .insert({
      id: leave.id,
      teacher_id: leave.teacherId,
      teacher_name: leave.teacherName,
      date: leave.date,
      type: leave.type,
      start_time: leave.startTime || null,
      end_time: leave.endTime || null,
      reason: leave.reason,
      document_url: leave.documentUrl || null,
    });

  if (error) throw error;
};

export const deleteLeave = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('leaves')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getLeavesByTeacher = async (teacherId: string): Promise<Leave[]> => {
  const { data, error } = await supabase
    .from('leaves')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(dbLeave => ({
    id: dbLeave.id,
    teacherId: dbLeave.teacher_id,
    teacherName: dbLeave.teacher_name,
    date: dbLeave.date,
    type: dbLeave.type as 'FULL' | 'PARTIAL',
    startTime: dbLeave.start_time || undefined,
    endTime: dbLeave.end_time || undefined,
    reason: dbLeave.reason,
    documentUrl: dbLeave.document_url || undefined,
    createdAt: dbLeave.created_at,
  }));
};

export const getLeavesByDate = async (date: string, schoolId?: string): Promise<Leave[]> => {
  let query = supabase.from('leaves').select('*').eq('date', date);
  
  if (schoolId) {
    const users = await getUsersBySchool(schoolId);
    const teacherIds = users.map(u => u.id);
    query = query.in('teacher_id', teacherIds);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map(dbLeave => ({
    id: dbLeave.id,
    teacherId: dbLeave.teacher_id,
    teacherName: dbLeave.teacher_name,
    date: dbLeave.date,
    type: dbLeave.type as 'FULL' | 'PARTIAL',
    startTime: dbLeave.start_time || undefined,
    endTime: dbLeave.end_time || undefined,
    reason: dbLeave.reason,
    documentUrl: dbLeave.document_url || undefined,
    createdAt: dbLeave.created_at,
  }));
};

// ========== REQUESTS ==========

export const getRequests = async (schoolId?: string): Promise<Request[]> => {
  let query = supabase.from('requests').select('*');
  
  if (schoolId) {
    const users = await getUsersBySchool(schoolId);
    const teacherIds = users.map(u => u.id);
    query = query.in('teacher_id', teacherIds);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(dbRequest => ({
    id: dbRequest.id,
    teacherId: dbRequest.teacher_id,
    teacherName: dbRequest.teacher_name,
    type: dbRequest.type as any,
    details: dbRequest.details,
    status: dbRequest.status as any,
    createdAt: dbRequest.created_at,
  }));
};

export const addRequest = async (request: Request): Promise<void> => {
  const { error } = await supabase
    .from('requests')
    .insert({
      id: request.id,
      teacher_id: request.teacherId,
      teacher_name: request.teacherName,
      type: request.type,
      details: request.details,
      status: request.status,
    });

  if (error) throw error;
};

export const updateRequest = async (request: Request): Promise<void> => {
  const { error } = await supabase
    .from('requests')
    .update({
      status: request.status,
    })
    .eq('id', request.id);

  if (error) throw error;
};

export const getRequestsByTeacher = async (teacherId: string): Promise<Request[]> => {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(dbRequest => ({
    id: dbRequest.id,
    teacherId: dbRequest.teacher_id,
    teacherName: dbRequest.teacher_name,
    type: dbRequest.type as any,
    details: dbRequest.details,
    status: dbRequest.status as any,
    createdAt: dbRequest.created_at,
  }));
};

// ========== SUBSTITUTION HISTORY ==========

export const getHistory = async (schoolId?: string): Promise<SubstitutionHistory[]> => {
  let query = supabase.from('substitution_history').select('*');
  
  if (schoolId) {
    const users = await getUsersBySchool(schoolId);
    const teacherIds = users.map(u => u.id);
    query = query.in('absent_teacher_id', teacherIds);
  }
  
  const { data, error } = await query.order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(dbHistory => ({
    id: dbHistory.id,
    date: dbHistory.date,
    absentTeacherId: dbHistory.absent_teacher_id,
    absentTeacherName: dbHistory.absent_teacher_name,
    reason: dbHistory.reason,
    substitutions: dbHistory.substitutions as any,
  }));
};

export const addHistory = async (history: SubstitutionHistory): Promise<void> => {
  const { error } = await supabase
    .from('substitution_history')
    .insert({
      id: history.id,
      date: history.date,
      absent_teacher_id: history.absentTeacherId,
      absent_teacher_name: history.absentTeacherName,
      reason: history.reason,
      substitutions: history.substitutions as any,
    });

  if (error) throw error;
};

export const getHistoryByDateRange = async (
  startDate: string,
  endDate: string,
  schoolId?: string
): Promise<SubstitutionHistory[]> => {
  let query = supabase
    .from('substitution_history')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);
  
  if (schoolId) {
    const users = await getUsersBySchool(schoolId);
    const teacherIds = users.map(u => u.id);
    query = query.in('absent_teacher_id', teacherIds);
  }
  
  const { data, error } = await query.order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(dbHistory => ({
    id: dbHistory.id,
    date: dbHistory.date,
    absentTeacherId: dbHistory.absent_teacher_id,
    absentTeacherName: dbHistory.absent_teacher_name,
    reason: dbHistory.reason,
    substitutions: dbHistory.substitutions as any,
  }));
};

// ========== STORAGE ==========

export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-pictures')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadLeaveDocument = async (
  file: File,
  leaveId: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `leave-${leaveId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('leave-documents')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('leave-documents')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadSchoolDocument = async (
  file: File,
  schoolId: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${schoolId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('school-documents')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('school-documents')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadTimetableExport = async (
  file: File,
  schoolId: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `timetable-${schoolId}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('timetable-exports')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('timetable-exports')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const uploadSubstitutionReport = async (
  file: File,
  date: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `report-${date}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('substitution-reports')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('substitution-reports')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const downloadFile = async (
  bucket: string,
  path: string
): Promise<Blob> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);

  if (error) throw error;
  return data;
};

export const deleteFile = async (
  bucket: string,
  path: string
): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

// ========== ANNOUNCEMENTS ==========

export const getAnnouncements = async (schoolId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const addAnnouncement = async (announcement: any): Promise<void> => {
  const { error } = await supabase
    .from('announcements')
    .insert(announcement);

  if (error) throw error;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ========== LOCAL STORAGE (for current user session) ==========

const CURRENT_USER_KEY = 'kvs_current_user';

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
