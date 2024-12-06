
class kiraClass{
  constructor(type,sts){
    /*this.kira = []
    this.kira[0] = new Image();
    this.kira[0].src = "img/add/kr1.png";*/
    let file = {
      "atk":"img/add/krred1.png",
      "def":"img/add/krblu1.png",
      "agi":"img/add/kryel1.png"
    }
    let src = (file[sts])?file[sts]:"img/add/krigi1.png";
    this.img = new Image();
    this.img.src = src;
    this.lt = 60;//lifetime
    this.tm = this.lt;
    // type 0:Right 796-200
    let [x,y] = [400,50];
    x = x + Math.random()*400;
    y = y + Math.random()*400;
    this.pos = [x,y];
    this.tm = 30;
    this.delflag = false;
  }
  draw(ctx){
    if(this.tm--<=0){
      this.delflag = true;
      return;
    }
    let [px,py,pw,ph] = [0,0,512,512];
    let t = this.tm;
    let [x,y] = this.pos;
    let [w,h] = [64,64];
    ctx.globalAlpha = (t>30)?1:(t/30);
    ctx.drawImage(this.img,px,py,pw,ph,x,y,w,h);
    ctx.globalAlpha = 1;
  }
}

// Team
class teamClass {
  constructor(parent) {
    this.parent = parent;
    this.chara = [];
    this.gsize = parent.gsize;
    this.initcnt = 0;
    this.teamID = 0;
    //画像
    this.digires = new diginumresource();
    this.digires.getres(this);
    //画像は親の使う
    this.digin = new diginum(this);
    this.damagelist = [];
    // TEST
    this.pupimg = new Image();
    this.pupimg.src = "img/system/IconSet.png"
  }
  // パラメータを頑張ってセット
  initLoad(type,n) {
    let [gCVX, gCVY] = this.gsize;
    this.type = type;
    if(type==0){
      // 右だから
      this.pxy = [796-350,100];
      this.wpar = [300, 20, gCVX-350, gCVY*(1/3)-80];
      this.tpar = [330,60+4]
    }else{
      // 左だから
      this.pxy = [20,100];
      this.wpar = [30, 20, gCVX-350, gCVY*(1/3)-80];
      this.tpar = [60,60+4]
    }
    // チャージ
    this.charge = [0];
    // データ読み込み
    if(n==7||n==8||n==9){ // 勇者
      let imgsrc = "img/pictures/Actor1_5.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "いけ！";
      this.ctxt = "ここが勝負時だ！";
      this.endt = "くっ、ここは退く・・";
      this.wint = "我々の勝利だ！！";
      this.simg = new Image();
      this.simg.src = "img/faces/Actor1.png";
      this.spar = [this.simg,0,144,144,144];
      this.twep = 1;
      this.hp = 576;//526;
      this.kwiryaku = 4;
      // 攻撃計算用
      this.atk = 30;
      this.def = 10;
      this.agi = 180;
      this.powersts = {};
      // 味方（１面）
      if(n==7){
        // 計略
        this.ctxtP=["お助けいたします！","お護りいたします"];
        this.kwiryakuP=[5,6];
        this.charge = [6,9,0];//[0,2,0]
        this.kgage = [12,10,8];//[5,3,5];
        this.farr = ["img/add/tb1_1.png","img/add/tb2_1.png"];
        let f1 = new Image();
        f1.src = "img/add/tb1_2.png"
        let f2 = new Image();
        f2.src = "img/add/tb2_2.png"
        this.imgfacePar = [[f1,0,0],[f2,0,0]];
      }
      // 味方（２面）
      if(n==8){
        this.farr = ["img/add/coconaB1.png","img/add/mina1.png"];
        // 計略
        this.ctxtP=["ちょいちょいっと","くらいなさい！！"];
        this.kwiryakuP=[7,8];
        this.charge = [0,0,3];//[0,2,0]
        this.kgage = [6,3,3];//[5,3,5];
        // IMGPAR
        let f1 = new Image();
        f1.src = "img/add/heroine.png"
        let f2 = new Image();
        f2.src = "img/add/mina2.png"
        this.imgfacePar = [[f1,0,0],[f2,0,0]];
        
        // 敵ロジックの利用
        this.enelogic = this.stgfunc2
        this.eneflag = 0;
      }
      // 味方（３面）
      if(n==9){
        // 計略
        this.ctxtP=["お助けいたします！","お護りいたします"];
        this.kwiryakuP=[9,10];
        this.charge = [0,15,0];
        this.kgage = [6,16,6];
        this.farr = ["img/pictures/Actor1_6.png","img/pictures/Actor1_8.png"];
        let f1 = new Image();
        f1.src = "img/faces/Actor1.png"
        let f2 = new Image();
        f2.src = "img/faces/Actor1.png"
        this.imgfacePar = [[f1,144,144],[f2,144*3,144]];

        // 敵ロジックの利用
        this.enelogic = this.stgfunc3
        this.eneflag = 0;
      }
      // 助っ人画像
      this.imgP = [];
      for(let i=0;i<this.farr.length;i++){
        this.imgP[i] = new Image();
        this.imgP[i].src = this.farr[i];
      }
    }
    // 敵の１面
    else if(n==1){
      let imgsrc = "img/pictures/People2_5.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "ひいいいい！！！";
      this.ctxt = "必殺の一撃っっっ";
      this.endt = "ぐうう、強い・・・";
      this.wint = "１００年早いわ！！";
      this.simg = new Image();
      this.simg.src = "img/faces/People2.png";
      this.spar = [this.simg,0,144,144,144];
      this.twep = 3;
      this.soltype = 3;
      this.hp = 986;//587;//987;
      this.kwiryaku = 1;
      // 攻撃計算用
      this.atk = 30;
      this.def = 10;
      this.agi = 200;
      this.powersts = {};
      // 敵ロジック
      this.enelogic = this.bossfunc1
      this.eneflag = 0;
    }
    // 女忍者
    else if(n==2){
      let imgsrc = "img/pictures/Actor2_8.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "守ってみせまする";
      this.ctxt = "守ってみせまする";
      this.endt = "すみません、退きます";
      this.wint = "守り通せました";
      this.simg = new Image();
      this.simg.src = "img/faces/Actor2.png";
      this.spar = [this.simg,144*3,144,144,144];
      this.twep = 22;
      this.hp = 430;
      this.kwiryaku = 2;
      // 攻撃計算用
      this.atk = 20;
      this.def = 15;
      this.agi = 150;
      this.powersts = {};
      // 敵ロジック
      this.enelogic = this.bossfunc2
      this.eneflag = 0;
      // 助っ人
      {
        // 計略
        this.ctxtP=["ぐへへ！","ぐふふ！"];
        this.kwiryakuP=[12,11];
        // 助っ人
        this.farr = ["img/add/en2b_1.png","img/add/en2r_1.png"];
        let f1 = new Image();
        f1.src = "img/add/en2b_2.png"
        let f2 = new Image();
        f2.src = "img/add/en2r_2.png"
        this.imgfacePar = [[f1,144,144],[f2,144,144]];
        // 内部フラグ
        this.stg2cnt = 0;
      }
      // 助っ人画像
      this.imgP = [];
      for(let i=0;i<this.farr.length;i++){
        this.imgP[i] = new Image();
        this.imgP[i].src = this.farr[i];
      }
    }
    // デュラン
    else if(n==3){
      let imgsrc = "img/pictures/aa_duran.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "相手をしてやろう";
      this.ctxt = "地獄の業火をくらえ！";
      this.endt = "ふんっ、退却だ";
      this.wint = "たいしたことない";
      this.simg = new Image();
      this.simg.src = "img/faces/aa_duran.png";
      this.spar = [this.simg,0,0,144,144];
      this.twep = 13;
      this.soltype = 2;
      this.hp = 1059;
      this.kwiryaku = 3;
      // 攻撃計算用
      this.atk = 30;
      this.def = 10;
      this.agi = 200;
      this.powersts = {};
      // 敵ロジック
      this.enelogic = this.bossfunc3
      this.eneflag = 0;
      // 助っ人
      {
        // 計略
        this.ctxtP=["させません！！","ぐふふ！"];
        this.kwiryakuP=[2];
        // 助っ人
        this.farr = ["img/pictures/Actor2_8.png","img/add/en2r_1.png"];
        let f1 = new Image();
        f1.src = "img/faces/Actor2.png"
        let f2 = new Image();
        f2.src = "img/add/en2r_2.png"
        this.imgfacePar = [[f1,3*144,144]];
        // 内部フラグ
        this.stg2cnt = 0;
      }
      // 助っ人画像
      this.imgP = [];
      for(let i=0;i<this.farr.length;i++){
        this.imgP[i] = new Image();
        this.imgP[i].src = this.farr[i];
      }
    }


    // チームIDを確保（使ってないみたい）
    this.teamID = n;

    // 兵士７人の配置
    for(let i=0;i<7;i++){
      let [x,y] = (i<3)?[796-200,150+80*i]:[796-100,100+80*(i-3)]
      this.addchara(type,x,y);
    }
    // キラキラ演出
    this.kira = [];
    this.kiratm = 0;
  }
  // １だと打てない
  checkKeiryaku(ii){
    //if(!this.kgage){return 0;}
    if(!this.kgage){
      if(ii==0){return 0;}
      if(!this.kwiryakuP){return 1;}
      if(this.kwiryakuP[ii-1]){return 0;}
      return 1;
    }
    if(this.kgage[ii] <= this.charge[ii]){
      return 0;
    }
    return 1;
  }
  resetKeiryaku(ii){
    this.charge[ii] = 0; // リセットする
  }
  chargeFunc(){
    if(!this.kgage){
      console.log("CHARGE SKIP");
      return;
    }
    let n = this.kgage.length;
    for(let i=0;i<n;i++){
      this.charge[i] += 1;
    }
    console.log("CHARGE:",this.charge,this.kgage);
  }
  powerupdraw(ctx,type){
    let [gCVX, gCVY] = this.gsize; // [796,604]
    let xpos = (type==0)?gCVX-159:10;
    let ypos = gCVY-159;
    let dx=0;
    let plist =[
      ["aaanum","aaa",9,4],
      ["bbbnum","bbb",1,5],
      ["atknum","atk",2,2],
      ["defnum","def",3,2],
      ["aginum","agi",6,2],
    ];
    for(let cc of plist){
      let [num,sts,ix0,iy0] = cc;
      //console.log([num,sts,ix0,iy0]);
      if(this.powersts[num]){
        let [ix,iy] = [ix0,iy0];
        // ATK用
        if(sts == "atk" || sts == "def"){
          // DOWN
          if(this[sts] > this.powersts[sts]){
            iy = iy0+1;
            // SUPER DOWN
            if(this[sts] > this.powersts[sts]*2){
              ix = ix0+8;
            }
          }
          // SUPER UP
          if(this[sts]*2 < this.powersts[sts]){
            ix = ix0+8;
          }
        }
        // AGI用
        if(sts == "agi"){
          // DOWN
          if(this[sts] < this.powersts[sts]){
            iy = iy0+1;
            // SUPER DOWN
            if(this[sts] < this.powersts[sts]*2){
              ix = ix0+8;
            }
          }
          // SUPER UP
          if(this[sts]*2 > this.powersts[sts]){
            ix = ix0+8;
          }
        }
        let [px,py]=[xpos+dx,ypos];
        ctx.drawImage(this.pupimg,ix*32,iy*32,32,32,px,py,32,32);
        dx += 32;
      }
    }
  }
  powerup(v){
    // 勇者の号令
    if(v==1){
      console.log(this)
      let et = 3;
      this.powersts["atk"] = 5*this.atk;
      this.powersts["atknum"] = 3;
    }
    // ２面ボス
    if(v==2){
      console.log(this)
      let et = 5;
      this.powersts["def"] = 145;
      this.powersts["defnum"] = et;
    }
    // HAKONE ボス
    if(v==3){
      console.log(this)
      this.powersts["atk"] = this.atk*10;
      this.powersts["atknum"] = 1;
      this.powersts["agi"] = 500;
      this.powersts["aginum"] = 1;
    }
    // MIKATA
    if(v==5){
      console.log(this)
      this.powersts["agi"] = this.agi*0.5;
      this.powersts["aginum"] = 5;
    }
    if(v==6){
      console.log(this)
      this.powersts["def"] = 9999;
      this.powersts["defnum"] = 1;
    }
    // MIKATA
    if(v==7){ // ２面雲散
      let list = ["atk","aaa"];
      for(let cc of list){
        delete this.powersts[cc]
        delete this.powersts[cc+"num"]
      }
      this.stg2cnt = 0;
    }
    if(v==9){ // ３面回復
      let v = 576 - this.hp;
      v = (v > 260)? 260 : v;
      this.setHeal(v); // 暫定
    }
    if(v==10){ // ３面バリア
      this.powersts["bbb"] = 200;
      this.powersts["bbbnum"] = 1;
    }
    // 回復
    if(v==11){
      let v = 430 - this.hp;
      this.setHeal(v); // 暫定
    }
    // 攻撃力がどんどんあがる
    if(v==12){
      //console.log("powerup10")
      this.powersts["aaa"] = 20;
      this.powersts["aaanum"] = 10;
      this.powersts["atk"] = this.atk; // これが必要
      this.powersts["atknum"] = 10;
    }
  }
  getAtk(){
    // aaanum あれば
    if(this.powersts["aaanum"]){
      this.powersts["atk"] += this.powersts["aaa"];
      this.powersts["atknum"] = this.powersts["aaanum"];
      this.powersts["aaanum"]--;
      console.log(this.powersts)
      if(this.powersts["aaanum"]==0){
        delete this.powersts["aaa"]
        delete this.powersts["aaanum"]
      }
    }
    // 攻撃力
    let v = (this.powersts["atk"])? this.powersts["atk"] : this.atk;
    this.powersts["atknum"]--;
    if(this.powersts["atknum"]==0){
      delete this.powersts["atk"]
      delete this.powersts["atknum"]
    }
    // AGIもあれば
    if(this.powersts["aginum"]){
      this.powersts["aginum"]--;
      if(this.powersts["aginum"]==0){
        delete this.powersts["agi"]
        delete this.powersts["aginum"]
      }
    }
    return v;
  }
  getDef(){
    let v = (this.powersts["def"])? this.powersts["def"] : this.def;
    this.powersts["defnum"]--;
    if(this.powersts["defnum"]==0){
      delete this.powersts["def"]
      delete this.powersts["defnum"]
    }
    // bbbnum あれば
    if(this.powersts["bbbnum"]){
      this.powersts["bbbnum"]--;
      if(this.powersts["bbbnum"]==0){
        delete this.powersts["bbb"]
        delete this.powersts["bbbnum"]
      }
    }
    return v;
  }
  getAgi(){
    let v = (this.powersts["agi"])? this.powersts["agi"] : this.agi;
    // NUMは攻撃時に減らす
    return v;
  }
  getkwiryaku(type=0){
    return (type==0)?this.kwiryaku:this.kwiryakuP[type-1];
    //return (type<=2)?this.kwiryaku:this.kwiryakuP[type-3];
  }

  drawGuest(ctx){ // this.type==0 が右
    let [gCVX, gCVY] = this.gsize;
    let [x,y,w,h] = (this.type==0)?[gCVX-159-72-5, gCVY-72-10, 72, 72]:[159+5, gCVY-72-10, 72, 72]
    let pos = (this.type==0)?[x,x-72-5]:[x,x+72+5];
    let n = (this.imgfacePar)?this.imgfacePar.length:0;
    for(let i=0;i<n;i++){
      let px = pos[i]; 
      if(this.type==0){
        ctx.fillStyle = "#000088";
        let flag = Math.floor(this.initcnt/8)%5;
        if(flag){
          // 必殺技打てるかどうか確認する
          let rtn = this.checkKeiryaku(i+1);
          if(rtn==0){
            let cl = ["#00FFFF","#00CCCC","#00AAAA","#008888"];
            ctx.fillStyle = cl[flag-1];
          }
        }
      }else{
        ctx.fillStyle = "#CC0088";
      }
      let mg = 2;
      ctx.fillRect(px-mg,y-mg,w+2*mg,h+2*mg);
      this.drawSupport(ctx,i,px,y,w,h);
    }
  }
  drawSupport(ctx,i,x,y,w,h){
    let [img,ix,iy] = this.imgfacePar[i];
    //console.log(i,[img,ix,iy])
    let mg = 0;
    ctx.drawImage(img,ix,iy,144,144,x+mg,y+mg,w-2*mg,h-2*mg)
  }
  drawchara(ctx,x,y,img0=null){
    ctx.save();
    ctx.shadowColor='rgb(0,255,255)';
    ctx.shadowOffsetX=10;
    ctx.shadowOffsetY=-3;
    let img = (img0==null) ? this.img : img0;
    ctx.drawImage(img, x, y);
    ctx.restore();
  }
  drawInit(ctx){
    // キャラの絵（dxに依存のみ）
    this.drawchara(ctx,this.pxy[0],this.pxy[1])
  }
  // 計略のカットイン
  drawCutin(ctx,base,tm,type=0){
    let [gCVX, gCVY] = this.gsize;
    let [x,y] = this.pxy;
    x = (gCVX-330)/2;//330:PNG.width
    let dx = gCVX*(base/100)
    // セリフ
    if(20 < tm && tm < 80){
      ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
      let p = this.wpar;
      //let y1 = gCVY*(0/3)+20;
      ctx.fillRect(p[0],p[1],p[2],p[3]/2);
      ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
      ctx.font = "40px MSゴシック";
      ctx.textAlign = "start"; // 規定
      ctx.textBaseline = "alphabetic"; // 規定
      p = this.tpar;
      let ctxt = (type==0)?this.ctxt:this.ctxtP[type-1];
      ctx.fillText(ctxt, p[0],p[1]); // y:上に出す
    }
    // キャラの背景（薄い赤・薄い青）
    {
      let st = 160;
      let mm = 20;
      let mt = st-mm;
      let x = 0;
      let w = (tm<mt)? gCVX: gCVX*(st-tm)/mm;
      if(this.type==0){ // 敵か味方か区別（ロード時に決める）
        ctx.fillStyle = 'rgba(0,255,0,0.5)'; //塗りつぶしの色
        x = gCVX-w;
      }else{
        ctx.fillStyle = 'rgba(255,0,0,0.5)'; //塗りつぶしの色
      }
      ctx.fillRect(x,100,w,350);
    }
    // キャラの絵（dxに依存のみ）
    //DBG//console.log("drawCutin:",type)
    if(type==0){
      this.drawchara(ctx,x+dx,y)
    }else{
      this.drawchara(ctx,x+dx,y,this.imgP[type-1])
    }
  }

  // セリフカットイン
  // セリフ秒数：statm,endtm,
  // セリフ：serif,
  // キャラ指定：ch (-1で指揮官)
  serifCutin(ctx,base,tm,sss){
    let [gCVX, gCVY] = this.gsize;
    let [x,y] = this.pxy;
    x = (gCVX-330)/2;//330:PNG.width
    let dx = gCVX*(base/100)
    // ちょっとおしゃれめに
    {
      ctx.fillStyle = '#888888CC'; //塗りつぶしの色
      ctx.fillRect(0,0,gCVX,y);
      ctx.fillRect(0,y+350,gCVX,gCVY-(y+350));
    }
    // セリフ
    if(sss.endtm < tm && tm < sss.statm){
      ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
      let p = this.wpar;
      //let y1 = gCVY*(0/3)+20;
      ctx.fillRect(p[0],p[1],p[2],p[3]/2);
      ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
      ctx.font = "40px MSゴシック";
      ctx.textAlign = "start"; // 規定
      ctx.textBaseline = "alphabetic"; // 規定
      p = this.tpar;
      let txt = "";
      if(sss.serifArr){
        for(let cc of sss.serifArr){
          if(cc[0] > tm){txt = cc[1];}
        }
      }else{
        txt = sss.serif;
      }
      ctx.fillText(txt, p[0],p[1]); // y:上に出す
    }
    // キャラの絵（dxに依存のみ）
    let img = (sss.ch>=0)? this.imgP[sss.ch] : null;
    /*if(sss.ch==0){//2431x1216
      console.log("sss.ch");
      //this.drawchara(ctx,x+dx,y,img);
      let ww = 2431*350/1216;
      let w0 = (gCVX - ww)/2
      ctx.drawImage(img, 0,0,2431,1216, w0+dx,y,ww,350);
    }else{
    this.drawchara(ctx,x+dx,y,img);
    }*/
    this.drawchara(ctx,x+dx,y,img);
  }

  // 退却のカットイン
  endCutin(ctx,base,tm,tp=0){
    let sss = {
      statm:80,endtm:20,ch:-1,
      serif:(tp==0)?this.endt:this.wint,
    }
    this.serifCutin(ctx,base,tm,sss);
  }

  bardraw2white(ctx,type){
    let [gCVX, gCVY] = this.gsize
    let mm = 100;
    let ypos = gCVY-159;//10
    let wbar = gCVX/2-10;
    let x0 = (type==1)? 10:gCVX/2;
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; //塗りつぶしの色
    if(this.initcnt<=20){
      let xx,ww;
      if(type==1){
        ww = 2*wbar;
        xx = x0-ww+2*ww*(20-this.initcnt)/20;
      }else{
        ww = 2*wbar;
        xx = gCVX-(x0-ww+2*ww*(20-this.initcnt)/20);
        mm = 100
      }
      let arg = [[mm/2+xx,ypos],[mm/2+xx+ww,ypos],[xx+ww,ypos+mm],[xx,ypos+mm]];
      UtilmultiMoveLine(ctx,arg);
      ctx.fill();
    }
  }
  bardraw2(ctx,type){
    let [gCVX, gCVY] = this.gsize
    let mm = 100;
    let ypos = gCVY-159;//10
    let wbar = gCVX/2-10;
    let x0 = (type==1)? 10:gCVX/2;
    let argZZ = [
      [x0,ypos+mm/2],[x0+mm/2,ypos],[x0+wbar-mm/2,ypos],
      [x0+wbar,ypos+mm/2],[x0+wbar-mm/2,ypos+mm],[x0+mm/2,ypos+mm]
    ];
    ctx.save();
    utilclippath(ctx,argZZ);/* clip */
    ctx.fillStyle = (type==0)?'rgb(0,0,255)':'rgb(255,0,0)';
    ctx.fillRect(x0,ypos,wbar,mm);
    // 白のきらりの仕掛け
    this.bardraw2white(ctx,type);
    //--- 線引く
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgb(0,0,0)';
    UtilmultiMoveLine(ctx,argZZ);
    ctx.stroke();
    /* clip 後片付け */
    ctx.restore()
  }

  //「damagelist」に従って、digidraw2 描画、使い終わったら削除。
  digidraw(ctx){
    this.digin.digidraw(ctx); // HPを表示する
    //DBG//let n1 = this.damagelist.length;
    this.damagelist.forEach((e, index) => {
      e.digidraw2(ctx); // ダメージを表示する
      if (e.delflag) {
        this.damagelist.splice(index, 1); // 使い終わったら削除
      }
    })
  }
  // 「damagelist」を 追加する。
  setDamageF(v,mode=0){ // 火のダメージに対して
    if(this.powersts["bbbnum"]){
      v -= this.powersts["bbb"];
    }
    this.setDamage(v,mode);
  }
  setDamage(v,mode=0){
    if(v < 0){v=0}
    let [xx,n] = this.digin.getlen2(this.hp);
    let x0 = (this.type==0)?450+xx[n]:350;
    let e = new diginum(this);
    e.setVal(v,60, x0, mode);
    this.damagelist.push(e);
    this.hp -= v;
    //敵のロジックがあれば（被ダメで動きたいロジックがあれば）
    //console.log(this.enelogic,this.hp,v)
    if(this.enelogic){
      this.enelogic(this.hp,v);
    }
  }
  // とりあえず数字入れない、回復のみ
  setHeal(v,mode=0){
    this.hp += v;
    //敵のロジックがもしあれば
    if(this.enelogic){
      this.enelogic(this.hp,0);
    }
  }
  // １面のボスのロジック
  bossfunc1(hp,dam){
    //DBG//console.log("DM",hp,dam);
    if(this.powersts["atknum"]>0){ // パワーアップ中は打たない
      //DBG//console.log("Already Power up",this.powersts["atknum"]);  
      return;
    }
    // はじめての被ダメ
    if(this.eneflag==0){
      this.eneflag++;
      this.parent.cflag = 10;//計略を撃つ
      this.parent.eventflag = 1;//EVENT
      return;
    }
    let tarhp = [600,300];
    if(hp<=tarhp[0] && tarhp[0]<hp+dam){ // はじめて３００を割った時
      this.parent.cflag = 10;//計略を撃つ
      this.parent.eventflag = 2;//EVENT
    }
    if(hp<=tarhp[1]){ // ３００以下は常に
      this.parent.cflag = 10;//計略を撃つ
    }
  }
  // 味方用のロジック
  stgfunc2(hp,dam){
    if(this.eneflag==1 && dam > 10){ // 強化ダメージ
      this.parent.eventflag = 12;//EVENT
      this.eneflag++;
      return;
    }
    if(this.eneflag==0){
      this.parent.eventflag = 9;//EVENT
      this.eneflag++;
      return;
    }
  }
  // ２面のボスのロジック
  bossfunc2(hp,dam){
    //console.log(hp,dam)//回復はdamが0以下
    // 1回目＋2回目 の被ダメ
    if(dam > 0 && this.eneflag==1){
      console.log(this.eneflag)
      this.parent.cflag = 12;//計略を撃つ(２人目) 回復
      this.parent.eventflag = 11;//EVENT
      this.eneflag++;
      return;
    }
    if(dam > 0 && this.eneflag==2){ // 強化
      console.log(this.eneflag)
      this.parent.eventflag = 10;//EVENT
      this.eneflag++;
      return;
    }
    //console.log(dam)
    if(dam == 200){ // ダメージ計略対策(sts=3じゃないので、cflagだと消えちゃう)
      //this.parent.cflag = 12;//計略を撃つ(２人目)
      if(this.eneflag==0){
        this.eneflag++;
        return;
      } 
      this.parent.eventflag = 14;//EVENT
      return;
    }

    if(dam > 50){ // 大ダメージ
      this.parent.cflag = 10;//計略を撃つ(ボス)
      return;
    }
    if(hp<=250){ // ある値 未満は常に
      this.parent.cflag = 12;//計略を撃つ(２人目)
      return;
    }
    if(this.powersts["atknum"]>0){ // パワーアップ中は打たない 
      this.stg2cnt = 0;
    }else{
      this.stg2cnt++;
      if(this.stg2cnt>5){
        this.parent.cflag = 11;//計略を撃つ(１人目)
        this.stg2cnt = 0;
      }
    }
  }
  // 味方用のロジック
  stgfunc3(hp,dam){
    if(this.eneflag==0 && dam == 259){ // 強化ダメージ
      this.parent.eventflag = 17;//EVENT
      this.eneflag++;
      return;
    }
  }
  // ３面のボスのロジック
  bossfunc3(hp,dam){
    // 1回目＋2回目 の被ダメ
    if(this.eneflag<=1){ // １人だけにする
      this.parent.eventflag = 15+this.eneflag;//EVENT
      this.eneflag++;
      return;
    }
    if(this.powersts["defnum"]>0){ // パワーアップ中は打たない 
      this.stg2cnt = 0;
      return;
    }else{
      this.stg2cnt++;
      if(this.eneflag==2 && this.stg2cnt==1){// 防御が切れた次のタイミング
        this.parent.eventflag = 18;
        this.eneflag++;
        return;
      }
      if(this.stg2cnt==2){// 防御が切れた次のタイミング
        this.parent.cflag = 10;//計略を撃つ(ボス)
        return;
      }
      if(this.hp <= 600 && this.stg2cnt>2){
        this.parent.cflag = 11;//計略を撃つ(１人目)
        this.stg2cnt = 0;
        return;
      }
      if(this.stg2cnt>5){
        this.parent.cflag = 11;//計略を撃つ(１人目)
        this.stg2cnt = 0;
        return;
      }
    }
  }

  // 下のキャラ描画
  commondraw2(ctx){
    let type = this.type; 
    let [gCVX, gCVY] = this.gsize; // [796,604]
    let ypos = gCVY-159;//10
    // バー描画
    this.bardraw2(ctx,type);

    // キャラ描画
    ctx.save();
    ctx.shadowOffsetX=10;
    ctx.shadowOffsetY=-10;
    ctx.shadowBlur = 10;
    ctx.shadowColor=(type==0)?'rgb(0,255,255)':'rgb(255,0,255)';
    if(type==1){
      let p = this.spar;
      ctx.drawImage(p[0],p[1],p[2],p[3],p[4],10,ypos,144,144);
    }else{
      let [x,y,w,h] = [gCVX-159,ypos,144,144];
      // 計略てるかどうか(味方のみ)
      let rtn = this.checkKeiryaku(0);
      if(rtn==0){
        let cl = ["#00FFFF80","#00FFFF80","#00CCCC80","#00AAAA80","#00888880"];
        let flag = Math.floor(this.initcnt/8)%5;
        ctx.fillStyle = cl[flag];
        ctx.fillRect(x,y,w,h);
      }
      let p = this.spar;
      ctx.drawImage(p[0],p[1],p[2],p[3],p[4],x,y,w,h);
    }
    ctx.restore();
    // HP表示・ダメージ描画処理
    this.digidraw(ctx);
    // PowerUp しているようなら
    this.powerupdraw(ctx,type);
    // カウント処理
    this.initcnt = (this.initcnt<=0) ? 80-1:(this.initcnt-1);
  }

  // pchara コントロール
  pupset(inp){
    this.pupsts = inp;
    this.pchara = [];
    if(inp == 0){
      this.pchara = [];
    }else{
      for(let i=0;i<7;i++){
        let x = 796/2+80*(i-3); //796
        let y = (i%2==0)?150:250;
        let e = new characlass(this.type,this.soltype);
        this.setwaittime(e, 20);
        e.pos = [x,y]
        if(inp == 1){e.state = "pup";}
        if(inp == 2){e.state = "dam";}
        this.pchara.push(e);
      }
    }
  }
  moveset(inp){
    this.pupsts = inp;
    this.pchara = [];
    if(inp == 0){
      this.pchara = [];
    }else{
      for(let i=0;i<7;i++){
        let x = (i<3)? 796-200:796-100;
        if(inp == 1){x = (i<3)? 796/2-50:796/2+50;}
        let y = (i<3)? 150+80*i:100+80*(i-3);
        let e = new characlass(this.type,this.soltype);
        this.setwaittime(e, 5);
        e.pos = [x,y]
        if(inp == 1){e.state = "move1"}
        if(inp == 2){e.state = "move2"}
        this.pchara.push(e);
      }
    }
  }
  pupdraw(ctx){
    for (let cc of this.pchara) {
      cc.movedraw(ctx);
    }
  }
  // 一般的な動かしてDRAW
  charadraw(ctx){
    for (let cc of this.chara) {
      cc.movedraw(ctx);
    }
    // TRY : this.type 0:Right 796-200
    if(this.type==0){
      let stsarr = ["atk","def","agi"];
      for(let sts of stsarr){
        if(this.powersts[sts]){
          if(this.kira.length < 100){
            if(this.kiratm++%3 == 0){
              let kira = new kiraClass(this.type, sts);
              this.kira.push(kira);
            }
          }
        }
        for(let k of this.kira){
          k.draw(ctx);
        }
        this.kira = this.kira.filter(e=>{return !(e.delflag)})
      }
    }
  }

  setwaittime(e, n) {
    let wt = Math.floor(n * Math.random());
    e.waittime = wt;
  }
  addchara(type, x, y) {
    let e = new characlass(type,this.soltype);
    e.pos = [x, y];
    //武器の指定（指揮官に従う）
    e.atkwep = this.twep;//(type==0)?13:22;//TEST
    this.setwaittime(e, 20);
    this.chara.push(e);
    return e;
  }
  attack(dmg) {
    this.hp -= dmg;
  }
  alive() {
    let hp = 0
    for (let cc of this.chara) {
      if (cc.state=="dead" && this.hp > hp) {
        //cc.deadflag = false;
        cc.state = "";
        cc.sts = [0, 0]
      }
      hp += 100;
    }
  }
  check() {
    let hp = 0
    for (let cc of this.chara) {
      if (this.hp <= hp) {
        //cc.deadflag = true;
        cc.state = "dead";
      }
      hp += 100;
    }
  }
  // 勝ちフラグ
  setWin() {
    for (let cc of this.chara) {
      //cc.winflag = true;
      cc.state = "win";
    }
  }
}
