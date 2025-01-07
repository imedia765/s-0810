import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Code, Database, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'AI Code Generator',
      description: 'Generate high-quality code with advanced AI models',
      icon: <Code className="h-6 w-6" />,
      path: '/code-generator'
    },
    {
      title: 'AI Researcher',
      description: 'Access powerful tools and data for project development',
      icon: <Brain className="h-6 w-6" />,
      path: '/researcher'
    },
    {
      title: 'Project Analytics',
      description: 'Track metrics and analyze your project\'s performance',
      icon: <Database className="h-6 w-6" />,
      path: '/researcher'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
          Welcome to AI Dev Assistant
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your intelligent companion for code generation, research, and project development
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow gradient-border">
            <div className="mb-4 text-primary">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground mb-4">{feature.description}</p>
            <Button 
              onClick={() => navigate(feature.path)}
              variant="outline"
              className="w-full"
            >
              Explore <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
        <Button 
          onClick={() => navigate('/code-generator')}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          Start Coding Now
        </Button>
      </div>
    </div>
  );
};

export default Home;