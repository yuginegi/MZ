//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc メニュープラグイン
 * @author yuginegi
 *
 * @help tcutin.js
 *
 * 一覧のイベントから呼ばれる想定
 * HTML側の操作と連携させる
 * クリックすると戻ってこれる（無限待ち注意）
 * $gameMessage.isBusy で、強制的に待たせる。
 * 
 * @command invoke
 * @text 呼び出し
 * @desc 呼び出し
 * @arg request
 * @type text
 * @desc 出したいシーン
 * 
 */
(() => {
  'use strict';

// RPGツクール上の画面サイズ
var gXXX = 816;
var gYYY = 624;
class tcutinClass{
  constructor(){
    this.name = "tcutinClass";
    this.viewclass = null;
    window.addEventListener('resize', this.resizeFunc.bind(this));
    this.basepar = { /* W & H are FIXED. RESIZED BY SCALE */
      type: "div", id: "tcutmaindiv",
      style: { /* Left,Top,scale are CHANGED */
        backgroundColor: "#00000000", position: "relative", zIndex: 20,
        width: gXXX + "px", height: gYYY + "px",
      }
    };
    this.size = [gXXX,gYYY];
  }
  //=== 共通処理 ===
  invoke(inp){
    console.log("[TCUTIN] invoke");
    savegmbusy(); // rollbackmbusy is called at close timing.
    this.delete();
    this.initHTML(inp);
    this.resizeFunc();
  }
  closefunccode(){
    console.log("[TCUTIN] close");
    this.delete();
    rollbackmbusy();
  }
  delete(){
    // 設置したDIVを消す
    //const element = document.getElementById(this.basediv);
    let element = this.basediv;
    if (element) {
      element.remove();
    }
    // 設定したviewclassを消す
    if(this.viewclass){
      // 表示クラスのdeleteが定義されてたら呼ぶ
      if(this.viewclass.delete){
        this.viewclass.delete();
      }
      // 表示クラスを消す
      delete this.viewclass;
      this.viewclass = null;
    }
  }
  // リサイズトリガー
  resizeFunc(){
    let div = this.basediv
    if (div) {
      let [tw, th] = this.size
      // リサイズした現在のウインドウサイズ
      let [sw, sh] = [window.innerWidth, window.innerHeight];
      //=== 計算 ===
      let [ax, ay] = [sw / tw, sh / th];
      let aa = (ax > ay) ? ay : ax;
      let [cl, ct] = [(sw-tw)/2, (sh-th)/2]; // 真ん中に表示したいため
      //=== 計算結果を反映 ===
      div.style.left = cl + "px";
      div.style.top = ct + "px";
      div.style.transform = "scale(" + aa + "," + aa + ")";
    }
  }
  // this.viewclass で制御する
  initHTML(inp){
    // 初期ページ
    this.basediv = generateElement(document.body, this.basepar);
    // viewclass内で終了時に呼ぶ関数をセットする
    let ed = this.closefunccode.bind(this);
    if(inp == "test2"){
      this.viewclass = new testPage1(this, inp);
      return;
    }
    if(inp == "test1"){
      this.viewclass = new controllerPage(this, inp);
      return;
    }
    if(inp == "test3"){
      this.viewclass = new menuPage(this, inp);
      return;
    }
    // 選ぶものが無ければスカッと抜ける
    this.closefunccode();
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

  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\.js/)[1];
  console.log("modname is "+modname);
  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['values'];
  console.log("[PAR]",paraids,typeof(paraids));
  let tcutin = new tcutinClass(paraids);

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  // invoke
  PluginManager.registerCommand(modname, "invoke", args => {
    tcutin.invoke(args.request);
  });

})();