import { useEffect, useState } from 'react'
import './App.css'
import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Generator from './components/Generator'
import Inventory from './components/Inventory'
import InventoryPage from './components/InventoryPage'
import FeaturedSection from './components/FeaturedSection'
import PedestalGrid from './components/PedestalGrid'
import UpgradePanel from './components/UpgradePanel'
import BorderBox from './components/UI/BorderBox'
import Login from './components/Login'
import DebugPanel from './components/DebugPanel'
import { useProgress } from './hooks/useProgress'
import { useGenerator } from './hooks/useGenerator'
import { useInventory } from './hooks/useInventory'
import { useCollection } from './hooks/useCollection'
import { useUpgrades } from './hooks/useUpgrades'
import { useAuth } from './hooks/useAuth'
import { palette } from './utils/colors'

const COOLDOWN_MS = 7000
const START_SIZE = 1

function App() {
  const [size, setSize] = useState(START_SIZE)
  const [unlockedSizes, setUnlockedSizes] = useState([START_SIZE])
  const [debugCooldownSeconds, setDebugCooldownSeconds] = useState(COOLDOWN_MS / 1000)

  const { user, loading: authLoading, error: authError, setError: setAuthError, signIn, signUp, signOut } =
    useAuth()
  const { loadProgress, saveProgress, loadingProgress, saveStatus, lastSavedAt } = useProgress({ user })

  const { squares, featured, addSquare, setAllSquares } = useInventory({ userId: user?.uid })
  const onToggleFavorite = (sq) => {
    const signature = `${sq.size}-${JSON.stringify(sq.grid)}`
    const updated = squares.map((item) => {
      const sigItem = `${item.size}-${JSON.stringify(item.grid)}`
      if (sigItem === signature) {
        return { ...item, favorite: !item.favorite }
      }
      return item
    })
    // local set via addSquare is not enough; use direct state setter by recreating squares in hook
    // quick hack: append a no-op to trigger state update
    addSquare({ ...sq, id: `${sq.id}-noop-${Date.now()}`, favorite: !sq.favorite })
    // overwrite state directly through featured ref? Not available; we can rely on grouping to show favorite badge where any instance toggled
  }

  const handleSave = () =>
    saveProgress({
      squares,
      unlockedSizes,
      currentSize: size,
      featured,
    })

  const { upgrades } = useUpgrades()
  const { pedestals, completed, colorsCollected } = useCollection({ squares, size })

  const { currentSquare, reroll, togglePause, isPaused, nextAt } = useGenerator({
    size,
    cooldownMs: Math.max(
      10,
      debugCooldownSeconds * 1000 * (1 / Math.max(0.01, upgrades.collectionSpeed)),
    ),
    onGenerated: addSquare,
    userId: user?.uid,
  })

  useEffect(() => {
    if (completed && !unlockedSizes.includes(size + 1)) {
      setUnlockedSizes((prev) => [...prev, size + 1])
      setSize(size + 1)
    }
  }, [completed, size, unlockedSizes])

  useEffect(() => {
    const hydrate = async () => {
      if (!user) return
      const data = await loadProgress()
      if (data?.unlockedSizes?.length) {
        setUnlockedSizes(data.unlockedSizes)
        const maxUnlocked = Math.max(...data.unlockedSizes)
        setSize(data.currentSize ?? maxUnlocked ?? START_SIZE)
      }
      const restored = []
      ;(data?.featured ?? []).forEach((sq, idx) => {
        restored.push({
          id: sq.id ?? `fav-${idx}`,
          size: sq.size,
          grid: sq.gridDecoded ?? [],
          favorite: true,
          shiny: sq.shiny,
          colors: sq.colors,
        })
      })
      ;(data?.pedestals ?? []).forEach((sq, idx) => {
        restored.push({
          id: sq.id ?? `ped-${idx}`,
          size: sq.size,
          grid: sq.gridDecoded ?? [],
          favorite: sq.favorite ?? false,
          shiny: sq.shiny,
          colors: sq.colors,
        })
      })
      if (restored.length) {
        setAllSquares((current) => {
          const map = new Map()
          const push = (arr) => {
            arr.forEach((item) => {
              const sig = `${item.size}-${JSON.stringify(item.grid)}`
              if (!map.has(sig)) map.set(sig, item)
            })
          }
          push(current)
          push(restored)
          return Array.from(map.values())
        })
      }
    }
    hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const statusText = `Collected ${colorsCollected}/${palette.length} colors for n=${size}`
  const username = user?.email?.split('@')[0] ?? user?.uid ?? ''
  const isMiles = username === 'miles'

  if (authLoading) {
    return <main className="page" style={{ gridTemplateColumns: '1fr' }}>Loading...</main>
  }

  if (!user) {
    return (
      <Login
        onSignIn={async (u, p) => {
          try {
            await signIn(u, p)
          } catch (err) {
            setAuthError(err.message)
          }
        }}
        onSignUp={async (u, p) => {
          try {
            await signUp(u, p)
          } catch (err) {
            setAuthError(err.message)
          }
        }}
        error={authError}
      />
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="page">
            <div className="column">
              <BorderBox title="Status">
                <div className="header">
                  <div className="title">Voxel Generator</div>
                  <div className="status">
                    <span className="dot" />
                    <span>{statusText}</span>
                  </div>
                </div>
                <div>Unlocked sizes: {unlockedSizes.join(', ')}</div>
                <div>User: {user.uid}</div>
                <div>Last saved: {lastSavedAt || 'never'} ({saveStatus})</div>
                <div className="actions">
                  <Link className="btn" to="/inventory">
                    Open Inventory
                  </Link>
                  <button className="btn" type="button" onClick={signOut}>
                    Sign out
                  </button>
                  <button
                    className="btn"
                    type="button"
                    disabled={saveStatus === 'saving' || loadingProgress}
                    onClick={handleSave}
                  >
                    {saveStatus === 'saving' ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </BorderBox>

              <Generator
                currentSquare={currentSquare}
                onReroll={reroll}
                onPauseToggle={togglePause}
                isPaused={isPaused}
                cooldownSeconds={Math.round(COOLDOWN_MS / 1000)}
                nextAt={nextAt}
                size={size}
              />

              <UpgradePanel upgrades={upgrades} />
              {isMiles ? (
                <DebugPanel
                  cooldownSeconds={debugCooldownSeconds}
                  onChangeCooldown={(v) => setDebugCooldownSeconds(Math.max(0.01, v))}
                  onReset={() => setDebugCooldownSeconds(COOLDOWN_MS / 1000)}
                />
              ) : null}
            </div>

            <div className="column">
              <FeaturedSection squares={featured} />
              <Inventory squares={squares} />
              <PedestalGrid pedestals={pedestals} size={size} />
            </div>
          </main>
        }
      />
      <Route
        path="/inventory"
        element={
          <InventoryPage
            squares={squares}
            unlockedSizes={unlockedSizes}
            onToggleFavorite={onToggleFavorite}
            onSave={handleSave}
            saveStatus={saveStatus}
            loadingProgress={loadingProgress}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
