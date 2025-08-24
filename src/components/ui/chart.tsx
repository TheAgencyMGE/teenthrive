import React from 'react';

// Simple chart component to replace the complex recharts one
export const Chart = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full">{children}</div>
);

export const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full">{children}</div>
);

export const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export const ChartTooltipContent = ChartTooltip;