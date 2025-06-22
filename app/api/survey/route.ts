import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Survey from "@/models/survey";
import { ReqPatchBodyType, ReqPostBodyType } from "@/types/survey";


export async function GET(req: NextRequest) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get("surveyId");
    const userId = searchParams.get("userId");
    if(!surveyId || !userId) return NextResponse.json({ data: "Survey not found" }, { status: 404 });

    const res: any = await Survey.findById(surveyId);

    if(!res) return NextResponse.json({ data: "Survey not found" }, { status: 404 });
    const resData = res._doc;
    const filled = resData.users.find((u: string) => u === userId) ? true : false;
    return NextResponse.json({ data: { ...resData, filled } }, { status: 200 });
};

export async function POST(req: NextRequest) {
    await dbConnect();
    const data: ReqPostBodyType = await req.json();
    const res = await cloudinary.uploader.upload(data.img, {
        overwrite: true,
        width: 300, height: 210, crop: "fill",
        folder: "/Gab/messages",
    });
    const d = { ...data, img: res.secure_url, public_id: res.public_id };
    const newSurvey = new Survey({ ...d });
    await newSurvey.save();
    return NextResponse.json({ data: newSurvey }, { status: 200 });
};

export async function PATCH(req: NextRequest) {
    await dbConnect();
    const data: ReqPatchBodyType = await req.json();
    const _id = data._id;
    const res: any = await Survey.findById(_id);
    if(!res) return NextResponse.json({ data: "Survey not found" }, { status: 404 });

    const survey = res._doc;
    data.answers.forEach((answer, answer_idx) => {
        // answer is the option selected, idx is the question index;
        survey.responses[answer_idx][answer] += 1; 
    });
    survey.users.push(data.userId);
    const newSurvey = await Survey.findByIdAndUpdate(_id, {...survey}, { new: true });
    return NextResponse.json({ data: newSurvey }, { status: 200 });
};

export async function DELETE(req: NextRequest) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const surveyId = searchParams.get("surveyId");
    const res: any = await Survey.findById({ surveyId });
    const { public_id } = res._doc;
    if(public_id) {
        await cloudinary.api.delete_resources(public_id, {
            type: "upload", resource_type: "image",
        });
    }
    await Survey.findByIdAndDelete({ surveyId });
    return NextResponse.json({ data: "success" }, { status: 200 });
};