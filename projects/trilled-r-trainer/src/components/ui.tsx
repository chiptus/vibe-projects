import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

const variants = {
  default: 'bg-brand enabled:hover:bg-brand-hover',
  primary: 'bg-brand-hover',
  save: 'bg-save enabled:hover:bg-save-hover',
  danger: 'bg-danger enabled:hover:bg-danger-hover',
  cancel: 'bg-cancel enabled:hover:bg-cancel-hover',
  start: 'bg-start hover:bg-start-hover',
  pause: 'bg-pause hover:bg-pause-hover',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  large?: boolean;
}

export function Button({ variant = 'default', large = false, className = '', ...props }: ButtonProps) {
  const size = large ? 'px-8 py-3 text-lg font-semibold' : 'px-3 py-2 text-sm';
  return (
    <button
      className={`cursor-pointer rounded-md text-white disabled:cursor-default disabled:opacity-30 ${size} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

const controlClass = 'rounded-md border border-brand bg-field px-3 py-2 text-white';

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="mb-3 flex flex-col gap-1 text-sm text-muted">
      {label}
      {children}
      {error ? (
        <span role="alert" className="mt-1 block text-sm text-error">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlClass} ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} ${className}`} {...props} />;
}
