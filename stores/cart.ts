import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: (): ICartState => ({
    items: [],
  }),
  getters: {
    uniqueItemsCount: (state) => state.items.length,
    totalUnits: (state) =>
      state.items.reduce((acc, it) => acc + it.quantity, 0),
  },
  actions: {
    addProduct(productId: number) {
      const found = this.items.find((i) => i.productId === productId);
      if (found) {
        found.quantity++;
      } else {
        this.items.push({ productId, quantity: 1 });
      }
    },
    removeProduct(productId: number) {
      this.items = this.items.filter((i) => i.productId !== productId);
    },
    setQuantity(productId: number, qty: number) {
      const found = this.items.find((i) => i.productId === productId);
      if (found) {
        found.quantity = qty;
        if (found.quantity <= 0) this.removeProduct(productId);
      }
    },
  },
});
