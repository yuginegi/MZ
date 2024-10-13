//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc メニュープラグイン
 * @author yuginegi
 *
 * @help tmenu.js
 *
 * HTML側の操作と連携させる
 * クリックすると戻ってこれる
 * 
 * @command invoke
 * @text 呼び出し
 * @desc 呼び出し
 * @arg val
 * @type text
 * @desc 手がかりのセットID
 * @arg num
 * @type number
 * @desc 総手がかり数
 * 
 * 
 */

(() => {
  'use strict';

  class tmenuClass{
    constructor(ids){
      this.name = "tmenuClass";
      window.addEventListener('resize', this.resizeFunc.bind(this));
      // サイズ (816, 624)
      this.size = [816,624]
      // 状態
      this.viewstate = 0;
    }
    saveTukuru(){

    }
    invoke(){
      this.show();
    }
    show(){
      const element = document.getElementById('TMENU');
      if (element) {
        console.log("SET BLOCK")
        element.style.display = "block";
      } else {
        this.initHTML();
      }
    }
    hide(){
      const element = document.getElementById('TMENU');
      if (element) {
        console.log("SET NONE")
        element.style.display = "none";
      }
    }
    initHTML() {
      let [w, h] = [816 - 20, 624 - 20];
      let par = {
        type: "div", id: "TMENU",
        style: { /* Left,Top,scale are CHANGED */
          backgroundColor: "#0000FF50", position: "relative", zIndex: 20,
          width: w + "px", height: h + "px" /* W & H are FIXED */
        }
      };
      let base = generateElement(document.body, par);
      this.resizeFunc();
      // コンテンツ
      let par2 = {
        type: "div", id: "TMEMU0",
        style: {
          backgroundColor: "#000000",
          width: 330 + "px", 
          height: 350 + "px"
        }
      };
      this.menu0 = generateElement(base,par2);
      this.cfunc();
      // ボタン
      this.setButton(base,"close",[5,5],smresume1);
      this.setButton(base,"SAVE",[5,100],savefunc);
      this.setButton(base,"STATUS",[5,50],statusfunc);
      this.setButton(base,"NEWGUI",[5,150],this.cfunc.bind(this));
    }
    cfunc(){
      console.log("cfunc",this.name);
      this.menu0.innerHTML ="";
      let p = document.createElement("img");
      p.id = "imgx";
      p.src = "/img/pictures/Actor1_5.png";
      p.classList.add("fadeIn");
      p.classList.add("CharaShadow");
      this.menu0.append(p);
    }
    setButton(base,txt,pos,func){
      let btn = generateElement(base, {
        type: "button", textContent: txt,
        style: { position: "absolute", right: pos[0]+"px", top: pos[1]+"px" }
      });
      btn.addEventListener("click", func);
    }
    resizeFunc(){
      utilResizeFunc("TMENU");
    }
    resizeFunc_org() {
      let km = document.getElementById("TMENU");
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
  let tmenu = new tmenuClass(paraids);

  /*=== HOOK =======*/

  // マップからメニューを開かせない
  // Window_MenuCommand.initCommandPosition() は メニューとコマンドだけ
  const TE = TouchInput.update;
  const IE = Input.update;
  const TD = function() {};
  var gHookMenuMode = false;
  function smresume(){
    if(gHookMenuMode==false){
      console.log("endMenu skip");
      return;
    }
    console.log("endMenu");
    // 村人を動かす
    SceneManager.resume()
    // 操作再開
    TouchInput.update = TE;
    Input.update = IE;
    // TEST
    tmenu.hide();
    // メニューを再び押せるように
    gHookMenuMode = false;
  }
  function smresume1(){
    smresume();
    // MENUのために (ほかに遷移していないので、わざわざ呼び出す必要がある)
    const element = document.getElementById('TEGAKARI');
    if (element) {
      console.log("SET BLOCK")
      element.style.display = "BLOCK";
    }
  }
  Scene_Map.prototype.callMenu = function() {
    if(gHookMenuMode!=false){
      console.log("callMenu skip");
      return;
    }
    gHookMenuMode = true;
    console.log("callMenu");
    this.menuCalling = false; // 繰り返し呼びを止める
    // 村人を動かさない
    SceneManager.stop()
    // 入力のクリア
    TouchInput.update = TD;TouchInput.clear();
    Input.update = TD;Input.clear();
    $gameTemp.clearDestination();
    // TEST
    tmenu.invoke();
    // MENUのために
    const element = document.getElementById('TEGAKARI');
    if (element) {
      console.log("SET NONE")
      element.style.display = "none";
    }
    // メニューを隠す
    //Scene_Map.prototype.hideMenuButton()
    this.hideMenuButton();
  }
  // Status
  function statusfunc(){
    console.log("statusfunc invoke");
    smresume();
    SceneManager.push(Scene_Status);
  }
  // Save
  function savefunc(){
    console.log("savefunc invoke");
    smresume();
    SceneManager.push(Scene_Save);
  }

  /*=== HOOK =======*/

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  // invoke
  PluginManager.registerCommand(modname, "invoke", args => {
    tmenu.invoke();
  });

})();