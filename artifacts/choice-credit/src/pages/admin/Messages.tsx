import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useListAdminMessages } from "@workspace/api-client-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Link } from "wouter";
import { MessageSquare, ChevronRight } from "lucide-react";

export default function Messages() {
  const { data: messages, isLoading } = useListAdminMessages();

  // Group messages by client for a high-level view
  const threads = messages?.reduce((acc: any, msg) => {
    if (!msg.clientId) return acc;
    if (!acc[msg.clientId]) {
      acc[msg.clientId] = {
        clientId: msg.clientId,
        clientName: msg.senderRole === 'client' ? msg.senderName : 'Client',
        lastMessage: msg,
        unreadCount: 0
      };
    } else {
      if (new Date(msg.createdAt) > new Date(acc[msg.clientId].lastMessage.createdAt)) {
        acc[msg.clientId].lastMessage = msg;
      }
    }
    // Count unread if from client
    if (msg.senderRole === 'client' && !msg.readAt) {
      acc[msg.clientId].unreadCount++;
    }
    // Try to get real client name if possible
    if (msg.senderRole === 'client' && acc[msg.clientId].clientName === 'Client') {
      acc[msg.clientId].clientName = msg.senderName;
    }
    return acc;
  }, {});

  const threadList = Object.values(threads || {}).sort((a: any, b: any) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Global Inbox</h1>
        <p className="text-muted-foreground mt-2">All client communications.</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y">
            {isLoading ? (
              [1,2,3,4].map(i => (
                <div key={i} className="p-4 sm:p-6 flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))
            ) : threadList.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                No messages found.
              </div>
            ) : (
              threadList.map((thread: any) => (
                <Link key={thread.clientId} href={`/admin/clients/${thread.clientId}`}>
                  <div className="p-4 sm:p-6 flex items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <Avatar className="w-12 h-12 shrink-0 border border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {thread.clientName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold truncate ${thread.unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'}`}>
                          {thread.clientName}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {format(new Date(thread.lastMessage.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-4">
                        <p className={`text-sm truncate ${thread.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {thread.lastMessage.senderRole === 'admin' ? 'You: ' : ''}
                          {thread.lastMessage.content}
                        </p>
                        
                        {thread.unreadCount > 0 && (
                          <div className="bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0">
                            {thread.unreadCount}
                          </div>
                        )}
                        {thread.unreadCount === 0 && (
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
