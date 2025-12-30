import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getHistory } from '@/lib/storage';
import { formatDate } from '@/lib/utils';
import { History } from 'lucide-react';

export default function AdminHistory() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const history = getHistory();

  const filteredHistory = history.filter(h => {
    if (!startDate && !endDate) return true;
    if (startDate && h.date < startDate) return false;
    if (endDate && h.date > endDate) return false;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <CardTitle>Substitution History</CardTitle>
          </div>
          <div className="flex gap-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
            <span className="flex items-center">-</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredHistory.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No history found.</p>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-sm">DATE</th>
                    <th className="text-left p-3 font-semibold text-sm">ABSENT TEACHER</th>
                    <th className="text-left p-3 font-semibold text-sm">REASON / NOTE</th>
                    <th className="text-left p-3 font-semibold text-sm">SUBSTITUTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                      <td className="p-3 text-sm">{formatDate(item.date)}</td>
                      <td className="p-3 text-sm font-medium">{item.absentTeacherName}</td>
                      <td className="p-3 text-sm text-muted-foreground">{item.reason}</td>
                      <td className="p-3 text-sm">
                        <div className="space-y-1">
                          {item.substitutions.slice(0, 2).map((sub, idx) => (
                            <p key={idx} className="text-xs">
                              P{sub.period}: {sub.substituteTeacherName}
                            </p>
                          ))}
                          {item.substitutions.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{item.substitutions.length - 2} more
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
