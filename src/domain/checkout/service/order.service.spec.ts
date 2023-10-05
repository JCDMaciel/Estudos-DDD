import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit tests", () => {
  let customer: Customer;
  let item1: OrderItem;
  let item2: OrderItem;

  beforeEach(() => {
    customer = new Customer("c1", "Customer 1");
    item1 = new OrderItem("i1", "Item 1", 10, "p1", 1);
    item2 = new OrderItem("i2", "Item 2", 20, "p2", 2);
  });

  it("should place an order", () => {
    const order = OrderService.placeOrder(customer, [item1]);

    expect(customer.rewardPoints).toEqual(5);
    expect(order.calcularTotal()).toEqual(10);
  });

  it("should get total of all orders", () => {
    const order1 = new Order("o1", "c1", [item1]);
    const order2 = new Order("o2", "c1", [item2]);

    const total = OrderService.total([order1, order2]);

    expect(total).toBe(50);
  });
});
