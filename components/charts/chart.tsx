"use client";

import { Chart as ChartJS, registerables, ScriptableContext } from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMemo, useRef } from "react";
import { BarDatasetType, DoughnutDatsetType, fn, formatXType, LineDatasetType, PiechartDatasetType, positionType } from "./types";
ChartJS.register(...registerables, ChartDataLabels);

type idxAxisType = "x" | "y" | undefined;

export const BarChartComponent = (
    { datasets, labels, legend, changed, completedFn, indexAxis, formatX }: 
    { 
        datasets: BarDatasetType[], labels: string[], legend: boolean | undefined, 
        changed: number, completedFn: fn, indexAxis: idxAxisType, formatX: formatXType 
    }
) => {

    const delayed = useRef<boolean>(false);

    const Data = useMemo(() => {
        return {
            labels,
            datasets,
        };
    }, [changed]);

    const scalesObj = useMemo(() => {
        const y = {
            ticks: {
                callback: function (value: any) {
                    return `${value}`
                },
                font: {
                    size: 12,
                }
            }
        };
        const x = {
            grid: {
                display: false
            },
            ticks: {
                callback: function (val: any, index: number, ticks: any[]) {
                    const value = labels[index];
                    return `${formatX ? formatX(value||"") : value}`;
                },
                font: {
                    size: 13,
                },
            }
        }; 
        if(indexAxis === "y")  return {y: {...x, grid: { display: true } }, x: {...y, grid: { display: false } }};
        else return {y, x};
    }, [indexAxis]);

    const optionsData = useMemo(() => {
        return {
            indexAxis,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: legend || false
                },
            },
            animation: {
                onComplete: () => {
                    delayed.current = true;
                    completedFn(true);
                },
                delay: (context: ScriptableContext<'bar'>) => {
                    let delay = 0;
                    if(context.type === "data" && context.mode === "default" && !delayed.current) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                },
            },
            scales: scalesObj,
        }
    }, [changed]);

    return (
        <Bar
            data={{...Data}} id="barChart"
            width={"100%"} height={"100%"}
            options={{...optionsData}}
        />
    );
};


/*  DOUGHNUT  */
export const DoughtnutComponent = (
    { datasets, labels, legend, changed, completedFn, formatX }: 
    { 
        datasets: DoughnutDatsetType[], labels: string[], legend: positionType, 
        changed: number, completedFn: fn, formatX: formatXType 
    }
) => {

    
    const Data = useMemo(() => {
        return {
            labels,
            datasets
        };
    }, [changed]);

    const optionsData = useMemo(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                onComplete: () => {
                    completedFn(true);
                },
            },
            plugins: {
                legend: {
                    position: window.innerWidth > 500 ? legend : undefined,
                },
                datalabels: {
                    formatter: function (value: any, context: any) {
                        const label = context.chart.data.labels?.[context.dataIndex];
                        if(label) {
                            return `${formatX ? formatX(label||"") : label}`;
                        }
                    },
                },
            }
        }
    }, [changed]);

    return (
        <Doughnut
            data={{...Data}} id="doughnutChart"
            width={"100%"} height={"100%"}
            options={{...optionsData}}
        />
    );
};



/*  LINE  */
export const LinePlotComponent = (
    { datasets, labels, legend, radius, formatX, xLabels, changed, completedFn } : 
    { 
        datasets: LineDatasetType[], labels: string[], legend: boolean | undefined, 
        changed: number, radius: number, formatX: formatXType, xLabels: boolean, completedFn: fn 
    }
) => {
    
    const delayed = useRef<boolean>(false);

    const Data = useMemo(() => {
        return {
            labels,
            datasets
        };
    }, [changed]);

    const optionsData = useMemo(() => {
        return {
            radius: radius || 3,
            hitRadius: 20,
            hoverRadius: radius ? (radius * 1.8) : 6,
            responsive: true,
            maintainAspectRatio: false,
            showXLabels: xLabels || true,
            plugins: {
                legend: {
                    display: legend||false
                },
                datalabels: {
                    formatter: function () {
                        return "";
                    },
                },
            },
            animation: {
                onComplete: () => {
                    delayed.current = true;
                    completedFn(true);
                },
                delay: (context: ScriptableContext<'line'>) => {
                    let delay = 0;
                    if(context.type === "data" && context.mode === "default" && !delayed.current) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                },
            },
            scales: {
                y: {
                    ticks: {
                        callback: function (value: any) {
                            return `${value}`
                        },
                        font: {
                            size: 12,
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        callback: function (val: any, index: number, ticks: any[]) {
                            const value = labels[index];
                            return `${formatX ? formatX(value||"") : value}`;
                        },
                        font: {
                            size: 13,
                        },
                    }
                } 
            }
        }
    }, [changed]);

    return (
        <Line
            data={{...Data}} id="myChart"
            width={"100%"} height={"100%"}
            options={{...optionsData}}
        />
    )
};



/*  PIE  */
export const PiechartComponent = (
    { datasets, labels, legend, changed, completedFn, formatX }: 
    { 
        datasets: PiechartDatasetType[], labels: string[], legend: positionType, 
        changed: number, completedFn: fn, formatX: formatXType 
    }
) => {

    const Data = useMemo(() => {
        return {
            labels,
            datasets
        };
    }, [changed]);

    const optionsData = useMemo(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                onComplete: () => {
                    completedFn(true);
                },
            },
            plugins: {
                legend: {
                    position: window.innerWidth > 500 ? legend : undefined,
                },
                datalabels: {
                    formatter: function (value: any, context: any) {
                        const label = context.chart.data.labels?.[context.dataIndex];
                        if(label) {
                            return `${formatX ? formatX(label||"") : label}`;
                        }
                    },
                },
            }
        }
    }, [changed]);

    return (
        <Pie
            data={{...Data}} id="pieChart"
            width={"100%"} height={"100%"}
            options={{...optionsData}}
        />
    );
};