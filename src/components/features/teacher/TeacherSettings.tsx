import { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUser, getCurrentUser, setCurrentUser } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

interface TeacherSettingsProps {
  user: User;
}

export default function TeacherSettings({ user }: TeacherSettingsProps) {
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  const handleUpdatePassword = () => {
    if (!newPassword.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a new password.',
        variant: 'destructive',
      });
      return;
    }

    const updatedUser = { ...user, password: newPassword };
    updateUser(updatedUser);
    setCurrentUser(updatedUser);
    setNewPassword('');

    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <CardTitle>Account Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Change Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
