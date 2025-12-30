import { useState } from 'react';
import { User } from '@/types';
import { Home, FileText, Send, UserCircle, Calendar, Newspaper, Settings } from 'lucide-react';
import TeacherHome from '@/components/features/teacher/TeacherHome';
import TeacherLeaves from '@/components/features/teacher/TeacherLeaves';
import TeacherRequests from '@/components/features/teacher/TeacherRequests';
import TeacherProfile from '@/components/features/teacher/TeacherProfile';
import TeacherTimetable from '@/components/features/teacher/TeacherTimetable';
import TeacherNews from '@/components/features/teacher/TeacherNews';
import TeacherSettings from '@/components/features/teacher/TeacherSettings';

interface TeacherDashboardProps {
  user: User;
}

type Tab = 'home' | 'leaves' | 'requests' | 'profile' | 'timetable' | 'news' | 'settings';

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'leaves' as Tab, label: 'Leaves', icon: FileText },
    { id: 'requests' as Tab, label: 'Requests', icon: Send },
    { id: 'profile' as Tab, label: 'Profile', icon: UserCircle },
    { id: 'timetable' as Tab, label: 'Timetable', icon: Calendar },
    { id: 'news' as Tab, label: 'News', icon: Newspaper },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            MENU
          </h2>
        </div>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={isActive ? 'sidebar-link-active w-full' : 'sidebar-link w-full'}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-muted/30">
        {activeTab === 'home' && <TeacherHome user={user} />}
        {activeTab === 'leaves' && <TeacherLeaves user={user} />}
        {activeTab === 'requests' && <TeacherRequests user={user} />}
        {activeTab === 'profile' && <TeacherProfile user={user} />}
        {activeTab === 'timetable' && <TeacherTimetable user={user} />}
        {activeTab === 'news' && <TeacherNews />}
        {activeTab === 'settings' && <TeacherSettings user={user} />}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-4 text-center text-sm text-muted-foreground">
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
