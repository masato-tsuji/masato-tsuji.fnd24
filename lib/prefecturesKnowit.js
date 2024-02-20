'use strict'
// 都道府県を知ろう

const prefecturesKnowit = () => {

    const knowitArea = document.querySelector("#knowit_area");
    const knowitSummary = document.querySelector("#knowit_summary");
    const mapPin = document.querySelector(".map-pin");
    const tglOkinawa = document.querySelector("#okinawa_move");

    // 初期化
    const initialize = () => {
        // ViewBox: (-889 -28 2380 2010) 通常版
        // ViewBox: (-670 -30 1950 1650) 沖縄移動版
        if (tglOkinawa.checked) {
            setViewBox([-670, -30, 1950, 1650]);
        } else {
            setViewBox([-890, -30, 2380, 2010]);
        }

        knowitSummary.innerText = "";
        knowitArea.style.display = "block";
        mapPin.style.display = "none";

    }
    

    const typingSumm = typing(knowitSummary);
    document.querySelectorAll(".jp-pref").forEach( elm => {
        elm.addEventListener("click", (event) => {
            
            // 非表示なら
            if (knowitArea.offsetParent === null) {
                return;
            }

            // ピン表示（※適切な場所に表示できる方法模索中・・・）
            // const svg = elm.getBoundingClientRect();

            let summary = "";
            switch (getPrefInfo(elm.id).prefName) {
                case "北海道":
                    summary = "北海道は日本最北の大きな島で、自然が豊かな地域です。美しい景色や四季折々の自然が楽しめ、冬にはスキーや温泉、夏には登山やキャンプなどが人気です。北海道ならではの食文化も魅力で、ジンギスカンや海鮮料理、ラーメンなどが有名です。観光地としては、札幌市や函館市、小樽市などの都市、知床や阿寒湖などの自然景観が人気です。"
                    break;
                case "埼玉県":
                    summary = "埼玉県は、日本の関東地方に位置し、首都圏の一角を担う都道府県です。県庁所在地はさいたま市で、人口は約730万人であり、東京都に隣接しています。埼玉県は農業や工業が盛んであり、埼玉スーパーアリーナや大宮駅周辺の商業施設、秩父や川越などの観光地があります。また、親子で楽しめるテーマパークや動物園も充実しています。首都圏へのアクセスも良好であり、都心部との交流も盛んです。"
                    break;
                case "新潟県":
                    summary = "新潟県は、日本の中部に位置し、北に新潟市をはじめとする中心都市があります。人口は約230万人で、日本海に面しています。観光地としては、越後湯沢スキーリゾートや柏崎市の美しい海岸線、新潟市の歴史的な名所などがあります。また、新潟市周辺では美味しい海産物や米などの食文化も楽しめます。自然の美しさや美食、歴史的な名所が魅力のある県です。"
                    break;
                case "愛知県":
                    summary = "愛知県は、日本の中部に位置し、人口約750万人の工業地帯です。県庁所在地は名古屋市で、トヨタ自動車をはじめとする自動車産業が盛んです。観光地としては、名古屋城や熱田神宮などの歴史的建造物や、リトルワールドや名古屋港水族館などのテーマパーク、美食も楽しめます。経済的にも文化的にも活気があり、日本の中心地の一つとして重要な位置を占めています。"
                    break;
                case "三重県":
                    summary = "三重県は、日本の中部に位置し、人口約180万人の都道府県です。県庁所在地は津市で、伊勢神宮や伊勢市のおかげ横丁、鳥羽市の水族館や港、志摩市のリゾート地などが有名です。また、伊勢海老や伊勢うどんなどの郷土料理も楽しめます。豊かな自然と歴史的な観光地が魅力で、観光客に人気のある県です。"
                    break;
                case "鹿児島県":
                    summary = "鹿児島県は、日本の九州地方に位置し、南に位置しています。県庁所在地は鹿児島市で、人口は約160万人です。観光地としては、桜島や霧島山などの自然景観、指宿温泉や佐多岬などの温泉地、鹿児島城や仙巌園などの歴史的な名所があります。また、鹿児島県は黒豚や黒毛和牛などの美味しい食材が有名で、地元の郷土料理も楽しめます。自然の美しさや温泉、歴史的な観光地、美食が魅力のある県です。"
                    break;
                case "沖縄県":
                    summary = "沖縄県は、日本の南西部に位置し、温暖な気候と美しい海岸線が特徴の県です。県庁所在地は那覇市で、人口は約140万人です。沖縄県は独自の文化や言語を持ち、琉球王国時代の歴史的な遺産も多く残っています。観光地としては、首里城や古宇利大橋などの歴史的な建造物や、美ら海水族館、海中道路などの自然景観があります。また、沖縄料理や泡盛などの郷土料理も楽しめます。絶景や文化、美食が魅力のある県で、多くの観光客が訪れます。"
                    break; 
            }
            typingSumm(summary || "sorry in preparation............")

        });
    });

    return initialize;
}


