"use client";

import { DBUserType, DEFAULT_USER } from '@/types/user';
import React, { createContext, useState } from 'react';
// import { Socket } from 'socket.io-client';


const AppContext = createContext<{
    user: DBUserType | null,
    surveys: any[],
    // socket: Socket | null,
    // setSocket: React.Dispatch<Socket | null>,
    setUser: React.Dispatch<DBUserType>,
    setSurveys: React.Dispatch<any[]>,
}>({
    // socket: null,
    // setSocket: (prev: Socket | null) => {},
    user: null,
    setUser: (prev: DBUserType | null) => {},
    surveys: [],
    setSurveys: (prev: any[]) => {},
});

const AppProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    // const [socket, setSocket] = useState<Socket | null>(null);
    const [user, setUser] = useState<DBUserType | null>(null);
    const [surveys, setSurveys] = useState<any[]>([]);

    return (
        <AppContext.Provider value={{ 
            user, setUser, surveys, setSurveys }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };