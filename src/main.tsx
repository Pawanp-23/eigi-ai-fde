import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './theme/studio.css';
import './theme/team.css';
import './theme/hero-punchline.css';
import './theme/scroll-detail.css';
import './theme/engineering-hero.css';
import './theme/hero-video.css';
import './theme/refinement.css';
import './theme/signal-hero.css';
import './theme/theme-navigation.css';
import './theme/scroll-morph-hero.css';
import './theme/parallax-scrolling.css';
import './theme/final-polish.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
