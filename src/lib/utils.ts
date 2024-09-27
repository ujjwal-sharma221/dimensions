import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  formatDistanceToNowStrict,
  formatDate as formatDateOriginal,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } else if (currentDate.getFullYear() === date.getFullYear()) {
    return formatDateOriginal(date, "MMM d");
  }
  return formatDateOriginal(date, "MMM d, yyyy");
}

export const formatNumber = (num: number) => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};
