//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc てがかりプラグイン
 * @author yuginegi
 *
 * @help tegakari.js
 *
 * HTML側の操作と連携させる
 * クリックすると戻ってこれる
 * @param values
 * @desc 使ってよい変数を指定。現在は１つ必要。
 * 数字とカンマ区切りだけを半角で。
 * （例）2,15,16,17,18,19,20
 * 
 * @command init
 * @text 初期化
 * @desc 初期化
 * @arg val
 * @type text
 * @desc 手がかりのセットID
 * @arg num
 * @type number
 * @desc 総手がかり数
 * 
 * @command end
 * @text 終了
 * @desc 終了、情報を空にする
 * @arg val
 * @type text
 * @desc 手がかりのセットID
 * 
 * @command wasyo1
 * @text バー表示・非表示
 * @desc バーを表示・非表示
 * @arg val
 * @type number
 * @desc ０で非表示、１で表示
 *
 * @command wasyo2
 * @text 手がかり見つけた
 * @desc 手がかり見つけた
 * @arg val
 * @type text
 * @desc 見つけた手がかりIDをください。TEXTでOK,重複しなければなんでも。
 * 
 * @command wasyo3
 * @text 手がかり率
 * @desc 手がかり率
 * @arg val
 * @type number
 * @desc 箱をください。達成は１、未達成は１未満を返します。（小数点返せないかも）
 *   ツクールMZデフォルトの挙動として、変数の操作によって
 *   変数の値に数値をセットする場合、小数点以下が切り捨てられます
 * 
 */

(() => {
  'use strict';

  class tegakariClass{
    constructor(ids){
      this.name = "tegakariClass";
      window.addEventListener('resize', this.resizeFunc.bind(this));
      //＝＝＝ 入力文字列を数字の配列にする
      let aa = ids.split(',');
      this.ids = aa.map(Number);
      //＝＝＝ 手がかり情報の変数
      console.log(this.ids);
      this.idx = this.ids[0];
      // バーのサイズ (816, 624)
      this.barpos = [350,0]
      //this.barsize = [816-this.barpos[0],100]
      this.barsize = [816-this.barpos[0],40]
      // 状態
      this.viewstate = 0;
    }
    initialize(inp,n){
      let val = $gameVariables.value(this.ids[0]);
      val = {};
      val.id = inp;
      val.num = n; // 1面だから
      $gameVariables.setValue(this.idx,val);
      this.update(val);
    }
    finalize(inp){
      console.log("finalize call")
      let val = $gameVariables.value(this.ids[0]);
      if(val.id != inp){
        console.log("ID not matched");
        return;
      }
      val = {done:true};
      $gameVariables.setValue(this.idx,val);
      this.update(val);
    }
    initcall(inp){
      //＝＝＝ 情報取得
      let val = $gameVariables.value(this.ids[0]);
      // 処理
      if(inp==1){
        //DBG//console.log("SHOW",inp,val)
        if(val && val.id){
          this.viewstate = 1;
          this.show();
        }
      }else{
        //DBG//console.log("HIDE",inp,val)
        this.viewstate = 0;
        this.hide();
      }
    }
    loadcall(){
      let val = $gameVariables.value(this.ids[0]);
      if(val && val.num){
        this.initcall(1);
        this.update(val);
      }
    }
    addcall(inp){
      let val = $gameVariables.value(this.ids[0]);
      val[inp] = true;
      $gameVariables.setValue(this.idx,val);
      console.log(this.ids[0],val);
      this.update(val);
    }
    calc(val){
      return Object.keys(val).length -2;
    }
    getcall(inp){
      let id = Number(inp);
      let val = $gameVariables.value(this.ids[0]);
      let v = 0;
      if(val.done){
        v = 1;
      }else{
        v = this.calc(val)/val.num;
      }
      console.log("getcall",id,v)
      $gameVariables.setValue(id,v);
    }
    update(val){
      // 進捗更新
      let pp = Math.floor(100*this.calc(val)/val.num);
      let e = document.getElementById("TEGTEXT");
      if(!e){return;}
      if(pp>=100){
        e.textContent = "手がかりをそろえた！！";
      }else{
        e.textContent = pp+"%";
      }
    }
    show(){
      //DBG//console.log(this.viewstate)
      if(this.viewstate!=1){return;}
      const element = document.getElementById('TEGAKARI');
      if (element) {
        //DBG//console.log("SET BLOCK")
        element.style.display = "block";
      } else {
        this.initHTML();
      }
      let val = $gameVariables.value(this.ids[0]);
      this.update(val);
    }
    hide(){
      const element = document.getElementById('TEGAKARI');
      if (element) {
        //DBG//console.log("SET NONE")
        element.style.display = "none";
      }
    }
    initHTML() {
      let [w, h] = this.barsize; // [816 - 20, 20];
      let par = {
        type: "div", id: "TEGAKARI",
        style: { /* Left,Top,scale are CHANGED */
          backgroundColor: "#FF0000A0", position: "relative", zIndex: 20,
          width: w + "px", height: h + "px" /* W & H are FIXED */
        }
      };
      let base = generateElement(document.body, par);
      this.resizeFunc();
      let par2 = {
        type: "div", id: "TEGTEXT", textContent: "0%",
        style: {
          "font-size": "20pt",
          position: "absolute", right: "60px", top: "2px"
        }
      };
      generateElement(base,par2);
    }
    resizeFunc(){
      utilResizeFunc("TEGAKARI",this.barpos);
    }
  }

  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\./)[1];
  console.log("modname is "+modname);
  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['values'];
  console.log(paraids,typeof(paraids));
  let tegakari = new tegakariClass(paraids);

  /*=== HOOK =======*/
  function tegakari_call(type){
    (type==1)? tegakari.hide():tegakari.show();
  }
  // ロード直後 １回のみにしたい → 未初期化も考慮して表示する
  function tegakari_invoke(){
    //console.log("tegakari_invoke");
    tegakari.loadcall();// 改善の余地あり
  }
  // シーン切り替えで制御
  const smgoto = SceneManager.goto.bind(SceneManager);
  SceneManager.goto = function(sceneClass) {
    //console.log("SceneManager.goto HOOK !",sceneClass);
    if(sceneClass == Scene_Map){
      tegakari_invoke();
    }else{
      tegakari_call(1);
    }
    return smgoto(sceneClass);
  }

  /*=== HOOK =======*/

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  // Initialize
  PluginManager.registerCommand(modname, "init", args => {
    tegakari.initialize(args.val,args.num);
  });
  PluginManager.registerCommand(modname, "end", args => {
    console.log("finalize call",args.val)
    tegakari.finalize(args.val);
  });
  // show/hide
  PluginManager.registerCommand(modname, "wasyo1", args => {
    tegakari.initcall(args.val);
  });
  // add
  PluginManager.registerCommand(modname, "wasyo2", args => {
    tegakari.addcall(args.val);
  });
  // get
  PluginManager.registerCommand(modname, "wasyo3", args => {
    tegakari.getcall(args.val);
  });

})();