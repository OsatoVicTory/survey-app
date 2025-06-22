"use client";

import html2canvas from "html2canvas";

const _getSlideImage = async (id: string) => {
    try {
        const ele = document.getElementById(id);
        if(ele) {
            const doc = await html2canvas(ele, {
                backgroundColor: null,
                useCORS: true,
                scale: 1.0,
            });
            return doc.toDataURL('image/png');
        }
    } catch(err) {
        console.log(err);
    }
};

export const _getSlidesImage = async (cnt: number) => {
    return await Promise.all(
        Array(cnt).fill(0).map((v, _idx) => _getSlideImage(`Slide_${_idx}`))
    );
};

export const getPureTitleText = (title: string) => {
    return title.replaceAll(/(<([^>]+)>)/ig, "");
};