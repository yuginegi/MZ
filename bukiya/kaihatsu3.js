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

class newWnd3{
  constructor(wnd,parent,tarmap){
    this.wnd = wnd;
    this.cdb = wnd.cdb;
    this.parent = parent;
    this.tarmap = tarmap;
    this.kmapdata = this.parent.kmapdata;
    //敵の配置
    this.enelist = this.kmapdata.getenelist(tarmap);
    this.eimglist=[];
    //味方のリスト
    this.charlist=[null,null,null,null,null,null,null,null,null,null];
  }
  eneid(id){
    return this.tarmap+"_"+id;
  }
  // 線を引く
  drawarrow(id,target){
    console.log("drawarrow:"+[id,target]);
    if(!target){return;}
    this.cdb.attackhash[id] = target;
    this.cdb.attackarea[id] = this.tarmap;
    let mm = 24;// = size/2
    let [cx,cy] = [10+50*id+mm,420+mm];
    let cc = this.enelist[target];
    let [ex,ey] = [cc[0]+mm,cc[1]+mm];
    let postxt = `M${cx},${cy} L${ex},${ey}`;//"M10,420 L50,10"
    let arrowid = "drawarrow"+id;
    let e =document.getElementById(arrowid);
    if(e){e.remove();}
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
    console.log("settarget:"+target);
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
      let ison = (i==id) ? 1:0;
      this.eimglist[i].setdraw(ison);
    }
  }
  usertarget(id){
    console.log("usertarget "+id);
    console.log(this.charlist);
    for(let i in this.charlist){
      let ison = (i==id) ? 1:0;
      if(this.charlist[i]){
        this.charlist[i].setdraw(ison);
      }
    }
  }
  newwnd(){
    let epar = {type:"div", id:"enseiwnd",classList_add:"fadeIn",style:{
        top:"0px",left:"0px",width:"736px",height:"544px",
        background:"#004", position:"absolute",padding:"10px"}
    };
    let ele = generateElement(document.getElementById("kaihatsumap"),epar);

    let t = this.parent.geneStrImg("enseiwnd_txt1","NEW画面:ココをクリックすると消える")
    ele.append(t);
    ele.append(document.createElement("HR"));

    let par1 = {type:"div", style:{position:"relative",display:"flex",margin:"0",padding:"0"}};
    let d = generateElement(ele,par1)

    // クリックすると消える
    t.onclick = function(){
      console.log("enseiwnd onclick");
      document.getElementById("enseiwnd").remove();
    }
    // 中身をせっと
    this.newwnd1(d);
  }
  newwnd1(ele){
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
    let [mapx,mapy] = this.kmapdata.getXYfromMAPName(this.tarmap);
    ctx.drawImage(img,mapx*v,mapy*v,100*v,100*v,0,0,cz,cz);

    let par1 = {type:'svg','id':'atkmap','viewbox':'0 0 500 450',"width":"500px","height":"450px"}
    let g1 = generateSVG(ele,par1);
    g1.style["z-index"] = 20;
    g1.style.pointerEvents = "none";
    let par2 = {type:"g", classList_add:"attackline"};
    let g2 = generateSVG(g1,par2);
    g2.style.pointerEvents = "none";
    this.atkmapsvg = g2; 
    // 矢印初期値
    let hash = this.cdb.attackhash;
    let area = this.cdb.attackarea;
    for (let key in hash) {
      if(area[key] && area[key]!=this.tarmap){continue;}
      this.drawarrow(key,hash[key]);
    }
    console.log(hash);

    // 画像を歩かせる
    let cdb = this.cdb;
    // 敵の画像を(indexで → Flexibleに)
    let enelist = this.enelist;
    let ii=1;
    for(let ene of enelist){
      let e = new enemyImg(cdb,ene,ii++);
      this.eimglist.push(e);
      ele.append(e.can);
    }
    // 味方の画像を・勇者一覧
    for(let i of this.parent.chardata.getpcharlist(0,10)){
      let flag = (cdb.attackarea[i] && cdb.attackarea[i]!=this.tarmap) ? false:true;
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
  // 敵の画面
  updatePage(id){
    if(this.currentenevieweid == id){return;}
    this.currentenevieweid = id;
    this.updatetarget(id-1);
    this.usertarget(-1);
    let dv = document.getElementById("ensei_div_txt");
    dv.innerHTML = "";
    dv.classList.add("fadeIn");
    setTimeout(this.mmove.bind(this),600); // addとペア
    let t;
    let im = document.createElement("img");
    // エリア
    t = this.parent.geneStrImg(null,"エリア：草原 "+id);
    dv.append(t);
    generateElement(dv, {type:"br"});
    //画像
    im.src = "img/enemies/Goblin.png";
    dv.append(im);
    generateElement(dv, {type:"br"});
    // TEXT
    t = this.parent.geneStrImg(null,"ゴブリン");
    dv.append(t);
    generateElement(dv, {type:"br"});
    t = this.parent.geneStrImg(null,"戦力：１００");
    dv.append(t);
    let par = {type:"div",style:{width:"124px",height:"46px",paddingLeft:"18px",paddingTop:"8px",background:"#040"}};
    let div = generateElement(dv,par);
    //　攻め込むボタン
    t = this.parent.geneStrImg("eattack","　戦況　");//104x36
    div.append(t);

    set3func(t,this,this.attackfunc);
  }
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
    //let e = document.getElementById("enseiwnd");//756x564
    let par = {type:"div",id:"enseiattackwnd",style:{"z-index":55,
      position:"absolute",margin:"5px",padding:"5px",left:"0px",top:"65px",
      width:"736px",height:"480px",backgroundImage:"url(img/battlebacks1/Grassland.png)"
    }};
    let dv = generateElement(document.getElementById("enseiwnd"),par);
    dv.classList.add("fadeIn");
    //敵配置
    let xx = [50,100,50];
    let yy = [50,170,290];
    for(let i=0;i<3;i++){
      let [x,y] = [xx[i],yy[i]];
      let par = {type:"img",src:"img/enemies/Goblin.png",style:{position:"absolute",left:x+"px",top:y+"px"}};
      generateElement(dv,par);
    }
    //　味方を集める
    let eid = this.currentenevieweid-1;
    console.log("getAttachRhash:"+eid);
    let hh = this.cdb.getAttachRhash(eid);
    console.log("getAttachRhash:"+hh);
    let parlist = [];
    let poslist = [];
    if(hh[eid]){
      for(let ii of hh[eid]){
        let x1 = 500;
        let y1 = (parlist.length)*150+30;
        let x2 = 480;
        let y2 = (poslist.length)*150+140;
        parlist.push([x1,y1,ii]);
        poslist.push([x2,y2,ii]);
      }
    }
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
    let ppp = {type:"div",textContent:"close",style:{
      position:"absolute",margin:"5px",padding:"2px 2px 2px 10px",left:"680px",top:"0px",
      width:"46px",height:"24px",backgroundColor:"#00F"
    }};
    let pdiv = generateElement(dv,ppp);
    pdiv.onclick = this.cfuncAClose.bind(this);
  }
  cfuncAClose(e){
    let child  = document.getElementById("enseiattackwnd");
    let parent = child.parentNode;
    parent.removeChild(child);
    // 有効化
    let atkmap = document.getElementById("atkmap");
    atkmap.style.display = "block";
  }

  // 勇者画面
  updateCharaPage(id){
    this.currentenevieweid = null;
    this.updatetarget(-1);
    this.usertarget(id);
    let dv = document.getElementById("ensei_div_txt");
    console.log("updateCharaPage:"+id)
    dv.innerHTML = "";
    dv.classList.add("fadeIn");
    setTimeout(this.mmove.bind(this),600); // addとペア
    let t;
    // エリア
    t = this.parent.geneStrImg(null,"勇者");
    dv.append(t);
    dv.append(document.createElement("br"));
    //画像
    let impar = {type:"img",classList_add:"CharaShadow",style:{paddingLeft:"50px"},
      src:"img/pictures/"+this.cdb.getPict(id)+".png",height:200};
    let im = generateElement(dv,impar);
    dv.append(document.createElement("br"));
    // TEXT
    let aa = this.cdb.attackarea[id];
    let a2 = this.kmapdata.getNMfromMAPName(aa);
    let a3 = (a2)? a2+"で戦闘中" : null;
    let txt = (a3) ? a3 : "待機中";
    t = this.parent.geneStrImg("k3attacktarget",txt);
    if(a3){
      //t.onclick = this.cancelFunc.bind(this);
      set3func(t,this,this.cancelFunc);
      t.tarid = id;
      t.tarexp = a3;
    }
    dv.append(t);
    dv.append(document.createElement("br"));
    t = this.parent.geneStrImg(null,"戦力：１００");
    dv.append(t);
  }
  cancelFunc(e){
    if(e.type=="click"){
      let tid = e.target.tarid;
      console.log("cancelFunc:"+tid);
      this.cdb.attackhash[tid] = null;
      this.cdb.attackarea[tid] = null;
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
  }
  mmove(){
    let ele = document.getElementById("ensei_div_txt");
    ele.classList.remove("fadeIn");
  }
}

class kmidwnd3{
  constructor(wnd){
    this.kmidwnd = wnd;
    this.parent = wnd.parent;
    this.maindv;
    this.imggg;
    this.imgsrc = 'img/pictures/Actor1_5.png';
    // CharaDB
    this.cdb = new charaDB();
    // mapdata
    this.kmapdata = this.parent.kmapdata;
  }
  init(pdiv){
    this.maindv = this.kmidwnd.createDIV(pdiv);
    this.menu(this.maindv,this.parent,this.kmidwnd);
    return 0;
  }
  initpage(){
    console.log("kmidwnd3 initpage invoke.");
    this.reset();
  }
  menu(pdiv,parent,kwnd){
    let dvlist = [];
    {
      let childWidth = ["400px","320px"];
      let childPadng = ["0px","5px"];
      for(let i=0;i<childWidth.length;i++){
        let dv = generateElement(pdiv,{type:"div",id:"kmidwnd3_"+(i+1),style:{
          width:childWidth[i],padding:childPadng[i],overflow:"hidden"
        }});
        dvlist.push(dv);
      }
    }

    let i=0;
    // さいしょの表示領域 // SVG
    // https://beamaker.jp/article/19
    {
      let dv = dvlist[i++];
      let par = {type:'svg','id':'enseimap','viewbox':'0 0 400 300',"width":"400px","height":"300px"}
      let svg = generateSVG(dv,par);
      // 画像
      {
        let par = {type:'image',"href":'img/0img/map.jpg',"x":0,"y":0,"width":"400px","height":"300px"}
        generateSVG(svg,par);
      }
      // 四角
      {
        let parlist = this.kmapdata.parlist;
        for(let par of parlist){
          par.type = "rect";
          let p = generateSVG(svg,par);
          set3func(p,this,this.mclick,this.mevent);
        }
      }
    }

    // 画像の表示領域
    {
      let dv = dvlist[i++];
      let p = parent.geneTagImg("kaihatsuchara",this.imgsrc);
      p.classList.add("CharaShadow");
      dv.appendChild(p);
      this.imggg = p;
    }
  }
  setrect(svg,arg){
    let p = document.createElementNS('http://www.w3.org/2000/svg','rect');
    for (let key in arg) {
      p.setAttribute(key, arg[key]);
    }
    svg.appendChild(p); //追加して仮想SVGツリーに
    return p;
  }
  reset(){
    this.enseitarget = null;
    for(let i=0;i<5;i++){
      let rid = "rect3_"+(i+1);
      let p = document.getElementById(rid);
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
      txt = ["はいが押された"];
      this.newwnd();
    }else{
      audioInvoke("Cancel2");
      txt = ["いいえが押された"];
    }
    tar.setText(txt); 
    this.reset();
  }
  mclick(e){
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
      let ptxt = this.kmapdata.maptext;
      let txt = ptxt[e.target.id];//["なにをしますか？","行動力 １００"];
      let tarwnd = this.parent.kmsgwnd;
      tarwnd.setText(txt);
    }
  }
}

//=====================================================================
