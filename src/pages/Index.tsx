import React, { useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Preview } from '@/components/Preview';
import { useToast } from '@/components/ui/use-toast';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, File } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Index = () => {
  const [code, setCode] = useState('// Your generated code will appear here');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock file tree data - this would come from your actual file system or GitHub API
  const fileTree = [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'components', type: 'folder', children: [
          { name: 'App.tsx', type: 'file' },
          { name: 'Button.tsx', type: 'file' }
        ]},
        { name: 'utils', type: 'folder', children: [
          { name: 'helpers.ts', type: 'file' }
        ]},
        { name: 'main.tsx', type: 'file' }
      ]
    },
    {
      name: 'public',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'file' }
      ]
    }
  ];

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, index) => (
      <div key={index} className="flex flex-col">
        <div 
          className="flex items-center gap-2 px-2 py-1 hover:bg-accent/10 rounded cursor-pointer"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {item.type === 'folder' ? (
            <Folder className="h-4 w-4 text-accent" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm">{item.name}</span>
        </div>
        {item.children && renderFileTree(item.children, level + 1)}
      </div>
    ));
  };

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
              <div className="h-full border rounded-lg border-border">
                <div className="p-4 border-b border-border">
                  <h2 className="text-sm font-semibold">Project Files</h2>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="p-2">
                    {renderFileTree(fileTree)}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;