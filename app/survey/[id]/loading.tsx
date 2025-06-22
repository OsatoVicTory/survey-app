import { LoadingSpinner } from "@/components/loadingSpinner";
import styles from "../../report/[id]/report.module.css";

export default function SurveyLoading() {

    return (
        <div className={styles.ReportLoading}>
            <div>
                <LoadingSpinner width={'10px'} height={'10px'} color={''} />
                <h1>mavvle</h1>
                <h3>Loading Survey</h3>
            </div>
        </div>
    );
};
