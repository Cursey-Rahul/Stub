import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export default function SignUp({ onGoSignIn }) {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')
    try {
      await signup(email, password, name)
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'Email already in use.' : 'Sign up failed.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <h1 className={styles.logo}>STUB</h1>
        <h2 className={styles.heading}>Create Account</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input className={styles.input} type="text" placeholder="Full Name" value={name}
            onChange={e => { setName(e.target.value); setError('') }} />
          <input className={styles.input} type="email" placeholder="Email" value={email}
            onChange={e => { setEmail(e.target.value); setError('') }} />
          <input className={styles.input} type="password" placeholder="Password (min 6 chars)" value={password}
            onChange={e => { setPassword(e.target.value); setError('') }} />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.divider}><span>or</span></div>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <button className={styles.switchLink} onClick={onGoSignIn}>Sign in</button>
        </p>
      </div>
    </div>
  )
}
