import "@testing-library/cypress/add-commands";

describe("service workers", () => {
  it("should wait for service worker to be registered", () => {
    cy.visit("http://localhost:3000/orders", { useSw: true });

    cy.get("html", { timeout: 6000 }).should("have.class", "sw-ready");
  });

  it("should load orders without caching on initial load", () => {
    cy.visit("http://localhost:3000/orders", {
      useSw: true,
      qs: { cy_initialize: true },
    });

    cy.clearCacheStorage("orders");
    cy.waitForCacheStorage("orders", {
      maximumCacheEntries: 0,
    });

    cy.window().invoke("__CY_INITIALIZE_APP");

    cy.findByTestId("orders-list").should("be.visible");
  });

  it("should load orders immediately from cache on reload", () => {
    cy.visit("http://localhost:3000/orders", {
      useSw: true,
      qs: { cy_initialize: true },
    });

    cy.waitForCacheStorage("orders", {
      minimumCacheEntries: 1,
    });
    cy.window().invoke("__CY_INITIALIZE_APP");
    cy.findByTestId("orders-list").should("be.visible");
  });
});
