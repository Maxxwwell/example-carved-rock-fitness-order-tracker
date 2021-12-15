describe("accessibility", () => {
  before(() => {
    browser.url("http://localhost:3000");
    const ordersList = $("[data-testid = 'orders-list']");
    expect(ordersList).toBeDisplayed();
  });
  describe("keyboard navigation", () => {
    it("should focus on my orders menu item when tabbing first time", () => {
      browser.keys("Tab");
      const focused = browser.focused();

      expect(focused).toHaveHref("/orders");
      expect(focused).toHaveHref("My Orders");
    });

    it("should focus on first order next", () => {});

    it("should navigate to order when selected with Enter key", () => {});

    it("should be able to focus on notification toggle", () => {});

    it("should be able to toggle notifications", () => {});
  });
});
