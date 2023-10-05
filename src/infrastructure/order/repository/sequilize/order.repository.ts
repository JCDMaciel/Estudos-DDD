import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import Order from "../../../../domain/checkout/entity/order";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create(this.createOrderModel(entity), {
            include: [{ model: OrderItemModel }],
        });
    }

    async update(entity: Order): Promise<void> {
        const sequelize = OrderModel.sequelize;
        await sequelize.transaction(async (t) => {
            await OrderItemModel.destroy({
                where: { order_id: entity.id },
                transaction: t,
            });

            const items = entity.items.map((item) => this.createOrderItemModel(item, entity.id));

            await OrderItemModel.bulkCreate(items, { transaction: t });

            await OrderModel.update(
                { total: entity.calcularTotal() },
                { where: { id: entity.id }, transaction: t }
            );
        });
    }

    async find(id: string): Promise<Order | null> {
        const foundOrderModel = await OrderModel.findOne({
            where: { id: id },
            include: ["items"],
        });

        return foundOrderModel
            ? new Order(foundOrderModel.id, foundOrderModel.customer_id, this.mapOrderItems(foundOrderModel.items))
            : null;
    }

    async findAll(): Promise<Order[]> {
        const ordersModel: OrderModel[] = await OrderModel.findAll({ include: ["items"] });

        return ordersModel.map((orderModel) =>
            new Order(orderModel.id, orderModel.customer_id, this.mapOrderItems(orderModel.items))
        );
    }

    private createOrderItemModel(item: OrderItem, orderId: string) {
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: orderId,
        };
    }

    private createOrderModel(entity: Order) {
        return {
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.calcularTotal(),
            items: entity.items.map((item) => this.createOrderItemModel(item, entity.id)),
        };
    }

    private mapOrderItems(items: any[]): OrderItem[] {
        return items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
    }
}
