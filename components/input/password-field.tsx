import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, Path } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordField = <T extends Record<string, string | number | boolean | FileList | File | undefined>>({
    form,
    name,
    label,
    placeholder,
    className = '', itemClassName = '',
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
    min?: number,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    rest?: React.InputHTMLAttributes<HTMLInputElement>
}) => {
    const [passwordShow, setPasswordShow] = useState(false)
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={itemClassName}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl >

                        <div className=' relative'>
                            <Input
                                {...field}
                                value={field.value as string || ''}
                                placeholder={placeholder}
                                className={`h-11 pr-8 ${className}`}
                                type={
                                    passwordShow ? 'text' : 'password'
                                }
                                min={min}

                                onChange={(e) => {
                                    field.onChange(e);
                                    if (onChange) onChange(e);
                                }}
                                {...rest}
                            />
                            <div className="absolute right-3 top-[11px] cursor-pointer h-4 w-4 text-muted-foreground">
                                {
                                    passwordShow ? <EyeOff onClick={() => setPasswordShow((pre) => !pre)} className="h-5 w-5" /> : <Eye onClick={() => setPasswordShow((pre) => !pre)} className="h-5 w-5" />
                                }

                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default PasswordField;