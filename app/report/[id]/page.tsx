import ReportPage from "./reportPage";
import styles from "../report.module.css";

type Params = Promise<{ id: string }>;

export default async function ReportPageMain({ params } : { params: Params }) {
    const { id } = await params || "";

    return (
        <div className={styles.ReportPage}>
            <ReportPage id={id} />
        </div>
    );
};