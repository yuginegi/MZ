//=============================================================================
// RPG Maker MZ - BassSystem
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc バースシステム
 * @author wasyo
 *
 * @param BassValueID
 * @desc バース店で使ってよい変数
 *
 * @param LoopID
 * @desc ループで使ってよい変数
 * 
 * @help BassSystem.js
 *
 * 所持している素材を売る
 *
 * @command collect
 * @text 素材の仕入れ
 * @desc 
 * 設定された ループ変数 は、
 * 　内部で０に初期化して
 * クリックされたときに、
 * 　条件満たしていなければ　１にして返します
 * 　条件満たしていれば　　　２にして返します
 * できれば直後に会話画面を入れてもらえると、クリック移動が防げます。
 * stopPropagation とかで防げると思うが、未実施
 *
 * @command func2
 * @text 未実装
 * @desc 
 * 設定された ループ変数 を 
 * 条件満たしていなければ　０にして返します
 * 条件満たしていれば　　　１にして返します
 */

/* うごかない */

(() => {
  'use strict';
  class BassSystemClass{
    constructor(id1,id2){
      this.name = "BassSystemClass";
      this.vid = id1;//For DataManage
      this.lid = id2;//For Loop
      this.itemArray = [41,42,43,44];
    }
    /*************************************************
    * 回収
    *************************************************/
    func1(){
      console.log([this.name,"func1"]);
      // 初期化
      $gameVariables.setValue(this.lid,0);
      // 表示
      this.collectViewMain();
    }
    /*** クリック効果 ***/
    clickfunc(){
      this.collectMain();
      this.end();
    }
    end(){
      // 上に通知 (１か２)
      let ret = this.confirmFunc();
      $gameVariables.setValue(this.lid, ret+1);
      console.log([this.name,"end"]);
      // お片付け
      let p = document.getElementById("BassSystemDiv");
      p.remove();
    }
    /*** 表示メイン ***/
    initCanvas(args){
      let [gcw,gch] = [window.innerWidth,window.innerHeight];
      //console.log([gcw,gch]);
      let [pad,mgn] = [10,150];
      let [x,y,w,h] = [mgn,mgn,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      let csshash = {
        position:"absolute", overflowX:"hidden",overflowY:"auto",
        backgroundColor:"#000",color:"#FFF",
        left:x+'px',top:y+'px',width:w+'px',height:h+'px',
        zIndex:10,padding:pad+'px'
      };
      // DOM CREATE
      let p = document.createElement("div");
      p.id = "BassSystemDiv";
      // Style Set
      for(let atr in csshash){
        p.style[atr] = csshash[atr];
      }
      document.body.appendChild(p);
      return p;
    }
    addButton(div,inp){
      let b = document.createElement("button");
      b.addEventListener('click', this.clickfunc.bind(this));
      b.textContent = inp;
      div.appendChild(b);
    }
    collectViewMain(){
      // DOM追加 JavaScriptの基本 
      let div = this.initCanvas(); // BassSystemDiv
      // DOM に ボタンの追加
      this.addButton(div,"OK");
      // メインビュー（アイテムの一覧表示）
      this.collectView(div);
    }
    /*** 処理メイン ***/
    collectPtag1(div,cc,str){
      let p = document.createElement("p");
      if(classOf(cc)=="hash"){
        let data = $dataItems;
        for(let oo of this.itemArray){
          if(cc[oo] > 0){
            let d = data[oo];
            str += "<BR>";
            str += d.name+" : "+cc[oo];
          }
        }
      }
      p.innerHTML = str;
      div.appendChild(p);
    }
    collectPtag2(div,cc,str){
      let p = document.createElement("p");
      if(classOf(cc)=="hash"){
        let data = $dataItems;
        for(let oo of this.itemArray){
          let d = data[oo];
          str += "<BR>";
          if(cc[oo] < 5){
            str += d.name+" : "+cc[oo];
          }else{
            str += d.name+" : "+cc[oo]+" 　　条件達成　　";
          }
        }
      }
      p.innerHTML = str;
      div.appendChild(p);
    }
    collectView(div){
      this.collectPtag1(div,$gameParty._items,"引き取るアイテム");
      let hh = $gameVariables.value(this.vid);
      this.collectPtag2(div,hh.items,"引き取ったアイテム");
    }

    // 回収
    collectMain(){
      let cc = $gameVariables.value(this.vid);
      // 情報 が もし未初期化だったら
      if(classOf(cc)!="hash"){
        cc = {items:{}};
        for(let ii of this.itemArray){
          cc.items[ii] = 0;
        }
      }
      // もっているアイテムを店に渡す
      for(let ii of this.itemArray){
        if(cc.items[ii] < 5 && $gameParty._items[ii] > 0){
          cc.items[ii] += $gameParty._items[ii];
          if(cc.items[ii] > 5){
            $gameParty._items[ii] = cc.items[ii]-5;
            cc.items[ii] = 5;
          }else{
            //$gameParty._items[ii] = 0;
            delete $gameParty._items[ii];
          }
        }
      }
      $gameVariables.setValue(this.vid, cc);
    }
    /*** 達成状況確認 ***/
    confirmFunc(){
      let cc = $gameVariables.value(this.vid);
      if(classOf(cc)!="hash"){
        return 0;
      }
      let rFlag = 1;
      for(let oo of this.itemArray){
        if(cc.items[oo] < 5){
          rFlag = 0;
          break;
        }
      }
      return rFlag;
    }
    /*************************************************
    * 
    *************************************************/
    func2(){
      console.log([this.name,"func2"]);
      // 初期化
      $gameVariables.setValue(this.lid,0);
    }
  }



  // https://nma.omaww.net/javascript/javascript%E3%81%A7array%E3%81%8Bhash%E3%81%8B%E5%88%A4%E5%AE%9A%E3%81%99%E3%82%8B
  function classOf(obj){
    if((typeof obj)=="object"){
        if(obj.length!=undefined) return "array";
        else{
          for(let t in obj){
            if(obj[t]!=undefined) return "hash";
            else return "object";
          }
        }
    }else return (typeof obj);
  }

  /*
    How to get modname ?
    https://qiita.com/kijtra/items/472cb34a8f0eb6dde459
    https://tektektech.com/javascript-get-fileinfo-from-path/#i
  */
    var current = document.currentScript.src;
    console.log("current is "+current);
    let matchs = current.match(/([^/]*)\.js/);
    console.log("matchs is "+matchs);
    let modname = matchs.pop();
    console.log("modname is "+modname);

  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var id1 = Number(parameters['BassValueID'] || 0);
  var id2 = Number(parameters['LoopID'] || 0) ;
  console.log("BassSystem: "+[id1,id2]);
  let BassSystem = new BassSystemClass(id1,id2);

  /* FUNC1 */
  PluginManager.registerCommand(modname, "collect", args => {
    BassSystem.func1();
  });
  /* FUNC2 */
  PluginManager.registerCommand(modname, "confirm", args => {
    BassSystem.func2();
  });

})();
