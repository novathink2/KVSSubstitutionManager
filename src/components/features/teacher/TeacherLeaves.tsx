import { useState, useEffect } from 'react';
import { User, Leave, LeaveType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { addLeave, deleteLeave, getLeavesByTeacher } from '@/lib/api';
import { generateId, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { FileText, Trash2 } from 'lucide-react';

interface TeacherLeavesProps {
  user: User;
}

export default function TeacherLeaves({ user }: TeacherLeavesProps) {
  const [date, setDate] = useState('');
  const [type, setType] = useState<LeaveType>('FULL_DAY');
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLeaves();
  }, [user.id]);

  const loadLeaves = async () => {
    try {
      const data = await getLeavesByTeacher(user.id);
      setLeaves(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load leaves.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    if (!date || !reason.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const leave: Leave = {
        id: generateId(),
        teacherId: user.id,
        teacherName: user.name,
        date,
        type,
        reason: reason.trim(),
        createdAt: new Date().toISOString(),
      };

      await addLeave(leave);
      await loadLeaves();
      setDate('');
      setReason('');
      setType('FULL_DAY');

      toast({
        title: 'Leave Submitted',
        description: 'Your leave application has been submitted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit leave.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLeave(id);
      await loadLeaves();
      toast({
        title: 'Leave Deleted',
        description: 'Your leave application has been deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete leave.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Apply Leave */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle>Apply / Mark Leave</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup value={type} onValueChange={(value) => setType(value as LeaveType)} disabled={loading}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FULL_DAY" id="full" />
                <Label htmlFor="full" className="cursor-pointer">Full Day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PARTIAL_DAY" id="partial" />
                <Label htmlFor="partial" className="cursor-pointer">Partial / Half Day</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Sick Leave, Personal Appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Leave'}
          </Button>
        </CardContent>
      </Card>

      {/* Leave History */}
      <Card>
        <CardHeader>
          <CardTitle>My Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <p className="text-muted-foreground italic">No leave records found.</p>
          ) : (
            <div className="space-y-3">
              {leaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{formatDate(leave.date)}</p>
                      <p className="text-sm text-muted-foreground">
                        {leave.type === 'FULL_DAY' ? 'Full Day' : 'Partial / Half Day'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(leave.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{leave.reason}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
