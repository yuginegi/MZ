//=============================================================================
// RPG Maker MZ - NeneSystem
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc ネネシステム
 * @author wasyo
 *
 * @help NeneSystem.js
 *
 * 所持している武器を売る
 *
 * @command purchase
 * @text アイテムの仕入れ
 * @desc 
 * ループ変数の番号をください、１にして返します
 * お店で使うための変数をください
 * @arg val1
 * @type number
 * @text ループ変数の番号（数字）
 * @desc 使って良い変数の数字
 * @arg val2
 * @type number
 * @text 店情報変数の番号（数字）
 * @desc 大事なお店情報
 *
 * @command sales
 * @text アイテム売る
 * @desc 
 * 出力用の変数の番号をください、そこに返します
 * お店で使うための変数をください
 * @arg val1
 * @type number
 * @text ループ変数の番号（数字）
 * @desc 使って良い変数の数字
 * @arg val2
 * @type number
 * @text 店情報変数の番号（数字）
 * @desc 大事なお店情報
 */

/* うごかない */

(() => {
  'use strict';
  class NeneSystemClass{
    constructor(){
      this.name = "NeneSystemClass";
    }
    /*************************************************
    * 回収
    *************************************************/
    init(idx,idx2){
      console.log([this.name,"init"]);
      // 初期化
      $gameVariables.setValue(this.idx,0);
      this.idx = idx;
      this.idx2 = idx2;
      // 表示
      this.kaisyuViewMain();
    }
    /*** クリック効果 ***/
    clickfunc(){
      this.kaisyuMain();
      this.end();
    }
    end(){
      // 上に通知
      $gameVariables.setValue(this.idx,1);
      console.log([this.name,"end"]);
      // お片付け
      let p = document.getElementById("NeneSystemDiv");
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
      p.id = "NeneSystemDiv";
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
    kaisyuPtag(div,cc,str){
      if(classOf(cc)!="hash"){return;}
      let data = $dataWeapons;
      for(let oo of Object.keys(cc)){
        if(cc[oo] > 0){
          let d = data[oo];
          str += "<BR>";
          str += d.name+" : "+d.price+" x "+cc[oo];
        }
      }
      let p = document.createElement("p");
      p.innerHTML = str;
      div.appendChild(p);
    }
    kaisyuView(div){
      this.kaisyuPtag(div,$gameParty._weapons,"引き取るアイテム");
      let hh = $gameVariables.value(this.idx2);
      this.kaisyuPtag(div,hh.weapons,"在庫");
    }
    kaisyuViewMain(){
      // DOM追加 JavaScriptの基本 
      let div = this.initCanvas(); // NeneSystemDiv
      // DOM に ボタンの追加
      this.addButton(div,"売る");
      // メインビュー（アイテムの一覧表示）
      this.kaisyuView(div);
    }
    /*** 処理メイン ***/
    kaisyuFunc(cc,items){
      // ハッシュが空かどうかを気にしながら コピー
      for(let ii of Object.keys(items)){
        cc[ii] = (cc[ii]) ? cc[ii]+items[ii] : items[ii]; 
      }
    }
    kaisyuMain(){
      let cc = $gameVariables.value(this.idx2);
      // 店情報 が もし未初期化だったら
      if(classOf(cc)!="hash"){
        cc = {weapons:{},armors:{}};
      }
      // もっている武器を店に渡す
      this.kaisyuFunc(cc.weapons, $gameParty._weapons);
      // 更新処理
      $gameParty._weapons = {};
      $gameVariables.setValue(this.idx2, cc);
    }

    /*************************************************
    * 売りあげ処理
    *************************************************/
    init2(idx,idx2){
      console.log([this.name,"init"]);
      // 初期化
      $gameVariables.setValue(this.idx,0);
      this.idx = idx;
      this.idx2 = idx2;
      this.uriageMain();
    }
    /*** 処理メイン ***/
    uriageKosuu(n){
      let i = 0;
      for(i=0;i<n;i++){
        let m = Math.random();
        if(m < 0.2){return i;}
      }
      return i;
    }
    uriageMain(){
      let hh = $gameVariables.value(this.idx2);
      let uval = 0; // 売上
      let neneskill = 1.5; // 売り増し倍率
      let cc = hh.weapons;
      let data = $dataWeapons;
      for(let oo of Object.keys(cc)){
        let d = data[oo];
        let m = cc[oo];
        let n = this.uriageKosuu(m);
        cc[oo] = m-n;
        console.log([d.name,d.price,m,n,cc[oo]]);
        uval += (neneskill * d.price * n);
        let pp = d.price * n;
        console.log("uval:"+[uval]+" <= "+[neneskill * pp, pp]);
      }
      console.log("uval:"+uval);
      hh.weapons = cc;
      // 在庫アイテム減った
      $gameVariables.setValue(this.idx2,hh);
      // 売上を変数に入れて戻す
      $gameVariables.setValue(this.idx,uval);
    }
  }
  let NeneSystem = new NeneSystemClass();

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
  let modname = current.match(/([^/]*)\./)[1];
  console.log("modname is "+modname);

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */
  /* FUNC1 */
  PluginManager.registerCommand(modname, "purchase", args => {
    NeneSystem.init(args.val1,args.val2);
  });
  /* FUNC2 */
  PluginManager.registerCommand(modname, "sales", args => {
    NeneSystem.init2(args.val1,args.val2);
  });

})();
