"use client"
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { OPTION_TYPE } from './switch-item';


interface SelectItemProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  options: OPTION_TYPE[];
  placeholder?: string;
  name: Path<T>;
  label?: string;
  disabled?: boolean;
}

export const Radio = <T extends FieldValues>({ form, name, label, options }: SelectItemProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {
                options.map((op: OPTION_TYPE, i: number) => (
                  <FormItem key={`key_${op.value}_${i}`} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={op.value} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {op.label}
                    </FormLabel>
                  </FormItem>
                ))
              }
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default Radio