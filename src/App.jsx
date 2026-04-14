import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { WatchlistProvider } from './context/WatchlistContext'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar'
import SearchModal from './components/SearchModal'
import MovieModal from './components/MovieModal'
import OfflineBanner from './components/OfflineBanner'

function AppShell() {
  const { user } = useAuth()
  const [authView, setAuthView] = useState('signin')
  const [activePage, setActivePage] = useState('home')
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  if (user === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.07)', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    )
  }

  if (!user) {
    if (authView === 'signup') return <SignUp onGoSignIn={() => setAuthView('signin')} />
    return <SignIn onGoSignUp={() => setAuthView('signup')} />
  }

  const handleCardClick = (item) => {
    setSelectedItem(item)
    setSearchOpen(false)
  }

  return (
    <>
      <Navbar
        active={activePage}
        onNavigate={page => { setActivePage(page); setProfileOpen(false) }}
        onSearch={() => setSearchOpen(true)}
        onProfile={() => setProfileOpen(p => !p)}
      />

      <Home activePage={activePage} onCardClick={handleCardClick} />

      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onCardClick={handleCardClick}
        />
      )}

      {selectedItem && (
        <MovieModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {profileOpen && (
        <ProfilePage
          onClose={() => setProfileOpen(false)}
          onCardClick={handleCardClick}
        />
      )}

      <OfflineBanner />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <AppShell />
      </WatchlistProvider>
    </AuthProvider>
  )
}
