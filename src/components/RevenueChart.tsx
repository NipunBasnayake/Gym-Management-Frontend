import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RevenueChartProps {
  period: '7days' | '30days' | '3months' | '1year';
}

const generateRevenueData = (period: string) => {
  const data = [];
  let months = 6;
  
  switch (period) {
    case '7days':
      months = 1;
      break;
    case '30days':
      months = 3;
      break;
    case '3months':
      months = 6;
      break;
    case '1year':
      months = 12;
      break;
  }
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    data.push({
      month: date.toLocaleDateString('en-US', { 
        month: 'short',
        year: '2-digit'
      }),
      membership: Math.floor(Math.random() * 8000) + 10000, // 10k-18k
      personal: Math.floor(Math.random() * 3000) + 2000,    // 2k-5k
      classes: Math.floor(Math.random() * 2000) + 1000,     // 1k-3k
      merchandise: Math.floor(Math.random() * 1000) + 500,  // 500-1.5k
    });
  }
  
  return data;
};

export default function RevenueChart({ period }: RevenueChartProps) {
  const data = generateRevenueData(period);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      
      return (
        <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
          <p className="font-medium text-slate-800 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {entry.name}:
                </span>
              </div>
              <span className="text-sm font-medium text-slate-800 dark:text-white">
                ${entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t border-slate-200 dark:border-slate-600 mt-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total:</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.3}
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `$${(value / 1000)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground))'
            }}
          />
          <Bar 
            dataKey="membership" 
            stackId="a" 
            fill="hsl(var(--chart-1))" 
            name="Membership"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="personal" 
            stackId="a" 
            fill="hsl(var(--chart-2))" 
            name="Personal Training"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="classes" 
            stackId="a" 
            fill="hsl(var(--chart-3))" 
            name="Classes"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="merchandise" 
            stackId="a" 
            fill="hsl(var(--chart-4))" 
            name="Merchandise"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}