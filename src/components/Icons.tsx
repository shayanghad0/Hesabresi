import type { SVGProps } from "react";

/* ─── Base icon wrapper ─── */
function Icon({ children, size = 24, className = "", ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ─── Logo — stylised ledger mark ─── */
export function LogoIcon({ size = 28, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <line x1="6" y1="2" x2="6" y2="6" />
      <line x1="18" y1="2" x2="18" y2="6" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <circle cx="12" cy="14" r="2.5" />
      <line x1="12" y1="11.5" x2="12" y2="10" />
    </svg>
  );
}

/* ─── Dashboard chart ─── */
export function ChartBarIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <line x1="3" y1="20" x2="3" y2="4" />
      <line x1="8" y1="20" x2="8" y2="9" />
      <line x1="13" y1="20" x2="13" y2="13" />
      <line x1="18" y1="20" x2="18" y2="6" />
      <line x1="1" y1="20" x2="21" y2="20" />
    </Icon>
  );
}

/* ─── Trend up — income / profit ─── */
export function TrendUpIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </Icon>
  );
}

/* ─── Trend down — expense ─── */
export function TrendDownIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </Icon>
  );
}

/* ─── Wallet / money bag ─── */
export function WalletIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <rect x="1" y="5" width="22" height="15" rx="3" />
      <circle cx="18" cy="13" r="1.5" />
      <path d="M3 5h18v4H3z" fill="currentColor" opacity=".15" />
    </Icon>
  );
}

/* ─── Money fly — expense outflow ─── */
export function MoneyFlyIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <rect x="1" y="6" width="18" height="12" rx="2" />
      <circle cx="10" cy="12" r="2.5" />
      <path d="M19 9l3-2m0 0l-3-2m3 2h-3" strokeLinecap="round" />
      <path d="M19 15l3 2m0 0l-3 2m3-2h-3" strokeLinecap="round" />
    </Icon>
  );
}

/* ─── Receipt ─── */
export function ReceiptIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="10" x2="14" y2="10" />
      <line x1="8" y1="13" x2="12" y2="13" />
    </Icon>
  );
}

/* ─── Users / employees ─── */
export function UsersIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <circle cx="18" cy="8" r="2" />
      <path d="M21 21v-1.5a3 3 0 0 0-3-3" />
    </Icon>
  );
}

/* ─── Bank ─── */
export function BankIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <polygon points="12 2 2 7 22 7" />
      <line x1="2" y1="7" x2="22" y2="7" />
      <line x1="6" y1="22" x2="6" y2="11" />
      <line x1="12" y1="22" x2="12" y2="11" />
      <line x1="18" y1="22" x2="18" y2="11" />
      <polygon points="2 11 12 22 22 11" />
    </Icon>
  );
}

/* ─── Gift / bonus ─── */
export function GiftIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="10" width="18" height="12" rx="2" />
      <rect x="3" y="4" width="18" height="4" rx="2" />
      <line x1="12" y1="4" x2="12" y2="22" />
      <path d="M12 4c-1-2-3-2-4 0s1 3 4 0" />
      <path d="M12 4c1-2 3-2 4 0s-1 3-4 0" />
    </Icon>
  );
}

/* ─── Folder / categories ─── */
export function FolderIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Icon>
  );
}

/* ─── Settings gear ─── */
export function SettingsIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Icon>
  );
}

/* ─── Sun ─── */
export function SunIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </Icon>
  );
}

/* ─── Moon ─── */
export function MoonIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Icon>
  );
}

/* ─── Hamburger menu ─── */
export function MenuIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Icon>
  );
}

/* ─── Credit card / salary payment ─── */
export function CreditCardIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </Icon>
  );
}

/* ─── Building / tax ─── */
export function BuildingIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <path d="M9 22v-4h6v4" />
    </Icon>
  );
}

/* ─── Warning ─── */
export function WarningIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  );
}

/* ─── Clipboard / default category ─── */
export function ClipboardIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </Icon>
  );
}

/* ─── Download / export ─── */
export function DownloadIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Icon>
  );
}

/* ─── Plus ─── */
export function PlusIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Icon>
  );
}

/* ─── X / close modal ─── */
export function XIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  );
}

/* ─── Trophies ─── */
export function TrophyIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M6 3h12v6a6 6 0 0 1-12 0V3z" />
      <line x1="12" y1="15" x2="12" y2="21" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </Icon>
  );
}

/* ─── Document analysis ─── */
export function DocumentAnalysisIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </Icon>
  );
}

/* ─── Refresh / cycle ─── */
export function RefreshIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Icon>
  );
}

/* ─── Map — used for report category breakdowns ─── */
export function TagIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </Icon>
  );
}

/* ─── Star / featured employee ─── */
export function StarIcon({ size = 24, className = "" }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <Icon size={size} className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Icon>
  );
}

/* ─── Exported as named components for direct import ─── */
export { Icon };
