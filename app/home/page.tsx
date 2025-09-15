"use client";

import { SiGoogleforms } from "react-icons/si";
import styles from "./hm.module.css";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
// import img from "@/public/formTest.png";
import Image from "next/image";
import { SurveysError, SurveysLoading } from "./subs";
import NoData from "@/components/noData";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SurveyProfileT } from "@/types/survey";
import { AppContext } from "@/context/app";
import { fetchManySurveys } from "../actions/survey";
import { getPureTitleText } from "@/utils/drawer";
import { Skeleton } from "@/components/loadingSpinner";

export default function Home() {

    const { user } = useContext(AppContext);
    const router = useRouter();

    const [search, setSearch] = useState<string>("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [surveys, setSurveys] = useState<SurveyProfileT[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const s: SurveyProfileT[] = await fetchManySurveys(undefined);
            setSurveys(s);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setError(true);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if(!user) return router.push(`/?back=/home`);
        else fetchData();
    }, [user]);

    const getDate = useCallback((date: Date) => {
        const d = new Date(date);
        let hr = d.getHours();
        const mer = hr >= 12 ? "pm" : "am";
        hr = hr == 12 ? 12 : hr % 12;
        const mins = d.getMinutes();
        const Z = (z: number) => z > 9 ? z : "0"+z;
        return `${String(d).slice(4, 16)} at ${Z(hr)}:${Z(mins)} ${mer}`;
    }, []);
    
    const getPureTitle = useCallback((title: string) => {
        return getPureTitleText(title);
    }, []);

    const searchResults = useMemo(() => {
        if(!search) return [];
        const srch = search.toLowerCase();
        return surveys.filter(survey => getPureTitle(survey.title).toLowerCase().includes(srch));
    }, [search, loading, surveys]);

    return (
        <div className={`w-full h-full overflow-y-auto`}>
            <nav className={`${styles.Home_nav} w-full flex justify-between items-center`}>
                <div className={`${styles.Hn} flex items-center`}>
                    <SiGoogleforms className={styles.Hn_form_icon} />
                    <h3>mavvle</h3>
                </div>

                {loading && <div className={`${styles.Hn_search} ${styles.Hn_search_loading}`}>
                    <Skeleton />
                </div>}

                {!loading && <div className={styles.Hn_search}>
                    <div className="w-full flex items-center">
                        <IoSearch className={styles.Hns_icon} />
                        <input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    {searchResults.length > 0 && <div className={styles.Hn_search_result}>
                        <div className="w-full">
                            {searchResults.map((survey) => (
                                <div key={`survey-${survey.survey_id}`} className={styles.Hnsr_li}>
                                    <Link href={`/survey/${survey.survey_id}`} className={`w-full`}>
                                        <div className={`w-full flex items-center`}>
                                            <div className={`${styles.Hnsrl_img}`}>
                                                <Image src={survey.img} alt={"survey"} 
                                                fill sizes="(max-width: 768px) 300px, 200px" />
                                            </div>
                                            <div className={styles.Hnsrl_texts}>
                                                <h3>{getPureTitle(survey.title)}</h3>
                                                <span>{`Created: ${getDate(survey.createdAt)}`}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>}
                <div className={styles.Hn}>
                    <Link href="/profile" className={styles.Hn_profile}>
                        <div>{user?.userName[0] || ""}</div>
                    </Link>
                </div>
            </nav>
            <main className={styles.Home_main}>
                <div className={`w-full`}>
                    <div className={`${styles.Hm_top} w-full flex justify-between items-center`}>
                        <h2>All Surveys</h2>
                        <div className={styles.Hmt}>
                            <Link href="/form" className={styles.Hmt_link}>
                                <div className={styles.Hmt_form}>Create survey</div>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.Hm_body}>
                        {
                            error ?
                            <SurveysError pText={""} btnText={"Retry"} btnFn={() => fetchData()} /> 
                            :
                            (
                                loading ?
                                <SurveysLoading />
                                :
                                (
                                    surveys.length === 0 ?
                                    <NoData text={'No survey has been created yet'} btnTxt={'Create one'} 
                                    btnFn={() => router.push("/form")} />
                                    :
                                    <ul>
                                        {surveys.map((survey) => (
                                            <li key={`survey-${survey.survey_id}`} className={styles.Hmb_li}>
                                                <Link href={`/survey/${survey.survey_id}`} className={styles.Hmb_survey_link}>
                                                    <div className={`${styles.Hmbs} relative`}>
                                                        <div className={`${styles.Hmbs_top} ${styles.Hmbs_top_show}`}>
                                                            <Image src={survey.img} alt={"survey"} 
                                                            fill sizes="(max-width: 768px) 300px, 200px" />
                                                        </div>
                                                        <div className={styles.Hmbs_base}>
                                                            <h3>{getPureTitle(survey.title)}</h3>
                                                            <span>{`Created: ${getDate(survey.createdAt)}`}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )
                            )
                        }
                    </div>
                </div>
            </main>
        </div>
    );
};