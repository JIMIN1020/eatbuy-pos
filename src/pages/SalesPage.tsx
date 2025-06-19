/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  DatePicker,
  Table,
  Typography,
  Card,
  Spin,
  message,
  Statistic,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  getSalesByDateRange,
  getTransactionsByDateRange,
} from '../firebase/salesService';
import { getToday } from '../utils/date';

interface SalesItem {
  key: string;
  name: string;
  option: string;
  quantity: number;
  amount: number;
}

interface ItemStats {
  totalQuantity: number;
  totalAmount: number;
}

const { Title } = Typography;
const { RangePicker } = DatePicker;

function SalesPage() {
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [rows, setRows] = useState<SalesItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [itemStats, setItemStats] = useState<Record<string, ItemStats>>({});

  const columns: ColumnsType<SalesItem> = [
    {
      title: 'NO',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: '분류명',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <>
          {record.name} <strong>{record.option}</strong>
        </>
      ),
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'right',
    },
    {
      title: '매출',
      dataIndex: 'amount',
      key: 'amount',
      width: 200,
      align: 'right',
      render: (amount) => `${amount.toLocaleString()}원`,
    },
  ];

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const allData = await getSalesByDateRange(startDate, endDate);
        const filteredDates = Object.keys(allData).sort();

        const itemMap: Record<
          string,
          { name: string; option: string; quantity: number; amount: number }
        > = {};

        // 품목별 통계를 위한 객체 (useDashboard 로직 참고)
        const statsMap: Record<string, ItemStats> = {};

        filteredDates.forEach((date: string) => {
          const dayData = allData[date as keyof typeof allData];
          Object.values(dayData).forEach((item: any) => {
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

        // 실제 거래 건수를 가져와서 평균 객단가 계산
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

        // 평균 객단가를 statsMap에 추가
        setItemStats((prev) => ({
          ...prev,
          '평균 객단가': { totalQuantity: averageOrderValue, totalAmount: 0 },
        }));
      } catch (error) {
        console.error('데이터 조회 중 오류 발생:', error);
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

  return (
    <div className="w-full p-[40px] bg-gray-50 h-full flex-1 overflow-y-auto">
      <Title level={2} style={{ marginBottom: 24 }}>
        매출 통계
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="text-xl font-bold">영업 일자</span>
          <RangePicker
            defaultValue={[dayjs(startDate), dayjs(endDate)]}
            onChange={handleDateRangeChange}
            size="large"
            format="YYYY.MM.DD"
            allowClear={false}
          />
        </div>
      </Card>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card>
          <Statistic
            title={<span className="text-[16px] font-bold">홍시찹쌀떡</span>}
            value={itemStats['홍시찹쌀떡']?.totalQuantity || 0}
            suffix="개"
            precision={0}
            valueStyle={{ color: '#1e1e1e', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
        <Card>
          <Statistic
            title={
              <span className="text-[16px] font-bold">홍시 식혜 340ml</span>
            }
            value={itemStats['홍시 식혜 340ml']?.totalQuantity || 0}
            suffix="개"
            precision={0}
            valueStyle={{ color: '#1e1e1e', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
        <Card>
          <Statistic
            title={<span className="text-[16px] font-bold">홍시 식혜 1L</span>}
            value={itemStats['홍시 식혜 1L']?.totalQuantity || 0}
            suffix="개"
            precision={0}
            valueStyle={{ color: '#1e1e1e', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
        <Card>
          <Statistic
            title={<span className="text-[16px] font-bold">평균 객단가</span>}
            value={itemStats['평균 객단가']?.totalQuantity || 0}
            suffix="원"
            precision={0}
            valueStyle={{ color: '#1e1e1e', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
        <Card>
          <Statistic
            title={<span className="text-[16px] font-bold">총 매출</span>}
            value={total}
            suffix="원"
            precision={0}
            valueStyle={{ color: '#FF6B00', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={rows}
          pagination={false}
          size="large"
          bordered
          style={{ marginBottom: 24 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align="right">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: 18 }}>
                    {total.toLocaleString()}원
                  </span>
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      )}
    </div>
  );
}

export default SalesPage;
