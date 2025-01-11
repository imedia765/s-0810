import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GitBranch, GitCommit, Star, History, Tag, Trash2, RotateCw, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Repository {
  id: string;
  url: string;
  label?: string;
  isMaster: boolean;
  lastPushed?: string;
  lastCommit?: string;
}

export function RepoManager() {
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const saved = localStorage.getItem('git-repositories');
    return saved ? JSON.parse(saved) : [];
  });
  const [repoUrl, setRepoUrl] = useState("");
  const [repoLabel, setRepoLabel] = useState("");
  const [showMasterWarning, setShowMasterWarning] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('git-repositories', JSON.stringify(repositories));
  }, [repositories]);

  const handleAddRepo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a repository URL",
        variant: "destructive",
      });
      return;
    }

    const newRepo: Repository = {
      id: crypto.randomUUID(),
      url: repoUrl,
      label: repoLabel || undefined,
      isMaster: repositories.length === 0,
      lastPushed: new Date().toISOString(),
    };

    setRepositories(prev => [...prev, newRepo]);
    setRepoUrl("");
    setRepoLabel("");
    
    toast({
      title: "Success",
      description: `Repository added: ${repoLabel || repoUrl}`,
    });
  };

  const handleDeleteRepo = (id: string) => {
    const repo = repositories.find(r => r.id === id);
    if (repo?.isMaster) {
      setShowMasterWarning(true);
      return;
    }
    setRepositories(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Success",
      description: "Repository deleted successfully",
    });
  };

  const handleSyncRepo = (id: string) => {
    const timestamp = new Date().toISOString();
    setRepositories(prev => prev.map(repo => {
      if (repo.id === id) {
        return { ...repo, lastPushed: timestamp };
      }
      return repo;
    }));
    toast({
      title: "Success",
      description: "Repository synced successfully",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
          Git Repository Manager
        </h1>
        <p className="text-muted-foreground">
          Manage and sync your Git repositories in one place
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Add Repository</h2>
          <form onSubmit={handleAddRepo} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repoName" className="text-sm font-medium">
                Repository Name*
              </label>
              <Input
                id="repoName"
                placeholder="My Awesome Project"
                value={repoLabel}
                onChange={(e) => setRepoLabel(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium">
                Nickname (Optional)
              </label>
              <Input
                id="nickname"
                placeholder="Project Nickname"
                value={repoLabel}
                onChange={(e) => setRepoLabel(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gitUrl" className="text-sm font-medium">
                Git URL*
              </label>
              <Input
                id="gitUrl"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="master"
                checked={repositories.length === 0}
                disabled={repositories.length === 0}
              />
              <label
                htmlFor="master"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                This is a master repository
              </label>
            </div>

            <Button type="submit" className="w-full">
              <GitBranch className="mr-2" />
              Add Repository
            </Button>
          </form>
        </div>

        {repositories.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Repositories ({repositories.length})</h2>
            </div>
            <div className="space-y-3">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {repo.label || repo.url.split('/').pop()}
                      </span>
                      {repo.isMaster && (
                        <Badge variant="secondary" className="text-xs">
                          Master
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{repo.url}</div>
                    <div className="text-xs text-muted-foreground">
                      Last synced: {repo.lastPushed ? new Date(repo.lastPushed).toLocaleString() : 'Never'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRepo(repo.id)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSyncRepo(repo.id)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={showMasterWarning} onOpenChange={setShowMasterWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Warning: Modifying Master Repository
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to modify the master repository? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowMasterWarning(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowMasterWarning(false);
                setConfirmationStep(0);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}