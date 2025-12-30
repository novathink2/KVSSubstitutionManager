import { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUser, getCurrentUser, setCurrentUser } from '@/lib/storage';
import { getInitials } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Edit } from 'lucide-react';

interface TeacherProfileProps {
  user: User;
}

export default function TeacherProfile({ user }: TeacherProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const { toast } = useToast();

  const handleSave = () => {
    updateUser(editedUser);
    setCurrentUser(editedUser);
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
    window.location.reload(); // Refresh to show updated data
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-0">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold">
              {getInitials(user.name)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground">{editedUser.name.toUpperCase()}</h2>
              <p className="text-lg text-primary font-semibold">
                {editedUser.designation} {editedUser.subject && `(${editedUser.subject})`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {editedUser.username} • {editedUser.employmentType} STAFF
              </p>
            </div>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedUser.email || 'N/A'}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editedUser.phone || 'N/A'}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeCode">Employee Code</Label>
              <Input
                id="employeeCode"
                value={editedUser.employeeCode}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolId">School ID</Label>
              <Input
                id="schoolId"
                value={editedUser.schoolId}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={editedUser.dateOfBirth || ''}
                onChange={(e) => setEditedUser({ ...editedUser, dateOfBirth: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfJoiningKV">Date of Joining KV</Label>
              <Input
                id="dateOfJoiningKV"
                type="date"
                value={editedUser.dateOfJoiningKV || ''}
                onChange={(e) => setEditedUser({ ...editedUser, dateOfJoiningKV: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfJoiningPresentPost">Date of Joining Present Post</Label>
              <Input
                id="dateOfJoiningPresentPost"
                type="date"
                value={editedUser.dateOfJoiningPresentPost || ''}
                onChange={(e) => setEditedUser({ ...editedUser, dateOfJoiningPresentPost: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Substitution Duties */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Substitution Duties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">No substitution duties assigned for today.</p>
        </CardContent>
      </Card>
    </div>
  );
}
