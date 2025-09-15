"use client";

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import styles from "../../form/form.module.css";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";
import { SiGoogleforms } from "react-icons/si";
import { FullSurveyTpe } from "@/types/survey";
import { ButtonLoadingSpinner } from "@/components/loadingSpinner";
import SurveyLoading from "./loading";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { SurveysError } from "../../home/subs";
import { getSocketServerUrl, getSurvey, submitSurveyResponse } from "@/app/actions/survey";
import { AppContext } from "@/context/app";
import { getPureTitleText } from "@/utils/drawer";
import { HiDocumentReport } from "react-icons/hi";
import { io, Socket } from "socket.io-client";

export default function Survey({ id }: { id: string }) {
    
    const router = useRouter();
    const { user } = useContext(AppContext);
    const [selectedForm, setSelectedForm] = useState<number>(-1);
    const [survey, setSurvey] = useState<FullSurveyTpe | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean | string>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean | string>(false);
    const [socket, setSocket] = useState<Socket | null>(null);

    const loadSurvey = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            let s: string | FullSurveyTpe = "User not found";
            if(user?._id) s = await getSurvey(id, user._id);
            if(typeof s === "string") {
                setError(s);
                setLoading(false);
            } else {
                setSurvey(s);
                setLoading(false);
            }
        } catch (err) {
            setError(true);
            setLoading(false);
        }
    }, [id, user]);
          
    useEffect(() => {
        const server_url = getSocketServerUrl();
        if(!server_url || !user) return;

        const SocketInstance = io(server_url);

        SocketInstance.on("connect", () => {
            setSocket(SocketInstance);
        });

        return () => {
            SocketInstance.disconnect();
        }
    }, [user]);

    useEffect(() => {
        if(!user) return router.push(`/?back=/survey/${id}`);
        else loadSurvey();
    }, [user]);

    const handleSubmit = async () => {
        try {
            if(submitLoading || !user) return;
            setSubmitLoading(true);
            setError(false); 
            // the surveyId is valid already now cus if it weren't
            // this entire page would have errored and not button to fire this function
            // so s will alwayrs return good value
            if(socket) socket.emit("response", { _id: id, answers });
            // comment below line of code for testing socket so we don't populate db
            const s = await submitSurveyResponse({ answers, _id: id, userId: user._id });
            setSubmitLoading("success");
            // setSubmitLoading(false);
        } catch (err) {
            setError(true);
            setSubmitLoading(false);
        }
    };

    const optionAnswer = useCallback((q_id: number, o_id: number) => {
        setAnswers((prev) => {
            const p = [...prev];
            p[q_id] = o_id;
            return p;
        });
    }, []);

    const getPureTitle = useMemo(() => {
        if(survey?.title) return getPureTitleText(survey.title);
        return "";
    }, [survey?.title]);

    return (
        <div className={`w-full h-full ${styles.Form_body_bg}`}>
        {
            error
                ?
            <SurveysError btnText={error !== true ? "Go Home" : "Reload"} 
            pText={error !== true ? error : "There was an error. Check internet and Retry"} 
            btnFn={() => {
                if(error !== true) router.push("/");
                else loadSurvey();
            }} />
            :
            ((loading || !survey) 
                ?
            <SurveyLoading />
            :
            <div className={`${styles.Survey_Form} w-full`}>
                <nav className={styles.Form_nav}>
                    <div className={styles.Fn_div}>
                        <div className={styles.Fn_back} onClick={() => router.push("/home")}>
                            <MdArrowBack className={styles.Fn_back_icon} />
                        </div>
                        <SiGoogleforms className={styles.Fn_doc_icon} />
                        <div className={styles.Fn_editable}>{getPureTitle}</div>
                    </div>
                    <div className={styles.Fn_div}>
                        <Link href="/" className={styles.Fn_logo}>mavvle</Link>
                    </div>
                    <div className={styles.Fn_div}>
                        {/* 
                            used survey._id as here we fetched the full survey data having mongodb _id 
                            but in some other pages its survey.survey_id cus we have formatted the mongodb data for it
                        */}
                        {survey.publisher_id === user?._id && 
                        <Link href={`/report/${survey._id}`} className={styles.report_link}>
                            <div className={`${styles.Fn_btn} ${styles.Fn_btn_light}`}>
                                <HiDocumentReport className={styles.Fn_btn_icon} />
                                <span>Survey report</span>
                            </div>
                        </Link>}

                        <Link href={`/profile/${survey.publisher_id}`}>
                            <div className={styles.Fn_btn}>
                                <FaUser className={styles.Fn_btn_icon} />
                                <span>Publisher</span>
                            </div>
                        </Link>
                        <Link href={`/profile`}>
                            <div className={styles.Fn_profile}>{user?.userName[0] || ""}</div>
                        </Link>
                    </div>
                </nav>
                {
                    (survey.filled || submitLoading === "success") ?
                    <main className={styles.Form_main}>
                        <div className={styles.Fm}>
                            <div className={styles.Fm_form}>
                                <div className={styles.Fmf_div}>
                                    <div className={`${styles.Fmf_box_top} ${styles.Fmf_boxx} `}>
                                        <div className={styles.Fmf_field}>
                                            <div className={styles.Fmf_title}>
                                                <span className={`${styles.spanRef} ${styles[`spanRef_true`]}`}>
                                                    Your response has been recorded
                                                </span>
                                            </div>
                                            <div className={styles.Fmf_description}>
                                                <span className={`${styles.spanRef} ${styles[`spanRef_false`]}`}>
                                                    You have filled this form and your response have been saved
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    :
                    <main className={styles.Form_main}>
                        <div className={styles.Fm}>
                            <div className={styles.Fm_form}>
                                <div className={styles.Fmf_div}>
                                    <div className={`${styles.Fmf_box_top} ${styles.Fmf_boxx} `}>
                                        <div className={styles.Fmf_field}>
                                            <div className={styles.Fmf_title}>
                                                <Text htmlText={survey.title} title={true} />
                                            </div>
                                            <div className={styles.Fmf_description}>
                                                <Text htmlText={survey.description} title={false} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ul className={styles.Fmf_ul}>
                                    {survey.questions.map((question, question_id) => (
                                        <li className={`${styles.Fmf_div}`} 
                                        key={`question-${question._id}`} onClick={() => setSelectedForm(question_id)}>
                                            <div className={`
                                                ${styles.Fmf_box} ${styles.Fmf_boxx} 
                                                ${styles[`Fmf_box_${selectedForm === question_id}`]}
                                            `}>
                                                <div className={styles.Fmf_field}>
                                                    <div className={styles.Fmf_Question}>
                                                        <Text htmlText={question.question} title={false} />
                                                    </div>
                                                    <div className={styles.Fmf_Options}>
                                                        <ul>
                                                            {question.options.map((option, op_idx) => (
                                                                <li className={styles.Fmf_li} key={`option-${op_idx}`}>
                                                                    <div className={`${styles.Option_round} pointer`}
                                                                    onClick={() => optionAnswer(question_id, op_idx)}>
                                                                        <div className={styles[`Ori_${answers[question_id] === op_idx}`]} />
                                                                    </div>
                                                                    <span>{option}</span>
                                                                </li> 
                                                            ))}
                                                            
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </main>
                }

                {survey.filled && 
                <footer className={`${styles.Form_footer} w-full flex flex-col items-center`}>
                    <button onClick={() => router.push("/home")}
                    className={`${styles.Ff_btn} ${styles[`Ff_btn_success`]}`}>
                        <span>Go to Home page</span>
                    </button>
                </footer>}

                {!survey.filled && 
                <footer className={`${styles.Form_footer} w-full flex flex-col items-center`}>
                    {error && <p className="p-red">Error: Could not submit. Check internet and retry.</p>}

                    {submitLoading === "success" && <p className="p-green">Response submitted successfully</p>}

                    {submitLoading !== "success" && <button onClick={handleSubmit} disabled={submitLoading === true}
                    className={`${styles.Ff_btn} ${styles[`Ff_btn_${submitLoading}`]} ${submitLoading===true ? "cursor-not-allowed" : ""}`}>
                        {submitLoading === true && <ButtonLoadingSpinner width={'19px'} height={"27px"} color={'white'} />}
                        <span>Submit</span>
                    </button>}

                    {submitLoading === "success" && <button onClick={() => router.push("/home")}
                    className={`${styles.Ff_btn} ${styles[`Ff_btn_success`]}`}>
                        <span>Go to Home page</span>
                    </button>}
                </footer>}
            </div>)
        }
        </div>
    );
};

function Text({ htmlText, title }: { htmlText: string, title: boolean }) {

    const ref = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        if(ref.current) {
            ref.current.innerHTML = htmlText;
        }
    }, []);

    return <span ref={ref} className={`${styles.spanRef} ${styles[`spanRef_${title}`]}`}></span>;
};

