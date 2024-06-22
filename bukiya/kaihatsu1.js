//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンド パート１
 * @author wasyo
 *
 * @help kaihatsu1.js
 *
 * 商人の最終章コマンド。ステータス
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

//=====================================================================

class kmidwnd5{
  constructor(wnd){
    this.kmidwnd = wnd;
    this.parent = wnd.parent;
    this.maindv;
    this.imggg;
    this.imgsrc = 'img/pictures/Actor2_1.png';
    this.cdb = this.parent.cdb;
    this.kjyodata = this.parent.kjyodata;
    this.invoke = 0;
    // 関数
    let tar2 = this.parent.chardata;
    this.getpstatus1 = tar2.getpstatusAll.bind(tar2); // 勇者と商人の数を得る
    this.getpcharlist = tar2.getpcharlist.bind(tar2); // キャラの配列をとる
    // 表示項目
    this.nlist =[
      ["勇者","商人","街・拠点","人口","農業","商業","技術","施設"],
      ["ターン","行動力","銀","糧"]
    ];
    // Style
    this.k5notePar = {type:"div",id:"kmidwnd5note",classList_add:"fadeInX1",style:{"z-index":15,
        position:"absolute",left:"5px",top:"375px",width:"720px",height:"160px",
        background:"#008",padding:"10px"}};
  }

  getpstatusX(){
    let p = this.getpstatus1(); // 勇者と商人の数
    let tar = this.kjyodata;
    let n = tar.psname.length;
    for(let i=0;i<n;i++){
      p[tar.psname[i]] = tar.psts[i];
    }
    return p;
  }
  init(pdiv){
    // 初期化処理
    console.log("kmidwnd5 init invoke.");
    let [maindv,dv,p] = this.kmidwnd.createDIV2(pdiv,this.imgsrc);
    this.maindv = maindv;
    this.imggg = p;
    this.menu(dv);
    return 0;
  }
  initpage(){
    console.log("kmidwnd5 initpage invoke.");
    // update
    this.updatemenu();
    // Loop Start
    this.looptime = -2;
    this.noteinfo = 0;
    let tar = document.getElementById("kmidwnd5note");
    if(tar){
      this.maindv.removeChild(tar);
    }
    this.invoke++;
    this.loopfunc(this.invoke);
  }
  notification(tar){
    let list2 = this.parent.gentable(tar,"ktbl2",1,2);
    let ll = this.getpcharlist(0,10); // フラグ立ってる勇者のリスト
    let nn = ll.length;
    let id = (nn+this.noteinfo++)%nn;
    // list2[0]
    let e = new charaFace(this.cdb, [20,20,ll[id]]);
    list2[0].append(e.can);
    list2[0].style.width ="25%";
    // list2[1]
    let par = {type:"div",style:{backgroundColor:"#004",height:"130px",
    padding:"20px 5px 5px 15px"}};
    let dv = generateElement(list2[1],par);
    list2[1].style.width ="75%";
    list2[1].style.textAlign = '';
    // メッセージ
    let t;
    t = this.parent.geneStrImg(null,"現在戦闘中");
    dv.append(t);
    generateElement(dv, {type:"br"});
    t = this.parent.geneStrImg(null,"現在戦闘中");
    dv.append(t);
    generateElement(dv, {type:"br"});
    t = this.parent.geneStrImg(null,"現在戦闘中");
    dv.append(t);
  }
  loopfunc(vvv){
    //DBG//console.log(this.maindv.style.display);
    if(this.maindv.style.display=="none"){return}
    if(vvv != this.invoke){return}
    //DBG//console.log("loopfunc involed.");
    let intval = 500;
    let n=6;
    let lt = this.looptime%n;
    if(lt==0){
      this.k5note = generateElement(this.maindv,this.k5notePar);
      this.notification(this.k5note);
    }
    if(lt==Math.ceil(1000/intval)){
      if(this.k5note){this.k5note.classList.remove("fadeInX1");}
    }
    if(lt==n-2){
      if(this.k5note){this.k5note.classList.add("fadeOutX1");}
    }
    if(lt==n-1){
      if(this.k5note){this.maindv.removeChild(this.k5note);}
    }
    this.looptime++;
    setTimeout(this.loopfunc.bind(this), intval,vvv);
  }
  submenu_org(dv,psts){
    dv.innerHTML = "";
    let parent = this.parent;
    let kwnd = this.kmidwnd;
    let i=1;
    for(let key in psts){
      let str = kwnd.text82(key,psts[key]);
      let p = parent.geneStrImg("st"+(i++), str);
      dv.appendChild(p);
      dv.appendChild(document.createElement("BR"));
    }
  }
  submenu(dv,nlist,psts){
    dv.innerHTML = "";
    let parent = this.parent;
    let kwnd = this.kmidwnd;
    let i=1;
    for(let key of nlist){
      let str = kwnd.text82(key,psts[key]);
      let p = parent.geneStrImg("st"+(i++), str);
      dv.appendChild(p);
      dv.appendChild(document.createElement("BR"));
    }
  }
  updatemenu(){
    //this.submenu(this.dvlist[0],this.getpstatus2());
    //this.submenu(this.dvlist[1],this.getpstatus3());
    let p = this.getpstatusX();
    this.submenu(this.dvlist[0],this.nlist[0],p);
    this.submenu(this.dvlist[1],this.nlist[1],p);
  }
  menu(pdiv){
    pdiv.style.display = "flex";
    this.dvlist = [];
    {
      let childWidth = ["200px","200px"];
      let childPadng = ["4px","4px"];
      for(let i=0;i<childWidth.length;i++){
        let dv = generateElement(pdiv,{type:"div",id:"kmidwnd5_"+(i+1),style:{
          width:childWidth[i],padding:childPadng[i],overflow:"hidden"
        }});
        this.dvlist.push(dv);
      }
    }
    this.updatemenu();
  }
}

// 内政コマンド（完成）
class kmidwnd1{
  constructor(wnd){
    this.kmidwnd = wnd;
    this.parent = wnd.parent;
    this.maindv;
    this.imggg;
    // Role
    this.rolepp ={
      "kaitaku":{t1:2,t2:3,t3:4,a1:100,a2:20,a3:10,maxV:999},
      "kassei":{t1:2,t2:3,t3:5,a1:100,a2:20,a3:10,maxV:999},
      "gijyutu":{t1:2,t2:3,t3:6,a1:100,a2:20,a3:10,maxV:999},
      "koukyou":{t1:2,t2:3,t3:7,a1:100,a2:20,a3:10,maxV:999}
    };
    this.rolevv = {
      "kaitaku":"糧の収穫量が増えます。","kassei":"銀の収穫量が増えます。",
      "gijyutu":"開発に必要な技術力が上がります。","koukyou":"公共施設の開発が可能になります。"
    };
    this.roledata ={
      "kaitaku":{"a1":2,"a2":3,"a3":4},
      "kassei":{"a1":2,"a2":3,"a3":5},
      "gijyutu":{"a1":2,"a2":3,"a3":6},
      "koukyou":{"a1":2,"a2":3,"a3":7}
    }
    this.roletxt = ["農地開拓","商業活性","技術開発","公共工事"];
    this.roleid = ["kaitaku","kassei","gijyutu","koukyou"];
  }
  settxtformat(tar,tp,t=[]){
    let txt;
    switch(tp){
      case "jikkou":
        txt = ["実行しました。\\C[1]"+t[0]+"が"+t[3]+"あがった。",
        "\\C[2]（銀 -"+t[1]+"  行動力 -"+t[2]+"）"];
        break;
      case "jikkouN":
        txt = ["実行を中止しました"];
        break;
      case "tarinai":
        txt = [
          t[3]+"をすると、"+t[0],
          "銀 "+t[1]+" と、行動力 "+t[2]+" を消費します。",
          "\\C[2]資源が足りません。"
        ];
        break;
      case "tariru":
        txt = [
          t[3]+"をすると、\\C[1]"+t[0],
          "\\C[2]銀 "+t[1]+" と、行動力 "+t[2]+" を消費します。",
          "実行しますか？"
        ];
        break;
      case "mijissou":
        txt = ["実行できません。未実装。"];
        break;
    }
    tar.setText(txt);  
  }
  init(pdiv){
    // 城データ
    let tar = this.parent.kjyodata;
    this.psts = tar.psts;
    this.psname = tar.psname;
    // 初期化処理
    let [maindv,dv,p] = this.kmidwnd.createDIV2(pdiv,this.imgsrc);
    this.maindv = maindv;
    this.imggg = p;
    this.kkk(dv);
    return 0;
  }
  initpage(){
    this.targetfunc = "";
    for(let i=0;i<4;i++){
      let b = document.getElementById("kmidwnd_btn"+(i+1));
      b.style.background = "#000";
    }
    this.resetPsts();
  }
  react1(e){
    console.log("click:react1");
    console.log(e);
    this.react(1);
  }
  react2(e){
    console.log("click:react2");
    console.log(e);
    this.react(2);
  }
  react(type){
    this.targetfunc = "";
    this.tarelement.style.background = "#000";
    let tar = this.parent.kmsgwnd;
    if(type==1){
      let arg = this.targetparg;
      //=== 数字の更新 ===
      let val = "";
      //let data =this.roledata;
      //let d = data[arg[0]];
      let d = this.roledata[arg[0]];
      console.log(arg[0]+" enter");
      this.psts[d.a1] -= arg[1];
      this.psts[d.a2] -= arg[2];
      this.psts[d.a3] += arg[3];
      this.updPsts(d.a1,-1);
      this.updPsts(d.a2,-1);
      this.updPsts(d.a3,1);
      val = this.psname[d.a3];
      this.settxtformat(tar,"jikkou",[val,arg[1],arg[2],arg[3]]);
      audioInvoke("Item3");
    }else{
      this.settxtformat(tar,"jikkouN");
      audioInvoke("Cancel2");
    }
  }
  // kaitaku 決め打ち
  kaihatsuFunc(role){
    let val = this.rolevv[role];
    let rtn = 0; // 何もなければ、通る。１以上はエラーと同じ
    let prole = this.rolepp[role];
    let[a1,a2,a3,t1,t2,t3,maxV] = [prole.a1,prole.a2,prole.a3,prole.t1,prole.t2,prole.t3,prole.maxV];
    // 消費量の確認
    if(this.psts[t1] < a1){rtn = 1;}
    if(this.psts[t2] < a2){rtn = 1;}
    // 増加量の確認
    if(this.psts[t3] >= maxV ){rtn = 2;}
    else if(this.psts[t3]+a3 > maxV){a3 = maxV-this.psts[t3];}
    return [rtn,a1,a2,a3,val];
  }
  cfunc(e){
    // すでに選んでいるのを無効化をする
    if(this.targetfunc != ""){
      this.initpage();
    }
    let role = e.target.kaihatsurole;
    console.log("click-cfunc:"+role);
    audioInvoke("Cursor3");
    e.target.parentNode.style.background = "#0C0";
    this.resetPsts();
    if(role=="kaitaku" || role=="kassei" || role=="gijyutu" || role=="koukyou"){
      let tar = this.parent.kmsgwnd;
      let t0 = e.target.kaihatsutext;
      // 実行
      let [rtn,a1,a2,a3,val] = this.kaihatsuFunc(role);
      if(rtn > 0){
        this.settxtformat(tar,"tarinai",[val,a1,a2,t0]);
      }else{
        this.settxtformat(tar,"tariru",[val,a1,a2,t0]);
        // はい・いいえ を出す
        tar.YNwnd(this,this.react1,this.react2);
        // はいの時用にパラメータを積んでおく
        this.targetfunc = role;
        this.targetparg = [role,a1,a2,a3];
        this.tarelement = e.target.parentNode;
      }
    }
    else{
      let tar = this.parent.kmsgwnd;
      this.settxtformat(tar,"mijissou");
      e.target.parentNode.style.background = "#00C";
    }
  }
  hfunc(e){
    // すでに選んでいれば無効
    if(this.targetfunc != ""){return;}
    //HOVER時のコントロール over/leave
    let ii = (e.type=="mouseover") ? 1:0;
    let cl = ["#000","#088"];
    e.target.parentNode.style.background = cl[ii];
    if(ii==1){
      let tar = this.parent.kmsgwnd;
      let t0 = e.target.kaihatsutext;
      let txt = [t0+"をします"];
      tar.setText(txt);
    }
  }
  kkk(dv){
    let pdiv = generateElement(dv,{type:"div",style:{
      overflow:"hidden",height:"185px",backgroundColor:"#000"
    }})
    let pdiv2 = generateElement(dv,{type:"div",style:{
      display:"flex",overflow:"hidden",height:"165px",backgroundColor:"#00FFFF40"
    }})
    // パラメータ
    let list1 = this.gentable(pdiv,"kpsts",4,2);
    this.setPsts(list1);

    // 選択コマンド
    let list2 = this.gentable(pdiv2,"ktbl2",2,2);
    this.setbtn2(list2);
    this.targetfunc = "";
  }
  resetPsts(){
    for(let i=0;i<8;i++){
      this.updPsts(i);
    }
  }
  updPsts(ii,tp=0){
    let txt = this.psname;
    let par = this.psts;
    let ttt = txt[ii]+"　"+par[ii];
    let tid = "kaihatsu_"+(ii+1);
    let e = document.getElementById(tid);
    if(tp<0){ttt = "\\C[2]"+ttt;}
    if(tp>0){ttt = "\\C[1]"+ttt;}
    //DBG//console.log("ttt:"+ttt);
    e.src = this.parent.getImgSrcFromTEXT(ttt);
  }
  setPsts(list){
    let parent = this.parent;
    {
      // ボタン
      let n = 8;
      let txt = this.psname;
      let par = this.psts;
      for(let i=0;i<n;i++){
        let ttt = txt[i]+"　"+par[i];
        let timg = parent.geneStrImg("kaihatsu_"+(i+1),ttt);//104(=26x4)x36
        timg.kaihatsutext = txt[i];
        list[i].appendChild(timg);
      }
    }
  }
  setbtn2(list){
    let parent = this.parent;
    {
      // ボタン
      let n = 4;
      let txt = this.roletxt;
      let role = this.roleid;
      for(let i=0;i<n;i++){
        let dbtn = generateElement(list[i], {type:"div",id:"kmidwnd_btn"+(i+1),style:{
          margin:"10px 15px",padding:"10px 30px",width:"104px",height:"36px",background:"#000"
        }});
        let timg = parent.geneStrImg("kaihatsu_"+(i+1),txt[i]);//104(=26x4)x36
        timg.kaihatsutext = txt[i];
        timg.kaihatsurole = role[i];
        set3func(timg,this,this.cfunc,this.hfunc);
        dbtn.appendChild(timg);
        dbtn.appendChild(document.createElement("BR"));
      }
    }
  }

  gentable(pdiv,prefix,nr,nc){
    let list = [];
    // テーブル
    const tbl = generateElement(pdiv,{type:"table",style:{width:"100%"}});
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
}

class kmidwnd{
  constructor(parent){
    this.parent = parent;
    this.idlist = {"mid1":0,"mid2":1,"mid3":2,"mid4":3,"mid5":4};
    this.divlist = [];
    let clist = [kmidwnd1,kmidwnd2,kmidwnd3,kmidwnd4,kmidwnd5];
    let img = ["People2_4","Actor2_2","Actor1_5","People4_5","Actor2_1"];
    for(let i=0;i<5;i++){
      let c = new clist[i](this);
      c.wndid = i;
      c.imgsrc = 'img/pictures/'+img[i]+'.png';
      this.divlist.push(c);
    }
    this.pretar = "mid5";
  }
  // div領域をもらう
  init(d){
    let pdiv = generateElement(d,{type:"div",style:{overflow:"hidden",width:"736px",height:"350px"}});
    for(let cc of this.divlist){
      cc.init(pdiv);
    }
    console.log("kmidwnd init complete.")
    // 初期ページ
    this.switchPage(this.divlist[4],1);
    return;
  }
  initpage(){
    let id = "mid5";
    let ii = this.idlist[id];
    this.divlist[ii].initpage();
    this.parent.switchexp(id);
  }
  createDIV2(target,imgsrc){
    let par = {type:"div",style:{display:"none",width:"100%",height:"100%",backgroundColor:"#000"}};
    let pdiv = generateElement(target,par);
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

    // 画像の表示領域
    let dv = dvlist[1];
    let p = parent.geneTagImg("kaihatsuchara",imgsrc);
    p.classList.add("CharaShadow");
    dv.appendChild(p);
    //this.imggg = p;
    return [pdiv,dvlist[0],p];
  }
  switchPage(cc,type){
    cc.maindv.style.display = (type==0) ? "none" : "flex";
    //if(cc.initpage){cc.initpage(type);}
    let p = cc.imggg;
    if(type==1){
      p.classList.add("fadeIn");
    }else{
      p.classList.remove("fadeIn");
    }
  }
  switch(tar,type){
    let parent = this.parent;
    // 全部 NONE にする
    for(let cc of this.divlist){
      //cc.switch(0);
      this.switchPage(cc,0);
    }
    // FLEX にする
    let id = this.idlist[tar.id];
    //this.divlist[id].switch(1);
    this.switchPage(this.divlist[id],1);
    // 切り替え時の音を出す
    if(type==1 && (this.pretar != tar.id)){
      let cc = this.divlist[id];
      if(cc.initpage){cc.initpage(type);}
      audioInvoke("Book1");
      this.pretar = tar.id;
      // 文字を切り替える
      parent.switchexp(tar.id);
      // this.switchPageから引っ越し。YES-NOを消す
      parent.kmsgwnd.switchpage();
    }
  }
  text8(a){
    let l1 = a.length;
    let l0 = 7 - l1;
    let w0=a;
    while(l0-->0){w0 += "　"}
    return w0;
  }
  text82(a,b){
    let w1 = toFullWidth(a);
    let w2 = String(b);
    let l1 = w1.length;
    let l2 = w2.length;
    let l0 = 12 - 2*l1 - l2;
    let w0="";
    while(l0-->0){w0 += " "}
    return w1+w0+w2;
  }
  textArrange(a,b,n){
    let w1 = toFullWidth(a);
    let w2 = toFullWidth(b);
    let l1 = w1.length;
    let l2 = w2.length;
    let l0 = n - l1 - l2;
    //console.log("l1,l2:"+[l1,l2]);
    let w0="";
    while(l0-->0){w0 += "　"}
    return w1+w0+w2;
  }
}

class kmenu{
  constructor(parent){
    this.parent = parent;
  }
  // div領域をもらう
  init(d){
    let parent = this.parent;
    // テーブル
    const tbl = generateElement(d,{type:"table",style:{width:"100%"}});
    const tblBody = generateElement(tbl,{type:"tbody"});
    const row = generateElement(tblBody,{type:"tr"});
    let gp = ["内政開発","人材編成","遠征討伐","交易商売","街に戻る"];
    let n = gp.length;
    for (let i=0;i<n;i++) {
      let id = "mid"+(i+1);
      const cell = generateElement(row,{type:"td",id:"cell_"+id,style:{width:(100/n)+"%",textAlign:'center'}});
      let p = parent.geneStrImg(id,gp[i]);
      p.style.verticalAlign = 'middle';
      p.addEventListener('mouseover', this.mevent.bind(this));
      p.addEventListener('mouseleave', this.mevent.bind(this));
      cell.appendChild(p);
    }
    // 戻るボタン(５個目)
    if(1){
      let b = document.getElementById("mid5");
      b.addEventListener('click', parent.kaihatsuEndFunc.bind(parent));
    }
    //パーティション
    generateElement(d,{type:"div",style:{height:"10px",backgroundColor:"#00FFFF40"}});
  }
  //＝＝＝ マウスイベント ＝＝＝
  mevent(e){
    e.stopPropagation();
    let id = "cell_"+e.target.id;
    let p = document.getElementById(id);
    if(e.type=="mouseover"){
      this.parent.switch(e.target,1);
      p.style.backgroundColor = "#088";
    }
    if(e.type=="mouseleave"){
      this.parent.switch(e.target,2);
      p.style.backgroundColor = "#000";
    }
  }
}

class kmsgwnd{
  constructor(parent){
    this.parent = parent;
    this.wnd;
  }
  // div領域をもらう
  init(d){
    let parent = this.parent;
    // 全体のサイズ
    let par = {type:"div",style:{
      height:"120px",backgroundColor:"#0000FF40",color:"#FFF",padding:"10px",position:"relative"}};
    this.wnd = generateElement(d,par);
    // kmsgwnd 領域の初期化
    for(let i=0;i<3;i++){
      this.wnd.appendChild(parent.geneStrImg("self"+(i+1), "未初期化"));
      this.wnd.appendChild(document.createElement("BR"));
    }
    // YesNoの初期化
    {
      let pyn = {type:"div",style:{
        position:"absolute",display:"none",right:"20px",bottom:"30px",width:"220px",height:"60px"}};
      this.ynWnd = generateElement(this.wnd,pyn);
      let list = parent.gentable(this.ynWnd,"ynwnd",1,2);
      this.btn(list[0],"ynwnd_yes", "はい");
      this.btn(list[1],"ynwnd_no", "いいえ");
    }
    // 戻るボタンの初期化
    {
      let pbk = {type:"div",style:{
        position:"absolute",display:"none",right:"20px",
        bottom:"30px",width:"120px",height:"60px"}};
      this.bkWnd = generateElement(this.wnd,pbk);
      let list = parent.gentable(this.bkWnd,"ynwnd",1,1);
      this.btn2(list[0],"bkwnd_back", "もどる");
    }
  }
  switchpage(){
    if(this.ynWnd){
      this.ynWnd.style.display = "none";
    }
    if(this.bkWnd){
      this.bkWnd.style.display = "none";
    }
  }
  cfunc(e){
    let tid = e.target.id;
    console.log("click-cfunc:"+tid);
    let ii = (tid == "ynwnd_yes") ? 0:1;
    this.ynwndbtn[ii](ii);
    this.ynWnd.style.display = "none";
  }
  hfunc(e){
    //DBG//console.log("hover-hfunc:"+e.type);
    let ii = (e.type=="mouseover") ? 1:0;
    let cl = ["#000","#088"];
    e.target.parentNode.style.background = cl[ii];
  }
  btn(tar,sid,txt){
    let parent =this.parent;
    // ボタン
    {
      let dbtn = generateElement(tar, {type:"div",style:{
      margin:"10px 5px",padding:"10px 10px",width:"80px",height:"36px",background:"#000"
      }});
      let timg = parent.geneStrImg(sid,txt);
      set3func(timg,this,this.cfunc,this.hfunc);
      dbtn.appendChild(timg);
      dbtn.appendChild(document.createElement("BR"));
    }
  }
  cfunc2(e){
    let tid = e.target.id;
    console.log("click-cfunc:"+tid);
    let ii = 0;
    this.bkwndbtn[ii](ii);
    this.bkWnd.style.display = "none";
  }
  btn2(tar,sid,txt){
    let parent =this.parent;
    // ボタン
    {
      let dbtn = generateElement(tar, {type:"div",style:{
      margin:"10px 5px",padding:"10px 10px",width:"100px",height:"36px",background:"#000"
      }});
      let timg = parent.geneStrImg(sid,txt);
      set3func(timg,this,this.cfunc2,this.hfunc);
      dbtn.appendChild(timg);
      dbtn.appendChild(document.createElement("BR"));
    }
  }
  setText(ttt){
    if(!ttt){return;}
    let p = this.wnd;
    let parent = this.parent;
    let i=1;
    for(let i=0;i<3;i++){
      let txt = (i<ttt.length) ? ttt[i]:"";
      let e = document.getElementById("self"+(i+1));
      if(e){
        e.src = parent.getImgSrcFromTEXT(txt);
      }
    }
  }
  BKwnd(clss,bfunc){
    console.log("BKWnd invoke");
    let bkWnd = this.bkWnd;
    bkWnd.style.display = "block";
    this.bkwndbtn = [bfunc.bind(clss)];
  }
  YNwnd(clss,yfunc,nfunc){
    console.log("YNWnd invoke");
    let ynWnd = this.ynWnd;
    ynWnd.style.display = "block";
    this.ynwndbtn = [yfunc.bind(clss),nfunc.bind(clss)];
  }
}

// For kmidwnd2 & kmidwnd4
class kmidwnd2core{
  constructor(pclass,wnd,corefunc){
    this.pclass = pclass;
    //this.kmidwnd = wnd;
    this.parent = wnd.parent;
    //this.maindv;
    this.imggg;
    this.cdb = this.parent.cdb;

    this.corefunc = new corefunc(this);
  }
  init(maindv,dv,p){
    this.imggg = p;
    this.mainfunc(dv,maindv);
    return 0;
  }
  initpage(type){
    console.log("kmidwnd0:initpage invoke. "+type);
    if(type==0){return;}
    let num = this.parent.imgchange(this.pclass);
    console.log("initpage",num)
    if(this.corefunc.updblock){
      this.corefunc.updblock(num);
    }
    //Reset
    this.resetpage();
  }
  resetpage(){
    this.imggg.classList.add("fadeIn");
    let d = document.getElementById(this.kbid);
    d.classList.remove("kwnd2u1");
    this.selected = null;
    removeAllChildsByID(this.mainid);
    this.updatelist(document.getElementById(this.listid));
    this.ecan.txtlist = null;
    this.ecan.can.style.left = "500px";
    this.ecan.redraw();
    // 説明表示変える
    this.parent.switchexp("mid2");
  }
  updatelist(dv){
    let [id,txt,list,baseY] = this.corefunc.getUpdatelist();
    removeAllChilds(dv);
    let p = this.parent.geneStrImg(id,txt);
    dv.appendChild(p);
    // 勇者・商人一覧
    for(let i of list){
      let par = [10+80*(i%5),baseY+75*Math.floor(i/5),i];
      let e = new charaImg(this.cdb, par);
      let tar = e.can;
      set3func(tar,this,this.cfunc);
      dv.append(tar);
    }
  }
  mainfunc(dv,maindv){
    dv.id = this.kbid; // For RightMove
    dv.style.position = "relative";
    // キャラリスト
    let dd = generateElement(dv,{type:"div",id:this.listid,style:{padding:"10px"}});
    this.updatelist(dd);
    // あとでここに入れるよう
    generateElement(maindv,{type:"div",id:this.mainid,style:{padding:"10px"}});

    // キャラ名（cfuncで絶対位置移動）
    {
      let p = generateElement(maindv,{type:"div",id:this.kbid+"4"});
      this.ecan = new animationText([500,370,0]);
      let e = this.ecan;
      e.txtlist = null;
      e.id = this.kbid+"4txt";
      p.append(e.can);
    }
    if(this.corefunc.mainfuncex){
      this.corefunc.mainfuncex(dv);
    }
  }
  cfunc2(e){ // click時は異なる
    let p = e.target;
    if(e.type=="click"){
      this.corefunc.cfunc2click(p,this.charatarget)
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
      let d = document.getElementById(this.kbid);
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
      if(this.corefunc.updblock){
        this.corefunc.updblock(num);
      }
    }else{
      this.imggg.classList.remove("fadeIn");
    } 
  }
  // cfuncのclickで呼ばれる
  newwnd(){
    let base = document.getElementById(this.mainid);
    if(this.corefunc.setMtxt){
      this.mtxt = this.corefunc.setMtxt(this.charatarget);
      console.log(this.charatarget,this.mtxt)
    }
    // メニューを設置する
    menuFunc(this.menupar,base,this.mtxt);
    // 戻る を出す
    let tar = this.parent.kmsgwnd;
    tar.BKwnd(this,this.resetpage);
  }
  chgmsg(ii){
    let tar = this.parent.kmsgwnd;
    tar.setText([this.mtxt[ii]]);
  }
}