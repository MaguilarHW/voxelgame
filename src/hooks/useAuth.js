import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const usernameToEmail = (username) => `${username}@user.local`

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signIn = async (username, password) => {
    setError('')
    const email = usernameToEmail(username.trim().toLowerCase())
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (username, password) => {
    setError('')
    const email = usernameToEmail(username.trim().toLowerCase())
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return { user, loading, error, setError, signIn, signUp, signOut }
}


