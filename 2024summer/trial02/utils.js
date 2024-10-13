// BODYのCSSを書き換える。CSSファイル用意でも良い。
function xxx() {
  document.body.style.margin = "0px"; // HTML重ねる為
  document.body.style.overflow = "hidden"; // スクロールバー抑制

  let d = document;
  // CSSの追加
  var head = d.getElementsByTagName('head')[0];
  var link = d.createElement('link');
  link.setAttribute('rel','stylesheet');
  link.setAttribute('type','text/css');
  link.setAttribute('href','css/ystyle.css');
  head.appendChild(link);
  // 右クリック禁止(これでうまくいくっぽい)
  d.oncontextmenu = function () {return false;}
  console.log("xxx invoked.")
}
window.addEventListener("load", xxx);


// HTML append
function generateElement(target, par) {
  let ele = document.createElement(par.type);
  if (target) { target.append(ele); }
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

function UtilmultiMoveLine(ctx,arg){
  ctx.beginPath();
  ctx.moveTo(arg[0][0],arg[0][1]);// 最初にMOVEして、
  for(let i=1;i<arg.length;i++){
    ctx.lineTo(arg[i][0],arg[i][1]);// 以降はLINEする
  }
  ctx.closePath();
}

function utilsaveclip(ctx,arg){
  ctx.save()
  UtilmultiMoveLine(ctx,arg);
  ctx.clip()
}
function utilclippath(ctx,arg){
  UtilmultiMoveLine(ctx,arg);
  ctx.clip()
}

function utilResizeFunc(target, barpos=null) {
  let km = document.getElementById(target);
  if (km) {
    let [sw, sh] = [window.innerWidth, window.innerHeight];
    // 816x624
    let [w0, h0] = [816, 624]; // 全体
    let cl, ct, aa;
    let [ax, ay] = [sw / w0, sh / h0];
    if(barpos){ // 小さい時はうまくいかない。
      // 計算が悪いんだけどとりあえずこれでいいか・・・。
      let [dw, dh] = barpos // [160,0]
      let [w1, h1] = [w0 - dw, h0 - dh] // 位置決め
      [cl, ct] = [(sw - w1) / 2, (sh - h1) / 2];
      aa = (ax > ay) ? ay : ax;
      if(ax > ay){ // aa = ay
        ct = dh/2
      }else{ // aa = ax
        ct = (sh - aa*h1)/2
      }
    }else{ // 816x624にマージン１０向け
      aa = (ax > ay) ? ay : ax;
      [cl, ct] = [(sw - w0 + 20) / 2, (sh - h0 + 20) / 2];
    }
    km.style.left = cl + "px";
    km.style.top = ct + "px";
    km.style.transform = "scale(" + aa + "," + aa + ")";
  }
  console.log(this.name, "RESIZE!");
}

/*** TUKURU *******/
var disableMZ = false;
var disableBGM = true;
// For SE
function audioInvokeSE(name,vol=90,pitch=100,pan=0){
  if(disableMZ){return;}
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  //Game_Interpreter.prototype.command251();
  Game_Interpreter.prototype.command250(par);
}
// For BGM
function audioPlayBGM(name,vol=90,pitch=100,pan=0){
  if(disableMZ){return;}
  if(disableBGM){return;}
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  Game_Interpreter.prototype.command241(par);
}
// For BGM
function audioStopBGM(sec=0){
  if(disableMZ){return;}
  let par = [sec]
  Game_Interpreter.prototype.command242(par);
}

// For BGS
function audioPlayBGS(name,vol=90,pitch=100,pan=0){
  if(disableMZ){return;}
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  Game_Interpreter.prototype.command245(par);
}
// For BGS
function audioStopBGS(sec=0){
  if(disableMZ){return;}
  let par = [sec]
  Game_Interpreter.prototype.command246(par);
}

/* HOOK */


