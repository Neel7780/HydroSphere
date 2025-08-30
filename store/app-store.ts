"use client"

import { create } from "zustand"

type Weights = { cost: number; renewables: number; infrastructure: number }
type Store = {
  weights: Weights
  setWeight: (key: keyof Weights, value: number) => void
  isValid: boolean
}

export const useAppStore = create<Store>((set, get) => ({
  weights: { cost: 34, renewables: 33, infrastructure: 33 },
  setWeight: (key, value) => {
    const w = { ...get().weights, [key]: value }
    const sum = w.cost + w.renewables + w.infrastructure
    set({ weights: w, isValid: sum === 100 })
  },
  isValid: true,
}))
