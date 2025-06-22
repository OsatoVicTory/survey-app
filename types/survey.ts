export interface SurveyType {
    question: string,
    options: string[],
    _id: string,
};

export interface SurveyT {
    pureTitle: string,
    title: string,
    description: string,
    questions: SurveyType[],
    publisher_id: string,
};

export type SurveyResponse = number[];

export interface UserT {
    userName: string,
    _id: string,
    createdAt: Date,
};


export interface SurveyProfileT {
    survey_id: string,
    createdAt: Date,
    img: string,
    title: string,
};

// backend
export interface ReqPostBodyType {
    img: string,
    public_id: string | undefined,
    description: string,
    title: string,
    publisher_id: string,
    questions: SurveyType[],
    responses: SurveyResponse[],
};

export interface ReqPatchBodyType {
    answers: number[],
    _id: string,
    userId: string,
};

export interface FullSurveyTpe extends ReqPostBodyType {
    _id: string,
    createdAt: Date,
    joinedAt: Date | undefined,
    filled: boolean,
};