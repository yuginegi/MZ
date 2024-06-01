//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc バンドコマンド
 * @author wasyo
 *
 * @help kband.js
 *
 * 商人のバンド系処理
 * 
 * @desc 
 * kaihatsu.js 前提で作成
 * ２１－４０を箱に使う前提
 * 開発コマンド前提、開発の前に呼ぶ必要あり
 * 
 * @command init
 * @text init
 * @desc 
 * なんらかの初期化。テスト用にも
 * 
 * @command getband
 * @text バンド前ツクール表示用
 * @desc 
 * ループ変数に入れてください
 * ２１，２２，２３，２４，２５ に必要なものを返す
 * 
 * @command kbandcmd
 * @text バンドコマンド
 * @desc 
 * バンドコマンド
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

function setClass2kband(par){
  /* NOP */
}

(() => {
  'use strict';

  class candraw{
    constructor(canvas){
      this.ctx = canvas.getContext("2d");
      console.log("canvas:",canvas.width,canvas.height);
      this.ww = canvas.width;
      this.hh = canvas.height;
      this.list = [];
      setInterval(this.draw.bind(this),1000/60);
    }
    gene(){
      let x = Math.random() * this.ww;
      let y = Math.random() * this.hh;
      let sp = Math.random() * (5);
      let life = Math.random() * (3*60);
      this.list.push([x,y,sp,life]);
    }
    draw(){
      this.gene();
      let ctx = this.ctx;
      ctx.clearRect(0,0,this.ww,this.hh);
      ctx.fillStyle = '#ffff0040';
      let n = this.list.length;
      for(let i=0;i<n;i++){
        let [x,y,s,l] = this.list[i];
        if(l <= 0){continue;}
        ctx.beginPath(); // パスの初期化
        let r = 10 + 20*l/(3*60);
        ctx.arc(x, y, r, 0, 2 * Math.PI); // (100, 50)の位置に半径30pxの円
        ctx.closePath(); // パスを閉じる
        ctx.fill(); // 軌跡の範囲を塗りつぶす
        this.list[i][1] -= s;
        this.list[i][3] -= 1;
      }
    }
  }

  class kbandclass{
    constructor(){
      this.name = "kbandclass";
      this.kaihatsu = null;
      // For Special Initialize
      setClass2kband = this.setclass.bind(this);
      // DATA
      this.dhash = kbanddata;
    }
    load20(){
      return $gameVariables.value(20);
    }
    save20(hh){
      $gameVariables.setValue(20, hh);
    }
    init20(){
      // テスト（初期値詰め）
      let testinitval = [
        {name:"ユウ",exp:12,lv:3},
        {name:"セシリア",exp:23,lv:0},
        {name:"アイリン",exp:11,lv:1},
      ];
      let s = testinitval.length;
      let e = 20;
      for(let i=s;i<e;i++){
        //let nm = this.cdb.getName(i);
        //let hh = {name:this.cdb.getName(i),exp:0,lv:0};
        testinitval.push({name:this.cdb.getName(i),exp:0,lv:0});
      }
      //$gameVariables.setValue(20, {ap:100,band:this.testinitval});
      this.save20({ap:100,band:testinitval});
    }

    //=== バンドコマンド実施前判定 ====
    getband(){
      let vid = this.kaihatsu.ids[0];//ループ変数
      let id = $gameVariables.value(vid);
      console.log("getband:",id);
      //let hh = $gameVariables.value(20);
      let hh = this.load20();
      let bd = hh.band[id];
      $gameVariables.setValue(21, hh.ap);
      $gameVariables.setValue(22, bd.lv);
      $gameVariables.setValue(23, bd.exp);
      $gameVariables.setValue(24, bd.name);
      let res = (hh.ap>=30)?id:-1; // 行動力の条件
      //res = (id%2==0)?res:-1; // メンバーの条件
      $gameVariables.setValue(25, res);
    }
    //=== バンドコマンド ====
    kbandcmd(){
      // ループ変数 初期化
      let vid = this.kaihatsu.ids[0];//ループ変数
      $gameVariables.setValue(vid, 0);
      // バンドコマンド
      let tarid = $gameVariables.value(25);
      let rtn = this.kbandexec(tarid);
      //ループ変数 返却
      $gameVariables.setValue(vid, rtn);
    }
    // バンドコマンド実態
    kbandexec(tarid){
      if(tarid<0){return 1;}
      //let hh = $gameVariables.value(20);
      let hh = this.load20();
      hh.ap -= 30;
      console.log("kbandexec",tarid);

      let rtn = 1;
      let bd = hh.band[tarid];
      if(this.lvupcheck(tarid,bd)){
        bd.lv += 1;
        //$gameVariables.setValue(20, hh);
        rtn = 2;
        // 演出アリ
        if(this.getCheck(tarid,bd.lv)){
          this.kbandsts = [tarid,bd.lv];
          this.kbandshow(tarid);
          rtn = 0;
        }  
      }
      this.save20(hh);
      return rtn;
    }
    lvupcheck(id,bd){
      // とりいつもあげとく
      return 1;
    }
    getCheck(id,lv){
      let key = "c_"+id+"_"+lv;
      let dt = this.dhash[key];
      return (dt)?1:0;
    }
    drawdiv(base,txt,x,y,w,h){
      let btndiv = generateElement(base, {type:"div",style:
      {position:"absolute",left:x+"px",top:y+"px",width:w+"px",height:h+"px"}
      });
      if(txt){
        let timg = this.kaihatsu.geneStrImg(null,txt); //78x36
        btndiv.appendChild(timg);
      }
      return btndiv;
    }

    kbandshow(tarid){
      //let [gcw,gch] = [window.innerWidth,window.innerHeight];
      let gwnd = document.getElementById("gameCanvas");
      //gwnd = window;
      let [gcw,gch] = [gwnd.width,gwnd.height];
      console.log([gcw,gch]);
      let [pad,mgn] = [10,30];
      let [x,y,w,h] = [mgn-pad,mgn-pad,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      // use generateElement, 13 lines => 5 lines.
      let par = {type:"div",id:"kbandarea",style:{
        position:"relative",display:"display",
        left:x+'px',top:y+'px',width:w+'px',height:h+'px',zIndex:10,padding:pad+'px',
      }};
      let div = generateElement(document.body, par);
      // 画像の位置
      {
        let dvp = this.drawdiv(div,0,424,60,300,300)
        let src = 'img/pictures/'+this.cdb.getPict(tarid)+'.png';
        let p = this.kaihatsu.geneTagImg("kaihatsuchara",src);
        p.classList.add("fadeIn");
        p.classList.add("CharaShadow");
        dvp.appendChild(p);
      }
      // 画像の位置
      {
        let dvp = this.drawdiv(div,0,40,60,300,300)
        let src = 'img/pictures/Actor2_1.png';
        let p = this.kaihatsu.geneTagImg("kaihatsuchara0",src);
        //p.classList.add("fadeIn");
        p.classList.add("CharaShadow");
        p.style.transform="scale(-1, 1)";
        dvp.appendChild(p);
      }
      // 文字の表示エリア
      let dvt = this.drawdiv(div,0,40,400,676,120);//716x160
      dvt.id = "kbandtextarea";
      dvt.style["border-color"]="blue";
      dvt.style["border-style"]="groove";
      dvt.style["border-width"]="10px";
      dvt.style.backgroundColor="#000000A0";
      dvt.style.padding="10px";
      // テキスト表示エリア
      for(let i=0;i<3;i++){
        let timg = this.kaihatsu.geneStrImg("kbandtxt"+(i+1),""); //78x36
        dvt.appendChild(timg);
        generateElement(dvt, {type:"br"});
      }
      this.kaiwacnt = 0;
      this.kaiwacur3 = false;
      // コントロールの位置
      this.cfuncflag = 0;
      div.onclick = this.cfunc.bind(this);
      // 最初の実行
      this.candraw = null;
      this.cexec();
    }
    cfunc(){
      if(this.cfuncflag == 1){return;}
      this.cexec();
    }
    cexec(){
      let [tar,lv] = this.kbandsts;
      let key = "c_"+tar+"_"+lv;
      let dt = this.dhash[key];
      let n = dt.length;
      while(this.kaiwacnt < n){
        let ttt = dt[this.kaiwacnt];
        console.log(this.kaiwacnt,ttt)
        this.kaiwacnt++;
        if(ttt[0]=="text" || ttt[0]=="txsp"){
          for(let i=0;i<ttt.length;i++){
            let tx = (ttt[0]=="txsp" && ttt[i+1] && ttt[i+1].length > 0)?"\\C[1]"+ttt[i+1]:ttt[i+1];
            this.kaihatsu.updateStrImg("kbandtxt"+(i+1), tx);
          }
          if(this.kaiwacur3){ // 初回は鳴らさない（特別）
            audioInvoke("Cursor3");
          }else{
            this.kaiwacur3 = true;
          }
          return;
        }
        if(ttt[0]=="bgm"){
          audioSwitchBGM(ttt[1]);
          continue;
        }
        if(ttt[0]=="pup"){
          this.cfuncflag = 1;
          audioME("Fanfare2");
          // CANVAS追加
          let e = document.getElementById("kbandarea");
          let gwnd = document.getElementById("gameCanvas");
          let [gcw,gch] = [gwnd.width,gwnd.height];
          let can = generateElement(e, {type:"canvas", id:"kbandcanvas", height:gch,width:gcw});
          this.candraw = new candraw(can);
          setTimeout(this.cendf.bind(this),10*1000);
          return;
        }
      }
      // ここに来たら抜ける。breakせず、return か continue する。
      this.cendf();
    }
    cendf(){
      // 抜ける
      console.log("END FLOW");
      let vid = this.kaihatsu.ids[0];//ループ変数
      $gameVariables.setValue(vid, 2);
      document.getElementById("kbandarea").remove();
      delete this.candraw
    }

/***************************************************************/
    // 開発とやり取りするための特別処理
    setclass(par){
      console.log("setClass2kband.");
      this.kaihatsu = par;
      this.cdb = par.cdb;
      return this;
    }
    // 初期化
    init(){
      console.log("kband init invoke.");
      this.init20();
    }
    // ターンエンド時の処理
    turnend(){
      console.log("kband turnend.");
      //let hh = $gameVariables.value(20);
      let hh = this.load20();
      hh.ap = 100; // 特殊効果なし時 １００。
      //$gameVariables.setValue(20, hh);
      this.save20(hh);
      let atxt = "行動力が回復した。("+hh.ap+")";
      $gameVariables.setValue(25, atxt); // 行動力テキスト
    }
  }

  var current = document.currentScript.src;
  let matchs = current.match(/([^/]*)\.js/);
  let modname = matchs.pop();

  console.log("kband.js loaded.");
  const kband = new kbandclass();

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */
  /* FUNC0 */
  PluginManager.registerCommand(modname, "init", args => {
    kband.init(); // INIT
  });
  PluginManager.registerCommand(modname, "getband", args => {
    kband.getband(); // getband
  });
  PluginManager.registerCommand(modname, "kbandcmd", args => {
    kband.kbandcmd(); // show
  });
})();
