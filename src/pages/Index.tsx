import React, { useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Preview } from '@/components/Preview';
import { useToast } from '@/components/ui/use-toast';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, History, GitBranch, GitCommit } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import BuildInfoCard from '@/components/BuildInfoCard';

const Index = () => {
  const [code, setCode] = useState('// Your generated code will appear here');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock repository history data
  const repoHistory = [
    { type: 'commit', message: 'Add new features', timestamp: '2 hours ago' },
    { type: 'branch', name: 'feature/chat', timestamp: '3 hours ago' },
    { type: 'commit', message: 'Initial setup', timestamp: '1 day ago' }
  ];

  // Mock chat messages
  const chatMessages = [
    { sender: 'AI', message: 'How can I help you today?', timestamp: '2m ago' },
    { sender: 'User', message: 'Can you explain this code?', timestamp: '1m ago' }
  ];

  const renderRepoHistory = () => (
    <div className="space-y-2">
      {repoHistory.map((item, index) => (
        <div key={index} className="flex items-center gap-2 p-2 hover:bg-accent/10 rounded">
          {item.type === 'commit' ? (
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          ) : (
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm flex-1">{item.type === 'commit' ? item.message : item.name}</span>
          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
        </div>
      ))}
    </div>
  );

  const renderChat = () => (
    <div className="space-y-2">
      {chatMessages.map((msg, index) => (
        <div key={index} className={`flex gap-2 p-2 rounded ${msg.sender === 'AI' ? 'bg-accent/10' : ''}`}>
          <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{msg.sender}</span>
              <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
            </div>
            <p className="text-sm">{msg.message}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen flex">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={70} minSize={30}>
              <main className="p-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
                  AI Code Generator
                </h1>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={50}>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">Generated Code</h2>
                      <CodeEditor code={code} onChange={setCode} />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50}>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">Preview</h2>
                      <Preview content={code} />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </main>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="h-full flex flex-col">
                <div className="flex-1 border rounded-lg border-border mb-4">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <h2 className="text-sm font-semibold">Repository History</h2>
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(33vh-100px)]">
                    <div className="p-2">
                      {renderRepoHistory()}
                    </div>
                  </ScrollArea>
                </div>
                <div className="flex-1 border rounded-lg border-border mb-4">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <h2 className="text-sm font-semibold">Chat</h2>
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(33vh-100px)]">
                    <div className="p-2">
                      {renderChat()}
                    </div>
                  </ScrollArea>
                </div>
                <div className="flex-1 border rounded-lg border-border">
                  <BuildInfoCard />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;