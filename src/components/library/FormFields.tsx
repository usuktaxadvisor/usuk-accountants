'use client';

import type { ReactNode } from 'react';

/* ---------- Field wrapper (label + error + hint) ---------- */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  tone = 'light',
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  tone?: 'light' | 'dark';
}) {
  const labelColor = tone === 'dark' ? 'text-softwhite' : 'text-ink';
  const hintColor = tone === 'dark' ? 'text-softwhite/50' : 'text-muted';
  return (
    <div>
      <label htmlFor={htmlFor} className={`mb-1.5 block text-sm font-medium ${labelColor}`}>
        {label}
        {required && <span className="ml-0.5 text-signal" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-signal" role="alert">{error}</p>
      ) : hint ? (
        <p className={`mt-1.5 text-xs ${hintColor}`}>{hint}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  'min-h-[48px] w-full rounded-lg border px-4 text-sm transition-colors focus:outline-none';
const inputLight =
  'border-mist bg-white text-ink placeholder:text-muted/60 focus:border-gold';
const inputDark =
  'border-navy-slate bg-navy-ink/60 text-white placeholder:text-softwhite/40 focus:border-gold';
const inputError = 'border-signal focus:border-signal';

function tone(t: 'light' | 'dark', err?: string) {
  return `${inputBase} ${t === 'dark' ? inputDark : inputLight} ${err ? inputError : ''}`;
}

/* ---------- Text input ---------- */
export function TextInput({
  id, type = 'text', placeholder, value, onChange, error, tone: t = 'light', autoComplete, inputMode,
}: {
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  error?: string;
  tone?: 'light' | 'dark';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      inputMode={inputMode}
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      aria-invalid={!!error}
      className={tone(t, error)}
    />
  );
}

/* ---------- Select ---------- */
export function Select({
  id, value, onChange, options, error, tone: t = 'light', placeholder,
}: {
  id: string;
  value?: string;
  onChange?: (v: string) => void;
  options: { label: string; value: string }[];
  error?: string;
  tone?: 'light' | 'dark';
  placeholder?: string;
}) {
  return (
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      aria-invalid={!!error}
      className={`${tone(t, error)} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23C9A84C' stroke-width='1.5'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

/* ---------- Textarea ---------- */
export function Textarea({
  id, placeholder, value, onChange, rows = 4, error, tone: t = 'light',
}: {
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  rows?: number;
  error?: string;
  tone?: 'light' | 'dark';
}) {
  return (
    <textarea
      id={id}
      name={id}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      aria-invalid={!!error}
      className={`${tone(t, error)} min-h-[120px] resize-y py-3`}
    />
  );
}

/* ---------- Checkbox (consent etc.) ---------- */
export function Checkbox({
  id, checked, onChange, children, tone: t = 'light',
}: {
  id: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  children: ReactNode;
  tone?: 'light' | 'dark';
}) {
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-2.5 text-sm ${t === 'dark' ? 'text-softwhite/80' : 'text-muted'}`}>
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A84C]"
      />
      <span>{children}</span>
    </label>
  );
}

/* ---------- Country/phone helpers ---------- */
export const JURISDICTION_OPTIONS = [
  { label: 'US citizen in the UK', value: 'us-in-uk' },
  { label: 'UK citizen in the US', value: 'uk-in-us' },
  { label: 'Dual citizen', value: 'dual' },
  { label: 'Green card holder', value: 'green-card' },
  { label: 'US expat (elsewhere)', value: 'us-expat' },
  { label: 'UK expat (elsewhere)', value: 'uk-expat' },
  { label: 'Business / company', value: 'business' },
  { label: 'Something else', value: 'other' },
];
