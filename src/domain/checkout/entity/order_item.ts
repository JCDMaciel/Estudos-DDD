export default class OrderItem {
  constructor(
      public id: string,
      public name: string,
      public price: number,
      public productId: string,
      public quantity: number
  ) {}

  get total(): number {
    return this.price * this.quantity;
  }
}
