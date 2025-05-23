
import React, { useContext, useEffect, useState } from 'react';
import { StoreProvider } from '../contexts/StoreProvider';
import StoreMap from '../components/Map';
import StoreList from '../components/StoreList';
import StoreDetails from '../components/StoreDetails';
import SearchBar from '../components/SearchBar';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { GetStoreLocatorApp } from '../lib/graphql/queries';
import { JahiaCtx } from '../contexts';
import { useQuery } from "@apollo/client";
import { useStores } from '../contexts/useStores';
import styles from './Index.module.css';

const StoreLocatorContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { selectedStore, selectStore } = useStores();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [appTitle, setAppTitle] = useState(t('title'));

  // @ts-ignore
  const { locale, workspace, storeLocatorId } = useContext(JahiaCtx);

  const { data, loading, error } = useQuery(GetStoreLocatorApp, {
        variables: { language: locale, workspace: workspace, id: storeLocatorId },
        fetchPolicy: 'network-only'   // bypass cache in dev
  });

  useEffect(() => {
      if (data?.response?.storeApp?.title) {
            setAppTitle(data.response.storeApp.title);
      }
  }, [data]);

  React.useEffect(() => {
    if (isMobile && selectedStore) {
      setSidebarOpen(false);
    }
  }, [selectedStore, isMobile]);

  React.useEffect(() => {
    const title = data?.response?.storeApp?.welcomeTitle?.value || t('toast.welcome.title');
    const description = data?.response?.storeApp?.welcomeMessage?.value || t('toast.welcome.description');

    toast({
        title,
        description
    });
  }, [toast, data, t]);

  const handleStoreSelect = () => {
    setShowStoreDetails(true);
  };

  const handleCloseDetails = () => {
    setShowStoreDetails(false);
  };

  const handleResetStores = () => {
    selectStore('');
    setShowStoreDetails(false);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={`
        ${styles.sidebar} 
        ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}
        ${isMobile ? styles.sidebarMobile : styles.sidebarDesktop}
      `}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.title}>{appTitle}</h1>
          <div className={styles.headerActions}>
            <button 
              className={styles.resetButton}
              onClick={handleResetStores}
            >
              {t('storelist.reset')}
            </button>
            {isMobile && (
              <button className={styles.closeButton} onClick={() => setSidebarOpen(false)}>
                <X className={styles.iconSm} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

        <div className={styles.storeListContainer}>
          <StoreList onStoreClick={handleStoreSelect} />
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      {isMobile && !sidebarOpen && (
        <button
          className={styles.toggleButton}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className={styles.iconSm} />
        </button>
      )}

      {/* Collapse button on Desktop */}
      {!isMobile && (
        <button
          className={`
            ${styles.collapseButton} 
            ${sidebarOpen ? styles.collapseButtonOpen : styles.collapseButtonClosed}
          `}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronRight className={styles.iconSm} />
        </button>
      )}

      {/* Map + Store Details */}
      <div className={styles.mapContainer}>
        {/* Map fills entire space */}
        <StoreMap onStoreClick={handleStoreSelect} />
        {/* StoreDetails overlays the bottom of the map */}
        {selectedStore && showStoreDetails && (
          <div className={styles.storeDetailsContainer}>
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
