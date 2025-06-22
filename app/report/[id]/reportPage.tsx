"use client";

import dynamic from "next/dynamic";
import ReportLoading from "../loading";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AppContext } from "@/context/app";

const Report = dynamic(() => import("./report"), {
    loading: () => <ReportLoading />,
});

export default function ReportPage({ id }: { id: string }) {

    const { user } = useContext(AppContext);
    const router = useRouter();

    useEffect(() => {
        if(!user) return router.push(`/?back=/report/${id}`);
    }, [user]);

    return (
        <div className="w-full h-full">
            <Report id={id} user={user} />
        </div>
    );
};