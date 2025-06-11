import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const TemperatureHumidityChart = ({ data }) => {
    // data = [
    //   { timestamp: '2025-06-10 08:00', temperature: 22.5, humidity: 55.3 },
    //   ...
    // ]

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tickFormatter={timeStr => timeStr.slice(11,16)} // Показуємо тільки час (hh:mm)
                    angle={-45}
                    textAnchor="end"
                    height={60}
                />
                <YAxis yAxisId="left" domain={['auto', 'auto']} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ff7300"
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Temperature (°C)"
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#387908"
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Humidity (%)"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TemperatureHumidityChart;