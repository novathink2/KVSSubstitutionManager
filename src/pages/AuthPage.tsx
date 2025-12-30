import { useState } from 'react';
import { User } from '@/types';
import { getUserByCredentials, addUser, setCurrentUser, checkSchoolExists } from '@/lib/api';
import { generateId, generateUsername, generateEmptyTimetable } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await getUserByCredentials(loginIdentifier, password);

      if (user) {
        setCurrentUser(user);
        onAuthSuccess(user);
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name}!`,
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!schoolCode || !adminName || !adminEmail || !adminPassword) {
      toast({
        title: 'Registration Failed',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const schoolId = schoolCode.toLowerCase();
      const schoolExists = await checkSchoolExists(schoolId);
      
      if (schoolExists) {
        toast({
          title: 'School Already Registered',
          description: 'This school has already been registered. Please login.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const adminUser: User = {
        id: generateId(),
        name: adminName,
        username: generateUsername(schoolCode, '0001'),
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        designation: 'OTHER',
        employeeCode: '0001',
        employmentType: 'PERMANENT',
        schoolId,
        timetable: generateEmptyTimetable(),
      };

      await addUser(adminUser);
      setCurrentUser(adminUser);
      onAuthSuccess(adminUser);

      toast({
        title: 'Registration Successful',
        description: 'School registered successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register school. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = () => {
    // Simulated OTP (in real app, would send email)
    setOtpSent(true);
    toast({
      title: 'OTP Sent',
      description: 'Please enter OTP: 1234 (demo)',
    });
  };

  const handleResetPassword = async () => {
    if (otp !== '1234') {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the correct OTP.',
        variant: 'destructive',
      });
      return;
    }

    // Note: In production, you'd need to implement proper password reset
    toast({
      title: 'Feature Not Available',
      description: 'Password reset requires email integration. Contact admin.',
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/KVS_SVG_logo.svg/2553px-KVS_SVG_logo.svg.png" 
                alt="KVS Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">KVS AI</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">SUBSTITUTION MANAGER</p>
            </div>
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center p-1">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvjveY4wScoGhaa-5390lmWmRyT8ZR4SnpYw&s" 
                alt="PM SHRI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Admin Registration'}
              {mode === 'forgot' && 'Forgot Password'}
            </CardTitle>
            {mode === 'login' && (
              <CardDescription>
                Teachers: Use Username (e.g. kvpatm2.1234). Admin: Use Email.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === 'login' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="identifier">Username or Email</Label>
                  <Input
                    id="identifier"
                    placeholder="e.g., kvpatm2.21160 or admin@school.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && handleLogin()}
                    disabled={loading}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <div className="flex justify-between text-sm">
                  <button
                    onClick={() => setMode('register')}
                    className="text-primary hover:underline"
                    disabled={loading}
                  >
                    Admin Registration
                  </button>
                  <button
                    onClick={() => setMode('forgot')}
                    className="text-muted-foreground hover:underline"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="schoolCode">School Short Code</Label>
                  <Input
                    id="schoolCode"
                    placeholder="e.g., kvpatm2"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminName">Admin Name</Label>
                  <Input
                    id="adminName"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button onClick={handleRegister} className="w-full" disabled={loading}>
                  {loading ? 'Registering...' : 'Register School'}
                </Button>
                <button
                  onClick={() => setMode('login')}
                  className="w-full text-sm text-muted-foreground hover:underline"
                  disabled={loading}
                >
                  Back to Login
                </button>
              </>
            )}

            {mode === 'forgot' && (
              <>
                {!otpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail">Email</Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSendOTP} className="w-full">
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        placeholder="1234"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleResetPassword} className="w-full">
                      Reset Password
                    </Button>
                  </>
                )}
                <button
                  onClick={() => {
                    setMode('login');
                    setOtpSent(false);
                  }}
                  className="w-full text-sm text-muted-foreground hover:underline"
                >
                  Back to Login
                </button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
