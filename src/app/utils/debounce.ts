// utils/debounce.ts
export const debounce = <F extends (...args: string[]) => unknown>(func: F, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debouncedFunction = (...args: Parameters<F>) => {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    };

    debouncedFunction.cancel = () => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
    };

    return debouncedFunction;
};
