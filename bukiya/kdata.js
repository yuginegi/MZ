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
    // ＜行動力は外部の数字＞
    this.psname = [
      "街・拠点","人口","銀","行動力",
      "農業","商業","技術","施設"
    ];
    this.psts = [20,10000,10000,100,110,120,130,140];
    this.kome = 10000;
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
  ReflectActivePower(){
    let hh = $gameVariables.value(20);
    console.log("ReflectActivePower:",this.psts[3], hh);
    hh.ap  = this.psts[3]; // Update
    $gameVariables.setValue(20, hh); // Write
  }
  initActivePower(){
    let hh = $gameVariables.value(20);
    this.psts[3] = hh.ap; // Read
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
      ctx.fillStyle = "#00FF0080";
      ctx.fillRect(0,0,48,48);
    }
  }
}

class kmapdata{
  constructor(par){
    this.parent = par;
    this.fcl = ["rgba( 33, 150, 234, 0.2 )","rgba( 234, 150, 150, 0.5 )"];
    this.scl = ["rgba( 0,255,255,1 )","rgba( 255,0,255,1 )"];
    let cl = this.fcl[0];//"rgba( 33, 150, 234, 0.5 )";
    let st = this.scl[0];//"rgba( 0,255,255,1 )"
    //*** MAP関係（セットで引くからこのままでよい）***
    this.parlist = [
      {"id":"rect3_1","x":20, "y":10, "width":100,"height":100,"fill":cl},
      {"id":"rect3_2","x":40, "y":190,"width":100,"height":100,"fill":cl},
      {"id":"rect3_3","x":140,"y":70, "width":100,"height":100,"fill":cl},
      {"id":"rect3_4","x":270,"y":120,"width":100,"height":100,"fill":cl},
      {"id":"rect3_5","x":290,"y":10, "width":100,"height":100,"fill":cl},
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
    //*** 下で管理するべきかも  ***
    this.mapopened = [1,0,0,0,0];
    // 開いていればデータ更新
    for(let i=0;i<5;i++){
      let key = "rect3_"+(i+1);
      if(this.mapopened[i]==1){
        this.maptext[key][1] = "解放済　１０　未開放　１０";
        this.parlist[i]["stroke"] = st;
      }
    }
    /*** 敵の情報 ******/
    this.enelist = {
      "rect3_2":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]],
      "rect3_3":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]],
      "rect3_4":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]],
      "rect3_5":[[20,20,1],[150,80,1],[270,140,1],[20,260,1]]
    }
    this.enedata = {}
    this.edetail = {};
    this.enestatus =  {};
    // ここで詰める
    console.log("kmapdata Initialize")
    let alist = {"rect3_1":kd3_1};
    for(let a in alist){
      let p = new alist[a]();
      this.enelist[a]=p.data["enelist"];
      this.enedata[a]=p.data["edata"];
      this.edetail[a]=p.data["edetail"];
      this.enestatus[a]=p.data["estatus"];
    }
  }
  setEneStatus(name,id,key,val){
    let enedt = this.enestatus;
    if(enedt[name] && enedt[name][id]){
      //DBG//console.log(key,val,enedt[name][id],enedt[name][id][key])
      enedt[name][id][key] = val;
    }
  }
  getEneImg(dv,eimg){
    let sz = ("Dragon.png"==eimg) ? 300:150;
    let par = {type:"div",style:{width:sz+"px",height:sz+"px",overflow:"hidden"}};
    let div = generateElement(dv,par);
    let im = document.createElement("img");
    this.imgsize = sz;    
    im.onload = () => {
      if(im.width > this.imgsize){
        im.width = this.imgsize;
      } 
    };
    im.src = "img/enemies/"+eimg;
    div.append(im);
  }
  getEneStatus(name,id){
    let enedt = this.enestatus;
    if(enedt[name] && enedt[name][id]){return enedt[name][id];}
    return {type:"武",hp:100,mhp:100,atk:100};
  }
  getEneInfo(name,id){
    let enedt = this.enedata;
    if(enedt[name] && enedt[name][id]){return enedt[name][id];}
    return ["草原 "+id,"ゴブリン","Goblin.png",100];
  }
  getEnePicts(dv,name,id){
    console.log("getEnePicts:"+[name,id]);
    let enedt = this.edetail;
    let dt = (enedt[name] && enedt[name][id]) ? enedt[name][id] : {num:3,xx:[50,100,50],yy:[50,170,290],img:"Goblin.png"};
    for(let i=0;i<dt.num;i++){
      let [x,y] = [dt.xx[i],dt.yy[i]];
      let par = {type:"img",src:"img/enemies/"+dt.img,style:{position:"absolute",left:x+"px",top:y+"px"}};
      generateElement(dv,par);
    }
    let est = this.getEneStatus(name,id);
    {
      let [x,y,w,h] = [150,10,350,30];
      let wlist = [w,w*(est.hp/est.mhp)];
      let clist = ["#FF0000","#FFFF00"];
      for(let i=0;i<2;i++){
        let par = {type:"div",style:{
          position:"absolute",left:x+"px",top:y+"px",width:wlist[i]+"px",height:h+"px",
          background:clist[i]
        }};
        generateElement(dv,par);
      }
    }
    {
      let [x,y] = [10,10];
      let par = {type:"div",style:{
        position:"absolute",left:x+"px",top:y+"px"
      }};
      let dv0 = generateElement(dv,par);
      let t = this.parent.geneStrImg(null,"HP "+est.hp);
      dv0.appendChild(t);
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
    return [e["x"],e["y"],e["width"],e["height"]];
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

class chardata{ // FROM kaihatsuclass
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
      return 10+rnd;
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
      //if(i==5||i==7||i==14||i==17){continue;}//DEBUG//
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

class charaDB{ // FROM kaihatsuclass
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
    // 絵のパラメータ（０：imgfilelist、１："_X"）
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
    // ATTACKLIST , ATTACKAREA
    this.attackhash = {};
    this.attackarea = {};
    // キャラのパラメータ（武力、知力、魅力）
    this.chapsts = {}; 
    let cp = [
    [7,5,5],[8,0,6],[0,8,6],[7,7,0],[10,0,0],
    [5,7,5],[0,4,9],[0,10,0],[5,5,7],[4,0,9]
    ];
    for(let i=0;i<20;i++){
      let sts ={};
      sts["st"] = cp[i%10];
      sts["hp"] = 10000;
      this.chapsts[i] = sts;
    }
  }
  getAttackAll(){
    return [this.attackhash,this.attackarea];
  }
  setAttackData(id,h,a){
    this.attackhash[id] = h;
    this.attackarea[id] = a; 
  }
  getAttachRhash(area=null,tar=null){
    //DBG//console.log("getAttachRhash",area,tar);
    let h = {};
    for(let k in this.attackhash){
      //DBG//console.log("getAttachRhash",k,this.attackhash[k],this.attackarea[k]);
      // もし違うエリアならぬけていいんじゃないかな
      if(area != this.attackarea[k]){continue;}
      let t = -1;
      if(tar==null){
        t = this.attackhash[k];
      }else if(tar==this.attackhash[k]){
        t = tar;
      }else{continue;}
      if(h[t]==null){h[t]=[];}
      //DBG//console.log("getAttachRhash",t,k);
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
    return this.chapsts[id]["st"];
  }
  getStatusHP(id){
    return this.chapsts[id]["hp"];
  }
  setStatusHP(id,hp){
    this.chapsts[id]["hp"] = hp;
  }
}

class charaAttackView{
  constructor(){}
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
    this.tt--;
    this.draw();
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
    ctx.drawImage(this.img,144*x,144*y,144,144,0,0,144,144);
  }
}

class skillData{
  constructor(){
    // キャラごとに保存
    this.ulist = [];
    this.weaponlv = [];
    for(let i=0;i<20;i++){
      this.ulist[i] = Array(50).fill(0);
      this.weaponlv[i] = [0,0];//武器・防具
    }

    // SkillMap
    this.skillInit();

    // icon（レベルアップのアイコン）
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

  skillInit(){
    this.slist0 = [
      1,1,1,1,1,1,1,1,1,1,
      2,2,2,2,2,2,2,2,2,2,
      3,3,3,3,3,3,3,3,3,3,
      6,6,6,6,6,7,7,7,7,7,
      11,12,13,14,15,16,17,18,19,20
    ];
    //6,6,7,7,8,8,9,9,10,10,
    
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
      6:"武器LV上げる",7:"防具LV上げる",
    };
  }

  getulist(id){
    return this.ulist[id];
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

  getWeaponSkillLV(id){
    let slist = this.getslist(id);
    let ulist = this.getulist(id);
    let ret = [0,0];
    for(let i=0;i<50;i++){
      if(slist[i]==6){
        ret[0] += ulist[i];
        continue;
      }
      if(slist[i]==7){
        ret[1] += ulist[i];
        continue;
      }
    }
    return ret;
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
    return (txt[id]&&txt[id].length>0)?txt[id]:null;
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

//=====================================================================
