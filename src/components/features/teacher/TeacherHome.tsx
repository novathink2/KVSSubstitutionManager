import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface TeacherHomeProps {
  user: User;
}

export default function TeacherHome({ user }: TeacherHomeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Card */}
      <Card className="gradient-primary text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {user.name.toUpperCase()}!</CardTitle>
          <CardDescription className="text-white/80">
            Have a productive day at school.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-white/70 uppercase tracking-wide">DESIGNATION</p>
              <p className="text-xl font-semibold">{user.designation} {user.subject && `(${user.subject})`}</p>
            </div>
            <div className="ml-auto">
              <p className="text-sm text-white/70 uppercase tracking-wide">USERNAME</p>
              <p className="text-xl font-semibold">{user.username}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle>Today's Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You can view your substitution duties in the Profile section.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
