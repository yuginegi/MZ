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

//====================================================================
// コントローラ。たぶん共通で使えるはず
class gamePad{
  constructor(){}
  startfunc(){
    this.gamepad = null;
    this.cntintval = setInterval(this.cntfunc.bind(this),1000/60);
  }
  endfunc(){
    clearInterval(this.cntintval);
  }
  cntfunc(){
    // ゲームパッドを取得する
    var gamepad_list = navigator.getGamepads();
    for(let i=0;i<gamepad_list.length;i++){
      let pad = gamepad_list[i];
      if(pad){
        return this.cntmainfunc(pad)
      }
    }
    return {};
  }
  cntmainfunc(gamepad){
    let gameInput = {
      left: (gamepad.axes[0] < -0.5),
      right: (gamepad.axes[0] > 0.5),
      top: (gamepad.axes[1] < -0.5),
      bottom: (gamepad.axes[1] > 0.5),
      a: (gamepad.buttons[1].pressed),
      b: (gamepad.buttons[0].pressed),
      x: (gamepad.buttons[3].pressed),
      y: (gamepad.buttons[2].pressed),
      l: (gamepad.buttons[4].pressed),
      r: (gamepad.buttons[5].pressed),
    };
    return gameInput;
  }
}