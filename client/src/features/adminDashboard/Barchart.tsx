import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AdminBox } from '../adminNavLayouts/AdminUtils';
import { ChartType } from '../../data/chartData';

const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  }
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar = (props: {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) => {
  const { fill, x, y, width, height } = props;

  return (
    <path d={getPath(x!, y!, width!, height!)} stroke='none' fill={fill} />
  );
};

const Barchart = ({ data }: { data: ChartType[] }) => {
  return (
    <AdminBox>
      <h4>monthly sales (NGN'000)</h4>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart
          width={600}
          height={350}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' stroke='var(--admin-sec-text-color)' />
          <YAxis dataKey='sales' stroke='var(--admin-sec-text-color)' />
          <Tooltip />
          <Bar
            dataKey='sales'
            fill='#8884d8'
            shape={<TriangleBar />}
            label={{ position: 'top' }}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill='#bb6984' />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AdminBox>
  );
};

export default Barchart;
