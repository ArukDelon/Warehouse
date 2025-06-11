import { Routes, Route, Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { FaTachometerAlt, FaBoxes, FaThermometerHalf, FaCube, FaWarehouse } from 'react-icons/fa';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Dashboard from './pages/Dashboard';
import Store from './pages/Store';
import History from './pages/History';
import './App.css';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import WarehouseZones from "./pages/WarehouseZones.jsx";
import { useAuth } from './context/AuthContext';
import SensorsPage from "./pages/Sensors.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductStoragePage from "./pages/ProductStoragePage.jsx";

function App() {
    const { user } = useAuth();

    return (
        <>
            {/* TOP NAVBAR */}
            <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="shadow-sm">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">Smart Warehouse</Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/profile">Profile Settings</Nav.Link>
                        <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <div className="d-flex">
                {/* SIDEBAR */}
                {user && (
                    <div className="sidebar bg-dark text-white p-3">
                        <Nav className="flex-column text-start">
                            <Nav.Link as={Link} to="/" className="text-white d-flex align-items-center gap-2">
                                <FaTachometerAlt /> Dashboard
                            </Nav.Link>
                            <Nav.Link as={Link} to="/zones" className="text-white d-flex align-items-center gap-2">
                                <FaWarehouse /> Zones
                            </Nav.Link>
                            <Nav.Link as={Link} to="/sensors" className="text-white d-flex align-items-center gap-2">
                                <FaThermometerHalf /> Sensors
                            </Nav.Link>
                            <Nav.Link as={Link} to="/products" className="text-white d-flex align-items-center gap-2">
                                <FaCube /> Products
                            </Nav.Link>
                            <Nav.Link as={Link} to="/storage" className="text-white d-flex align-items-center gap-2">
                                <FaBoxes /> Storage
                            </Nav.Link>
                        </Nav>
                    </div>
                )}

                {/* CONTENT */}
                <Container fluid className="content p-4">
                    <Routes>
                        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/zones" element={<ProtectedRoute><WarehouseZones  /></ProtectedRoute>} />
                        <Route path="/sensors" element={<ProtectedRoute><SensorsPage /></ProtectedRoute>} />
                        <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                        <Route path="/storage" element={<ProtectedRoute><ProductStoragePage /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<div><h1>Profile Settings</h1></div>} />
                        <Route path="/faq" element={<div><h1>FAQ Page</h1></div>} />
                    </Routes>
                </Container>
            </div>
        </>
    );
}


export default App
