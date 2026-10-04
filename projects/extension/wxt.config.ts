import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  // Reuse the same Chrome profile across `wxt dev` runs so chrome.storage.local
  // (API key, last question) survives restarts instead of starting fresh each time.
  webExt: {
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
  },
  manifest: {
    name: 'Jev Page Judge',
    description: 'Ask a question about the current page and get a typed answer from TypeSafe Jev.',
    permissions: ['scripting', 'storage', 'sidePanel'],
    host_permissions: ['https://api.typesafe.ai/*'],
    // activeTab doesn't reliably re-grant on clicks inside an already-open side
    // panel (unlike popups), so page-read access is requested per-site at runtime
    // instead — see requestHostPermission() in lib/permissions.ts.
    optional_host_permissions: ['http://*/*', 'https://*/*'],
    // No popup entrypoint exists, but declaring `action` still creates the
    // toolbar icon/click target that `chrome.sidePanel.setPanelBehavior`
    // (see background.ts) opens the side panel from.
    action: {},
  },
});
