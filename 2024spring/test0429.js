
//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc TEST0429
 * @author wasyo
 *
 * @help test0429.js
 *
 * コモンイベントのみんなに捧ぐ
 * 
 * @desc 極限的にシンプルに書く
 * 
 * @command invoke
 * @text シンプル関数
 * @desc
 * ３個変数ください。２，３，４ とか
 * 
 * @arg val1
 * @type number
 * @text 使って良い変数の番号（数字）箱
 * @desc 使って良い変数。入力とヒット数に使う。
 * @arg val2
 * @type number
 * @text 使って良い変数の番号（数字）箱
 * @desc 使って良い変数。ブロウ数に使う。
 * @arg val3
 * @type number
 * @text 使って良い変数の番号（数字）箱
 * @desc 返り値としての箱。
 * 
 */
  
(() => {
'use strict';

// この数字は、各桁が同じではいけない
// ルール → https://qiita.com/otupy/items/9b56b25930ad60815bad
var gval = 429;

// ランダムな３桁を作る
function createVal(){
  //https://zenn.dev/k_kazukiiiiii/articles/cf3256ef6cbd84
  const shuffleArray = (array) => {
    const cloneArray = [...array]

    for (let i = cloneArray.length - 1; i >= 0; i--) {
      let rand = Math.floor(Math.random() * (i + 1))
      // 配列の要素の順番を入れ替える
      let tmpStorage = cloneArray[i]
      cloneArray[i] = cloneArray[rand]
      cloneArray[rand] = tmpStorage
    }

    return cloneArray
  }
  let arr = shuffleArray([1,2,3,4,5,6,7,8,9]);
  let v = arr[0]*100+arr[1]*10+arr[2];
  console.log("SET gval",v); // F12で答え見て良い
  return v;
}

// 数字を配列にする関数
function val2arr(v){
  let arr = [];
  arr[0] = Math.floor(v/100);
  arr[1] = (Math.floor(v/10))%10;
  arr[2] = v%10;
  return arr;
}

// コードブレーカーのロジック（もっとうまくつくれそう）
function codebreakerlogic(inp,goal){
  // 入力数字を配列で
  let a0 = val2arr(inp);
  // [エラー処理] ０をふくんでいたら
  if(a0.includes(0)){
    return [-1,-1];
  }
  // 正解の数字を配列で
  let aa = val2arr(goal);
  // ヒットの数を数える
  let hnum = 0
  // ブロウの数を数える
  let bnum = 0
  // 正解３つに対する判定をflagで
  for(let j=0;j<3;j++){
    let flag=0;
    // 入力の数字と比べる
    for(let i=0;i<3;i++){
      if(a0[i]==aa[j]){
        if(i==j){
          flag=2;// ヒット
          break; // もう探さなくてよい
        }else{
          flag=1;// ブロウにしておく
        }
      }
    }
    if(flag==2){hnum++;}
    if(flag==1){bnum++;}
  }
  return [hnum,bnum];
}

function testfunc(args){
  console.log("args",args);
  let i1 = args.val1; // 使って良い変数の番号（数字）
  let i2 = args.val2; // 使って良い変数の番号（数字）
  let i3 = args.val3; // 使って良い変数の番号（数字）
  // 箱から数字をとる
  let v0 = $gameVariables.value(i1);

  let [hnum,bnum] = codebreakerlogic(v0,gval);
  // 出力
  $gameVariables.setValue(i1, hnum);
  $gameVariables.setValue(i2, bnum);
  let txt = "まだまだだな、あけちきゅん";
  $gameVariables.setValue(i3, txt);
  if(hnum==3){
    // 正解を再作成
    gval = createVal();
  }
}

var current = document.currentScript.src;
let matchs = current.match(/([^/]*)\.js/);
let modname = matchs.pop();
/* PluginManager.registerCommand： 第１引数 は ファイル名！！ */
/* FUNC0 */
PluginManager.registerCommand(modname, "invoke", args => {
    testfunc(args);
});
})();
  
