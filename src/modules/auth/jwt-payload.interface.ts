export interface JwtPayload {
    id: string;
    username: string;
    phone: string;
    firstName: string;
    lastName: string;
    date: string;
    email: string;
    role?: string;
    refrenceId?: string;
    profilePic?: string;
    isActive?: boolean;
    exp?: number;
}

export interface RefreshTokenPayload {
    id: string;
    email: string;
    username: string;
    date: string;
}
