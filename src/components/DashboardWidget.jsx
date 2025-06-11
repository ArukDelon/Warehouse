import React, { useEffect, useState } from 'react';
import {Card, Row, Col, Spinner, Alert, Container, Navbar, Dropdown} from 'react-bootstrap';
import GaugeChartWithNeedle from './GaugeChartWithNeedle';
import TemperatureHumidityChart from "./TemperatureHumidityChart.jsx";
import NewProductsBarChart from './NewProductsBarChart';
import AlertPieCharts from './AlertPieCharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const DashboardWidget = () => {
    const [warehouse, setWarehouse] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [zones, setZones] = useState([]);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const periods = ['Today', 'This week', 'This month'];
    const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
    const warehouseData = [
        { date: '2023-05-01', zona1: 15, zona2: 8 },
        { date: '2023-05-02', zona1: 12, zona2: 10 },
        { date: '2023-05-03', zona1: 8, zona2: 15 },
        { date: '2023-05-04', zona1: 20, zona2: 5 },
        { date: '2023-05-05', zona1: 10, zona2: 12 },
        { date: '2023-05-06', zona1: 5, zona2: 18 },
        { date: '2023-05-07', zona1: 14, zona2: 9 }
    ];


    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser).token : null;

    const generateMockAlerts = () => {
        const alerts = [];
        for (let i = 1; i <= 20; i++) {
            alerts.push({
                id: i,
                sensorId: Math.floor(Math.random() * 10) + 1,
                isResolved: Math.random() > 0.5
            });
        }
        return alerts;
    };

// Мокові зони
    const generateMockZones = () => {
        const zones = [];
        for (let i = 1; i <= 5; i++) {
            const maxVolume = Math.floor(Math.random() * 2000 + 1000);
            const storedProducts = [];

            for (let j = 0; j < Math.floor(Math.random() * 5 + 1); j++) {
                storedProducts.push({
                    productId: j + 1,
                    volume: Math.floor(Math.random() * 300 + 100)
                });
            }

            const sensors = [];
            for (let s = 0; s < Math.floor(Math.random() * 3 + 1); s++) {
                sensors.push({
                    id: i * 10 + s
                });
            }

            zones.push({
                id: i,
                name: `Zone ${i}`,
                maxVolume,
                storedProducts,
                sensors
            });
        }
        return zones;
    };


    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('https://localhost:7226/api/warehouses/stats/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                if (!res.ok) {
                    throw new Error('Failed to load warehouse stats');
                }

                const data = await res.json();
                setWarehouse(data.warehouse);
                setStats(data.stats);
            } catch (err) {
                setError(err.message || 'Error loading warehouse stats');
            } finally {
                setLoading(false);
            }
        };

        setAlerts(generateMockAlerts());
        setZones(generateMockZones());

        const generateSampleData = () => {
            const start = new Date('2025-06-10T08:00:00');
            const result = [];

            for (let i = 0; i < 20; i++) {
                const time = new Date(start.getTime() + i * 15 * 60 * 1000);
                const timestamp = time.toISOString().slice(0, 16).replace('T', ' ');
                result.push({
                    timestamp,
                    temperature: 22 + Math.sin(i / 3) * 2 + Math.random() * 0.5,
                    humidity: 55 + Math.cos(i / 4) * 5 + Math.random(),
                });
            }
            return result;
        };

        setData(generateSampleData());

        if (token) {
            fetchStats();
        } else {
            window.location.href = '/login';
        }
    }, [token]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4" >
            <Navbar  className="">
                <Container>
                    <Navbar.Brand style={{color: "white"}}>Performance Report</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Dropdown onSelect={(key) => setSelectedPeriod(key)}>
                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" style={{border: '2px solid white', color: 'white'}}>
                                Period: {selectedPeriod}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {periods.map((period) => (
                                    <Dropdown.Item key={period} eventKey={period}>
                                        {period}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-start" style={{marginTop:'10px', padding: '0px', background: '#0ABAB5', border: '0px solid #ddd' }}>
                        <Card.Body style={{color:'white'}}>
                            <Card.Title>{stats?.totalItems ?? 0}</Card.Title>
                            <Card.Text>Total Items</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-start" style={{marginTop:'10px', padding: '0px', background: '#0ABAB5', border: '0px solid #ddd' }}>
                        <Card.Body style={{color:'white'}}>
                            <Card.Title>{stats?.totalWeight?.toFixed(2) ?? 0}</Card.Title>
                            <Card.Text>Total Weight (kg)</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-start" style={{marginTop:'10px', padding: '0px', background: '#0ABAB5', border: '0px solid #ddd' }}>
                        <Card.Body style={{color:'white'}}>
                            <Card.Title>{stats?.totalSensors ?? 0}</Card.Title>
                            <Card.Text>Total Sensors</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-start" style={{marginTop:'10px', padding: '0px', background: '#0ABAB5', border: '0px solid #ddd' }}>
                        <Card.Body style={{color:'white'}}>
                            <Card.Title>{stats?.totalZones ?? 0}</Card.Title>
                            <Card.Text>Total Zones</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col md={6}>
                    <div style={{ padding: '10px', background: '#ADEED9', border: '0px solid #ddd', borderRadius: '5px'}}>
                        <h3 style={{color: 'black'}}>Temperature and Humidity Over Time</h3>
                        <TemperatureHumidityChart data={data} />
                    </div>
                </Col>
                <Col md={6}>
                    <div style={{ padding: '10px', background: '#ADEED9', border: '0px solid #ddd', borderRadius: '5px'}}>
                        <h3 style={{color: 'black'}}>Warehouse Location</h3>
                        <div style={{ height: '400px', width: '100%', borderRadius: '4px', overflow: 'hidden' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(warehouse.location)}&z=16&output=embed`}
                                title="Warehouse Location"
                            >
                            </iframe>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="mb-4" style={{padding:'10px'}}>
                <Col style={{ padding: '10px', background: '#ADEED9', border: '0px solid #ddd', borderRadius: '5px'}}>
                    <AlertPieCharts alerts={alerts} zones={zones} />
                </Col>
            </Row>
            <Row className="mb-4" style={{padding:'10px'}}>
                <Col style={{ padding: '10px', background: '#ADEED9', border: '0px solid #ddd', borderRadius: '5px'}}>
                    <NewProductsBarChart data={warehouseData} />
                </Col>
            </Row>


        </Container>
    );
};

export default DashboardWidget;