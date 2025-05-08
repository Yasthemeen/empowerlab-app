/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

export const useInputStore = create((set) => ({
  inputs: {},
  setInput: (key, value) => set((state) => ({
    inputs: { ...state.inputs, [key]: value },
  })),
  resetInputs: () => set({ inputs: {} }),
}));
