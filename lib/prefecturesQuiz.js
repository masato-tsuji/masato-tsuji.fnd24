'use strict'
// 都道府県当てクイズ

const prefecturesQuiz = () => {
    
    const naviArea = document.querySelector("#navi_area");
    const naviDesc = document.querySelector("#navi_description");
    const naviOpt = document.querySelector("#navi_option");
    const naviMsg = document.querySelector("#navi_message");
    const naviQuiz = document.querySelector("#navi_question");
    const naviResult = document.querySelector("#navi_result");
    const naviCnt = document.querySelector("#navi_count");
    const naviDenomi = document.querySelector("#navi_denominator"); // 都道府県数分母
    const naviTime = document.querySelector("#navi_time");
    const naviStartBtn = document.querySelector("#navi_start");
    const naviResetBtn = document.querySelector("#navi_reset");
    const tglOkinawa = document.querySelector("#okinawa_move");
    const tglMapLock = document.querySelector("#map_lock");
    const tglChild = document.querySelector("#child_mode");
    const msgBox = document.querySelector("#msg_box");
    const msgIcon = document.querySelector("#msg_icon");
    const msgRec = document.querySelector("#msg_record");
    const msgName = document.querySelector("#msg_input_name");
    const msgSaveBtn = document.querySelector("#msg_save_btn");
    const recArea = document.querySelector("#record_area");
    const recTbl = document.querySelector("#record_tbl");

    // ハイスコアの表示数
    const highScoreDisplayCnt = 5;

    // デモモード（タイムトライアル時に [demoModeLimit] 個正解でクリア）
    const tglDemoMode = document.querySelector("#demo_mode");
    const demoModeLimit = 5;


    /**
     * 都道府県情報からオプションに応じた出題用の配列を作成。
     * @param {object} argPrefsInfo - 各都道府県の情報オブジェクトの配列
     * @property {string} choicedPref - 選択されている都道府県を受け取る
     * @property {boolean} isChildMode - こどもモードの状態
     * @returns {object} - 関数
     */
    const prefsData = (argPrefsInfo) => {
        let prefsArray = [];
        let choicedPref;
        prefsData.makePrefsData = (childMode = false) => {
            if (!childMode) {
                prefsArray = argPrefsInfo.map(pref => ({[pref["id"]]: pref["prefName"]}));
                prefsData.isChildMode = false;
            } else {
                prefsArray = argPrefsInfo.map(pref => ({[pref["id"]]: pref["prefHiragana"]}));
                prefsData.isChildMode = true;
            }
        }
        prefsData.getNameData = () => prefsArray;
        prefsData.choicedPref = "";
        prefsData.isChildMode = false;
        prefsData.deletePref = () => {
            if (prefsArray.indexOf(prefsData.choicedPref) > -1) {
                const index = prefsArray.indexOf(prefsData.choicedPref);
                prefsArray.splice(index, 1);
            }
        }
        return prefsData;
    };

    // "id": "pref_02",
    // "area": "東北",
    // "prefName": "青森県",
    // "shortName": "青森",
    // "prefHiragana": "あおもりけん",
    // "shortHiragana": "あおもり"
    const prefs = prefsData(prefsInfo);  // 即時関数ではメソッドがundefinedになった･･･


    /**
     * テーブルの記録を読み取りタイムトライアルのスコアの順位を算出し
     * ランクインした場合は更新したテーブルを書き出す
     * @returns {object} readRecord - テーブルから記録を読み取るための関数
     */
    const recordUpdate = () => {
        const recArray = [];
        const rowArray = [];
        let rank = 1;
        const readRecord = (score) => {
            const tbl = recTbl.querySelectorAll("td");
            if (tbl.length > 0) {rank = 1;}
            for (let i = 0; i < tbl.length; i++) {
                rowArray.push(tbl[i].innerText);
                if (i % 2 === 1) {
                    if (tbl[i].innerText !== "" && tbl[i].innerText < score) {rank++;}
                    recArray.push(rowArray.concat());
                    rowArray.splice(0);
                }
            }
            return recArray;
        }
        readRecord.getRank = () => rank;
        readRecord.writeRecord = (newRec) => {
            recArray.splice(rank - 1, 0, newRec);
            recArray.pop();
            const tbl = recTbl.querySelectorAll("td");
            for (let i = 0; i < recArray.length; i++) {
                tbl[i * 2].innerText = recArray[i][0];
                tbl[i * 2 + 1].innerText = recArray[i][1];
            }
        }
        return readRecord;
    }

    /**
     * 
     * @param {number} highScoreDisplayCnt 
     */
    const getRecordOfSvr = (highScoreDisplayCnt) => {
        const query = new URLSearchParams({limit: highScoreDisplayCnt});
        fetch(`https://getjmsrecord-p3vh65al5q-uc.a.run.app?${query}`, {
            method: "GET",
        }).then(response => response.table())
        .then(table => {
            console.log(table);
        });
    }

    getRecordOfSvr(5);


    /**
     * 
     * @param {string} name 
     * @param {string} record 
     * @param {number} highScoreDisplayCnt 
     */
    const putRecordOfSvr = (name, record, highScoreDisplayCnt) => {
        const params = {name: elm.id,
            record: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 59)}`, limit: 5};
        const query = new URLSearchParams(params);
        fetch(`https://addjmsrecord-p3vh65al5q-uc.a.run.app?${query}`, {
            method: "GET",
        }).then(response => response.json())
        .then(json => {
            //console.log(json);
        });
    }


    // 初期化
    const initialize = () => {
        prefs.makePrefsData(tglChild.checked);
        !tglOkinawa.checked ? tglOkinawa.click(): setViewBox();
        !tglMapLock.checked ? tglMapLock.click(): null;
        recArea.style.display = "block";
        naviArea.style.display = "block";
        naviDesc.innerText = "出題される都道府県の🗾場所を\nクリックしてください"

        // 初回のみ
        if (naviOpt.hasChildNodes() === false) {
            naviOpt.innerHTML = "<input id='radio_normal' name='nv_opt' type='radio'>ノーマル\
                <input id='radio_time' name='nv_opt' type='radio'>タイムトライアル";
            const normalMsg = "スタートボタンを押す度に出題されます";
            const timetryalMsg = "47都道府県全て正解するタイムを<br>計測します";
            naviOpt.addEventListener('change', (e) => {
                if (e.target.id === "radio_normal") {
                    naviMsg.innerText = normalMsg;
                    naviCnt.style.display = "none";
                    naviDenomi.style.display = "none";
                    naviTime.style.display = "none";
                    initialize();
                } else if (e.target.id === "radio_time") {
                    naviMsg.innerHTML = timetryalMsg;
                    naviCnt.innerHTML = "0";
                    naviCnt.style.display = "block";
                    naviDenomi.innerHTML = "/47";
                    naviDenomi.style.display = "block";
                    naviTime.innerHTML = "0:00";
                    naviTime.style.display = "block";
                    initialize();
                }
            });
            naviOpt.childNodes[0].click();    // default
        }

        naviQuiz.style.backgroundColor = "";
        naviQuiz.innerText = tglChild.checked ? "もんだい" : "問題";
        naviResult.innerText = "";
        naviStartBtn.innerText = tglChild.checked ? "はじめる" : "スタート";
        naviResetBtn.innerText = tglChild.checked ? "さいしょから" : "リセット";
        naviStartBtn.disabled = false;

        // デモモード対応
        naviDenomi.innerHTML = "/" + (tglDemoMode.checked ? demoModeLimit: 47);
    }

    /**
     * 出力用の要素を受け取り経過時間をフォーマットして文字列を表示させる
     * @param {object} elm - 経過時刻を表示させる要素を受け取る
     * @returns タイマーを実行する関数execTimer
     */
    const timer = (elm) => {
        let cnt = 0;
        let timeoutID;
        let state = false;
        const timeCnt = () => {
            cnt++;
            elm.innerText = `${Math.floor(cnt / 60)}:${("0" + (cnt % 60)).toString().slice(-2)}`;
        }
        const execTimer = () => timeoutID = setInterval(timeCnt, 1000);
        execTimer.start = () => {
            execTimer();
            state = true;
        }
        execTimer.stop = () => {
            clearInterval(timeoutID);
            state = false;
        }
        execTimer.getState = () => state;
        execTimer.reset = () => {
            execTimer.stop();
            cnt = 0;
            elm.innerText = "0:00";
        }
        return execTimer;
    }
    
    /**
     * 出力用の要素を受け取りカウント値を出力する
     * @param {object} elm - カウント出力先の要素
     * @returns {object} accum - カウントする関数
     */
    const counter = (elm) => {
        let cnt = 0;
        const accum = () => {
            cnt++;
            elm.innerText = cnt;
            return cnt;
        }
        accum.value =  () => cnt;
        accum.up = () => accum();
        accum.reset = () => {
            cnt = 0;
            elm.innerText = 0;
        }
        return accum;
    }

    let choicePrefId = "";
    // 出題
    const execQuiz = () => {
        naviResult.innerText = "";
        const obj = rndChoice(prefs.getNameData()); // script.jsの関数を使用
        prefs.choicedPref = obj;
        choicePrefId = Object.keys(obj)[0]; 
        naviQuiz.innerText = Object.values(obj)[0];
    }

    // ノーマルモード 回答チェック
    const chkNormalQuiz = (elm) => {
        let msg;
        let res;
        if (choicePrefId === elm.id) {
            msg = prefs.isChildMode ? "すごい" : "正解";
            res = `${msg}${rndChoice(["🎉", "🎊", "🎈", "👍", "😊"])}`;
        } else {
            msg = prefs.isChildMode ? "おしい" : "不正解";
            res = `${msg}${rndChoice(["😱", "😣", "😵", "🙈", "👻"])}`;
        }
        naviResult.innerHTML = res;
    }

    // タイムトライアル 回答チェック
    const chkTimeQuiz = (elm) => {

        // 結果表示
        let msg;
        if (choicePrefId === elm.id) {
            naviQuiz.style.backgroundColor = "rgb(218, 255, 178)";
            prefs.deletePref();
            quizCounter.up();
        } else {
            naviQuiz.style.backgroundColor = "rgb(243, 174, 178)";
            return;
        }

        // 進捗チェック
        if (quizCounter.value() < (tglDemoMode.checked ? demoModeLimit: 47)) {
            execQuiz();
            return;
        }
        
        quizTimer.stop();
        msg = `おめでとう${rndChoice(["🎉", "🎊", "🚀", "🤗", "💮"])}`;
        naviResult.innerText = msg;
      


        // 記録チェック
        const rec = recordUpdate();
        rec(naviTime.innerText);

        if (rec.getRank() > highScoreDisplayCnt) {
            return;
        }

        // 記録更新
        msgIcon.innerText = ["🏆", "🥈", "🥉", "4位", "5位"][rec.getRank() - 1];
        msgRec.innerText = naviTime.innerText;
        msgBox.style.display = "block";
        setTimeout(() => {
            msgBox.classList.add("show");
        }, 100);



        msgSaveBtn.addEventListener("click", (e) => {
            const userName = msgName.value ? msgName.value + "さん" : "ななしさん";
            rec.writeRecord([userName, naviTime.innerText]);
            msgBox.style.display = "none";
        });
    }
    
    // 都道府県クリック
    document.querySelectorAll(".jp-pref").forEach(elm => {
        elm.addEventListener("click", (e) => {

            // アプリ非表示ならreturn
            if (naviArea.offsetParent === null) {
                return;
            }
            
            // 回答チェック
            if (document.querySelector("#radio_normal").checked) {
                chkNormalQuiz(elm);
            } else if (document.querySelector("#radio_time").checked) {
                if (quizTimer.getState()) {
                    chkTimeQuiz(elm);
                }
            }
            
        });
    });

    const quizTimer = timer(naviTime);
    const quizCounter = counter(naviCnt);

    naviStartBtn.addEventListener("click", (e) => {
        execQuiz();
        if (document.querySelector("#radio_time").checked) {
            naviStartBtn.disabled = true;
            quizCounter.reset();
            quizTimer.start();
        }
    });
    
    naviResetBtn.addEventListener("click", (e) => {
        quizTimer.reset();
        quizCounter.reset();
        initialize()
    });

    return initialize;
}


