//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンド
 * @author wasyo
 *
 * @help kaihatsu.js
 *
 * 商人の最終章コマンド。開発など
 * 
 * @param arrayIDs
 * @desc 使ってよい変数の配列(ループ用＋変数６個)
 * 数字とカンマ区切りだけを半角で。
 * （例）2,15,16,17,18,19,20
 *
 * @command enter
 * @text 玉座コマンド
 * @desc 
 * ループ変数を０にして実行します
 * そとでループして待機してください。
 * ループ変数を１にして返します
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

(() => {
  'use strict';

  class skillDB{
    constructor(){
    }
  }
  class charaDB{
    constructor(){
      //-- Player ---
      this.parlist = [
        /*"People4_5","People4_1","People2_8","People1_4","People4_3",
        "People2_1","People3_3","SF_People1_1","People2_2","Nature_7"*/
        [1,5],[2,2],[1,8],[3,1],[6,7],
        [2,7],[1,7],[3,4],[2,4],[3,2],
        [7,5],[7,1],[5,8],[4,4],[7,3],
        [5,1],[6,3],[8,1],[5,2],[0,7],
      ];
      let imgfilelist = [
        "Nature","Actor1","Actor2","Actor3",
        /*+3*/"People1","People2","People3","People4",
        /*+7*/"SF_People1"
      ];
      this.imglist = [];
      for(let cc of imgfilelist){
        let i = new Image();
        i.src = 'img/characters/'+cc+'.png';
        this.imglist.push(i);
      }
      this.facelist = [];
      for(let cc of imgfilelist){
        let i = new Image();
        i.src = 'img/faces/'+cc+'.png';
        this.facelist.push(i);
      }
      let monsrc = "SF_Monster";
      this.monimg = new Image();
      this.monimg.src = 'img/characters/'+monsrc+'.png';
    }
    get(id){
      let par = this.parlist;
      let img = this.imglist[par[id][0]];
      //console.log(id+":"+par[id]);
      //console.log(img);
      return [img, par[id][1]];
    }
    getFace(id){
      let par = this.parlist;
      let img = this.facelist[par[id][0]];
      //console.log(id+":"+par[id]);
      //console.log(img);
      return [img, par[id][1]];
    }
    getName(id){
      let list = [
        "ユウ","セシリア","アイリン","ゾード","ザイン",
        "ケイン","リュート","ルーシア","ミンミン","カーラ",
        "フゴウ","ダンテ","ウルスラ","サファイア","エドガー",
        "ギース","星の王子","クロイス","レオナ","光の女神"
      ];
      return list[id];
    }
    getPict(id){
      let list = [
        "Actor1_5","Actor2_2","Actor1_8","Actor3_1","People3_7",
        "Actor2_7","Actor1_7","Actor3_4","Actor2_4","Actor3_2",
        "People4_5","People4_1","People2_8","People1_4","People4_3",
        "People2_1","People3_3","SF_People1_1","People2_2","Nature_7"
      ];
      return list[id];
    }
    getMonImg(){
      return this.monimg;
    }
    getStatus(id){
      let sts = [
        [7,5,5],[8,0,6],[8,0,6],[7,7,0],[10,0,0],
        [5,7,5],[0,4,9],[5,5,7],[0,10,0],[4,0,9]
      ];
      return sts[id%10];
    }
  }
  class charaImg{
    constructor(cdb,args){
      this.cdb = cdb;
      [this.img,this.cid]= cdb.get(args[2]);
      // Init
      this.can = generateElement(null,{type:"canvas",id:"chara_"+args[2],width:48,height:48,
        style:{position:"absolute",left:args[0]+"px",top:args[1]+"px"}});
      this.ctx = this.can.getContext("2d");
      // loop
      this.tt = 0;
      setInterval(this.draw.bind(this),250);
    }
    draw(){
      const ctx = this.ctx;
      ctx.clearRect(0,0,48,48);
      let ii = this.cid-1;
      let ll = [0,1,2,1]
      let [x,y]=[3*(ii%4)+ll[(this.tt++)%4], 4*Math.floor(ii/4)];
      ctx.drawImage(this.img,48*x,48*y,48,48,0,0,48,48);
    }
  }
  class charaFace{
    constructor(cdb,args){
      this.cdb = cdb;
      [this.img,this.cid]= cdb.getFace(args[2]);
      // Init
      this.can = generateElement(null,{type:"canvas",id:"chara_"+args[2], width:144,height:144,
        style:{position:"absolute",left:args[0]+"px",top:args[1]+"px"}});
      this.ctx = this.can.getContext("2d");
      this.draw();
    }
    draw(){
      const ctx = this.ctx;
      ctx.clearRect(0,0,144,144);
      let ii = this.cid-1;
      let [x,y]=[(ii%4), Math.floor(ii/4)];
      //console.log("draw:"+[ii,x,y]);
      ctx.drawImage(this.img,144*x,144*y,144,144,0,0,144,144);
    }
  }
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
      this.val = args[2];
      this.txtlist = args[3];
      // loop
      this.tt = 0;
      setInterval(this.draw.bind(this),1000/60);
    }
    draw(){
      let tt = (this.tt++)%120;
      if(tt==0){
        let aa = generateTextBmp(this.txtlist);
        this.img.src = aa.context.canvas.toDataURL();
      }
      let [x,y,z] = [20,2,20];
      let w0 = ((this.cansz[0]-x)/30)*(10+this.val);
      let ww = (tt > z) ? w0 : w0*(tt/z);
      // draw
      let ctx = this.ctx;
      ctx.clearRect(0,0,this.cansz[0],this.cansz[1]);
      ctx.fillStyle = "#008800C0";
      let mg = 5;
      ctx.fillRect(x,mg,ww,this.cansz[1]-2*mg);
      ctx.drawImage(this.img,x,y);
    }
  }

  class animationText{
    constructor(args){
      // Init
      this.cansz = [220,40];
      this.can = generateElement(null,{type:"canvas",id:"anitxt_"+args[2],width:this.cansz[0],height:this.cansz[1],
        style:{position:"absolute",overflow:"hidden",left:args[0]+"px",top:args[1]+"px"}});
      this.ctx = this.can.getContext("2d");
      this.img = new Image();
      // TEXT
      this.txtidx = 0;
      this.txtlist = this.getText(args[2]);
      // loop
      this.tt = 0;
      setInterval(this.draw.bind(this),1000/60);
    }
    getText(id){
      let txt = {
       0:["戦力アップ","東方の勇者","ソードエンペラー"],
       1:["戦力アップ","スーパーパワー","一騎当千"],
       2:["戦力アップ","大魔導士の才能"]
      };
      return txt[id];
    }
    resettext(txt){
      this.txtlist = txt;
      this.redraw();
    }
    redraw(){
      this.ctx.clearRect(0,0,this.cansz[0],this.cansz[1]);
      this.tt = 0;
    }
    draw(){
      if(this.txtlist==null){
        //this.ctx.clearRect(0,0,this.cansz[0],this.cansz[1]);
        this.redraw();
        return;
      }
      let tt = (this.tt++)%120;
      if(tt==0){
        let aa = generateTextBmp(this.txtlist[(this.txtidx++)%this.txtlist.length]);
        this.img.src = aa.context.canvas.toDataURL();
      }
      let ww = this.img.width;
      let [x,y,z] = [(220-ww)/2,2,20];
      y = (tt > z) ? y : y+2*(z-tt);
      // draw
      let ctx = this.ctx;
      ctx.clearRect(0,0,this.cansz[0],this.cansz[1]);
      ctx.fillStyle = "#0000FF80";
      ctx.fillRect(0,y,this.cansz[0],this.cansz[1]);
      ctx.drawImage(this.img,x,y);
    }
  }
  class enemyImg{
    constructor(cdb,args,ii){
      this.cdb = cdb;
      this.img = cdb.getMonImg();
      this.cid = 3;
      // Init
      this.can = generateElement(null,{type:"canvas",id:"enemy_"+ii,enemyid:ii,width:48,height:48,
        style:{position:"absolute",left:args[0]+"px",top:args[1]+"px"}});
      this.ctx = this.can.getContext("2d");
      this.tt = 0;
      // loop
      setInterval(this.draw.bind(this),250);
    }
    draw(){
      const ctx = this.ctx;
      ctx.clearRect(0,0,48,48);
      let ii = this.cid-1;
      let ll = [0,1,2,1]
      let [x,y]=[3*(ii%4)+ll[(this.tt++)%4], 4*Math.floor(ii/4)];
      ctx.drawImage(this.img,48*x,48*y,48,48,0,0,48,48);
    }
  }

  //=====================================================================


  class newWnd3{
    constructor(wnd,parent){
      this.wnd = wnd;
      this.cdb = wnd.cdb;
      this.parent = parent;
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
      //let t2 = this.parent.geneStrImg("enseiwnd_txt2","さあ、どうしようかなあ・・")
      let imgsrc = 'img/0img/map.jpg';
      let canvasSize = 400;
      let par1 = {
        type:"canvas", id:"newwnd1_enseimap",width:canvasSize,height:canvasSize,
        style:{position:"absolute",top:"0px",left:"0px"}};
      let t2 = generateElement(ele,par1);
      // Canvas: MAP
      const ctx = t2.getContext("2d");
      let img = new Image();
      img.src = imgsrc;
      let cz = canvasSize;
      let v = 2048/cz;
      ctx.drawImage(img,20*v,10*v,100*v,100*v,0,0,cz,cz);

      // 画像を歩かせる
      let cdb = this.cdb;
      // 敵の画像を(indexで → Flexibleに)
      let enelist = [[20,20,1],[150,80,1],[270,140,1],[20,260,1]];
      let ii=1;
      for(let ene of enelist){
        let e = new enemyImg(cdb,ene,ii++);
        ele.append(e.can);
      }
      // 味方の画像を
      let parlist = [
        [10,420,0],[60,420,1],[110,420,2],
        [160,420,3],[210,420,4],[260,420,5],[310,420,6],[360,420,7],[410,420,8],[460,420,9]
      ];
      for(let par of parlist){
        if(!$gameSwitches.value(21+par[2])){continue;}
        let e = new charaImg(cdb, par);
        ele.append(e.can);
      }
      // クリック
      ele.onclick = this.cfunc.bind(this);
      //ele.onmousemove = this.mmove.bind(this);
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
    updatePage(dv,id){
      dv.innerHTML = "";
      dv.classList.add("fadeIn");
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
      //console.log([t.width,t.height]);
      t.onclick = this.attack2func.bind(this);
      t.onmouseover  = this.attack2func.bind(this);
      t.onmouseleave = this.attack2func.bind(this);
    }
    /*attack1func(e){
      this.attackfunc();
    }*/
    attack2func(e){
      if(e.type=="click"){return this.attackfunc();}
      let ii = (e.type=="mouseover") ? 1:0;
      let cl = ["#040","#0F0"];
      e.target.parentNode.style.background = cl[ii];
    }
    attackfunc(){
      //let e = document.getElementById("enseiwnd");//756x564
      let par = {type:"div",id:"enseiattackwnd",style:{
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
      let parlist = [
        [500,30,0],[500,180,1],[500,330,2],
      ];
      for(let par of parlist){
        if(!$gameSwitches.value(21+par[2])){continue;}
        let e = new charaFace(this.cdb, par);
        dv.append(e.can);
      }
      let posbase = 480;
      let poslist = [
        [posbase,140,0],[posbase,290,1],[posbase,440,2],
      ];
      for(let par of poslist){
        if(!$gameSwitches.value(21+par[2])){continue;}
        let e = new animationText(par);
        dv.append(e.can);
      }
      let ppp = {type:"div",textContent:"close",style:{
        position:"absolute",margin:"5px",padding:"2px 2px 2px 10px",left:"680px",top:"0px",
        width:"46px",height:"24px",backgroundColor:"#00F"
      }};
      let pdiv = generateElement(dv,ppp);
      pdiv.onclick = this.cfuncAC.bind(this);
    }
    cfuncAC(e){
      let child  = document.getElementById("enseiattackwnd");
      let parent = child.parentNode;
      parent.removeChild(child);
    }

    // 勇者画面
    updateCharaPage(dv,id){
      console.log("updateCharaPage:"+id)
      dv.innerHTML = "";
      dv.classList.add("fadeIn");
      let t;
      // エリア
      t = this.parent.geneStrImg(null,"勇者");
      dv.append(t);
      dv.append(document.createElement("br"));
      //画像
      let impar = {type:"img",classList_add:"CharaShadow",src:"img/pictures/"+this.cdb.getPict(id)+".png",height:200,style:{paddingLeft:"50px"}};
      let im = generateElement(dv,impar);
      dv.append(document.createElement("br"));
      // TEXT
      t = this.parent.geneStrImg(null,"戦闘中");
      dv.append(t);
      dv.append(document.createElement("br"));
      t = this.parent.geneStrImg(null,"戦力：１００");
      dv.append(t);
    }
    cfunc(e){
      let tid = e.target.id;
      //console.log("click:"+tid);
      let ele = document.getElementById("ensei_div_txt");
      if(tid.indexOf("enemy") == 0){
        this.updatePage(ele,e.target.enemyid);
      }else if(tid.indexOf("chara") == 0){
        let num = tid.match(/\d+/g)[0];
        this.updateCharaPage(ele,num);
      }else{return;}
      setTimeout(this.mmove.bind(this),600);
    }
    mmove(){
      let ele = document.getElementById("ensei_div_txt");
      ele.classList.remove("fadeIn");
    }
  }

  class kmidwnd5{
    constructor(wnd){
      this.kmidwnd = wnd;
      this.parent = wnd.parent;
      this.maindv;
      this.imggg;
      this.imgsrc = 'img/pictures/Actor2_1.png';
      // CharaDB
      this.cdb = new charaDB();
      this.invoke = 0;
    }
    getpstatus1(){
      let p = {"勇者":0,"商人":0};
      for(let i=0;i<10;i++){
        p["勇者"] += ($gameSwitches.value(21+i)==true);
        p["商人"] += ($gameSwitches.value(31+i)==true);
      }
      return p;
    }
    getpstatus2(){
      let p = {};
      let tar = this.kmidwnd.divlist[0]; // From kmidwnd1
      for(let i=0;i<8;i++){
        let key =  tar.psname[i];
        let val =  tar.psts[i];
        p[key] = val;
      }
      return p;
    }
    init(pdiv){
      console.log("kmidwnd5 init invoke.");
      this.maindv = this.kmidwnd.createDIV(pdiv);
      this.menu(this.maindv,this.parent,this.kmidwnd);
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
      let nn=0;
      for(let i=0;i<10;i++){nn += ($gameSwitches.value(21+i)==true)};
      let id = (nn+this.noteinfo++)%nn;
      // list2[0]
      let e = new charaFace(this.cdb, [20,20,id]);
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
        let par = {type:"div",id:"kmidwnd5note",classList_add:"fadeInX1",style:{"z-index":15,
          position:"absolute",left:"5px",top:"375px",width:"720px",height:"160px",
          background:"#008",padding:"10px"}};
        this.k5note = generateElement(this.maindv,par);
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
    submenu(dv,psts){
      dv.innerHTML = "";
      let parent = this.parent;
      let kwnd = this.kmidwnd;
      let i=1;
      for(let key in psts){
        let str = kwnd.text8(key,psts[key]);
        let p = parent.geneStrImg("st"+(i++), str);
        dv.appendChild(p);
        dv.appendChild(document.createElement("BR"));
      }
    }
    updatemenu(){
      this.submenu(this.dvlist[0],this.getpstatus2());
      this.submenu(this.dvlist[1],this.getpstatus1());
    }
    menu(pdiv,parent,kwnd){
      let dvlist = [];
      {
        let childWidth = ["200px","200px","320px"];
        let childPadng = ["0px","0px","5px"];
        for(let i=0;i<childWidth.length;i++){
          let dv = generateElement(pdiv,{type:"div",id:"kmidwnd5_"+(i+1),style:{
            width:childWidth[i],padding:childPadng[i],overflow:"hidden"
          }});
          dvlist.push(dv);
        }
      }
      this.dvlist = dvlist;

      this.updatemenu();

      // 画像の表示領域
      {
        let dv = dvlist[2];
        let p = parent.geneTagImg("kaihatsuchara",this.imgsrc);
        p.classList.add("CharaShadow");
        dv.appendChild(p);
        this.imggg = p;
      }
    }
  }

  class kmidwnd3{
    constructor(wnd){
      this.kmidwnd = wnd;
      this.parent = wnd.parent;
      this.maindv;
      this.imggg;
      this.imgsrc = 'img/pictures/Actor1_5.png';
      this.fcl = ["rgba( 33, 150, 234, 0.2 )","rgba( 234, 150, 150, 0.5 )"];
      this.scl = ["rgba( 0,255,255,1 )","rgba( 255,0,255,1 )"];
      // CharaDB
      this.cdb = new charaDB();
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
          let cl = this.fcl[0];//"rgba( 33, 150, 234, 0.5 )";
          let st = this.scl[0];//"rgba( 0,255,255,1 )"
          let parlist = [
            {"id":"rect3_1","x":20,"y":10,"width":"100px","height":"100px","fill":cl,"stroke":st},
            {"id":"rect3_2","x":40,"y":190,"width":"100px","height":"100px","fill":cl},
            {"id":"rect3_3","x":140,"y":70,"width":"100px","height":"100px","fill":cl},
            {"id":"rect3_4","x":270,"y":120,"width":"100px","height":"100px","fill":cl},
            {"id":"rect3_5","x":290,"y":10,"width":"100px","height":"100px","fill":cl},
          ];
          for(let par of parlist){
            par.type = "rect";
            let p = generateSVG(svg,par);
            //let p = this.setrect(svg,par);
            p.onmouseenter = this.mevent.bind(this);
            p.onmouseleave = this.mevent.bind(this);
            p.onclick = this.mclick.bind(this);
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
        p.setAttribute("fill", this.fcl[0]);
        if(p.getAttribute("stroke")){
          p.setAttribute("stroke", this.scl[0]);
        }
      }
    }
    newwnd(){
      let e = new newWnd3(this,this.parent);
      e.newwnd();
    }

    react1(ii){
      console.log("react1 = "+ii);
      let tar = this.parent.kmsgwnd;
      let txt;//= (ii==0)? ["はいを押された"]:["いいえを押された"];
      if(ii==0){
        audioInvoke("Attack3");//Item3は成功音
        txt = ["はいを押された"];
        this.newwnd();
      }else{
        audioInvoke("Cancel2");
        txt = ["いいえを押された"];
      }
      tar.setText(txt); 
      this.reset();
    }
    mclick(e){
      this.enseitarget = e.target.id;
      audioInvoke("Cursor3");
      let tar = this.parent.kmsgwnd;
      if(e.target.id!="rect3_1"){
        let txt = ["遠征不可"];
        tar.setText(txt); 
        this.reset();
        // はい・いいえ 消す
        tar.switchpage();
      }else{
        let txt = ["ノーマ地方に、遠征討伐しますか？"];
        tar.setText(txt);
        // はい・いいえ を出す
        tar.YNwnd(this,this.react1,this.react1);
      }
    }
    mevent(e){
      if(this.enseitarget){return;}
      //console.log("mevent:"+e.type);
      let tp = (e.type=="mouseenter")? 1:0; //これがバグってた。。いつも０のバグ
      let p = e.target;
      //let cl = (tp==1)? this.fcl[1]:this.fcl[0];
      p.setAttribute("fill", this.fcl[tp]);
      if(p.getAttribute("stroke")){
        p.setAttribute("stroke", this.scl[tp]);
      }
      if(tp==1){
        let ptxt = {
          "rect3_1":["ノーマ地方。平地が多く、人口が多い。","解放済　１０　未開放　１０"],
          "rect3_2":["アストリア地方。大きな海峡を挟んだ国、森林も多い。","遠征不可"],
          "rect3_3":["リーヴェ地方。豊かな海の資源と広い平地の地方。","遠征不可"],
          "rect3_4":["シャイニングベイ。魔王の城に近く、モンスターが強い。","遠征不可"],
          "rect3_5":["ダークキャッスル。魔王の城","遠征不可"]
        };
        let txt = ptxt[e.target.id];//["なにをしますか？","行動力 １００"];
        let tarwnd = this.parent.kmsgwnd;
        tarwnd.setText(txt);
      }
    }
  }

  class kmidwnd2{
    constructor(wnd){
      this.kmidwnd = wnd;
      this.parent = wnd.parent;
      this.maindv;
      this.imggg;
      // CharaDB
      this.cdb = new charaDB();
      // メニューテキスト
      this.mtxt = ["ステータス","戦闘スキル","レベルアップ","ヒストリー"];
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
      //Reset
      this.resetpage();
    }
    resetpage(){
      this.imggg.classList.add("fadeIn");
      let d = document.getElementById("kwnd2base");
      //d.style.display = "block";
      d.classList.remove("kwnd2u1");
      this.selected = null;
      let b = document.getElementById("kwnd2base3");
      while( b && b.firstChild ){
        b.removeChild( b.firstChild );
      }
      this.updatelist(document.getElementById("kwnd2_list"));
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
      let p = this.parent.geneStrImg("kwnd2_listxt", "勇者一覧");
      dv.appendChild(p);
      for(let i=0;i<20;i++){
        let par = [10+80*(i%5),60+75*Math.floor(i/5),i];
        if(!$gameSwitches.value(21+par[2])){continue;}
        let e = new charaImg(this.cdb, par);
        let tar = e.can;
        tar.onclick = this.cfunc.bind(this);
        tar.onmouseover = this.cfunc.bind(this);
        tar.onmouseleave = this.cfunc.bind(this);
        dv.append(tar);
      }
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
            width:childWidth[i],padding:childPadng[i],overflow:"hidden",position:"relative"
          }})
          dvlist.push(dv);
        }
      }
      // 領域
      {
        let dv = dvlist[0];
        dv.id = "kwnd2base";
        let dd = generateElement(dv,{type:"div",id:"kwnd2_list",style:{padding:"10px"}})
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

      // キャラステータス
      generateElement(this.maindv,{type:"div",id:"kwnd2base3",style:{padding:"10px"}});

      // キャラ名
      {
        //let p = this.maindv
        let p = generateElement(this.maindv,{type:"div",id:"kwnd2base4"});
        this.ecan = new animationText([500,370,0]);
        let e = this.ecan;
        e.txtlist = null;
        e.id = "kwnd2base4txt";
        p.append(e.can);
      }
    }

    viewpage0(){
      let b = document.getElementById("kwnd2base3");
      while( b && b.firstChild ){
        b.removeChild( b.firstChild );
      }
      let menu = ["武力","知力","魅力"];
      let msts = [9,6,4];
      for(let i=0;i<3;i++){
        let mtxt = this.kmidwnd.textArrange(menu[i],msts[i],5);
        let e = new charaStatus([350,80+50*i,msts[i],mtxt]);
        b.appendChild(e.can);
      }
    }

    newwnd(){
      //this.maindv
      let base = document.getElementById("kwnd2base3");
      for(let i=0;i<this.mtxt.length;i++){
        let p = generateElement(base,{type:"div",classList_add:"kwnd2u2",id:"kwnd2base3m_"+i,
          style:{"animation-duration":((1*i+5)/10)+"s",padding:"5px 5px 0px 40px","z-index":15,
            position:"absolute",left:"400px",top:90+80*i+"px",width:"200px",height:"40px",background:"#008"}  
          }
        );
        let menu = this.text8(this.mtxt[i]);
        let tar = this.parent.geneStrImg(null,menu);
        tar.tarid = String(i);
        tar.onclick = this.cfunc2.bind(this);
        tar.onmouseover = this.cfunc2.bind(this);
        tar.onmouseleave = this.cfunc2.bind(this);
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
        if(p.tarid==this.mtxt.length-1){
          //this.resetpage();
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
        //this.ecan.txtlist = [this.cdb.getName(num)];
        this.ecan.resettext([this.cdb.getName(num)]);
        audioInvoke("Book1");
      }else{
        this.imggg.classList.remove("fadeIn");
      } 
    }
  }

  class kmidwnd2_old{
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
      this.resetFunc();
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
            width:childWidth[i],padding:childPadng[i],overflow:"hidden",position:"relative"
          }})
          dvlist.push(dv);
        }
      }
      // 領域
      {
        let dv = dvlist[0];
        dv.id = "kwndbase";
        let txt = ["やるぞななめ"]
        let p = parent.geneStrImg("kwnd2_txt", txt[0]);
        dv.appendChild(p);
        dv.appendChild(document.createElement("BR"));
        let d = [];
        for(let i=0;i<4;i++){
          d[i]=generateElement(dv,{type:"div",id:"kwnd2_cmd_"+(i+1),
          style:{position:"absolute",left:"-150px",top:60+(60*i)+"px",width:"200px",height:"50px",background:"#008"}});
          d[i].onclick = this.cfunc.bind(this);
          d[i].onmouseover = this.cfunc.bind(this);
          d[i].onmouseleave = this.cfunc.bind(this);
          let p = generateElement(d[i],{type:"div",
          style:{display:"none",padding:"5px 0px 5px 40px"}});
          let t = this.parent.geneStrImg(null,"すきる");
          p.append(t);
        }
        // ななめの
        generateElement(dv,{type:"div",id:"kwnd2_cover",classList_add:"kwnd2In",
        style:{display:"none","z-index":100,border: "2px solid #0000FF80",
          position:"absolute",left:"-100px",top:"0px",width:"200px",height:"400px",
          background:"#008",transform:"skewX(-20deg)"}});
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
    resetFunc(){
      let tar = document.getElementById("kwnd2_cover");
      tar.style.display = "none";
      this.resetFunc0();
    }
    resetFunc0(){
      this.clickid = null;
      for(let i=0;i<4;i++){
        let tarid="kwnd2_cmd_"+(i+1)
        let pre = document.getElementById(tarid);
        pre.classList.remove("kwnd2menu");
        pre.style.background = "#008";
        pre.style.width = "200px";
        pre.style.left = "-150px";
      }
      let base = document.getElementById("kwndbase0");
      if(base && base.parentNode){
        base.parentNode.removeChild(base);
      }
      
    }
    menuFunc(){
      this.resetFunc0();
      let tar = document.getElementById("kwnd2_cover");
      tar.style.display = "block";
      let base = document.getElementById("kwndbase");
      let dv = generateElement(base,{type:"div",id:"kwndbase0"});
      let d = [];
      for(let i=0;i<7;i++){
        let t = this.parent.geneStrImg(null,"テキストテキスト");
        d[i]=generateElement(dv,{type:"div",id:"kwnd2_cmd2_"+(i+1),
        classList_add:"kw2fin",tarval:i,
        style:{"animation-duration":((2*i+5)/10)+"s",
          position:"absolute",left:(100+15*(1-i))+"px",top:30+(40*i)+"px",
          width:"220px",height:"36px",background:"#008",paddingLeft:"60px"}});
        /*d[i].onclick = this.cfunc2.bind(this);
        d[i].onmouseover = this.cfunc2.bind(this);
        d[i].onmouseleave = this.cfunc2.bind(this);*/
        t.onclick = this.cfunc2.bind(this);
        t.onmouseover = this.cfunc2.bind(this);
        t.onmouseleave = this.cfunc2.bind(this);
        d[i].append(t);
      }
    }
    cfunc2(e){
      e.stopPropagation();
      console.log("cfunc2:type="+e.type);
      if(e.type=="click"){
        console.log("cfunc2:clicked2")
        return;
      }
      if(e.type=="mouseover"){
        //let left = e.target.parentNode.style.top;
        let tarval =  e.target.parentNode.tarval;
        let left = (100+15*(1-tarval))+"px";
        let top = e.target.parentNode.style.top;
        let ele = document.getElementById("kwnd2cur");
        if(ele){
          ele.style.left = left;
          ele.style.top = top;
        }else{
          this.pretar2 = null;
          let base = document.getElementById("kwndbase0");
          generateElement(base,{type:"div",id:"kwnd2cur",
            style:{
              position:"absolute",left:left,top:top,
              width:"270px",height:"30px",
              border: "5px solid #0000FF",
            }
          });
        }
        if(this.pretar2){
          this.pretar2.style.background = "#008"
        }
        e.target.parentNode.style.background = "#00C"
        this.pretar2 = e.target.parentNode;
      }else{
      } 
    }
    cfunc(e){
      if(e.type=="click"){
        this.menuFunc();
        return;
      }
      if(e.type=="mouseover"){
        e.target.classList.add("kwnd2menu");
        if(e.target.firstChild){
          e.target.firstChild.style.display = "block";
        }
      }else{
        e.target.classList.remove("kwnd2menu");
        if(e.target.firstChild){
          e.target.firstChild.style.display = "none";
        }
      } 
    }
  }

  class kmidwnd1{
    constructor(wnd){
      this.kmidwnd = wnd;
      this.parent = wnd.parent;
      this.maindv;
      this.imggg;
      this.psts = [20,10000,10000,100,110,120,130,140];
      this.psname = [
        "街・拠点","人口","銀","行動力",
        "農業","商業","技術","施設"
      ];
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
            "銀 "+t[1]+" と、実行力 "+t[2]+" を消費します。",
            "\\C[2]資源が足りません。"
          ];
          break;
        case "tariru":
          txt = [
            t[3]+"をすると、\\C[1]"+t[0],
            "\\C[2]銀 "+t[1]+" と、実行力 "+t[2]+" を消費します。",
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
      this.maindv = this.kmidwnd.createDIV(pdiv);
      this.kkk();
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
      // すでに選んでいれば処理しない
      //if(this.targetfunc != ""){return;}
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
      //DBG//console.log("hover-hfunc:"+e.type);
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
    kkk(){
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
      // Split ?
      {
        let dv = dvlist[0];
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

      // 画像の表示領域
      {
        let dv = dvlist[1];
        let p = parent.geneTagImg("kaihatsuchara",this.imgsrc);
        p.classList.add("CharaShadow");
        dv.appendChild(p);
        this.imggg = p;
      }
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
        let txt = this.psname;/*["街・拠点","人口","銀","行動力",
        "農業","商業","技術","施設"];*/
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
        //let txt = ["農地開拓","商業活性","技術開発","公共工事"];
        //let role = ["kaitaku","kassei","gijyutu","koukyou"];
        let txt = this.roletxt;
        let role = this.roleid;
        for(let i=0;i<n;i++){
          let dbtn = generateElement(list[i], {type:"div",id:"kmidwnd_btn"+(i+1),style:{
            margin:"10px 15px",padding:"10px 30px",width:"104px",height:"36px",background:"#000"
          }});
          let timg = parent.geneStrImg("kaihatsu_"+(i+1),txt[i]);//104(=26x4)x36
          timg.kaihatsutext = txt[i];
          timg.kaihatsurole = role[i];
          timg.onclick = this.cfunc.bind(this);
          timg.onmouseover = this.hfunc.bind(this);
          timg.onmouseleave = this.hfunc.bind(this);
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

  class kmidwnd0{
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

  class kmidwnd{
    constructor(parent){
      this.parent = parent;
      this.idlist = {"mid1":0,"mid2":1,"mid3":2,"mid4":3,"mid5":4};
      this.divlist = [];
      let clist = [kmidwnd1,kmidwnd2,kmidwnd3,kmidwnd0,kmidwnd5];
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
    createDIV(pdiv){
      let par = {type:"div",style:{display:"none",width:"100%",height:"100%",backgroundColor:"#000"}};
      return generateElement(pdiv,par);
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
    text8(a,b){
      let w1 = toFullWidth(a);
      let w2 = String(b);
      let l1 = w1.length;
      let l2 = w2.length;
      let l0 = 12 - 2*l1 - l2;
      //DBG//console.log("l0,l1,l2:"+[l0,l1,l2]);
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
      //let gp = $gameParty.battleMembers(); // 配列
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
      //if(this.previousid == id){return;}
      //this.previousid = id;
      let p = document.getElementById(id);
      //DBG//console.log(e.type);
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
          position:"absolute",display:"none",right:"20px",bottom:"30px",width:"120px",height:"60px"}};
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
        timg.onclick = this.cfunc.bind(this);
        timg.onmouseover = this.hfunc.bind(this);
        timg.onmouseleave = this.hfunc.bind(this);
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
        margin:"10px 5px",padding:"10px 10px",width:"80px",height:"36px",background:"#000"
       }});
        let timg = parent.geneStrImg(sid,txt);
        timg.onclick = this.cfunc2.bind(this);
        timg.onmouseover = this.hfunc.bind(this);
        timg.onmouseleave = this.hfunc.bind(this);
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

  class kaihatsuclass{
    constructor(ids){
      this.name = "kaihatsuclass";
      //＝＝＝ 入力文字列を数字の配列にする
      let aa = ids.split(',');
      this.ids = aa.map(Number);
      //console.log(this.name+"::isArray="+Array.isArray(this.ids)+":"+this.ids);
      //＝＝＝ 数字の配列かどうかチェック
      if(this.ids.length < 7){
          alert("NeneSystem.js::Given parameter is wrong. \""+ids+"\"\nPlease check plugin parameter. ");
          // 起動時、ワザとエラーにする
          NeneSystemClass_initERROR1 = "ERROR";
      }
      for(let cc of this.ids){
        if(typeof cc != "number"){
          alert("NeneSystem.js::Given parameter is wrong. \""+ids+"\"\nPlease check plugin parameter. ");
          // 起動時、ワザとエラーにする
          NeneSystemClass_initERROR2 = "ERROR";
        }
      }
      console.log(this.name+", Init Success. "+this.ids);

      // 初期化
      this.init();
    }
    init(){
      this.mode = 0;
      this.menFunc = TouchInput.update; // 確保する。関数定義を持ってきた方が良いかもだが・・・
      this.mdsFunc = function() {}; // 無効化の書き方
      this.dflag = false;
      this.kmenu = new kmenu(this);
      this.kmidwnd = new kmidwnd(this);
      this.kmsgwnd = new kmsgwnd(this);
      // 表示領域の初期化
      this.initflag=0;
      // For imagchange
      this.prernd1 = -1;
      this.prernd2 = -1;
    }
    initCanvas(){
      //let [gcw,gch] = [window.innerWidth,window.innerHeight];
      let gwnd = document.getElementById("gameCanvas");
      //gwnd = window;
      let [gcw,gch] = [gwnd.width,gwnd.height];
      console.log([gcw,gch]);
      let [pad,mgn] = [10,30];
      let [x,y,w,h] = [mgn-pad,mgn-pad,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
      // use generateElement, 13 lines => 5 lines.
      let par = {type:"div",id:"kaihatsumap",style:{
        position:"relative",display:"none",backgroundColor:"#000",color:"#FFF",
        left:x+'px',top:y+'px',width:w+'px',height:h+'px',zIndex:10,padding:pad+'px',
      }};
      generateElement(document.body, par);
    }
    imgchange(tar){
      console.log("imgchange: "+tar.wndid);
      if(tar.wndid==3){ // 商人
        let imglist = [
          "People4_5","People4_1","People2_8","People1_4","People4_3",
          "People2_1","People3_3","SF_People1_1","People2_2","Nature_7"
        ];
        let n = imglist.length;
        let rnd = Math.floor(Math.random()*n);
        rnd = this.prernd2; // ランダムにしない
        //if(this.prernd2 == rnd){rnd = (rnd+1)%n;}
        if(this.prernd2 == rnd){
        for(let i=0;i<10;i++){
          rnd = (rnd+1)%n;
          if($gameSwitches.value(31+rnd)){break;}
        }}
        this.prernd2 = rnd;
        tar.imggg.src = 'img/pictures/'+imglist[rnd]+'.png';
      }
      if(tar.wndid==1 || tar.wndid==2){ // 勇者
        let imglist = [
          "Actor1_5","Actor2_2","Actor1_8","Actor3_1","People3_7",
          "Actor2_7","Actor1_7","Actor3_4","Actor2_4","Actor3_2"
        ];
        let n = imglist.length;
        let rnd = Math.floor(Math.random()*n);
        rnd = this.prernd1; // ランダムにしない
        //if(this.prernd1 == rnd){rnd = (rnd+1)%n;}
        if(this.prernd1 == rnd){
        for(let i=0;i<10;i++){
          rnd = (rnd+1)%n;
          if($gameSwitches.value(21+rnd)){break;}
        }}
        this.prernd1 = rnd;
        tar.imggg.src = 'img/pictures/'+imglist[rnd]+'.png';
      }
    }

    kaihatsuEndFunc(e){
      //DBG//console.log(e);
      e.stopPropagation();
      this.clickfuncCore(0); // 開発END
      // DBG
      this.kmidwnd.divlist[0].psts[3] = 100;
    }
    clickfuncCore(inp){
      this.mode = inp;
      TouchInput.update = (this.mode==0) ? this.menFunc : this.mdsFunc;
      console.log("clickfunc"+this.mode);
      this.kaihatsushow(this.mode);
      $gameVariables.setValue(this.ids[0], 1-inp);
    }
    // clickfunc したら呼ばれる
    kaihatsushow(inp){
      if(this.initflag==0){
        this.initCanvas();
        this.initflag=1;
      }
      let p = document.getElementById("kaihatsumap");
      p.style.display = (inp==0)? "none":"block";
      //DBG//console.log("this.menFunc: "+this.menFunc);
      //DBG//console.log(TouchInput.update);
      // リサイズ呼んでおく
      resizeKaihatsu();
      this.initdatashow();
      // 入るときの初期化
      this.kmidwnd.initpage();
    }
    // 一回だけ呼ばれる（初期化のタイミングでは $gameParty とか理由で呼べない）
    initdatashow(){
      if(this.dflag){return;}
      this.dflag = true;
      let d = document.getElementById("kaihatsumap");
      // テーブルメニュー
      this.kmenu.init(d);
      //文字表示領域
      this.kmidwnd.init(d);
      // 下パーティション
      this.kmsgwnd.init(d);
    }

    // 文字説明を変更
    switchexp(tid){
      let msg = {
        "mid1":["内政開発をします","生産力をあげて、街を大きくします"],
        "mid2":["人材編成をします","各メンバーの能力アップをします"],
        "mid3":["遠征討伐をします","モンスターに制圧された地域を開放します"],
        "mid4":["交易商売をします","交易や為替などで利益を出します"],
        "mid5":["なにをしますか？"]
      };
      this.kmsgwnd.setText(msg[tid]);
    }
    // 変更
    switch(tar,type){
      this.kmidwnd.switch(tar,type);
    }

    // テーブルを作る
    gentable(pdiv,prefix,nr,nc){
      let list = [];
      // テーブル
      const tbl = generateElement(pdiv,{type:"table",style:{width:"100%"}});
      const tblBody = generateElement(tbl,{type:"tbody"});
      for(let i1=0;i1<nr;i1++){
        const row = generateElement(tblBody,{type:"tr"});
        for(let i2=0;i2<nc;i2++){
          const cell = generateElement(row,{type:"td",id:prefix+"_"+i1+"_"+i2,
            style:{width:(100/nc)+"%",textAlign:'center'}});
          list.push(cell);
        }
      }
      return list;
    }

    // 画像を渡して、IMG要素でもらえる
    geneTagImg(sid,src){
      let p = document.createElement("img");
      p.id = sid;
      p.src = src;
      return p;
    }
    // テキストを画像にする関数、IMG要素でもらえる
    geneStrImg(sid,inptxt){
      return this.geneTagImg(sid,this.getImgSrcFromTEXT(inptxt));
    }
    // For Image.src
    getImgSrcFromTEXT(txt){
      // ＝＝＝ 参考になった素晴らしいページ ＝＝＝
      // https://www.programmingmat.jp/webhtml_lab/canvas_image.html
      // http://tonbi.jp/Game/RPGMakerMV/009/
      let aa = generateTextBmp(txt);
      return aa.context.canvas.toDataURL();
    }
  }

  var current = document.currentScript.src;
  let matchs = current.match(/([^/]*)\.js/);
  let modname = matchs.pop();

  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['arrayIDs'];
  const kaihatsu = new kaihatsuclass(paraids);

  // リサイズ関係
  function resizeKaihatsu(){
    let ga = [0,0,window.innerWidth,window.innerHeight];
    let km = document.getElementById("kaihatsumap");
    if(km){
      let [w,h] = [816-30,624-30];//[736,544]; //padding:10,border:5;
      let l =(ga[2]-w)/2;
      let t =(ga[3]-h)/2;
      //DBG//console.log("Resize! "+[l,t]);
      km.style.left = l+"px";
      km.style.top  = t+"px";
      //=== StyleSheet:transform ===
      let gc = document.getElementById("gameCanvas");
      let [ww,hh] = [gc.width,gc.height]; // 816x624
      let [sw,sh] = [parseInt(gc.style.width,10),parseInt(gc.style.height,10)];
      console.log("gameCanvas:"+[ww,hh,sw,sh]);
      // transform need ?
      if(sw!=ww && sh!=hh){
        let [ax,ay] = [(sw/ww),(sh/hh)];//[(ga[2]/w),(ga[3]/h)];
        let aa = (ax < ay)? ax : ay;
        km.style.transform = "scale("+aa+", "+aa+")";
      }else{
        km.style.transform = "";//ちゃんと消す！
      }
    }
  }
  window.addEventListener('resize', resizeKaihatsu);
  // F4 対策
  // https://shanabrian.com/web/javascript/keycode.php
  window.onkeydown = function(event) {
    var keyCode = false;  
    if (event) {
      if (event.keyCode) {
        keyCode = event.keyCode;
      } else if (event.which) {
        keyCode = event.which;
      }
    }
  
    //alert(keyCode);
    // 111:F1=112,F12=123
    //DBG//console.log("keycode="+keyCode);
    if(111<keyCode && keyCode<=123){
      //DBG//console.log("keycode work")
      for(let i=0;i<1000;i+=10){
        setTimeout(resizeKaihatsu,i);
      }
    }
  };

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */
  /* FUNC1 */
  PluginManager.registerCommand(modname, "enter", args => {
    kaihatsu.clickfuncCore(1); // 開発START
  });

})();
