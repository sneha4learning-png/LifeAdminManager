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
                  <div className="bg-neutral-card p-8 rounded-xl border border-neutral-border shadow-soft-md text-center py-20 transition-colors duration-200">
                     <div className="w-16 h-16 bg-brand-primary/10 rounded-xl flex items-center justify-center mx-auto text-brand-primary mb-6">
                        <History size={32} />
                     </div>
                     <h2 className="heading-xl">Audit Logs Protocol</h2>
                     <p className="text-neutral-secondary text-sm mt-3 font-medium">Initialization of secure document interaction history coming soon.</p>
                  </div>
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
