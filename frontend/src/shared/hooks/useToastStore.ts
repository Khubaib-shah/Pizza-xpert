import { create } from 'zustand';

interface ToastState {
  toast: {
    id: number;
    message: string;
    visible: boolean;
  } | null;
  showNotification: (message: string) => void;
  hideNotification: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showNotification: (message) => {
    const id = Date.now();
    set({ toast: { id, message, visible: true } });
    setTimeout(() => {
      set((state) =>
        state.toast?.id === id ? { toast: { ...state.toast, visible: false } } : state
      );
    }, 3000);
  },
  hideNotification: (id) => set((state) => 
    state.toast?.id === id ? { toast: { ...state.toast, visible: false } } : state
  ),
}));
