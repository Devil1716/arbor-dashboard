
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { GpsTracking } from './pages/GpsTracking';
import { Sensors } from './pages/Sensors';
import { Ros2Monitor } from './pages/Ros2Monitor';
import { Status } from './pages/Status';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gps" element={<GpsTracking />} />
          <Route path="sensors" element={<Sensors />} />
          <Route path="ros2" element={<Ros2Monitor />} />
          <Route path="status" element={<Status />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
