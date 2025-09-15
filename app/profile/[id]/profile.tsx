"use client";

import { SiGoogleforms } from "react-icons/si";
import styles from "../../home/hm.module.css";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
// import img from "@/public/formTest.png";
import profileAvatar from "@/public/profile-avatar.png";
import Image from "next/image";
import bg from "@/public/bg-lr.png";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SurveyProfileT } from "@/types/survey";
import { SurveysError, SurveysLoading } from "../../home/subs";
import ReportLoading from "../../report/loading";
import NoData from "@/components/noData";
import { useRouter } from "next/navigation";
import { fetchManySurveys } from "../../actions/survey";
import { getUserById } from "@/app/actions/user";
import { DBUserType } from "@/types/user";
import { AppContext } from "@/context/app";
import { getPureTitleText } from "@/utils/drawer";
import { Skeleton } from "@/components/loadingSpinner";
import { MdArrowBack } from "react-icons/md";

type s = {
    loading: boolean,
    error: boolean | string,
    data: SurveyProfileT[],
};

type p = {
    loading: boolean,
    error: boolean | string,
    data: DBUserType | null,
};

export default function Profile({ id }: { id: string }) {

    const { user } = useContext(AppContext);
    const router = useRouter();

    const [search, setSearch] = useState<string>("");
    const [profile, setProfile] = useState<p>({ loading: true, error: false, data: null });
    const [surveys, setSurveys] = useState<s>({ loading: true, error: false, data: [] });

    const fetchData = useCallback(async() => {
        let pf = profile?.data;
        try {
            if(!user) return;
            if(!pf) {
                setProfile({ loading: true, error: false, data: null });
                const data = await getUserById(id);
                if(typeof data === "string" || !data) {
                    return setProfile({ loading: false, error: "User does not exist", data: null });
                };
                pf = data;
                setProfile({ loading: false, error: false, data });
            }
            setSurveys({ loading: true, error: false, data: [] });
            const data = await fetchManySurveys(id);
            setSurveys({ loading: false, error: false, data });
        } catch (err) {
            console.log(err);
            if(!pf) setProfile({ loading: false, error: true, data: null });
            else setSurveys({ loading: false, error: true, data: [] });
        }
    }, [profile?.data, id]);

    useEffect(() => {
        if(!user) return router.push(`/?back=/profile/${id}`);
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
        return surveys.data.filter(survey => getPureTitle(survey.title).toLowerCase().includes(srch));
    }, [search, surveys.loading, surveys.data]);

    return (
        <div className={`w-full h-full overflow-y-auto`}>
            {
                profile.error ?
                <SurveysError 
                btnText={profile.error === true ? "Retry" : "Go home"}
                pText={profile.error === true ? "Check internet and try again" : "User does not exist"}
                btnFn={() => {
                    if(profile.error === true) fetchData();
                    else router.push("/");
                }} /> 
                :
                (
                    profile.loading ?
                    <ReportLoading text={"Loading profile"} />
                    :
                    <div className={`w-full`}>
                        <nav className={`${styles.Home_nav} w-full flex justify-between items-center`}>
                            <div className="flex items-center">
                                <div className={styles.Hn_back} onClick={() => router.push("/home")}>
                                    <MdArrowBack className={styles.Hn_back_icon} />
                                </div>
                                <div className={`${styles.Hn} flex items-center`}>
                                    <SiGoogleforms className={styles.Hn_form_icon} />
                                    <h3>mavvle</h3>
                                </div>
                            </div>
                            
                            {surveys.loading && <div className={`${styles.Hn_search} ${styles.Hn_search_loading}`}>
                                <Skeleton />
                            </div>}

                            {!surveys.loading && <div className={styles.Hn_search}>
                                <div className="w-full flex items-center">
                                    <IoSearch className={styles.Hns_icon} />
                                    <input placeholder="Search in user's survey" onChange={(e) => setSearch(e.target.value)} />
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
                                <Nav user={profile.data} />
                                <div className={`w-full`}>
                                    <div className={`${styles.Hm_top} w-full flex justify-between items-center`}>
                                        <h2>All your surveys</h2>
                                        <div className={styles.Hmt}>
                                            <Link href="/form" className={styles.Hmt_link}>
                                                <div className={styles.Hmt_form}>Create survey</div>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className={styles.Hm_body}>
                                        {
                                            surveys.error ?
                                            <SurveysError pText={""} btnText={"Retry"} btnFn={() => fetchData()} /> 
                                            :
                                            (
                                                surveys.loading ?
                                                <SurveysLoading />
                                                :
                                                (
                                                    surveys.data.length === 0 ?
                                                    <NoData text={'No survey created by user'} btnTxt={''} btnFn={undefined} />
                                                    :
                                                    <ul>
                                                        {surveys.data.map((survey) => (
                                                            <li key={`survey-${survey.survey_id}`} className={styles.Hmb_li}>
                                                                <Link href={`/survey/${survey.survey_id}`} 
                                                                className={styles.Hmb_survey_link}>
                                                                    <div className={styles.Hmbs}>
                                                                        <div className={`${styles.Hmbs_top} ${styles.Hmbs_top_show} relative`}>
                                                                            <Image src={survey.img} alt={"survey"} fill sizes="(max-width: 768px) 300px, 200px" />
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
                            </div>
                        </main>
                    </div>
                )
            }
        </div>
    );
};

function Nav({ user }: { user: DBUserType | null }) {

    if(!user) return null;

    const getDate = useMemo(() => {
        if(user.createdAt) return String(new Date(user.createdAt)).slice(4, 16);
        return "";
    }, [user]);

    return (
        <div className={`${styles.Hm_top_profile} w-full flex items-center`}>
            <div className={`${styles.Hmtp} w-full flex items-center`}>
                <div className={styles.profile_Avatar}>
                    <Image src={profileAvatar} alt="profile-avatar" />
                </div>
                <div className={styles.Hmt_profile}>
                    <span className={styles.Hmt_email}>{user._id}</span>
                    <h3>{user.userName}</h3>
                    <span className={styles.Hmt_joinedAt}>{`Joined ${getDate}`}</span>
                </div>
            </div>
            <Image src={bg} className={styles.Hmt_bg} alt="" />
        </div>
    );
};