import { useState, useEffect } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUser, uploadProfilePicture } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Edit2, Save, X, Upload } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface AdminProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export default function AdminProfile({ user, onUpdate }: AdminProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser(editedUser);
      onUpdate(editedUser);
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image must be less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadProfilePicture(file, user.id);
      const updated = { ...editedUser, profilePicture: url };
      setEditedUser(updated);
      await updateUser(updated);
      onUpdate(updated);
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload profile picture. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="gradient-primary text-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {editedUser.profilePicture ? (
                <img
                  src={editedUser.profilePicture}
                  alt={editedUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                  {getInitials(editedUser.name)}
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{editedUser.name}</h2>
              <p className="text-white/90 mb-2">Administrator</p>
              <div className="flex gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded">
                  <strong>Username:</strong> {editedUser.username}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded">
                  <strong>School:</strong> {editedUser.schoolId.toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              {!isEditing ? (
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleSave}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Card */}
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editedUser.email || ''}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editedUser.phone || ''}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCode">Employee Code</Label>
              <Input
                id="employeeCode"
                value={editedUser.employeeCode}
                disabled
                className="bg-muted"
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
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Change Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                disabled={!isEditing}
              />
            </div>
            {isEditing && (
              <p className="text-sm text-muted-foreground">
                Leave blank to keep current password
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
