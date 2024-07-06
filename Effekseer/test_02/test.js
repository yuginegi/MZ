//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc プラグイン頑張ります
 * @author wasyo
 *
 * @help test.js
 *
 * HTML側の操作と連携させる
 * クリックすると戻ってこれる
 *
 * @command wasyo1
 * @text ループ初期化
 * @desc 使って良い変数の番号をください、０以外にして返します
 * @arg val
 * @type number
 * @text 変数の番号（数字）
 * @desc 使って良い変数の数字
 *
 */

(() => {
  'use strict';
  // HTML append
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
  // For SE
  function audioInvoke(name,vol=90,pitch=100,pan=0){
    let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
    Game_Interpreter.prototype.command250(par);
  }
  // Chara Class
  class drawChara{
    constructor(src1,src2,size,pos){
      this.size = size; // Canvasのサイズ
      let [x,y] = pos;
      this.pos  =  [x,y];
      this.base  = [x,y];
      let img = new Image();
      img.src = src1;
      this.img = img;
      let wep = new Image();
      wep.src = src2;
      this.wep = wep;
      this.ipos = 0;
      this.ptn = [0,1,2,0,1,2,3,4,5,3,4,5,0,1,2,0,1,2,0,1,2];
    }
    calc(tt,nframe){
      let bb = 0;
      if(tt < 3){
        bb = -5;
      }else if(nframe-6 <= tt && tt < nframe-3){
        bb = +5;
      }
      this.pos[0] = this.pos[0] + bb;
      return [this.ptn[tt],0];
    }
    draw(ctx){
      let nframe = this.ptn.length;
      let tt = (Math.floor(this.ipos/6))%(nframe);
      let ptn = (Math.floor(this.ipos/(6*nframe)))%(2);
      // Object
      //ctx.fillStyle="#00F";
      //ctx.fillRect(100,100,50,50);
      // Common Part
      let [ix,iy] = this.calc(tt,nframe);
      // キャラの絵
      this.drawChara(ctx,ix,iy);
      // 武器の絵 (3,0)(4,0)(5,0)
      this.drawCommon(ctx,ix-3,iy,ptn);
      this.ipos++;
    }
    drawChara(ctx,ix,iy){
      let img = this.img; // 9x6 = 576x384 : 64x64
      let wh = 64;
      let [px,py] = this.pos;
      ctx.drawImage(img, wh*ix,wh*iy,wh,wh, px,py,wh,wh);
    }
    drawCommon(ctx,ix,iy,ptn){
      if(ix <= 0){return;}
      if(ix > 3){return;}
      if(iy != 0){return;}
      // 剣、槍
      let hh = {
        0:[0,1,40,10,160,-35,90,35],
        1:[3,5,40,0,160,-35,125,0]
      }
      let arg = hh[ptn];//(ptn==0)?[0,1,40,10,160,-35,90,35]:[3,5,40,0,160,-35,125,0];
      let wh = 64;
      let [px,py] = this.pos;
      let whx = 576/6;
      // 武器表示
      ctx.drawImage(this.wep, whx*(ix+arg[0]),wh*arg[1],whx,wh, px-arg[2],py-arg[3],whx,wh);
    }
  }
  // Canvas
  class gCan{
    constructor(base,w,h){
      let cpar = {type:"canvas",id:"can", width : w, height : h};
      this.can = generateElement(base, cpar);
      this.ctx = this.can.getContext("2d");
      this.size = [w,h];
      this.cha = [];
      this.initDraw(this.ctx)
    }
    initDraw(ctx){
      let [w,h] = this.size;
      ctx.fillStyle="#000";
      ctx.fillRect(0,0,w,h);
      let src1 = "img/sv_actors/Actor1_5.png";
      let srcA = "img/sv_actors/Actor1_2.png";
      let srcB = "img/sv_actors/Actor2_2.png";
      let src2 = "img/system/Weapons1.png";
      let n = 1;
      for(let i=0;i<n;i++){
        let pos = [w-200+10*i,190+40*i];
        this.cha[i] = new drawChara(src1,src2,this.size,pos);
        this.cha[i].ipos = 7*i;
      }
      this.timeintval = setInterval(this.draw.bind(this),(1.0/60)*1000);
    }
    draw(){
      let [cw,ch] = this.size;
      let ctx = this.ctx;
      ctx.clearRect(0,0,cw,ch);
      // キャラ一覧
      for(let cc of this.cha){
        cc.draw(ctx);
      }
    }
    stop(){
      clearInterval(this.timeintval);
      for(let i=0;i<this.cha.length;i++){
        delete this.cha[i];
      }
      delete this.cha;
    }
  }

  class wasyoclass{
    constructor(){
      this.name = "wasyoclass";
    }
    init(idx){
      console.log([this.name,"init"]);
      // 初期化
      this.idx = idx;
      $gameVariables.setValue(this.idx,0);
      this.count = 0;

      this.initCanvas();

      // DOM追加 JavaScriptの基本 
      let par = {type:"button",id:"clkarea",textContent:"クリックして",
        style:{position : "absolute", right:"0px", top:"0px",zIndex : 3}
      };
      let btn = generateElement(document.body, par);
      btn.addEventListener('click', this.clickfunc.bind(this));
    }
    clickfunc(){
      console.log("clickfunc");      
      this.end();
    }
    initCanvas(args){
      let [gcw,gch] = [window.innerWidth,window.innerHeight];
      console.log([gcw,gch]);
      let [pad,mgn] = [10,10];
      let [x,y,w,h] = [mgn,mgn,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      let par = {type:"div",id:"aaa",style:{
        position : "absolute",
        backgroundColor : "#000",color : "#FFF",
        left : x+'px',top : y+'px',width : w+'px',height : h+'px',
        zIndex : 2, padding : 0+'px'
      }};
      let d = generateElement(document.body, par);
      // Canvas
      this.gc = new gCan(d,w,h);
    }

    end(){
      // 上に通知
      $gameVariables.setValue(this.idx,1);
      console.log([this.name,"end"]);
      // お片付け
      this.gc.stop();
      delete this.gc;
      let p = document.getElementById("aaa");
      p.remove();
      p = document.getElementById("clkarea");
      p.remove();
    }

  }
  let wasyo = new wasyoclass();

  /*
    How to get modname ?
    https://qiita.com/kijtra/items/472cb34a8f0eb6dde459
    https://tektektech.com/javascript-get-fileinfo-from-path/#i
  */
  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\./)[1];
  console.log("modname is "+modname);

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  /* FUNC1 */
  PluginManager.registerCommand(modname, "wasyo1", args => {
    wasyo.init(args.val);
  });

})();
