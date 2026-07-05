import { useState, useRef, useEffect } from "react";
import PortalLayout from "@/components/layout/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useListMyMessages, useSendMessage, useGetMyProfile, getListMyMessagesQueryKey } from "@workspace/api-client-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Send, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export default function Messages() {
  const { data: messages, isLoading } = useListMyMessages();
  const { data: profile } = useGetMyProfile();
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Supabase Realtime subscription for live message updates
  useEffect(() => {
    const channel = supabase
      .channel("portal-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          // Invalidate the correct generated query key so TanStack Query refetches
          queryClient.invalidateQueries({ queryKey: getListMyMessagesQueryKey() });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleSend = () => {
    if (!content.trim()) return;

    sendMessage.mutate(
      { data: { content } },
      {
        onSuccess: () => {
          setContent("");
          // Optimistically scroll — realtime will refresh the list
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
          }, 100);
        },
      },
    );
  };

  const sortedMessages = messages
    ? [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    : [];

  return (
    <PortalLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Communicate directly with your dedicated advisor.
        </p>
      </div>

      <Card className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] shadow-sm">
        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-16 w-2/3 bg-muted rounded-2xl rounded-tl-sm ml-12" />
              <div className="h-16 w-2/3 bg-primary/20 rounded-2xl rounded-tr-sm ml-auto mr-12" />
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center flex-col gap-4 text-center">
              <div className="rounded-full bg-muted p-5">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Send your first message below — your advisor will respond shortly.
                </p>
              </div>
            </div>
          ) : (
            sortedMessages.map((msg) => {
              const isMe = msg.senderId === profile?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback
                      className={
                        isMe
                          ? "bg-primary/20 text-primary"
                          : "bg-sidebar text-sidebar-foreground"
                      }
                    >
                      {msg.senderName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground/70">
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(msg.createdAt), "h:mm a")}
                      </span>
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t bg-card mt-auto">
          <div className="flex gap-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              className="resize-none min-h-[60px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              className="shrink-0 h-auto"
              onClick={handleSend}
              disabled={!content.trim() || sendMessage.isPending}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </PortalLayout>
  );
}
