// src/pages/dashboard/components/HourlySalesModal.tsx
import { Modal, Select } from 'antd';
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
import { useMemo, useState } from 'react';

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
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  hourlySalesData: Record<string, number[]>; // 날짜별 시간대별 매출
  avgHourlySales: number[]; // 시간대별 평균 매출
  dates: string[]; // 모든 날짜 목록
}

function HourlySalesModal({
  modalVisible,
  setModalVisible,
  hourlySalesData,
  avgHourlySales,
  dates,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string | '평균'>('평균');

  const chartData = useMemo(() => {
    // 10시부터 21시까지만 표시
    const hours = Array.from({ length: 12 }, (_, i) => `${i + 10}시`);
    const data =
      selectedDate === '평균'
        ? avgHourlySales.slice(10, 22)
        : hourlySalesData[selectedDate]?.slice(10, 22) || Array(12).fill(0);

    return {
      labels: hours,
      datasets: [
        {
          label: '매출',
          data,
          borderColor: '#FF6B00',
          backgroundColor: 'rgba(255, 107, 0, 0.2)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#FF6B00',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [selectedDate, hourlySalesData, avgHourlySales]);

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
      mode: 'index' as const,
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
      title="시간대별 매출"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      width={800}
    >
      <div className="mb-4">
        <Select
          value={selectedDate}
          onChange={setSelectedDate}
          style={{ width: 200 }}
          options={[
            { value: '평균', label: '평균 시간대별 매출' },
            ...dates.map((date) => ({
              value: date,
              label: `${dayjs(date).format('YYYY-MM-DD')} (${dayjs(date).format(
                'ddd'
              )})`,
            })),
          ]}
        />
      </div>

      <div style={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </Modal>
  );
}

export default HourlySalesModal;
