import { useState, useEffect } from 'react';
import {
  getAllSalesDataByDate,
  getAllTransactions,
} from '../firebase/salesService';
import { getToday } from '../utils/date';

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [bestDay, setBestDay] = useState({ date: '', amount: 0 });
  const [bestHour, setBestHour] = useState({ hour: '', amount: 0 });

  // 각 제품별 차트 데이터를 위한 state 추가
  const chartColor = ['#FF6B00', '#ff6a00d3', '#ff6a008c', '#ff6a0040'];

  const [chartModalVisible, setChartModalVisible] = useState(false);
  const [salesTrendData, setSalesTrendData] = useState<
    { date: string; sales: number }[]
  >([]);

  const [chartData, setChartData] = useState<{
    [key: string]: {
      totalQuantity: number;
      data: { category: string; value: number }[];
    };
  }>({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const salesByDate = await getAllSalesDataByDate();
      const transactions = await getAllTransactions();

      let total = 0; // 총 매출
      const dailySales: Record<string, number> = {}; // 날짜별 매출
      const hourlySales: Record<string, number> = {}; // 시간대별 매출
      let totalOrderCount = 0; // 총 결제건수

      const productSales: Record<string, Record<string, number>> = {
        홍시찹쌀떡: { '총 판매량': 0, '1구': 0, '5구': 0, '10구': 0 },
        '홍시 식혜 340ml': { '총 판매량': 0, 단품: 0, '3병 묶음': 0 },
        '홍시 식혜 1L': { '총 판매량': 0, 단품: 0, '3병 묶음': 0 },
      };

      /* ----- ~ 전일 매출 데이터 ----- */
      Object.entries(salesByDate).forEach(([date, salesData]) => {
        const dateTotal = Object.values(salesData).reduce(
          (sum, item) => sum + item.amount,
          0
        );
        total += dateTotal; // 총 매출
        dailySales[date] = dateTotal; // 날짜별 매출

        // 결제 건수 계산
        const totalQuantity = Object.values(salesData).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        totalOrderCount += totalQuantity;

        // 제품별 판매량 집계
        Object.values(salesData).forEach((item) => {
          if (item.name === '홍시찹쌀떡') {
            if (item.option.includes('1구')) {
              productSales['홍시찹쌀떡']['1구'] += item.quantity;
              productSales['홍시찹쌀떡']['총 판매량'] += item.quantity * 1;
            } else if (item.option.includes('5구')) {
              productSales['홍시찹쌀떡']['5구'] += item.quantity;
              productSales['홍시찹쌀떡']['총 판매량'] += item.quantity * 5;
            } else if (item.option.includes('10구')) {
              productSales['홍시찹쌀떡']['10구'] += item.quantity;
              productSales['홍시찹쌀떡']['총 판매량'] += item.quantity * 10;
            }
          } else if (
            item.name === '홍시 식혜' &&
            item.option.includes('340ml')
          ) {
            if (item.option.includes('3병')) {
              productSales['홍시 식혜 340ml']['3병 묶음'] += item.quantity;
              productSales['홍시 식혜 340ml']['총 판매량'] += item.quantity * 3;
            } else {
              productSales['홍시 식혜 340ml']['단품'] += item.quantity;
              productSales['홍시 식혜 340ml']['총 판매량'] += item.quantity;
            }
          } else if (item.name === '홍시 식혜' && item.option.includes('1L')) {
            if (item.option.includes('3병')) {
              productSales['홍시 식혜 1L']['3병 묶음'] += item.quantity;
              productSales['홍시 식혜 1L']['총 판매량'] += item.quantity * 3;
            } else {
              productSales['홍시 식혜 1L']['단품'] += item.quantity;
              productSales['홍시 식혜 1L']['총 판매량'] += item.quantity;
            }
          }
        });
      });

      /* ----- 금일 매출 데이터 ----- */
      transactions.forEach((transaction) => {
        const date = transaction.date;

        if (date !== getToday()) {
          return;
        }

        if (!salesByDate[date]) {
          total += transaction.totalAmount; // 총 매출 추가
          totalOrderCount += 1; // 결제 건수 추가

          if (!dailySales[date]) {
            dailySales[date] = 0;
          }
          dailySales[date] += transaction.totalAmount; // 날짜별 매출 추가

          // 제품별 판매량 집계
          transaction.items.forEach((item) => {
            if (item.name === '홍시찹쌀떡') {
              if (item.option.includes('1구')) {
                productSales['홍시찹쌀떡']['1구'] += item.quantity;
                productSales['홍시찹쌀떡']['총 판매량'] += item.quantity * 1;
              } else if (item.option.includes('5구')) {
                productSales['홍시찹쌀떡']['5구'] += item.quantity;
                productSales['홍시찹쌀떡']['총 판매량'] += item.quantity * 5;
              } else if (item.option.includes('10구')) {
                productSales['홍시찹쌀떡']['10구'] += item.quantity;
                productSales['홍시찹쌀떡']['총 판매량'] += item.quantity * 10;
              }
            } else if (
              item.name === '홍시 식혜' &&
              item.option.includes('340ml')
            ) {
              if (item.option.includes('3병')) {
                productSales['홍시 식혜 340ml']['3병 묶음'] += item.quantity;
                productSales['홍시 식혜 340ml']['총 판매량'] +=
                  item.quantity * 3;
              } else {
                productSales['홍시 식혜 340ml']['단품'] += item.quantity;
                productSales['홍시 식혜 340ml']['총 판매량'] += item.quantity;
              }
            } else if (
              item.name === '홍시 식혜' &&
              item.option.includes('1L')
            ) {
              if (item.option.includes('3병')) {
                productSales['홍시 식혜 1L']['3병 묶음'] += item.quantity;
                productSales['홍시 식혜 1L']['총 판매량'] += item.quantity * 3;
              } else {
                productSales['홍시 식혜 1L']['단품'] += item.quantity;
                productSales['홍시 식혜 1L']['총 판매량'] += item.quantity;
              }
            }
          });
        }
      });

      // 시간대별 매출 집계
      transactions.forEach((transaction) => {
        const hour = transaction.time.split(':')[0];
        const hourKey = `${hour}시`;
        if (!hourlySales[hourKey]) {
          hourlySales[hourKey] = 0;
        }
        hourlySales[hourKey] += transaction.totalAmount;
      });

      // 평균 객단가 계산
      const averageOrder =
        totalOrderCount > 0 ? Math.round(total / totalOrderCount) : 0;

      // 매출이 가장 높은 날짜
      let maxDay = { date: '', amount: 0 };
      Object.entries(dailySales).forEach(([date, amount]) => {
        if (amount > maxDay.amount) {
          maxDay = { date, amount };
        }
      });

      // 매출이 가장 높은 시간대
      let maxHour = { hour: '', amount: 0 };
      Object.entries(hourlySales).forEach(([hour, amount]) => {
        if (amount > maxHour.amount) {
          maxHour = { hour, amount };
        }
      });

      // 매출 추이 차트 데이터 생성
      const trendData = Object.entries(dailySales)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, sales]) => ({
          date,
          sales,
        }));

      // 제품별 판매량 집계 후 차트 데이터 생성
      const riceCakeData: { category: string; value: number }[] = [];
      const sikhye340Data: { category: string; value: number }[] = [];
      const sikhye1LData: { category: string; value: number }[] = [];

      // 홍시찹쌀떡 차트 데이터
      Object.entries(productSales['홍시찹쌀떡']).forEach(
        ([option, quantity]) => {
          if (option !== '총 판매량') {
            riceCakeData.push({
              category: option,
              value: quantity,
            });
          }
        }
      );

      // 홍시 식혜 340ml 차트 데이터
      Object.entries(productSales['홍시 식혜 340ml']).forEach(
        ([option, quantity]) => {
          if (option !== '총 판매량') {
            sikhye340Data.push({
              category: option,
              value: quantity,
            });
          }
        }
      );

      // 홍시 식혜 1L 차트 데이터
      Object.entries(productSales['홍시 식혜 1L']).forEach(
        ([option, quantity]) => {
          if (option !== '총 판매량') {
            sikhye1LData.push({
              category: option,
              value: quantity,
            });
          }
        }
      );

      setTotalSales(total);
      setAverageOrderValue(averageOrder);
      setBestDay(maxDay);
      setBestHour(maxHour);
      setSalesTrendData(trendData);

      // 각 제품별 차트 데이터 설정
      setChartData({
        홍시찹쌀떡: {
          totalQuantity: productSales['홍시찹쌀떡']['총 판매량'],
          data: riceCakeData,
        },
        '홍시 식혜 340ml': {
          totalQuantity: productSales['홍시 식혜 340ml']['총 판매량'],
          data: sikhye340Data,
        },
        '홍시 식혜 1L': {
          totalQuantity: productSales['홍시 식혜 1L']['총 판매량'],
          data: sikhye1LData,
        },
      });
    } catch (error) {
      console.error('대시보드 데이터 조회 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    totalSales,
    averageOrderValue,
    bestDay,
    bestHour,
    chartColor,
    chartModalVisible,
    setChartModalVisible,
    salesTrendData,
    chartData,
  };
};
