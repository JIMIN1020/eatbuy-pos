interface Props {
  item: ReadyToOrderItem;
  onDelete: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function OrderItem({ item, onDelete, onUpdateQuantity }: Props) {
  return (
    <div className="w-full rounded-xl border border-punta-orange p-3 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-lg">
            {item.name} {item.option}
          </div>
          <div className="text-gray-600 text-lg mt-1">
            {item.price.toLocaleString()}원
          </div>
        </div>
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg ml-2"
          aria-label="삭제"
          onClick={onDelete}
        >
          ×
        </button>
      </div>
      <div className="mt-3 flex w-full justify-center">
        <button
          className="w-20 h-10 border border-gray-300 rounded-l-lg bg-gray-50 text-xl"
          onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
        >
          –
        </button>
        <div
          style={{
            borderTop: '1px solid oklch(87.2% 0.01 258.338)',
            borderBottom: '1px solid oklch(87.2% 0.01 258.338)',
          }}
          className="w-full h-10 flex items-center justify-center bg-gray-50 text-base"
        >
          {item.quantity}
        </div>
        <button
          className="w-20 h-10 border border-gray-300 rounded-r-lg bg-gray-50 text-xl"
          onClick={() => onUpdateQuantity(item.quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default OrderItem;
