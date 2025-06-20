import { Spin } from 'antd';
import DailySalesModal from '../dashboard/components/DailySalesModal';
import HourlySalesModal from '../dashboard/components/HourlySalesModal';
import StatisticsCards from '../dashboard/components/StatisticsCards';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import BarChart from '../dashboard/components/BarChart';
import { useDashboard } from '../../hooks/useDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardPage() {
  const {
    loading,
    totalSales,
    averageOrderValue,
    bestDay,
    bestHour,
    chartColor,
    chartModalVisible,
    setChartModalVisible,
    hourlyChartModalVisible,
    setHourlyChartModalVisible,
    salesTrendData,
    chartData,
    hourlySalesData,
    avgHourlySales,
    salesDates,
  } = useDashboard();

  const riceCakeChartData = {
    labels: chartData['홍시찹쌀떡']?.data.map((item) => item.category) || [],
    datasets: [
      {
        label: '판매량',
        data: chartData['홍시찹쌀떡']?.data.map((item) => item.value) || [],
        backgroundColor: chartColor,
        borderColor: chartColor,
        borderWidth: 1,
      },
    ],
  };

  const sikhye340ChartData = {
    labels:
      chartData['홍시 식혜 340ml']?.data.map((item) => item.category) || [],
    datasets: [
      {
        label: '판매량',
        data:
          chartData['홍시 식혜 340ml']?.data.map((item) => item.value) || [],
        backgroundColor: chartColor,
        borderColor: chartColor,
        borderWidth: 1,
      },
    ],
  };

  const sikhye1LChartData = {
    labels: chartData['홍시 식혜 1L']?.data.map((item) => item.category) || [],
    datasets: [
      {
        label: '판매량',
        data: chartData['홍시 식혜 1L']?.data.map((item) => item.value) || [],
        backgroundColor: chartColor,
        borderColor: chartColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full p-[40px] bg-gray-50 h-full flex-1 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[24px] font-bold mb-0">영업 분석</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <StatisticsCards
            totalSales={totalSales}
            averageOrderValue={averageOrderValue}
            bestDay={bestDay}
            bestHour={bestHour}
            setChartModalVisible={setChartModalVisible}
            setHourlyChartModalVisible={setHourlyChartModalVisible}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BarChart
              title="홍시 찹쌀떡 판매 현황"
              totalQuantity={chartData['홍시찹쌀떡']?.totalQuantity || 0}
              data={riceCakeChartData}
            />
            <BarChart
              title="홍시 식혜 340ml 판매 현황"
              totalQuantity={chartData['홍시 식혜 340ml']?.totalQuantity || 0}
              data={sikhye340ChartData}
            />
            <BarChart
              title="홍시 식혜 1L 판매 현황"
              totalQuantity={chartData['홍시 식혜 1L']?.totalQuantity || 0}
              data={sikhye1LChartData}
            />
          </div>

          <DailySalesModal
            chartModalVisible={chartModalVisible}
            setChartModalVisible={setChartModalVisible}
            salesTrendData={salesTrendData}
          />

          <HourlySalesModal
            modalVisible={hourlyChartModalVisible}
            setModalVisible={setHourlyChartModalVisible}
            hourlySalesData={hourlySalesData}
            avgHourlySales={avgHourlySales}
            dates={salesDates}
          />
        </>
      )}
    </div>
  );
}

export default DashboardPage;
