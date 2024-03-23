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

class kmidwnd4_old{
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

class merchantMenu{
  constructor(){
    //最大6文字
    this.defaultMenu = ["商メニュー１","商メニュー２","商メニュー３","＞６文字制約"];
    this.mermenu ={
      10:["糧の売却","糧の購入","素材の換金","地域間貿易"],
      11:["武器の開発"],
      12:["防具の開発"],
      13:["魔法の開発"],
      15:["技術の開発"],
      16:["光生成"],
      17:["付加価値"],
      18:["闇生成"],
      //19:["神速の布陣"],
    }
  }
  getMenu(id){
    let h = this.mermenu[id];
    return (h&&h.length > 0)? h : this.defaultMenu;
  }
}

class kmidwnd4{
  constructor(wnd){
    this.kmidwnd = wnd;
    this.parent = wnd.parent;
    this.maindv;
    this.imggg;
    // CharaDB
    this.cdb = new charaDB();
    // SkillDB
    this.skd = this.parent.chardata.skilldata;
    // メニューテキスト
    this.merchant = new merchantMenu();
  }
  init(pdiv){
    this.maindv = this.kmidwnd.createDIV(pdiv);
    this.newwnd4_0();
    return 0;
  }
  initpage(type){
    console.log("kmidwnd0:initpage invoke. "+type);
    if(type==0){return;}
    this.parent.imgchange(this);
    //Reset
    this.resetpage();
  }
  resetpage(){
    this.imggg.classList.add("fadeIn");
    let d = document.getElementById("kwnd4base");
    //d.style.display = "block";
    d.classList.remove("kwnd2u1");
    this.selected = null;
    let b = document.getElementById("kwnd4base3");
    while( b && b.firstChild ){
      b.removeChild( b.firstChild );
    }
    this.updatelist(document.getElementById("kwnd4_list"));
    this.ecan.txtlist = null;
    this.ecan.can.style.left = "500px";
    this.ecan.redraw();
    // 説明表示変える
    this.parent.switchexp("mid2");
  }
  updatelist(dv){
    while( dv && dv.firstChild ){
      dv.removeChild( dv.firstChild );
    }
    let p = this.parent.geneStrImg("kwnd4_listxt", "商人一覧");
    dv.appendChild(p);
    // 商人一覧
    for(let i of this.parent.chardata.getpcharlist(10)){
      let par = [10+80*(i%5),60+75*Math.floor((i-10)/5),i];
      let e = new charaImg(this.cdb, par);
      let tar = e.can;
      set3func(tar,this,this.cfunc);
      dv.append(tar);
    }
  }
  newwnd4_0(){
    let pdiv = this.maindv;
    let parent = this.parent;
    let dvlist = [];
    {
      let childWidth = ["400px","320px"];
      let childPadng = ["0px","5px"];
      for(let i=0;i<childWidth.length;i++){
        let dv = generateElement(pdiv,{type:"div",style:{
          width:childWidth[i],padding:childPadng[i],overflow:"hidden",position:"relative"
        }})
        dvlist.push(dv);
      }
    }
    // 領域
    {
      let dv = dvlist[0];
      dv.id = "kwnd4base";
      let dd = generateElement(dv,{type:"div",id:"kwnd4_list",style:{padding:"10px"}})
      this.updatelist(dd);
    }

    // 画像の表示領域
    {
      let dv = dvlist[1];
      let p = parent.geneTagImg("kaihatsuchara",this.imgsrc);
      p.classList.add("CharaShadow");
      dv.appendChild(p);
      this.imggg = p;
    }
    // 選択コマンド
    let list2 = this.gentable(dvlist[0],"ktbl4_2",2,2);
    this.setblock(list2);

    // キャラステータス
    generateElement(this.maindv,{type:"div",id:"kwnd4base3",style:{padding:"10px"}});

    // キャラ名
    {
      let p = generateElement(this.maindv,{type:"div",id:"kwnd4base4"});
      this.ecan = new animationText([500,370,0]);
      let e = this.ecan;
      e.txtlist = null;
      e.id = "kwnd4base4txt";
      p.append(e.can);
    }
  }
  setMtxt(id){
    this.mmtxt = this.merchant.getMenu(id);
    return this.mmtxt;
  }
  updblock(id){
    //DBG//console.log("id:"+id);
    let txt = this.merchant.getMenu(id);
    //DBG//console.log("txt:"+[txt.length,txt]);
    let n = 4;
    for(let i=0;i<n;i++){
      let id = "kmidwnd4m_btn"+(i+1);
      let dbtn = document.getElementById(id);
      //DBG//console.log("dbtn-1:"+dbtn.innerHTML);
      dbtn.innerHTML="";
      //DBG//console.log("dbtn-2:"+dbtn.innerHTML);
      if(i < txt.length){
        console.log("txt[i]:"+[i,txt[i]]);
        let timg = this.parent.geneStrImg("k4mn_"+(i+1),txt[i]);//104(=26x4)x36
        dbtn.appendChild(timg);
        dbtn.appendChild(document.createElement("BR"));
      }
      //DBG//console.log("dbtn-3:"+dbtn.innerHTML);
    }
  }
  setblock(list){
    // ボタン
    let n = 4;
    for(let i=0;i<n;i++){
      let dbtn = generateElement(list[i], {type:"div",id:"kmidwnd4m_btn"+(i+1),style:{
        //margin:"10px 15px",padding:"10px 30px",
        margin:"2px 5px",padding:"2px 10px",
        width:"104px",height:"36px",background:"#000"
      }});
      /*
      let timg = this.parent.geneStrImg("k4mn_"+(i+1),"XXX");//104(=26x4)x36
      dbtn.appendChild(timg);
      dbtn.appendChild(document.createElement("BR"));
      */
    }
  }
  gentable(pdiv,prefix,nr,nc){
    let list = [];
    const tbltxtdiv = generateElement(pdiv,{type:"div",style:{width:"100%",
    position:"absolute",top:"200px"
    }});
    let timg = this.parent.geneStrImg("k4mn_tblexp","商人開発メニュー");
    tbltxtdiv.appendChild(timg);
    // テーブル
    const tbl = generateElement(pdiv,{type:"table",style:{width:"100%",
    position:"absolute",top:"240px"
    }});
    const tblBody = generateElement(tbl,{type:"tbody"});
    for(let i1=0;i1<nr;i1++){
      const row = document.createElement("tr");
      tblBody.appendChild(row);
      for(let i2=0;i2<nc;i2++){
        const cell = generateElement(row, {type:"td",id:prefix+"_"+i1+"_"+i2,
          style:{width:(100/nc)+"%",textAlign:'center'}});
        list.push(cell);
      }
    }
    return list;
  }
  newwnd(){
    //this.maindv
    let base = document.getElementById("kwnd4base3");
    console.log("newwnd:"+this.charatarget);
    let mmtxt = this.setMtxt(this.charatarget);
    for(let i=0;i<mmtxt.length;i++){
      let p = generateElement(base,{type:"div",classList_add:"kwnd2u2",id:"kwnd4base3m_"+i,
        style:{"animation-duration":((1*i+5)/10)+"s",padding:"5px 5px 0px 40px","z-index":15,
          position:"absolute",left:"400px",top:90+80*i+"px",width:"200px",height:"40px",background:"#008"}  
        }
      );
      let menu = this.text8(mmtxt[i]);
      let tar = this.parent.geneStrImg(null,menu);
      tar.tarid = String(i);
      set3func(tar,this,this.cfunc2);
      p.append(tar);
    }
    // 戻る を出す
    let tar = this.parent.kmsgwnd;
    tar.BKwnd(this,this.resetpage);
  }
  text8(a){
    let l1 = a.length;
    let l0 = 7 - l1;
    let w0=a;
    while(l0-->0){w0 += "　"}
    return w0;
  }
  chgmsg(ii){
    let tar = this.parent.kmsgwnd;
    tar.setText([this.mmtxt[ii]]);
  }
  cfunc2(e){
    let p = e.target;
    if(e.type=="click"){
      console.log("clicked "+p.tarid);
      // menu
      return;
    }
    if(e.type=="mouseover"){
      p.parentNode.style.background="#00F";
      this.chgmsg(p.tarid);
    }else{
      p.parentNode.style.background="#008";
    } 
  }
  cfunc(e){
    let p = e.target;
    if(e.type=="click"){
      let num = p.id.match(/\d+/g)[0];
      this.charatarget = num;
      this.selected = p;
      this.imggg.classList.remove("fadeIn");
      console.log("clicked");
      let d = document.getElementById("kwnd4base");
      //d.style.display = "none";
      d.classList.add("kwnd2u1");
      this.newwnd();
      this.ecan.can.style.left = "50px";
      this.ecan.redraw();
      return;
    }
    if(this.selected){return;}
    if(e.type=="mouseover"){
      let num = p.id.match(/\d+/g)[0];
      this.imggg.src = 'img/pictures/'+this.cdb.getPict(num)+'.png';
      this.imggg.classList.add("fadeIn");
      this.ecan.resettext([this.cdb.getName(num)]);
      audioInvoke("Book1");
      this.updblock(num);
    }else{
      this.imggg.classList.remove("fadeIn");
    } 
  }
}

//=====================================================================
