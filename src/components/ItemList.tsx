import { motion } from 'framer-motion';

interface Props {
  title: string;
  items: {
    id: number;
    name: string;
    option: string;
    price: number;
  }[];
  onItemClick: (item: {
    id: number;
    name: string;
    option: string;
    price: number;
  }) => void;
}

function ItemList({ title, items, onItemClick }: Props) {
  return (
    <div className="flex flex-col w-full gap-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <div className="flex items-center gap-[12px]">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            className="w-[150px] h-[150px] p-[20px] shadow-sm bg-white rounded-[12px] border border-gray-200 text-black flex flex-col items-start justify-between gap-[12px]"
            onClick={() => onItemClick(item)}
          >
            <span className="text-xl">{item.option}</span>
            <strong className="text-end w-full text-xl font-bold">
              {item.price.toLocaleString()}원
            </strong>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
