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

class merchantMenu{
  constructor(){
    //最大6文字
    this.defaultMenu = ["メニューなし"];//["商メニュー１","商メニュー２","商メニュー３","＞６文字制約"];
    this.mermenu ={
      10:["兵士の回復","糧食の売買","素材の換金","地域間貿易"],
      11:["武器の開発"],
      12:["防具の開発"],
      13:["魔法の開発"],
      15:["技術の開発"],
      16:["光生成"],
      17:["付加価値"],
      18:["闇生成"],
      //19:["神速の布陣"],
    }
    this.mmst = null;
    // 最初のスキル（０にするとメニューなし）
    this.mmstInit =[2,1,1,1,1,1,1,1,1,1];
    this.merchantID = 17;
  }
  Initialize(){
    if(this.mmst){return;}
    let hh = $gameVariables.value(this.merchantID);
    if(!hh){hh = {};}
    if(!hh["mmst"]){hh["mmst"] = this.mmstInit;}
    $gameVariables.setValue(this.merchantID, hh);
    this.mmst = hh["mmst"];
  }
  getMenu(id){
    this.Initialize();
    let h = this.mermenu[id];
    let n = this.mmst[id-10];
    console.log(h,n);
    return (h&&n)? h.slice(0,n) : [];
  }
  setMenu(id,ii){
    this.Initialize();
    this.mmst[id-10] = ii;
  }
}

class kmidwnd4{
  constructor(wnd){
    this.wnd2core = new kmidwnd2core(this,wnd,kmidwnd4coreFunc);
    this.kmidwnd = wnd;
    this.maindv; // switchPage で必要
    this.imggg;  // switchPage で必要
  }
  // InterFaceはどうせこの２つ
  init(pdiv){
    let [maindv,dv,p] = this.kmidwnd.createDIV2(pdiv,this.imgsrc);
    this.maindv = maindv;
    this.imggg = p;
    this.wnd2core.init(maindv,dv,p);
  }
  initpage(type){
    this.wnd2core.initpage(type);
  }
}

class kmidwnd4coreFunc{
  constructor(p){
    this.pclass = p;
    p.kbid = "kwnd4base";
    p.mainid = "kwnd4base3";
    p.listid = "kwnd4_list";
    // メニューテキスト用のクラス
    this.merchant = new merchantMenu();
    // Style
    p.menupar = {
      divid:p.mainid+"m_",strid:"kwnd4txt",lt:[400,0,90,80],
      thisbase:p,thisfunc:p.cfunc2,parent:p.parent,
    }

    this.parent = p.parent;
    this.cdb = p.cdb;
  }
  getUpdatelist(){
    let list = this.parent.chardata.getpcharlist(10);
    return ["kwnd4_listxt", "商人一覧",list,60-150]
  }
  //＝＝＝ ４の特別。下に文字のテーブルを出す ＝＝＝
  mainfuncex(dv){
    let list2 = this.gentable(dv,"ktbl4_2",2,2);
    this.setblock(list2);
  }
  setMtxt(id){
    this.mmtxt = this.merchant.getMenu(id);
    return this.mmtxt;
  }
  updblock(id){
    let txt = this.merchant.getMenu(id);
    console.log("updblock",id,txt)
    let n = 4;
    for(let i=0;i<n;i++){
      let id = "kmidwnd4m_btn"+(i+1);
      let dbtn = document.getElementById(id);
      dbtn.innerHTML="";
      if(i < txt.length){
        let timg = this.parent.geneStrImg("k4mn_"+(i+1),txt[i]);//104(=26x4)x36
        dbtn.appendChild(timg);
        dbtn.appendChild(document.createElement("BR"));
      }
    }
  }
  setblock(list){
    // ボタン
    let n = 4;
    for(let i=0;i<n;i++){
      let dbtn = generateElement(list[i], {type:"div",id:"kmidwnd4m_btn"+(i+1),style:{
        margin:"2px 5px",padding:"2px 10px",
        width:"104px",height:"36px",background:"#000"
      }});
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
  //＝＝＝ 個別 ＝＝＝
  viewpage0(type){
    let b = removeAllChildsByID("kwnd4base3");
    this.stview = new merchantView(this.parent,this.charatarget,this.cdb,b,type);
  }
  viewpage1(type){
    let b = removeAllChildsByID("kwnd4base3");
    this.stview = new merchantView2(this.parent,this.charatarget,this.cdb,b,type);
  }
  getMenu(ii,str){
    console.log("clicked "+[ii,str]);
    if(str=="武器の開発"){
      this.viewpage0(0);
    }
    else if(str=="防具の開発"){
      this.viewpage0(1);
    }
    else if(str=="兵士の回復"){
      this.viewpage0(2);
    }
    else if(str=="糧食の売買"){
      this.viewpage1(0);
    }
  }
  cfunc2click(p,target){
    let ii = p.tarid;
    this.getMenu(ii,this.mmtxt[ii]);
  }
}

// メンバーを開くタイプのコマンド
class merchantView{
  constructor(parent,tar,cdb,base,type){
    this.parent = parent;
    this.tar = tar;
    this.cdb = cdb;
    this.skd = this.parent.chardata.skilldata;
    this.base = base;
    this.type = type;
    this.charlist={};
    this.init(type);
  }
  init(type){
    let tp = {
      0:{type:"武器開発",wlv:"武器レベル"},
      1:{type:"防具開発",wlv:"防具レベル"},
      2:{type:"兵士回復",wlv:"兵士の数"},
    }
    this.tp = tp[type];
    this.addSelectMember(this.base);
    this.reset(this.parent.kmsgwnd);
  }
  // メンバーを開くタイプのコマンド
  addSelectMember(dv){
    removeAllChilds(dv);
    let txt = [this.tp.type,"メンバーを選んでください"];
    for(let i=0;i<txt.length;i++){
      let p = this.parent.geneStrImg("kwnd4mm_listtxt"+i, txt[i]);
      dv.appendChild(p);
      generateElement(dv, {type:"br"});
    }
    let base = generateElement(dv, {type:"div",id:"kwnd4mm_listdiv",
      style:{position:"relative",width:"100%",height:"160px"}});
      let [xpos,ypos] = [20,20];
    // 勇者一覧
    for(let i of this.parent.chardata.getpcharlist(0,10)){
      let par = [xpos+70*(i%5),ypos+75*Math.floor(i/5),i];
      let e = new charaImg(this.cdb, par);
      this.charlist[e.can.id] = e;
      let tar = e.can;
      set3func(tar,this,this.cfunc);
      base.append(tar);
    }
    //menu
    txt = [this.tp.wlv,""];
    for(let i=0;i<txt.length;i++){
      let p = this.parent.geneStrImg("kwnd4mm_tar"+i, txt[i]);
      p.style.padding = "10px 20px";
      dv.appendChild(p);
    }
  }
  // Reset
  reset(tar){
    this.selected = -1;
    for(let kk in this.charlist){
      let etar = this.charlist[kk];
      etar.setdraw(0);
    }
    tar.bkWnd.style.display = "block";
  }
  // 勇者選択時のクリックイベント
  cfunc(e){
    if(this.selected>=0){return;}
    let etar = this.charlist[e.target.id];
    //let weptype = this.type;//武器
    if(e.type=="click"){
      this.selected = etar.charaid;
      this.cfunclogic(this.parent.kmsgwnd,etar.charaid,this.type);
      return;
    }
    //let flag = 0; // 0:mouseleave
    if(e.type=="mouseover"){
      //flag = 1;
      let [tarr,txt] = this.movertext(etar.charaid,this.type);
      this.parent.kmsgwnd.setText(tarr);
      this.parent.updateStrImg("kwnd4mm_tar1", txt);
    }
    //etar.setdraw(flag);
    etar.setdraw((e.type=="mouseover"));
  }
  // リアクション
  reactmain(tar,rtn,txt){
    tar.setText(txt);
    audioInvoke((rtn)?"Item3":"Cancel2");
    this.reset(tar);
  }
  react2(){
    this.reactmain(this.parent.kmsgwnd,0,["キャンセル"]);
  }
  react1(){
    let [rtn,txt] = this.wepreact(this.selected,this.type);
    this.reactmain(this.parent.kmsgwnd,rtn,txt);
  }
  // CfuncMain
  cfunclogic(tar,id,type){
    if(type == 2){
      this.komerecover(tar,id);
    }else{
      this.wepconfirm(tar,id,type);
    }
  }
  movertext(id,type){
    let [tarr,txt] = ["",""];
    if(type == 2){
      txt = ""+this.cdb.getStatusHP(id);
      console.log("etar.HP:"+txt);
      let kome = this.parent.kjyodata.getFood();
      tarr = ["\\C[1]糧を使って"+this.tp.type+"をします。",this.tp.wlv+"を糧で回復します。","糧："+kome];
    }else{
      let [rtn,clv] = this.weplvcheck(id,type)
      txt = clv + ((rtn) ? "→"+(clv+1) : "");
      tarr = ["\\C[1]銀を使って"+this.tp.type+"をします。",this.tp.wlv+"スキルのレベルアップを","事前にしている必要があります"];
    }
    return [tarr,txt];
  }
  //=== ロジック =======
  wepreact(id,type){
    console.log("wepreact",id,type);
    let [rtn,clv] = this.weplvcheck(id,type);
    let txt = ["失敗した"];
    if(rtn){
      clv = this.weplvup(id,type);
      txt = [this.tp.wlv+"が上がった。\\C[1]"+this.tp.wlv+clv];
    }
    return [rtn,txt];
  }
  weplvup(id,ii){
    this.skd.weaponlv[id][ii] += 1;
    return this.skd.weaponlv[id][ii];
  }
  weplvcheck(id,ii){
    let wlv = this.skd.weaponlv[id][ii];
    let ulv = this.skd.getWeaponSkillLV(id)[ii];
    //console.log("wep:"+[wlv,ulv]);
    return [(wlv < ulv),wlv];
  }
  wepconfirm(tar,id,type){
    let [rtn,clv] = this.weplvcheck(id,type);
    if(rtn){
      tar.setText(["\\C[1]"+this.tp.wlv+"をあげますか？"]);
      tar.bkWnd.style.display = "none";
      tar.YNwnd(this,this.react1,this.react2);
    }else{
      tar.setText(["\\C[2]"+this.tp.wlv+"をあげられない"]);
      this.reset(tar);
    }
    audioInvoke("Cursor3");
  }
  // ロジック 米・回復
  komecalc(id){
    let nhp = this.cdb.getStatusHP(id);
    let mhp = 10000;
    let kome = this.parent.kjyodata.getFood();
    kome -= (mhp-nhp);
    return [kome,mhp,nhp];
  }
  komerecover(tar,id){
    let [kome,mhp,nhp] = this.komecalc(id);
    if(nhp==mhp){
      tar.setText(["兵士は最大"]);
      audioInvoke("Cursor3");
    }else if(kome < 0){
      tar.setText(["\\C[2]糧が足りない"]);
      audioInvoke("Cancel2");
    }else{
      // データの更新
      this.cdb.setStatusHP(id,mhp);
      this.parent.kjyodata.updFood(kome);
      // 表示の更新
      tar.setText(["\\C[1]回復した。\\C[0]糧："+kome+"\\C[2](-"+(mhp-nhp)+")"]);
      audioInvoke("Item3");
      // 表示部も更新
      let txt = "\\C[1]"+mhp;
      this.parent.updateStrImg("kwnd4mm_tar1", txt);
    }
    this.reset(tar);
  }
}

// さらに4択になるコマンド
class merchantView2{
  constructor(parent,tar,cdb,base,type){
    this.parent = parent;
    this.tar = tar;
    this.cdb = cdb;
    this.skd = this.parent.chardata.skilldata;
    this.base = base;
    this.type = type;
    this.charlist={};

    //style
    this.basepar = {type:"div",id:"kwnd4mm_listdiv",
      style:{position:"relative",width:"100%",height:"160px"}
    }
    this.menupar = {
      divid:"kwnd4basekk_",strid:"kwnd4txt2",lt:[20,0,10,80],
      thisbase:this,thisfunc:this.cfunc2,parent:this.parent,
    }

    this.init(type);
  }
  init(type){
    this.addSelectMember(this.base);
    this.reset(this.parent.kmsgwnd);
  }
  addSelectMember(dv){
    removeAllChilds(dv);
    let txt = ["糧を売り買いします"];
    for(let i=0;i<txt.length;i++){
      let p = this.parent.geneStrImg("kwnd4mm_listtxt"+i, txt[i]);
      dv.appendChild(p);
      generateElement(dv, {type:"br"});
    }
    // メニュー表示
    let base = generateElement(dv, this.basepar);
    let menutext = ["こめかね","かねこめ"]
    menuFunc(this.menupar,base,menutext);
    //下の文字
    txt = ["こめうり",""];
    for(let i=0;i<txt.length;i++){
      let p = this.parent.geneStrImg("kwnd4mm_tar"+i, txt[i]);
      p.style.padding = "10px 20px";
      dv.appendChild(p);
    }
  }

  reset(tar){
    this.selected = -1;
    for(let kk in this.charlist){
      let etar = this.charlist[kk];
      etar.setdraw(0);
    }
    tar.bkWnd.style.display = "block";
  }
  reactmain(tar,rtn,txt){
    tar.setText(txt);
    audioInvoke((rtn)?"Item3":"Cancel2");
    this.reset(tar);
  }
  react2(){
    this.reactmain(this.parent.kmsgwnd,0,["キャンセル"]);
  }
  react1(){
    this.reactmain(this.parent.kmsgwnd,0,["YES"]);
  }

  // これが素晴らしい
  cfunc2(e){
    let p = e.target;
    if(e.type=="click"){
      let tarid = p.tarid;
      let kane = this.parent.kjyodata.getMoney();
      let kome = this.parent.kjyodata.getFood();
      return;
    }
    if(e.type=="mouseover"){
      p.parentNode.style.background="#00F";
    }else{
      p.parentNode.style.background="#008";
    } 
  }
  cfunc(e){
    console.log(e.target.type);
    let tarid = e.target.tarid;
    if(!tarid){return};
    let kane = this.parent.kjyodata.getMoney();
    let kome = this.parent.kjyodata.getFood();
    if(e.type=="click"){
      let tar = this.parent.kmsgwnd;
      let rtn = 1;
      if(rtn){
        tar.setText(["\\C[1]をあげますか？"]);
        tar.bkWnd.style.display = "none";
        tar.YNwnd(this,this.react1,this.react2);
      }else{
        tar.setText(["\\C[2]をあげられない"]);
        this.reset(tar);
      }
      audioInvoke("Cursor3");
      return;
    }
    if(this.selected>=0){return;}
    let tar = this.parent.kmsgwnd;
    // マウスオーバー
    if(e.type=="mouseover"){
      let txt = "ｍｍｍ"+tarid;
      this.parent.updateStrImg("kwnd4mm_tar1", txt);
      e.target.style.background = "#00F";
    }
    if(e.type=="mouseleave"){
      e.target.style.background = "#008";
    }
    tar.setText(["\\C[1]糧を使います。","糧："+kome]);
  }
}
