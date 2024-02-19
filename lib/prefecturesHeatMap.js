'use strict'
// 気温ヒートマップ

const prefecturesHeatMap = () => {

    const heatArea = document.querySelector("#heat_area");
    const heatColor = document.querySelector("#heat_color");
    const heatExecBtn = document.querySelector("#heat_exec");
    const heatResetBtn = document.querySelector("#heat_reset");
    const tglOkinawa = document.querySelector("#okinawa_move");

    // 温度帯域と色の配列定義（最高気温対応のため最終要素は100）
    const arrayTempZone = [-3, 0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 100];
    const arrayTempColor = ["#0000cd", "#0000ff", "#4169e1", "#6495ed",	"#87CEFA", "#C0DCF4", "#C0F3F4", "#83EDAB", "#94EB85", "#CCEC84", "#FFCC66", "#FF9933", "#FF6600", "#FF3300", "#CC3300", "#000000"];

    const initialize = () => {
        heatArea.style.display = "block";
        if (tglOkinawa.checked) {
            setViewBox([-670, -30, 1950, 1650]);
        } else {
            setViewBox([-890, -30, 2380, 2010]);
        }

        // ヒートカラー作成
        if (!heatColor.hasChildNodes()) {
            for (let i = 0; i < arrayTempColor.length; i++) {
                const span = document.createElement("span");
                span.style.backgroundColor = arrayTempColor[i];
                span.style.width = "28px";
                heatColor.appendChild(span);
            }
        }

    }

    const resetHeatMap = () => {
        document.querySelectorAll(".jp-pref").forEach((elm) => {
            elm.style.fill = "";
        });
    }

    // ヒートマップ表示用データ作成
    const makeHeatMapData = (arrayObj, kind, year, month) => {
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

    // ヒートマップ描画
    const paintingHeatMap = arrayObj => {
        document.querySelectorAll(".jp-pref").forEach((elm) => {
            const array = arrayObj.filter(obj => obj.pref_id === elm.id);
            const colorIndex = arrayTempZone.findIndex(num => num >= array[0].val);
            const colorCode = arrayTempColor[colorIndex];
            elm.style.fill = colorCode;
        });
    }

    // 実行ボタン
    heatExecBtn.addEventListener("click", (e) => {
        const year = document.heat_year.radio_year.value;
        const month = document.heat_month.radio_month.value;
        const kind = document.heat_kind.radio_kind.value;

        if (year && month && kind) {
            // prefsTempは./data/prefs_temp_json.jsから読み込んだオブジェクト
            paintingHeatMap(makeHeatMapData(prefsTemp, kind, year, month));
        }
    });
    
    // リセットボタン
    heatResetBtn.addEventListener("click", (e) => {
        resetHeatMap();
        initialize();
    });

    return initialize;

}