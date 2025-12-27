import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EquipmentList from './pages/Equipment/EquipmentList';
import EquipmentDetail from './pages/Equipment/EquipmentDetail';
import EquipmentForm from './pages/Equipment/EquipmentForm';
import RequestList from './pages/Requests/RequestList';
import RequestForm from './pages/Requests/RequestForm';
import RequestDetail from './pages/Requests/RequestDetail';
import TeamList from './pages/Teams/TeamList';
import TeamForm from './pages/Teams/TeamForm';
import Calendar from './pages/Calendar';
import Reports from './pages/Reports';

// Create placeholder components for missing pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="card p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-600">This page is under development.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Equipment Routes */}
            <Route path="/equipment" element={<ProtectedRoute><EquipmentList /></ProtectedRoute>} />
            <Route path="/equipment/new" element={<ProtectedRoute requiredRole="admin"><EquipmentForm /></ProtectedRoute>} />
            <Route path="/equipment/:id" element={<ProtectedRoute><EquipmentDetail /></ProtectedRoute>} />
            <Route path="/equipment/:id/edit" element={<ProtectedRoute requiredRole="admin"><EquipmentForm /></ProtectedRoute>} />
            
            {/* Request Routes */}
            <Route path="/requests" element={<ProtectedRoute><RequestList /></ProtectedRoute>} />
            <Route path="/requests/new" element={<ProtectedRoute><RequestForm /></ProtectedRoute>} />
            <Route path="/requests/:id" element={<ProtectedRoute><RequestDetail /></ProtectedRoute>} />
            
            {/* Team Routes */}
            <Route path="/teams" element={<ProtectedRoute requiredRole="admin"><TeamList /></ProtectedRoute>} />
            <Route path="/teams/new" element={<ProtectedRoute requiredRole="admin"><TeamForm /></ProtectedRoute>} />
            <Route path="/teams/:id/edit" element={<ProtectedRoute requiredRole="admin"><TeamForm /></ProtectedRoute>} />
            
            {/* Calendar */}
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            
            {/* Reports */}
            <Route path="/reports" element={<ProtectedRoute requiredRole="manager"><Reports /></ProtectedRoute>} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;