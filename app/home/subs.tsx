import { Skeleton } from "@/components/loadingSpinner";
import styles from "./hm.module.css";

export function SurveysLoading() {

    const surveys = Array(10).fill(0);

    return (
        <ul>
            {surveys.map((survey, survey_idx) => (
                <li key={`survey-${survey_idx}`} className={styles.Hmb_li}>
                    <div className={styles.Hmb_survey_link}>
                        <div className={styles.Hmbs}>
                            <div className={styles.Hmbs_top}>
                                <Skeleton />
                            </div>
                            <div className={styles.Hmbs_base}>
                                <div className={styles.Hmbs_base_h3}>
                                    <Skeleton />
                                </div>
                                <div className={styles.Hmbs_base_span}>
                                    <Skeleton />
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export function SurveysError({ btnText, btnFn, pText }: { btnText: string, pText: string, btnFn: () => void }) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className={styles.SurveysError}>
                <h1>{"An Error occurred"}</h1>
                <p>{pText || "Check internet and try again"}</p>
                <button onClick={btnFn}>{btnText}</button>
            </div>
        </div>
    );
};