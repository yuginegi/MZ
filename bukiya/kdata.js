//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンドのデータ集
 * @author wasyo
 *
 * @help kdata.js
 *
 * 商人の最終章コマンド。開発など
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

class kjyodata{
  constructor(){
    this.psname = [
      "街・拠点","人口","銀","行動力",
      "農業","商業","技術","施設"
    ];
    this.psts = [20,10000,10000,100,110,120,130,140];
    console.log("kjyodata constructor");
  }
  bindMoneyFunc(tar){
    bindFuncListInit(tar,this,["getMoney","updMoney"]);
  }
  getMoney(){
    return this.psts[2];
  }
  updMoney(val){
    this.psts[2] = val;
  }
  // 行動力の回復
  ResetActivePower(){
    this.psts[3] = 100;
  }
}

class kmapdata{
  constructor(){
    this.fcl = ["rgba( 33, 150, 234, 0.2 )","rgba( 234, 150, 150, 0.5 )"];
    this.scl = ["rgba( 0,255,255,1 )","rgba( 255,0,255,1 )"];
    let cl = this.fcl[0];//"rgba( 33, 150, 234, 0.5 )";
    let st = this.scl[0];//"rgba( 0,255,255,1 )"
    this.parlist = [
      {"id":"rect3_1","x":20,"y":10,"width":"100px","height":"100px","fill":cl
    /*,"stroke":st*/},
      {"id":"rect3_2","x":40,"y":190,"width":"100px","height":"100px","fill":cl},
      {"id":"rect3_3","x":140,"y":70,"width":"100px","height":"100px","fill":cl},
      {"id":"rect3_4","x":270,"y":120,"width":"100px","height":"100px","fill":cl},
      {"id":"rect3_5","x":290,"y":10,"width":"100px","height":"100px","fill":cl},
    ];
    this.maptext = {
      "rect3_1":["ノーマ地方。平地が多く、人口が多い。","遠征不可"],
      "rect3_2":["アストリア地方。大きな海峡を挟んだ国、森林も多い。","遠征不可"],
      "rect3_3":["リーヴェ地方。豊かな海の資源と広い平地の地方。","遠征不可"],
      "rect3_4":["シャイニングベイ。魔王の城に近く、モンスターが強い。","遠征不可"],
      "rect3_5":["ダークキャッスル。魔王の城","遠征不可"]
    };
    this.mapname = {
      "rect3_1":"ノーマ地方",
      "rect3_2":"アストリア地方",
      "rect3_3":"リーヴェ地方",
      "rect3_4":"シャイニングベイ",
      "rect3_5":"ダークキャッスル"
    }
    this.mapopened = [1,1,1,1,1];
    // 開いていればデータ更新
    for(let i=0;i<5;i++){
      let key = "rect3_"+(i+1);
      if(this.mapopened[i]==1){
        this.maptext[key][1] = "解放済　１０　未開放　１０";
        this.parlist[i]["stroke"] = st;
      }
    }
    //[[20,20,1],[150,80,1],[270,140,1],[20,260,1]];
    this.enelist = {
      "rect3_1":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]],
      "rect3_2":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]],
      "rect3_3":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]],
      "rect3_4":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]],
      "rect3_5":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]]
    }
  }
  getenelist(name){
    return this.enelist[name];
  }
  getNMfromMAPName(name){
    return this.mapname[name];
  }
  getXYfromMAPName(name){
    let id = this.getidfromname(name);
    let e = this.parlist[id];
    return [e["x"],e["y"]];
  }
  getidfromname(name){
    for(let i=0;i<5;i++){
      if(name == "rect3_"+(i+1)){return i;}
    }
    return -1;
  }
  isopen(id){
    let ii = this.getidfromname(id);
    return this.mapopened[ii];
  }
  chgAttr(p,tp){
    p.setAttribute("fill", this.fcl[tp]);
    if(p.getAttribute("stroke")){
      p.setAttribute("stroke", this.scl[tp]);
    }
  }
}

class chardata{
  constructor(){
    this.skilldata = new skillData();
    // For imagchange
    this.prernd1 = -1;
    this.prernd2 = -1;
    console.log("chardata constructor");
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
  getpstatusAll(){
    let p = {"勇者":0,"商人":0};
    for(let i=0;i<10;i++){
      p["勇者"] += ($gameSwitches.value(21+i)==true);
      p["商人"] += ($gameSwitches.value(31+i)==true);
    }
    return p;
  }
  getpstatus(tar){
    let p = this.getpstatusAll();
    return p[tar];
  }
  getpcharlist(s=0,e=20){
    let list = [];
    for(let i=s;i<e;i++){
      if(i==5||i==7||i==14||i==17){continue;}//DEBUG//
      if($gameSwitches.value(21+i)==true){
        list.push(i);
      }
    }
    return list;
  }
  isCharFlag(par){
    return $gameSwitches.value(par);
  }
}

class charaDB{
  constructor(){
    //-- Player ---
    this.namelist = [
      "ユウ","セシリア","アイリン","ゾード","ザイン",
      "ケイン","リュート","ルーシア","ミンミン","カーラ",
      "フゴウ","ダンテ","ウルスラ","サファイア","エドガー",
      "ギース","星の王子","クロイス","レオナ","光の女神"
    ];
    this.pictlist = [
      "Actor1_5","Actor2_2","Actor1_8","Actor3_1","People3_7",
      "Actor2_7","Actor1_7","Actor3_4","Actor2_4","Actor3_2",
      "People4_5","People4_1","People2_8","People1_4","People4_3",
      "People2_1","People3_3","SF_People1_1","People2_2","Nature_7"
    ];
    let imgfilelist = [
      "Nature","Actor1","Actor2","Actor3",
      /*+3*/"People1","People2","People3","People4",
      /*+7*/"SF_People1"
    ];
    this.parlist = [
      [1,5],[2,2],[1,8],[3,1],[6,7],
      [2,7],[1,7],[3,4],[2,4],[3,2],
      /*"People4_5","People4_1","People2_8","People1_4","People4_3",
      "People2_1","People3_3","SF_People1_1","People2_2","Nature_7"*/
      [7,5],[7,1],[5,8],[4,4],[7,3],
      [5,1],[6,3],[8,1],[5,2],[0,7],
    ];
    //=== File Reading. =======
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
    // ATTACKLIST
    this.attackhash = {};
    // ATTACKAREA
    this.attackarea = {};
  }
  getAttachRhash(tar=null){
    let h = {};
    for(let k in this.attackhash){
      let t = -1;
      if(tar==null){
        t = this.attackhash[k];
      }else if(tar==this.attackhash[k]){
        t = tar;
      }else{continue;}
      if(h[t]==null){h[t]=[];}
      h[t].push(Number(k));
    }
    return h;
  }
  get(id){
    let par = this.parlist;
    let img = this.imglist[par[id][0]];
    return [img, par[id][1]];
  }
  getFace(id){
    let par = this.parlist;
    let img = this.facelist[par[id][0]];
    return [img, par[id][1]];
  }
  getName(id){
    let list = this.namelist;
    return list[id];
  }
  getPict(id){
    let list = this.pictlist;
    return list[id];
  }
  getMonImg(){
    return this.monimg;
  }
  getStatus(id){
    let sts = [
      [7,5,5],[8,0,6],[0,8,6],[7,7,0],[10,0,0],
      [5,7,5],[0,4,9],[0,10,0],[5,5,7],[4,0,9]
    ];
    return sts[id%10];
  }
}
class charaAttackView{
  constructor(){

  }
}
class charaImg{
  constructor(cdb,args,draggable=false,par=null){
    this.cdb = cdb;
    [this.img,this.cid]= cdb.get(args[2]);
    this.charaid = args[2];
    // Init
    this.xx = args[0];
    this.yy = args[1];
    this.can = generateElement(null,{type:"canvas",id:"chara_"+args[2],width:48,height:48, 
    style:{"z-index":51,position:"absolute",left:args[0]+"px",top:args[1]+"px"}});
    this.ctx = this.can.getContext("2d");
    // For Drag
    this.can.addEventListener("mousedown", this.func1.bind(this) ) ;
    this.draggable = draggable;
    this.par = par;
    // loop
    this.tt = 0;
    setInterval(this.draw.bind(this),250);
  }
  move(event){
    if(this.dragging!=1){return;}
    var drag = this.can;
    let [xx,yy]=[event.pageX - this.ox,event.pageY - this.oy];
    this.par.movetarget(this.charaid,xx,yy);
    //要素内の相対座標で移動
    drag.style.top  = yy + "px";
    drag.style.left = xx + "px";
  }
  func2(event){
    if(this.dragging!=1){return;}
    var drag = this.can;
    this.dragging = 0;
    let [xx,yy]=[event.pageX - this.ox,event.pageY - this.oy];
    this.par.settarget(this.charaid,xx,yy);
    //元の位置に戻る
    drag.style.top = this.yy + "px";
    drag.style.left = this.xx + "px";
    //ここでおしまい
    document.body.removeEventListener("mousemove", this.move.bind(this) ) ;
    document.body.removeEventListener("mouseup", this.func2.bind(this) ) ;
  }
  func1(event){
    console.log("func invoked.");
    if(this.grayout){
      console.log("grayout invoked.");
      this.par.updateCharaPage(this.charaid);
      return;
    }
    if(!this.draggable){return;}
    if(this.dragging==1){return;}
    this.dragging = 1;
    this.par.updateCharaPage(this.charaid);
    //要素内の相対座標を取得
    this.ox = event.pageX -this.xx;
    this.oy = event.pageY -this.yy;
    //ここから開始
    document.body.addEventListener("mousemove", this.move.bind(this) ) ;
    document.body.addEventListener("mouseup", this.func2.bind(this) ) ;
  }
  setdraw(flag){
    this.setflag=flag;
  }
  draw(){
    const ctx = this.ctx;
    ctx.clearRect(0,0,48,48);
    if(this.setflag){
      ctx.fillStyle = "#0000FF80";
      ctx.fillRect(0,0,48,48);
    }
    if(this.grayout){
      ctx.globalAlpha  = 0.5;
    }
    let ii = this.cid-1;
    let ll = [0,1,2,1]
    let [x,y]=[3*(ii%4)+ll[(this.tt++)%4], 4*Math.floor(ii/4)];
    ctx.drawImage(this.img,48*x,48*y,48,48,0,0,48,48);
    if(this.grayout){
      ctx.globalAlpha  = 1;
    }
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
class charaStatusView{
  //this.charatarget,this.cdb,b
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

    // 武器防具
    let bukibougu4 = ["武器LV4","アイスブリンガー","防具LV4","ドラゴンアーマー"]
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

class skillData{
  constructor(){
    // キャラごとに保存
    this.ulist = [];
    for(let i=0;i<20;i++){
      this.ulist[i] = Array(50).fill(0);
    }
 
    // SkillMap
    this.skillInit();

    // icon
    this.iconpar = {
      1:[2,10],2:[5,10],3:[4,10],4:[3,10],5:[1,10],
      100:[0,10],
      6:[1,6],7:[9,8],
      8:[5,6],9:[10,11],10:[15,11],
      11:[0,2],12:[2,2],13:[3,2],14:[4,2],15:[7,2],
      16:[13,4],17:[9,4],18:[2,5],19:[15,4],20:[7,5],
    };
    this.ico = new Image();
    this.ico.src = "img/system/IconSet.png";
  }
  getulist(id){
    return this.ulist[id];
  }
  skillInit(){
    this.slist0 = [
      1,1,1,1,1,1,1,1,1,1,
      2,2,2,2,2,2,2,2,2,2,
      3,3,3,3,3,3,3,3,3,3,
      6,6,7,7,8,8,9,9,10,10,
      11,12,13,14,15,16,17,18,19,20
    ];
    
    this.slist10 = [
      4,4,4,4,4,4,4,4,4,4,
      100,100,100,100,100,100,100,100,100,100,
      5,5,5,5,5,5,5,5,5,5,
      6,6,7,7,8,8,9,9,10,10,
      6,6,7,7,8,8,9,9,10,10,
    ];

    this.slist = [
      1,1,1,1,1,1,1,1,1,1,
      2,2,2,2,2,2,2,2,2,2,
      3,3,3,3,3,3,3,3,3,3,
      6,6,6,6,6,7,7,7,7,7,
      8,8,8,8,9,9,9,9,10,10,
    ];

    this.skiilmsg = {
      1:"武を上げる",2:"知を上げる",3:"魅を上げる",
      4:"経を上げる",100:"産を上げる",5:"技を上げる",
    };
  }
  getslist(id){
    if(id==0){
      return this.slist0;
    }
    if(id>=10){
      return this.slist10;
    }
    return this.slist;
  }
}
class skillTree{
  constructor(parent,skd,cdb,num){
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
      // Event handler
      cav.onclick      = this.cfunc.bind(this);
      cav.onmouseover  = this.cfunc.bind(this);
      cav.onmouseleave = this.cfunc.bind(this);
    }
    this.draw();
    //=== 
    let par = [10,10,this.num];
    console.log("kaihatsu.js:");
    console.log(par);
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
     2:["戦力アップ","大魔導士の才能"],
     3:["英知の号令"],
     4:["豪傑"],
     5:[],
     6:[],
     7:["魔導の神髄"],
     8:["明日への希望"],
     9:["剣聖"],
    };
    return (txt[id].length>0)?txt[id]:null;
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
    }
    let ii = this.cid-1;
    let ll = [0,1,2,1]
    let [x,y]=[3*(ii%4)+ll[(this.tt++)%4], 4*Math.floor(ii/4)];
    ctx.drawImage(this.img,48*x,48*y,48,48,0,0,48,48);
  }
}

//=====================================================================
