import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import Home from './components/Home';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Admin/Login';
import AdminRegister from './components/Admin/Register';
import PostSoilDetails from './components/Admin/PostSoilDetails';
import PostDistributorDetails from './components/Admin/PostDistributorDetails';
import UserRegister from './components/User/Register';
import UserLogin from './components/User/Login';
import ViewSoilDetails from './components/User/ViewSoilDetails';
import ViewDistributorDetails from './components/User/ViewDistributorDetails';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const { currentUser  } = useAuth();
  
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Admin Routes */}
            <Route path="/admin/register" element ={<AdminRegister/>} />
            <Route path="/admin/login" element={
              currentUser  && currentUser.role === 'admin' ? 
                <Navigate to="/admin/dashboard" /> : 
                <AdminLogin />
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/post-soil" element={
              <ProtectedRoute requiredRole="admin">
                <PostSoilDetails />
              </ProtectedRoute>
            } />
            <Route path="/admin/post-distributor" element={
              <ProtectedRoute requiredRole="admin">
                <PostDistributorDetails />
              </ProtectedRoute>
            } />
            
            {/* User Routes */}
            <Route path="/register" element={<UserRegister />} />
            <Route path="/login" element={
              currentUser  ? 
                <Navigate to="/soil-details" /> : 
                <UserLogin />
            } />
            <Route path="/soil-details" element={
              <ProtectedRoute requiredRole="user">
                <ViewSoilDetails />
              </ProtectedRoute>
            } />
            <Route path="/distributor-details" element={
              <ProtectedRoute requiredRole="user">
                <ViewDistributorDetails />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;