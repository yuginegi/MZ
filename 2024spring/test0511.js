
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
 * @command getHist
 * @text 履歴獲得
 * @desc
 * ５個変数ください。２，３，４，５，６ とか
 * 初回は箱２に０を入れてください。
 * 
 * @arg val1
 * @type number
 * @text 使って良い変数の番号（数字）箱
 * @desc 
 * ここがマイナスになるまで呼び続けてください
 * メッセージが存在しないときはー１を返す
 * @arg val2
 * @type number
 * @text 使って良い変数の番号（数字）箱
 * @desc メッセージ１
 * @arg val3
 * @type number
 * @text 使って良い変数の番号（数字）箱
 * @desc メッセージ２
 * @arg val4
 * @type number
 * @text 使って良い変数の番号（数字）箱
 * @desc メッセージ３
 * @arg val5
 * @type number
 * @text 使って良い変数の番号（数字）箱
 * @desc メッセージ４
 * 
 */
  
(() => {
'use strict';

// この数字は、各桁が同じではいけない
// ルール → https://qiita.com/otupy/items/9b56b25930ad60815bad
var gval = 429;
// 履歴を持つ
var ghistory = [];

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
  ghistory.push([inp,hnum,bnum])
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
    // 履歴を初期化
    ghistory = []
  }
}

function getHist(args){
  console.log("args",args);
  let i1 = Number(args.val1); // 使って良い変数の番号（数字）
  let arr = [args.val2,args.val3,args.val4,args.val5];
  // 履歴
  let n = ghistory.length;
  // 箱から数字をとる
  let v0 = $gameVariables.value(i1);
  //DBG//console.log(n,v0)
  // もうないとき
  if(n <= v0){
    $gameVariables.setValue(i1, -1); // メッセージないときはー１
    console.log("Not value");
    //DBG//for(let i=0;i<4;i++){
    //DBG//  $gameVariables.setValue(arr[i], "　");
    //DBG//}
    return;
  }
  //DBG//$gameVariables.setValue(i1, v0+1);
  //DBG//console.log($gameVariables.value(i1))
  for(let i=0;i<4;i++){
    let ii = v0 + i;
    //DBG//console.log(v0,i,ii)
    if(ii >= n){
      $gameVariables.setValue(arr[i], "　"); // 空にする
      //DBG//console.log(arr[i],$gameVariables.value(arr[i]))
      continue;
    }
    let mm = ghistory[ii];
    //DBG//console.log(ghistory,ii,mm);
    let msg = (ii+1)+"回目　"+mm[0]+"　"+mm[1]+"ヒット "+mm[2]+"ブロウ ";
    $gameVariables.setValue(arr[i], msg); // メッセージを埋める
    $gameVariables.setValue(i1, ii+1); // ここまで見たので更新
    //DBG//console.log(arr[i],msg,i1,ii+1);
  }
  //DBG//console.log($gameVariables.value(i1))
}

var current = document.currentScript.src;
let matchs = current.match(/([^/]*)\.js/);
let modname = matchs.pop();
/* PluginManager.registerCommand： 第１引数 は ファイル名！！ */
/* FUNC0 */
PluginManager.registerCommand(modname, "invoke", args => {
  testfunc(args);
});
/* FUNC1 */
PluginManager.registerCommand(modname, "getHist", args => {
  getHist(args);
});

})();
