import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Container } from '../components/layout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Placeholder components
const Home = () => <Container className="py-8"><div>Home Page</div></Container>
const CreateTrip = () => <Container className="py-8"><div>Create Trip Page</div></Container>
const Trips = () => <Container className="py-8"><div>Trips Page</div></Container>
const TripDetail = () => <Container className="py-8"><div>Trip Detail Page</div></Container>
const Profile = () => <Container className="py-8"><div>Profile Page</div></Container>
const Search = () => <Container className="py-8"><div>Search Page</div></Container>
const Calendar = () => <Container className="py-8"><div>Calendar Page</div></Container>
const Community = () => <Container className="py-8"><div>Community Page</div></Container>
const Admin = () => <Container className="py-8"><div>Admin Page</div></Container>

// Route guards
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth()
  return isAuthenticated && user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />
}

// Auth route guard - redirect authenticated users away from auth pages
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
      
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      
      {/* Protected Routes */}
      <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
      <Route path="/trip/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    </Routes>
  )
}