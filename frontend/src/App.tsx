import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleBasedRoute } from './routes/ProtectedRoutes';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import ViewSlots from './pages/ViewSlots';
import MyAppointments from './pages/MyAppointments';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import SetAvailability from './pages/provider/SetAvailability';
import DailySchedule from './pages/provider/DailySchedule';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* USER Routes */}
            <Route element={<RoleBasedRoute allowedRole="USER" />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/services/:id" element={<ViewSlots />} />
              <Route path="/appointments" element={<MyAppointments />} />
            </Route>

            {/* SERVICE_PROVIDER Routes */}
            <Route element={<RoleBasedRoute allowedRole="SERVICE_PROVIDER" />}>
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/services/:id/availability" element={<SetAvailability />} />
              <Route path="/provider/schedule" element={<DailySchedule />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
