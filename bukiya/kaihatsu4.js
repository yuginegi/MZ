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
    this.kmidwnd = wnd;
    this.parent = wnd.parent;
    this.maindv;
    this.imggg;
    this.cdb = this.parent.cdb;
    // SkillDB
    this.skd = this.parent.chardata.skilldata;
    // メニューテキスト
    this.merchant = new merchantMenu();
  }
  init(pdiv){
    let [maindv,dv,p] = this.kmidwnd.createDIV2(pdiv,this.imgsrc);
    this.maindv = maindv;
    dv.id = "kwnd4base";
    dv.style.position = "relative";
    this.imggg = p;
    this.newwnd4_0(dv);
    return 0;
  }
  initpage(type){
    console.log("kmidwnd0:initpage invoke. "+type);
    if(type==0){return;}
    let num = this.parent.imgchange(this);
    this.updblock(num);
    //Reset
    this.resetpage();
  }
  resetpage(){
    this.imggg.classList.add("fadeIn");
    let d = document.getElementById("kwnd4base");
    //d.style.display = "block";
    d.classList.remove("kwnd2u1");
    this.selected = null;
    removeAllChildsByID("kwnd4base3");
    this.updatelist(document.getElementById("kwnd4_list"));
    this.ecan.txtlist = null;
    this.ecan.can.style.left = "500px";
    this.ecan.redraw();
    // 説明表示変える
    this.parent.switchexp("mid2");
  }
  updatelist(dv){
    removeAllChilds(dv);
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
  newwnd4_0(dv){
    // 領域
    let dd = generateElement(dv,{type:"div",id:"kwnd4_list",style:{
      padding:"10px"}})
    this.updatelist(dd);
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
    // 選択コマンド
    let list2 = this.gentable(dv,"ktbl4_2",2,2);
    this.setblock(list2);
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
        //DBG//console.log("txt[i]:"+[i,txt[i]]);
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
  newwnd_par(i,t){
    let bcl = ["#008","#444"]; 
    return {
      type:"div",classList_add:"kwnd2u2",id:"kwnd4base3m_"+i,style:{
        "animation-duration":((1*i+5)/10)+"s",padding:"5px 5px 0px 40px","z-index":15,
        position:"absolute",left:"400px",top:90+80*i+"px",width:"200px",height:"40px",background:bcl[t]
      }
    };
  }
  newwnd(){
    //this.maindv
    let base = document.getElementById("kwnd4base3");
    console.log("newwnd:"+this.charatarget);
    let mmtxt = this.setMtxt(this.charatarget);
    console.log(mmtxt.length,mmtxt);
    /*if(mmtxt.length == 0){
      let i = 0;
      let p = generateElement(base,this.newwnd_par(i,1));
      let tar = this.parent.geneStrImg(null,"メニューなし");
      p.append(tar);
    }*/
    menuFunc({
      base:base,menu:mmtxt,divid:"kwnd4base3m_",
      strid:"kwnd4txt",lt:[400,0,90,80],
      thisbase:this,thisfunc:this.cfunc2,
      parent:this.parent,
    });
    /*
    for(let i=0;i<mmtxt.length;i++){
      let p = generateElement(base,this.newwnd_par(i,0));
      let menu = this.kmidwnd.text8(mmtxt[i]);
      let tar = this.parent.geneStrImg(null,menu);
      tar.tarid = String(i);
      set3func(tar,this,this.cfunc2);
      p.append(tar);
    }*/
    // 戻る を出す
    let tar = this.parent.kmsgwnd;
    tar.BKwnd(this,this.resetpage);
  }
  chgmsg(ii){
    let tar = this.parent.kmsgwnd;
    tar.setText([this.mmtxt[ii]]);
  }

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
  cfunc2(e){
    let p = e.target;
    if(e.type=="click"){
      let ii = p.tarid;
      // menu
      this.getMenu(ii,this.mmtxt[ii]);
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

class merchantView2{
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
    let base = generateElement(dv, {type:"div",id:"kwnd4mm_listdiv",
      style:{position:"relative",width:"100%",height:"160px"}});
    let menutext = ["こめかね","かねこめ"]
    menuFunc({
      base:base,menu:menutext,divid:"kwnd4basekk_",
      strid:"kwnd4txt2",lt:[20,0,10,80],
      thisbase:this,thisfunc:this.cfunc2,
      parent:this.parent,
    });
    /*
    for(let i=0;i<2;i++){
      let bcl = ["#008","#444"]; 
      let par = {
        type:"div",classList_add:"kwnd2u2",id:"kwnd4basekk_"+i,tarid:(i+1),style:{
          "animation-duration":((1*i+5)/10)+"s",padding:"5px 5px 0px 40px","z-index":15,
          position:"absolute",left:"20px",top:10+80*i+"px",width:"200px",height:"40px",background:bcl[0]
        }
      };
      //{type:"div",tarid:(i+1),style:{margin:10,background:"#008"}}
      let tar = generateElement(base,par);
      //set3func(tar,this,this.cfunc);
      base.append(tar);
      let p = this.parent.geneStrImg("kwnd4mm_kk"+i, menutext[i]);
      tar.append(p);
      set3func(p,this,this.cfunc2);      
    }
    */
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

//=====================================================================

class charaStatus{
  constructor(args){
    // Init
    this.cansz = [300,40];
    this.can = generateElement(null,{type:"canvas",id:"anitxt_"+args[2],width:this.cansz[0],height:this.cansz[1],
      style:{position:"absolute",overflow:"hidden",left:args[0]+"px",top:args[1]+"px"}});
    this.ctx = this.can.getContext("2d");
    this.img = new Image();
    // TEXT
    this.txtidx = 0;
    this.val1 = args[2];
    this.val2 = args[3];
    this.txtlist = args[4];
    this.ext = 5;
    // loop
    this.tt = 0;
    //setInterval(this.draw.bind(this),1000/60);
  }
  draw(){
    let tt = (this.tt++)%120;
    if(tt==0){
      let aa = generateTextBmp(this.txtlist);
      this.img.src = aa.context.canvas.toDataURL();
    }
    let [x,y,z] = [20,2,20];
    let [v1,v2] = [this.val1,this.val2];
    let v0 = v1+v2;
    let w0 = ((this.cansz[0]-x)/20)*(v0);
    let ww = (tt > z) ? w0 : w0*(tt/z);
    // draw
    let ctx = this.ctx;
    ctx.clearRect(0,0,this.cansz[0],this.cansz[1]);
    let mg = 5;
    {
      let [a1,a2]=[v1/v0,v2/v0];
      ctx.fillStyle = "#008800C0";
      let w1 = (ww > w0*a1) ? w0*a1 : ww; 
      ctx.fillRect(x,mg,w1,this.cansz[1]-2*mg);
      if(ww > w0*a1){
        let w2 = ww-w0*a1;
        ctx.fillStyle = "#FFFF00C0";
        ctx.fillRect(x+w0*a1,mg,w2,this.cansz[1]-2*mg);
      }
    }
    ctx.drawImage(this.img,x,y);
  }
}

class charaStatusView{
  constructor(parent,tar,cdb,base){
    this.parent = parent;
    this.tar = tar;
    this.cdb = cdb;
    this.base = base;
    this.elist = [];
    this.init();
    // draw update controll.
    setInterval(this.draw.bind(this),1000/60);
  }
  init(){
    let id = this.tar;
    let msts = this.getStatus(id);
    let msts2 = this.getSkillExt(id);
    let menu = (id<10)? ["武力","知力","魅力"] : ["経済","産出","技術"];
    for(let i=0;i<3;i++){
      let mtxt = this.textArrange(5, menu[i],msts[i],msts2[i]);
      this.elist[i] = new charaStatus([350,80+50*i,msts[i],msts2[i],mtxt]);
      this.base.appendChild(this.elist[i].can);
    }
    // 勇者用
    if(id<10){
      this.initBrave(id);
    }
  }
  initBrave(id){
    // 武器防具
    //let bukibougu4 = ["武器LV4","アイスブリンガー","防具LV4","ドラゴンアーマー"]
    let bukibougu4 = this.getWeapon(id);
    for(let i=0;i<4;i++){
      let mtxt = this.parent.geneStrImg(null,bukibougu4[i]);
      mtxt.style.position = "absolute"; 
      mtxt.style.left = (390+(i%2)*120)+"px"; 
      mtxt.style.top  = (320+40*(i>=2))+"px";
      this.base.appendChild(mtxt);
    }

    // ステータス
    let status4 = [
      "兵力　 17000",
      "戦力　 15000",
      "ＡＡ　 15000",
      "ＢＢ　 15000",
    ];
    for(let i=0;i<4;i++){
      //let mtxt = this.textArrange(10,"戦力",15000,0);
      let mtxt = this.parent.geneStrImg(null,status4[i]);
      mtxt.style.position = "absolute"; 
      mtxt.style.left = (370+(i%2)*190)+"px"; 
      mtxt.style.top  = (240+40*(i>=2))+"px";
      this.base.appendChild(mtxt);
    }
  }
  draw(){
    for(let cc of this.elist){
      cc.draw();
    }
  }
  getStatus(id){
    return this.cdb.getStatus(id);
  }
  getSkillExt(id){
    let ulist = this.parent.chardata.skilldata.getulist(id);
    let ret = [0,0,0];
    for(let j=0;j<3;j++){
    for(let i=10*j;i<10*(j+1);i++){
      ret[j] += ulist[i];
    }}
    return ret;
  }
  getWeapon(id){
    let [wep,def] = this.parent.chardata.skilldata.weaponlv[id];
    let wname = ["剣","ロングソード","ミスリルソード","ルーンブレイド","アイスブリンガー","ブレイブカリバー"];
    let dname = ["鎧","ブロンズアーマー","ミスリルアーマー","ゴールドアーマー","ドラゴンアーマー","クリスタルメイル"];
    return ["武器LV"+wep,wname[wep],"防具LV"+def,dname[def]];
  }
  textArrange(n,a,b,c){
    let w1 = toFullWidth(a);
    let w2 = toFullWidth(b);
    let l1 = w1.length;
    let l2 = w2.length;
    let l0 = n - l1 - l2;
    let w0="";
    while(l0-->0){w0 += "　"}
    if(c > 0){
      let w3 = toFullWidth(c);
      return w1+w0+w2+"＋"+w3;
    }else{
      return w1+w0+w2;
    }
  }
}
class skillTree{
  constructor(base,parent,skd,cdb,num){
    this.base = base;
    this.parent = parent;
    this.skd = skd;
    this.cdb = cdb;
    this.num = num;
    // For using MoneyFunc
    this.parent.kjyodata.bindMoneyFunc(this);

    // Init
    let csz = [746,350];
    this.dpar = {type:"div",id:"sktree_main",
    style:{position:"absolute",overflow:"hidden",background:"#000022",
    padding:"0px",margin:"5px","z-index":15,left:"0px",top:"60px",
    width:csz[0]+"px",height:csz[1]+"px"}};
    // INVOKE
    this.can = generateElement(null,this.dpar);
    this.ico = skd.ico;

    // アイコンのキャンバスのサイズ
    this.csize = 40;

    // List
    let id = this.num;
    this.ulist = skd.getulist(id);
    this.slist = skd.getslist(id);
    console.log("skillTree Invoke. "+id);
    console.log("this.ulist: "+this.ulist);
    console.log("this.slist: "+this.slist);

    this.clist = [];
    let sz = this.csize;
    let mm = 10;
    let ofset = [50,80];
    for(let i in this.slist){
      let [x0,y0]=[i%10,Math.floor(i/10)];
      let [xx,yy]=[ofset[0]+x0*(sz+mm),ofset[1]+y0*(sz+mm)];
      let cav = generateElement(this.can,
        {type:"canvas",id:"sktree_"+i,vid:i, width:sz, height:sz,
          style:{position:"absolute",left:xx+"px",top:yy+"px",
          width:sz+"px",height:sz+"px"}
        }
      );
      let ctx = cav.getContext("2d");
      this.clist.push(ctx);
      // Event handler set3func
      set3func(cav,this,this.cfunc);
      // Set 
      this.base.appendChild(this.can);
    }
    this.draw();
    //=== 
    let par = [10,10,this.num];
    console.log("kaihatsu.js:skillTree:",par);
    let e = new charaImg(this.cdb, par);
    this.can.append(e.can);
    //===
    let at = new animationText([80,10,this.num]);
    at.resettext([this.cdb.getName(this.num)]);
    this.can.append(at.can);
    let gindiv = generateElement(this.can, {type:"div", id:"gindiv",
    style:{position:"absolute", left:"400px", top:"10px"}})
    let mn = this.getMoney();
    this.viewMoney(gindiv,mn);
  }
  viewMoney(gindiv,mn){
    gindiv.innerHTML = "";
    let gintxt = this.parent.geneStrImg("gintxt", this.viewSkillCost(mn));
    gindiv.append(gintxt);
  }
  cfunc(e){
    let p = e.target;
    let ii = p.vid;
    if(this.ulist[ii]){
      console.log("skip "+ii);
      return;
    }
    // クリック
    if(e.type=="click"){
      let mn = this.getMoney();
      let mc = this.calcSkillCost();
      if(mn > mc){
        console.log("clicked "+ii+" "+[mn,mc]);
        this.ulist[ii] = 1;
        this.parent.kmsgwnd.setText(["パワーアップ！！"]);
        audioInvoke("Item3");
        this.updMoney(mn-mc);
        let ele = document.getElementById("gindiv");
        this.viewMoney(ele,(mn-mc));
        this.draw();
      }else{
        this.parent.kmsgwnd.setText(["銀が足りない"]);
        audioInvoke("Cancel2");
      }
      return;
    }
    // マウス移動
    if(e.type=="mouseover"){
      this.target = ii;
      // メッセージ変更
      let txtlist = this.skd.skiilmsg;
      let id = this.slist[ii];
      let txt = (txtlist[id]) ? txtlist[id] : "未設定"+id;
      let val = this.calcSkillCost();
      txt += "  "+this.viewSkillCost(val);
      this.parent.kmsgwnd.setText([txt]);
    }else{
      this.target = null;
    }
    this.draw();
  }
  viewSkillCost(val){
    if(val >= 10000){
      return (val/10000)+"億";
    }else{
      return val+"万";
    }
  }
  calcSkillCost(){
    let v = this.ulist.reduce((sum, element) => sum + element, 0);
    let val = 4**(((v+1)/10.0)-1.0) - 4**((v/10.0)-1.0);
    val = Math.floor(val*10000);
    return val;
  }
  drawIcon(kid,ctx,x,y){
    let kkk = this.skd.iconpar;
    let ico = this.ico;
    let sz = 32;
    let [ix,iy]=kkk[kid];
    ctx.drawImage(ico,ix*sz,iy*sz,sz,sz,x,y,sz,sz);
  }
  draw(){
    for(let i in this.slist){
      let kid = this.slist[i];
      let ctx = this.clist[i];
      let csz = this.csize;
      ctx.clearRect(0,0,csz,csz);
      if(this.ulist[i]){
        ctx.fillStyle = "#FFFF0080";
        ctx.fillRect(0,0,csz,csz); 
      }
      else if(i == this.target){
        ctx.fillStyle = "#FF000080";
        ctx.fillRect(0,0,csz,csz);  
      }
      let mg = (csz-32)/2
      this.drawIcon(kid,ctx,mg,mg);
    }
  }
}

class kmidwnd2{
  constructor(wnd){
    this.kmidwnd = wnd;
    this.parent = wnd.parent;
    this.maindv;
    this.imggg;
    this.cdb = this.parent.cdb;
    // SkillDB
    this.skd = this.parent.chardata.skilldata;
    // メニューテキスト
    this.mtxt = ["ステータス","所有スキル","レベルアップ","ヒストリー"];
  }
  init(pdiv){
    let [maindv,dv,p] = this.kmidwnd.createDIV2(pdiv,this.imgsrc);
    this.maindv = maindv;
    dv.id = "kwnd2base"; // For RightMove
    dv.style.position = "relative";
    this.imggg = p;
    this.kaihatsutyu(dv);
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
    let d = document.getElementById("kwnd2base");
    //d.style.display = "block";
    d.classList.remove("kwnd2u1");
    this.selected = null;
    removeAllChildsByID("kwnd2base3");
    this.updatelist(document.getElementById("kwnd2_list"));
    this.ecan.txtlist = null;
    this.ecan.can.style.left = "500px";
    this.ecan.redraw();
    // 説明表示変える
    this.parent.switchexp("mid2");
  }
  updatelist(dv){
    removeAllChilds(dv);
    let p = this.parent.geneStrImg("kwnd2_listxt", "勇者一覧");
    dv.appendChild(p);
    // 勇者・商人一覧
    for(let i of this.parent.chardata.getpcharlist()){
      let par = [10+80*(i%5),60+75*Math.floor(i/5),i];
      let e = new charaImg(this.cdb, par);
      let tar = e.can;
      set3func(tar,this,this.cfunc);
      dv.append(tar);
    }
  }
  kaihatsutyu(dv){
    // キャラリスト
    let dd = generateElement(dv,{type:"div",id:"kwnd2_list",style:{padding:"10px"}});
    this.updatelist(dd);
    // あとでここに入れるよう
    generateElement(this.maindv,{type:"div",id:"kwnd2base3",style:{padding:"10px"}});

    // キャラ名（cfuncで絶対位置移動）
    {
      let p = generateElement(this.maindv,{type:"div",id:"kwnd2base4"});
      this.ecan = new animationText([500,370,0]);
      let e = this.ecan;
      e.txtlist = null;
      e.id = "kwnd2base4txt";
      p.append(e.can);
    }
  }

  viewpage2(){
    let b = removeAllChildsByID("kwnd2base3");
    new skillTree(b,this.parent,this.skd,this.cdb,this.charatarget);
  }

  viewpage0(){
    let b = removeAllChildsByID("kwnd2base3");
    this.stview = new charaStatusView(this.parent,this.charatarget,this.cdb,b);
  }
  // cfuncのclickで呼ばれる
  newwnd(){
    let base = document.getElementById("kwnd2base3");
    // メニューを設置する
    menuFunc({
      base:base,menu:this.mtxt,divid:"kwnd2base3m_",
      strid:"kwnd2txt",lt:[400,0,90,80],
      thisbase:this,thisfunc:this.cfunc2,
      parent:this.parent,
    });
    /*
    for(let i=0;i<this.mtxt.length;i++){
      let p = generateElement(base,{type:"div",classList_add:"kwnd2u2",id:"kwnd2base3m_"+i,
        style:{"animation-duration":((1*i+5)/10)+"s",padding:"5px 5px 0px 40px","z-index":15,
          position:"absolute",left:"400px",top:90+80*i+"px",width:"200px",height:"40px",background:"#008"}  
        }
      );
      let menu = this.kmidwnd.text8(this.mtxt[i]);
      let tar = this.parent.geneStrImg(null,menu);
      tar.tarid = String(i);
      set3func(tar,this,this.cfunc2);
      p.append(tar);
    }
    */
    // 戻る を出す
    let tar = this.parent.kmsgwnd;
    tar.BKwnd(this,this.resetpage);
  }
  chgmsg(ii){
    let tar = this.parent.kmsgwnd;
    tar.setText([this.mtxt[ii]]);
  }
  cfunc2(e){
    let p = e.target;
    if(e.type=="click"){
      console.log("clicked "+p.tarid);
      // menu
      if(p.tarid==0){
        this.viewpage0();
      }
      if(p.tarid==2){
        this.viewpage2();
      }
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
      let d = document.getElementById("kwnd2base");
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
    }else{
      this.imggg.classList.remove("fadeIn");
    } 
  }
}