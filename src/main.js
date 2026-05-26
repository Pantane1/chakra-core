/**
 * chakra-core :: main.js
 * Application entry point. Bootstraps ChakraApp after DOM is ready.
 */

import { ChakraApp } from './app.js';

const app = new ChakraApp();

// Start once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.start());
} else {
  app.start();
}

// Expose for debugging in browser console
window.__chakra = app;
