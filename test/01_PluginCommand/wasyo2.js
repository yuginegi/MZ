//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc プラグインを頑張ります２
 * @author wasyo
 *
 * @help wasyo2.js
 *
 * HTML側の操作と連携させる
 *
 * @command wasyo1
 * @text ループ初期化
 * @desc 使って良い変数の番号をください、０にして返します
 * @arg val
 * @type number
 * @text 変数の番号（数字）
 * @desc 使って良い変数の数字
 *
 */

/* うごかない */

(() => {
  'use strict';
  class wasyoclass{
    constructor(){
      this.name = "wasyoclass";
    }
    init(idx){
      console.log([this.name,"init"]);
      // 初期化
      $gameVariables.setValue(this.idx,0);
      this.idx = idx;
      this.count = 0;

      this.initCanvas();

      // DOM追加 JavaScriptの基本 
      let div = document.getElementById("aaa");
      let p = document.createElement("p");
      p.innerHTML = "ここはDIV領域<BR>position = absolute<BR>zIndex = 2";
      div.appendChild(p);
      let b = document.createElement("button");
      b.addEventListener('click', this.clickfunc.bind(this));
      b.textContent = "クリックして";
      div.appendChild(b);
      let d = document.createElement("p");
      d.id = "clkarea";
      div.appendChild(d);
    }
    clickfunc(){
      this.count++;
      console.log("clickfunc");
      let p = document.getElementById("clkarea");
      p.textContent = "クリック回数は "+this.count;
      if(this.count > 5){
        this.end();
      }
    }
    initCanvas(args){
      let [gcw,gch] = [window.innerWidth,window.innerHeight];
      console.log([gcw,gch]);
      let [pad,mgn] = [10,50];
      let [x,y,w,h] = [mgn,mgn,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      let p = document.createElement("div");
      p.id = "aaa";
      p.style.position = "absolute";
      p.style.backgroundColor = "#000";
      p.style.color = "#FFF";
      p.style.left = x+'px';
      p.style.top = y+'px';
      p.style.width = w+'px';
      p.style.height = h+'px';
      p.style.zIndex = 2; // gameCanvas は 1 , Video が ２ 
      p.style.padding = pad+'px';
      document.body.appendChild(p);
    }

    end(){
      // 上に通知
      $gameVariables.setValue(this.idx,1);
      console.log([this.name,"end"]);
      // お片付け
      let p = document.getElementById("aaa");
      p.remove();
    }

  }
  let wasyo = new wasyoclass();

  /*
    How to get modname ?
    https://qiita.com/kijtra/items/472cb34a8f0eb6dde459
    https://tektektech.com/javascript-get-fileinfo-from-path/#i
  */
  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\./)[1];
  console.log("modname is "+modname);

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  /* FUNC1 */
  PluginManager.registerCommand(modname, "wasyo1", args => {
    wasyo.init(args.val);
  });

})();
