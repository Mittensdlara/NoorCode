'use client';

import { create } from 'zustand';

type UIState = {
  isChatOpen: boolean;
  toggleChat: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isChatOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen }))
}));
