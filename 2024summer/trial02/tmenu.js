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
    constructor(){
      this.name = "tmenuClass";
      window.addEventListener('resize', this.resizeFunc.bind(this));
      // サイズ (816, 624)
      this.size = [816,624]
      this.guisize = [816 - 20, 624 - 20];
      // Resource
      {  // Resource START
        // BASEのパラメータ
        this.basepar = { /* W & H are FIXED. RESIZED BY SCALE */
          type: "div", id: "TMENU",
          style: { /* Left,Top,scale are CHANGED */
            backgroundColor: "#0000FF50", position: "relative", zIndex: 20,
            width: this.guisize[0] + "px", height: this.guisize[1] + "px"
          }
        };
        // top menuのパラメータ
        this.menupar = {
          coop:{text:"仲間", explain:"メンバーと相談します",
          func:this.imgset.bind(this)},
          story:{text:"ストーリー", explain:"ストーリーや手がかりを確認します",
          func:this.imgset.bind(this)},
          status:{text:"ステータス", explain:"とりあえずステータス画面",
          func:statusfunc},
          save:{text:"セーブ", explain:"セーブします（宿屋セーブでもいいような）",
          func:savefunc},
          close:{text:"閉じる", explain:"メニューを閉じます",
          func:smresume1}
        }
      } // Resource END
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
    // div
    creatediv(base,inp,w,h){
      let par = {
        type: "div", id: inp,
        style: {
          backgroundColor: "#000000",
          width: w + "px", height: h + "px"
        }
      };
      return generateElement(base,par);
    }
    initHTML() {
      // メイン
      let base = generateElement(document.body, this.basepar);
      this.resizeFunc();
      // コンテンツ(796x604)
      //this.menu0 = this.creatediv(base,"TMENU0",330,350);
      let [m0ww,m0hh] = [796-20,50-10]
      let menu0 = this.creatediv(base,"TMENU",m0ww,m0hh);//40+p10
      menu0.style.padding = "10px 10px 0px 10px";//上右下左
      menu0.style.display = "flex";
      var len = Object.keys(this.menupar).length;
      for(let kk in this.menupar){
        let mm = this.creatediv(menu0,kk,(m0ww-20)/len,30);//40
        mm.style.padding = "5px 10px 5px 10px";//上右下左
        mm.style["text-align"] = "center";
        let ii = geneTagImgFromTEXT("txt_"+kk,this.menupar[kk].text);
        mm.appendChild(ii);
        // mause event
        set3func(mm,this,this.mfunc);
      }
      let menubar = this.creatediv(base,"MENUBAR",796,10);
      menubar.style.backgroundColor = "#004444";
      // CENTER MENU
      let menu1 = this.creatediv(base,"CMENU",796,350);
      menu1.style.display = "flex";
      this.creatediv(menu1,"CMLEFT",400,350);
      this.menu0 = this.creatediv(menu1,"CMRIGHT",330,350);
      this.imgset();
      // BOTTOM MENU 
      let [ww,hh] = [796-20,(604-60-10-350)-20];
      this.btmmenu = this.creatediv(base,"btmmenu",ww,hh);
      this.btmmenu.style.backgroundColor = "#0000CC";
      this.btmmenu.style.padding = "10px";
      let btm = this.creatediv(this.btmmenu,"btarea",ww-20,hh-20);
      btm.style.padding = "10px";
      let btmtxt = geneTagImgFromTEXT("bt_txtimg", "メニューです");
      btm.appendChild(btmtxt);
    }
    //　イメージをセットする
    imgset(){
      console.log("imgset",this.name);
      this.menu0.innerHTML ="";
      let p = document.createElement("img");
      p.id = "imgx";
      p.src = "/img/pictures/Actor1_5.png";
      p.classList.add("fadeIn");
      p.classList.add("CharaShadow");
      this.menu0.append(p);
    }
    mfunc(e){
      let p = e.currentTarget;//現在のイベントハンドラーが装着されているオブジェクトを表します。
      // クリック
      if(e.type=="click"){
        console.log("clicked ",p, p.id);
        this.menupar[p.id].func();
        return;
      }
      // マウス移動
      if(e.type=="mouseenter"){
        console.log("mouseenter ",p);
        p.style.backgroundColor = "#00FFFF80";
        // テキストを書き換える
        let element = document.getElementById("bt_txtimg");
        if(element){
          element.src = getImgSrcFromTEXT(this.menupar[p.id].explain);
        }
      }else{
        console.log("else "+e.type);
        p.style.backgroundColor = "#000000";
      }
    }
    // Common Function -> utils.js
    resizeFunc(){
      utilResizeFunc("TMENU");
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