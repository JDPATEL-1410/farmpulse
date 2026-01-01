
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { FarmModule } from './components/FarmModule';
import { WorkerModule } from './components/WorkerModule';
import { ExpenseModule } from './components/ExpenseModule';
import { ReportModule } from './components/ReportModule';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-bold tracking-widest animate-pulse">
      SYNCING WITH ATLAS...
    </div>
  );
  if (!user) return <Login />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/farms" element={<FarmModule />} />
              <Route path="/workers" element={<WorkerModule />} />
              <Route path="/expenses" element={<ExpenseModule />} />
              <Route path="/reports" element={<ReportModule />} />
            </Routes>
          </Layout>
        </AuthGuard>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
