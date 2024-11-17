// hooks/useSearch.ts
import { useState, useEffect } from 'react';
import { debounce } from '@/app/utils/debounce';

const useSearch = (initialQuery: string = '') => {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    useEffect(() => {
        const debouncedSetQuery = debounce((query: string) => {
            setDebouncedQuery(query);
        }, 300);

        debouncedSetQuery(searchQuery);

        return () => {
            debouncedSetQuery.cancel(); // Now this will work correctly
        };
    }, [searchQuery]);

    return {
        searchQuery,
        setSearchQuery,
        debouncedQuery,
    };
};

export default useSearch;