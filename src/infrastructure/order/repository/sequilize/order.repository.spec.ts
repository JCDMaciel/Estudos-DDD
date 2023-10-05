import { Sequelize } from "sequelize-typescript";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Product from "../../../../domain/product/entity/product";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order Repository Tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const createCustomer = async (customerId: string, name: string) => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(customerId, name);
    customer.changeAddress(new Address("Street", 1, "Zipcode", "City"));
    await customerRepository.create(customer);
  };

  const createProduct = async (productId: string, name: string, price: number) => {
    const productRepository = new ProductRepository();
    const product = new Product(productId, name, price);
    await productRepository.create(product);
  };

  const createOrderItem = (id: string, name: string, price: number, productId: string, quantity: number) =>
      new OrderItem(id, name, price, productId, quantity);

  const createOrder = async (orderId: string, customerId: string, orderItems: OrderItem[]) => {
    const orderRepository = new OrderRepository();
    const order = new Order(orderId, customerId, orderItems);
    await orderRepository.create(order);
  };

  it("should create a new order", async () => {
    await createCustomer("123", "Customer 1");
    await createProduct("123", "Product 1", 10);

    const orderItem = createOrderItem("1", "Product 1", 10, "123", 2);

    await createOrder("123", "123", [orderItem]);

    const orderModel = await OrderModel.findOne({
      where: { id: "123" },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toEqual({
      id: "123",
      customer_id: "123",
      total: 20,
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
          quantity: 2,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    await createCustomer("123", "name");
    await createProduct("123", "ProductName", 10);

    const orderItem = createOrderItem("1", "ProductName", 10, "123", 2);

    const orderRepository = new OrderRepository();
    await createOrder("123", "123", [orderItem]);

    const orderResult = await orderRepository.find("123");

    const product2 = await createProduct("456", "ProductName", 30);
    const orderItem2 = createOrderItem("2", "ProductName", 30, "456", 2);
    orderResult.addItem(orderItem2);

    await orderRepository.update(orderResult);

    const orderResultUpdated = await orderRepository.find("123");
    expect(orderResultUpdated).toEqual(orderResult);
  });

  it("should find an order", async () => {
    await createCustomer("123", "name");
    await createProduct("123", "Product 1", 10);

    const orderItem = createOrderItem("1", "Product 1", 10, "123", 2);

    await createOrder("123", "123", [orderItem]);

    const foundOrder = await new OrderRepository().find("123");

    expect(foundOrder).toEqual(new Order("123", "123", [orderItem]));
  });

  it("should find all orders", async () => {
    await createCustomer("123", "Customer1");
    await createProduct("123", "Product 1", 10);
    const orderItem = createOrderItem("1", "Product 1", 10, "123", 2);

    await createOrder("123", "123", [orderItem]);

    await createCustomer("456", "Customer2");
    await createProduct("456", "Product 2", 30);
    const orderItem2 = createOrderItem("2", "Product 2", 30, "456", 2);

    await createOrder("456", "123", [orderItem2]);

    const orders = await new OrderRepository().findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(new Order("123", "123", [orderItem]));
    expect(orders).toContainEqual(new Order("456", "123", [orderItem2]));
  });
});
