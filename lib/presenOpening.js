
// const presen = document.createElement("div");
// // presen.className = "contents-box";
// presen.id = "presen_opening";
// //presen.innerHTML = "プレゼンオープニング";

// const body = document.querySelector("body");
// body.appendChild(presen);

const presen = document.querySelector("#presen_opening");
const s = presen.style;

// 表示
s.display = "block";
// s.position = "absolute";
// s.backgroundColor = "white";
// s.top = "25px";
// s.left = "20px";
// s.height = "820px";
// s.width = "1810px";
// s.opacity = "90%";
// presen.style.borderRadius = "30px";
// s.textAlign = "center";


const tags = `
aaa
`


//document.querySelector("#presen_opening").style.display = "block";



// opening start
const openingStart = (elm) => {
    elm.style.display = "none";
    const title = document.querySelector("#presen_title");
    const t = typing(title);
    t("Japanese Map Study", 75);
    setTimeout(() => {
        document.querySelector("#prsen_description").style.display = "block";
        // document.querySelector("#prsen_description").style.opacity = "100%";
    }, 1900);
}

const showStudy = () => document.querySelector("#presen-study").style.display = "block";

const showStudyList = () => {
    document.querySelector("#presen-study-list").style.display = "block";
    document.querySelector("#presen_enter").style.display = "block";
}

// presen enter
const presenStart = () => {
    // openingStart();
    document.querySelector("#presen_opening").style.display = "none";
}



