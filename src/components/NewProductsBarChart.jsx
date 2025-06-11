import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const NewProductsBarChart = ({ data }) => {
    // Приклад структури даних:
    // data = [
    //   { date: '2023-05-01', zona1: 15, zona2: 8 },
    //   { date: '2023-05-02', zona1: 12, zona2: 10 },
    //   ...
    // ]

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('uk-UA')} // Форматуємо дату
                />
                <YAxis
                    label={{ value: 'Products', angle: -90, position: 'insideLeft' }}
                    allowDecimals={false}
                />
                <Tooltip
                    formatter={(value) => [`${value} `, value === 1 ? 'product' : 'products']}
                    labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString('uk-UA')}`}
                />
                <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => value === 'zona1' ? 'Zone 1' : 'Zone 2'}
                />
                <Bar
                    dataKey="zona1"
                    fill="#8884d8"
                    name="Zone 1"
                />
                <Bar
                    dataKey="zona2"
                    fill="#82ca9d"
                    name="Zone 2"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default NewProductsBarChart;