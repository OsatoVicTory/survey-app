"use client";

import { FullSurveyTpe, ReqPatchBodyType, ReqPostBodyType, SurveyProfileT } from "@/types/survey";

const URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

export const getSocketServerUrl = () => {
    return socketServerUrl;
};

export const fetchManySurveys = async (userId: string | undefined): Promise<SurveyProfileT[]> => {
    const res = await fetch(`${URL}/api/survey-list${userId ? `?userId=${userId}` : ""}`);
    const json = await res.json();
    return json.data;
};

export const getSurvey = async (surveyId: string, userId: string): Promise<FullSurveyTpe | string> => {
    const res = await fetch(`${URL}/api/survey?surveyId=${surveyId}&userId=${userId}`);
    const json = await res.json();
    return json.data;
};

export const addSurvey = async (data: ReqPostBodyType): Promise<FullSurveyTpe> => {
    const res = await fetch(`${URL}/api/survey`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
};

export const submitSurveyResponse = async (data: ReqPatchBodyType): Promise<FullSurveyTpe | string> => {
    const res = await fetch(`${URL}/api/survey`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.data;
};

export const deleteSurvey = async (surveyId: string): Promise<string> => {
    const res = await fetch(`${URL}/api/survey?surveyId=${surveyId}`, {
        method: "DELETE",
    });
    const json = await res.json();
    return json.data;
};
