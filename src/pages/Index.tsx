import React, { useState } from 'react';
import { StoreProvider } from '../contexts/StoreProvider';
import StoreMap from '../components/Map';
import StoreList from '../components/StoreList';
import StoreDetails from '../components/StoreDetails';
import SearchBar from '../components/SearchBar';
import { Button } from '@/components/ui/button';
import { useStores } from '../contexts/useStores';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const StoreLocatorContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { selectedStore, selectStore } = useStores();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (isMobile && selectedStore) {
      setSidebarOpen(false);
    }
  }, [selectedStore, isMobile]);

  React.useEffect(() => {
    toast({
      title: t('toast.welcome.title'),
      description: t('toast.welcome.description')
    });
  }, [toast, t]);

  const handleCloseDetails = () => {
    selectStore('');
  };

  return (
      <div className="relative h-screen w-screen overflow-hidden bg-store-background flex">
        {/* Sidebar */}
        <div
            className={`
          h-full z-10 bg-background shadow-lg 
          ${isMobile ? 'absolute left-0 top-0 bottom-0' : 'relative'} 
          ${sidebarOpen ? 'w-96 max-w-[90vw]' : 'w-0'}
          transition-all duration-300 overflow-hidden flex flex-col
        `}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-store-primary">{t('title')}</h1>
            {isMobile && (
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
            )}
          </div>

          <div className="p-4 border-b">
            <SearchBar />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <StoreList />
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        {isMobile && !sidebarOpen && (
            <Button
                className="absolute top-4 left-4 z-20 bg-white shadow-lg"
                size="icon"
                onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
        )}

        {/* Collapse button on Desktop */}
        {!isMobile && (
            <Button
                className={`absolute top-1/2 z-20 bg-white shadow-lg transform -translate-y-1/2 transition-all duration-300
            ${sidebarOpen ? 'left-96 rotate-180' : 'left-0'}`}
                size="icon"
                variant="outline"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
        )}

        {/* Map + Store Details */}
        <div className="flex-1 relative z-0">
          <StoreMap className="h-full" />
          {selectedStore && (
              <div className="fixed right-0 top-0 h-full bg-white shadow-lg overflow-y-auto w-full md:w-96 z-[1000] transition-all duration-300">
                <StoreDetails onClose={handleCloseDetails} />
              </div>
          )}
        </div>
      </div>
  );
};

const Index = () => (
    <StoreProvider>
      <StoreLocatorContent />
    </StoreProvider>
);

export default Index;