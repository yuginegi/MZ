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
  //DBG//console.log("xxx invoked.")
}
window.addEventListener("load", xxx);


// HTML append
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
function setabspos(ele,left,top,mode=0){
  ele.style.position = "absolute";
  if(mode%2==1){
    ele.style.right = left+"px";
  }else{
    ele.style.left = left+"px";
  }
  ele.style.top = top+"px";
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
      aa = (ax > ay) ? ay : ax;
      cl = (sw - w1) / 2;
      ct = (ax > ay) ? dh/2 : (sh - aa*h1)/2;
    }else{ // 816x624にマージン１０向け
      aa = (ax > ay) ? ay : ax;
      [cl, ct] = [(sw - w0 + 20) / 2, (sh - h0 + 20) / 2];
    }
    km.style.left = cl + "px";
    km.style.top = ct + "px";
    km.style.transform = "scale(" + aa + "," + aa + ")";
  }
  //DBG//console.log(this.name, "RESIZE!");
}
function utilSetButton(base,txt,pos,func){
  let btn = generateElement(base, {
    type: "button", textContent: txt,
    style: { position: "absolute", right: pos[0]+"px", top: pos[1]+"px" }
  });
  btn.addEventListener("click", func);
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

/* util */
var gtxtCacheHash = {};
function generateTextClear(){
  //DBG//console.log("generateTextClear", Object.keys(gtxtCacheHash).length);
  for(let kk in gtxtCacheHash){
    let bitmap = gtxtCacheHash[kk];
    //destroyTextPictureBitmap(bitmap)
    if (bitmap && bitmap.mzkp_isTextPicture) {
      bitmap.destroy();
    }
  }
  gtxtCacheHash = {}
}
// From official TextPicture:createTextPictureBitmap
function generateTextBmp(text) {
  //DBG//console.log("generateTextBmp invoked. "+text);
  if(!text || text.length < 1){text = "　";}
  const tempWindow = new Window_Base(new Rectangle());
  const size = tempWindow.textSizeEx(text);
  tempWindow.padding = 0;
  tempWindow.move(0, 0, size.width, size.height);
  tempWindow.createContents();
  tempWindow.drawTextEx(text, 0, 0, 0);
  const bitmap = tempWindow.contents;
  tempWindow.contents = null;
  tempWindow.destroy();
  bitmap.mzkp_isTextPicture = true;
  return bitmap;
}

function getImgSrcFromTEXT(txt){
  // キャッシュ（メモ化）
  if(gtxtCacheHash[txt]){
    //DBG//console.log("Cache used.");
    return gtxtCacheHash[txt].context.canvas.toDataURL();
  }
  // img.src = getImgSrcFromTEXT(txt) みたいに使う
  let aa = generateTextBmp(txt);
  gtxtCacheHash[txt]=aa; // キャッシュのハッシュに追加
  return aa.context.canvas.toDataURL();
}

function geneTagImg(sid,src){
  let p = document.createElement("img");
  p.id = sid;
  p.src = src;
  return p;
}
function geneTagImgFromTEXT(sid,txt){
  return geneTagImg(sid,getImgSrcFromTEXT(txt))
}

// click, enter, leave ３セット
function set3func(tar,base,func1,func2=null,func3=null){
  if(func2==null){func2 = func1;}
  if(func3==null){func3 = func2;}
  tar.onclick      = func1.bind(base);
  tar.onmouseenter  = func2.bind(base);
  tar.onmouseleave = func3.bind(base);
}

class charaFace{ // 顔イメージ
  constructor(args,ifile,id){
    // args[2] から決めるパラメータ
    let cid = args[2];
    let imgfile = "img/faces/"+ifile+".png";
    //console.log(imgfile);
    // Image
    this.img = new Image();
    this.img.src = imgfile;
    this.cid = cid;
    // Init
    this.xx = args[0];
    this.yy = args[1];
    this.can = generateElement(null,{type:"canvas",id:"cface_"+id,vid:id,width:144,height:144,
      style:{"z-index":51,position:"absolute",left:args[0]+"px",top:args[1]+"px"}});
    this.ctx = this.can.getContext("2d");
    // mouseevent は 上でセット。
    this.img.onload = this.draw.bind(this)
  }
  draw(){
    const ctx = this.ctx;
    ctx.clearRect(0,0,144,144);
    let ii = this.cid;
    let [x,y]=[(ii%4), Math.floor(ii/4)];
    //DBG//console.log(x,y,ii);
    let aa = 1;
    ctx.drawImage(this.img,144*x,144*y,144,144,0,0,144*aa,144*aa);
  }
}
class charaImg{ // 歩行イメージ
  constructor(args,ifile,id){
    // args[2] から決めるパラメータ
    let cid = args[2];
    let imgfile = "/img/characters/"+ifile+".png";
    //DBG//console.log("WALK:",imgfile,cid,id);
    // Image
    this.img = new Image();
    this.img.src = imgfile;
    this.cid = cid;
    // Init
    this.xx = args[0];
    this.yy = args[1];
    this.can = generateElement(null,{type:"canvas",id:"chara_"+id,vid:id,width:48,height:48, 
    style:{"z-index":51,position:"absolute",left:args[0]+"px",top:args[1]+"px"}});
    this.ctx = this.can.getContext("2d");
    // mouseevent は 上でセット。
    // loop
    this.tt = 0;
    setInterval(this.draw.bind(this),250);
  }
  // 上から状態を更新するとき。例えばマウスホバー
  setdraw(flag){
    this.setflag=flag;
    this.tt--;
    this.draw();
  }
  // 描画
  draw(){
    const ctx = this.ctx;
    ctx.clearRect(0,0,48,48);
    if(this.setflag){ // 背景色の設定
      ctx.fillStyle = "#0000FF80";
      ctx.fillRect(0,0,48,48);
    }
    let ii = this.cid-1;
    let ll = [0,1,2,1]
    let [px,py]=[3*(ii%4)+ll[(this.tt++)%(ll.length)], 4*Math.floor(ii/4)];
    ctx.drawImage(this.img,48*px,48*py,48,48,0,0,48,48);
  }
}