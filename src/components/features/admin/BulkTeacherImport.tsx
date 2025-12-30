import { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateId, generateUsername, parseTimetableCSV, downloadCSV, generateContractualEmployeeCode } from '@/lib/utils';

interface BulkTeacherImportProps {
  schoolId: string;
}

export default function BulkTeacherImport({ schoolId }: BulkTeacherImportProps) {
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleDownloadTemplate = () => {
    const template = `name,employee_code,designation,subject,employment_type,email,phone,date_of_birth,date_of_joining_kv,date_of_joining_present_post
PADMAJA M G,21160,PGT,Physics,PERMANENT,padmaja@example.com,9999999999,1985-01-01,2017-09-25,1993-12-14
RAJESH KUMAR,,TGT,English,CONTRACTUAL,rajesh@example.com,9999999999,1990-05-15,2024-01-10,2024-01-10
PRIYA SHARMA,,OTHER,Yoga,CONTRACTUAL,priya@example.com,8888888888,1992-03-20,2024-02-15,2024-02-15`;

    downloadCSV(template, 'teacher_import_template.csv');
    toast({
      title: 'Template Downloaded',
      description: 'Fill in the template and upload it back to import teachers.',
    });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a CSV file.',
        variant: 'destructive',
      });
      return;
    }

    setImporting(true);

    try {
      const text = await file.text();
      const rows = parseTimetableCSV(text);
      
      // Skip header row
      const dataRows = rows.slice(1);
      
      if (dataRows.length === 0) {
        toast({
          title: 'Empty File',
          description: 'The CSV file contains no data.',
          variant: 'destructive',
        });
        return;
      }

      const teachersToImport: any[] = [];

      for (const row of dataRows) {
        if (row.length < 10) continue; // Skip invalid rows

        const [
          name,
          employeeCode,
          designation,
          subject,
          employmentType,
          email,
          phone,
          dateOfBirth,
          dateOfJoiningKV,
          dateOfJoiningPresentPost,
        ] = row;

        if (!name || !designation) continue;

        // Auto-generate employee code for contractual teachers if empty
        let finalEmployeeCode = employeeCode?.trim() || '';
        if (!finalEmployeeCode && employmentType?.trim() === 'CONTRACTUAL') {
          finalEmployeeCode = generateContractualEmployeeCode();
        } else if (!finalEmployeeCode) {
          console.warn(`Skipping ${name}: Missing employee code for permanent teacher`);
          continue; // Skip permanent teachers without employee code
        }

        const username = generateUsername(schoolId, finalEmployeeCode);

        teachersToImport.push({
          name: name.trim(),
          username,
          email: email?.trim() || `${username}@${schoolId}.kvs.ac.in`,
          password: `Pass@${finalEmployeeCode}`,
          role: 'TEACHER',
          designation: designation.trim(),
          subject: subject?.trim() || null,
          employee_code: finalEmployeeCode,
          employment_type: employmentType?.trim() || 'PERMANENT',
          date_of_birth: dateOfBirth?.trim() || null,
          date_of_joining_kv: dateOfJoiningKV?.trim() || null,
          date_of_joining_present_post: dateOfJoiningPresentPost?.trim() || null,
          phone: phone?.trim() || null,
          school_id: schoolId,
          timetable: Array(6).fill(null).map(() => Array(8).fill('')),
        });
      }

      if (teachersToImport.length === 0) {
        toast({
          title: 'No Valid Data',
          description: 'No valid teacher records found in the file.',
          variant: 'destructive',
        });
        return;
      }

      // Insert in batches
      const { error } = await supabase
        .from('users')
        .insert(teachersToImport);

      if (error) throw error;

      toast({
        title: 'Import Successful',
        description: `Successfully imported ${teachersToImport.length} teachers.`,
      });

      // Reset file input
      e.target.value = '';
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error.message || 'Failed to import teachers. Please check the file format.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <CardTitle>Bulk Teacher Import</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-primary">CSV Format Instructions:</h4>
          <ul className="text-sm text-primary space-y-1 list-disc list-inside">
            <li>Download the template and fill in teacher details</li>
            <li>Required fields: name, designation</li>
            <li><strong>Employee Code:</strong> Required for PERMANENT, leave empty for CONTRACTUAL (auto-generated)</li>
            <li>Designation must be one of: PGT, TGT, PRT, OTHER</li>
            <li>Employment type: PERMANENT or CONTRACTUAL</li>
            <li>Usernames will be auto-generated as: {schoolId}.[employee_code]</li>
            <li>Default passwords: Pass@[employee_code]</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleDownloadTemplate}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>

          <label className="flex-1">
            <Button
              variant="default"
              className="w-full gap-2"
              disabled={importing}
              asChild
            >
              <span>
                <Upload className="w-4 h-4" />
                {importing ? 'Importing...' : 'Upload CSV'}
              </span>
            </Button>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
              disabled={importing}
            />
          </label>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Example Rows:</strong></p>
          <div className="space-y-1">
            <p className="text-xs font-semibold">Permanent Teacher (with employee code):</p>
            <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
              PADMAJA M G,21160,PGT,Physics,PERMANENT,padmaja@example.com,9999999999,1985-01-01,2017-09-25,1993-12-14
            </code>
            <p className="text-xs font-semibold mt-2">Contractual Teacher (leave employee_code empty):</p>
            <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
              RAJESH KUMAR,,TGT,English,CONTRACTUAL,rajesh@example.com,9999999999,1990-05-15,2024-01-10,2024-01-10
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
