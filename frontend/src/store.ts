import { create } from "zustand";
import Transaction from "./models/transaction";
import { getAllTransactionsAPI } from "./api";

type TransactionStore = {
  transactions: Transaction[];
  updateTransactions: () => Promise<void>;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  updateTransactions: async () => {
    const transactions = await getAllTransactionsAPI();
    set((state) => ({ ...state, transactions }));
  },
}));
