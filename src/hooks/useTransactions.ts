import { useEffect, useState } from 'react';
import { getToday } from '../utils/date';
import {
  deleteTransaction,
  getTransactionsByDateRange,
} from '../firebase/salesService';
import { message } from 'antd';
import type dayjs from 'dayjs';

export const useTransactions = () => {
  const [date, setDate] = useState(getToday());
  const [rows, setRows] = useState<TransactionTableItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleCancelTransaction = async (
    transactionId: string,
    amount: number
  ) => {
    try {
      await deleteTransaction(transactionId);

      setRows((prev) => prev.filter((row) => row.id !== transactionId));
      setTotal(total - amount);
      message.success('결제가 취소되었습니다.');
    } catch (error) {
      console.error('결제 취소 중 오류 발생:', error);
      message.error('결제 취소 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const transactions = await getTransactionsByDateRange(date, date);

        const result = transactions.map((transaction, index) => {
          const itemsText = transaction.items
            .map((item) => `${item.name} ${item.option} × ${item.quantity}`)
            .join('\n');

          const totalQuantity = transaction.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return {
            key: String(index),
            id: transaction.id,
            time: transaction.time,
            items: itemsText,
            quantity: totalQuantity,
            amount: transaction.totalAmount,
          };
        });

        setRows(result);
        setTotal(result.reduce((sum, item) => sum + item.amount, 0));
      } catch (error) {
        console.error('데이터 조회 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalesData();
  }, [date]);

  const handleDateChange = (date: dayjs.Dayjs) => {
    if (date) {
      setDate(date.format('YYYY-MM-DD'));
    }
  };

  return {
    date,
    rows,
    total,
    loading,
    currentPage,
    handleCancelTransaction,
    handleDateChange,
    setCurrentPage,
  };
};
