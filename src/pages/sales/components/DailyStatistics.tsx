import { Card, Statistic } from 'antd';

interface Props {
  itemStats: Record<string, SalesItemStats>;
  total: number;
}

function DailyStatistics({ itemStats, total }: Props) {
  return (
    <div className="flex flex-wrap gap-6 mb-6">
      <div className="flex-1 min-w-[150px] max-w-[350px]">
        <Card bordered={false} className="h-full">
          <Statistic
            title={<span className="text-[16px] font-bold">홍시찹쌀떡</span>}
            value={itemStats['홍시찹쌀떡']?.totalQuantity || 0}
            suffix="개"
            precision={0}
            valueStyle={{ color: '#1e1e1e', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
      </div>

      <div className="flex-1 min-w-[150px] max-w-[350px]">
        <Card bordered={false} className="h-full">
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
      </div>

      <div className="flex-1 min-w-[150px] max-w-[350px]">
        <Card bordered={false} className="h-full">
          <Statistic
            title={<span className="text-[16px] font-bold">홍시 식혜 1L</span>}
            value={itemStats['홍시 식혜 1L']?.totalQuantity || 0}
            suffix="개"
            precision={0}
            valueStyle={{ color: '#1e1e1e', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
      </div>

      <div className="flex-1 min-w-[150px] max-w-[350px]">
        <Card bordered={false} className="h-full">
          <Statistic
            title={<span className="text-[16px] font-bold">평균 객단가</span>}
            value={itemStats['평균 객단가']?.totalQuantity || 0}
            suffix="원"
            precision={0}
            valueStyle={{ color: '#1e1e1e', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
      </div>

      <div className="flex-1 min-w-[180px] max-w-[350px]">
        <Card bordered={false} className="h-full">
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
    </div>
  );
}

export default DailyStatistics;
