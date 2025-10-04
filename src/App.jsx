import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/auth/authStore'

import Login from './pages/auth/Login'
import AttendancePage from './pages/attendance/AttendancePage'
import SummaryPage from './pages/summary/SummaryPage'
import ProfilePage from './pages/profile/ProfilePage'

import Layout from './components/layout/Layout'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            (
              <Layout />
            )
          }
        >
          <Route index element={<Navigate to="/attendance" replace />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App