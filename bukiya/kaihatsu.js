//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンド
 * @author wasyo
 *
 * @help kaihatsu.js
 *
 * 商人の最終章コマンド。開発など
 * 
 * @param arrayIDs
 * @desc 使ってよい変数の配列(ループ用＋変数６個)
 * 数字とカンマ区切りだけを半角で。
 * （例）2,15,16,17,18,19,20
 *
* @command init
 * @text ニューゲームのとき、どこかで絶対１回呼ぶ
 * @desc 
 * 初期化関数。
 * これ呼ばないとターン処理とバンド処理で死ぬ。
 * NewGameしてから絶対一回は呼ぶこと。
 * ロードされたタイミングで１回呼ばれる。
 * 
 * @command enter
 * @text 玉座コマンド
 * @desc 
 * ループ変数を０にして実行します
 * そとでループして待機してください。
 * ループ変数を１にして返します
 * 
 * @command turnend
 * @text ターンエンド（turnend）
 * @desc 
 * 戦闘処理をします
 * ループ変数にターン数を返します
 * 
 * @command turnrepo
 * @text ターンエンド結果（turnrepo）
 * @desc 
 * 戦闘処理の結果表示
 * ループ変数を０にして実行します
 * そとでループして待機してください。
 * ループ変数にターン数を返します
 * 
 * @command turncheck
 * @text 攻撃設定しているかどうか
 * @desc 
 * ループ変数に有無を返します
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

(() => {
  'use strict';

  class kaihatsuclass{
    constructor(ids){
      this.name = "kaihatsuclass";
      //＝＝＝ 入力文字列を数字の配列にする
      let aa = ids.split(',');
      this.ids = aa.map(Number);
      //console.log(this.name+"::isArray="+Array.isArray(this.ids)+":"+this.ids);
      //＝＝＝ 数字の配列かどうかチェック
      if(this.ids.length < 7){
          alert("kaihatsu.js::Given parameter is wrong. \""+ids+"\"\nPlease check plugin parameter. ");
          // 起動時、ワザとエラーにする
          kaihatsuclass_initERROR1 = "ERROR";
      }
      for(let cc of this.ids){
        if(typeof cc != "number"){
          alert("kaihatsu.js::Given parameter is wrong. \""+ids+"\"\nPlease check plugin parameter. ");
          // 起動時、ワザとエラーにする
          kaihatsuclass_initERROR2 = "ERROR";
        }
      }
      console.log(this.name+", Init Success. "+this.ids);

      // 初期化
      this.init();
    }
    init(){
      // DB準備（Initよりも前に）
      this.dbm = new DataBaseManager(this);
      this.dbm.init(this,1);
      // Init処理
      this.mode = 0;
      this.menFunc = TouchInput.update; // 確保する。関数定義を持ってきた方が良いかもだが・・・
      this.mdsFunc = function() {}; // 無効化の書き方
      this.dflag = false;
      this.kmenu = new kmenu(this);
      this.kmidwnd = new kmidwnd(this);
      this.kmsgwnd = new kmsgwnd(this);
      // 表示領域の初期化
      this.initflag=0;
      // For imagchange
      this.imgchange = this.chardata.imgchange.bind(this.chardata);
    }
    initCanvas(){
      //let [gcw,gch] = [window.innerWidth,window.innerHeight];
      let gwnd = document.getElementById("gameCanvas");
      //gwnd = window;
      let [gcw,gch] = [gwnd.width,gwnd.height];
      console.log([gcw,gch]);
      let [pad,mgn] = [10,30];
      let [x,y,w,h] = [mgn-pad,mgn-pad,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      // use generateElement, 13 lines => 5 lines.
      let par = {type:"div",id:"kaihatsumap",style:{
        position:"relative",display:"none",backgroundColor:"#000",color:"#FFF",
        left:x+'px',top:y+'px',width:w+'px',height:h+'px',zIndex:10,padding:pad+'px',
      }};
      generateElement(document.body, par);
    }

    kaihatsuEndFunc(e){
      //DBG//console.log(e);
      e.stopPropagation();
      this.clickfuncCore(0); // 開発END
      // DBG : 行動力の回復
      //DBG//this.kjyodata.ResetActivePower();
      // 出ていくときの初期化
      this.kjyodata.ReflectActivePower();
    }
    clickfuncCore(inp){
      this.mode = inp;
      TouchInput.update = (this.mode==0) ? this.menFunc : this.mdsFunc;
      console.log("clickfuncCore",this.mode);
      this.kaihatsushow(this.mode);
      $gameVariables.setValue(this.ids[0], 1-inp);
    }
    // clickfunc したら呼ばれる
    kaihatsushow(inp){
      if(this.initflag==0){
        this.initCanvas();
        this.initflag=1;//一回しか呼ばれないようにするため
      }
      let p = document.getElementById("kaihatsumap");
      p.style.display = (inp==0)? "none":"block";
      // ＜テスト0421＞出るときは以降呼ばなくてもいいんじゃないかな（’へ’）
      if(inp==0){
        return;
      }
      // リサイズ呼んでおく
      resizeKaihatsu();
      // 入るときの初期化、(inp==1)の時だけ！！
      if(inp==1){
        this.kmapdata.Initialize();//19
        this.kjyodata.Initialize();//18（絶対必要、２０からコピーする）
        this.chardata.Initialize();//17
      }
      // 表示の初期化
      this.initdatashow();
      // 入るときの初期化（各ページの状態の初期化）
      this.kmidwnd.initpage();
    }
    // 一回だけ呼ばれる（初期化のタイミングでは $gameParty とか理由で呼べない）
    initdatashow(){
      if(this.dflag){return;}
      this.dflag = true;
      let d = document.getElementById("kaihatsumap");
      // テーブルメニュー
      this.kmenu.init(d);
      //文字表示領域
      this.kmidwnd.init(d);
      // 下パーティション
      this.kmsgwnd.init(d);
    }

    // 文字説明を変更
    switchexp(tid){
      let msg = {
        "mid1":["内政開発をします","生産力をあげて、街を大きくします"],
        "mid2":["人材編成をします","各メンバーの能力アップをします"],
        "mid3":["遠征討伐をします","モンスターに制圧された地域を開放します"],
        "mid4":["交易商売をします","交易や為替などで利益を出します"],
        "mid5":["なにをしますか？"]
      };
      this.kmsgwnd.setText(msg[tid]);
    }
    // 変更
    switch(tar,type){
      this.kmidwnd.switch(tar,type);
    }

    // テーブルを作る
    gentable(pdiv,prefix,nr,nc){
      let list = [];
      // テーブル
      const tbl = generateElement(pdiv,{type:"table",style:{width:"100%"}});
      const tblBody = generateElement(tbl,{type:"tbody"});
      for(let i1=0;i1<nr;i1++){
        const row = generateElement(tblBody,{type:"tr"});
        for(let i2=0;i2<nc;i2++){
          const cell = generateElement(row,{type:"td",id:prefix+"_"+i1+"_"+i2,
            style:{width:(100/nc)+"%",textAlign:'center'}});
          list.push(cell);
        }
      }
      return list;
    }

    // 画像を渡して、IMG要素でもらえる
    geneTagImg(sid,src){
      let p = document.createElement("img");
      p.id = sid;
      p.src = src;
      return p;
    }
    // テキスト画像をappendする
    apStrImg(base,sid,inptxt){
      let t = this.geneTagImg(sid,this.getImgSrcFromTEXT(inptxt));
      base.append(t);
      return t;
    }
    // テキストを画像にする関数、IMG要素でもらえる
    geneStrImg(sid,inptxt){
      return this.geneTagImg(sid,this.getImgSrcFromTEXT(inptxt));
    }
    updateStrImg(sid,inptxt){
      let e = document.getElementById(sid);
      if(e){
        e.src = this.getImgSrcFromTEXT(inptxt);
      }
    }
    // For Image.src
    getImgSrcFromTEXT(txt){
      // ＝＝＝ 参考になった素晴らしいページ ＝＝＝
      // https://www.programmingmat.jp/webhtml_lab/canvas_image.html
      // http://tonbi.jp/Game/RPGMakerMV/009/
      let aa = generateTextBmp(txt);
      return aa.context.canvas.toDataURL();
    }
    turncheck(){
      let v = 1;
      let [ah,area] = this.cdb.getAttackAll();// 有効なものを調べるため。。
      console.log("turncheck:", area);
      for(let k in area){
        if(area[k]){v = 0;break;}
      }
      $gameVariables.setValue(this.ids[0], v);
    }
    turnend(){
      this.kturn.turnend();
      this.kband.turnend();
    }
    turnrepo(){
      this.kturn.turnrepo();
    }
    initfunction(){
      console.log("=== kaihatsu initfunction ===");
      // セット
      if(setClass2kband){
        this.kband = setClass2kband(this);
        setClass2kband = null; // 使い終わったので無効化
        this.kband.init();//20
      }
      // セット
      if(setClass2kturn){
        this.kturn = setClass2kturn(this);
        setClass2kturn = null; // 使い終わったので無効化
        this.kturn.init();
      }
      // セット (初期値を詰める) OR (変数を読み込む)
      this.kmapdata.Initialize();//19
      this.kjyodata.Initialize();//18
      this.chardata.Initialize();//17
    }
  }

  var current = document.currentScript.src;
  let matchs = current.match(/([^/]*)\.js/);
  let modname = matchs.pop();

  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['arrayIDs'];
  const kaihatsu = new kaihatsuclass(paraids);

  // リサイズ関係
  function resizeKaihatsu(){
    let ga = [0,0,window.innerWidth,window.innerHeight];
    let km = document.getElementById("kaihatsumap");
    if(km){
      let [w,h] = [816-30,624-30];//[736,544]; //padding:10,border:5;
      let l =(ga[2]-w)/2;
      let t =(ga[3]-h)/2;
      //DBG//console.log("Resize! "+[l,t]);
      km.style.left = l+"px";
      km.style.top  = t+"px";
      //=== StyleSheet:transform ===
      let gc = document.getElementById("gameCanvas");
      let [ww,hh] = [gc.width,gc.height]; // 816x624
      let [sw,sh] = [parseInt(gc.style.width,10),parseInt(gc.style.height,10)];
      //console.log("gameCanvas:"+[ww,hh,sw,sh]);
      // transform need ?
      if(sw!=ww && sh!=hh){
        let [ax,ay] = [(sw/ww),(sh/hh)];//[(ga[2]/w),(ga[3]/h)];
        let aa = (ax < ay)? ax : ay;
        km.style.transform = "scale("+aa+", "+aa+")";
      }else{
        km.style.transform = "";//ちゃんと消す！
      }
    }
  }
  window.addEventListener('resize', resizeKaihatsu);
  // F4 対策
  // https://shanabrian.com/web/javascript/keycode.php
  window.onkeydown = function(event) {
    var keyCode = false;  
    if (event) {
      if (event.keyCode) {
        keyCode = event.keyCode;
      } else if (event.which) {
        keyCode = event.which;
      }
    }
    //alert(keyCode);
    // 111:F1=112,F12=123
    //DBG//console.log("keycode="+keyCode);
    if(111<keyCode && keyCode<=123){
      //DBG//console.log("keycode work")
      for(let i=0;i<1000;i+=50){
        setTimeout(resizeKaihatsu,i);
      }
    }
  };

  // DataManager.loadGame を実行する前に関数を呼ぶ。
  const loadfunc = DataManager.loadGame.bind(DataManager)
  DataManager.loadGame = function(savefileId) {
    kaihatsu.initfunction(1); // ここを追加
    return loadfunc(savefileId);
  };

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */
  /* FUNC0 */
  PluginManager.registerCommand(modname, "init", args => {
    kaihatsu.initfunction(1); // INIT
  });
  /* FUNC1 */
  PluginManager.registerCommand(modname, "enter", args => {
    kaihatsu.clickfuncCore(1); // 開発START
  });

  /* FUNC2 */
  PluginManager.registerCommand(modname, "turnend", args => {
    kaihatsu.turnend(); // TURNEND
  });
  /* FUNC3 */
  PluginManager.registerCommand(modname, "turnrepo", args => {
    kaihatsu.turnrepo(); // TURNEND
  });
  /* FUNC4 */
  PluginManager.registerCommand(modname, "turncheck", args => {
    kaihatsu.turncheck(); // TURNEND
  });
})();
