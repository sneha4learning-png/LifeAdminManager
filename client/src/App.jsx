import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { History } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import AddDocument from './pages/AddDocument';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';
import AuditLogs from './pages/AuditLogs';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes (Wrapped in Layout & ProtectedRoute) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks/new" element={<Navigate to="/tasks?new=true" replace />} />
            <Route path="/documents" element={
              <ProtectedRoute>
                <Layout>
                  <Documents />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/add-document" element={
              <ProtectedRoute>
                <Layout>
                  <AddDocument />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Settings & Audit Mocks */}
            <Route path="/audit" element={
              <ProtectedRoute>
                <Layout>
                  <AuditLogs />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );

}

export default App;
