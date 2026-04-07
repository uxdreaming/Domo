import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  hint?: string
  children: ReactNode
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>{label}</label>
      {children}
      {hint && <p className="text-xs" style={{ color: '#374151' }}>{hint}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode
}

const inputStyle = {
  background: '#1c1f28',
  border: '1px solid #1f2333',
  color: '#e2e8f0',
  borderRadius: 8,
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`w-full px-3 py-2.5 text-sm outline-none transition-colors placeholder-[#374151] ${className}`}
      style={inputStyle}
      onFocus={e => (e.target.style.borderColor = '#6366f1')}
      onBlur={e => (e.target.style.borderColor = '#1f2333')}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2.5 text-sm outline-none transition-colors placeholder-[#374151] resize-none ${className}`}
      style={inputStyle}
      onFocus={e => (e.target.style.borderColor = '#6366f1')}
      onBlur={e => (e.target.style.borderColor = '#1f2333')}
      {...props}
    />
  )
}

export function Select({ children, ...props }: SelectProps) {
  return (
    <select
      className="w-full px-3 py-2.5 text-sm outline-none"
      style={{ ...inputStyle, borderRadius: 8 }}
      {...props}
    >
      {children}
    </select>
  )
}

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  color?: string
}

export function Segmented<T extends string>({ options, value, onChange, color: _color = '#6366f1' }: SegmentedProps<T>) {
  return (
    <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #1f2333', background: '#1c1f28' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="flex-1 px-3 py-2 text-xs font-medium transition-colors"
          style={{
            background: value === opt.value ? '#1e2130' : 'transparent',
            color: value === opt.value ? 'white' : '#64748b',
            borderRight: '1px solid #1f2333',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
