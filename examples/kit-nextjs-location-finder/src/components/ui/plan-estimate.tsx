
import React from 'react'
/* ------------------------------------------
   Local UI “design system” (centralized styles)
------------------------------------------- */
export const style = {
  card:
    'group relative w-full overflow-hidden bg-[#0c0c0d] text-foreground border border-[#1f2022] rounded-xl px-5 py-6 sm:px-6 sm:py-7 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] focus-within:ring-1 focus-within:ring-[#2a6df5]',
  headerH3: 'font-heading text-[1.4rem] sm:text-[1.3rem] font-semibold text-[#f5f6f7] tracking-tight',
  headerH3Lg: 'font-heading text-[1.3rem] sm:text-[1.4rem] font-semibold text-[#f5f6f7] tracking-tight',
  subcopy: 'text-[0.85rem] text-[#d3d4d6] leading-snug',
  subcopyLg: 'text-[1.3rem] text-[#d3d4d6] leading-snug',
  label: 'text-[1.3rem] text-[#a7a9ac]',
  input:
    'bg-[#121315] border border-[#232529] rounded-md px-3 py-2 text-[#f1f1f2] placeholder:text-[#7d8087] focus:outline-none focus:ring-1 focus:ring-[#2a6df5]',
  buttonPrimary:
    'inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#578c45] hover:bg-[#578c45] text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors',
  buttonGhost:
    'px-3 py-2 rounded-md border border-[#2b2d31] text-[#d3d4d6] hover:bg-[#121315] transition-colors',
  metaLabel: 'text-sm text-[#a7a9ac]',
  metaValue: 'text-sm text-[#f1f1f2]',
  metaLabelLg: 'text-[1.3rem] text-[#a7a9ac]',
  metaValueLg: 'text-[1.3rem] text-[#f1f1f2]',
  divider: 'border-t border-[#1e1f21]',
  hint: 'mt-2 text-[0.75rem] text-[#8e9094] select-none pointer-events-none opacity-80',
  hintLg: 'mt-2 text-[1.1rem] text-[#8e9094] select-none pointer-events-none opacity-80',
};

/* ------------------------------------------
   Reusable UI Components
------------------------------------------- */
export const Card: React.FC<React.PropsWithChildren<{ ariaLabel?: string; tabIndex?: number; className?: string }>> = ({
  children,
  ariaLabel,
  tabIndex = 0,
  className = '',
}) => (
  <section data-component="Card" className={`${style.card} ${className}`} tabIndex={tabIndex} aria-label={ariaLabel}>
    {children}
  </section>
);

export const SectionHeader: React.FC<{ title: string; large?: boolean }> = ({ title, large }) => (
  <div className="flex items-center justify-between gap-4 mb-4">
    <h3 className={large ? style.headerH3Lg : style.headerH3}>{title}</h3>
  </div>
);

export const SubCopy: React.FC<{ children: React.ReactNode; large?: boolean }> = ({ children, large }) => (
  <div className="flex items-center justify-between gap-4 mb-4">
    <div className="inline-flex items-baseline gap-2 text-right">
      <span className={large ? style.subcopyLg : style.subcopy}>{children}</span>
    </div>
  </div>
);

interface FormRowProps {
  label: string;
  htmlFor?: string;
  helpText?: React.ReactNode;
  children?: React.ReactNode; // <-- add this
}

export const FormRow = ({ label, htmlFor, helpText, children }: FormRowProps) => (
  <label className="flex flex-col gap-1" htmlFor={htmlFor}>
    <span className="text-[1.2rem] text-[#a7a9ac]">{label}</span>
    {children}
    {helpText ? <span className="text-[0.75rem] text-[#8e9094]">{helpText}</span> : null}
  </label>
);


export const TextInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { id?: string }
> = ({ id, ...props }) => <input id={id} className={style.input} {...props} />;

export const NumberInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { id?: string }
> = ({ id, ...props }) => <input id={id} type="number" className={style.input} {...props} />;

export const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { id?: string }> = ({
  id,
  children,
  ...props
}) => (
  <select id={id} className={style.input} {...props}>
    {children}
  </select>
);

export const MetaRow: React.FC<{ label: string; value?: React.ReactNode; large?: boolean }> = ({
  label,
  value,
  large,
}) =>
  value ? (
    <div className="flex justify-between">
      <span className={large ? style.metaLabelLg : style.metaLabel}>{label}</span>
      <span className={large ? style.metaValueLg : style.metaValue}>{value}</span>
    </div>
  ) : null;




