import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
}

// Mesma linguagem visual dos CTAs do site: retângulo (não pill), texto em
// caixa alta quando usado como CTA principal, glow-neon na variante primary.
// 'danger' existe para ações destrutivas (ex: limpar formulário) — definida
// aqui em vez de sobrescrita via className, pra não depender da ordem de
// especificidade das classes do Tailwind.
const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-black hover:bg-[#cce600] glow-neon',
  outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5',
  ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
  danger: 'bg-transparent text-red-400 hover:text-red-300 hover:bg-red-500/10',
};

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-5 py-3 rounded font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
