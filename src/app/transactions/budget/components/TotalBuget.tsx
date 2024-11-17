"use client"

import React, { useState } from 'react'
import { ArrowLeft, Plus, PencilLine, Trash, NotebookPenIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ModalBottomSheet from '@/app/components/ModalBottomSheet'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { useStore } from "@/lib/store/store"; // Import the useStore hook

type Budget = {
  id: string;
  category: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

type Transaction = {
  id: string;
  type: string;
  date: string;
  account: string;
  amount: number;
  category: string;
  note: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface BudgetProps {
  transactions: Transaction[]
  budgets: Budget[]
  categories: Array<{ id: string; name: string; userId: string; type: string }>
}

export const budgetFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z
    .string({
      required_error: "Amount is required",
    })
    .min(1, "Amount is required"),
});

const TotalBudget = ({ transactions, budgets, categories }: BudgetProps) => {
  const router = useRouter();
  const [showAddBudget, setShowAddBudget] = React.useState(false);
  const [isMainBudgetPage, setIsMainBudgetPage] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const currentMonth = useStore((state) => state.currentMonth); // Get current month from store
  const currentYear = useStore((state) => state.currentYear); // Get current year from store

  const form = useForm<z.infer<typeof budgetFormSchema>>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: editingBudget
      ? {
          category: editingBudget.category,
          amount: editingBudget.amount.toString(),
        }
      : {
          category: "",
          amount: "",
        },
  });

  const handleSubmit = async (values: z.infer<typeof budgetFormSchema>) => {
    try {
      const response = editingBudget
        ? await fetch("/api/budgets", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingBudget.id, ...values }),
          })
        : await fetch("/api/budgets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: editingBudget ? "Budget updated successfully!" : "Budget added successfully!",
          duration: 2000,
        });
        setShowAddBudget(false);
        setEditingBudget(null);
        form.reset();
        router.refresh();
      } else {
        throw new Error(editingBudget ? "Failed to update budget" : "Failed to add budget");
      }
    } catch (error) {
      toast({
        title: `Error ${error}`,
        description: editingBudget ? "Failed to update budget. Please try again." : "Failed to add budget. Please try again.",
        duration: 2000,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Budget deleted successfully!",
          duration: 2000,
        });
        router.refresh();
      } else {
        throw new Error("Failed to delete budget");
      }
    } catch (error) {
      toast({
        title:  `Error ${error}`,
        description: "Failed to delete budget. Please try again.",
        duration: 2000,
        variant: "destructive",
      });
    }
  };

  const expenseCategories = categories.filter(category => category.type === 'expense');

  // Calculate total spent on each budget category
  const calculateTotalSpent = (category: string) => {
    return transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          transaction.category === category
        );
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Calculate total budget amount
  const totalBudgetAmount = budgets.reduce((total, budget) => total + budget.amount, 0);

  // Calculate total transaction amount for the current month and year
  const totalTransactionAmount = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((total, transaction) => total + transaction.amount, 0);

  // Calculate percentage spent
  const percentageSpent = (totalTransactionAmount / totalBudgetAmount) * 100;

  return (
    <div className="py-3 lg:px-1 px-3 space-y-4 w-full max-w-xl mx-auto">
      <header className="flex items-center justify-between">
        {isMainBudgetPage ? (
          <>
            <ArrowLeft className="w-6 h-6" onClick={() => {
              setShowAddBudget(false);
              if (!showAddBudget) {
                setIsMainBudgetPage(false);
              }
              form.reset();
            }} />
            <h1 className="text-lg font-semibold">{editingBudget ? "Edit Budget" : "Add Budget"}</h1>
            <Plus className="w-6 h-6" onClick={() => {
              setEditingBudget(null);
              setShowAddBudget(true);
            }} />
          </>
        ) : (
          <>
            <div className='flex gap-x-3 items-center justify-center'>
              <NotebookPenIcon className="w-6 h-6" />
              <h1 className="text-lg font-semibold">Budget</h1>
            </div>
            <button className='border border-zinc-700 rounded-md px-2 py-1 text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700' onClick={() => setIsMainBudgetPage(true)}>{"Budget Setting >"}</button>
          </>
        )}
      </header>
      {showAddBudget && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Select Category"
                      readOnly
                      value={field.value}
                      onClick={() => setIsOpenModal(true)}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                  <ModalBottomSheet
                    isOpen={isOpenModal}
                    onClose={setIsOpenModal}
                  >
                    {expenseCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className="p-2 flex-auto rounded-lg dark:hover:bg-zinc-900 hover:bg-zinc-300 border border-zinc-700 hover:border-white transition-colors duration-200"
                        onClick={() => {
                          field.onChange(category.name);
                          setIsOpenModal(false);
                        }}
                      >
                        <span className="text-xs">{category.name}</span>
                      </button>
                    ))}
                  </ModalBottomSheet>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter budget amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4">{editingBudget ? "Update Budget" : "Add Budget"}</Button>
          </form>
        </Form>
      )}
      {!showAddBudget && isMainBudgetPage && (
        <div className="flex flex-col gap-y-3 mt-6">
          {budgets.map(budget => (
            <div key={budget.id} className="flex justify-between items-center border-stone-400 border dark:border-zinc-600 shadow-md shadow-stone-600/50 rounded-xl px-4 py-2.5">
              <div className="flex gap-x-2">
                <h1>{budget.category}</h1>
                <h4 className="dark:bg-zinc-700 bg-zinc-300 px-2 rounded-md">₹{budget.amount}</h4>
              </div>
              <div className="flex gap-x-2">
                <PencilLine
                  className="h-5 w-5 cursor-pointer lg:h-6 lg:w-6"
                  onClick={() => {
                    setEditingBudget(budget);
                    setShowAddBudget(true);
                    form.setValue("category", budget.category);
                    form.setValue("amount", budget.amount.toString());
                  }}
                />
                <Trash
                  className="h-5 w-5 cursor-pointer lg:h-6 lg:w-6"
                  onClick={() => handleDeleteBudget(budget.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isMainBudgetPage && (
        <div className="flex flex-col gap-y-3 mt-6">
          {/* Display total budget progress */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Total Budget Progress</h2>
            <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
              <span>Total Budget: ₹{totalBudgetAmount}</span>
              <span>Total Spent: ₹{totalTransactionAmount}</span>
              <span className={`${totalBudgetAmount - totalTransactionAmount >= 0 ? "text-green-400" : "text-rose-500"}`}>₹ {totalBudgetAmount - totalTransactionAmount}</span>
            </div>
            <div className='w-full relative'>
              <Progress value={percentageSpent} className={`h-5 rounded-sm dark:bg-zinc-700 bg-zinc-300 w-[${percentageSpent}%]`} />
              <span className={`absolute top-1/2 -translate-y-1/2 md:text-sm text-xs right-2 ${percentageSpent > 100 && "text-rose-600"}`}>{Math.round(percentageSpent)}%</span>
            </div>
          </div>
          {budgets.map(budget => {
            const totalSpent = calculateTotalSpent(budget.category);
            const percentageSpent = (totalSpent / budget.amount) * 100;
            return (
              <>
                <div>
                  <div key={budget.id} className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 text-sm sm:text-base">
                      {budget.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
                    <span>₹{budget.amount}</span>
                    <span>₹{totalSpent}</span>
                    <span className={`${budget.amount - totalSpent >= 0 ? "text-green-400" : "text-rose-500"}`}>₹ {budget.amount - totalSpent}</span>
                  </div>
                  <div className='w-full relative'>
                    <Progress value={percentageSpent} className={`h-5 rounded-sm dark:bg-zinc-700 bg-zinc-300 w-[${percentageSpent}%]`} />
                    <span className={`absolute top-1/2 -translate-y-1/2 md:text-sm text-xs right-2 ${percentageSpent > 100 && "text-rose-600"}`}>{Math.round(percentageSpent)}%</span>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TotalBudget;