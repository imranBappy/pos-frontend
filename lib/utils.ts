import { ITEM_STOCK_STATUS } from "@/components/item-stock-status";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getStatusStyle = (status: string) => {
  const statuses = {
    COMPLETED: 'bg-green-500/20 text-green-500 dark:bg-green-500/30 dark:text-green-400',
    PENDING: 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400',
    PREPARING: 'bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400',
    READY: 'bg-purple-500/20 text-purple-600 dark:bg-purple-500/30 dark:text-purple-400',
    DELIVERED: 'bg-indigo-500/20 text-indigo-600 dark:bg-indigo-500/30 dark:text-indigo-400',
    CANCELLED: 'bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400',
  }
  return statuses[status as keyof typeof statuses] || 'bg-gray-500/20 text-gray-600 dark:bg-gray-500/30 dark:text-gray-400';
};

export const getTotalCount = (totalCount: number): number => {
  if (typeof (totalCount) !== 'number') return 0;
  return totalCount;
}

export const getPageCount = (totalCount: number, pageSize: number): number => {
  if (typeof (totalCount) !== 'number' || typeof (pageSize) !== 'number') return 0;
  if (totalCount || pageSize) return 0;
  return Math.ceil(totalCount / pageSize)
}


export const randomId = () => {
  return `${Math.round(Math.random() * 10)}${Date.now()}`
}

export const jsonToImages = (jsonImage: (string | Promise<string>)) => {
  if (!jsonImage || typeof jsonImage != 'string') return []
  try {
    return JSON.parse(jsonImage)
  } catch {
    return []
  }
}

export async function getThumblain(files: (string | Promise<string>)) {
  const urls = await jsonToImages(files);
  if (urls.length) return urls[0]
  return null
}

export const renamedFile = (file: File) => {
  const newFileName = `product-${Date.now()}-${file.name.toLowerCase().split(" ").join('')}`
  return new File([file], newFileName, { type: file.type })
}

export const findProductPrice = (price: number, vat: number) => {
  return parseFloat(((price / (100 + vat)) * 100).toFixed(5));
}

export const findVat = (price: number, vat: number) => {
  return price / 100 * vat;
}
interface InputError {
  [key: string]: string
}
export interface Error {
  message?: string,
  extensions?: {
    errors?: InputError[]
  }
}
type getErrorsType = {
  message: string;
  errors: InputError
}
export const getErrors = (errors: Error[]): getErrorsType => {
  const error = errors[0]
  const newErrors = {
    message: error.message || '',
    errors: error?.extensions?.errors ? error?.extensions?.errors : {}
  }
  return newErrors;
}

export const toFixed = (value: number | string, decimalPlaces=2) => {
    try {
        if (typeof value === 'string') value = parseFloat(value);
        return parseFloat(value.toFixed(decimalPlaces));
    } catch {
        return value;
    }
};

export const underscoreToSpace = (value: string) => {
  return value.replace(/_/g, ' ')
}

export function isValidPhoneNumber(phoneNumber: string) {
  // Regex to check valid phone number.
  const pattern = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;

  // If the phone number is empty return false
  if (!phoneNumber) {
    return "false";
  }

  // Return true if the phone number
  // matched the Regex
  if (pattern.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
}

export function debounce(func: (...args: unknown[]) => void, wait: number) {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: unknown[]) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

  

export const itemStockStatus = (
    currentStock: number,
    safetyStock: number
): ITEM_STOCK_STATUS => {
    let status: ITEM_STOCK_STATUS = 'GOOD';
    if (parseFloat(`${currentStock}`) === 0.0) return (status = 'DENGER');
    if (safetyStock >= currentStock) status = 'WARNING';
    return status;
};