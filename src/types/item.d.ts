interface Item {
  id: number;
  name: string;
  option: string;
  price: number;
}

interface ReadyToOrderItem extends Item {
  quantity: number;
}
