import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToClickableLink(text: string): { href: string; text: string } | null {
  if (text.includes('@') && !text.includes('://')) {
    return { href: `mailto:${text}`, text };
  }

  if (text.includes('://')) {
    return { href: text, text };
  }

  return null;
}
