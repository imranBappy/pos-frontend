import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn, Path } from 'react-hook-form';
import { Textarea } from '../ui/textarea';

export const TextareaField = <T extends Record<string, string | number | boolean | FileList | File | undefined>>({
    form,
    name,
    label,
    placeholder,
    className = '',
    rows = 5
}: {
    form: UseFormReturn<T>
    name: Path<T>
    label: string
    placeholder: string
    className?: string
    rows?: number
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea
                            {...field}
                            value={field.value?.toString() || ''}
                            placeholder={placeholder}
                            className={`${className}`}
                            rows={rows}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default TextareaField;