import { useState } from 'react';
import ItemList from '../../components/ItemList';
import { ITEM_LIST_1, ITEM_LIST_2 } from '../../constants/price';
import SideBar from '../../components/SideBar';
import { getToday } from '../../utils/date';

function PoSPage() {
  const [orderItems, setOrderItems] = useState<ReadyToOrderItem[]>([]);

  const handleAddItem = (item: Item) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((orderItem) => orderItem.id === item.id);
      if (existingItem) {
        return prev.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col md:grid md:grid-cols-10 bg-gray-50 overflow-hidden h-full">
      <div className="flex flex-col w-full h-full p-4 md:p-[40px] flex-1 gap-4 md:gap-[40px] md:col-span-7 overflow-y-auto">
        <div className="flex gap-3 p-4 bg-white rounded-lg shadow-sm justify-between overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-punta-orange rounded-full"></div>
            <h3 className="text-xl md:text-2xl font-bold text-punta-orange">
              {getToday()}
            </h3>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <span className="text-base md:text-lg font-medium text-gray-700">
              오늘도 화이팅!
            </span>
            <span className="text-xl">🧡</span>
          </div>
        </div>
        <ItemList
          title="홍시 찹쌀떡"
          items={ITEM_LIST_1}
          onItemClick={handleAddItem}
        />
        <ItemList
          title="홍시 식혜"
          items={ITEM_LIST_2}
          onItemClick={handleAddItem}
        />
      </div>
      <SideBar orderItems={orderItems} setOrderItems={setOrderItems} />
    </div>
  );
}

export default PoSPage;
