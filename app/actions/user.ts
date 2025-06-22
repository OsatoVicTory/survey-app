"use client";

import { DBUserType, ReqBodyType } from "@/types/user";

const URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const getUser = async (data: ReqBodyType): Promise<DBUserType | string> => {
    const res = await fetch(`${URL}/api/user`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
};

export const getUserById = async (userId: string): Promise<DBUserType | string> => {
    const res = await fetch(`${URL}/api/user?userId=${userId}`);
    const json = await res.json();
    return json.data;
};

export const addNewUser = async (data: ReqBodyType): Promise<DBUserType | string> => {
    const res = await fetch(`${URL}/api/user`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
};