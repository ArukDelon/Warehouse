import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const RADIAN = Math.PI / 180;

const needle = (value, cx, cy, iR, oR, color) => {
    const angle = 180 * (1 - value / 100); // Значення в межах [0–100]
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * angle);
    const cos = Math.cos(-RADIAN * angle);
    const r = 5;

    const x0 = cx;
    const y0 = cy;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [
        <circle key="needle-base" cx={x0} cy={y0} r={r} fill={color} />,
        <path key="needle" d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} Z`} fill={color} />,
    ];
};

const GaugeChartWithNeedle = ({ value, label }) => {
    const data = [
        { value: 60, color: '#28a745' },  // зелена
        { value: 25, color: '#ffc107' },  // жовта
        { value: 15, color: '#dc3545' },  // червона
    ];

    const cx = 100;
    const cy = 120;
    const iR = 50;
    const oR = 80;

    return (
        <div style={{ width: 200, height: 170, margin: 'auto' }}>
            <PieChart width={200} height={160}>
                <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    cx={cx}
                    cy={cy}
                    innerRadius={iR}
                    outerRadius={oR}
                    data={data}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                {needle(value, cx, cy, iR, oR, '#343a40')}
            </PieChart>
            <div className="text-center fw-bold" style={{ marginTop: '-20px' }}>
                {label}: {value}%
            </div>
        </div>
    );
};

export default GaugeChartWithNeedle;