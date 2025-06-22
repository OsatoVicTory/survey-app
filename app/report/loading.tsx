import { LoadingSpinner } from "@/components/loadingSpinner";
import styles from "./report.module.css";

export default function ReportLoading({ text }: { text?: string | undefined }) {

    return (
        <div className={styles.ReportLoading}>
            <div>
                <LoadingSpinner width={'10px'} height={'10px'} color={''} />
                <h1>mavvle</h1>
                <h3>{text || "Loading Report"}</h3>
            </div>
        </div>
    );
};
