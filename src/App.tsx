
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import './i18n/i18n';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { appLanguageBundle } from './i18n/i18n.ts';
import NotFound from './pages/NotFound';
import { getClient } from './lib/apollo-client';
import { ApolloProvider } from '@apollo/client';
import { JahiaCtxProvider, AppCtxProvider } from './contexts';
import { ErrorHandler } from './components/Error/ErrorHandler';
import './index.css';
import './styles/map-overrides.css';

// Define the DigitalData interface for window
interface DigitalData {
  _webapp: boolean;
  scope: string;
  site: {
    siteInfo: { siteID: string }
  };
  page: {
    pageInfo: {
      pageID: string;
      pageName: string;
      pagePath: string;
      destinationURL: string;
      language: string;
      categories: any[];
      tags: any[];
    };
    attributes: Record<string, any>;
    consentTypes: any[];
  };
  events: any[];
  wemInitConfig: {
    contextServerUrl: string;
    timeoutInMilliseconds: string;
    activateWem: boolean;
    trackerSessionIdCookieName: string;
  };
}

// Extend the Window interface
declare global {
  interface Window {
    digitalData?: DigitalData;
    storeLocatorUIApp?: (target: string, context: RenderContext) => Promise<void>;
  }
}

interface RenderContext {
    host: string;
    workspace: string;
    isEdit: boolean;
    locale: string;
    storeLocatorId: string;
    gqlServerUrl: string;
    contextServerUrl: string;
    appContext: Record<string, any>;
    cndTypes: string[];
    scope: string;
    previewCm: string;
    previewTarget: string;
}

const queryClient = new QueryClient();

const render = async (target: string, context: RenderContext)=> {
    const rootElement = document.getElementById(target);
    if (!rootElement) {
        console.error(`Error: Target element with ID "${target}" not found in the DOM.`);
        return;
    }

    const root = createRoot(rootElement);

    try {
        const {
            host,
            workspace,
            isEdit,
            locale,
            storeLocatorId,
            gqlServerUrl,
            contextServerUrl,
            appContext,
            cndTypes,
            scope,
            previewCm,
            previewTarget,
        } = context;

        await i18n.use(initReactI18next).init({
            resources: appLanguageBundle,
            lng: locale,
            fallbackLng: 'en',
            interpolation: { escapeValue: false }
        });

        const isPreview = workspace !== 'LIVE';

        const client = getClient(gqlServerUrl);

        if (workspace === 'LIVE' && !window.digitalData) {
            window.digitalData = {
                _webapp: true,
                scope,
                site: {
                    siteInfo: { siteID: scope }
                },
                page: {
                    pageInfo: {
                        pageID: 'Store Locator Webapp',
                        pageName: document.title,
                        pagePath: document.location.pathname,
                        destinationURL: document.location.origin + document.location.pathname,
                        language: locale,
                        categories: [],
                        tags: []
                    },
                    attributes: {},
                    consentTypes: []
                },
                events: [],
                wemInitConfig: {
                    contextServerUrl,
                    timeoutInMilliseconds: '1500',
                    activateWem: true,
                    trackerSessionIdCookieName: 'wem-session-id'
                }
            };
        }

        root.render(
            <React.StrictMode>
                <JahiaCtxProvider value={{
                    workspace,
                    locale,
                    host,
                    isEdit,
                    contextServerUrl,
                    cndTypes,
                    previewCm,
                    previewTarget,
                    isPreview,
                    scope,
                    storeLocatorId
                }}>
                        <ApolloProvider client={client}>
                            <AppCtxProvider value={appContext}>
                                <QueryClientProvider client={queryClient}>
                                    <TooltipProvider>
                                        <HashRouter>
                                            <Routes>
                                                <Route path="/" element={<Index />} />
                                                <Route path="*" element={<NotFound />} />
                                            </Routes>
                                        </HashRouter>
                                    </TooltipProvider>
                                </QueryClientProvider>
                            </AppCtxProvider>
                        </ApolloProvider>
                </JahiaCtxProvider>
            </React.StrictMode>
        );
    } catch (e: any) {
        console.error('Rendering error:', e);
        root.render(<ErrorHandler item={e.message} errors={e.errors} />);
    }
};

// Expose function globally
window.storeLocatorUIApp = render;
