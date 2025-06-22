export interface DBUserType {
    _id: string,
    userName: string,
    password: string,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
};

export const DEFAULT_USER = {
    _id: "",
    userName: "",
    password: "",
    createdAt: undefined,
    updatedAt: undefined,
};

export interface ReqBodyType {
    userName: string,
    password: string,
};