interface Transaction {
  id: string;
  date: string;
  time: string;
  items: ReadyToOrderItem[];
  totalAmount: number;
  timestamp: number;
}

interface TransactionTableItem {
  key: string;
  id: string;
  time: string;
  items: string;
  quantity: number;
  amount: number;
}
