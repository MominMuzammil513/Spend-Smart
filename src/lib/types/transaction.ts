export type Transaction = {
    id: string;
    type: string;
    date: string;
    account: string;
    amount: number;
    category: string; // Updated to match the schema
    note: string;
    description: string;
    bookmarked: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };