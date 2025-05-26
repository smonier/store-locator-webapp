
import './App';

import './styles/global.css';
import 'leaflet/dist/leaflet.css';



window.storeLocatorUIApp?.('root', {
    host: window.location.host,
    workspace: 'LIVE',
    isEdit: false,
    locale: 'en',
    storeLocatorId: '',
    gqlServerUrl: 'http://localhost:8080/modules/graphql',
    contextServerUrl: 'http://localhost:8181',
    appContext: {},
    cndTypes: [],
    scope: 'lkk-corp',
    previewCm: '',
    previewTarget: ''
});
