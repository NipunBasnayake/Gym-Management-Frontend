export interface Member {
    memberId?: string;
    name: string;
    age: number;
    height: number;
    weight: number;
    nicNumber: string;
    email: string;
    address: string;
    qrCodeData: string;
    fingerprintData: string;
    faceImageData: string;
    membershipStartDate: string;
    activeStatus: boolean;
    mobileNumber?: string;
}

export interface Attendance {
    attendanceId?: number
    memberId: number
    date: string
    timeIn: string
}

export interface Notification {
    notificationId?: number
    message: string
    dateCreated: string
    isRead: boolean
    type: string
}

export interface Payment {
    paymentId?: number
    memberId: number
    amount: number
    paymentDate: string
    validUntilDate: string
    paymentStatus: string
}