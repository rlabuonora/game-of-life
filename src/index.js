import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App rows={20} cols={20} speed={500} />,
  document.getElementById('root')
);
