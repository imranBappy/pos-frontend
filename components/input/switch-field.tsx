import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, } from '@/components/ui/form';
import { UseFormReturn, Path } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';

export const SwitchField = <T extends Record<string, string | number | boolean | FileList | File | undefined>>({
    form,
    name,
    label,
    className = '',
    onChange,
}: {
    form: UseFormReturn<T>
    name: Path<T>
    label: string
    onChange?: (e: React.FormEvent<HTMLButtonElement>) => void,
    className?: string,
    type?: string
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex gap-3 flex-col ">
                    <FormLabel className="text-sm font-normal ">
                        {label}
                    </FormLabel>
                    <FormControl className='flex items-center'>
                        <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                                if (onChange) onChange(checked as unknown as React.FormEvent<HTMLButtonElement>);
                            }}
                            className={`${className}`}

                        />
                    </FormControl>

                </FormItem>
            )}
        />
    );
};

export default SwitchField;