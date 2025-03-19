'use strict'


/**
 * 引数のidと一致する都道府県の情報を返す
 * @param {string} id - 都道府県を識別するためのid文字列 pref_xx
 * @returns {object} - 一致した都道府県情報のオブジェクト
 */
const getPrefInfo = id => {
    for (const pref of prefsInfo) {
        if (pref["id"] === id) return pref;
    }
}

/**
 * マップのロック状態の取得および設定
 * @returns {object} - value() 値を返す関数 、change() 引数で渡された真偽値を記憶
 */
const mapLock = (() => {
    let locked = false;
    return {
        value() {
            return locked;
        },
        change(bool) {
            locked = bool;
        }
    }
})();


/**
 * マップ表示のViewBox（座標と縮尺）を設定しマップに反映する
 * 引数が無い場合はズームと位置を沖縄移動の設定に合わせ調整する
 * @param {Array} viewParams - viewBoxを設定する配列又は空を受け取る [min-x min-y width height]
 */
const setViewBox = viewParam => {
    const svg = document.querySelector("#svg_japan");
    const okinawa = document.querySelector("#pref_47");
    const okinawaLine = document.querySelector("#pref_line");
    const tglOkinawa = document.querySelector("#okinawa_move");

    if (Array.isArray(viewParam)) {
        svg.setAttribute("viewBox", viewParam.join(" "));
    } else if (tglOkinawa.checked) {
        okinawa.setAttribute("transform", "translate(540,-250)");
        okinawaLine.style.display = "block";
        svg.setAttribute("viewBox", "-500 -20 1935 1637");
    } else {
        okinawa.setAttribute("transform", "translate(0,0)");
        okinawaLine.style.display = "none";
        svg.setAttribute("viewBox", "-755 -25 2380 2010");
    }
}

/**
 * 各アプリで表示している要素をすべて非表示にする
 * 都道府県の要素のstyle.fillを初期化する
 */
const hideAppElements = () => {
    document.querySelectorAll(".map-app").forEach((elm) => {
        elm.style.display = "none";
    });
    document.querySelectorAll(".jp-pref").forEach((elm) => {
        elm.style.fill = "";
    });
}

/**
 * マップ上の都道府県名の表示/非表示を切り替える
 * @param {boolean} display - 表示させる場合はtrueを受け取とる
 */
const switchPrefName = display => {
    document.querySelectorAll(".jp-pref-name").forEach((elm) => {
        console.log(elm);
        elm.style.display = display ? "block" : "none";
    });    
}

// 配列の中からランダムに一つ要素を返す
const rndChoice = array => {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 引数で受け取った要素に受け取った文字をタイピング風に出力
 * @param {object} element - 文字列の出力先の要素
 * @returns {object} - タイピングを開始する関数
 */
const typing = (element) => {
    const defaultMsecDelay = 30;
    let index = 0;
    let intervalId;
    let summary;
    const write = () => {
        element.innerHTML += summary[index];
        index++;
        if (index > summary.length - 1) {
            clearInterval(intervalId);
        }
    }
    const execInterval = (argSumm, argMsDelay) => {
        execInterval.reset();
        summary = argSumm;
        const msDelay = argMsDelay > 0 ? argMsDelay : defaultMsecDelay;
        intervalId = setInterval(write, msDelay);
    }
    execInterval.start = () => execInterval();
    execInterval.stop = () => clearInterval(intervalId);
    execInterval.reset = () => {
        clearInterval(intervalId);
        element.innerText = "";
        index = 0;
    }
    return execInterval;
}


/**
 * アプリ用cloudの初期化（FirebaseのFirestoreの準備）
 * @param {Object} elm - 起動したアプリのidが入ったオブジェクト
 */
const cloudAppInitialize = (elm) => {
    fetch(`https://initializejmsrecord-p3vh65al5q-uc.a.run.app?id=${elm.id}`, {
        method: "GET",
    }).then(response => response.json())
    .then(json => {
        console.log(json);
    });
}


document.addEventListener('DOMContentLoaded', () => {

    // プレゼン発表用オープニング表示
    if (window.location.search === "?presen") {
        const head = document.querySelector("head");
        const script = document.createElement("script");
        script.src = "./lib/presenOpening.js";
        head.appendChild(script);
    }

    const tglPrefNmae = document.querySelector("#disp_pref_name");
    const tglOkinawa = document.querySelector("#okinawa_move");
    const tglMapLock = document.querySelector("#map_lock");

    // リサイズ対応（※実装中...）
    // window.addEventListener("resize", () => {
    //     // console.log(window.innerWidth , window.innerHeight );
    // });

    // メニュー
    const knowit = prefecturesKnowit(); // prefecturesKnowit.jsにて定義
    const quiz = prefecturesQuiz(); // prefecturesQuiz.jsにて定義
    const heatMap = prefecturesHeatMap();   // prefecturesHeatMap.jsにて定義
    document.querySelectorAll(".menu-btn").forEach( elm => {
        elm.addEventListener("click", (e) => {
            cloudAppInitialize(elm);
            // TOP
            if (elm.id === "menu_top") {
                hideAppElements();
                if (tglOkinawa.checked) {
                    tglOkinawa.click();
                }
                if (tglMapLock.checked) {
                    tglMapLock.click();
                }
                setViewBox();
            }

            // 都道府県を知ろう
            if (elm.id === "manu_pref_knowit") {
                hideAppElements();
                knowit();
            }
            
            // 都道府県当てクイズ
            if (elm.id === "menu_pref_quiz") {
                hideAppElements();
                quiz();
            }
            
            // おまけ
            if (elm.id === "menu_bonus") {
                hideAppElements();
                heatMap();
            }

        });
    });
    
    // オプション設定
    document.querySelectorAll(".cnf-tgl > input").forEach( elm => {
        elm.addEventListener("change", (e) => {
            
            // 県名表示(※挫折中 一部のみ)
            if (elm.id === "disp_pref_name") {
                switchPrefName(tglPrefNmae.checked);
            }
        
            // 沖縄移動
            if (elm.id === "okinawa_move") {
                setViewBox();
            }
            
            // 地図ロック(※./lib/rxjs.jsにて変数使用)
            if (elm.id === "map_lock") {
                mapLock.change(elm.checked);
            }

            // 知名度UP
            if (elm.id === "disp_pref_highlite") {
                document.querySelector("#pref_24").style.fill = "#ff11c7";
            }
            
        });
    });
    
    // 各県クリックイベント（※debug or 将来用）
    document.querySelectorAll(".jp-pref").forEach( elm => {
        elm.addEventListener("click", (e) => {
            // console.log(getPrefInfo(elm.id).prefName);
        });
    });

});

// ページロード完了
window.onload = function() {
    // console.log("window loaded");
};


