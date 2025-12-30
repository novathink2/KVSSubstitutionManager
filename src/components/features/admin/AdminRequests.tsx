import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRequests, updateRequest } from '@/lib/storage';
import { Request } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

export default function AdminRequests() {
  const [requests, setRequests] = useState<Request[]>(
    getRequests().filter(r => r.status === 'PENDING')
  );
  const { toast } = useToast();

  const handleApprove = (request: Request) => {
    const updated = { ...request, status: 'APPROVED' as const, respondedAt: new Date().toISOString() };
    updateRequest(updated);
    setRequests(requests.filter(r => r.id !== request.id));
    toast({
      title: 'Request Approved',
      description: `Request from ${request.teacherName} has been approved.`,
    });
  };

  const handleReject = (request: Request) => {
    const updated = { ...request, status: 'REJECTED' as const, respondedAt: new Date().toISOString() };
    updateRequest(updated);
    setRequests(requests.filter(r => r.id !== request.id));
    toast({
      title: 'Request Rejected',
      description: `Request from ${request.teacherName} has been rejected.`,
      variant: 'destructive',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" />
          <CardTitle>Teacher Requests</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{request.teacherName}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.type === 'INTERCHANGE' ? 'Class Interchange' : 'Extra Class'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{request.details}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-status-active text-white hover:bg-status-active/90"
                    onClick={() => handleApprove(request)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(request)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
