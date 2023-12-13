//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc プラグインを頑張ります２
 * @author wasyo
 *
 * @help wasyo3.js
 *
 * HTMLのメニュー
 *
 */

/* うごかない */

(() => {
  'use strict';
  class wasyo3class{
    constructor(){
      this.name = "wasyo3class";
      this.mode = 0;
      this.menFunc = TouchInput.update; // 確保する。関数定義を持ってきた方が良いかもだが・・・
      this.mdsFunc = function() {}; // 無効化の書き方
      this.init();
      this.dflag = false;
    }
    init(){
      this.initCanvas();
      this.initCanvas2();
    }
    show(inp){
      let p = document.getElementById("aaa");
      p.style.display = (inp==0)? "none":"block";
      console.log("this.menFunc: "+this.menFunc);
      console.log(TouchInput.update);
      this.initdatashow();
      /*
      if(inp==0 && this.menFunc){
        TouchInput.update = this.menFunc;
      }else{
        TouchInput.update = this.mdsFunc;
      }*/
    }
    initCanvas(){
      let [gcw,gch] = [window.innerWidth,window.innerHeight];
      console.log([gcw,gch]);
      let [pad,mgn] = [10,50];
      let [x,y,w,h] = [mgn,mgn,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      let p = document.createElement("div");
      p.id = "aaa";
      p.style.position = "absolute";
      p.style.display = "none";
      p.style.backgroundColor = "#000";
      p.style.color = "#FFF";
      p.style.left = x+'px';
      p.style.top = y+'px';
      p.style.width = w+'px';
      p.style.height = h+'px';
      p.style.zIndex = 4; // gameCanvas は 1 , Video が ２ 
      p.style.padding = pad+'px';
      document.body.appendChild(p);
      if(0){//無効
        let b = document.createElement("button");
        b.addEventListener('click', this.clickfunc.bind(this));
        b.textContent = "クリックして閉じる";
        p.appendChild(b);
      }
    }
    initCanvas2(){
      let [gcw,gch] = [window.innerWidth,window.innerHeight];
      console.log([gcw,gch]);
      let [pad,mgn] = [0,0];
      let [x,y,w,h] = [mgn,mgn,50,25];
      let p = document.createElement("div");
      p.id = "bbb";
      p.style.position = "absolute";
      p.style.backgroundColor = "#00F";
      p.style.color = "#FFF";
      p.style.left = x+'px';
      p.style.top = y+'px';
      p.style.width = w+'px';
      p.style.height = h+'px';
      p.style.zIndex = 3; // gameCanvas は 1 , Video が ２ 
      p.style.padding = pad+'px';
      p.textContent = "menu";
      p.addEventListener('click', this.clickfunc.bind(this));
      p.addEventListener('mouseover', this.mover.bind(this));
      p.addEventListener('mouseleave', this.mleave.bind(this));
      document.body.appendChild(p);
    }

    //＝＝＝ マウスイベント ＝＝＝
    mover2(e){
      e.stopPropagation();
      this.switch(e.target);
    }
    mover(e){
      //DBG//console.log("mover:"+e);
      e.stopPropagation();
      TouchInput.update = this.mdsFunc;
      document.getElementById("bbb").style.backgroundColor = "#F0F";
    }
    mleave(e){
      //DBG//console.log("mleave:"+e);
      e.stopPropagation();
      TouchInput.update = (this.mode==0) ? this.menFunc : this.mdsFunc;
      document.getElementById("bbb").style.backgroundColor = "#00F";
    }
    clickfunc(e){
      //DBG//console.log(e);
      e.stopPropagation();
      this.mode = 1- this.mode;
      console.log("clickfunc"+this.mode);
      this.show(this.mode);
    }

    initdatashow_old(){
      if(this.dflag){return;}
      this.dflag = true;
      //＝＝＝
      let d = document.getElementById("aaa");
      let gp = $gameParty.battleMembers(); // 配列
      for(let cc of gp){
        let act = $dataActors[cc._actorId];
        let cls = $dataClasses[cc._classId];
        console.log(cc);
        console.log(act);
        console.log(cls);
        let out = cc["_name"] + " " + cls.name;
        let ks = ["_level","_hp","mhp"];
        for(let k of ks){
          out = out + " " + cc[k];
        }
        let p = document.createElement("p");
        p.textContent = out;
        p.id = cc._battlerName;
        p.addEventListener('mouseover', this.mover2.bind(this));
        d.appendChild(p);
      }
      {
        let dv = document.createElement("div");
        dv.width = "100%";
        dv.style = "text-align: right";
        d.appendChild(dv);
        let p = document.createElement("img");
        p.id = "imggg";
        p.src = 'img/pictures/Actor1_2.png';
        dv.appendChild(p);
      }
    }
    initdatashow(){
      if(this.dflag){return;}
      this.dflag = true;
      //＝＝＝
      let d = document.getElementById("aaa");

      const tbl = document.createElement("table");
      tbl.style.width ="100%";
      const tblBody = document.createElement("tbody");
      const row = document.createElement("tr");
      tblBody.appendChild(row);
      tbl.appendChild(tblBody);
      d.appendChild(tbl);
      let gp = $gameParty.battleMembers(); // 配列
      for (let cc of gp) {
        // <td> 要素とテキストノードを作成し、テキストノードを
        // <td> の内容として、その <td> を表の行の末尾に追加
        const cell = document.createElement("td");
        cell.style.width =(100/gp.length)+"%";
        let p = document.createElement("img");
        p.src = this.getImgSrcFromTEXT(cc["_name"]);
        p.id = cc._battlerName;
        p.addEventListener('mouseover', this.mover2.bind(this));
        cell.appendChild(p);
        row.appendChild(cell);
      }

      //パーティション
      let ppp = document.createElement("div");
      d.appendChild(ppp);
      ppp.style.height = "100px";

      //キャラ表示領域
      let parent = document.createElement("div");
      d.appendChild(parent);
      parent.style.display = "flex";
      {
        let dv = document.createElement("div");
        dv.style.width = "400px";
        parent.appendChild(dv);
        let defos =["キャラ名","　レベル","　ＨＰ　"];
        for(let i=0;i<defos.length;i++){
          let p = this.starea("st"+(i+1), defos[i]);
          dv.appendChild(p);
          dv.appendChild(document.createElement("BR"));
        }
      }
      // 画像の表示領域
      {
        let dv = document.createElement("div");
        parent.appendChild(dv);
        let p = document.createElement("img");
        p.id = "imggg";
        p.src = 'img/pictures/Actor1_2.png';
        dv.appendChild(p);
      }
    }
    starea(sid,defo){
      let p = document.createElement("img");
      p.id = sid;
      let aa = createTextPictureBitmap(defo);
      p.src = aa.context.canvas.toDataURL();
      return p;
    }

    // 文字説明を変更
    switchexp(tar){
      let gp = $gameParty.battleMembers();
      let aid = 0;
      let n = gp.length;
      for(let i=0;i<n;i++){
        //console.log("switchexp:"+[gp[i]._battlerName,tar.id,gp[i]._name]);
        if(gp[i]._battlerName == tar.id){
          aid = i;
          break;
        }
      }
      let cc = gp[aid];
      let defos =["キャラ名","　レベル","　ＨＰ　"];
      let vals = [cc._name,cc._level,cc._hp+"/"+cc.mhp];
      for(let i=0;i<defos.length;i++){
        let p = document.getElementById("st"+(i+1));
        let txt = defos[i]+ " : "+vals[i];
        p.src = this.getImgSrcFromTEXT(txt);
      }
    }
    // Picture Areaを変更
    switchpic(tar){
      console.log(tar.id);
      let p = document.getElementById("imggg");
      p.src = 'img/pictures/'+tar.id+'.png';
    }
    switch(tar){
      this.switchpic(tar);
      this.switchexp(tar);
    }
    // For Image.src
    getImgSrcFromTEXT(txt){
      // ＝＝＝ 参考になった素晴らしいページ ＝＝＝
      // https://www.programmingmat.jp/webhtml_lab/canvas_image.html
      // http://tonbi.jp/Game/RPGMakerMV/009/
      let aa = createTextPictureBitmap(txt);
      return aa.context.canvas.toDataURL();
    }
  }
  let wasyo = new wasyo3class();

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

})();
