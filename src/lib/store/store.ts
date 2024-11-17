import { create } from 'zustand';
import { Transaction } from '../types/transaction';

type State = {
    transactions: Transaction[];
    categories: Array<{ id: string; name: string; userId: string; type: string }>;
    accounts: Array<{ id: string; name: string; userId: string }>;
    currentMonth: number;
    currentYear: number;
    isLoading: boolean;
    isOpen: boolean;
    isCategoryMenuOpen: boolean;
    isAccountMenuOpen: boolean;
    isAddEntityOpen: boolean;
    entityType: "category" | "account";
    handleEntity: { entityId: string; name: string; method: string } | null;
    editingTransaction: Transaction | null;
    transactionsPage: string;
    transactionsResult: Transaction[];
    categoriesResult: Array<{ id: string; name: string; userId: string; type: string }>;
    accountList: Array<{ id: string; name: string; userId: string }>;
    searchQuery: string;
    isMonthPickerOpen: boolean; // Add isMonthPickerOpen state
    setTransactions: (transactions: Transaction[]) => void;
    setCategories: (categories: Array<{ id: string; name: string; userId: string; type: string }>) => void;
    setAccounts: (accounts: Array<{ id: string; name: string; userId: string }>) => void;
    setCurrentMonth: (month: number) => void;
    setCurrentYear: (year: number) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsOpen: (isOpen: boolean) => void;
    setIsCategoryMenuOpen: (isCategoryMenuOpen: boolean) => void;
    setIsAccountMenuOpen: (isAccountMenuOpen: boolean) => void;
    setIsAddEntityOpen: (isAddEntityOpen: boolean) => void;
    setEntityType: (entityType: "category" | "account") => void;
    setHandleEntity: (handleEntity: { entityId: string; name: string; method: string } | null) => void;
    setEditingTransaction: (transaction: Transaction | null) => void;
    setTransactionsPage: (page: string) => void;
    setTransactionsResult: (result: Transaction[]) => void;
    setCategoriesResult: (result: Array<{ id: string; name: string; userId: string; type: string }>) => void;
    setAccountList: (list: Array<{ id: string; name: string; userId: string }>) => void;
    setSearchQuery: (query: string) => void;
    setIsMonthPickerOpen: (isMonthPickerOpen: boolean) => void; // Add setter for isMonthPickerOpen
};

export const useStore = create<State>((set) => ({
    transactions: [],
    categories: [],
    accounts: [],
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    isLoading: false,
    isOpen: false,
    isCategoryMenuOpen: false,
    isAccountMenuOpen: false,
    isAddEntityOpen: false,
    entityType: "category",
    handleEntity: null,
    editingTransaction: null,
    transactionsPage: "daily",
    transactionsResult: [],
    categoriesResult: [],
    accountList: [],
    searchQuery: '',
    isMonthPickerOpen: false, // Initialize isMonthPickerOpen state
    setTransactions: (transactions) => set((state) => ({ ...state, transactions })),
    setCategories: (categories) => set((state) => ({ ...state, categories })),
    setAccounts: (accounts) => set((state) => ({ ...state, accounts })),
    setCurrentMonth: (month) => set((state) => ({ ...state, currentMonth: month })),
    setCurrentYear: (year) => set((state) => ({ ...state, currentYear: year })),
    setIsLoading: (isLoading) => set((state) => ({ ...state, isLoading })),
    setIsOpen: (isOpen) => set((state) => ({ ...state, isOpen })),
    setIsCategoryMenuOpen: (isCategoryMenuOpen) => set((state) => ({ ...state, isCategoryMenuOpen })),
    setIsAccountMenuOpen: (isAccountMenuOpen) => set((state) => ({ ...state, isAccountMenuOpen })),
    setIsAddEntityOpen: (isAddEntityOpen) => set((state) => ({ ...state, isAddEntityOpen })),
    setEntityType: (entityType) => set((state) => ({ ...state, entityType })),
    setHandleEntity: (handleEntity) => set((state) => ({ ...state, handleEntity })),
    setEditingTransaction: (transaction) => set((state) => ({ ...state, editingTransaction: transaction })),
    setTransactionsPage: (page) => set((state) => ({ ...state, transactionsPage: page })),
    setTransactionsResult: (result) => set((state) => ({ ...state, transactionsResult: result })),
    setCategoriesResult: (result) => set((state) => ({ ...state, categoriesResult: result })),
    setAccountList: (list) => set((state) => ({ ...state, accountList: list })),
    setSearchQuery: (query) => set((state) => ({ ...state, searchQuery: query })),
    setIsMonthPickerOpen: (isMonthPickerOpen) => set((state) => ({ ...state, isMonthPickerOpen })), // Add setter for isMonthPickerOpen
}));
