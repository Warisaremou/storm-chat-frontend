import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReceivedInvitations } from '@/features/invitations/components/ReceivedInvitations';
import { SentInvitations } from '@/features/invitations/components/SentInvitations';
import { Inbox, Send, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui.store';

export default function InvitationsPage() {
  const openModal = useUIStore((s) => s.openModal);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif tracking-tight text-foreground">Invitations</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your chat requests and connect with others.
            </p>
          </div>
          <Button onClick={() => openModal('userSearch')} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Find People
          </Button>
        </header>

        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 bg-muted/30">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Received
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="received"
            className="mt-0 ring-offset-background focus-visible:outline-none"
          >
            <ReceivedInvitations />
          </TabsContent>

          <TabsContent
            value="sent"
            className="mt-0 ring-offset-background focus-visible:outline-none"
          >
            <SentInvitations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
