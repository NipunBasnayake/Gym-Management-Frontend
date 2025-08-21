import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MemberGrowthChartProps {
  period: '7days' | '30days' | '3months' | '1year';
}

const generateGrowthData = (period: string) => {
  const data = [];
  let months = 3;
  
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

  let totalMembers = 150;
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    const newMembers = Math.floor(Math.random() * 15) + 5;
    totalMembers += newMembers;
    
    data.push({
      month: date.toLocaleDateString('en-US', { 
        month: 'short',
        year: '2-digit'
      }),
      totalMembers,
      newMembers,
      activeMembers: Math.floor(totalMembers * 0.9),
    });
  }
  
  return data;
};

export default function MemberGrowthChart({ period }: MemberGrowthChartProps) {
  const data = generateGrowthData(period);

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
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="totalMembers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="activeMembers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-success))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-success))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="totalMembers" 
            stroke="hsl(var(--chart-3))" 
            fillOpacity={1} 
            fill="url(#totalMembers)"
            strokeWidth={2}
            name="Total Members"
          />
          <Area 
            type="monotone" 
            dataKey="activeMembers" 
            stroke="hsl(var(--chart-success))" 
            fillOpacity={1} 
            fill="url(#activeMembers)"
            strokeWidth={2}
            name="Active Members"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}