/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { DatePicker, Table, Typography, Card, Spin, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getSalesByDateRange } from '../salesService';
import { getToday } from '../date';

interface SalesItem {
  key: string;
  name: string;
  option: string;
  quantity: number;
  amount: number;
}

const { Title } = Typography;
const { RangePicker } = DatePicker;

const DashboardPage = () => {
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());
  const [rows, setRows] = useState<SalesItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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
          });
        });

        const result = Object.values(itemMap).map((item, index) => ({
          ...item,
          key: String(index),
        }));

        setRows(result);
        setTotal(result.reduce((sum, item: any) => sum + item.amount, 0));
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
};

export default DashboardPage;
