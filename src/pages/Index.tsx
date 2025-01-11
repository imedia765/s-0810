import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { RepoManager } from "@/components/RepoManager";
import { Button } from "@/components/ui/button";
import { GitBranch, Settings } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto fade-in">
            <header className="flex justify-between items-center py-6 px-4 md:px-6">
              <div className="flex items-center gap-4">
                <GitBranch className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Git Tools Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <SidebarTrigger />
              </div>
            </header>
            <div className="px-4 md:px-6">
              <RepoManager />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;