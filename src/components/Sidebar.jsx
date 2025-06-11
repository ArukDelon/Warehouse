import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Smart Warehouse</h2>
            <nav>
                <Link to="/">Dashboard</Link>
                <Link to="/store">Store</Link>
                <Link to="/history">History</Link>
            </nav>
        </div>
    );
};

export default Sidebar;