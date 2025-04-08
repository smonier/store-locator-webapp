import React from 'react';

const AppCtx = React.createContext({});
const {Provider: AppCtxProvider, Consumer: AppCtxConsumer} = AppCtx;

export {AppCtx, AppCtxProvider, AppCtxConsumer};
