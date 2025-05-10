//====================================================================
// 起動時に CSS などの挿し込み
function xxx() {
  let d = document;
  // BODYのCSSを書き換える
  d.body.style.margin = "0px"; // HTML重ねる為
  d.body.style.overflow = "hidden"; // スクロールバー抑制
  // CSSの追加（今は不要）
  // 右クリック禁止(これでうまくいくっぽい)
  d.oncontextmenu = function () {return false;}
  console.log("xxx invoked.")
}
window.addEventListener("load", xxx);

//====================================================================
// リサイズ（中央表示）
var gXXX = 816;
var gYYY = 624;
function utilResizeFunc(target) {
  let km = document.getElementById(target);
  if (km) {
    // リサイズした現在のウインドウサイズ
    let [sw, sh] = [window.innerWidth, window.innerHeight];
    // parseInt は数字以外を無視してくれる
    let [tw, th] = [parseInt(km.style.width),parseInt(km.style.height)]
    //=== 計算 ===
    let [ax, ay] = [sw / gXXX, sh / gYYY];
    let aa = (ax > ay) ? ay : ax;
    let [cl, ct] = [(sw-tw)/2, (sh-th)/2]; // 真ん中に表示したいため
    //=== 計算結果を反映 ===
    km.style.left = cl + "px";
    km.style.top = ct + "px";
    km.style.transform = "scale(" + aa + "," + aa + ")";
  }
}

//====================================================================
// 会話を待たせる仕組み
var gmbusy = null;
function savegmbusy(){
  gmbusy = true; 
  Game_Interpreter.prototype.updateChild_org = Game_Interpreter.prototype.updateChild
  Game_Interpreter.prototype.updateChild = function(){return true}
}
function rollbackmbusy(){
  if(gmbusy){
    Game_Interpreter.prototype.updateChild = Game_Interpreter.prototype.updateChild_org
    gmbusy = null;
  }
}

//====================================================================
// HTML挿し込む関数
function generateElement(target, par) {
  let ele = document.createElement(par.type);
  if (target) { target.append(ele); }
  return setStyleElement(ele,par);
}
function setStyleElement(ele, par) {
  for (let key in par.style) {
    ele.style[key] = par.style[key];
  }
  for (let key in par) {
    if (key == "classList_add") {
      ele.classList.add(par[key]);
      continue;
    }
    if (["type", "style"].indexOf(key) != -1) { continue; }
    ele[key] = par[key];
  }
  return ele;
}