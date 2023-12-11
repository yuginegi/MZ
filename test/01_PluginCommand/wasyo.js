//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc プラグインを頑張ります
 * @author wasyo
 *
 * @help wasyo.js
 *
 * @command wasyo1
 * @text ループ初期化
 * @desc 使って良い変数の番号をください、１にして返します
 * @arg val
 * @type number
 * @text 変数の番号（数字）
 * @desc 使って良い変数の数字
 *
 * @command wasyo2
 * @text ループ呼び出し
 * @desc ５秒間画像を表示する（固定）
 */

(() => {
  'use strict';
  let wasyotime= 0;
  let wasyoendt= 0;
  let wasyoidx = 0;
  let wasyoremoveidx = 0;
  let wwwttt = 0;

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
    console.log("wasyoPL.wasyo1. "+args.val);
    wasyoidx = args.val; // 外部変数のINDEX
    wasyoendt = wasyotime+5; // 約５秒表示する
     // 外に伝える
    $gameVariables.setValue(wasyoidx,0);
    // 絵を追加
    addPicFunc();
    // カウントダウン
    wwwttt = 0;
    countDownText();
  });

  /* FUNC2 */
  PluginManager.registerCommand(modname, "wasyo2", args => {
    //console.log("wasyoPL.wasyo2. "); // Too much logging

    if(wasyoendt <= wasyotime){
      // 外に伝える
      $gameVariables.setValue(wasyoidx,1);
      // 絵を削除（２個分）
      SceneManager._scene.removeChildAt(wasyoremoveidx);
      SceneManager._scene.removeChildAt(wasyoremoveidx);
      return;
    }
    // カウントダウン
    countDownText();
  });

//=== UTIL FUNC ========================
  // Add Pictuire in Canvas
  function addPicFunc(){
    var bitmap = ImageManager.loadBitmap('img/pictures/','Actor1_2' , 0, true)
    let wasyosprite = new Sprite(bitmap);
    wasyoremoveidx = SceneManager._scene.children.length; // For remove
    console.log("wasyoremoveidx "+[wasyoremoveidx]);
    SceneManager._scene.addChild(wasyosprite);
    wasyosprite.x = 100;
    wasyosprite.y = 100;
    wasyosprite.scale.set(1,1);
  }

  // For CountDown
  function countDownText(){
    if(wwwttt == wasyotime){return;}
    if(wwwttt != 0){
      SceneManager._scene.removeChildAt(wasyoremoveidx+1);
    }
    let bmp = createTextPictureBitmap(wasyotime+"");
    let wpp = new Sprite(bmp);
    wpp.position.set(150,250);
    SceneManager._scene.addChild(wpp);
    wwwttt = wasyotime;
  }

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

  // これはうまく動く
  setInterval(function () {
    wasyotime++; // 毎秒数える
    //console.log("Every 1 Sec. "+wasyotime);
  }, 1000);
})();
