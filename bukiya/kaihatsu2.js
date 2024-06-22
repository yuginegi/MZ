//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンド パート２
 * @author wasyo
 *
 * @help kaihatsu2.js
 *
 * 商人の最終章コマンド。ステータス
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

//=====================================================================

// charaStatusView から 呼ばれるだけ。「ステータス」
class charaStatusCanvas{
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

//「ステータス」を押下した時のクラス
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
  draw(){
    // charaStatusCanvas の draw を呼ぶ
    for(let cc of this.elist){cc.draw();}
  }
  init(){
    let id = this.tar;
    // drawの初期化
    let msts = this.getStatus(id);
    let msts2 = this.getSkillExt(id);
    let menu = (id<10)? ["武力","知力","魅力"] : ["経済","産出","技術"];
    for(let i=0;i<3;i++){
      let mtxt = this.textArrange(5, menu[i],msts[i],msts2[i]);
      this.elist[i] = new charaStatusCanvas([350,80+50*i,msts[i],msts2[i],mtxt]);
      this.base.appendChild(this.elist[i].can);
    }
    // 勇者用
    if(id<10){this.initBrave(id);}
    // 商人用
    else{}
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

  //=== 勇者用 =======
  initBrave(id){
    // 武器防具
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
      let mtxt = this.parent.geneStrImg(null,status4[i]);
      mtxt.style.position = "absolute"; 
      mtxt.style.left = (370+(i%2)*190)+"px"; 
      mtxt.style.top  = (240+40*(i>=2))+"px";
      this.base.appendChild(mtxt);
    }
  }
  getWeapon(id){
    let [wep,def] = this.parent.chardata.skilldata.weaponlv[id];
    let wname = ["剣","ロングソード","ミスリルソード","ルーンブレイド","アイスブリンガー","ブレイブカリバー"];
    let dname = ["鎧","ブロンズアーマー","ミスリルアーマー","ゴールドアーマー","ドラゴンアーマー","クリスタルメイル"];
    return ["武器LV"+wep,wname[wep],"防具LV"+def,dname[def]];
  }
}

//「レベルアップ」を押下した時のクラス
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
    this.wnd2core = new kmidwnd2core(this,wnd,kmidwnd2coreFunc);
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

class kmidwnd2coreFunc{
  constructor(p){
    this.pclass = p;
    p.kbid = "kwnd2base";
    p.mainid = "kwnd2base3";
    p.listid = "kwnd2_list";
    // メニューテキスト
    p.mtxt = ["ステータス","所有スキル","レベルアップ","ヒストリー"];
    // Style
    p.menupar = {
      divid:p.mainid+"m_",strid:"kwnd2txt",lt:[400,0,90,80],
      thisbase:p,thisfunc:p.cfunc2,parent:p.parent,
    }

    this.parent = p.parent;
    this.cdb = p.cdb;
    this.skd = this.parent.chardata.skilldata;
  }

  getUpdatelist(){
    let list = this.parent.chardata.getpcharlist();
    return ["kwnd2_listxt", "勇者一覧",list,60]
  }
  //＝＝＝ 個別 ＝＝＝
  viewpage2(target){
    let b = removeAllChildsByID(this.pclass.mainid);
    new skillTree(b,this.parent,this.skd,this.cdb,target);
  }
  viewpage0(target){
    let b = removeAllChildsByID(this.pclass.mainid);
    new charaStatusView(this.parent,target,this.cdb,b);
  }
  // target <= this.charatarget
  cfunc2click(p,target){
    console.log("clicked "+p.tarid);
    // menu
    if(p.tarid==0){
      this.viewpage0(target);
    }
    if(p.tarid==2){
      this.viewpage2(target);
    }  
    return;
  }
}