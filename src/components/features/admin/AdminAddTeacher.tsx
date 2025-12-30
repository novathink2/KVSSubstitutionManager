import { useState } from 'react';
import { User, Designation, EmploymentType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { generateId, generateUsername, generateEmptyTimetable, generateContractualEmployeeCode } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';

interface AdminAddTeacherProps {
  user: User;
}

const SUBJECTS = {
  PGT: [
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'English',
    'Hindi',
    'Commerce',
    'Economics',
    'Computer Science',
    'Accountancy',
    'Business Studies',
    'Political Science',
    'History',
    'Geography',
    'Civics',
    'Music',
  ],
  TGT: [
    'English',
    'Hindi',
    'Mathematics',
    'Science',
    'Biology',
    'Social Science',
    'History',
    'Geography',
    'Civics',
    'Sanskrit',
    'Urdu',
    'Punjabi',
    'Bengali',
    'Work Education',
  ],
  PRT: ['General'],
  OTHER: [
    'Physical Education',
    'Art Education',
    'Music',
    'Dance',
    'Yoga',
    'Librarian',
    'Counselor',
    'Work Education',
  ],
};

export default function AdminAddTeacher({ user }: AdminAddTeacherProps) {
  const [name, setName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('PERMANENT');
  const [designation, setDesignation] = useState<Designation>('PGT');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfJoiningKV, setDateOfJoiningKV] = useState('');
  const [dateOfJoiningPresentPost, setDateOfJoiningPresentPost] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!name) {
      toast({
        title: 'Validation Error',
        description: 'Please enter teacher name.',
        variant: 'destructive',
      });
      return;
    }

    // Auto-generate employee code for contractual teachers if empty
    let finalEmployeeCode = employeeCode.trim();
    if (!finalEmployeeCode && employmentType === 'CONTRACTUAL') {
      finalEmployeeCode = generateContractualEmployeeCode();
    } else if (!finalEmployeeCode) {
      toast({
        title: 'Validation Error',
        description: 'Please enter employee code for permanent teachers.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const username = generateUsername(user.schoolId, finalEmployeeCode);
      
      const { error } = await supabase
        .from('users')
        .insert({
          name,
          username,
          email: email || `${username}@${user.schoolId}.kvs.ac.in`,
          password: `Pass@${finalEmployeeCode}`,
          role: 'TEACHER',
          designation,
          subject: subject || null,
          employee_code: finalEmployeeCode,
          employment_type: employmentType,
          date_of_birth: dateOfBirth || null,
          date_of_joining_kv: dateOfJoiningKV || null,
          date_of_joining_present_post: dateOfJoiningPresentPost || null,
          phone: phone || null,
          school_id: user.schoolId,
          timetable: generateEmptyTimetable(),
        });

      if (error) throw error;

      // Reset form
      setName('');
      setEmployeeCode('');
      setSubject('');
      setEmail('');
      setPhone('');
      setDateOfBirth('');
      setDateOfJoiningKV('');
      setDateOfJoiningPresentPost('');

      toast({
        title: 'Teacher Registered',
        description: `${name} has been registered successfully. Username: ${username}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to register teacher. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          <CardTitle>Add New Teacher</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-w-2xl space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
            <p className="text-sm text-primary">
              <strong>Note:</strong> Username will be auto-generated as {user.schoolId}.[EmployeeCode]
            </p>
            <p className="text-sm text-primary">
              <strong>Contractual Teachers:</strong> Leave employee code empty - it will be auto-generated (Format: C + 8 digits)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCode">
                Employee Code {employmentType === 'PERMANENT' ? '*' : '(Auto-generated if empty)'}
              </Label>
              <Input
                id="employeeCode"
                placeholder={employmentType === 'CONTRACTUAL' ? 'Leave empty for auto-generation' : 'e.g., 21160'}
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                disabled={loading}
              />
              {employmentType === 'CONTRACTUAL' && !employeeCode && (
                <p className="text-xs text-muted-foreground">Auto-generated format: C24015123</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation Type *</Label>
              <Select 
                value={designation} 
                onValueChange={(value) => {
                  setDesignation(value as Designation);
                  setSubject(''); // Reset subject when designation changes
                }}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PGT">PGT (Post Graduate Teacher)</SelectItem>
                  <SelectItem value="TGT">TGT (Trained Graduate Teacher)</SelectItem>
                  <SelectItem value="PRT">PRT (Primary Teacher)</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select 
                value={subject} 
                onValueChange={setSubject}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS[designation].map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select 
                value={employmentType} 
                onValueChange={(value) => setEmploymentType(value as EmploymentType)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERMANENT">Permanent</SelectItem>
                  <SelectItem value="CONTRACTUAL">Contractual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Optional (auto-generated if empty)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfJoiningKV">Date of Joining KV</Label>
              <Input
                id="dateOfJoiningKV"
                type="date"
                value={dateOfJoiningKV}
                onChange={(e) => setDateOfJoiningKV(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfJoiningPresentPost">Date of Joining Present Post</Label>
              <Input
                id="dateOfJoiningPresentPost"
                type="date"
                value={dateOfJoiningPresentPost}
                onChange={(e) => setDateOfJoiningPresentPost(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <Button onClick={handleRegister} className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register Teacher'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
