import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, Path } from 'react-hook-form';

export const TextField = <T extends Record<string, string | number | boolean | FileList | Date | File | undefined>>({
    form,
    name,
    label,
    placeholder,
    className = '',
    itemClassName = '',
    type = 'text',
    min,
    onChange,
    ...rest
}: {
    form: UseFormReturn<T>
    name: Path<T>
    label: string
    placeholder: string
    className?: string,
    itemClassName?: string,
    type?: string
    min?: number,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    rest?: React.InputHTMLAttributes<HTMLInputElement>
}) => {
    const hasError = form.formState.errors[name]; // Dynamically access the error for the current field
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={itemClassName}>
                    <FormLabel
                        className={`${hasError ? 'text-red-500' : ''}`} // Add red text color to label if there's an error
                    >
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            value={(field.value as string) || ''}
                            placeholder={placeholder}
                            className={`h-11 ${className} ${hasError ? '  border-red-500' : ''}`} // Add custom border color for error state
                            type={type}
                            min={min}
                            onChange={(e) => {
                                field.onChange(e);
                                if (onChange) onChange(e);
                            }}
                            {...rest}
                        />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                </FormItem>
            )}
        />
    );
};

export default TextField;
