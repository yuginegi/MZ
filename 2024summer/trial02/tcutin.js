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

  class tcHTMLRes{
    constructor(pp){
      this.size = pp.size;
      this.closefunc = pp.closefunccode.bind(pp);
      this.setButton = pp.setButton;
    }
    initHTML(base,inp){
      switch(inp){
        case "hakone1":
          return this.initHTML1(base);
        case "hakone2":
          return this.initHTML2(base);
        default:
          console.log("Not implement.",inp);
          this.closefunc();
      }
      return null;
    }
    initHTML1(base) {
      // コンテンツ
      let par2 = {
        type: "div", id: "TMEMU0",textContent:"会話中",
        style: {
          color:"#FFFFFF",
          "font-size": "40pt",
          backgroundColor: "#000000",
          width: 330 + "px", 
          height: 350 + "px"
        }
      };
      this.menu0 = generateElement(base,par2);
      // ボタン
      this.setButton(base,"close",[5,5],this.closefunc);
      return base;
    }
    initHTML2(base) {
      base.style.backgroundColor = "#FF00FF50";
      // コンテンツ
      let par2 = {
        type: "div", id: "TMEMU0",textContent:"テスト２",
        style: {
          color:"#FFFFFF",
          "font-size": "40pt",
          backgroundColor: "#000000",
          width: 330 + "px", 
          height: 350 + "px"
        }
      };
      this.menu0 = generateElement(base,par2);
      // ボタン
      this.setButton(base,"close",[5,5],this.closefunc);
    }
  }
  class tcutinClass{
    constructor(){
      this.name = "tcutinClass";
      window.addEventListener('resize', this.resizeFunc.bind(this));
      // サイズ (816, 624)
      this.size = [816,624]
      // HTML Resource
      this.htmlres = new tcHTMLRes(this);
      // close
      //this.closefunc = this.closefunccode.bind(this);
    }
    invoke(inp){
      savegmbusy();
      this.show(inp);
    }
    tgcontrol(mode){
      const teg = document.getElementById('TEGAKARI');
      if(teg){
        teg.style.display = (mode==1)?"block":"none";
      }
    }
    show(inp){
      this.tgcontrol(0);
      const element = document.getElementById('TCUTIN');
      if (element) {
        console.log("[Maybe BUG] SET BLOCK")
        element.style.display = "block";
      } else {
        this.initHTML(inp);
      }
    }
    hide(){
      /*const teg = document.getElementById('TEGAKARI');
      if(teg){
        teg.style.display = "block";
      }*/
      this.tgcontrol(1);
      const element = document.getElementById('TCUTIN');
      if (element) {
        element.remove();
      }
    }
    initHTML(inp){
      let [w, h] = [816 - 20, 624 - 20];
      let par = {
        type: "div", id: "TCUTIN",
        style: { /* Left,Top,scale are CHANGED */
          backgroundColor: "#00FF0050", position: "relative", zIndex: 20,
          width: w + "px", height: h + "px" /* W & H are FIXED */
        }
      };
      let base = generateElement(document.body, par);
      this.resizeFunc();
      this.htmlres.initHTML(base,inp);
    }

    closefunccode(){
      console.log("[TCUTIN] endMenu");
      // TEST
      this.hide();
      rollbackmbusy();
    }
    setButton(base,txt,pos,func){
      let btn = generateElement(base, {
        type: "button", textContent: txt,
        style: { position: "absolute", right: pos[0]+"px", top: pos[1]+"px" }
      });
      btn.addEventListener("click", func);
    }
    resizeFunc(){
      utilResizeFunc("TCUTIN");
    }
    resizeFunc_org() {
      let km = document.getElementById("TCUTIN");
      if (km) {
        let [sw, sh] = [window.innerWidth, window.innerHeight];
        // 816x624
        let [w0, h0] = [816, 624];
        let [ax, ay] = [sw / w0, sh / h0];
        let [cl, ct] = [(sw - w0 + 20) / 2, (sh - h0 + 20) / 2];
        let aa = (ax > ay) ? ay : ax;
        km.style.left = cl + "px";
        km.style.top = ct + "px";
        km.style.transform = "scale(" + aa + "," + aa + ")";
      }
      console.log(this.name, "RESIZE!");
    }
  }

  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\./)[1];
  console.log("modname is "+modname);
  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['values'];
  console.log(paraids,typeof(paraids));
  let tcutin = new tcutinClass(paraids);

  /*=== HOOK =======*/
  var gmbusy = null;
  function savegmbusy(){
    // TEST: HOOK Game_Message.prototype.isBusy
    gmbusy = $gameMessage.isBusy; 
    $gameMessage.isBusy = function(){return true}
  }
  function rollbackmbusy(){
    // TEST: HOOK Game_Message.prototype.isBusy
    if(gmbusy){
      $gameMessage.isBusy = gmbusy
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