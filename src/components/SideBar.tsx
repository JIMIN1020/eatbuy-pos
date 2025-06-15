import { saveSalesData } from '../salesService';
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

  const handlePayment = async () => {
    if (orderItems.length === 0) return;

    try {
      await saveSalesData(orderItems);
      setOrderItems([]);
    } catch (error) {
      console.error('결제 처리 중 오류 발생:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    }
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full h-[40vh] md:h-full bg-white p-4 md:p-6 md:col-span-3 flex flex-col overflow-hidden">
      <div className="w-full flex justify-between items-center mb-3 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold">주문 목록</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-punta-orange text-white px-2 py-1 md:px-4 md:py-2 rounded-md hover:bg-orange-600 transition-colors text-xs md:text-base"
          onClick={handleClearItems}
        >
          전체 삭제
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 max-h-[calc(100%-120px)]">
        <div className="flex flex-col gap-2 md:gap-4 pb-2 md:pb-[40px]">
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

      <div className="pt-3 md:pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-lg font-semibold">총액</span>
          <span className="text-base md:text-xl font-bold">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePayment}
          className="w-full mt-2 md:mt-4 py-1.5 md:py-3 bg-punta-orange text-white rounded-lg text-base md:text-xl font-semibold hover:bg-orange-600 transition-colors"
        >
          {totalAmount.toLocaleString()}원 결제
        </motion.button>
      </div>
    </div>
  );
}

export default SideBar;
