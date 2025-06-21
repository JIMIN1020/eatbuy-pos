import { motion } from 'framer-motion';

interface Props {
  title: string;
  items: Item[];
  onItemClick: (item: Item) => void;
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
            className="w-[90px] h-[90px] md:w-[160px] md:h-[160px] p-2 md:p-[20px] shadow-sm bg-white rounded-[12px] border border-gray-200 text-black flex flex-col items-start justify-between gap-2 md:gap-[12px]"
            onClick={() => onItemClick(item)}
          >
            <span className="text-sm md:text-xl">{item.option}</span>
            <strong className="text-end w-full text-sm md:text-xl font-bold">
              {item.price.toLocaleString()}원
            </strong>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
