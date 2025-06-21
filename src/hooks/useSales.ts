import { useEffect, useState } from 'react';
import { getToday } from '../utils/date';
import { message } from 'antd';
import {
  getSalesByDateRange,
  getTransactionsByDateRange,
} from '../firebase/salesService';

export const useSales = () => {
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [rows, setRows] = useState<SalesItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [itemStats, setItemStats] = useState<Record<string, SalesItemStats>>(
    {}
  );

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);

      try {
        const allData = await getSalesByDateRange(startDate, endDate);
        const filteredDates = Object.keys(allData).sort();

        const itemMap: Record<string, SalesItem> = {};
        const statsMap: Record<string, SalesItemStats> = {};

        filteredDates.forEach((date: string) => {
          const dayData = allData[date as keyof typeof allData];

          Object.values(dayData).forEach((item: SalesItem) => {
            const key = `${item.name}_${item.option}`;

            if (!itemMap[key]) {
              itemMap[key] = { ...item };
            } else {
              itemMap[key].quantity += item.quantity;
              itemMap[key].amount += item.amount;
            }

            if (item.name === '홍시찹쌀떡') {
              if (!statsMap['홍시찹쌀떡']) {
                statsMap['홍시찹쌀떡'] = { totalQuantity: 0, totalAmount: 0 };
              }
              if (item.option.includes('1구')) {
                statsMap['홍시찹쌀떡'].totalQuantity += item.quantity * 1;
              } else if (item.option.includes('5구')) {
                statsMap['홍시찹쌀떡'].totalQuantity += item.quantity * 5;
              } else if (item.option.includes('10구')) {
                statsMap['홍시찹쌀떡'].totalQuantity += item.quantity * 10;
              }
              statsMap['홍시찹쌀떡'].totalAmount += item.amount;
            } else if (
              item.name === '홍시 식혜' &&
              item.option.includes('340ml')
            ) {
              if (!statsMap['홍시 식혜 340ml']) {
                statsMap['홍시 식혜 340ml'] = {
                  totalQuantity: 0,
                  totalAmount: 0,
                };
              }
              if (item.option.includes('3병')) {
                statsMap['홍시 식혜 340ml'].totalQuantity += item.quantity * 3;
              } else {
                statsMap['홍시 식혜 340ml'].totalQuantity += item.quantity;
              }
              statsMap['홍시 식혜 340ml'].totalAmount += item.amount;
            } else if (
              item.name === '홍시 식혜' &&
              item.option.includes('1L')
            ) {
              if (!statsMap['홍시 식혜 1L']) {
                statsMap['홍시 식혜 1L'] = { totalQuantity: 0, totalAmount: 0 };
              }
              if (item.option.includes('3병')) {
                statsMap['홍시 식혜 1L'].totalQuantity += item.quantity * 3;
              } else {
                statsMap['홍시 식혜 1L'].totalQuantity += item.quantity;
              }
              statsMap['홍시 식혜 1L'].totalAmount += item.amount;
            }
          });
        });

        const result = Object.values(itemMap).map((item, index) => ({
          ...item,
          key: String(index),
        }));

        const totalAmount = result.reduce(
          (sum, item: any) => sum + item.amount,
          0
        );

        const transactions = await getTransactionsByDateRange(
          startDate,
          endDate
        );
        const transactionCount = transactions.length;
        const averageOrderValue =
          transactionCount > 0 ? Math.round(totalAmount / transactionCount) : 0;

        setRows(result);
        setTotal(totalAmount);
        setItemStats(statsMap);

        setItemStats((prev) => ({
          ...prev,
          '평균 객단가': { totalQuantity: averageOrderValue, totalAmount: 0 },
        }));
      } catch {
        message.error('데이터 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [startDate, endDate]);

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0].format('YYYY-MM-DD'));
      setEndDate(dates[1].format('YYYY-MM-DD'));
    }
  };

  return {
    startDate,
    endDate,
    rows,
    total,
    loading,
    itemStats,
    handleDateRangeChange,
  };
};
