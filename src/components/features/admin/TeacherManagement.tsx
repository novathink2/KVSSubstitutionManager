
import { useState, useEffect } from 'react';
import { User, Leave } from '@/types';
import { getUsersBySchool, getLeavesByTeacher } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, Trash2, Eye, X } from 'lucide-react';
import { getInitials, formatDate, generateEmptyTimetable } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TeacherManagementProps {
  schoolId: string;
}

export default function TeacherManagement({ schoolId }: TeacherManagementProps) {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [teacherLeaves, setTeacherLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTeachers();
  }, [schoolId]);

  useEffect(() => {
    if (selectedTeacher) {
      loadTeacherLeaves(selectedTeacher.id);
    }
  }, [selectedTeacher]);

  const loadTeachers = async () => {
    try {
      const data = await getUsersBySchool(schoolId);
      const teachers = data.filter(u => u.role === 'TEACHER').map(teacher => ({
        ...teacher,
        timetable: Array.isArray(teacher.timetable) && teacher.timetable.length === 6 
          ? teacher.timetable 
          : generateEmptyTimetable()
      }));
      setTeachers(teachers);
    } catch (error) {
      console.error('Failed to load teachers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teachers.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTeacherLeaves = async (teacherId: string) => {
    try {
      const leaves = await getLeavesByTeacher(teacherId);
      setTeacherLeaves(leaves);
    } catch (error) {
      console.error('Failed to load leaves:', error);
    }
  };

  const handleDeleteTeacher = async (teacher: User) => {
    if (!confirm(`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', teacher.id);

      if (error) throw error;

      toast({
        title: 'Teacher Deleted',
        description: `${teacher.name} has been removed from the system.`,
      });
      loadTeachers();
      if (selectedTeacher?.id === teacher.id) {
        setSelectedTeacher(null);
      }
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete teacher. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare absence chart data
  const absenceData = teacherLeaves.reduce((acc, leave) => {
    const month = new Date(leave.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, [] as { month: string; count: number }[]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left: Teacher List */}
      <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">All Teachers ({filteredTeachers.length})</h3>
            </div>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, username, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredTeachers.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-8">
                No teachers found.
              </p>
            ) : (
              filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className={`p-4 border border-border rounded-lg transition-all ${
                    selectedTeacher?.id === teacher.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {teacher.profilePicture ? (
                        <img
                          src={teacher.profilePicture}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                          {getInitials(teacher.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{teacher.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {teacher.designation} {teacher.subject && `• ${teacher.subject}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{teacher.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
                        onClick={() => setSelectedTeacher(teacher)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                        onClick={() => handleDeleteTeacher(teacher)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right: Teacher Details */}
      <div className="space-y-6">
        {!selectedTeacher ? (
          <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
            <div className="py-16 text-center p-6">
              <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Select a teacher to view their details
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Teacher Profile */}
            <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Teacher Profile</h3>
                  <button
                    className="px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setSelectedTeacher(null)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    {selectedTeacher.profilePicture ? (
                      <img
                        src={selectedTeacher.profilePicture}
                        alt={selectedTeacher.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold">
                        {getInitials(selectedTeacher.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{selectedTeacher.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedTeacher.designation} {selectedTeacher.subject && `• ${selectedTeacher.subject}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Username</p>
                      <p className="font-medium">{selectedTeacher.username}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedTeacher.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedTeacher.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Employee Code</p>
                      <p className="font-medium">{selectedTeacher.employeeCode}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Employment Type</p>
                      <p className="font-medium">{selectedTeacher.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">
                        {selectedTeacher.dateOfBirth ? formatDate(selectedTeacher.dateOfBirth) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Joined KV</p>
                      <p className="font-medium">
                        {selectedTeacher.dateOfJoiningKV ? formatDate(selectedTeacher.dateOfJoiningKV) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Post</p>
                      <p className="font-medium">
                        {selectedTeacher.dateOfJoiningPresentPost ? formatDate(selectedTeacher.dateOfJoiningPresentPost) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable */}
            <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Timetable</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left font-semibold">Day</th>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                          <th key={p} className="p-2 text-center font-semibold">P{p}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
                        <tr key={day} className="border-b">
                          <td className="p-2 font-semibold">{day}</td>
                          {(selectedTeacher.timetable[dayIndex] || Array(8).fill('')).map((cell, periodIndex) => (
                            <td key={periodIndex} className="p-2 text-center">
                              <div className={`p-1 rounded text-xs ${cell ? 'bg-primary/10' : 'bg-muted/50'}`}>
                                {cell || '-'}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Absence History */}
            <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Absence History</h3>
                {teacherLeaves.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-8">
                    No leave records found.
                  </p>
                ) : (
                  <>
                    {absenceData.length > 0 && (
                      <div className="mb-6">
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={absenceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="hsl(var(--primary))" name="Absences" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {teacherLeaves.map((leave) => (
                        <div key={leave.id} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-semibold text-sm">{formatDate(leave.date)}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              leave.type === 'FULL' ? 'bg-destructive/10 text-destructive' : 'bg-yellow-500/10 text-yellow-600'
                            }`}>
                              {leave.type === 'FULL' ? 'Full Day' : 'Partial'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{leave.reason}</p>
                          {leave.type === 'PARTIAL' && leave.startTime && leave.endTime && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {leave.startTime} - {leave.endTime}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
