import { Modal } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  chartModalVisible: boolean;
  setChartModalVisible: (visible: boolean) => void;
  salesTrendData: any[];
}

function DailySalesModal({
  chartModalVisible,
  setChartModalVisible,
  salesTrendData,
}: Props) {
  const chartData = {
    labels: salesTrendData.map((item) => dayjs(item.date).format('MM.DD')),
    datasets: [
      {
        label: '매출',
        data: salesTrendData.map((item) => item.sales),
        borderColor: '#FF6B00',
        backgroundColor: '#FF6B00',
        tension: 0.1,
        pointBackgroundColor: '#FF6B00',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `매출: ${context.parsed.y.toLocaleString()}원`;
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString() + '원';
          },
          color: '#666',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#666',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Modal
      title="일별 매출 추이"
      open={chartModalVisible}
      onCancel={() => setChartModalVisible(false)}
      footer={null}
      width={800}
    >
      {salesTrendData.length > 0 ? (
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center py-6">데이터가 없습니다</div>
      )}
    </Modal>
  );
}

export default DailySalesModal;
