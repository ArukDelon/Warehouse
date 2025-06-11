import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {Col, Row} from "react-bootstrap";

const AlertPieCharts = ({ alerts, zones }) => {
    // Обробка даних для діаграм
    const alertData = [
        { name: 'Complete', value: alerts.filter(a => a.isResolved).length },
        { name: 'Active', value: alerts.filter(a => !a.isResolved).length }
    ];

    const zoneCapacityData = zones.map(zone => ({
        name: zone.name,
        value: zone.storedProducts.reduce((sum, p) => sum + p.volume, 0) / zone.maxVolume * 100
    }));

    const sensorAlertData = [
        { name: 'with Alert', value: [...new Set(alerts.map(a => a.sensorId))].length },
        { name: 'without Alert', value: zones.reduce((sum, z) => sum + z.sensors.length, 0) - [...new Set(alerts.map(a => a.sensorId))].length }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Row className="mb-4">
            <Col md={4}>
                <div style={{ padding: '10px', borderRadius: '5px', height: '100%' }}>
                    <h4 style={{ textAlign: 'center' }}>Alerts status</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={alertData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {alertData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} alerts`, value === 1 ? 'alert' : 'alerts']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Col>

            <Col md={4}>
                <div style={{ padding: '10px', borderRadius: '5px', height: '100%' }}>
                    <h4 style={{ textAlign: 'center' }}>Zones Load</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={zoneCapacityData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {zoneCapacityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'load']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Col>

            <Col md={4}>
                <div style={{ padding: '10px', borderRadius: '5px', height: '100%' }}>
                    <h4 style={{ textAlign: 'center' }}>Scanners Data</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={sensorAlertData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {sensorAlertData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} scanner`, value === 1 ? 'scanner' : 'scanners']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Col>
        </Row>
    );
};

export default AlertPieCharts;