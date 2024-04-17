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
 * ２１，２２，２３，２４ に必要なものを返す
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
      // Data
      this.textres = {
        0:{
          4:[
            ["お疲れ様、イヌタロさん","すこしはお役に立ているだろうか",""],
          ],
          5:[
            ["イヌタロさん","勇者というのは重責だな",""],
            ["いや、弱気になってはいけない","世界を救う途中なのだから",""],
            ["前に進むと、この剣に誓おう","東方の勇者の名に懸けて",""],
          ],
          6:[
            ["イヌタロさん、いつもあなたはそばで支えてくれて","自分の背中を押してくれる",""],
            ["それが自分の勇気を奮い立たせてくれる","困難があっても前に進ませてくれる",""],
            ["これが自分の勇者としての道なんだ","みんなに支えてもらって前に進む","その力で切り拓く、それが勇者なんだ"],
          ],
        },
        1:{
          2:[
            ["やほ、イヌタロさん","見て見て！強くなってるでしょ！",""],
          ],
          3:[
            ["あ、イヌタロさん","わたし、重い武器を持つしか・・","取り柄がないから・・"],
            ["うん、でも頑張る","ユウさんもイヌタロさんも頑張ってるし",""],
            ["うん、できる事をしていこうって","そう、思ったから・・",""],
          ]
        },
        2:{
          2:[
            ["イヌタロさん、こんにちわ","魔法が必要な時はいつでも教えてくださいね",""],
          ],
          3:[
            ["イヌタロさん、こんにちわ・・","いえ、あの・・その・・","ちょっと、困ったことが"],
            ["ユウさんが、その・・イケメン過ぎて・・","まともにお話できなくて・・",""],
            ["イヌタロさんも素敵ですけど、まあでも、","イヌタロさんは何ともないんですけどね",""],
          ],
          4:[
            ["逃げちゃダメだ・・逃げちゃダメだ・・","あ、お師様に教わったのを試してみよう","２，３，５，７，１１，１３・・",],
          ],
        },
      };
      this.textsp = {
        0:{
          6:[
            ["ユウは勇者の心得を手に入れた","",""],
            ["イヌタロとユウ、お互いに支えあい、補いあい","協力して困難に立ち向かう勇気","そしてみんなに与える希望"],
            ["かたい絆がユウをまた一つ強くする","",""],
          ],
        }
      };
      this.testinitval = [
        {name:"ユウ",exp:12,lv:3},
        {name:"セシリア",exp:23,lv:0},
        {name:"アイリン",exp:11,lv:1}
      ];
    }
    getCheck(id,lv){
      if(this.textres[id] && this.textres[id][lv]){
        return 1;
      }
      return 0;
    }
    getTextSP(cnt){
      let text = this.textsp;
      let [tar,lv] = this.kbandsts;
      if(!text[tar]){
        return ["DEFAULT TEXT"];
      }
      return text[tar][lv][cnt];
    }
    getText(cnt){
      let text = this.textres;
      let [tar,lv] = this.kbandsts;
      if(!text[tar]){
        return ["DEFAULT TEXT"];
      }
      return text[tar][lv][cnt];
    }
    getCount(){
      let text = this.textres;
      let [tar,lv] = this.kbandsts;
      if(!text[tar]){
        return 1;
      }
      return text[tar][lv].length;
    }
    setclass(par){
      //DBG//console.log("setclass invoke.");
      this.kaihatsu = par;
      this.cdb = par.cdb;
      //DBG//let nm = this.kaihatsu.name;
      //DBG//console.log("setclass", nm);
      return this;
    }
    init(){
      console.log("init invoke.");
      // テスト
      let barr = this.testinitval;
      $gameVariables.setValue(20, {ap:100,band:barr});
    }
    getband(){
      let vid = this.kaihatsu.ids[0];//ループ変数
      let id = $gameVariables.value(vid);
      console.log("getband:",id);
      let hh = $gameVariables.value(20);
      let bd = hh.band[id];
      $gameVariables.setValue(21, hh.ap);
      $gameVariables.setValue(22, bd.lv);
      $gameVariables.setValue(23, bd.exp);
      $gameVariables.setValue(24, bd.name);
      let res = (hh.ap>30)?id:-1; // 行動力の条件
      //res = (id%2==0)?res:-1; // メンバーの条件
      $gameVariables.setValue(25, res);
    }
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
      let hh = $gameVariables.value(20);
      hh.ap -= 30;
      console.log("kbandexec",tarid);

      let rtn = 1;
      let bd = hh.band[tarid];
      if(this.lvupcheck(tarid,bd)){
        bd.lv += 1;
        $gameVariables.setValue(20, hh);
        rtn = 2;
        // 演出アリ
        if(this.getCheck(tarid,bd.lv)){
          this.kbandsts = [tarid,bd.lv];
          this.kbandshow(tarid);
          rtn = 0;
        }  
      }
      return rtn;
    }
    lvupcheck(id,bd){
      // とりいつもあげとく
      return 1;
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
    /*candraw(){
      let canvas = document.getElementById("kbandcanvas");
      if(!canvas){
        console.log("CANVAS LOOP break.");
        return;
      }
      this.tm++;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "blue";
      ctx.fillRect(10+this.tm, 10, 100, 100);
      setTimeout(this.candraw.bind(this), 1000/60.0);
    }*/
    cfunc(){
      if(this.cfuncflag == 1){return;}
      this.kaiwacnt++;
      let cnt = this.getCount();
      if(this.kaiwacnt >= cnt){
        // 特別
        let [tar,lv] = this.kbandsts;
        if(tar==0 && lv==6){
          if(this.kaiwacnt-cnt < 3){
            if(this.kaiwacnt == cnt){
              //{"code":241,"indent":1,"parameters":[{"name":"Scene4","volume":90,"pitch":100,"pan":0}]}
              let params = [{"name":"Scene4","volume":90,"pitch":100,"pan":0}];
              Game_Interpreter.prototype.command241(params);
            }
            audioInvoke("Cursor3");
            this.setTextSP(this.kaiwacnt-cnt);
          }else{
            this.cfuncflag = 1;
            //{"code":249,"indent":3,"parameters":[{"name":"Victory2","volume":90,"pitch":100,"pan":0}]}
            //audioMEInvoke("Fanfare2");
            let par = [{"name":"Fanfare2","volume":90,"pitch":100,"pan":0}]
            Game_Interpreter.prototype.command249(par);
            let e = document.getElementById("kbandarea");
            let gwnd = document.getElementById("gameCanvas");
            //gwnd = window;
            let [gcw,gch] = [gwnd.width,gwnd.height];
            let can = generateElement(e, {type:"canvas", id:"kbandcanvas", height:gch,width:gcw,
            //style:{height:gch,width:gcw}
            });
            this.candraw = new candraw(can);
            setTimeout(() => {
              // 抜ける
              console.log("END FLOW");
              let vid = this.kaihatsu.ids[0];//ループ変数
              $gameVariables.setValue(vid, 2);
              let e = document.getElementById("kbandarea");
              if(e){e.remove();}
              delete this.candraw;
            },10000);
          }
          return;
        }
        // 抜ける
        console.log("END FLOW");
        let vid = this.kaihatsu.ids[0];//ループ変数
        $gameVariables.setValue(vid, 2);
        document.getElementById("kbandarea").remove();
        return;
      }
      audioInvoke("Cursor3");
      this.setText();
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
      for(let i=0;i<3;i++){
        let timg = this.kaihatsu.geneStrImg("kbandtxt"+(i+1),""); //78x36
        dvt.appendChild(timg);
        generateElement(dvt, {type:"br"});
      }
      this.kaiwacnt = 0;
      // コントロールの位置
      this.cfuncflag = 0;
      div.onclick = this.cfunc.bind(this);
      this.setText();
    }
    setText(){
      let cnt = this.kaiwacnt;
      let ttt = this.getText(cnt);
      for(let i=0;i<ttt.length;i++){
        this.kaihatsu.updateStrImg("kbandtxt"+(i+1),ttt[i]);
      }
    }
    setTextSP(cnt){
      let ttt = this.getTextSP(cnt);
      for(let i=0;i<ttt.length;i++){
        let t = (ttt[i].length > 0)? "\\C[1]"+ttt[i] : "";
        this.kaihatsu.updateStrImg("kbandtxt"+(i+1),t);
      }
    }
    turnend(){
      console.log("kband turnend.");
      let hh = $gameVariables.value(20);
      hh.ap = 100; // 特殊効果なし
      $gameVariables.setValue(20, hh);
    }
  }

  var current = document.currentScript.src;
  let matchs = current.match(/([^/]*)\.js/);
  let modname = matchs.pop();

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
