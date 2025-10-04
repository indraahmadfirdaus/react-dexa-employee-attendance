import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { useAuthStore } from './store/auth/authStore'

import Login from './pages/auth/Login'
import AttendancePage from './pages/attendance/AttendancePage'
import SummaryPage from './pages/summary/SummaryPage'
import ProfilePage from './pages/profile/ProfilePage'
import ProfileUpdatePage from './pages/profile/ProfileUpdatePage'

import Layout from './components/layout/Layout'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="app-theme">
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/attendance" replace />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="summary" element={<SummaryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/update" element={<ProfileUpdatePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App