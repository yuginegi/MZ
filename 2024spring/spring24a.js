//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc てすと
 * @author wasyo
 *
 * @help spring24a.js
 *
 * HTMLのメニュー
 * 
 */

(() => {
  'use strict';

  // CSSLoading
  (function(d){
/* 
    // CSSファイルを読み込むときはこう 
    console.log(">> CSS Loading.");
    var head = d.getElementsByTagName('head')[0];
    var link = d.createElement('link');
    link.setAttribute('rel','stylesheet');
    link.setAttribute('type','text/css');
    link.setAttribute('href','css/wasyo.css');
    head.appendChild(link);
    console.log("<< CSS Loading.");
*/
    // DOMを挿し込むときはこう 
    console.log(">> HTML Insert");
    let dv = document.createElement("div");
    dv.id = "MZdiv";
    dv.style.width = "200px";
    dv.style.height = "50px";
    dv.style.padding = "10px 50px";
    dv.style.backgroundColor = "#00FFFF";
    // dv.style.z-index は書けない。ハイフンがあるので。(引き算だと思ってしまう)
    dv.style["z-index"] = 10;
    dv.style.position = "absolute"; //
    dv.innerHTML = "<P>HELLO WORLD!!</P>";
    document.body.appendChild(dv);
    console.log("<< HTML Insert");
  })(document);

})();
