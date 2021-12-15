import "@testing-library/cypress/add-commands";

describe("responsive design", () => {
  describe("on phones", () => {
    before(() => cy.visit("http://localhost:3000/orders"));

    ["portrait", "landscape"].forEach((orientation) => {
      describe(`in ${orientation}`, () => {
        beforeEach(() => cy.viewport("iphone-6", orientation));

        it("should display menu navigation button", () => {
          cy.get("ion-menu-button").should("be.visible");
        });
        it("should show and hide menu", () => {
          // Open the hamburger menu which slides out from the left
          cy.get("ion-menu-button").click();

          // Find the navigation menu, then find the menu item
          // that contains the text "My Orders" which is a link
          cy.findByRole("navigation")
            .findByText("My Orders")
            .should("be.visible");

          // We have to wait for the Ionic menu to slide out
          // because Cypress doesn't automatically wait for it
          // before executing the next command which can make
          // this test flaky.
          cy.wait(3000);

          // Click in the top right corner of the element,
          // which is the "dismiss" zone which should close the menu
          cy.findByRole("navigation")
            .click("topRight")
            .should("not.be.visible");
        });
        it("should not display marketing imagery", () => {});
      });
    });
  });

  //<_____________________________________________________>
  describe("on tablet-sized screens", () => {
    before(() => {
      cy.visit("http://localhost:3000/orders");
    });

    it("should not display left menu", () => {
      // Use the iPad 2 preset which is the medium breakpoint
      cy.viewport("ipad-2");

      // There should be no left menu displayed in portrait orientation
      cy.findByRole("navigation").should("be.visible");

      // Instead there should still be a hamburger menu
      cy.get("ion-menu-button").should("be.visible");
    });

    it("should display left menu in landscape", () => {
      // Flip the orientation to landscape
      cy.viewport("ipad-2", "landscape");

      // Now, the left nav should be fixed to the left side
      cy.findByRole("navigation").should("be.visible");

      // And there should no longer be a hamburger menu icon
      cy.get("ion-menu-button").should("not.be.visible");
    });

    it("should be the first size to show marketing imagery", () => {
      // Go back to portrait mode
      cy.viewport("ipad-2");

      // Unlike phone sizes, the hero imagery should be visible
      // on this breakpoint
      cy.get(".hero-image-col").should("be.visible");
    });
  });

  //<_____________________________________________________>

  describe("on larger screens", () => {
    before(() => {
      cy.visit("http://localhost:3000/orders");
    });

    it("should continue displaying marketing imagery", () => {
      cy.viewport("macbook-15");
      cy.get(".hero-image-col").should("be.visible");
    });
  });
});
