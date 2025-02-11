import { useState, useEffect } from "react";

export const useDebouncedValue = (value: string | undefined, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<string | undefined>("");
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            setDebouncedValue(undefined)
            clearTimeout(timerId)
        }
    }, [value, delay])
    return debouncedValue;
}
