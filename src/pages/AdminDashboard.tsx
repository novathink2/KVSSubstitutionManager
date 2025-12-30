import { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import AdminCreatePlan from '@/components/features/admin/AdminCreatePlan';
import AdminHistory from '@/components/features/admin/AdminHistory';
import AdminRequests from '@/components/features/admin/AdminRequests';
import AdminAddTeacher from '@/components/features/admin/AdminAddTeacher';
import AdminBulkTimetable from '@/components/features/admin/AdminBulkTimetable';
import AdminProfile from '@/components/features/admin/AdminProfile';
import TeacherManagement from '@/components/features/admin/TeacherManagement';
import BulkTeacherImport from '@/components/features/admin/BulkTeacherImport';
import { setCurrentUser } from '@/lib/api';

interface AdminDashboardProps {
  user: User;
}

type View = 'plan' | 'history' | 'requests' | 'add-teacher' | 'bulk-timetable' | 'profile' | 'teachers' | 'bulk-import';

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<View>('plan');
  const [currentUser, setCurrentUserState] = useState<User>(user);

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUserState(updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage absences, substitutions, and view history.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={activeView === 'plan' ? 'default' : 'outline'}
            onClick={() => setActiveView('plan')}
          >
            New Plan
          </Button>
          <Button
            variant={activeView === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveView('history')}
          >
            History
          </Button>
          <Button
            variant={activeView === 'requests' ? 'default' : 'outline'}
            onClick={() => setActiveView('requests')}
          >
            Requests
          </Button>
          <Button
            variant={activeView === 'teachers' ? 'default' : 'outline'}
            onClick={() => setActiveView('teachers')}
          >
            Manage Teachers
          </Button>
          <Button
            variant={activeView === 'add-teacher' ? 'default' : 'outline'}
            onClick={() => setActiveView('add-teacher')}
          >
            Add Teacher
          </Button>
          <Button
            variant={activeView === 'bulk-import' ? 'default' : 'outline'}
            onClick={() => setActiveView('bulk-import')}
          >
            Bulk Import
          </Button>
          <Button
            variant={activeView === 'bulk-timetable' ? 'default' : 'outline'}
            onClick={() => setActiveView('bulk-timetable')}
          >
            Bulk Timetable
          </Button>
          <Button
            variant={activeView === 'profile' ? 'default' : 'outline'}
            onClick={() => setActiveView('profile')}
          >
            My Profile
          </Button>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeView === 'plan' && <AdminCreatePlan user={currentUser} />}
          {activeView === 'history' && <AdminHistory />}
          {activeView === 'requests' && <AdminRequests />}
          {activeView === 'teachers' && <TeacherManagement schoolId={currentUser.schoolId} />}
          {activeView === 'add-teacher' && <AdminAddTeacher user={currentUser} />}
          {activeView === 'bulk-import' && <BulkTeacherImport schoolId={currentUser.schoolId} />}
          {activeView === 'bulk-timetable' && <AdminBulkTimetable />}
          {activeView === 'profile' && <AdminProfile user={currentUser} onUpdate={handleUserUpdate} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 KVS AI Substitution Manager</p>
        <p className="mt-1">
          <a href="https://kvpattom2.kvs.ac.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Made by students of PM SHRI KV PATTOM-2
          </a>
        </p>
      </footer>
    </div>
  );
}
