import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

const NEWS_ITEMS = [
  {
    id: 1,
    title: 'Important Notice Regarding Exams 1',
    date: 'Oct 11, 2024',
    category: 'Announcement',
    description: 'This is a placeholder for school news. The content here would typically come from an admin announcement system. Teachers are requested to submit question papers by the end of the week.',
  },
  {
    id: 2,
    title: 'Important Notice Regarding Exams 2',
    date: 'Oct 12, 2024',
    category: 'Announcement',
    description: 'This is a placeholder for school news. The content here would typically come from an admin announcement system. Teachers are requested to submit question papers by the end of the week.',
  },
  {
    id: 3,
    title: 'Important Notice Regarding Exams 3',
    date: 'Oct 13, 2024',
    category: 'Announcement',
    description: 'This is a placeholder for school news. The content here would typically come from an admin announcement system. Teachers are requested to submit question papers by the end of the week.',
  },
];

export default function TeacherNews() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">School News & Announcements</h2>
      </div>

      <div className="space-y-4">
        {NEWS_ITEMS.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                      {item.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
