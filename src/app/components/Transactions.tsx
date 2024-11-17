"use client";

import React from "react";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EditAddTransactionForm from "./AddEditTransactions";
import { useRouter } from "next/navigation";
import TransactionsList from "./TransactionsList";
import { z } from "zod";
import { Transaction } from "@/lib/types/transaction";
import { formSchema } from "@/lib/zod/zodSchemas";
import { onSubmitTransaction, handleDeleteCategory, handleDeleteAccount } from "@/lib/transactionUtils/transactionFunctions";

const Transactions: React.FC = () => {
    const router = useRouter();
    const {
        isOpen,
        editingTransaction,
        setIsLoading,
        setIsOpen,
        setEditingTransaction,
    } = useStore();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        onSubmitTransaction(values, editingTransaction, setIsLoading, setIsOpen, setEditingTransaction, router);
    };
    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsOpen(true);
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        onClick={() => setEditingTransaction(null)}
                        variant="outline"
                        className="fixed bottom-14 lg:bottom-2 right-0 lg:right-4 h-12 w-12 rounded-full text-xl lg:text-3xl lg:h-16 lg:w-16 bg-indigo-500 text-white m-4 shadow-lg z-40"
                    >
                        +
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 h-[90vh] w-screen mt-[4.8vh] mx-0 mb-0 flex flex-col justify-start items-start">
                    <DialogHeader className="py-5 px-4">
                        <DialogTitle>
                            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                        </DialogTitle>
                    </DialogHeader>
                    <EditAddTransactionForm
                        onSubmit={onSubmit}
                        editingTransaction={editingTransaction}
                        handleDeleteCategory={(categoryId) => handleDeleteCategory(categoryId, router)}
                        handleDeleteAccount={(accountId) => handleDeleteAccount(accountId, router)}
                    />
                </DialogContent>
            </Dialog>
            <TransactionsList onEdit={handleEdit} />
        </div>
    );
};

export default Transactions;