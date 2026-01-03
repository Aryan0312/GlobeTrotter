import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { TripsProvider } from './contexts/TripsContext'
import { ActiveTripProvider } from './contexts/ActiveTripContext'
import { PreferencesProvider } from './contexts/PreferencesContext'
import { CommunityProvider } from './contexts/CommunityContext'
import { Layout } from './components/layout'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <TripsProvider>
          <ActiveTripProvider>
            <CommunityProvider>
              <BrowserRouter>
                <Layout>
                  <AppRoutes />
                </Layout>
              </BrowserRouter>
            </CommunityProvider>
          </ActiveTripProvider>
        </TripsProvider>
      </PreferencesProvider>
    </AuthProvider>
  )
}

export default App