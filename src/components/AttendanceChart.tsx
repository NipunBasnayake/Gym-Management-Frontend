import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceChartProps {
  period: '7days' | '30days' | '3months' | '1year';
}

const generateMockData = (period: string) => {
  const data = [];
  let days = 7;
  
  switch (period) {
    case '30days':
      days = 30;
      break;
    case '3months':
      days = 90;
      break;
    case '1year':
      days = 365;
      break;
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      attendance: Math.floor(Math.random() * 40) + 30, // Random between 30-70
      checkins: Math.floor(Math.random() * 60) + 40,
      checkouts: Math.floor(Math.random() * 55) + 35,
    });
  }
  
  return data;
};

export default function AttendanceChart({ period }: AttendanceChartProps) {
  const data = generateMockData(period);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
          <p className="font-medium text-slate-800 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.3}
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="checkins" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--chart-1))', strokeWidth: 2 }}
            name="Check-ins"
          />
          <Line 
            type="monotone" 
            dataKey="checkouts" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--chart-2))', strokeWidth: 2 }}
            name="Check-outs"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}