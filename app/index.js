import React from 'react';
import ReactDOM from 'react-dom/client';

import Main from './Main';

const rootElement = document.getElementById('app');
const root = ReactDOM.createRoot(rootElement);
root.render(<Main />);

if (module.hot) {
module.hot.accept('./Main', () => {
const NewApp = require('./Main').default;
root.render(<NewApp />);
});
}