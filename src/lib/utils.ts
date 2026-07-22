/**
 * Utility functions for the Financial Management Platform
 */
import * as jalaali from "jalaali-js";

/** Format number with thousand separators (Persian style) */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "۰";
  return toPersianDigits(Math.abs(amount).toLocaleString("en-US")) + " ریال";
}

/** Format number with separators only */
export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "۰";
  return toPersianDigits(n.toLocaleString("en-US"));
}

/** Convert digits to Persian */
export function toPersianDigits(str: string | number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

/** Convert Gregorian date to Jalali string */
export function toJalali(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const { jy, jm, jd } = jalaali.toJalaali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  );
  return toPersianDigits(`${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`);
}

/** Get today in Jalali */
export function todayJalali(): string {
  return toJalali(new Date());
}

/** Calculate tax */
export function calculateTax(amount: number, rate: number = 9): { taxAmount: number; totalAmount: number } {
  const taxAmount = Math.floor(amount * rate / 100);
  return { taxAmount, totalAmount: amount + taxAmount };
}

/** Persian month names */
export const persianMonths = [
  "فروردین", "اردیبهشت", "خرداد",
  "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر",
  "دی", "بهمن", "اسفند",
];

/** Get Persian month name from date */
export function getPersianMonth(dateStr: string | Date): string {
  const d = new Date(dateStr);
  const { jm } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return persianMonths[jm - 1];
}
