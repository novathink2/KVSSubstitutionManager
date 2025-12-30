import { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateUser, setCurrentUser } from '@/lib/api';
import { timetableToCSV, parseTimetableCSV, downloadCSV, generateEmptyTimetable } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Download, Upload } from 'lucide-react';

interface TeacherTimetableProps {
  user: User;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH'];

export default function TeacherTimetable({ user }: TeacherTimetableProps) {
  // Initialize timetable with safety check
  const [timetable, setTimetable] = useState<string[][]>(() => {
    if (!user.timetable || !Array.isArray(user.timetable) || user.timetable.length === 0) {
      return generateEmptyTimetable();
    }
    return user.timetable;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = { ...user, timetable };
      await updateUser(updatedUser);
      setCurrentUser(updatedUser);
      setIsEditing(false);
      toast({
        title: 'Timetable Saved',
        description: 'Your timetable has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save timetable.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadCSV = () => {
    const csv = timetableToCSV(timetable);
    downloadCSV(csv, `${user.username}_timetable.csv`);
    toast({
      title: 'CSV Downloaded',
      description: 'Timetable downloaded successfully.',
    });
  };

  const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const parsed = parseTimetableCSV(csv);
        
        if (parsed.length === 6 && parsed.every(row => row.length === 8)) {
          setTimetable(parsed);
          toast({
            title: 'CSV Uploaded',
            description: 'Timetable loaded successfully.',
          });
        } else {
          toast({
            title: 'Invalid CSV',
            description: 'CSV must have 6 rows and 8 columns.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: 'Failed to parse CSV file.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCellChange = (dayIndex: number, periodIndex: number, value: string) => {
    const newTimetable = [...timetable];
    newTimetable[dayIndex][periodIndex] = value;
    setTimetable(newTimetable);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <CardTitle>My Timetable</CardTitle>
              </div>
              <CardDescription>Manage your weekly schedule below.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCSV}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <label>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleUploadCSV}
                  className="hidden"
                />
              </label>
              <Button
                variant={isEditing ? 'default' : 'outline'}
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={saving}
              >
                {saving ? 'Saving...' : isEditing ? 'Save Timetable' : 'Edit Timetable'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border bg-muted p-3 text-left font-semibold text-sm">
                      DAY
                    </th>
                    {PERIODS.map((period) => (
                      <th
                        key={period}
                        className="border border-border bg-muted p-3 text-center font-semibold text-sm min-w-[120px]"
                      >
                        {period}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day, dayIndex) => (
                    <tr key={day}>
                      <td className="border border-border bg-muted p-3 font-semibold text-sm text-primary">
                        {day}
                      </td>
                      {PERIODS.map((_, periodIndex) => (
                        <td key={periodIndex} className="border border-border p-1">
                          {isEditing ? (
                            <Input
                              value={timetable[dayIndex][periodIndex]}
                              onChange={(e) => handleCellChange(dayIndex, periodIndex, e.target.value)}
                              className="w-full min-w-[100px] text-sm"
                              placeholder="-"
                            />
                          ) : (
                            <div className="p-2 text-sm text-center">
                              {timetable[dayIndex][periodIndex] || '-'}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
