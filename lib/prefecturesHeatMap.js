'use strict'
// 気温ヒートマップ

const prefecturesHeatMap = () => {

    const heatArea = document.querySelector("#heat_area");
    const heatExecBtn = document.querySelector("#heat_exec");
    const heatResetBtn = document.querySelector("#heat_reset");



    const initialize = () => {

        heatArea.style.display = "block";

    }

    const resetHeatMap = () => {
        document.querySelectorAll(".jp-pref").forEach((elm) => {
            elm.style.fill = "";
        });
    }

    const makeHeatMapData = () => {
        const remakeObj = (arrayObj, kind, year, month) => {
            const arrayTemp = [];
            let newObj = {};
            for (const obj of arrayObj) {
                if (obj.kind === kind) {
                    newObj = {
                        "pref_id": obj.pref_id,
                        "val": obj[`${year}/${month}/1`]
                    }
                    arrayTemp.push(newObj);
                }
            }
            return arrayTemp;
        }
        return remakeObj;
    }
    const heatMap = makeHeatMapData();

    const paintingHeatMap = arrayObj => {
        // 温度帯域と色の配列定義
        const arrayTempZone = [-3, 0, 3, 6, 9, 12,	15,	18,	21,	24,	27,	30,	33,	36, 39, 100];
        const arrayTempColor = ["#0000cd", "#0000ff", "#4169e1", "#6495ed",	"#87CEFA", "#C0DCF4", "#C0F3F4", "#83EDAB", "#94EB85", "#CCEC84", "#FFCC66", "#FF9933", "#FF6600", "#FF3300", "#CC3300", "#FFFFFF"];
        
        document.querySelectorAll(".jp-pref").forEach((elm) => {
            const obj = arrayObj.filter(obj => obj.pref_id === elm.id);
            const colorIndex = arrayTempZone.findIndex(num => num >= obj[0].val);
            const colorCode = arrayTempColor[colorIndex];
            elm.style.fill = colorCode;
        });
    }

    heatExecBtn.addEventListener("click", (e) => {
        const year = document.heat_year.radio_year.value;
        const month = document.heat_month.radio_month.value;
        const kind = document.heat_kind.radio_kind.value;

        if (year && month && kind) {
            paintingHeatMap(heatMap(prefsTemp, kind, year, month));
        }


    });
    
    heatResetBtn.addEventListener("click", (e) => {
        resetHeatMap();
        initialize();
    });

    return initialize;

}