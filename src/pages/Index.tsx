import { SearchInterface } from '@/components/SearchInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="container mx-auto px-4 py-12">
        <SearchInterface />
      </main>
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Index;