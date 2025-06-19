import { Card, Typography } from 'antd';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface Props {
  title: string;
  totalQuantity: number;
  data: any;
}
function BarChart({ title, totalQuantity, data }: Props) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      datalabels: {
        display: true,
        color: '#2d2d2d',
        anchor: 'end' as const,
        align: 'top' as const,
        offset: 4,
        font: {
          weight: 'bold' as const,
          size: 16,
        },
        formatter: (value: any) => {
          return value.toLocaleString();
        },
      },
    },

    barThickness: 50,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#1c1c1c',
          font: {
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: '#1c1c1c',
          font: {
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card bordered={false} className="mb-6">
      <div className="w-full flex justify-between items-center mb-4">
        <Typography.Title level={4}>{title}</Typography.Title>
        <span className="text-xl font-bold border border-punta-orange rounded-[60px] px-4 py-2">
          {totalQuantity.toLocaleString()}개
        </span>
      </div>
      <div style={{ height: '400px' }}>
        <Bar data={data} options={chartOptions} plugins={[ChartDataLabels]} />
      </div>
    </Card>
  );
}

export default BarChart;
