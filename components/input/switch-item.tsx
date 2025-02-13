import React from 'react';
import { FormControl, FormLabel } from '../ui/form';
import { FormField } from '../ui/form';
import {
    Select, SelectContent, SelectTrigger, SelectValue, SelectItem,
} from '@/components/ui/select';
import { FormItem, FormMessage } from '@/components/ui/form';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';

export interface OPTION_TYPE {
    value: string;
    label: string;
    disabled?: boolean
    unit?:string
}

interface SelectItemProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    options: OPTION_TYPE[];
    placeholder?: string;
    name: Path<T>;
    label?: string;
    disabled?: boolean;
}

export const SwitchItem = <T extends FieldValues>({ form, name, label, placeholder, options, disabled }: SelectItemProps<T>) => {
    return (
        <FormField

            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem

                >
                    {label && <FormLabel>{label}</FormLabel>}
                    <Select

                        disabled={disabled}
                        value={field.value}
                        onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl
                            className="min-h-11"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder || "Enter value"} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options?.map((option) => (
                                <SelectItem key={option.value} value={option.value} disabled={option.disabled} >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default SwitchItem;