// components/Search.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import useSearch from '@/lib/hooks/useSearch';

const Search = ({ buttonClassName, iconClassName, showSearchInput, setShowSearchInput,  }: {buttonClassName: string;
    iconClassName: string;
    showSearchInput: boolean;
    setShowSearchInput: React.Dispatch<React.SetStateAction<boolean>>;}) => {
    

    return (
        <>
            <button className={buttonClassName} onClick={() => setShowSearchInput(!showSearchInput)}>
                <SearchIcon className={iconClassName} />
            </button>
            
        </>
    );
};

export default Search;

type SearchProps = {
    showSearchInput: boolean;
    setShowSearchInput: React.Dispatch<React.SetStateAction<boolean>>;
    onSearchChange: (query: string) => void;
};

export const InputSearch = ({showSearchInput, setShowSearchInput, onSearchChange }: SearchProps) => {

    const { searchQuery, setSearchQuery } = useSearch();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearchChange(query);
    };
    const handleCloseSearch = () => {
        setShowSearchInput(false);
        setSearchQuery(''); // Reset the search query
        onSearchChange(''); // Notify the parent component to reset the search
      };
    return (
        <>
            {showSearchInput && (
                <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex w-full max-w-md items-center space-x-2 px-3 fixed top-0 left-0 right-0 mx-auto z-50  backdrop-blur-sm bg-white/40 dark:bg-zinc-800/65 rounded-b-lg shadow-lg border border-white p-6"
            >
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bg-transparent border-2 dark:border-zinc-300 focus:ring-0 focus:border-none dark:bg-zinc-900"
                    />
                    <button onClick={handleCloseSearch} className="text-zinc-300 hover:text-zinc-100 focus:outline-none focus:text-zinc-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </>
    )
}