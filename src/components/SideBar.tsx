import OrderItem from './OrderItem';
import { motion } from 'framer-motion';

interface OrderItemType {
  id: number;
  name: string;
  option: string;
  price: number;
  quantity: number;
}

interface Props {
  orderItems: OrderItemType[];
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItemType[]>>;
}

function SideBar({ orderItems, setOrderItems }: Props) {
  const handleDeleteItem = (id: number) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleClearItems = () => {
    setOrderItems([]);
  };

  const handlePayment = () => {
    if (orderItems.length === 0) return;

    const today = new Date().toISOString().slice(0, 10);

    const existingSales = JSON.parse(localStorage.getItem('sales') || '{}');

    if (!existingSales[today]) {
      existingSales[today] = {};
    }

    orderItems.forEach((item) => {
      const key = item.id;
      if (!existingSales[today][key]) {
        existingSales[today][key] = {
          name: item.name,
          option: item.option,
          quantity: 0,
          amount: 0,
        };
      }
      existingSales[today][key].quantity += item.quantity;
      existingSales[today][key].amount += item.price * item.quantity;
    });

    localStorage.setItem('sales', JSON.stringify(existingSales));

    setOrderItems([]);
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full h-full bg-white p-6 col-span-3 flex flex-col overflow-hidden">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">주문 목록</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-punta-orange text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          onClick={handleClearItems}
        >
          전체 삭제
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-4 pb-[40px]">
          {orderItems.map((item) => (
            <OrderItem
              key={item.id}
              item={item}
              onDelete={() => handleDeleteItem(item.id)}
              onUpdateQuantity={(quantity) =>
                handleUpdateQuantity(item.id, quantity)
              }
            />
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">총액</span>
          <span className="text-xl font-bold">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePayment}
          className="w-full mt-4 py-3 bg-punta-orange text-white rounded-lg text-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          {totalAmount.toLocaleString()}원 결제
        </motion.button>
      </div>
    </div>
  );
}

export default SideBar;
