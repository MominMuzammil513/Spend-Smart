"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ModalBottomSheet from "./ModalBottomSheet";
import EntityFormDialog from "./EntityFormDialog";
import { formSchema } from "@/lib/zod/zodSchemas";
import { Bookmark, BookmarkCheck, Copy, TrashIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/store";
import { Transaction } from "@/lib/types/transaction";
import { handleDeleteTransaction, handleBookmarkTransaction } from "@/lib/transactionUtils/transactionFunctions";

interface AddTransactionFormProps {
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    editingTransaction?: Transaction | null;
    handleDeleteCategory: (categoryId: string) => Promise<void>;
    handleDeleteAccount: (accountId: string) => Promise<void>;
}

const EditAddTransactionForm: React.FC<AddTransactionFormProps> = ({
    onSubmit,
    editingTransaction,
    handleDeleteCategory,
    handleDeleteAccount,
}) => {
    const {
        categories,
        accounts,
        isLoading,
        // isAddEntityOpen,
        setIsOpen,
        // entityType,
        // handleEntity,
        // setHandleEntity,
        setIsCategoryMenuOpen,
        setIsAccountMenuOpen,
        isCategoryMenuOpen,
        isAccountMenuOpen,
        setEntityType,
        setIsAddEntityOpen,
        setEditingTransaction, // Ensure this is imported or defined
    } = useStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: editingTransaction
            ? {
                  ...editingTransaction,
                  type: editingTransaction.type as "income" | "expense" | "transfer",
                  amount: editingTransaction.amount.toString(),
              }
            : {
                  type: "expense",
                  date: new Date().toISOString().split("T")[0],
                  account: "",
                  amount: "",
                  category: "",
                  note: "",
                  description: "",
              },
    });

    const currentType = form.watch("type");

    const router = useRouter();

    const currentCategories = React.useMemo(() => {
        return categories.filter((category: { type: string; }) => category.type === currentType);
    }, [categories, currentType]);

    const handleDelete = async (id: string) => {
        handleDeleteTransaction(id, setIsOpen, router);
    };

    const handleBookmark = async (id: string) => {
        handleBookmarkTransaction(id, setIsOpen, router);
    };

    const handleCopyTransaction = () => {
        if (editingTransaction) {
            // Copy the current form values
            const copiedValues = form.getValues();

            // Close the edit mode
            setEditingTransaction(null);
            setIsOpen(false);

            // Open the add mode with the copied data pre-filled
            form.reset({
                ...copiedValues,
                date: new Date().toISOString().split("T")[0], // Reset the date to today
            });
            setIsOpen(true);
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-2">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <Tabs defaultValue={field.value} onValueChange={field.onChange}>
                                    <TabsList className="w-full flex justify-between items-center dark:bg-black border ">
                                        <TabsTrigger
                                            className={`w-full ${field.value === "income" && "bg-zinc-300 dark:bg-zinc-800"}`}
                                            value="income"
                                        >
                                            Income
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className={`w-full ${field.value === "expense" && "bg-zinc-300 dark:bg-zinc-800"}`}
                                            value="expense"
                                        >
                                            Expense
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className={`w-full ${field.value === "transfer" && "bg-zinc-300 dark:bg-zinc-800"}`}
                                            value="transfer"
                                        >
                                            Transfer
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <FormMessage className="col-span-2 text-red-500" />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-[auto,1fr] items-center">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="contents">
                                    <FormLabel className="text-left pr-2">Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage className="col-span-2 text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="contents">
                                    <FormLabel className="text-left pr-2">Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Amount"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage className="col-span-2 text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="account"
                            render={({ field }) => (
                                <FormItem className="contents static">
                                    <FormLabel className="text-left pr-2">Account</FormLabel>
                                    <Input
                                        placeholder="Select Account"
                                        readOnly
                                        value={field.value}
                                        onClick={() => setIsAccountMenuOpen(true)}
                                        className="cursor-pointer"
                                    />
                                    <ModalBottomSheet
                                        isOpen={isAccountMenuOpen}
                                        onClose={setIsAccountMenuOpen}
                                        onCloseEditModal={() => {
                                            setEntityType("account");
                                            setIsAddEntityOpen(true);
                                        }}
                                    >
                                        {accounts.map((account:{name:string,id:string}) => (
                                            <button
                                                key={account.id}
                                                type="button"
                                                className={`p-2 flex-auto rounded-md dark:hover:bg-gray-900 hover:bg-gray-300  bg-zinc-200 dark:bg-zinc-800 border border-transparent hover:border-zinc-700 dark:hover:border-white transition-colors duration-200`}
                                                onClick={() => {
                                                    field.onChange(account.name);
                                                    setIsAccountMenuOpen(false);
                                                }}
                                            >
                                                <span className="text-xs">{account.name}</span>
                                            </button>
                                        ))}
                                    </ModalBottomSheet>
                                    <FormMessage className="col-span-2 text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="contents">
                                    <FormLabel className="text-left pr-2">Category</FormLabel>
                                    <Input
                                        placeholder="Select Category"
                                        readOnly
                                        value={field.value}
                                        onClick={() => setIsCategoryMenuOpen(true)}
                                        className="cursor-pointer"
                                    />
                                    <ModalBottomSheet
                                        isOpen={isCategoryMenuOpen}
                                        onClose={setIsCategoryMenuOpen}
                                        onCloseEditModal={() => {
                                            setEntityType("category");
                                            setIsAddEntityOpen(true);
                                        }}
                                    >
                                        {currentCategories.map((category:{name:string,id:string}) => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                className={`p-2 flex-auto rounded-md dark:hover:bg-gray-900 hover:bg-gray-300  bg-zinc-200 dark:bg-zinc-800 border border-transparent hover:border-zinc-700 dark:hover:border-white transition-colors duration-200`}
                                                onClick={() => {
                                                    field.onChange(category.name);
                                                    setIsCategoryMenuOpen(false);
                                                }}
                                            >
                                                <span className="text-xs">{category.name}</span>
                                            </button>
                                        ))}
                                    </ModalBottomSheet>
                                    <FormMessage className="col-span-2 text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem className="contents">
                                    <FormLabel className="text-left pr-2">Note</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Note" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage className="col-span-2 text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="contents">
                                    <FormLabel className="text-left pr-2">Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Description"
                                            {...field}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormMessage className="col-span-2 text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full mt-4">
                        {isLoading
                            ? "Saving..."
                            : editingTransaction
                            ? "Update Transaction"
                            : "Add Transaction"}
                    </Button>
                </form>
            </Form>
            <div className="w-full px-2 flex justify-center gap-x-2 items-center">
                {editingTransaction && (
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            if (editingTransaction?.id) {
                                handleDelete(editingTransaction.id);
                            } else {
                                toast({
                                    title: "Error",
                                    description: "Invalid transaction ID.",
                                    variant: "destructive",
                                });
                            }
                        }}
                        className="flex justify-center items-center gap-x-2  hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-300 z-30"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </Button>
                )}
                {editingTransaction && (
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            if (editingTransaction?.id) {
                                handleBookmark(editingTransaction.id);
                            } else {
                                toast({
                                    title: "Error",
                                    description: "Invalid transaction ID.",
                                    variant: "destructive",
                                });
                            }
                        }}
                        className="flex justify-center items-center gap-x-2  hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-300 z-30"
                    >
                        {editingTransaction.bookmarked === 'true' ? (
                            <>
                                <BookmarkCheck className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                <Bookmark className="w-5 h-5" />
                            </>
                        )}
                    </Button>
                )}
                {editingTransaction && (
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            handleCopyTransaction();
                        }}
                        className="flex justify-center items-center gap-x-2  hover:text-red-500 dark:hover:bg-gray-800 hover:bg-gray-300 z-30"
                    >
                        <Copy className="w-5 h-5"/>
                    </Button>
                )}
            </div>
            <EntityFormDialog
                currentType={currentType}
                handleDeleteCategory={handleDeleteCategory}
                handleDeleteAccount={handleDeleteAccount}
            />
        </>
    );
};

export default EditAddTransactionForm;