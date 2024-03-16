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
      [7,5,5],[8,0,6],[0,8,6],[7,7,0],[20,0,0],
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
    let w0 = ((this.cansz[0]-x)/20)*(this.val);
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
  getMoney(){
    return this.parent.kmidwnd.divlist[0].psts[2];
  }
  updMobey(val){
    this.parent.kmidwnd.divlist[0].psts[2] = val;
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
        this.updMobey(mn-mc);
        let ele = document.getElementById("gindiv");
        this.viewMoney(ele,(mn-mc));
        this.draw();
      }else{
        this.parent.kmsgwnd.setText(["銀が足りない"]);
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
