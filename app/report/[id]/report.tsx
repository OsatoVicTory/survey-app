"use client";

import { MdArrowBack, MdClose } from "react-icons/md";
import styles from "./report.module.css";
import { RiSurveyLine } from "react-icons/ri";
import { fetchChartData } from "@/utils/chartsUtils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChartComponent from "@/components/charts";
import { SlideChartType } from "@/components/charts/types";
import { _getSlidesImage, getPureTitleText } from "@/utils/drawer";
import { SlideLoadingSpinner } from "@/components/loadingSpinner";
import { HiMiniDocument } from "react-icons/hi2";
import { TbReload } from "react-icons/tb";
import Link from "next/link";
import { SurveysError } from "@/app/home/subs";
import ReportLoading from "../loading";
import { useRouter } from "next/navigation";
import { getSocketServerUrl, getSurvey } from "@/app/actions/survey";
import ToastAlert from "@/components/alert";
import { DBUserType } from "@/types/user";
import { io } from "socket.io-client";

type s = {
    data: SlideChartType[][] | null,
    id: number,
    loaded: boolean,
    title: string,
    description: string,
};

type response = {
    data: number[],
    time: number
}

export default function Report({ id, user } : { id: string, user: DBUserType | null }) {

    const router = useRouter();
    const mp = useRef<number[]>([]);
    const [error, setError] = useState<boolean | string>(false);
    const [loading, setLoading] = useState(true);
    const [showSlides, setShowSlides] = useState<boolean>(true);
    const [drawnSlideCount, setDrawnSlideCount] = useState<number>(0);
    const [slidesImages, setSlidesImages] = useState<string[]>([]);
    const [slidesChart, setSlidesChart] = useState<s>({ data: null, id: 0, loaded: false, title: "", description: "" });
    const [newResponse, setNewResponse] = useState<response>({ data: [], time: 0 });
    const [slides, setSlides] = useState<number>(0);
    const cnt = useRef<number>(0);
    const computeBg = useRef<CanvasGradient | null>(null);
    const notExist = "Survey does not exist";

    // const computeBg = useCallback(() => {
    //     const ctx = document.createElement("canvas").getContext("2d");
    //     if(ctx) {
    //         const grad = ctx.createLinearGradient(0, 0, 0, 400);
    //         grad.addColorStop(0, "rgba(58, 123, 213, 0.8)");
    //         grad.addColorStop(1, "rgba(0, 210, 255, 0.21)");
    //         return grad;
    //     }
    // }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);

            cnt.current = 0;
            mp.current = [];
            
            setDrawnSlideCount(0);
            setSlidesImages([]);

            if(user?._id) {
                const data = await getSurvey(id, user._id);
                if(typeof data === "string" || !data) throw new Error(notExist);
                const res = fetchChartData(data, computeBg.current);
                
                mp.current = [];
                const { title, description } = data;
                setSlidesChart({ data: res, id: Date.now(), loaded: true, title, description });
                if(slides === 0) setSlides(data.questions.length);
            }

            setLoading(false);
        } catch(err: any) {
            if(err.message === notExist) setError(notExist);
            else setError(true);
            setLoading(false);
        }
    }, [slides, user]);
      
    useEffect(() => {
        const server_url = getSocketServerUrl();
        if(!server_url || !user) return;

        const SocketInstance = io(server_url);

        SocketInstance.on("response", (data: { _id: string, answers: number[] }) => {
            if(data._id === id) {
                setNewResponse({ data: data.answers, time: Date.now() });
            }
        });

        return () => {
            SocketInstance.disconnect();
        }
    }, [user, id]);

    useEffect(() => {
        if(newResponse.time && slidesChart.loaded) {
            const res = newResponse.data;
            setLoading(true);
            cnt.current = 0;
            mp.current = [];

            setDrawnSlideCount(0);
            setSlidesImages([]);

            setSlidesChart((prev) => {
                const pr = { ...prev };
                if(!pr.data) return pr;

                const { title, description } = prev;
                const p = pr.data;
                res.forEach((r, idx) => {
                    for(let i = 0; i < p.length; i += 2) {
                        let found = false;
                        for(let j = 0; j < 2; j++) {
                            if((i * 2) + j === idx) {
                                p[i][j].datasets[0].data[r] += 1;
                                found = true;
                                break;
                            }
                        }
                        if(found) break;
                    }
                });
                return { data: p, id: Date.now(), loaded: true, title, description };
            });

            setLoading(false);
        }
    }, [newResponse.time, slidesChart.loaded]);

    useEffect(() => {
        const createGrad = () => {
            const ctx = document.createElement("canvas").getContext("2d");
            if(ctx) {
                const grad = ctx.createLinearGradient(0, 0, 0, 400);
                grad.addColorStop(0, "rgba(58, 123, 213, 0.8)");
                grad.addColorStop(1, "rgba(0, 210, 255, 0.21)");
                computeBg.current = grad;
            }
        };
        createGrad();
        if(user) fetchData();
    }, [user]);

    const _completedFn = useCallback((Index: number, index: number, arg: boolean) => {
        if(arg) {
            const id = (Index * 2) + index;
            if(!mp.current[id]) {
                mp.current[id] = 1;
                cnt.current += 1;
                setDrawnSlideCount(cnt.current);
            }
        }
    }, []);

    useEffect(() => {
        const _draw = async () => {
            if(!slidesChart.data) return;
            // wait 2s so we know now that data has mounted fully
            await new Promise(res => setTimeout(res, 2000));
            const images = await _getSlidesImage(slidesChart.data.length);
            const filtered_images = images.filter(_img => _img !== undefined);
            setSlidesImages(filtered_images);
        };
        
        // console.log("slides", drawnSlideCount, slides, cnt.current);
        if(drawnSlideCount === slides) _draw();
    }, [drawnSlideCount, slides, slidesChart.data]);

    const formatX = useCallback((val: string) => {
        return val.split("). ")?.[0] || "";
    }, []);

    const slidesArray = useMemo(() => {
        return Array(Math.ceil(slides / 2)).fill(0);
    }, [slides]);
    
    const getPureTitle = useMemo(() => {
        if(slidesChart.title) return getPureTitleText(slidesChart.title);
        return "";
    }, [slidesChart.title]);

    return (
        <div className="w-full h-full">
            {
                (error && !slidesChart.loaded) ?
                <SurveysError 
                btnText={error === true ? "Retry" : "Go home"}
                pText={error === true ? "Check internet and try again" : "User does not exist"}
                btnFn={() => {
                    if(error === true) fetchData();
                    else router.push("/");
                }} /> 
                :
                (
                    (loading && !slidesChart.loaded) ?
                    <ReportLoading />
                    :
                    <div className={styles.Report}>

                        {error && 
                            <ToastAlert 
                            text={"Error: Check internet and retry"} 
                            clickFn={() => setError(false)} /> 
                        }

                        <nav className={styles.Form_nav}>
                            <div className={styles.Fn_div}>
                                <div className={styles.Fn_back} onClick={() => router.push("/home")}>
                                    <MdArrowBack className={styles.Fn_back_icon} />
                                </div>
                                <HiMiniDocument className={styles.Fn_doc_icon} />
                                <div className={styles.Fn_editable}>
                                    {getPureTitle}
                                </div>
                            </div>
                            <div className={styles.Fn_div}>
                                <Link href="/" className={styles.Fn_logo}>mavvle</Link>
                            </div>
                            <div className={styles.Fn_div}>
                                <button className={styles.Fn_btn} onClick={fetchData}>
                                    <TbReload className={`${styles.Fn_btn_icon} ${styles[`Fn_btn_icon_${loading}`]}`} />
                                    <span>Refresh</span>
                                </button>
                                <Link href="/profile" className="w-max">
                                    <div className={styles.Fn_profile}>{user?.userName[0] || ""}</div>
                                </Link>
                            </div>
                        </nav>
                        <div className={`${styles.Rp} w-full h-full`}>
                            <main className={`${styles.Report_main} ${styles[`Report_main_${showSlides}`]}`}>
                                <div className={styles.Report_main_div}>
                                    <ul className={styles.Rmd}>
                                        {slidesChart.data && 
                                        slidesChart.data.map((slideChart, slide_idx) => (
                                            <li className={styles.Rmd_li} id={`Slide_${slide_idx}`} 
                                            key={`slide_paper_${slideChart[0]._id}`}>
                                                <div className={`${styles.Rmd_title} flex items-center hide_scroll_bar`}>
                                                    <RiSurveyLine className={styles.Rmdt_icon} />
                                                    <span>{getPureTitle}</span>
                                                </div>
                                                <div className={`${styles.Rmd_main} flex justify-between items-center`}>
                                                    
                                                    <ChartComponent datasets={slideChart[0].datasets} 
                                                    labels={slideChart[0].labels} legend={false} 
                                                    chartType={slideChart[0].chartType} title={slideChart[0].title}
                                                    formatX={formatX} radius={3.5} xLabels={true} changed={1} 
                                                    completedFn={(arg) => _completedFn(slide_idx, 0, arg)} 
                                                    indexAxis={slideChart[0].indexAxis} />

                                                    <ChartComponent datasets={slideChart[1].datasets} 
                                                    labels={slideChart[1].labels} legend={false} 
                                                    chartType={slideChart[1].chartType} title={slideChart[1].title}
                                                    formatX={formatX} radius={3.5} xLabels={true} changed={1} 
                                                    completedFn={(arg) => _completedFn(slide_idx, 1, arg)} 
                                                    indexAxis={slideChart[1].indexAxis} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </main>
                            <button className={`${styles.Ra_aside_close} flex justify-center items-center`}
                            onClick={() => setShowSlides(!showSlides)} title="Show Slides">
                                <SlideSvg className={styles.Rav_icon} />
                            </button>
                            <aside className={`${styles.Report_aside} ${styles[`Report_aside_${showSlides}`]}`}>
                                <div className={`${styles.Ra_nav} flex items-center justify-between`}>
                                    <div className={`${styles.Ra_nav_name} flex items-center`}>
                                        <SlideSvg className={styles.Rav_icon} />
                                        <span>Slides</span>
                                    </div>
                                    <button className={`${styles.Ra_nav_close} flex justify-center items-center`}
                                    onClick={() => setShowSlides(!showSlides)}>
                                        <MdClose className={styles.Ranc_icon} />
                                    </button>
                                </div>
                                <div className={styles.Ra_body}>
                                    <ul className={styles.Rab_ul}>
                                        {slidesArray.map((slide, slide_idx) => (
                                            <li className={styles.Rab_li} key={`slide_idx_${slide_idx}`}>
                                                <div className={`${styles.Rab_li_number} flex justify-center items-center`}>{slide_idx + 1}</div>
                                                <div className={styles.Rab_li_thumbNail}>
                                                    {slidesImages.length === 0 ?
                                                        <SlideLoadingSpinner width={"1px"} height={"1px"} color={""} /> :
                                                        <img src={slidesImages[slide_idx]} alt="slide" />
                                                    }
                                                </div>
                                                <span className={styles.Rab_li_pad}></span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

function SlideSvg({ className }: { className: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M9.73.472a5.695 5.695 0 014.54 0l9.158 3.981c.762.332.762 1.413 0 1.745l-9.158 3.98a5.695 5.695 0 01-4.54 0L.571 6.199c-.763-.332-.763-1.413 0-1.745L9.729.473z" fill="#fff"></path>
            <path opacity="0.6" d="M4.44 9.445L.572 11.127c-.763.332-.763 1.413 0 1.745l9.157 3.98c1.449.63 3.093.63 4.542 0l9.157-3.98c.762-.332.762-1.413 0-1.745L19.56 9.445l-4.801 2.088a6.918 6.918 0 01-5.516 0L4.44 9.445z" fill="#fff"></path>
            <path opacity="0.3" d="M4.44 16.12L.572 17.803c-.763.332-.763 1.413 0 1.745l9.157 3.98c1.449.63 3.093.63 4.542 0l9.157-3.98c.762-.332.762-1.413 0-1.745l-3.868-1.681-4.801 2.087a6.917 6.917 0 01-5.517 0L4.44 16.121z" fill="#fff"></path>
        </svg>
    )
};