import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store/store";
import { Transaction } from "@/lib/types/transaction";
import { getSortedTransactions, getFilteredTransactions, getSearchResults, getGroupedTransactions } from '@/lib/transactionUtils/transactionFunctions';

interface TransactionsListProps {
    onEdit: (transaction: Transaction) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = React.memo(({ onEdit }) => {
    const { currentMonth, currentYear, transactions, searchQuery } = useStore();

    const sortedTransactions = getSortedTransactions(transactions);
    const filteredTransactions = getFilteredTransactions(sortedTransactions, currentMonth, currentYear);
    const searchResults = getSearchResults(filteredTransactions, searchQuery);
    const groupedTransactions = getGroupedTransactions(searchResults);

    if (Object.keys(groupedTransactions).length === 0) {
        return <div>No transactions found.</div>;
    }

    return (
        <div className="mt-4">
            {Object.entries(groupedTransactions).map(([key, transactions]) => {
                const [date, dayOfWeek] = key.split("-");
                const [month, day, year] = date.split("/");
                return (
                    <div
                        key={key}
                        className="py-5 border-stone-400 border dark:border-zinc-600 rounded-3xl flex flex-col items-start w-full mt-4 dark:bg-zinc-950 shadow-md shadow-stone-600/50"
                    >
                        <div className="flex justify-between items-center w-full px-3.5 pb-1">
                            <div className="">
                                <span className="font-semibold text-base sm:text-lg md:text-xl">
                                    {day}
                                </span>
                                <span className="bg-rose-400 py-0.5 px-2 mx-2 rounded-md font-normal text-xs sm:text-sm">
                                    {dayOfWeek}
                                </span>
                                <span className="text-xs sm:text-sm">
                                    {`${month}-${year.slice(-2)}`}
                                </span>
                            </div>
                            <div className="text-sm font-semibold flex flex-col justify-center items-center">
                                <span className="text-sm sm:text-base">Income</span>
                                <span className="text-sky-400 font-normal text-xs sm:text-sm">
                                    ₹
                                    {transactions
                                        .reduce(
                                            (sum, transaction) =>
                                                transaction.type === "income"
                                                    ? sum + transaction.amount
                                                    : sum,
                                            0
                                        )
                                        .toFixed(2)}
                                </span>
                            </div>
                            <div className="text-sm font-semibold flex flex-col justify-center items-center">
                                <span className="text-sm sm:text-base">Expenses</span>
                                <span className="text-rose-400 font-normal text-xs sm:text-sm">
                                    ₹
                                    {transactions
                                        .reduce(
                                            (sum, transaction) =>
                                                transaction.type === "expense"
                                                    ? sum + transaction.amount
                                                    : sum,
                                            0
                                        )
                                        .toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <div className="w-full">
                            <Table>
                                <TableHeader className="">
                                    <TableRow className="border-y dark:border-zinc-600 border-stone-400 dark:hover:bg-zinc-950 hover:bg-zinc-200">
                                        <TableHead className="text-left  w-1/4">
                                            Category
                                        </TableHead>
                                        <TableHead className="text-left  w-1/2">
                                            Note
                                        </TableHead>
                                        <TableHead className="text-right  w-1/4">
                                            Payments
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="">
                                    {transactions.map((transaction) => (
                                        <TableRow
                                            onClick={() => onEdit(transaction)}
                                            key={transaction.id}
                                            className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center cursor-pointer dark:hover:bg-zinc-800 hover:bg-zinc-300 rounded-full `}
                                        >
                                            <TableCell className="text-left">
                                                {transaction.category}
                                            </TableCell>
                                            <TableCell className="text-left">
                                                <div className="flex flex-col justify-start items-start">
                                                    <span>{transaction.note}</span>
                                                    <span className="text-xs sm:text-sm md:text-base pt-0.5">
                                                        {transaction.account}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className={`text-right ${transaction.type === "income"
                                                    ? "text-sky-400"
                                                    : "text-rose-400"
                                                    }`}
                                            >
                                                {`₹${transaction.amount.toFixed(2)}`}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

TransactionsList.displayName = "TransactionsList";

export default TransactionsList;