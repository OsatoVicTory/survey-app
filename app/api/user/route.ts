import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { ReqBodyType } from "@/types/user";

export async function GET(req: NextRequest) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if(!userId) return NextResponse.json({ data: "User not found" }, { status: 404 });

    const res: any = await User.findById(userId);
    if(!res) return NextResponse.json({ data: "User not found" }, { status: 404 });
    
    return NextResponse.json({ data: res._doc }, { status: 200 });
};

export async function PUT(req: NextRequest) {
    await dbConnect();
    const data: ReqBodyType = await req.json();
    const userExist = await User.findOne({ userName: data.userName });
    if(userExist) return NextResponse.json({ data: "userName has been used" }, { status: 400 });

    const hashed_password = await bcrypt.hash(data.password, 10);
    const newUser = new User({ userName: data.userName, password: hashed_password });
    await newUser.save();
    // const user = newUser;
    return NextResponse.json({ data: newUser }, { status: 200 });
};

export async function POST(req: NextRequest) {
    await dbConnect();
    const { userName, password } = await req.json();
    if(!userName || !password) return NextResponse.json({ data: "User not found" }, { status: 404 });

    const res: any = await User.findOne({ userName });
    if(!res) return NextResponse.json({ data: "User not found" }, { status: 404 });

    const hashed_password = res._doc.password;
    const cmp = await bcrypt.compare(password, hashed_password);
    if(!cmp) return NextResponse.json({ data: "User not found" }, { status: 404 });
    
    return NextResponse.json({ data: res._doc }, { status: 200 });
};