import { useEffect, useState } from 'react';
import {
  DatePicker,
  Table,
  Typography,
  Card,
  Spin,
  message,
  Button,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { deleteTransaction, getTransactionsByDateRange } from '../salesService';
import { getToday } from '../date';

interface TransactionTableItem {
  key: string;
  id: string;
  time: string;
  items: string;
  quantity: number;
  amount: number;
}

const { Title } = Typography;

const TransactionPage = () => {
  const [date, setDate] = useState(getToday());
  const [rows, setRows] = useState<TransactionTableItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const columns: ColumnsType<TransactionTableItem> = [
    {
      title: 'NO',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: '시간',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      align: 'center',
    },
    {
      title: '상품',
      dataIndex: 'items',
      key: 'items',
      render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right',
    },
    {
      title: '가격',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      render: (amount) => `${amount.toLocaleString()}원`,
    },
    {
      title: '관리',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleCancelTransaction(record.id, record.amount)}
        >
          결제 취소
        </Button>
      ),
    },
  ];

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (date: any) => {
    if (date) {
      setDate(date.format('YYYY-MM-DD'));
    }
  };

  return (
    <div className="w-full p-[40px] bg-gray-50 h-full flex-1 overflow-y-auto">
      <Title level={2} style={{ marginBottom: 24 }}>
        거래 내역
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="text-xl font-bold">조회일자</span>
          <DatePicker
            defaultValue={dayjs(date)}
            onChange={handleDateChange}
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
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `총 ${total}건`,
            position: ['bottomCenter'],
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
          }}
          size="large"
          bordered
          style={{ marginBottom: 24 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={6} align="right">
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

export default TransactionPage;
