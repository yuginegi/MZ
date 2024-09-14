//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc プラグイン頑張ります
 * @author yuginegi
 *
 * @help wrapper.js
 *
 * HTML側の操作と連携させる
 * クリックすると戻ってこれる
 * @param values
 * @desc 使ってよい変数を指定。現在は１つ必要。
 * 数字とカンマ区切りだけを半角で。
 * （例）2,15,16,17,18,19,20
 * 
 * @command wasyo1
 * @text ループ初期化
 * @desc 使って良い変数の番号を０以外にして返します
 *
 */

(() => {
  'use strict';

  class wrapperclass{
    constructor(ids){
      this.name = "wrapperclass";
      //＝＝＝ 入力文字列を数字の配列にする
      let aa = ids.split(',');
      this.ids = aa.map(Number);
      //＝＝＝ 通知の箱
      console.log(this.ids);
      this.idx = this.ids[0];
      //＝＝＝ 必要なクラスを生成
      this.rootclass = new test0();
      this.rootclass.endfunc = this.endcall.bind(this); //終わったら教えてもらう
    }
    initcall(){
      //＝＝＝ 通常運転
      $gameVariables.setValue(this.idx,0);
      let val = $gameVariables.value(this.ids[1]);
      // 処理
      this.rootclass.invoke(val[0],val[1]);
    }
    endcall(){
      // 上に通知
      $gameVariables.setValue(this.idx,1);
      console.log([this.name,"end"]);
    }
  }

  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\./)[1];
  console.log("modname is "+modname);
  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['values'];
  console.log(paraids,typeof(paraids));
  let wasyo = new wrapperclass(paraids);

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  PluginManager.registerCommand(modname, "wasyo1", args => {
    wasyo.initcall();
  });

})();