import { User, Leave, Request, SubstitutionHistory } from '@/types';

const STORAGE_KEYS = {
  USERS: 'kvs_users',
  LEAVES: 'kvs_leaves',
  REQUESTS: 'kvs_requests',
  HISTORY: 'kvs_history',
  CURRENT_USER: 'kvs_current_user',
  SCHOOL_ID: 'kvs_school_id',
};

// Users
export const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(u => u.id === id);
};

// Current User
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// School ID
export const getSchoolId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.SCHOOL_ID);
};

export const setSchoolId = (schoolId: string): void => {
  localStorage.setItem(STORAGE_KEYS.SCHOOL_ID, schoolId);
};

// Leaves
export const getLeaves = (): Leave[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LEAVES);
  return data ? JSON.parse(data) : [];
};

export const saveLeaves = (leaves: Leave[]): void => {
  localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
};

export const addLeave = (leave: Leave): void => {
  const leaves = getLeaves();
  leaves.push(leave);
  saveLeaves(leaves);
};

export const deleteLeave = (id: string): void => {
  const leaves = getLeaves().filter(l => l.id !== id);
  saveLeaves(leaves);
};

export const getLeavesByTeacher = (teacherId: string): Leave[] => {
  return getLeaves().filter(l => l.teacherId === teacherId);
};

export const getLeavesByDate = (date: string): Leave[] => {
  return getLeaves().filter(l => l.date === date);
};

// Requests
export const getRequests = (): Request[] => {
  const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  return data ? JSON.parse(data) : [];
};

export const saveRequests = (requests: Request[]): void => {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
};

export const addRequest = (request: Request): void => {
  const requests = getRequests();
  requests.push(request);
  saveRequests(requests);
};

export const updateRequest = (updatedRequest: Request): void => {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === updatedRequest.id);
  if (index !== -1) {
    requests[index] = updatedRequest;
    saveRequests(requests);
  }
};

export const getRequestsByTeacher = (teacherId: string): Request[] => {
  return getRequests().filter(r => r.teacherId === teacherId);
};

// History
export const getHistory = (): SubstitutionHistory[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
};

export const saveHistory = (history: SubstitutionHistory[]): void => {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
};

export const addHistory = (historyItem: SubstitutionHistory): void => {
  const history = getHistory();
  history.push(historyItem);
  saveHistory(history);
};

export const getHistoryByDateRange = (startDate: string, endDate: string): SubstitutionHistory[] => {
  return getHistory().filter(h => h.date >= startDate && h.date <= endDate);
};
