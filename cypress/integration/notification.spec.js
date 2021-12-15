import "@testing-library/cypress/add-commands";

describe("notifications", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  it("will prompt user for permission to enable notifications when permissions has not been set", () => {
    cy.visit("http://localhost:3000/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "prompt" });

        win.navigator.permissions.query.callThrough();

        cy.stub(win.Notification, "requestPermission").resolves("granted");
      },
    });

    cy.findByLabelText("Toggle Push Notifications").click();
    cy.window().its("Notification.requestPermission").should("be.called");
  });

  it("will not prompt user for permission to enable notifications when permissions has been granted", () => {
    cy.visit("http://localhost:3000/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "granted" });

        win.navigator.permissions.query.callThrough();

        cy.stub(win.Notification, "requestPermission");
      },
    });

    cy.findByLabelText("Toggle Push Notifications").click();
    cy.window().its("Notification.requestPermission").should("not.be.called");
  });

  it("will warn user when permissions have been denied for notifications when trying to enable", () => {
    cy.visit("http://localhost:3000/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "denied" });

        win.navigator.permissions.query.callThrough();
      },
    });

    cy.findByLabelText("Toggle Push Notifications").click();
    cy.get("ion-toast[data-presented]")
      .shadow()
      .findByText(
        "we will need permission before we can send your order updates. To enable, check your browser settings for this site."
      );
  });

  it("will show message confirming the user has enabled tracking", () => {
    cy.visit("http://localhost:3000/orders/1001", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.permissions, "query")
          .withArgs({ name: "notifications" })
          .resolves({ state: "granted" });

        win.navigator.permissions.query.callThrough();
      },
    });

    cy.findByLabelText("Toggle Push Notifications").click();
    cy.get("ion-toast[data-presented]")
      .shadow()
      .findByText("we will notify you of any order updates.");
  });

  Cypress.browser.isHeaded &&
    it("will show desktop notification when permissions are allowed", () => {
      cy.visit("http://localhost:3000/orders/1001", {
        onBeforeLoad(win) {
          win.__CY_NOTIFICATION_PUSHED = cy.stub();
        },
      });

      cy.findByLabelText("Toggle Push Notifications").click();

      cy.window()
        .its("__CY_NOTIFICATION_PUSHED", { timeout: 3000 })
        .should("be.calledWithMatch", "Your order with 2 items is now shipped");
    });
});
