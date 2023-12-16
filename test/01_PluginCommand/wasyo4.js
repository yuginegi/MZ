//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc プラグインを頑張ります３＋
 * @author wasyo
 *
 * @help wasyo4.js
 *
 * HTMLのメニュー
 * ＜注意＞公式メニュー乗っ取っている
 * コモンイベント呼び出し方式は使わない
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/
/* ３の強化版を目指す */

(() => {
  'use strict';
  class wasyo4class{
    constructor(){
      this.name = "wasyo4class";
      this.mode = 0;
      this.menFunc = TouchInput.update; // 確保する。関数定義を持ってきた方が良いかもだが・・・
      this.mdsFunc = function() {}; // 無効化の書き方
      this.init();
      this.dflag = false;
    }
    init(){
      this.initCanvas();
    }
    initCanvas(){
      let [gcw,gch] = [window.innerWidth,window.innerHeight];
      console.log([gcw,gch]);
      let [pad,mgn] = [10,50];
      let [x,y,w,h] = [mgn,mgn,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      let p = document.createElement("div");
      p.id = "aaa";
      p.style.position = "absolute";
      p.style.display = "none";
      p.style.backgroundColor = "#000";
      p.style.color = "#FFF";
      p.style.left = x+'px';
      p.style.top = y+'px';
      p.style.width = w+'px';
      p.style.height = h+'px';
      p.style.zIndex = 4; // gameCanvas は 1 , Video が ２ 
      p.style.padding = pad+'px';
      document.body.appendChild(p);
      if(1){//無効
        let b = document.createElement("button");
        b.addEventListener('click', this.clickfunc.bind(this));
        b.textContent = "クリックして閉じる";
        p.appendChild(b);
      }
    }

    //＝＝＝ マウスイベント ＝＝＝
    mover2(e){
      e.stopPropagation();
      this.switch(e.target);
      let id = "cell_"+e.target.id;
      let p = document.getElementById(id);
      p.style.backgroundColor = "#088";
    }
    mleave2(e){
      e.stopPropagation();
      this.switch2(e.target);
      let id = "cell_"+e.target.id;
      let p = document.getElementById(id);
      p.style.backgroundColor = "#000";
    }

    // メニューのボタンからしか呼ばれないはず
    clickfunc(e){
      //DBG//console.log(e);
      e.stopPropagation();
      this.clickfuncCore(0);
      //$gameVariables.setValue(wasyo.idx,1);
    }
    clickfuncCore(inp){
      //this.mode = 1- this.mode;
      this.mode = inp;
      TouchInput.update = (this.mode==0) ? this.menFunc : this.mdsFunc;
      console.log("clickfunc"+this.mode);
      this.show(this.mode);
    }
    // clickfunc したら呼ばれる
    show(inp){
      let p = document.getElementById("aaa");
      p.style.display = (inp==0)? "none":"block";
      console.log("this.menFunc: "+this.menFunc);
      console.log(TouchInput.update);
      this.initdatashow();
    }
    // 一回だけ呼ばれる（初期化のタイミングでは $gameParty とか理由で呼べない）
    initdatashow(){
      if(this.dflag){return;}
      this.dflag = true;
      //＝＝＝
      let d = document.getElementById("aaa");

      // テーブル
      const tbl = document.createElement("table");
      tbl.style.width ="100%";
      const tblBody = document.createElement("tbody");
      const row = document.createElement("tr");
      tblBody.appendChild(row);
      tbl.appendChild(tblBody);
      d.appendChild(tbl);
      let gp = $gameParty.battleMembers(); // 配列
      for (let cc of gp) {
        const cell = document.createElement("td");
        cell.style.width =(100/gp.length)+"%";
        let p = document.createElement("img");
        p.src = this.getImgSrcFromTEXT(cc["_name"]);
        p.id = cc._battlerName;
        p.addEventListener('mouseover', this.mover2.bind(this));
        p.addEventListener('mouseleave', this.mleave2.bind(this));
        cell.appendChild(p);
        cell.id = "cell_"+p.id;
        row.appendChild(cell);
      }

      //パーティション
      let ppp = document.createElement("div");
      d.appendChild(ppp);
      ppp.style.height = "100px";

      //キャラ表示領域
      let parent = document.createElement("div");
      d.appendChild(parent);
      parent.style.display = "flex";
      {
        let dv = document.createElement("div");
        dv.style.width = "400px";
        parent.appendChild(dv);
        let defos =["キャラ名","　レベル","　ＨＰ　"];
        for(let i=0;i<defos.length;i++){
          let p = this.starea("st"+(i+1), defos[i]);
          dv.appendChild(p);
          dv.appendChild(document.createElement("BR"));
        }
      }
      // 画像の表示領域
      {
        let dv = document.createElement("div");
        parent.appendChild(dv);
        let p = document.createElement("img");
        p.id = "imggg";
        p.src = "";//'img/pictures/Actor1_2.png';
        //p.classList.toggle("fadeIn");
        p.classList.add("CharaShadow");
        dv.appendChild(p);
      }
    }
    starea(sid,defo){
      let p = document.createElement("img");
      p.id = sid;
      let aa = createTextPictureBitmap(defo);
      p.src = aa.context.canvas.toDataURL();
      return p;
    }

    // 文字説明を変更
    switchexp(tar){
      let gp = $gameParty.battleMembers();
      let aid = 0;
      let n = gp.length;
      for(let i=0;i<n;i++){
        //console.log("switchexp:"+[gp[i]._battlerName,tar.id,gp[i]._name]);
        if(gp[i]._battlerName == tar.id){
          aid = i;
          break;
        }
      }
      let cc = gp[aid];
      let defos =["キャラ名","　レベル","　ＨＰ　"];
      let vals = [cc._name,cc._level,cc._hp+"/"+cc.mhp];
      for(let i=0;i<defos.length;i++){
        let p = document.getElementById("st"+(i+1));
        let txt = defos[i]+ " : "+vals[i];
        p.src = this.getImgSrcFromTEXT(txt);
      }
    }
    // Picture Areaを変更
    switchpic(tar){
      console.log(tar.id);
      let p = document.getElementById("imggg");
      p.src = 'img/pictures/'+tar.id+'.png';
      p.classList.add("fadeIn");
    }
    switch2(tar){
      let p = document.getElementById("imggg");
      //p.src = '';
      p.classList.remove("fadeIn");
    }
    switch(tar){
      this.switchpic(tar);
      this.switchexp(tar);
    }
    // For Image.src
    getImgSrcFromTEXT(txt){
      // ＝＝＝ 参考になった素晴らしいページ ＝＝＝
      // https://www.programmingmat.jp/webhtml_lab/canvas_image.html
      // http://tonbi.jp/Game/RPGMakerMV/009/
      let aa = createTextPictureBitmap(txt);
      return aa.context.canvas.toDataURL();
    }
  }
  const wasyo4 = new wasyo4class();

  // From official TextPicture
  function createTextPictureBitmap(text) {
    console.log("createTextPictureBitmap invoked. "+text);
    const tempWindow = new Window_Base(new Rectangle());
    const size = tempWindow.textSizeEx(text);
    tempWindow.padding = 0;
    tempWindow.move(0, 0, size.width, size.height);
    tempWindow.createContents();
    tempWindow.drawTextEx(text, 0, 0, 0);
    const bitmap = tempWindow.contents;
    tempWindow.contents = null;
    tempWindow.destroy();
    bitmap.mzkp_isTextPicture = true;
    return bitmap;
  }


  /* 公式メニューに入り込む */
  // https://riyoneko.hatenablog.jp/entry/2019/10/02/214140 ☆最高☆
  // https://db.liberty-quest.com/rpgmakermv/add-item-to-menu/

  // メニュー項目を強制的に上書きする (V1.7)
  Scene_Menu.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler('rest', this.commandRest.bind(this)); /* 追加 */
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;
  };
  // 表示文字を決める。第１引数
  Window_MenuCommand.prototype.addOriginalCommands = function() {
    this.addCommand('追加項目', 'rest', true);
  };
  // 押されたときのふるまい
  Scene_Menu.prototype.commandRest = function() {
    console.log("commandRest");
    this.popScene();
    //$gameTemp.reserveCommonEvent(4); // コモンイベントの４
    wasyo4.clickfuncCore(1); /* これで起こす！ */
  };

  (function(d){
    var head = d.getElementsByTagName('head')[0];
    var link = d.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('type','text/css');
    link.setAttribute('href','css/wasyo.css');
    head.appendChild(link);
  })(document);

})();
