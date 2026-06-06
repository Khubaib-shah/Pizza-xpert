import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SimulatedOrder, OrderStage } from '../../../types';

interface OrderState {
  activeOrder: SimulatedOrder | null;
  trackerOpen: boolean;
  setActiveOrder: (order: SimulatedOrder | null) => void;
  setTrackerOpen: (isOpen: boolean) => void;
  advanceStage: (orderId: string, nextStage: OrderStage) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      activeOrder: null,
      trackerOpen: false,
      
      setActiveOrder: (order) => set({ activeOrder: order }),
      
      setTrackerOpen: (isOpen) => set({ trackerOpen: isOpen }),
      
      advanceStage: (orderId, nextStage) => set((state) => {
        if (state.activeOrder && state.activeOrder.id === orderId) {
          return { activeOrder: { ...state.activeOrder, stage: nextStage } };
        }
        return state;
      }),
    }),
    {
      name: 'pizzaxpert_order_store',
    }
  )
);
