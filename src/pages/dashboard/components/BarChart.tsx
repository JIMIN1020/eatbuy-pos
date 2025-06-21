import { Card } from 'antd';
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
    interaction: {
      intersect: false,
    },
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
        offset: -5,
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
      <div className="w-full flex justify-between items-center mb-4 gap-2">
        <h2 className="text-[16px] lg:text-lg xl:text-xl font-bold">{title}</h2>
        <span className="text-md lg:text-base xl:text-lg w-max shrink-0 font-bold border border-punta-orange rounded-[60px] px-3 py-1">
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
