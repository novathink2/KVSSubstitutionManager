import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUsers, saveUsers } from '@/lib/storage';
import { parseTimetableCSV, downloadCSV } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload } from 'lucide-react';

export default function AdminBulkTimetable() {
  const { toast } = useToast();

  const handleDownload = () => {
    const teachers = getUsers().filter(u => u.role === 'TEACHER');
    
    const headers = ['EmployeeCode', 'Name'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const day of days) {
      for (let i = 1; i <= 8; i++) {
        headers.push(`${day}_${i}`);
      }
    }

    const rows = [headers.join(',')];
    
    for (const teacher of teachers) {
      const row = [teacher.employeeCode, `"${teacher.name}"`];
      for (const day of teacher.timetable) {
        for (const period of day) {
          const cell = period.includes(',') || period.includes('"') 
            ? `"${period.replace(/"/g, '""')}"` 
            : period;
          row.push(cell || '');
        }
      }
      rows.push(row.join(','));
    }

    downloadCSV(rows.join('\n'), 'master_timetable.csv');
    toast({
      title: 'CSV Downloaded',
      description: 'Master timetable downloaded successfully.',
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = parseTimetableCSV(csv);
        
        if (lines.length < 2) {
          throw new Error('CSV must contain header and at least one teacher row');
        }

        const teachers = getUsers();
        let updatedCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i];
          if (cells.length < 50) continue; // 2 + 48 periods

          const employeeCode = cells[0];
          const teacher = teachers.find(t => t.employeeCode === employeeCode);
          
          if (teacher) {
            const timetable: string[][] = [];
            for (let d = 0; d < 6; d++) {
              const day: string[] = [];
              for (let p = 0; p < 8; p++) {
                const cellIndex = 2 + (d * 8) + p;
                day.push(cells[cellIndex] || '');
              }
              timetable.push(day);
            }
            teacher.timetable = timetable;
            updatedCount++;
          }
        }

        saveUsers(teachers);
        
        toast({
          title: 'CSV Uploaded',
          description: `Updated timetables for ${updatedCount} teachers.`,
        });
      } catch (error) {
        toast({
          title: 'Upload Failed',
          description: 'Failed to parse CSV file. Please check the format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Master Timetable Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-2xl space-y-6">
          <p className="text-muted-foreground">
            Download the timetable for all teachers, edit it in Excel/Sheets, and re-upload to update everyone at once.
          </p>

          <div className="flex gap-4">
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Master CSV
            </Button>
            <label>
              <Button variant="default" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Master CSV
                </span>
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-semibold text-sm">CSV Format Instructions:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Do not change the <strong>EmployeeCode</strong> or <strong>Name</strong> columns.</li>
              <li>Each following column represents a Period (e.g., Mon_1, Mon_2...)</li>
              <li>Enter the Class Name (e.g., 10A, 12B Physical) in the cells. Leave empty for free periods.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
