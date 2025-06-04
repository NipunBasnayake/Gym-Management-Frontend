import React from 'react'

interface Props {
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    icon?: React.ReactNode
    label: string
}

const InputField: React.FC<Props> = ({ type, value, onChange, placeholder, icon, label }) => (
    <div className="mb-4">
        <label className="block text-slate-600 dark:text-slate-400 mb-2 text-sm font-medium">{label}</label>
        <div className="relative">
            {icon && <span className="absolute left-3 top-3 text-slate-400">{icon}</span>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-2 ${icon ? 'pl-10' : ''} border rounded-lg dark:bg-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
            />
        </div>
    </div>
)

export default InputField
