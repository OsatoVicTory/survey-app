import { SlideChartType } from "@/components/charts/types";
import { FullSurveyTpe, SurveyResponse, SurveyType } from "@/types/survey";

const cl = [
    "rgba(153, 102, 255, 0.9)",
    "rgba(255, 99, 132, 0.9)",
    "rgba(255, 205, 86, 0.9)",
    // "rgba(54, 162, 235, 0.9)",
    "rgba(75, 192, 192, 0.9)",
]

export const randomArr = (len: number, max: number, min: number) => {
    const res = [];
    for(let i = 0; i < len; i++) {
        res[i] = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return res;
};

export const lineData = (data: number[], backgroundColorCtxGradient: CanvasGradient | null) => {
    return {
        data,
        label: "Untitled Question",
        borderColor: "rgba(58, 123, 213, 0.5)",
        backgroundColor: backgroundColorCtxGradient || "rgba(58, 123, 213, 0.5)",
        borderWidth: 3,
        fill: true,
        pointBackgroundColor: "#fff" 
    }
};

export const barData = (data: number[]) => {
    return {
        data,
        backgroundColor: cl.slice(0, data.length),
        minBarLength: 30, 
        maxBarThickness: 58,
        borderRadius: 5,
        borderColor: "transparent",
    }
};

export const pieData = (data: number[], len: number, pieType: string) => {
    const offsetArray = pieType === "sliced" ? randomArr(len, 60, 20) : Array(len).fill(5);
    const offset = offsetArray[0];
    return {
        data,
        backgroundColor: cl.slice(0, data.length),
        borderColor: "white",
        borderWidth: 3,
        offset, offsetArray,
    }
};

export const doughnutData = (data: number[]) => {
    return {
        data,
        backgroundColor: cl,
        borderColor: "white",
        borderWidth: 3,
        // borderColor: "transparent",
    };
};

export const getChartData = (data: SurveyType, responses: SurveyResponse, chartType: string, computeBg: CanvasGradient | null) => {
    const opts = ["A", "B", "C", "D"];
    const options = data.options.map((opt, idx) => `${opts[idx]}). ${opt}`);
    if(chartType === "pie" || chartType === "sliced-pie") {
        return {
            chartType: "pie", // not for sliced-pie, so offsetArray should be all zeros
            datasets: [pieData(responses, data.options.length, chartType)],
            labels: options,
            legend: data.question,
            title: data.question,
            indexAxis: undefined,
            _id: data._id,
        };
    } else if(chartType === "doughnut") {
        return {
            chartType: "doughnut",
            datasets: [doughnutData(responses)],
            labels: options,
            legend: data.question,
            title: data.question,
            indexAxis: undefined,
            _id: data._id,
        }
    } else if(chartType === "bar" || chartType === "horizontal-bar") {
        return {
            chartType: "bar",
            datasets: [barData(responses)],
            labels: options,
            legend: data.question,
            title: data.question,
            indexAxis: chartType === "bar" ? "x" : "y",
            _id: data._id,
        }
    } else {
        return {
            chartType: "line",
            datasets: [lineData(responses, computeBg)],
            labels: options,
            legend: data.question,
            title: data.question,
            indexAxis: undefined,
            _id: data._id,
        }
    }
};

export const fetchChartData = (data: FullSurveyTpe, cb: CanvasGradient | null) => {
    const order = ["pie", "bar", "horizontal-bar", "sliced-pie", "doughnut", "line"];
    const res: SlideChartType[][] = [];
    let aux: any[] = [];
    data.questions.forEach((q, i) => {
        const chartType = order[i % order.length];
        aux.push(getChartData(q, data.responses[i], chartType, chartType === "line" ? cb : null));
        if(aux.length === 2) {
            res.push(aux);
            aux = [];
        }
    });
    return res;
};