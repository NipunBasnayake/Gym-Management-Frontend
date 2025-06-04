import React from 'react'
import {Fingerprint, Camera, QrCode, Trash2} from 'lucide-react'
import {toast} from 'react-toastify'
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

    // Method to handle fingerprint data upload/capture
    const handleFingerprintCapture = () => {
        // Simulate fingerprint capture - replace with actual fingerprint SDK integration
        const mockFingerprintData = `fp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        setData({...data, fingerprintData: mockFingerprintData})
        toast.success('Fingerprint captured successfully!', {position: 'top-right'})
    }

    // Method to handle face ID capture
    const handleFaceCapture = async () => {
        try {
            // Simulate camera access for face capture - replace with actual face recognition SDK
            const stream = await navigator.mediaDevices.getUserMedia({video: true})
            const mockFaceData = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

            // Stop the camera stream after simulation
            stream.getTracks().forEach(track => track.stop())

            setData({...data, faceImageData: mockFaceData})
            toast.success('Face ID captured successfully!', {position: 'top-right'})
        } catch (error) {
            console.log(error)
            toast.error('Camera access denied or not available', {position: 'top-right'})
        }
    }

    // Method to remove biometric data
    const removeBiometricData = (type: 'fingerprint' | 'face') => {
        if (type === 'fingerprint') {
            setData({...data, fingerprintData: ''})
            toast.info('Fingerprint data removed', {position: 'top-right'})
        } else {
            setData({...data, faceImageData: ''})
            toast.info('Face ID data removed', {position: 'top-right'})
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter full name"
                        value={data.name}
                        onChange={(e) => setData({...data, name: e.target.value})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={data.email}
                        onChange={(e) => setData({...data, email: e.target.value})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Mobile Number
                    </label>
                    <input
                        id="mobileNumber"
                        type="tel"
                        placeholder="Enter mobile number"
                        value={data.mobileNumber || ''}
                        onChange={(e) => setData({...data, mobileNumber: e.target.value})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="nicNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        NIC Number
                    </label>
                    <input
                        id="nicNumber"
                        type="text"
                        placeholder="Enter NIC number"
                        value={data.nicNumber}
                        onChange={(e) => setData({...data, nicNumber: e.target.value})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="age" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Age
                    </label>
                    <input
                        id="age"
                        type="number"
                        placeholder="Enter age"
                        value={data.age}
                        onChange={(e) => setData({...data, age: parseInt(e.target.value)})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="height" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Height (cm)
                    </label>
                    <input
                        id="height"
                        type="number"
                        placeholder="Enter height in cm"
                        value={data.height}
                        onChange={(e) => setData({...data, height: parseFloat(e.target.value)})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="weight" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Weight (kg)
                    </label>
                    <input
                        id="weight"
                        type="number"
                        placeholder="Enter weight in kg"
                        value={data.weight}
                        onChange={(e) => setData({...data, weight: parseFloat(e.target.value)})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                    </label>
                    <input
                        id="address"
                        type="text"
                        placeholder="Enter full address"
                        value={data.address}
                        onChange={(e) => setData({...data, address: e.target.value})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="membershipStartDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Membership Start Date
                    </label>
                    <input
                        id="membershipStartDate"
                        type="date"
                        value={data.membershipStartDate}
                        onChange={(e) => setData({...data, membershipStartDate: e.target.value})}
                        className="p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200 w-full"
                    />
                </div>

                {/* Biometric Data Section */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                        <QrCode className="w-5 h-5"/>
                        Biometric & QR Data
                    </h3>

                    {/* Fingerprint Section */}
                    <div className="flex flex-col gap-3 mb-4 p-3 bg-gray-50 dark:bg-slate-600 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fingerprint: {data.fingerprintData ? 'Captured' : 'Not Captured'}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleFingerprintCapture}
                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                >
                                    <Fingerprint className="w-4 h-4"/>
                                    {data.fingerprintData ? 'Recapture' : 'Capture'}
                                </button>
                                {data.fingerprintData && (
                                    <button
                                        type="button"
                                        onClick={() => removeBiometricData('fingerprint')}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        {data.fingerprintData && (
                            <div
                                className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-white dark:bg-slate-700 p-2 rounded border">
                                ID: {data.fingerprintData}
                            </div>
                        )}
                    </div>

                    {/* Face ID Section */}
                    <div className="flex flex-col gap-3 mb-4 p-3 bg-gray-50 dark:bg-slate-600 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Face ID: {data.faceImageData ? 'Captured' : 'Not Captured'}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleFaceCapture}
                                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                                >
                                    <Camera className="w-4 h-4"/>
                                    {data.faceImageData ? 'Recapture' : 'Capture'}
                                </button>
                                {data.faceImageData && (
                                    <button
                                        type="button"
                                        onClick={() => removeBiometricData('face')}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        {data.faceImageData && (
                            <div
                                className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-white dark:bg-slate-700 p-2 rounded border">
                                ID: {data.faceImageData}
                            </div>
                        )}
                    </div>
                </div>

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