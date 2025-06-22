import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Survey from "@/models/survey";


export async function GET(req: NextRequest) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    let res: any;
    if(userId) res = await Survey.find({ publisher_id: userId });
    else res = await Survey.find();
    const resData = [];
    for(const r of res) {
        resData.push({
            img: r.img, survey_id: r._id, 
            title: r.title, createdAt: r.createdAt,
        });
    };
    return NextResponse.json({ data: resData }, { status: 200 });
};
