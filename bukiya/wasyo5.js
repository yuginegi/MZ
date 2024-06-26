//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc ユーティリティプログラム
 * @author wasyo
 *
 * @help wasyo5.js
 *
 * ＜一番最初に定義する＞
 * 文字を画像にする関数をグローバル、どこからでも呼べる
 * CSSの追加などをしている、そういうのはココに任せる
 *
 * @command enter
 * @text MAPとぶ
 * @desc 
 * ループ変数の番号をください、１にして返します
 * 使うための変数をください
 * @arg val1
 * @type number
 * @text ループ変数の番号（数字）
 * @desc 使って良い変数の数字
 * @arg val2
 * @type number
 * @text 使って良い変数の番号（数字）
 * @desc 大事な情報
 */

/***************************************************************
* Utility Functions. (this funcs are global. take care impact)
***************************************************************/

function menuFunc(par,base,mtxt){
  par.base = base;
  par.menu = mtxt;
  menuFuncMain(par)
}
function menuFuncMain(par){
  console.log(par.base)
  let base = par.base;
  console.log(par)
  let menutext = par.menu;
  let n = menutext.length;
  let divid = par.divid;
  let strid = par.strid;
  let [la,lb,ta,tb] = par.lt;
  let thisbase = par.thisbase;
  let thisfunc = par.thisfunc;
  let parent = par.parent;
  let type = 0;
  if(menutext.length == 0){
    menutext[0] = "メニューなし";
    type = 1;
  }
  for(let i=0;i<n;i++){
    let [left,top] = [la+lb*i,ta+tb*i];
    let bcl = ["#008","#444"]; 
    let pstyle = {
      type:"div",
      classList_add:"kwnd2u2",
      id:divid+i,
      tarid:(i+1),
      style:{
        "animation-duration":((1*i+5)/10)+"s",
        padding:"5px 5px 0px 40px",
        "z-index":15,
        position:"absolute",
        left:left+"px",top: top+ "px",width:"200px",height:"40px",
        background:bcl[type]
      }
    };
    let tar = generateElement(base,pstyle);  //base->tar->p->menutext[i]
    base.append(tar);
    let p = parent.geneStrImg(strid+i, menutext[i]);
    p.tartxt = menutext[i];
    p.tarid = String(i);
    p.actid = i;
    if(type==0){set3func(p,thisbase,thisfunc);}
    tar.append(p);
  }
}

function rangeValue(r,r1,r2,v0,v1){
  if(r1 > r2){
    return rangeValue(r,r2,r1,v1,v0)
  }
  if(r <= r1){return v0;} // r=r1 => v0
  if(r2 <= r){return v1;} // r=r2 => v1
  // return v0 + ((r-r1)/(r2-r1))*(v1-v0); <= これであってる
  // (Y-y0) = A(X-x0) => Y = A(X-x0)+y0
  let A = (v1-v0)/(r2-r1);
  return A*(r-r1) + v0;
}

// 関数を呼んだら、相手先のデータと処理をするように初期化
function bindFuncListInit(tar,res,funclist){
  for(let cc of funclist){
    tar[cc] = res[cc].bind(res);
  }
}

// click, over, leave ３セット
function set3func(tar,base,func1,func2=null,func3=null){
  if(func2==null){func2 = func1;}
  if(func3==null){func3 = func2;}
  tar.onclick      = func1.bind(base);
  tar.onmouseover  = func2.bind(base);
  tar.onmouseleave = func3.bind(base);
}
// click, enter, leave ３セット
function set3func2(tar,base,func1,func2=null,func3=null){
  if(func2==null){func2 = func1;}
  if(func3==null){func3 = func2;}
  tar.onclick      = func1.bind(base);
  tar.onmouseenter = func2.bind(base);
  tar.onmouseleave = func3.bind(base);
}
// children だけど、こっちのほうが 
function removeAllChilds(p){
  while( p && p.firstChild ){
    p.removeChild( p.firstChild );
  }
}
function removeAllChildsByID(id){
  let b=document.getElementById(id);
  removeAllChilds(b);
  return b;
}

function generateElement(target,par){
  let ele = document.createElement(par.type);
  if(target){target.append(ele);}
  for (let key in par.style) {
    ele.style[key] = par.style[key];
  }
  for (let key in par) {
    if(key == "classList_add"){
      ele.classList.add(par[key]);
      continue;
    }
    if(["type","style"].indexOf(key) != -1){continue;}
    ele[key] = par[key];
  }
  return ele;
}

function generateSVG(target,par){
  let svg = document.createElementNS('http://www.w3.org/2000/svg',par.type);
  target.appendChild(svg);
  for (let key in par) {
    if(key == "classList_add"){
      svg.classList.add(par[key]);
      continue;
    }
    if(["type"].indexOf(key) != -1){continue;}
    svg.setAttribute(key,par[key]);
  }
  return svg;
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

// https://qiita.com/spm84/items/4ea8c53ac3aafcd4d66c
function toFullWidth(inp) {
  let str = String(inp); // String型にしないと動かないので修正
  // 半角英数字を全角に変換
  str = str.replace(/[A-Za-z0-9]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
  return str;
}

// For SE
function audioInvoke(name,vol=90,pitch=100,pan=0){
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  Game_Interpreter.prototype.command250(par);
}
// MEを再生するなら以下です。BGM停止してくれるので
function audioME(name,vol=90,pitch=100,pan=0){
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  Game_Interpreter.prototype.command249(par);
}
// BGM切り替えは以下です。
function audioSwitchBGM(name,vol=90,pitch=100,pan=0){
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  Game_Interpreter.prototype.command241(par);
}

// CSSの追加
(function(d){
  var head = d.getElementsByTagName('head')[0];
  // CSSの追加
  var link = d.createElement('link');
  link.setAttribute('rel','stylesheet');
  link.setAttribute('type','text/css');
  link.setAttribute('href','css/wasyo.css');
  head.appendChild(link);
/*
  // JSの追加
  var script = d.createElement('script');
  //script.src = "js/plugins"
  script.setAttribute('type','text/javascript');
  script.setAttribute('src','js/plugins/kdata.js');
  head.appendChild(script);
*/
  // 右クリック禁止(これでうまくいくっぽい)
  d.oncontextmenu = function () {return false;}
})(document);



/***************************************************************
* wasyo5 feature.
***************************************************************/
(() => {
  'use strict';
  class wasyo5class{
    constructor(){
      this.name = "wasyo5class";
      this.mode = 0;
      this.menFunc = TouchInput.update; // 確保する。関数定義を持ってきた方が良いかもだが・・・
      this.mdsFunc = function() {}; // 無効化の書き方
      this.init();
      this.dflag = false;
      this.now = "a3";
      // データ
      this.maptext = {
        "a1":"研究開発室",
        "a2":"みなと町",
        "a3":"普通の町",
        "a4":"迷いの森",
        "a5":"不動産"
      };
      this.mapgoto = {"a1":16,"a2":2,"a3":5,"a4":14,"a5":6};
      // reserveTransfer の XYも
      this.maparg = [
        [100,200],
        [250,50],
        [250,300],
        [520,330],
        [400,100]
      ];
    }
    init(){
      this.initCanvas();
    }
    init1(idx,idx2){
      this.idx = idx;
      this.idx2 = idx2;
      // 初期化
      $gameVariables.setValue(this.idx,0);
    }
    initCanvas(){
      let [gcw,gch] = [window.innerWidth,window.innerHeight];
      console.log([gcw,gch]);
      let [pad,mgn] = [10,50];
      let [x,y,w,h] = [mgn,mgn,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      let p = document.createElement("div");
      p.id = "aaa";
      p.style.position = "absolute";
      p.style.display = "none";
      p.style.backgroundColor = "#0F0";
      p.style.color = "#FFF";
      p.style.left = x+'px';
      p.style.top = y+'px';
      p.style.width = w+'px';
      p.style.height = h+'px';
      p.style.zIndex = 10; // ErroDispが9 でマウス取られる 
      p.style.padding = pad+'px';
      document.body.appendChild(p);
  
      let pp = document.createElement("img");
      pp.id = "imgmap";
      pp.src = 'img/0img/map.jpg';//'img/pictures/Actor1_2.png';
      pp.width = w;
      pp.height = h;
      p.appendChild(pp);

      if(1){
        let b = document.createElement("button");
        b.addEventListener('click', this.clickfunc.bind(this));
        b.textContent = "クリックして閉じる";
        b.style.position = "absolute";
        b.style.left = 10+'px';
        b.style.top = 10+'px';
        p.appendChild(b);
      }
    }
    // 行先のID
    idret(inp){
      let mm = this.mapgoto;
      return mm[inp];
    }
    //＝＝＝ マウスイベント ＝＝＝
    mover2(e){
      e.stopPropagation();
      let id = e.target.id;
      let p = document.getElementById(id);
      if(this.now != id){
        p.style.backgroundColor = "#F00";
        this.setT(id,1);
      }
    }
    mleave2(e){
      e.stopPropagation();
      let id = e.target.id;
      let p = document.getElementById(id);
      p.style.backgroundColor = "#0000FF20";//"#00F";
      this.setT(id,0);
    }
    mclick(e){
      e.stopPropagation();
      let id = e.target.id;
      let mapid = this.idret(id);
      // HINT:https://rpgmaker-script-wiki.xyz/move_mv.php
      // HINT:https://github.com/yamachan/jgss-hack/blob/master/memo.ja/201701-scenes2.md
      if(this.now != id){
        $gamePlayer.reserveTransfer(mapid, 9, 7, 2, 1); //
        Game_Player.prototype.performTransfer();
        this.now = id;
      }
      this.clickfuncCore(0);
      // 復帰
      $gameVariables.setValue(this.idx,1);
      console.log("mclick:setValue:"+this.idx);
    }

    // メニューのボタンからしか呼ばれないはず
    clickfunc(e){
      e.stopPropagation();
      this.clickfuncCore(0);
      // 復帰
      $gameVariables.setValue(this.idx,1);
      console.log("clickfunc:setValue:"+this.idx);
    }
    clickfuncCore(inp){
      this.mode = inp;
      TouchInput.update = (this.mode==0) ? this.menFunc : this.mdsFunc;
      console.log("clickfuncCore:"+this.mode);
      this.show(this.mode);
      this.setT(this.now,0);
    }
    // clickfunc したら呼ばれる
    show(inp){
      let p = document.getElementById("aaa");
      p.style.display = (inp==0)? "none":"block";
      //console.log("this.menFunc: "+this.menFunc);
      //console.log(TouchInput.update);
      this.initdatashow();
    }
    // 一回だけ呼ばれる（初期化のタイミングでは $gameParty とか理由で呼べない）
    initdatashow(){
      if(this.dflag){return;}
      this.dflag = true;
      //＝＝＝
      let d = document.getElementById("aaa");

      let arg = this.maparg;
      let i = 1;
      for(let cc of arg){
        let [x,y]=cc;
        let [id,w,h] = ["a"+i++,50,50];
        this.addPanel(d,id,x,y,w,h);
      }
      if(1){
        let p = this.addPanel2(d,"axx",400,0,200,80);
      }
    }
    setT(id,mode){
      let txt = this.maptext;
      let d = document.getElementById("axx");
      if(mode==0){
        d.innerHTML = "<p>いまは「"+txt[this.now]+"」</p>";
      }else{
        if(this.now != id){
          let mn = this.fnmn(this.now, id);
          d.innerHTML = "<p>「"+txt[id]+"」に移動<BR>　料金 "+mn+"</p>";
        }
      }
    }
    fnmn(from,to){
      let f = this.idret(from);
      let t = this.idret(to);
      return 100*t+10*f;
    }
    addPanel(d,id,x,y,w,h){
      let ppp = document.createElement("div");
      d.appendChild(ppp);
      ppp.style.height = "100px";
      ppp.id = id;
      ppp.style.position = "absolute";
      ppp.style.left = x+'px';
      ppp.style.top = y+'px';
      ppp.style.width = w+'px';
      ppp.style.height = h+'px';
      ppp.style.backgroundColor = "#0000FF20";//"#00F";
      ppp.addEventListener("mouseover", this.mover2.bind(this));
      ppp.addEventListener("mouseleave", this.mleave2.bind(this));
      ppp.addEventListener("click", this.mclick.bind(this));
      return ppp;
    }
    addPanel2(d,id,x,y,w,h){
      let ppp = document.createElement("div");
      d.appendChild(ppp);
      ppp.style.height = "100px";
      ppp.id = id;
      ppp.style.position = "absolute";
      ppp.style.left = x+'px';
      ppp.style.top = y+'px';
      ppp.style.width = w+'px';
      ppp.style.height = h+'px';
      ppp.style.backgroundColor = "#000";
      ppp.style.color = "#FFF";
      return ppp;
    }

    // For Image.src
    getImgSrcFromTEXT(txt){
      // ＝＝＝ 参考になった素晴らしいページ ＝＝＝
      // https://www.programmingmat.jp/webhtml_lab/canvas_image.html
      // http://tonbi.jp/Game/RPGMakerMV/009/
      let aa = generateTextBmp(txt);
      return aa.context.canvas.toDataURL();
    }
  }
  const wasyo5 = new wasyo5class();

    var current = document.currentScript.src;
    console.log("current is "+current);
    let matchs = current.match(/([^/]*)\.js/);
    console.log("matchs is "+matchs);
    let modname = matchs.pop();
    console.log("modname is "+modname);
  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */
  /* FUNC1 */
  PluginManager.registerCommand(modname, "enter", args => {
    wasyo5.init1(args.val1,args.val2);
    wasyo5.clickfuncCore(1);
  });

})();
