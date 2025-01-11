import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GitBranch, GitCommit, Star, History, Tag, Trash2, RotateCw, Check, Plus } from "lucide-react";
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
    <div className="w-full max-w-6xl mx-auto space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400">
          Git Repository Manager
        </h1>
        <p className="text-muted-foreground">
          Manage and sync your Git repositories in one place
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm border-muted">
          <h2 className="text-lg font-semibold">Add Repository</h2>
          <form onSubmit={handleAddRepo} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repoName" className="text-sm font-medium text-muted-foreground">
                Repository Name*
              </label>
              <Input
                id="repoName"
                placeholder="My Awesome Project"
                value={repoLabel}
                onChange={(e) => setRepoLabel(e.target.value)}
                className="bg-background/50 border-muted"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nickname" className="text-sm font-medium text-muted-foreground">
                Nickname (Optional)
              </label>
              <Input
                id="nickname"
                placeholder="Project Nickname"
                value={repoLabel}
                onChange={(e) => setRepoLabel(e.target.value)}
                className="bg-background/50 border-muted"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gitUrl" className="text-sm font-medium text-muted-foreground">
                Git URL*
              </label>
              <Input
                id="gitUrl"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="bg-background/50 border-muted"
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
                className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                This is a master repository
              </label>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 hover:from-blue-600 hover:via-violet-600 hover:to-purple-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Repository
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          {repositories.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Repositories ({repositories.length})
                </h2>
              </div>
              <div className="space-y-3">
                {repositories.map((repo) => (
                  <Card
                    key={repo.id}
                    className="p-4 bg-card/50 backdrop-blur-sm border-muted hover:bg-card/60 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {repo.label || repo.url.split('/').pop()}
                          </span>
                          {repo.isMaster && (
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              Master
                            </Badge>
                          )}
                          <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                            Synced
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">
                          {repo.url}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last synced: {repo.lastPushed ? new Date(repo.lastPushed).toLocaleString() : 'Never'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRepo(repo.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSyncRepo(repo.id)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

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