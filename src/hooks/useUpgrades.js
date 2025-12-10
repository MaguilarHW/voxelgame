import { useState } from 'react'

export const useUpgrades = () => {
  const [upgrades, setUpgrades] = useState({
    colorHighlighting: true,
    patternDetection: true,
    collectionSpeed: 1,
    rerollEnabled: true,
    pauseEnabled: true,
    speedBoostEnabled: false,
  })

  return { upgrades, setUpgrades }
}


