"use client"
import React, { useRef, useState } from 'react';
import { useStore } from '@/lib/store/store';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, BookmarkIcon, FilterIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { debounce } from '../utils/debounce';
import { getSortedTransactions, getFilteredTransactions, getSearchResults, getTotals } from '@/lib/transactionUtils/transactionFunctions';
import Search, { InputSearch } from './Search';

const TransactionsLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { currentYear, currentMonth, setCurrentMonth, setCurrentYear } = useStore()
    const transactions = useStore((state) => state.transactions);
    const searchQuery = useStore((state) => state.searchQuery);
    const setSearchQuery = useStore((state) => state.setSearchQuery);
    const [showSearchInput, setShowSearchInput] = useState(false);

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const sortedTransactions = getSortedTransactions(transactions);
    const filteredTransactions = getFilteredTransactions(sortedTransactions, currentMonth, currentYear);
    const searchResults = getSearchResults(filteredTransactions, searchQuery);
    const { totalIncome, totalExpenses, overallTotal } = getTotals(searchResults);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].screenX;
        handleSwipe();
    };

    const handleSwipe = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const diff = touchStartX.current - touchEndX.current;
            if (diff > 100) { // Adjust the threshold for swipe detection
                handleNextMonth();
            } else if (diff < -100) {
                handlePrevMonth();
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Debounce the search query update
    // const debouncedSetSearchQuery = debounce((query: string) => {
    //     setSearchQuery(query);
    // }, 300);

    // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const query = e.target.value;
    //     debouncedSetSearchQuery(query);
    // };

    return (
        <div className='flex flex-col mx-auto w-full max-w-5xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl relative'>
            <div className="w-full sticky top-0 pt-9 sm:pt-5 bg-white dark:bg-black z-30">
                <div className="flex justify-between gap-x-4 items-center mb-2 pb-2 w-full px-2">
                    <ManualCalendar handleNextMonth={handleNextMonth} handlePrevMonth={handlePrevMonth} />
                    <div className='w-full flex justify-end gap-x-4'>
                        <button className="text-xl">
                            <BookmarkIcon className="md:h-6 lg:h-7 lg:w-7 md:w-6 h-5 w-5" />
                        </button>
                        {/* <button className="text-xl" onClick={() => setShowSearchInput(!showSearchInput)}>
                            <SearchIcon className="md:h-6 lg:h-7 lg:w-7 md:w-6 h-5 w-5" />
                        </button> */}
                        <Search
                            buttonClassName="text-xl"
                            iconClassName="md:h-6 lg:h-7 lg:w-7 md:w-6 h-5 w-5"
                            showSearchInput={showSearchInput}
                            setShowSearchInput={setShowSearchInput}
                        />
                        <button className="text-xl">
                            <FilterIcon className="md:h-6 lg:h-7 lg:w-7 md:w-6 h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className='w-full my-2 p-1 flex overflow-x-auto flex-nowrap md:gap-x-2 sm:justify-normal justify-between border-b border-zinc-400'>
                    <Link href="/transactions"
                        className={`flex justify-between items-center dark:hover:bg-zinc-800 hover:bg-zinc-300 px-2 py-1.5 rounded-md text-xs lg:text-base border ${pathname === '/transactions' ? 'ring-2 dark:ring-white ring-zinc-500 border-none' : 'inactive'}`}
                    >Daily</Link>
                    <Link href="/transactions/calendar"
                        className={`flex justify-between items-center dark:hover:bg-zinc-800 hover:bg-zinc-300 px-2 py-1.5 rounded-md text-xs lg:text-base border ${pathname === '/transactions/calendar' ? 'ring-2 dark:ring-white ring-zinc-500' : 'inactive'}`}
                    >Calendar</Link>
                    <Link href="/transactions/monthly"
                        className={`flex justify-between items-center dark:hover:bg-zinc-800 hover:bg-zinc-300 px-2 py-1.5 rounded-md text-xs lg:text-base border ${pathname === '/transactions/monthly' ? 'ring-2 dark:ring-white ring-zinc-500' : 'inactive'}`}
                    >Monthly</Link>
                    <Link href="/transactions/budget"
                        className={`flex justify-between items-center dark:hover:bg-zinc-800 hover:bg-zinc-300 px-2 py-1.5 rounded-md text-xs lg:text-base border ${pathname === '/transactions/budget' ? 'ring-2 dark:ring-white ring-zinc-500' : 'inactive'}`}
                    >Budgets</Link>
                    <Link href="/notes"
                        className={`flex justify-between items-center h-full dark:hover:bg-zinc-800 hover:bg-zinc-300 px-2 py-1.5 rounded-md text-xs lg:text-base border ${pathname === '/transactions/notes' ? 'ring-2 dark:ring-white ring-zinc-500' : 'inactive'}`}
                    >Notes</Link>
                </div>
                <div className="flex justify-between font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-4 py-2 bg-card rounded-3xl shadow-md border-stone-400 border dark:border-zinc-600 shadow-stone-600/50">
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="font-semibold">Income</h2>
                        <h2 className="text-primary font-semibold text-sky-400">
                            ₹{totalIncome.toFixed(2)}
                        </h2>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="font-semibold">Expenses</h2>
                        <h2 className="text-destructive font-semibold text-rose-400">
                            ₹{totalExpenses.toFixed(2)}
                        </h2>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="font-semibold">Total</h2>
                        <h2 className="font-semibold">
                            ₹{overallTotal.toFixed(2)}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </div>
            <InputSearch showSearchInput={showSearchInput}
                setShowSearchInput={setShowSearchInput}
                onSearchChange={handleSearchChange} />
        </div>
    );
};

export default TransactionsLayout;

interface ManualCalendarProps {
    handlePrevMonth: () => void;
    handleNextMonth: () => void;
}

const ManualCalendar: React.FC<ManualCalendarProps> = ({ handlePrevMonth, handleNextMonth }) => {
    const { isMonthPickerOpen, setIsMonthPickerOpen, currentYear, currentMonth, setCurrentMonth, setCurrentYear } = useStore()

    const months = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    ];

    const handleMonthClick = (monthIndex: number) => {
        setCurrentMonth(monthIndex);
        setIsMonthPickerOpen(false);
    };

    return (
        <div className='relative w-full flex justify-start gap-x-4'>
            <button onClick={handlePrevMonth} className="text-xl ">
                <ArrowLeftCircleIcon className="md:h-6 lg:h-7 lg:w-7 md:w-6 h-5 w-5" />
            </button>
            <div className='flex justify-center items-center'>
                <h1 onClick={() => setIsMonthPickerOpen(true)} className='text-xs md:text-balance flex justify-center items-center cursor-pointer'>
                    {new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </h1>
                {isMonthPickerOpen && <div className="absolute z-50 w-72 left-0 border shadow-md shadow-zinc-500/50 top-10 border-gray-300 p-2 rounded-md dark:bg-black">

                    <div className="w-ful rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span>Select Month</span>
                            <button
                                className=""
                                onClick={() => setIsMonthPickerOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                            <button
                                className="text-xl font-semibold"
                                onClick={() => setCurrentYear(currentYear - 1)}
                            >
                                <ArrowLeftCircleIcon className="h-5 w-5" />
                            </button>
                            <div className="text-lg font-bold">{currentYear}</div>
                            <button
                                className="text-xl font-semibold"
                                onClick={() => setCurrentYear(currentYear + 1)}
                            >
                                <ArrowRightCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {months.map((m, index) => (
                                <button
                                    key={index}
                                    className={`flex justify-center text-center items-center hover:bg-zinc-700 h-full dark:hover:bg-zinc-800 px-2 py-1.5 rounded-md border ${currentMonth === index ? 'ring-2 dark:ring-white ring-zinc-500' : 'inactive'}`}
                                    onClick={() => handleMonthClick(index)}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>}
            </div>
            <button onClick={handleNextMonth} className="md:text-2xl text-lg">
                <ArrowRightCircleIcon className="md:h-6 lg:h-7 lg:w-7 md:w-6 h-5 w-5" />
            </button>
        </div>

    );
};
