import styles from "./styles.module.css";

export function LoadingSpinner({ width, height, color }: { width: string, height: string, color: string }) {
    return (
        <div className={styles.Loading_Spinner} style={{width, height, color}}></div>
    );
};

export function SlideLoadingSpinner({ width, height, color }: { width: string, height: string, color: string }) {
    return (
        <div className={styles.Slide_Loading_Spinner} style={{width, height, color}}></div>
    );
};

export function Skeleton() {
    return (
        <div className={styles.skeleton}></div>
    );
};

export function ButtonLoadingSpinner({ width, height, color }: { width: string, height: string, color: string }) {
    return (
        <div className="flex items-center justify-center" style={{width, height, color}}>
            <div className={styles.btn_loader} style={{width: "1.5px", height: "1.5px", color}}></div>
        </div>
    );
};