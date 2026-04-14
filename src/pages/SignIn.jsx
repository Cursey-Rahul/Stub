import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export default function SignIn({ onGoSignUp }) {
  const { login, continueAsGuest } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError(err.code === 'auth/invalid-credential' ? 'Wrong email or password.' : 'Sign in failed.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <h1 className={styles.logo}>STREAMVAULT</h1>
        <h2 className={styles.heading}>Sign In</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input className={styles.input} type="email" placeholder="Email" value={email}
            onChange={e => { setEmail(e.target.value); setError('') }} />
          <input className={styles.input} type="password" placeholder="Password" value={password}
            onChange={e => { setPassword(e.target.value); setError('') }} />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <button className={styles.guestBtn} onClick={continueAsGuest}>
          Continue as Guest
        </button>

        <p className={styles.switchText}>
          New here?{' '}
          <button className={styles.switchLink} onClick={onGoSignUp}>Create an account</button>
        </p>
      </div>
    </div>
  )
}
