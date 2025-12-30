import { useEffect, useState } from 'react';
import { User } from '@/types';
import { getCurrentUser } from '@/lib/storage';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import TeacherDashboard from '@/pages/TeacherDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import Navbar from '@/components/layout/Navbar';
import ChatBot from '@/components/features/ChatBot';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAuth(false);
  };

  if (!currentUser && !showAuth) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!currentUser && showAuth) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser!} onLogout={handleLogout} />
      {currentUser!.role === 'TEACHER' ? (
        <TeacherDashboard user={currentUser!} />
      ) : (
        <AdminDashboard user={currentUser!} />
      )}
      <ChatBot />
    </div>
  );
}

export default App;
