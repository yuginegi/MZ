//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンド パート３
 * @author wasyo
 *
 * @help kaihatsu3.js
 *
 * 商人の最終章コマンド。開発など
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

class kmidwnd3{
  constructor(wnd){
    this.kmidwnd = wnd;
    this.parent = wnd.parent;
    this.maindv;
    this.imggg;
    this.imgsrc = 'img/pictures/Actor1_5.png';
    this.cdb = this.parent.cdb;
    // mapdata
    this.kmapdata = this.parent.kmapdata;
  }
  init(pdiv){
    let [maindv,dv,p] = this.kmidwnd.createDIV2(pdiv,this.imgsrc);
    this.maindv = maindv;
    this.imggg = p;
    this.menu(dv);
    return 0;
  }
  initpage(){
    console.log("kmidwnd3 initpage invoke.");
    this.reset();
  }
  menu(dv){
    let par = {type:'svg','id':'enseimap','viewbox':'0 0 400 300',"width":"400px","height":"300px"}
    let svg = generateSVG(dv,par);
    // 地図の画像
    let pmap = {type:'image',"href":'img/0img/map.jpg',"x":0,"y":0,"width":"400px","height":"300px"}
    generateSVG(svg,pmap);
    // 地図に置く四角
    let parlist = this.kmapdata.parlist;
    for(let pp of parlist){
      pp.type = "rect";
      let p = generateSVG(svg,pp);
      set3func(p,this,this.mclick,this.mevent);
    }
  }
  reset(){
    this.kmapdata.initinvoke();
    this.enseitarget = null;
    for(let i=0;i<5;i++){
      let rid = "rect3_"+(i+1);
      let p = document.getElementById(rid);
      // ここで対応してあげる、OPENのものには線をつける
      if(this.kmapdata.mapopened[i] == 1){
        p.setAttribute("stroke", this.kmapdata.scl[0]);
      }
      this.kmapdata.chgAttr(p,0);
    }
  }
  newwnd(){
    let e = new newWnd3(this,this.parent,this.enseitarget);
    e.newwnd();
  }

  react1(ii){
    console.log("react1 = "+ii);
    let tar = this.parent.kmsgwnd;
    let txt;//= (ii==0)? ["はいを押された"]:["いいえを押された"];
    if(ii==0){
      audioInvoke("Attack3");//Item3は成功音
      txt = ["遠征討伐"];
      this.newwnd();
    }else{
      audioInvoke("Cancel2");
      txt = ["キャンセルしました"];
    }
    tar.setText(txt); 
    this.reset();
  }
  mclick(e){
    if(this.enseitarget){return;}
    this.enseitarget = e.target.id;
    audioInvoke("Cursor3");
    let tar = this.parent.kmsgwnd;
    let isopen = this.kmapdata.isopen(e.target.id);
    if(!isopen){
      let txt = ["遠征不可"];
      tar.setText(txt); 
      this.reset();
      // はい・いいえ 消す
      tar.switchpage();
    }else{
      let nm = this.kmapdata.getNMfromMAPName(e.target.id);
      let txt = [nm+" に、遠征討伐しますか？"];
      tar.setText(txt);
      // はい・いいえ を出す
      tar.YNwnd(this,this.react1,this.react1);
    }
  }
  mevent(e){
    if(this.enseitarget){return;}
    //console.log("mevent:"+e.type);
    let tp = (e.type=="mouseenter"||e.type=="mouseover")? 1:0; //これがバグってた。。いつも０のバグ
    let p = e.target;
    this.kmapdata.chgAttr(p,tp);
    if(tp==1){
      //let ptxt = this.kmapdata.maptext;
      //let txt = ptxt[e.target.id];//["なにをしますか？","行動力 １００"];
      let txt = this.kmapdata.getmaptext(e.target.id);
      let tarwnd = this.parent.kmsgwnd;
      tarwnd.setText(txt);
    }
  }
}

class newWnd3{
  constructor(wnd,parent,tarmap){
    this.wnd = wnd;
    this.kmidwnd = wnd.kmidwnd;
    this.cdb = wnd.cdb;
    this.parent = parent;
    this.tarmap = tarmap;
    console.log("newWnd3:",this.tarmap);
    let cl = {
      "rect3_1":kd3_1,"rect3_2":kd3_2,"rect3_3":kd3_1,
      "rect3_4":kd3_1,"rect3_5":kd3_1
    };
    this.kd = new cl[tarmap](this);
    this.mres = new matiRes(tarmap,this.kd); 
    this.mmcmd = new newWnd3_mati(this);
    this.kmapdata = this.parent.kmapdata;
    //敵の配置
    this.enelist = this.kmapdata.getenelist(tarmap);
    this.eimglist=[];
    //味方のリスト
    this.charlist=[null,null,null,null,null,null,null,null,null,null];

    //======================================================================
    // Style
    this.closeStyle = {
      position:"absolute",margin:"5px",padding:"2px 2px 2px 10px",left:"680px",top:"0px",
      width:"46px",height:"24px",backgroundColor:"#00F"
    };
    // BasePar
    this.basePar = {type:"div",id:"enseiattackwnd",style:{"z-index":55,
      position:"absolute",margin:"5px",padding:"5px",left:"0px",top:"65px",
      width:"736px",height:"480px",backgroundImage:"url(img/battlebacks1/Grassland.png)"
    }};
  }
  eneid(id){
    return this.tarmap+"_"+id;
  }
  // 線を引く 関係関数
  drawarrow(id,target){
    console.log("drawarrow:"+[id,target]);
    if(!target){return;}
    this.cdb.setAttackData(id,target,this.tarmap)
    console.log("drawarrow:",this.tarmap,target);
    let hh = this.kmapdata.getEneStatus(this.tarmap,target);
    console.log("drawarrow:",hh);
    let arrowid = "drawarrow"+id;
    // arrowid
    let e =document.getElementById(arrowid);
    if(e){e.remove();}
    if(hh.hp <=0){
      return;
    }
    let mm = 24;// = size/2
    let [cx,cy] = [10+50*id+mm,420+mm];
    let cc = this.enelist[target];
    let [ex,ey] = [cc[0]+mm,cc[1]+mm];
    let postxt = `M${cx},${cy} L${ex},${ey}`;//"M10,420 L50,10"
    let g = this.atkmapsvg;
    let par2 = {type:"path", id:arrowid,d:postxt};
    let g2 = generateSVG(g,par2);
    g2.style.pointerEvents = "none";
  }
  settarget(id,xx,yy){
    console.log("settarget:"+[id,xx,yy]);
    let mg=50; // 両方とも左上の点だけ考える
    let target = -1;
    for(let i in this.enelist){
      let cc = this.enelist[i];
      let [x0,x1,y0,y1] = [cc[0]-mg,cc[0]+mg,cc[1]-mg,cc[1]+mg];
      if(x0<xx&&xx<x1&&y0<yy&&yy<y1){
        target = i;
      }
    }
    //console.log("settarget:"+target);
    if(target>=0){
      this.drawarrow(id,target);
      this.updatetarget(target);
      this.usertarget(-1);
    }else{
      this.updateCharaPage(id);
      this.usertarget(id);
    }
  }
  movetarget(id,xx,yy){
    let mg=50; // 両方とも左上の点だけ考える
    let target = -1;
    for(let i in this.enelist){
      let cc = this.enelist[i];
      if(!this.eimglist[i]){continue;}
      let [x0,x1,y0,y1] = [cc[0]-mg,cc[0]+mg,cc[1]-mg,cc[1]+mg];
      let ison = 0;
      if(x0<xx&&xx<x1&&y0<yy&&yy<y1){
        ison = 1;
        this.updatePage(this.eimglist[i].can.enemyid);
      }
      this.eimglist[i].setdraw(ison);
    }
    this.charlist[id].setdraw(1);
  }
  updatetarget(id){
    for(let i in this.eimglist){
      if(!this.eimglist[i]){continue;}
      let ison = (i==id) ? 1:0;
      this.eimglist[i].setdraw(ison);
    }
  }
  usertarget(id){
    for(let i in this.charlist){
      let ison = (i==id) ? 1:0;
      if(this.charlist[i]){
        this.charlist[i].setdraw(ison);
      }
    }
  }
  // あたらしいWindow：newwndContents を呼ぶ
  newwnd(){
    let epar = {type:"div", id:"enseiwnd",classList_add:"fadeIn",style:{
        top:"0px",left:"0px",width:"736px",height:"544px",
        background:"#004", position:"absolute",padding:"10px"}
    };
    let ele = generateElement(document.getElementById("kaihatsumap"),epar);

    let ep0 = {type:"div", id:"enseiwnd_subtitle",
      style:{display:"flex", padding:"0px",marging:"0px"}};
    let el0 = generateElement(ele,ep0);
    let titletxt = "NEW画面:ココをクリックすると消える";
    titletxt = this.kmapdata.getNMfromMAPName(this.tarmap);
    this.parent.apStrImg(el0,"enseiwnd_txt1",titletxt);
    this.areaname = titletxt;

    let dd = this.updgen(ele,10,520);
    dd.id = "newwnd_bkb";
    dd.style.backgroundColor = "#0000FF";
    let t = this.parent.apStrImg(dd,"newWnd3back","　開発に戻る　");
    // クリックすると消える
    set3func2(t,this,this.closeNewWnd3Btn);
    this.mmcmd.mact2 = null;
    ele.append(document.createElement("HR"));
    // 中身をせっと
    let par1 = {type:"div", style:{position:"relative",display:"flex",margin:"0",padding:"0"}};
    let d = generateElement(ele,par1)
    this.newwndContents(d);
  }
  // Closeボタン
  closeNewWnd3Btn(e){
    if(this.mmcmd.mact2){return}
    if(e.type=="click"){
      document.getElementById("enseiwnd").remove();
      return;
    }
    let ii = (e.type=="mouseenter") ? "#00FFFF":"#0000FF";
    document.getElementById("newwnd_bkb").style.backgroundColor = ii;
    this.wnd.reset();
  }
  // 中身
  newwndContents(ele){
    let imgsrc = 'img/0img/map.jpg';
    let canvasSize = 400;
    let parcan = {
      type:"canvas", id:"newwnd1_enseimap",width:canvasSize,height:canvasSize,
      style:{position:"absolute",top:"0px",left:"0px"}};
    let t2 = generateElement(ele,parcan);
    // Canvas: MAP
    const ctx = t2.getContext("2d");
    let img = new Image();
    img.src = imgsrc;
    let cz = canvasSize;
    let v = 2048/cz;
    console.log("map target = "+this.tarmap);
    let [mapx,mapy,mapW,mapH] = this.kmapdata.getXYfromMAPName(this.tarmap);
    ctx.drawImage(img,mapx*v,mapy*v,mapW*v,mapH*v,0,0,cz,cz);

    // 矢印を描くエリア
    let par1 = {type:'svg','id':'atkmap','viewbox':'0 0 500 450',"width":"500px","height":"450px"}
    let g1 = generateSVG(ele,par1);
    g1.style["z-index"] = 40; // 50よりは下
    g1.style.pointerEvents = "none";
    let par2 = {type:"g", classList_add:"attackline"};
    let g2 = generateSVG(g1,par2);
    g2.style.pointerEvents = "none";
    this.atkmapsvg = g2; 
    let par3 = {type:"g", classList_add:"enemyMline"};
    let g3 = generateSVG(g1,par3);
    g3.style.pointerEvents = "none";
    this.emlmapsvg = g3; 
    // 矢印初期値
    let [hash,area] = this.cdb.getAttackAll();//有効なものがあれば描く
    for (let key in hash) {
      if(area[key] && area[key]!=this.tarmap){continue;}
      this.drawarrow(key,hash[key]);
    }
    console.log(hash);

    // 街を出してみる
    this.maptlist = [];
    let matiarr = this.mres.mapres1all();//this.mapres1()
    for(let i=0;i<matiarr.length;i++){
      this.maptlist[i] = new maptip(ele,matiarr[i],i);
    }
    // 画像を歩かせる
    let cdb = this.cdb;

    // 敵の画像を(indexで → Flexibleに)
    let enelist = this.enelist;
    //let ii=0;
    for(let i=0;i<enelist.length;i++){
      let hh = this.kmapdata.getEneStatus(this.tarmap,i);
      if(hh.hp<=0){
        this.eimglist[i] = null;
        continue;}
      let ene = enelist[i]
      let e = new enemyImg(cdb,ene,i);
      //this.eimglist.push(e);
      this.eimglist[i]=e;
      ele.append(e.can);
    }
    // 味方の画像を・勇者一覧
    for(let i of this.parent.chardata.getpcharlist(0,10)){
      let aa = cdb.attackarea[i];
      let flag = (aa && aa != this.tarmap) ? false:true;
      let e = new charaImg(cdb, [10+50*i,420,i],flag,this);
      e.grayout = (flag)? null:1;
      this.charlist[i] = e;
      ele.append(e.can);
    }
    // クリック
    ele.onclick = this.cfunc.bind(this);
    //　右側Wnd
    {
      let dvpos = [cz+20,0];
      let par = {type:"div", id:"ensei_div_txt", style:{
        position:"absolute",margin:"0",padding:"5px",left:dvpos[0]+"px",top:dvpos[1]+"px",
        width:"300px",height:"390px",background:"#000"
      }};
      generateElement(ele,par);
    }
  }

  // 敵系の実行
  attackfunc(e){
    if(e.type=="click"){return this.attackclickfunc();}
    let ii = (e.type=="mouseover") ? 1:0;
    let cl = ["#040","#0F0"];
    e.target.parentNode.style.background = cl[ii];
  }
  attackclickfunc(){
    // 無効化
    let atkmap = document.getElementById("atkmap");
    atkmap.style.display = "none";
    let dv = generateElement(document.getElementById("enseiwnd"),this.basePar);
    dv.classList.add("fadeIn");

    let eid = this.currentenevieweid;
    let hh = this.cdb.getAttachRhash(this.tarmap,eid);
    console.log("attackclickfunc:",this.tarmap,eid,hh,hh[eid]);
    // 敵配置
    this.kmapdata.getEnePicts(dv,this.tarmap,eid);
    // 味方配置
    // 味方を集める
    let parlist = [];
    let poslist = [];
    // 味方の表示用のパラメータ決め
    //DBG//console.log(hh[eid]);
    if(hh[eid]){
      for(let ii of hh[eid]){
        let x1 = 500;
        let y1 = (parlist.length)*150+30;
        let x2 = 480;
        let y2 = (poslist.length)*150+140;
        parlist.push([x1,y1,ii]);
        poslist.push([x2,y2,ii]);
        if(parlist.length >= 3){break;}
      }
    }
    //DBG//console.log(parlist);
    for(let par of parlist){
      if(!this.parent.chardata.isCharFlag(21+par[2])){continue;}
      let e = new charaFace(this.cdb, par);
      dv.append(e.can);
    }
    for(let par of poslist){
      if(!this.parent.chardata.isCharFlag(21+par[2])){continue;}
      let e = new animationText(par);
      dv.append(e.can);
    }
    // Closeボタン
    let ppp = {type:"div",id:"a3closebtn",textContent:"close",style:this.closeStyle};
    let pdiv = generateElement(dv,ppp);
    pdiv.onclick = this.cfuncAClose.bind(this);
  }
  cfuncAClose(e){
    e.stopPropagation();
    let child  = document.getElementById("enseiattackwnd");
    let parent = child.parentNode;
    parent.removeChild(child);
    // 街名あれば消す
    let etar =document.getElementById("enseiwnd_matiname");
    if(etar){etar.remove();}
    // 有効化
    let atkmap = document.getElementById("atkmap");
    atkmap.style.display = "block";
  }

  // 街系の実行（Clickでmaticlickfuncを実行）
  matifunc(e){
    if(e.type=="click"){
      //return this.mmcmd.maticlickfunc();
      this.matireset();
      return;
    }
    let ii = (e.type=="mouseover") ? 1:0;
    let cl = ["#040","#0F0"];
    e.target.parentNode.style.background = cl[ii];
  }
  matireset(){
    let div;
    div = document.getElementById("enseiattackwnd");
    if(div){div.remove();}
    div = document.getElementById("enseiwnd_matiname");
    if(div){div.remove();}
    this.mmcmd.maticlickfunc();
  }

  text6(a){
    let l1 = a.length;
    let l0 = 6 - l1;
    let w0=a;
    while(l0-->0){w0 += "Ｘ"}
    return w0;
  }
  // upd系のUtil関数
  updTarget(eid,cid,mid=-1){
    // 先に消しておく
    this.resetArrowM();
    this.currentenevieweid = (eid >= 0)? eid : null;
    this.updatetarget(eid);
    this.usertarget(cid);
    for(let i=0;i<this.maptlist.length;i++){
      this.maptlist[i].setredraw((i==mid));
    }
  }
  updInitView(){
    let dv0 = document.getElementById("ensei_div_txt");
    dv0.innerHTML = "";
    dv0.classList.add("fadeIn");
    setTimeout(this.mmove.bind(this),600); // addとペア
    let dv = generateElement(dv0, {type:"div",style:{position:"relative"}});
    return dv;
  }
  updButton(base,eid,etx,efunc){
    let bgc = (efunc) ? "#040" : "#444";
    let par = {type:"div",style:{width:"124px",height:"46px",
      position:"absolute", top:"320px", left:"70px",
      paddingLeft:"18px",paddingTop:"8px",background:bgc}};
    let div = generateElement(base,par);
    let t = this.parent.apStrImg(div,eid,etx);//104x36
    if(efunc){set3func(t,this,efunc);}
  }
  updgen(base,vtop,vleft=0){
    return generateElement(base, {type:"div",style:{position:"absolute", top:vtop+"px",left:vleft+"px"}});
  }
  // 敵の画面
  updatePage(id){
    if(this.currentenevieweid == id){return;}
    this.updTarget(id,-1);
    let dv = this.updInitView();
    // パラメータ this.tarmap
    let [area,enm,eimg,etype,epow] = this.kmapdata.getEneInfo(this.tarmap,id);
    // エリア
    this.parent.apStrImg(this.updgen(dv,0),null,"エリア："+area);
    // Info
    if(etype==1){
      this.kmapdata.getEneImg(this.updgen(dv,50),eimg,etype);
      // 背景をうっすら黒くしたい
      let dv3 = generateElement(dv, {type:"div",
      style:{position:"absolute", top:"285px",background:"#00000080",width:"100%"}});
      let txt = this.text6(enm) + " 戦力？？？";
      this.parent.apStrImg(dv3,null,txt);
    }else{
      this.kmapdata.getEneImg(this.updgen(dv,50,50),eimg,etype);
      let dv3 = this.updgen(dv,220,50);
      this.parent.apStrImg(dv3,null,enm);
      generateElement(dv3, {type:"br"});
      this.parent.apStrImg(dv3,null,"戦力："+epow);
    }
    // 攻め込むボタン
    this.updButton(dv,"eattack","　戦況　",this.attackfunc);
  }
  // 線を引く 関係関数
  drawarrowM(id,target){
    console.log("drawarrowM:"+[id,target]);
    if(!(target>=0)){return;}
    // ID
    let arrowid = "drawarrowM"+id;
    // 敵の位置
    let hh = this.kmapdata.getEneStatus(this.tarmap,target);
    // MAPの位置
    let marr = this.mres.mapres1(id);
    // 位置の計算
    let mm = 24;// = size/2
    let [cx,cy] = [marr[0]+mm,marr[1]+mm]//[10+50*id+mm,420+mm];
    let cc = this.enelist[target];
    let [ex,ey] = [cc[0]+mm,cc[1]+mm];
    let postxt = `M${cx},${cy} L${ex},${ey}`;//"M10,420 L50,10"
    // アローを 「enemyMline」でセット
    let g = this.emlmapsvg;
    let par2 = {type:"path", id:arrowid,d:postxt};
    let g2 = generateSVG(g,par2);
    g2.style.pointerEvents = "none";
  }
  resetArrowM(){
    let g = this.emlmapsvg;
    let list = []
    for(let cc of g.childNodes){
      console.log(cc);
      if(cc.id.indexOf("drawarrowM") === 0){
        // 前方一致のときの処理
        list.push(cc.id);
      }
    }
    for(let aid of list){
      let e =document.getElementById(aid);
      if(e){e.remove();}
    }
  }
  // 街の画面
  updateMaptip(id){
    console.log("maptip",id);
    let txres = this.mres.mapres2(id);
    this.updTarget(-1,-1,id);
    // 初期化 
    let dv1 = this.updInitView();
    // 説明タイトル
    this.parent.apStrImg(this.updgen(dv1,0),null,txres[1]);
    // 画像
    this.mres.mapImg(this.updgen(dv1,50),txres[0]);
    // 説明テキスト
    this.parent.apStrImg(this.updgen(dv1,270,5),null,txres[2]);
    // 確認（敵の配置影響）
    let cflag = 0;
    let cond = this.mres.mapresC(id);
    console.log(cond);
    // 先に消しておく
    this.resetArrowM();
    for(let cc of cond){
      let hh = this.kmapdata.getEneStatus(this.tarmap,cc);
      if(hh.hp>0){
        cflag=1;
        this.drawarrowM(id,cc);
      }
    }
    // 訪問ボタン
    this.mativalueid = id;
    let matifunc = (cflag==0)? this.matifunc : null;
    this.updButton(dv1,"ehoumon","　訪問　", matifunc);
    if(cflag==1){
      this.maptlist[id].setredraw(2);
    }
  }
  // 勇者画面
  updateCharaPage(id){
    this.updTarget(-1,id);
    let dv = this.updInitView();
    // 改行レイアウト用関数
    const brseparator = (dv) => {dv.append(document.createElement("br"))};
    // 以下、「dv」に積み上げていく
    this.parent.apStrImg(dv,null,"勇者");
    brseparator(dv);
    // 画像
    let impar = {type:"img",classList_add:"CharaShadow",style:{paddingLeft:"50px"},
      src:"img/pictures/"+this.cdb.getPict(id)+".png",height:200};
    generateElement(dv,impar);
    brseparator(dv);
    // TEXT
    let aa = this.cdb.attackarea[id];
    let a2 = this.kmapdata.getNMfromMAPName(aa);
    let txt = (a2)? a2+"で戦闘中" : "待機中";
    let t = this.parent.apStrImg(dv,"k3attacktarget",txt);
    if(a2){
      set3func(t,this,this.cancelFunc);
      t.tarid = id;
      t.tarexp = txt;
    }
    brseparator(dv);
    // 戦力
    this.parent.apStrImg(dv,null,"戦力：１００");
  }
  cancelFunc(e){
    if(e.type=="click"){
      let tid = e.target.tarid;
      console.log("cancelFunc:"+tid);
      this.cdb.setAttackData(tid,null,null)
      let ele = this.charlist[tid];
      ele.grayout = null;
      ele.draggable = true;
      setTimeout(this.updateCharaPage.bind(this,tid), 50);
      let arrowid = "drawarrow"+tid;
      let arr =document.getElementById(arrowid);
      if(arr){arr.remove();}
    }
    let ii = (e.type=="mouseover") ? 1:0;
    if(ii){
      this.parent.updateStrImg("k3attacktarget","\\C[2]キャンセル？");
    }else{
      this.parent.updateStrImg("k3attacktarget",e.target.tarexp);
    }
  }
  cfunc(e){
    let tid = e.target.id;
    if(tid.indexOf("enemy") == 0){
      this.updatePage(e.target.enemyid);
    }
    else if(tid.indexOf("maptip") == 0){
      this.updateMaptip(e.target.mapid);
    }
    else if(tid.indexOf("chara") == 0){
      /* NOP : charaImg のクリックからsettargetを呼ぶ */
    }
    else if(tid=="newwnd1_enseimap"){
      //DBG//console.log(tid)
      this.updTarget(-1,-1);
      let dv0 = document.getElementById("ensei_div_txt");
      dv0.innerHTML = "";
    }else{
      console.log("cfunc",tid)
    }
  }
  mmove(){
    let ele = document.getElementById("ensei_div_txt");
    ele.classList.remove("fadeIn");
  }
}

class newWnd3_mati{
  constructor(base){
    this.base = base;
    this.mres = base.mres;
    this.kd = base.kd;
    // Style
    this.defStyle();
  }
  defStyle(){
    this.kaiwaStyle = {
      bottom:"0px",width:"716px",height:"120px",backgroundColor:"#0000FFA0",
      color:"#FFF",padding:"10px",position:"absolute"
    };
    this.menuStyle = [];
    for(let i=0;i<4;i++){
      let ms = {"animation-duration":((1*i+5)/10)+"s",padding:"5px 5px 0px 40px","z-index":15,
        position:"absolute",left:"50px",top:40+80*i+"px",width:"220px",height:"40px",background:"#008"
      };
      this.menuStyle[i] = {type:"div",classList_add:"kwnd2u2",id:"kwnd3mati_"+i,style:ms}
    }
  }
  // From KBAND
  drawdiv(base,x,y,w,h){
    let btndiv = generateElement(base, {type:"div",style:
    {position:"absolute",left:x+"px",top:y+"px",width:w+"px",height:h+"px"}
    });
    return btndiv;
  }
  // 重要な関数
  maticlickfunc(){
    let mid = this.base.mativalueid;
    let base = this.base;
    // 無効化
    let atkmap = document.getElementById("atkmap");
    atkmap.style.display = "none";
    let dv = generateElement(document.getElementById("enseiwnd"),base.basePar);
    dv.classList.add("fadeIn");

    let pm = this.mres.mapres2(mid);
    this.mres.mapImg(base.updgen(dv,50),pm[0],560);

    // 関数を呼ぶ
    this.mres.mapfunc(0);

    //=== 街名
    let subd = document.getElementById("enseiwnd_subtitle");
    let mapres2 = this.mres.mapres2(mid);
    let titletxt = "　：　"+mapres2[1];
    base.parent.apStrImg(subd,"enseiwnd_matiname",titletxt);
    //=== 選択肢を出す（関数の中かな？）
    let basedv = dv;
    let mmtxt = this.kd.getMMenu(mid);
    for(let i=0;i<mmtxt.length;i++){
      let p = generateElement(basedv,this.menuStyle[i]);
      let menu = base.kmidwnd.text8(mmtxt[i]);
      let tar = base.parent.geneStrImg(null,menu);
      tar.tarid = mmtxt[i];//String(i);
      tar.actid = i;
      set3func(tar,this,this.cfunc2);
      p.append(tar);
    }
    //=== キャラの顔グラ
    let imgsrc = 'img/pictures/Actor2_1.png';
    let dvp = generateElement(basedv,{type:"div",
    style:{position:"absolute",left:"400px",top:"0px"}});
    let p = base.parent.geneTagImg("matichara",imgsrc);
    p.classList.add("CharaShadow");
    p.classList.add("fadeIn3");
    dvp.appendChild(p);
    //=== 会話領域
    let pmsg = {type:"div",style:this.kaiwaStyle};
    this.talkwnd = generateElement(basedv,pmsg);
    this.mact2 = null;
    //=== Closeボタン
    let ppp = {type:"div",id:"m3closebtn",textContent:"close",style:base.closeStyle};
    let pdiv = generateElement(dv,ppp);
    pdiv.onclick = base.cfuncAClose.bind(base);
  }
  // メニュークリック時
  cfunc2(e){
    let mid = this.base.mativalueid;
    let base = this.base;
    let p = e.target;
    if(e.type=="click"){
      let ai = p.actid;
      let ii = p.tarid;
      let aa = this.mres.mapres2(mid);
      console.log(mid,aa[1],ai,ii);
      //=== 街のアクション ===
      // メニュー消す、最大４
      for(let i=0;i<4;i++){
        let id = "kwnd3mati_"+i;        
        let etar = document.getElementById(id);
        if(etar){etar.remove();}
      }
      // Close無効
      let cbt = document.getElementById("m3closebtn");
      console.log("cbt",cbt);
      if(cbt){
        //cbt.style.backgroundColor = "#444";
        //cbt.onclick = null;
        // 再作成されるから、消してよい
        cbt.style.display = "none";
      }
      
      this.talkpos = 0;
      console.log("this.talkpos: "+this.talkpos)

      let div = document.getElementById("enseiattackwnd");
      this.mact2 = [mid,ai];
      this.mact2data = this.kd.getmact2(mid,ai);
      set3func(div,this,this.cfunc2A);
      // 画像の位置
      {
        let dvp = this.drawdiv(div,10,0,300,300);
        let src = this.kd.getImgSrc(mid,ai);
        let p = base.parent.geneTagImg("enseichara0",src);
        p.classList.add("CharaShadow");
        p.classList.add("fadeInL");
        dvp.appendChild(p);
      }
      return;
    }
    if(e.type=="mouseover"){
      p.parentNode.style.background="#00F";
      //this.chgmsg(p.tarid);
    }else{
      p.parentNode.style.background="#008";
    } 
  }
  // 会話時のクリック
  cfunc2A(e){
    e.stopPropagation();
    if(e.type!="click"){return;}
    //console.log("clicked 2A")
    this.updatetalkwnd();
  }
  // 会話処理ループの制御 ！重要！
  updatetalkwnd(){
    let base = this.base;
    let callflag = 0; // true で 入力待ち無
    console.log(this.mact2,this.talkpos);
    let tdata = this.mact2data;
    // Break
    if(this.talkpos == tdata.length){
      base.matireset()
      return;
    }
    const txtfunc = (tarr,pp="") => {
      this.talkwnd.innerHTML = "";
      for(let i=1;i<tarr.length;i++){
        if(tarr[i].length <= 0){break;}
        let timg = base.parent.geneStrImg(null,pp+tarr[i]);
        this.talkwnd.appendChild(timg);
        this.talkwnd.appendChild(document.createElement("BR"));
      }
    } 
    let tarr = tdata[(this.talkpos)%(tdata.length)];
    if(tarr[0]=="text"){
      // Sound Effect
      if(this.talkpos){
        audioInvoke("Cursor3");
      }
      txtfunc(tarr);
    }else if(tarr[0]=="item"){
      audioInvoke("Item3");
      txtfunc(tarr, "\\C[3]");
    }else if(tarr[0]=="set"){
      console.log("SET",tarr[1],tarr[2])
      if(tarr[1] == "flag"){     
        this.kd.setflag(tarr[2]);
      }
      callflag = 1;
    }else if(tarr[0]=="func"){
      this.kd.callFunc(tarr[1]);
      callflag = 1;
    }else{
      txtfunc(["","未定義"]);
    }
    this.talkpos++;
    if(callflag){
      this.updatetalkwnd();
    }
  }
}

// 基本的な切り出しクラス
class maptip{
  constructor(base,args,ii){
    //console.log(maptip);
    this.initpar(args[2]);
    // Init 48x48
    this.can = generateElement(base,{type:"canvas",id:"maptip_"+ii,mapid:ii,width:48,height:48,
      style:{"z-index":20,position:"absolute",left:args[0]+"px",top:args[1]+"px"}});
    this.ctx = this.can.getContext("2d");
    this.img.onload = () => {
      this.draw();
    }
  }
  initpar(aa){
    let par = [[0,15],[0,15],[2,15],[6,2],[8,9]]
    this.img = new Image();
    this.img.src = "img/tilesets/World_B.png"; // depend on args2
    this.xyp = par[aa]; // depend on args2
    this.setflag = false;
  }
  setredraw(ff){
    this.setflag = ff;
    this.draw();
  }
  draw(){
    const ctx = this.ctx;
    ctx.clearRect(0,0,48,48);
    let [x,y]=this.xyp;
    ctx.drawImage(this.img,48*x,48*y,48,48,0,0,48,48);
    if(this.setflag){
      if(this.setflag==2){
        ctx.fillStyle = "#FF000080";
      }else{
        ctx.fillStyle = "#00FF0080";
      }
      ctx.fillRect(0,0,48,48);
    }
  }
}

class matiRes{
  constructor(tar,kd){
    this.tar = tar;
    this.kd = kd;
    // Resource
    this.imglist = ["Town1.png","Town1.png","Monument.png","Wasteland.png"];
    this.mapres = this.kd.data["mapres"];
  }

  mapImg(dv,ii,sz=280){
    //let sz = 280;
    let par = {type:"div",style:{width:sz+"px",height:sz+"px",overflow:"hidden",padding:"0px 10px"}};
    let div = generateElement(dv,par);
    let im = document.createElement("img");
    this.imgsize = sz;    
    im.onload = () => {
      if(im.width > this.imgsize){
        im.width = this.imgsize;
      } 
    };
    im.src = "img/titles1/"+this.imglist[ii];
    div.append(im);
  }
  mapres1all(){
    return this.mapres.res1;
  }
  mapres1(ii){
    return this.mapres.res1[ii];
  }
  mapres2(ii){
    return this.mapres.res2[ii];
  }
  mapresC(ii){
    return this.mapres.cond[ii];
  }
  // 指定の関数を呼ぶ
  mapfunc(ii){
    let f = this.kd.data["mfunc"][ii].bind(this.kd);
    f();
  }
}

class enemyImg{
  constructor(cdb,args,ii){
    this.cdb = cdb;
    this.img = cdb.getMonImg();
    this.cid = 3;
    // Init
    this.can = generateElement(null,{type:"canvas",id:"enemy_"+ii,enemyid:ii,width:48,height:48,
      style:{"z-index":50,position:"absolute",left:args[0]+"px",top:args[1]+"px"}});
    this.ctx = this.can.getContext("2d");
    this.tt = 0;
    // loop
    setInterval(this.draw.bind(this),250);
  }
  setdraw(flag){
    this.setflag=flag;
  }
  draw(){
    const ctx = this.ctx;
    ctx.clearRect(0,0,48,48);
    if(this.setflag){
      ctx.fillStyle = "#00FF0080";
      ctx.fillRect(0,0,48,48);
      //ctx.filter ="hue-rotate(90deg)";// つかったら片付ける
    }
    let ii = this.cid-1;
    let ll = [0,1,2,1]
    let [x,y]=[3*(ii%4)+ll[(this.tt++)%4], 4*Math.floor(ii/4)];
    ctx.drawImage(this.img,48*x,48*y,48,48,0,0,48,48);
  }
}

class kd3_1 {
  constructor(base){
    this.cname = "kd3_1";
    this.base = base;
    let hh = {};
    // 敵の表示
    hh["edata"] = [
      ["草原 1","ゴブリン","Goblin.png",0,100],
      ["草原 2","クロウ","Crow.png",0,110],
      ["草原 3","カニクラブ","Crab.png",0,120],
      ["草原 4","ホーネット","Machinerybee.png",0,130],
      ["草原 5","カニクラブ","Crab.png",0,240],
      ["草原 6","ホーネット","Machinerybee.png",0,260],
      ["草原 7","ゴブリン","Goblin.png",0,300],
      ["ボスエリア","ドラゴン","Dragon.png",1,100],
    ];
    // 敵の詳細
    hh["edetail"] = [
      {num:3,xx:[50,100,50],yy:[50,170,290],img:"Goblin.png"},
      {num:3,xx:[50,150,250],yy:[50,170,50],img:"Crow.png"},
      {num:3,xx:[50,100,50],yy:[50,170,290],img:"Crab.png"},
      {num:3,xx:[50,100,200],yy:[50,170,50],img:"Machinerybee.png"},
      {num:6,xx:[50,100,50,200,250,200],yy:[50,170,290,50,170,290],img:"Crab.png"},
      {num:6,xx:[50,100,150,200,250,300],yy:[50,170,50,170,50,170],img:"Machinerybee.png"},
      {num:9,xx:[0,100,200,50,150,250,0,100,200],yy:[50,50,50,170,170,170,290,290,290],img:"Goblin.png"},
      {num:1,xx:[20],yy:[50],img:"Dragon.png"},
    ];
    // 敵の表示
    hh["estatus"] = [
      {type:"武",hp:300,mhp:300,atk:100},
      {type:"魅",hp:300,mhp:300,atk:100},
      {type:"武",hp:300,mhp:300,atk:100},
      {type:"魅",hp:300,mhp:300,atk:100},
      {type:"武",hp:600,mhp:600,atk:200},
      {type:"魅",hp:600,mhp:600,atk:200},
      {type:"武",hp:900,mhp:900,atk:300},
      {type:"知",hp:2000,mhp:2000,atk:300},  
    ];
    // 敵の配置
    hh["enelist"] = [
      [70,260,1],[170,310,1],[320,190,1],[120,210,1],
      [270,140,1],[200,20,1],[20,100,1],
      [20,20,1]];
    // MAP
    hh["mapres"] = {
      res1:[[320,140,1],[220,310,2],[250,20,2],[70,100,3],[70,210,4]],
      res2:[
        [1,"ノーマの街","この地方の主要な街"],[1,"ラムの村","ひっそりとした村"],
        [1,"山奥の村","山奥にある村"],[2,"ノーマの祭壇","物語上大事な要衝"],
        [3,"山岳地帯","なにか見つかるかも"],
      ],
      cond:[[2,4],[1],[5],[6,7],[0,3]]
      //cond:[[],[],[],[],[]]
    };
    hh["mfunc"] = [this.func1];
    hh["mmenu"] = {
      0:["街の人Ａ","街の人Ｂ","街の人Ｃ","赤い屋根の建物"],
      1:["街の人Ａ","街の人Ｂ","街の人Ｃ"],
      2:["街の人Ａ","街の人Ｂ","強そうな戦士"],
      12:["街の人Ａ","街の人Ｂ"],
      3:["巫女","妖精"]
    };
    hh["mmimg"] = {
      0:["SF_People1_2.png","SF_People1_3.png","SF_People1_5.png","SF_People1_6.png"],
      1:["People1_3.png","People1_6.png","Actor1_1.png"],
      2:["People1_2.png","People1_2.png","Actor3_1.png"],
      3:["People2_6.png","Nature_6.png"]
    }
    this.data = hh;

    this.flagGameID = 19;
  }
  callFunc(i){
    console.log(i);
    // 仲間加入
    if(i==1){
      $gameSwitches.setValue(24, true);
    }
    // この面クリア
    if(i==2){
      this.base.kmapdata.openmap(1);
    }
  }
  getMMenu(i){
    let hh = this.readflag();
    // 特別対応：2,10 -> 12
    if(i==2 && hh[10]){i = 12;}
    return this.data["mmenu"][i];
  }
  //=== Common ===
  func1(){
    console.log("func1 involed.", this.cname);
  }
  getMatiName(a){
    return this.data["mapres"].res2[a][1]
  }
  readflag(){
    let hh = $gameVariables.value(this.flagGameID);
    if(!hh){hh = {};}
    if(!hh[this.cname]){hh[this.cname] = {};}
    console.log("readflag:",hh)
    return hh[this.cname];
  }
  setflag(aa){
    let hh = $gameVariables.value(this.flagGameID);
    if(!hh){hh = {};}
    if(!hh[this.cname]){hh[this.cname] = {};}
    hh[this.cname][aa] = true;
    $gameVariables.setValue(this.flagGameID, hh);
  }
  getImgSrc(a,i){
    return 'img/pictures/'+this.data["mmimg"][a][i];
  }
  getmact2(a,i){
    let hh = this.readflag();
    console.log(kmatidata);
    let mn = "c_"+a+"_"+i;
    let md = kmatidata[mn];
    if(md.cond){
      let cc = md.cond;
      if(cc.flag && hh[cc.flag]){
        i = cc.goto
      }
      if(cc.nflag && !(hh[cc.nflag])){
        i = cc.goto
      }
      mn = "c_"+a+"_"+i;
      md = kmatidata[mn];
    }
    console.log(md.data)
    return md.data;
  }

}

class kd3_2 {
  constructor(base){
    this.cname = "kd3_2";
    this.base = base;
    let hh = {};
    // 敵の表示
    hh["edata"] = [
      ["草原 1","ウインド","SF_Kamaitachi.png",0,100],
      ["草原 2","ウインド","SF_Kamaitachi.png",0,110],
      ["草原 3","カニクラブ","Crab.png",0,120],
      ["草原 4","シーデビル","SF_Kappa.png",0,130],
      ["草原 5","ウンディーネ","Undine.png",0,120],
      ["草原 6","ウンディーネ","Undine.png",0,120],
      ["草原 7","レッドオーガ","SF_Redogre.png",0,130],
      ["草原 8","ブルーオーガ","SF_Blueogre.png",0,130],
      ["ボスエリア","クラーケン","Kraken.png",1,100],
    ];
    // 敵の詳細
    hh["edetail"] = [
      {num:3,xx:[50,150,250],yy:[50,150,250],img:"SF_Kamaitachi.png"},
      {num:3,xx:[50,150,250],yy:[50,150,250],img:"SF_Kamaitachi.png"},
      {num:6,xx:[50,100,50,200,250,200],yy:[50,170,290,50,170,290],img:"Crab.png"},
      {num:3,xx:[50,100,200],yy:[100,220,100],img:"SF_Kappa.png"},
      {num:3,xx:[50,150,50],yy:[50,170,290],img:"Undine.png"},
      {num:3,xx:[50,150,50],yy:[50,170,290],img:"Undine.png"},
      {num:2,xx:[-50,100],yy:[50,50],img:"SF_Redogre.png"},
      {num:2,xx:[50,250],yy:[50,50],img:"SF_Blueogre.png"},
      {num:1,xx:[50],yy:[50],ww:330,img:"Kraken.png"},
    ];
    // 敵の表示
    hh["estatus"] = [
      {type:"武",hp:300,mhp:300,atk:100},
      {type:"魅",hp:300,mhp:300,atk:100},
      {type:"武",hp:300,mhp:300,atk:100},
      {type:"魅",hp:300,mhp:300,atk:100},
      {type:"武",hp:300,mhp:300,atk:100},
      {type:"武",hp:300,mhp:300,atk:100},
      {type:"魅",hp:300,mhp:300,atk:100},
      {type:"魅",hp:300,mhp:300,atk:100},
      {type:"知",hp:2000,mhp:2000,atk:300},  
    ];
    // 敵の配置
    hh["enelist"] = [
      [170,160,1],[170,260,1],[320,190,1],[120,210,1],
      [320,90,1],[270,140,1],[20,50,1],[70,0,1],
      [60,330,1]];
    // MAP
    hh["mapres"] = {
      res1:[[320,140,1],[170,210,1],[70,50,3],[10,340,3]],
      res2:[
        [1,"アストリアの街","この地方の主要な街"],
        [1,"ミディアの街","この地方の主要な街"],
        [2,"塔","探索すると？？？"],
        [2,"アストリアの祭壇","物語上大事な要衝"],
      ],
      //cond:[[4],[1],[2,5],[6,7],[0,3]]
      cond:[[],[],[],[],[]]
    };
    hh["mfunc"] = [this.func1];
    hh["mmenu"] = {
      0:["街の人Ａ","街の人Ｂ","街の人Ｃ","赤い屋根の建物"],
      1:["街の人Ａ","街の人Ｂ","街の人Ｃ"],
      2:["街の人Ａ"],
      3:["巫女","妖精"]
    };
    hh["mmimg"] = {
      0:["SF_People1_2.png","SF_People1_3.png","SF_People1_5.png","SF_People1_6.png"],
      1:["People1_3.png","People1_6.png","Actor1_1.png"],
      2:["People1_2.png","People1_2.png","People3_7.png"],
      3:["People2_6.png","Nature_6.png"]
    }
    this.data = hh;

    this.flagGameID = 19;
  }
  callFunc(i){
    console.log(i);
    // 仲間加入
    if(i==1){
      $gameSwitches.setValue(25, true);
    }
    // この面クリア
    if(i==2){
      this.base.kmapdata.openmap(2);
    }
  }
  getMMenu(i){
    let hh = this.readflag();
    // 特別対応：2,10 -> 12
    if(i==2 && hh[10]){i = 12;}
    return this.data["mmenu"][i];
  }
  //=== Common ===
  func1(){
    console.log("func1 involed.", this.cname);
  }
  getMatiName(a){
    return this.data["mapres"].res2[a][1]
  }
  readflag(){
    let hh = $gameVariables.value(this.flagGameID);
    if(!hh){hh = {};}
    if(!hh[this.cname]){hh[this.cname] = {};}
    console.log("readflag:",hh)
    return hh[this.cname];
  }
  setflag(aa){
    let hh = $gameVariables.value(this.flagGameID);
    if(!hh){hh = {};}
    if(!hh[this.cname]){hh[this.cname] = {};}
    hh[this.cname][aa] = true;
    $gameVariables.setValue(this.flagGameID, hh);
  }
  getImgSrc(a,i){
    return 'img/pictures/'+this.data["mmimg"][a][i];
  }
  getmact2(a,i){
    let hh = this.readflag();
    console.log(kmatidata);
    let mn = "c_"+a+"_"+i;
    let md = kmatidata[mn];
    if(md.cond){
      let cc = md.cond;
      if(cc.flag && hh[cc.flag]){
        i = cc.goto
      }
      if(cc.nflag && !(hh[cc.nflag])){
        i = cc.goto
      }
      mn = "c_"+a+"_"+i;
      md = kmatidata[mn];
    }
    console.log(md.data)
    return md.data;
  }

}

//=====================================================================
