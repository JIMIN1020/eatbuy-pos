// src/pages/dashboard/components/StatisticsCards.tsx
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

// dayjs 한국어 설정
dayjs.locale('ko');

interface Props {
  totalSales: number;
  averageOrderValue: number;
  bestDay: { date: string; amount: number };
  bestHour: { hour: string; amount: number };
  setChartModalVisible: (visible: boolean) => void;
  setHourlyChartModalVisible: (visible: boolean) => void;
}

const { Text } = Typography;

function StatisticsCards({
  totalSales,
  averageOrderValue,
  bestDay,
  bestHour,
  setChartModalVisible,
  setHourlyChartModalVisible,
}: Props) {
  return (
    <Row gutter={[24, 24]} className="mb-6">
      <Col xs={24} sm={12} xl={6}>
        <Card bordered={false} className="h-full">
          <Statistic
            title={
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">총 매출</span>
                <LineChartOutlined
                  className="text-punta-orange cursor-pointer text-xl"
                  onClick={() => setChartModalVisible(true)}
                />
              </div>
            }
            value={totalSales}
            suffix="원"
            precision={0}
            valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <Card bordered={false} className="h-full">
          <Statistic
            title={<span className="text-lg font-bold">평균 객단가</span>}
            value={averageOrderValue}
            suffix="원"
            precision={0}
            valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
            formatter={(value) => `${value.toLocaleString()}`}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <Card bordered={false} className="h-full">
          <Statistic
            title={<span className="text-lg font-bold">최고 매출 일자</span>}
            value={
              bestDay.date
                ? `${dayjs(bestDay.date).format('YYYY.MM.DD')} (${dayjs(
                    bestDay.date
                  ).format('ddd')})`
                : '-'
            }
            valueStyle={{ fontWeight: 'bold' }}
          />
          <div className="mt-2 text-right">
            <Text type="secondary">{bestDay.amount.toLocaleString()}원</Text>
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <Card bordered={false} className="h-full">
          <Statistic
            title={
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">최고 매출 시간대</span>
                <LineChartOutlined
                  className="text-punta-orange cursor-pointer text-xl"
                  onClick={() => setHourlyChartModalVisible(true)}
                />
              </div>
            }
            value={bestHour.hour || '-'}
            valueStyle={{ fontWeight: 'bold' }}
          />
          <div className="mt-2 text-right">
            <Text type="secondary">
              평균 {bestHour.amount.toLocaleString()}원
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default StatisticsCards;
