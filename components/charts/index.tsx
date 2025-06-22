import { useEffect, useRef } from "react";
import { BarChartComponent, DoughtnutComponent, LinePlotComponent, PiechartComponent } from "./chart";
import styles from "./chart.module.css";
import { fn, indexAxisType } from "./types";

type DatasetType = any; 

export default function ChartComponent(
    { datasets, labels, legend, formatX, radius, chartType, xLabels, changed, completedFn, indexAxis, title } :
    { 
        datasets: DatasetType[], labels: string[], legend: any, formatX: any, indexAxis: indexAxisType,
        radius: number, chartType: string, xLabels: boolean, changed: number, completedFn: fn, title: string 
    }
) {

    const titleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(title && titleRef.current) titleRef.current.innerHTML = title;
    }, [title]);

    switch (chartType) {
        case "pie":
            return (
                <div className={`${styles.Chart_Div_Doughnut} w-full h-full`}>
                    <div className={styles.Chart_title}>
                        <div className={styles.Chart_title_h2} ref={titleRef}></div>
                        <div className={styles.Chart_Options}>
                            {labels.map((label, idx) => (
                                <span key={`Chart_options_${idx}_${label}`}>{label}</span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.Chart_}>
                        <PiechartComponent datasets={datasets} labels={labels} legend={legend} 
                        changed={changed} completedFn={completedFn} formatX={formatX} />
                    </div>
                </div>
            )
        case "doughnut":
            return (
                <div className={`${styles.Chart_Div_Doughnut} w-full h-full`}>
                    <div className={styles.Chart_title}>
                        <div className={styles.Chart_title_h2} ref={titleRef}></div>
                        <div className={styles.Chart_Options}>
                            {labels.map((label, idx) => (
                                <span key={`Chart_options_${idx}_${label}`}>{label}</span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.Chart_}>
                        <DoughtnutComponent datasets={datasets} labels={labels} legend={legend} 
                        changed={changed} completedFn={completedFn} formatX={formatX} />
                    </div>
                </div>
            )
        case "bar":
            return (
                <div className={`${styles.Chart_Div_Bar} w-full h-full`}>
                    <div className={styles.Chart_title}>
                        <div className={styles.Chart_title_h2} ref={titleRef}></div>
                        <div className={styles.Chart_Options}>
                            {labels.map((label, idx) => (
                                <span key={`Chart_options_${idx}_${label}`}>{label}</span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.Chart_}>
                        <BarChartComponent datasets={datasets} labels={labels} legend={legend} 
                        changed={changed} completedFn={completedFn} indexAxis={indexAxis} formatX={formatX} />
                    </div>
                </div>
            )
        default:
            return (
                <div className={`${styles.Chart_Div_Line} w-full h-full`}>
                    <div className={styles.Chart_title}>
                        <div className={styles.Chart_title_h2} ref={titleRef}></div>
                        <div className={styles.Chart_Options}>
                            {labels.map((label, idx) => (
                                <span key={`Chart_options_${idx}_${label}`}>{label}</span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.Chart_}>
                        <LinePlotComponent datasets={datasets} labels={labels} legend={legend} 
                        radius={radius} xLabels={xLabels} formatX={formatX} changed={changed} completedFn={completedFn} />
                    </div>
                </div>
            )
    }
};