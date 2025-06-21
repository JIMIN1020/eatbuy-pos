import { DatePicker, Table, Card, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSales } from '../../hooks/useSales';
import DailyStatistics from '../sales/components/DailyStatistics';

const { RangePicker } = DatePicker;

function SalesPage() {
  const {
    startDate,
    endDate,
    rows,
    total,
    loading,
    itemStats,
    handleDateRangeChange,
  } = useSales();

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

  return (
    <div className="w-full p-[40px] bg-gray-50 h-full flex-1 overflow-y-auto">
      <h1 className="text-[24px] font-bold mb-4">매출 통계</h1>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="text-lg md:text-xl font-bold">영업 일자</span>
          <RangePicker
            defaultValue={[dayjs(startDate), dayjs(endDate)]}
            onChange={handleDateRangeChange}
            size="large"
            format="YYYY.MM.DD"
            allowClear={false}
          />
        </div>
      </Card>

      <DailyStatistics itemStats={itemStats} total={total} />

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
