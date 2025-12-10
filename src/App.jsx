import { useEffect, useMemo, useState } from 'react'
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from './lib/firebase'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [status, setStatus] = useState('Connecting to Firestore…')
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')

  const notesCollection = useMemo(() => collection(db, 'notes'), [])

  useEffect(() => {
    const loadNotes = async () => {
      setStatus('Loading notes…')
      try {
        const snapshot = await getDocs(notesCollection)
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        list.sort((a, b) => {
          const aTime = a.createdAt?.seconds ?? 0
          const bTime = b.createdAt?.seconds ?? 0
          return bTime - aTime
        })

        setNotes(list)
        setStatus('Connected to Firestore')
      } catch (err) {
        setError(err.message)
        setStatus('Could not reach Firestore')
      }
    }

    loadNotes()
  }, [notesCollection])

  const addNote = async (event) => {
    event.preventDefault()
    if (!draft.trim()) return

    const newNote = {
      text: draft.trim(),
      createdAt: serverTimestamp(),
    }

    try {
      const docRef = await addDoc(notesCollection, newNote)
      setNotes((current) => [
        {
          id: docRef.id,
          ...newNote,
        },
        ...current,
      ])
      setDraft('')
      setError('')
      setStatus('Saved to Firestore')
    } catch (err) {
      setError(err.message)
      setStatus('Could not save note')
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Voxel Game • Firebase</p>
          <h1>Firestore is wired up</h1>
          <p className="lede">
            Add a note to the `notes` collection to verify your Firebase project is connected.
            You can replace this with your game data later.
          </p>
        </div>
        <div className="status">
          <span className={`dot ${error ? 'dot-error' : 'dot-ok'}`} />
          <span>{status}</span>
        </div>
      </header>

      {error ? (
        <div className="alert">
          <strong>Firestore error:</strong> {error}
        </div>
      ) : null}

      <section className="panel">
        <form className="form" onSubmit={addNote}>
          <label htmlFor="note">Add a note</label>
          <div className="input-row">
            <input
              id="note"
              name="note"
              type="text"
              placeholder="e.g. First cloud save"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              autoComplete="off"
            />
            <button type="submit">Save</button>
          </div>
        </form>

        <div className="list">
          {notes.length === 0 ? (
            <p className="muted">No notes yet—add one to confirm Firestore writes.</p>
          ) : (
            notes.map((note) => (
              <article key={note.id} className="list-item">
                <p>{note.text}</p>
                <p className="timestamp">
                  {note.createdAt?.toDate
                    ? note.createdAt.toDate().toLocaleString()
                    : 'Pending server time…'}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}

export default App
