"use client";

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import styles from "./form.module.css";
import { MdArrowBack, MdOutlineDelete, MdPublish } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import Link from "next/link";
import { SiGoogleforms } from "react-icons/si";
import TextEditor from "@/components/text-editor";
import { AiOutlineClose } from "react-icons/ai";
import { SurveyType } from "@/types/survey";
import { ButtonLoadingSpinner } from "@/components/loadingSpinner";
import { addSurvey } from "../actions/survey";
import { AppContext } from "@/context/app";
import { useRouter } from "next/navigation";
import ToastAlert from "@/components/alert";
import { getPureTitleText } from "@/utils/drawer";

type titleBoxType = Record<string, string>;

export default function Form() {
    
    const { user } = useContext(AppContext);
    const router = useRouter();
    const [selectedForm, setSelectedForm] = useState<number>(-1);
    const [questions, setQuestions] = useState<SurveyType[]>([{ question: "", options: ["", ""], _id: uuidv4() }]);
    const [titleChanged, setTitleChanged] = useState<number>(0);
    const titleBox = useRef<titleBoxType>({ title: "", description: "" });
    const ref = useRef<HTMLDivElement | null>(null);
    const [createRef, setCreateRef] = useState<boolean | string>(false);

    useEffect(() => {
        if(!user) return router.push(`/?back=/form`);
    }, [user]);

    const submitForm = async () => {
        const isOk = () => {
            const { title, description } = titleBox.current;
            if(!title || !description) return false;
            questions.forEach(q => {
                if(!q.question) return false;
                if(q.options.find(op => !op)) return false;
            });
            return true;
        };

        try {
            if(!ref.current || !user?._id) return;
            if(!isOk()) return setCreateRef("A form field has not been filled yet. Review and update");
            
            const { title, description } = titleBox.current;

            setCreateRef("loading");
            const doc = await html2canvas(ref.current, {
                backgroundColor: null,
                useCORS: true,
                scale: 1.0,
            });
            const base64 = doc.toDataURL('image/png');
            // defualt responses filled with zeros, this would be sent too to backend
            const responses = questions.map(q => {
                return Array(q.options.length).fill(0);
            });
            const body = {
                img: base64,
                title, description,
                publisher_id: user._id,
                questions, responses,
                public_id: "",
            };
            const s = await addSurvey(body);
            setCreateRef("Successfully published");
            setTimeout(() => setCreateRef(false), 2500);
            router.push(`/survey/${s._id}`);
        } catch (err) {
            console.log(err);
            setCreateRef(true);
            // setTimeout(() => setCreateRef(false), 3500);
        }
    };

    const addQuestion = useCallback((questionId: number) => {
        setQuestions((prev) => {
            const newQuestion = { question: "", options: ["", ""], _id: uuidv4() };
            const p = [...prev];
            p.splice(questionId + 1, 0, newQuestion);
            return p;
        });
    }, []);

    const deleteQuestion = useCallback((questionId: number) => {
        setQuestions((prev) => prev.filter((question, idx) => idx !== questionId));
    }, []);

    
    const addOption = useCallback((questionId: number) => {
        setQuestions((prev) => {
            const p = prev.map((question, idx) => {
                if(idx === questionId) {
                    const op = [...question.options, ""];
                    return { ...question, options: op };
                } else {
                    return question;
                }
            });
            return p;
        });
    }, []);

    const deleteOption = useCallback((questionId: number, optionId: number) => {
        setQuestions((prev) => {
            const p = prev.map((question, idx) => {
                if(idx === questionId) {
                    return { ...question, options: question.options.filter((option, o_idx) => o_idx !== optionId) };
                } else {
                    return question;
                }
            });
            return p;
        });
    }, []);

    const updateData = useCallback((key: string | number, htmlString: string) => {
        if(typeof key === "string") {
            titleBox.current[key] = htmlString;
            if(key === "title") setTitleChanged(Date.now());
        } else {
            setQuestions((prev) => {
                const p: SurveyType[] = [];
                prev.forEach((q, idx) => {
                    if(idx === key) p.push({ ...q, question: htmlString });
                    else p.push(q);
                });
                return p;
            });
        }
    }, []);

    const updateOption = useCallback((e: React.ChangeEvent<HTMLInputElement>, questionId: number, optionId: number) => {
        setQuestions((prev) => {
            return prev.map((question, idx) => {
                if(idx === questionId) {
                    const { options } = question;
                    if(optionId < options.length) options[optionId] = e.target.value;
                    return { ...question, options };
                } else {
                    return question;
                }
            });
        });
    }, []);
    // console.log(questions);
    
    const pureTitle = useMemo(() => {
        return getPureTitleText(titleBox.current?.title || "Untitled");
    }, [titleChanged]);
    
    return (
        <div className={`${styles.Form} ${styles.Form_body_bg}`}>
            <nav className={styles.Form_nav}>
                <div className={styles.Fn_div}>
                    <div className={styles.Fn_back} onClick={() => router.push("/home")}>
                        <MdArrowBack className={styles.Fn_back_icon} />
                    </div>
                    <SiGoogleforms className={styles.Fn_doc_icon} />
                    <div className={styles.Fn_editable}>{pureTitle}</div>
                </div>
                <div className={styles.Fn_div}>
                    <Link href="/" className={styles.Fn_logo}>mavvle</Link>
                </div>
                <div className={styles.Fn_div}>
                    <button className={styles.Fn_btn} onClick={submitForm}>
                        {createRef !== "loading" && <MdPublish className={styles.Fn_btn_icon} />}
                        {createRef === "loading" && <ButtonLoadingSpinner width={'18px'} height={"25px"} color={'white'} />}
                        <span>Publish</span>
                    </button>
                    <Link href={`/profile`}>
                        <div className={styles.Fn_profile}>{user?.userName[0] || ""}</div>
                    </Link>
                </div>
            </nav>
            <main className={styles.Form_main}>

                {(createRef && createRef !== "loading") && 
                    <ToastAlert 
                    text={createRef === true ? "Error: Check internet and retry" : createRef} 
                    clickFn={() => setCreateRef(false)} /> 
                }

                <div className={styles.Fm} ref={ref}>
                    <div className={styles.Fm_form}>
                        <div className={styles.Fmf_div}>
                            <div className={`${styles.Fmf_box_top}`}>
                                <div className={styles.Fmf_field}>
                                    <div className={styles.Fmf_title}>
                                        <TextEditor showLists={false} value={""} title={true}
                                        update={(htmlString) => updateData("title", htmlString)} />
                                    </div>
                                    <div className={styles.Fmf_description}>
                                        <TextEditor showLists={true} value={"<p>Description</p>"} title={false}
                                        update={(htmlString) => updateData("description", htmlString)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className={styles.Fmf_ul}>
                            {questions.map((question, question_id) => (
                                <li className={`${styles.Fmf_div}`} 
                                key={`question-${question._id}`} onClick={() => setSelectedForm(question_id)}>
                                    <div className={`${styles.Fmf_box} ${styles[`Fmf_box_${selectedForm === question_id}`]}`}>
                                        <div className={styles.Fmf_field}>
                                            <div className={styles.Fmf_Question}>
                                                <TextEditor showLists={false} value={question.question} title={false}
                                                update={(htmlString) => updateData(question_id, htmlString)} />
                                            </div>
                                            <div className={styles.Fmf_Options}>
                                                <ul>
                                                    {question.options.map((option, op_idx) => (
                                                        <li className={styles.Fmf_li} key={`option-${op_idx}`}>
                                                            <div className={styles.Option_round}></div>
                                                            <input placeholder={`Option ${op_idx + 1}`} value={option || ""}
                                                            onChange={(e) => updateOption(e, question_id, op_idx)} />

                                                            <button className={`
                                                                ${styles.Fmf_li_option_close}
                                                                ${styles[`Fmf_loc_${question.options.length > 1}`]}
                                                            `}
                                                            onClick={() => deleteOption(question_id, op_idx)}>
                                                                <AiOutlineClose className={styles.Fmf_loc_icon} />
                                                            </button>
                                                        </li> 
                                                    ))}
                                                    
                                                    {question.options.length < 4 && 
                                                    <li className={`${styles.Fmf_li} ${styles.Fmf_li_add}`}>
                                                        <div className={styles.Option_round}></div>
                                                        <button className={styles.Fmf_li_btn}
                                                        onClick={() => addOption(question_id)}>
                                                            Add more
                                                        </button>
                                                    </li>}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.Fmf_add}>
                                        <div onClick={() => addQuestion(question_id)}>
                                            <FiPlusCircle className={styles.Fmf_add_icon} />
                                        </div>
                                        <div onClick={() => deleteQuestion(question_id)}>
                                            <MdOutlineDelete className={styles.Fmf_add_icon} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
            {/* <footer className={styles.Form_footer}>
                <Image src={bg} className={styles.Ff_img_left} alt="bg" />
                <Image src={bg} className={styles.Ff_img_right} alt="bg" />
            </footer> */}
        </div>
    );
};
