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

  class tegakaListClass{
    constructor(parent){
      this.parent = parent;
      this.name = "tegakaListClass";
      window.addEventListener('resize', this.resizeFunc.bind(this));
      // サイズ (816, 624)
      this.size = [816,624]
      this.guisize = [816 - 20, 624 - 20];

      // Resource
      {  // Resource START
        // BASEのパラメータ
        this.basepar = { /* W & H are FIXED. RESIZED BY SCALE */
          type: "div", id: "tglist",
          style: { /* Left,Top,scale are CHANGED */
            backgroundColor: "#0000FF50", position: "relative", zIndex: 20,
            width: this.guisize[0] + "px", height: this.guisize[1] + "px"
          }
        };
        this.css = {
          div1:{style:{backgroundColor:"#0000FF00"}},
          closebutton:{style:{backgroundColor:"#00000080",padding:"5px 10px 5px 10px","text-align":"center"}},
          btmstyle:{style:{backgroundColor:"#0000CC",padding:"10px"}},
        }
      } // Resource END
    }
    show(){
      const element = document.getElementById('tglist');
      if (element) {
        console.log("SET BLOCK")
        element.style.display = "block";
      } else {
        this.initHTML();
      }
    }
    hide(){
      const element = document.getElementById('tglist');
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
      base.style.backgroundColor = "#0000FF80";
      this.resizeFunc();
      // コンテンツ(796x604)
      // CLOSEボタン
      {
        let mm = this.creatediv(base,"close",100,40);//40
        setStyleElement(mm, this.css.closebutton);
        setabspos(mm,5,5,1);
        // CLOSEの文字
        let ii = geneTagImgFromTEXT("txt_BACK","BACK");
        mm.appendChild(ii);
        // mause event
        set3func(mm,this,this.mfunc2);
      }
      // BOTTOM MENU 
      {
        let [ww,hh] = [796-20,(604-60-10-350)-20];//184=604-420
        this.btmmenu = this.creatediv(base,"btmmenu",ww,hh);
        setStyleElement(this.btmmenu, this.css.btmstyle);
        setabspos(this.btmmenu,0,420);
        // テキストの描画エリア
        let btm = this.creatediv(this.btmmenu,"btarea",ww-20,hh-20);
        setStyleElement(btm, {style:{padding:"10px"}});
        // テキスト
        let btmtxt = geneTagImgFromTEXT("bt_txtimg2", "新メニュー");
        btm.appendChild(btmtxt);
      }
    }
    cfunc(){
      console.log("cfunc invoke.")
      this.hide();
      this.parent.show();
    }
    mfunc2(e){
      let func = this.cfunc.bind(this); 
      let p = e.currentTarget;//現在のイベントハンドラーが装着されているオブジェクトを表します。
      return this.mfcommonTXT(p,e.type,func,"#00FFFF80","#00000080","bt_txtimg2","戻ります");
    }
    // テキストを置き換えるタイプ
    mfcommonTXT(p, type, func, c1, c2, tar=null, ex=null){
      // クリック
      if(type=="click"){
        console.log("[mfcommon]clicked ",p, p.id);
        func();
        return;
      }
      // マウス移動
      if(type=="mouseenter"){
        console.log("[mfcommon]mouseenter ",p);
        p.style.backgroundColor = c1;
        // テキストを書き換える
        if(tar){
          let element = document.getElementById(tar);
          if(element){
            element.src = getImgSrcFromTEXT(ex);
          }
        }
      }else{
        console.log("[mfcommon]else "+type);
        p.style.backgroundColor = c2;
      }
    }
    // Common Function -> utils.js
    resizeFunc(){
      utilResizeFunc("tglist");
    }
  }
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
        this.css = {
          div1:{style:{backgroundColor:"#0000FF00"}},
          closebutton:{style:{backgroundColor:"#00000080",padding:"5px 10px 5px 10px","text-align":"center"}},
          btmstyle:{style:{backgroundColor:"#0000CC",padding:"10px"}},
        }
      } // Resource END
      // List
      this.tlist = new tegakaListClass(this);
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
    pagefunc(){
      this.hide();
      this.tlist.show();
    }
    initHTML() {
      // メイン
      let base = generateElement(document.body, this.basepar);
      base.style.backgroundColor = "#0000FF80";
      this.resizeFunc();
      // コンテンツ(796x604)
      // CENTER MENU
      {
        let img0 = this.creatediv(base,"CMRIGHT",330,350);
        setStyleElement(img0, this.css.div1);
        setabspos(img0,450,80);
        this.menu0 = img0;
        this.imgset();
        // mause event
        set3func(img0,this,this.mfuncX);
      }
      // MENU
      { //--- 622x122
        let ilist = ["/img/add/ready1.png","/img/add/ready1.png","/img/add/ready1.png","/img/add/ready1.png"];
        for(let i=0;i<4;i++){
          let img0 = this.creatediv(base,"MENU"+(i+1),10,10);
          setStyleElement(img0, this.css.div1);
          setabspos(img0,60,60+(90*i));
          // メニューイメージ
          let p = geneTagImg("imgMENU"+(i+1),ilist[i]);
          let imgmenustyle = {height:61,classList_add:"fadeInM",style:{"animation-duration":((1*i+5)/10)+"s"}};
          setStyleElement(p, imgmenustyle);
          img0.append(p);
          // mause event
          set3func(p,this,this.mfuncX);
        }
      }
      // CLOSEボタン
      {
        let mm = this.creatediv(base,"close",100,40);//40
        setStyleElement(mm, this.css.closebutton);
        setabspos(mm,5,5,1);
        // CLOSEの文字
        let ii = geneTagImgFromTEXT("txt_CLOSE","CLOSE");
        mm.appendChild(ii);
        // mause event
        set3func(mm,this,this.mfunc2);
      }
      // BOTTOM MENU 
      {
        let [ww,hh] = [796-20,(604-60-10-350)-20];//184=604-420
        this.btmmenu = this.creatediv(base,"btmmenu",ww,hh);
        setStyleElement(this.btmmenu, this.css.btmstyle);
        setabspos(this.btmmenu,0,420);
        // テキストの描画エリア
        let btm = this.creatediv(this.btmmenu,"btarea",ww-20,hh-20);
        setStyleElement(btm, {style:{padding:"10px"}});
        // テキスト
        let btmtxt = geneTagImgFromTEXT("bt_txtimg", "メニューです");
        btm.appendChild(btmtxt);
      }
    }
    //　イメージをセットする。Refresh。
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
      return this.mfcommonTXT(p,e.type,this.menupar[p.id].func,"#00FFFF80","#000000","bt_txtimg",this.menupar[p.id].explain);
    }
    mfunc2(e){
      let p = e.currentTarget;//現在のイベントハンドラーが装着されているオブジェクトを表します。
      return this.mfcommonTXT(p,e.type,this.menupar[p.id].func,"#00FFFF80","#00000080","bt_txtimg",this.menupar[p.id].explain);
    }
    mfuncX(e){
      let p = e.currentTarget;//現在のイベントハンドラーが装着されているオブジェクトを表します。
      let exp = "メニュー「"+p.id+"」が選択";
      if(p.id=="CMRIGHT"){
        exp = "ユウ「世直し旅と参ろうじゃないか";
      }
      let func = null;
      if(p.id == "imgMENU1"){
        func = this.pagefunc.bind(this);
      }
      if(p.id == "imgMENU2"){
        func = statusfunc;
      }
      return this.mfcommonIMG(p,e.type,func,"/img/add/ready3.png","/img/add/ready1.png","bt_txtimg",exp)
    }
    // テキストを置き換えるタイプ
    mfcommonTXT(p, type, func, c1, c2, tar=null, ex=null){
      // クリック
      if(type=="click"){
        console.log("[mfcommon]clicked ",p, p.id);
        func();
        return;
      }
      // マウス移動
      if(type=="mouseenter"){
        console.log("[mfcommon]mouseenter ",p);
        p.style.backgroundColor = c1;
        // テキストを書き換える
        if(tar){
          let element = document.getElementById(tar);
          if(element){
            element.src = getImgSrcFromTEXT(ex);
          }
        }
      }else{
        console.log("[mfcommon]else "+type);
        p.style.backgroundColor = c2;
      }
    }
    // 画像を置き換えるタイプ
    mfcommonIMG(p, type, func, c1, c2, tar=null, exp=null){
      // クリック
      if(type=="click" && func){
        console.log("[mfcommonIMG]clicked ",p, p.id);
        func();
        return;
      }
      // マウス移動
      if(type=="mouseenter"){
        let element = document.getElementById(p.id);
        if(element){
          element.src = c1;
        }
        // テキストを書き換える
        {
          let element = document.getElementById(tar);
          if(element){
            element.src = getImgSrcFromTEXT(exp);
          }
        }
      }else{
        let element = document.getElementById(p.id);
        if(element){
          element.src = c2;
        }
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