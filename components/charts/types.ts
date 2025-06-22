export type positionType = "center" | "left" | "top" | "right" | "bottom" | "chartArea" | undefined;

export type fn = (val: boolean) => void;

export type indexAxisType = "x" | "y" | undefined;

export type formatXType = ((val: string | number) => string | number) | undefined;

export interface LineDatasetType {
    data: number[],
    label: string,
    borderColor: string,
    fill: boolean,
    backgrououndColor: CanvasGradient | undefined,
    borderWidth: number,
    pointBackgroundColor: string,
};

export interface BarDatasetType {
    data: number[],
    backgroundColor: string[],
    minBarLength: number, 
    borderRadius: number,
};

export interface DoughnutDatsetType {
    data: number[],
    backgroundColor: string[],
    borderColor: string,
};

export interface PiechartDatasetType {
    data: number[],
    backgroundColor: string[],
    borderColor: string,
    borderWidth: number,
    offset: number,
    offsetArray: number[],
};

export interface SlideChartType {
    chartType: string, 
    datasets: any,
    labels: string[],
    legend: string | undefined,
    title: string,
    indexAxis: indexAxisType,
    _id: string | number,
};