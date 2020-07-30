// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";

Cypress.Commands.overwrite("visit", (originalFn, path, options = {}) => {
  if (options.useSw) {
    // Bypass SW caching for ONLY document routes (i.e. API route will be cached)
    return originalFn(path, {
      ...options,
      qs: { ...options.qs, cy_sw_page_only_bypass: true },
    });
  }

  // Bypass SW caching for all document and API route
  return originalFn(path, {
    ...options,
    qs: { ...options.qs, cy_sw_bypass: true },
  });
});

Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((window) => {
    if (window.sessionStorage) {
      window.sessionStorage.clear();
    }
  });
});

Cypress.Commands.add("waitForCacheStorage", (cacheName, options = {}) => {
  cy.window()
    .its("caches")
    .should(async (caches) => {
      if (!caches) {
        return;
      }

      const cache = await caches.open(cacheName);
      expect(cache).to.exist;

      if ("minimumCacheEntries" in options) {
        const cacheEntries = await cache.keys();
        expect(cacheEntries).to.have.length.gte(options.minimumCacheEntries);
      }

      if ("maximumCacheEntries" in options) {
        const cacheEntries = await cache.keys();
        expect(cacheEntries).to.have.length.lte(options.maximumCacheEntries);
      }
    });
});

Cypress.Commands.add("clearCacheStorage", (cacheName) => {
  cy.window()
    .its("caches")
    .should(async (caches) => {
      if (!caches) {
        return;
      }

      const hasCache = await caches.has(cacheName);

      if (hasCache) {
        const hasDeleted = await caches.delete(cacheName);

        expect(hasDeleted).to.be.true;

        // wait for good measure for cache to be deleted
        // seems to be flaky without this
        cy.wait(300);
      }
    });
});

Cypress.Commands.add(
  "triggerEvent",
  { prevSubject: "window" },
  (win, eventName, eventInit = undefined) => {
    const event = new Event(eventName, eventInit);
    win.dispatchEvent(event);
  }
);

Cypress.Commands.add("waitForIonicAnimations", () => {
  cy.wait(Cypress.env().ionicAnimationTimeout);
});

/**
 * Waits for initial orders to load from backend
 */
Cypress.Commands.add("waitForAppReadiness", () => {
  cy.findByTestId("orders-list", {
    timeout: Cypress.config().pageLoadTimeout,
  }).should("be.visible");
});