"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useStore } from "@/lib/store/store";

const TransactionsCalendar: React.FC = () => {
    const { transactions, currentMonth, currentYear } = useStore();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setShowModal(true); // Open modal when a new date is selected
    };

    const renderCalendar = () => {
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = endOfMonth.getDate();
        const firstDayOfWeek = startOfMonth.getDay();
        const calendarDays = [];

        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const transactionsOnDate = transactions.filter(transaction => new Date(transaction.date).toDateString() === date.toDateString());
            const totalIncome = transactionsOnDate.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const totalExpense = transactionsOnDate.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const netTotal = totalIncome - totalExpense;

            calendarDays.push(
                <motion.div
                    key={day}
                    className="w-full h-20 md:w-20 md:h-28 flex justify-end items-center cursor-pointer border border-zinc-950 relative dark:hover:border-zinc-400"
                    onClick={() => handleDateChange(date)}
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="absolute top-0.5 left-0.5 md:text-sm text-xs font-medium">{day}</span>
                    <div className="flex flex-col items-end justify-end pr-1 pb-1 w-full border h-full">
                        {totalIncome !== 0 && <span className={`md:text-xs lg:text-sm text-[8px] ${totalIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>{Math.abs(totalIncome)}</span>}
                        {totalExpense !== 0 && <span className={`md:text-xs lg:text-sm text-[8px] ${totalExpense >= 0 ? 'text-red-500' : 'text-green-500'}`}>{Math.abs(totalExpense)}</span>}
                        {netTotal !== 0 && <span className={`md:text-xs lg:text-sm text-[8px]`}>{netTotal >= 0 ? '+' : '-'}{Math.abs(netTotal)}</span>}
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                className="w-full grid grid-cols-7 px-2 mx-auto max-w-[36rem] border-collapse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-rose-400 px-1 mx-0.5 rounded py-1 mb-5 text-center text-xs md:text-balance">Sun</div>
                <div className="bg-rose-400 px-1 mx-0.5 rounded py-1 mb-5 text-center text-xs md:text-balance">Mon</div>
                <div className="bg-rose-400 px-1 mx-0.5 rounded py-1 mb-5 text-center text-xs md:text-balance">Tue</div>
                <div className="bg-rose-400 px-1 mx-0.5 rounded py-1 mb-5 text-center text-xs md:text-balance">Wed</div>
                <div className="bg-rose-400 px-1 mx-0.5 rounded py-1 mb-5 text-center text-xs md:text-balance">Thu</div>
                <div className="bg-rose-400 px-1 mx-0.5 rounded py-1 mb-5 text-center text-xs md:text-balance">Fri</div>
                <div className="bg-rose-400 px-1 mx-0.5 rounded py-1 mb-5 text-center text-xs md:text-balance">Sat</div>
                {calendarDays}
            </motion.div>
        );
    };

    const renderTransactionsForSelectedDate = () => {
        const selectedTransactions = transactions.filter(transaction => new Date(transaction.date).toDateString() === selectedDate.toDateString());

        if (selectedTransactions.length === 0) {
            return <p className="text-center text-gray-500 mt-4">No transactions on this date.</p>;
        }

        return (
            <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ul>
                    {selectedTransactions.map(transaction => (
                        <motion.li
                            key={transaction.id}
                            className="border-b py-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <div className="flex justify-between">
                                <span className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">{transaction.category}</div>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col items-center p-0 mt-4">
            {renderCalendar()}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transactions on {selectedDate.toDateString()}</DialogTitle>
                        <DialogDescription>
                            {renderTransactionsForSelectedDate()}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TransactionsCalendar;