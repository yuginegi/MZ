//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc メニュープラグイン
 * @author yuginegi
 *
 * @help tcutin.js
 *
 * 一覧のイベントから呼ばれる想定
 * HTML側の操作と連携させる
 * クリックすると戻ってこれる（無限待ち注意）
 * $gameMessage.isBusy で、強制的に待たせる。
 * 
 * @command invoke
 * @text 呼び出し
 * @desc 呼び出し
 * @arg request
 * @type text
 * @desc 出したいシーン
 * 
 */

(() => {
  'use strict';
  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\.js/)[1];
  console.log("modname is "+modname);
  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['values'];
  console.log("[PAR]",paraids,typeof(paraids));
  let tcutin = new tcutinClass(paraids);

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  // invoke
  PluginManager.registerCommand(modname, "invoke", args => {
    tcutin.invoke(args.request);
  });

})();