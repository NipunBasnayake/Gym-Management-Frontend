import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PaymentChartProps {
  period: '7days' | '30days' | '3months' | '1year';
}

const paymentData = [
  { name: 'Credit Card', value: 45, amount: 7200, color: 'hsl(var(--chart-1))' },
  { name: 'Cash', value: 30, amount: 4800, color: 'hsl(var(--chart-2))' },
  { name: 'Bank Transfer', value: 20, amount: 3200, color: 'hsl(var(--chart-3))' },
  { name: 'Digital Wallet', value: 5, amount: 800, color: 'hsl(var(--chart-4))' },
];

export default function PaymentChart({ period }: PaymentChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
          <p className="font-medium text-slate-800 dark:text-white mb-2">{data.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Percentage: {data.value}%
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Amount: ${data.amount.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={paymentData}
            cx="50%"
            cy="45%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={5}
            dataKey="value"
          >
            {paymentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}