import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Tooltip
} from "recharts";

type PieChartData = {
  label: string;
  value: number;
};

const COLORS = [
  "#001f3f", "#003366", "#004080", "#0059b3", "#0073e6", "#1a8cff",
  "#3399ff", "#4da6ff", "#66b3ff", "#80c1ff", "#99ccff", "#b3d9ff", "#cce6ff"
];

// Custom Center Label
const CustomLabel = ({ viewBox }: any) => {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs sm:text-sm md:text-base font-bold"
        fill="white"
      >
        Holders
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black bg-opacity-80 backdrop-blur-md text-white p-2 sm:p-3 rounded-lg shadow-lg border border-blue-400">
        <p className="font-semibold text-xs sm:text-sm">{payload[0].payload.payload.label}</p>
        <p className="text-xs sm:text-sm text-blue-300">{payload[0].value.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

const TokenPieChart: React.FC<{ data: PieChartData[] }> = ({ data }) => {
  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto p-4 sm:p-6 bg-black bg-opacity-50 backdrop-blur-xl shadow-2xl border border-blue-500 rounded-2xl">
      <h2 className="text-center text-sm sm:text-lg font-bold text-blue-300 mb-3 sm:mb-4">
        Token Distribution
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            stroke="none"
            label={({ value, x, y }) => (
              <text
                x={x}
                y={y}
                fill="#fff"
                fontWeight="bold"
                fontSize="10px"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {value.toFixed(2)}%
              </text>
            )}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{
                  filter: "drop-shadow(0 0 6px #60a5fa)", // Neon blue glow
                }}
              />
            ))}
            <Label content={<CustomLabel />} position="center" />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenPieChart;
