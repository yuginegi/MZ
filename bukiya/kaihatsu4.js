//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンド パート４
 * @author wasyo
 *
 * @help kaihatsu4.js
 *
 * 商人の最終章コマンド。開発など
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

class kmidwnd4{
  constructor(wnd){
    this.kmidwnd = wnd;
    this.parent = wnd.parent;
    this.maindv;
    this.imggg;
  }
  init(pdiv){
    this.maindv = this.kmidwnd.createDIV(pdiv);
    this.kaihatsutyu();
    return 0;
  }
  initpage(type){
    console.log("kmidwnd0:initpage invoke. "+type);
    if(type==0){return;}
    this.parent.imgchange(this);
  }
  kaihatsutyu(){
    let pdiv = this.maindv;
    let parent = this.parent;
    let dvlist = [];
    {
      let childWidth = ["400px","320px"];
      let childPadng = ["0px","5px"];
      for(let i=0;i<childWidth.length;i++){
        let dv = generateElement(pdiv,{type:"div",style:{
          width:childWidth[i],padding:childPadng[i],overflow:"hidden"
        }})
        dvlist.push(dv);
      }
    }
    // 領域
    {
      let dv = dvlist[0];
      let txt = ["","　　開発中　　",""]
      for(let i=0;i<3;i++){
        let p = parent.geneStrImg("kwnd0", txt[i]);
        dv.appendChild(p);
        dv.appendChild(document.createElement("BR"));
      }
    }

    // 画像の表示領域
    {
      let dv = dvlist[1];
      let p = parent.geneTagImg("kaihatsuchara",this.imgsrc);
      p.classList.add("CharaShadow");
      dv.appendChild(p);
      this.imggg = p;
    }
  }
}

//=====================================================================
