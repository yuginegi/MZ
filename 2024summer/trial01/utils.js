// BODYのCSSを書き換える。CSSファイル用意でも良い。
function xxx() {
  document.body.style.margin = "0px"; // HTML重ねる為
  document.body.style.overflow = "hidden"; // スクロールバー抑制
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

var disableMZ = false;
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
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  Game_Interpreter.prototype.command241(par);
}
// For BGS
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
