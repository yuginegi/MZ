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

/**********************************
 * util.js　から抜粋（開始）
 **********************************/
  // BODYのCSSを書き換える。CSSファイル用意でも良い。
  function xxx() {
    document.body.style.margin = "0px"; // HTML重ねる為
    document.body.style.overflow = "hidden"; // スクロールバー抑制

    let d = document;
    // CSSの追加（今は不要）
    // 右クリック禁止(これでうまくいくっぽい)
    d.oncontextmenu = function () {return false;}
    console.log("xxx invoked.")
  }
  window.addEventListener("load", xxx);

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
  // 実装した想定のサイズ
  var gXXX = 816;
  var gYYY = 624;
  function utilResizeFunc(target) {
    let km = document.getElementById(target);
    if (km) {
      // リサイズした現在のウインドウサイズ
      let [sw, sh] = [window.innerWidth, window.innerHeight];
      // parseInt は数字以外を無視してくれる
      let [tw, th] = [parseInt(km.style.width),parseInt(km.style.height)]
      //=== 計算 ===
      let [ax, ay] = [sw / gXXX, sh / gYYY];
      let aa = (ax > ay) ? ay : ax;
      let [cl, ct] = [(sw-tw)/2, (sh-th)/2]; // 真ん中に表示したいため
      //=== 計算結果を反映 ===
      km.style.left = cl + "px";
      km.style.top = ct + "px";
      km.style.transform = "scale(" + aa + "," + aa + ")";
    }
  }
/**********************************
 * util.js　から抜粋（終了）
 **********************************/

  class tcutinClass{
    constructor(){
      this.name = "tcutinClass";
      window.addEventListener('resize', this.resizeFunc.bind(this));
      this.initResource();
    }
    //=== 共通処理 ===
    invoke(inp){
      console.log("[TCUTIN] invoke");
      savegmbusy(); // rollbackmbusy is called at close timing.
      this.delete();
      this.initHTML(inp);
      this.resizeFunc();
    }
    // 
    closefunccode(){
      console.log("[TCUTIN] close");
      this.delete();
      rollbackmbusy();
    }
    delete(){
      const element = document.getElementById(this.divid);
      if (element) {
        element.remove();
      }
    }
    // リサイズトリガー
    resizeFunc(){utilResizeFunc(this.divid);}

/**********************************
 * 共通じゃない処理
 **********************************/
    initResource(){
      // サイズ (816, 624)
      this.size = [gXXX,gYYY]
      let mg = [20,20];
      this.guisize = [gXXX - mg[0], gYYY - mg[1]];
      this.divid = "TCUTIN"
      // BASEのパラメータ
      this.basepar = [];
      this.basepar["test1"] = { /* W & H are FIXED. RESIZED BY SCALE */
        type: "div", id: this.divid,
        style: { /* Left,Top,scale are CHANGED */
          backgroundColor: "#0000FF50", position: "relative", zIndex: 20,
          width: this.guisize[0] + "px", height: this.guisize[1] + "px",
        }
      };
      this.basepar["test2"] = { /* W & H are FIXED. RESIZED BY SCALE */
        type: "div", id: this.divid,
        style: { /* Left,Top,scale are CHANGED */
          backgroundColor: "#00FF00A0", position: "relative", zIndex: 20,
          width: this.guisize[0] + "px", height: this.guisize[1] + "px",
        }
      };
    }
    initHTML(inp){
      // 初期ページ
      let base = generateElement(document.body, this.basepar[inp]);
      // クリックしたら閉じる
      base.addEventListener("click", this.closefunccode.bind(this));
    }
  }

  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\.js/)[1];
  console.log("modname is "+modname);
  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['values'];
  console.log(paraids,typeof(paraids));
  let tcutin = new tcutinClass(paraids);

  /*=== HOOK =======*/
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
  /*=== HOOK =======*/

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  // invoke
  PluginManager.registerCommand(modname, "invoke", args => {
    tcutin.invoke(args.request);
  });

})();
