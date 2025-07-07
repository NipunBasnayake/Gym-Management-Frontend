import React from 'react'
// import { Fingerprint, Camera, QrCode, Trash2 } from 'lucide-react'
// import { toast } from 'react-toastify'
import type {Member} from '../types'

interface MemberFormProps {
    formData: Member
    onSubmit: (data: Member) => void
    onCancel: () => void
    loading: boolean
}

export default function MemberForm({formData, onSubmit, onCancel, loading}: MemberFormProps) {
    const [data, setData] = React.useState<Member>({...formData})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(data)
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Name (required) */}
                <InputField
                    label="Name"
                    required
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={data.name}
                    onChange={(val) => setData({...data, name: val})}
                />

                {/* Email (required) */}
                <InputField
                    label="Email"
                    required
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={data.email}
                    onChange={(val) => setData({...data, email: val})}
                />

                {/* Mobile Number (required) */}
                <InputField
                    label="Mobile Number"
                    required
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={data.mobileNumber || ''}
                    onChange={(val) => setData({...data, mobileNumber: val})}
                />

                {/* NIC Number (required) */}
                <InputField
                    label="NIC Number"
                    required
                    id="nicNumber"
                    type="text"
                    placeholder="Enter NIC number"
                    value={data.nicNumber}
                    onChange={(val) => setData({...data, nicNumber: val})}
                />

                {/* Age */}
                <InputField
                    label="Age"
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={data.age}
                    onChange={(val) => setData({...data, age: parseInt(val)})}
                />

                {/* Height */}
                <InputField
                    label="Height (cm)"
                    id="height"
                    type="number"
                    placeholder="Enter height in cm"
                    value={data.height}
                    onChange={(val) => setData({...data, height: parseFloat(val)})}
                />

                {/* Weight */}
                <InputField
                    label="Weight (kg)"
                    id="weight"
                    type="number"
                    placeholder="Enter weight in kg"
                    value={data.weight}
                    onChange={(val) => setData({...data, weight: parseFloat(val)})}
                />

                {/* Address (required) */}
                <InputField
                    label="Address"
                    required
                    id="address"
                    type="text"
                    placeholder="Enter full address"
                    value={data.address}
                    onChange={(val) => setData({...data, address: val})}
                />

                {/* --- Biometric section kept commented (unchanged) --- */}

                <div className="flex justify-end gap-4 md:col-span-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    )
}

interface InputFieldProps {
    id: string
    label: string
    value: any
    onChange: (value: string) => void
    type: string
    placeholder?: string
    required?: boolean
}

// 🔧 Reusable input field component
function InputField({
                        id,
                        label,
                        value,
                        onChange,
                        type,
                        placeholder = '',
                        required = false,
                    }: InputFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                required={required}
            />
        </div>
    )
}
