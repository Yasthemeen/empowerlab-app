/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

export const useInputStore = create((set) => ({
  inputs: {},
  impacts: {},
  quantifiers: {},
  setInput: (id, value) => set((state) => ({
    inputs: { ...state.inputs, [id]: value },
  })),
  setImpacts: (id, text) => set((state) => ({
    impacts: { ...state.impacts, [id]: text },
  })),
  setQuantifiers: (id, level) => set((state) => ({
    quantifiers: { ...state.quantifiers, [id]: level },
  })),
}));
