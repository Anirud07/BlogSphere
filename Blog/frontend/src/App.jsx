import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import BlogList from './components/BlogList';
import MyBlogs from './components/MyBlogs';
import BookmarkedBlogs from './components/BookmarkedBlogs';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner component
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
      <Route
        path="/"
        element={isAuthenticated ? <BlogList /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/my-blogs"
        element={isAuthenticated ? <MyBlogs /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/bookmarked-blogs"
        element={isAuthenticated ? <BookmarkedBlogs /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;