import ProductCreatedEvent from "./product-created.event";

describe("ProductCreatedEvent unit tests", () => {
  it("should create a ProductCreatedEvent", () => {
    const eventData = { productId: "1", productName: "Product 1" };
    const productCreatedEvent = new ProductCreatedEvent(eventData);

    expect(productCreatedEvent).toBeInstanceOf(ProductCreatedEvent);
    expect(productCreatedEvent.dataTimeOccurred).toBeInstanceOf(Date);
    expect(productCreatedEvent.eventData).toEqual(eventData);
  });
});
