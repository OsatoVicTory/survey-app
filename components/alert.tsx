import { AiOutlineClose } from "react-icons/ai";
import styles from "./styles.module.css";

export default function ToastAlert({text, clickFn}: { text: string, clickFn: () => void }) {
    return (
        <span>
            <div className={styles.Fm_notification}>
                <div className={styles.Fm_notification_div}>
                    <span>{text}</span>
                    <button className={styles.Fmn_close_btn} onClick={clickFn}>
                        <AiOutlineClose className={styles.Fmn_close} />
                    </button> 
                </div>
            </div>
        </span>
    );
};