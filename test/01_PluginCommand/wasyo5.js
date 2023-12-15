//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc プラグインを頑張ります３＋
 * @author wasyo
 *
 * @help wasyo5.js
 *
 * HTMLのメニュー
 *
 * コモンイベント呼び出し方式は使わない
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/
/* ３の強化版を目指す */

(() => {
  'use strict';
  class wasyo5class{
    constructor(){
      this.name = "wasyo5class";
      this.mode = 0;
      this.menFunc = TouchInput.update; // 確保する。関数定義を持ってきた方が良いかもだが・・・
      this.mdsFunc = function() {}; // 無効化の書き方
      this.init();
      this.dflag = false;
      this.now = "a1";
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
      p.style.backgroundColor = "#0F0";
      p.style.color = "#FFF";
      p.style.left = x+'px';
      p.style.top = y+'px';
      p.style.width = w+'px';
      p.style.height = h+'px';
      p.style.zIndex = 10; // ErroDispが9 でマウス取られる 
      p.style.padding = pad+'px';
      document.body.appendChild(p);
      if(1){//無効
        let b = document.createElement("button");
        b.addEventListener('click', this.clickfunc.bind(this));
        b.textContent = "クリックして閉じる";
        p.appendChild(b);
      }
    }
    idret(inp){
      let mm = {"a1":1,"a2":2,"a3":3,"a4":4,"a5":5};
      return mm[inp];
    }
    //＝＝＝ マウスイベント ＝＝＝
    mover2(e){
      e.stopPropagation();
      let id = e.target.id;
      let p = document.getElementById(id);
      if(this.now != id){
        p.style.backgroundColor = "#F00";
        this.setT(id,1);
      }
    }
    mleave2(e){
      e.stopPropagation();
      let id = e.target.id;
      let p = document.getElementById(id);
      p.style.backgroundColor = "#00F";
      this.setT(id,0);
    }
    mclick(e){
      e.stopPropagation();
      let id = e.target.id;
      let mapid = this.idret(id);
      // HINT:https://rpgmaker-script-wiki.xyz/move_mv.php
      // HINT:https://github.com/yamachan/jgss-hack/blob/master/memo.ja/201701-scenes2.md
      if(this.now != id){
        $gamePlayer.reserveTransfer(mapid, 1, 1, 2, 1);
        Game_Player.prototype.performTransfer();
        this.now = id;
      }
      this.clickfuncCore(0);
    }

    // メニューのボタンからしか呼ばれないはず
    clickfunc(e){
      e.stopPropagation();
      this.clickfuncCore(0);
    }
    clickfuncCore(inp){
      this.mode = inp;
      TouchInput.update = (this.mode==0) ? this.menFunc : this.mdsFunc;
      console.log("clickfunc"+this.mode);
      this.show(this.mode);
      this.setT(this.now,0);
    }
    // clickfunc したら呼ばれる
    show(inp){
      let p = document.getElementById("aaa");
      p.style.display = (inp==0)? "none":"block";
      //console.log("this.menFunc: "+this.menFunc);
      //console.log(TouchInput.update);
      this.initdatashow();
    }
    // 一回だけ呼ばれる（初期化のタイミングでは $gameParty とか理由で呼べない）
    initdatashow(){
      if(this.dflag){return;}
      this.dflag = true;
      //＝＝＝
      let d = document.getElementById("aaa");

      let arg = [
        [150,200],
        [250,50],
        [250,300],
        [400,250],
        [400,100]
      ];
      let i = 1;
      for(let cc of arg){
        let [x,y]=cc;
        let [id,w,h] = ["a"+i++,50,50];
        this.addPanel(d,id,x,y,w,h);
      }
      if(1){
        let p = this.addPanel2(d,"axx",400,0,200,80);
      }
    }
    setT(id,mode){
      let txt = {
        "a1":"しんじゅく",
        "a2":"いけぶくろ",
        "a3":"しぶや",
        "a4":"しながわ",
        "a5":"とうきょう"
      };
      let d = document.getElementById("axx");
      if(mode==0){
        d.innerHTML = "<p>いまは「"+txt[this.now]+"」</p>";
      }else{
        if(this.now != id){
          let mn = this.fnmn(this.now, id);
          d.innerHTML = "<p>「"+txt[id]+"」に移動<BR>　料金 "+mn+"</p>";
        }
      }
    }
    fnmn(from,to){
      let f = this.idret(from);
      let t = this.idret(to);
      return 100*t+10*f;
    }
    addPanel(d,id,x,y,w,h){
      let ppp = document.createElement("div");
      d.appendChild(ppp);
      ppp.style.height = "100px";
      ppp.id = id;
      ppp.style.position = "absolute";
      ppp.style.left = x+'px';
      ppp.style.top = y+'px';
      ppp.style.width = w+'px';
      ppp.style.height = h+'px';
      ppp.style.backgroundColor = "#00F";
      ppp.addEventListener("mouseover", this.mover2.bind(this));
      ppp.addEventListener("mouseleave", this.mleave2.bind(this));
      ppp.addEventListener("click", this.mclick.bind(this));
      return ppp;
    }
    addPanel2(d,id,x,y,w,h){
      let ppp = document.createElement("div");
      d.appendChild(ppp);
      ppp.style.height = "100px";
      ppp.id = id;
      ppp.style.position = "absolute";
      ppp.style.left = x+'px';
      ppp.style.top = y+'px';
      ppp.style.width = w+'px';
      ppp.style.height = h+'px';
      ppp.style.backgroundColor = "#000";
      ppp.style.color = "#FFF";
      return ppp;
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
  const wasyo5 = new wasyo5class();

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
    this.addCommand('Ｆトラベル', 'rest', true);
  };
  // 押されたときのふるまい
  Scene_Menu.prototype.commandRest = function() {
    console.log("commandRest");
    this.popScene();
    //$gameTemp.reserveCommonEvent(4); // コモンイベントの４
    wasyo5.clickfuncCore(1); /* これで起こす！ */
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
