// BODYのCSSを書き換える。CSSファイル用意でも良い。
function xxx() {
  document.body.style.margin = "0px"; // HTML重ねる為
  document.body.style.overflow = "hidden"; // スクロールバー抑制
}
window.addEventListener("load", xxx);

// HTML append
function generateElement(target, par) {
  let ele = document.createElement(par.type);
  if (target) { target.append(ele); }
  for (let key in par.style) {
    ele.style[key] = par.style[key];
  }
  for (let key in par) {
    if (key == "classList_add") {
      ele.classList.add(par[key]);
      continue;
    }
    if (["type", "style"].indexOf(key) != -1) { continue; }
    ele[key] = par[key];
  }
  return ele;
}

function UtilmultiMoveLine(ctx,arg){
  ctx.moveTo(arg[0][0],arg[0][1]);// 最初にMOVEして、
  for(let i=1;i<arg.length;i++){
    ctx.lineTo(arg[i][0],arg[i][1]);// 以降はLINEする
  }
}

function utilsaveclip(ctx,arg){
  ctx.save()
  ctx.beginPath();
  UtilmultiMoveLine(ctx,arg);
  ctx.closePath();
  ctx.clip()
}
function utilclippath(ctx,arg){
  ctx.beginPath();
  UtilmultiMoveLine(ctx,arg);
  ctx.closePath();
  ctx.clip()
}

// For SE
function audioInvokeSE(name,vol=90,pitch=100,pan=0){
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  //Game_Interpreter.prototype.command251();
  Game_Interpreter.prototype.command250(par);
}
// For BGM
function audioPlayBGM(name,vol=90,pitch=100,pan=0){
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  Game_Interpreter.prototype.command241(par);
}
// For BGS
function audioStopBGM(sec=0){
  let par = [sec]
  Game_Interpreter.prototype.command242(par);
}

// For BGS
function audioPlayBGS(name,vol=90,pitch=100,pan=0){
  let par = [{"name":name,"volume":vol,"pitch":pitch,"pan":pan}]
  Game_Interpreter.prototype.command245(par);
}
// For BGS
function audioStopBGS(sec=0){
  let par = [sec]
  Game_Interpreter.prototype.command246(par);
}

class test0 {
  constructor() {
    this.name = "test0";
    console.log("test0 new construct");
    this.endfunc = () => { console.log("endfunc(): Please Override if you need."); }
    window.addEventListener('resize', this.resizeFunc.bind(this));
    this.sts = 0;
  }
  invoke(c1=7,c2=3) {
    console.log("invoke()");
    clearInterval(this.setintval);
    const element = document.getElementById('WRAPTOP');
    if (element) {
      element.style.display = "block";
    } else {
      this.initHTML();
    }
    // 開始
    let b = this.btm;
    b.initload(c1,c2); // キャラ指定
    this.setintval = setInterval(b.loopfunc.bind(b), 1000 / 60);
  }
  endinvoke() {
    console.log("endinvoke");
    clearInterval(this.setintval);
    const element = document.getElementById('WRAPTOP');
    //element.remove();
    element.style.display = "none";
    this.btm.endfunc();
    this.endfunc();
  }
  initHTML() {
    let [w, h] = [816 - 20, 624 - 20];
    let par = {
      type: "div", id: "WRAPTOP",
      style: { /* Left,Top,scale are CHANGED */
        backgroundColor: "#FF000050", position: "relative", zIndex: 20,
        width: w + "px", height: h + "px" /* W & H are FIXED */
      }
    };
    let base = generateElement(document.body, par);
    this.resizeFunc();
    let cnv = generateElement(base, {
      type: "canvas", width:w,height:h
    });
    let ctx = cnv.getContext("2d");
    this.btm = new battleMain(ctx);

    let btn = generateElement(base, {
      type: "button", textContent: "btn",
      style: { position: "absolute", right: "5px", top: "5px" }
    });
    btn.addEventListener("click", this.endinvoke.bind(this));
    window.addEventListener('keydown', this.kfunc.bind(this));
  }
  kfunc(e){
    //console.log("kfunc",e);
    this.btm.keycont(e)
  }

  resizeFunc() {
    let km = document.getElementById("WRAPTOP");
    if (km) {
      let [sw, sh] = [window.innerWidth, window.innerHeight];
      // 816x624
      let [w0, h0] = [816, 624];
      let [ax, ay] = [sw / w0, sh / h0];
      let [cl, ct] = [(sw - w0 + 20) / 2, (sh - h0 + 20) / 2];
      let aa = (ax > ay) ? ay : ax;
      km.style.left = cl + "px";
      km.style.top = ct + "px";
      km.style.transform = "scale(" + aa + "," + aa + ")";
    }
    console.log(this.name, "RESIZE!");
  }
}

/*================================*/

class backgroundClass {
  constructor(parent){
    this.parent = parent;
    this.img = [];
    let flist = [ /* 1000x740 */
      "img/battlebacks1/Grassland.png",
      "img/battlebacks2/Grassland.png",
      "img/battlebacks1/Ground1.png",
      "img/battlebacks2/Ruins2.png"
    ];
    for(let src of flist){
      let img = new Image();
      img.src = src;
      this.img.push(img);
    }
    this.ihash = {
      "grass":[0,1],
      "ruins":[2,3],
    }
  }
  calcarg(type,base,m0,dy=0){
    let [ww,hh] = [796,604];
    let arg = (type==0)?[[ww,hh+dy],[ww,0+dy]]:[[0,hh+dy],[0,0+dy]];
    //let m0 = 50;
    let mm = (type==0)? +1*m0:-1*m0;
    let n = 8;
    for(let i=0;i<=n;i++){
      let x = (i%2==0)?base+mm+25:base+mm-25;
      let y = hh/n*i +dy;
      arg.push([x,y]);
    }
    return arg;
  }
  bgdraw(ctx, base, type, id){
    // 黒いギザギザ
    let args =[[40,0],[40,40],[40,40-604]]
    for(let aa of args){
      ctx.beginPath();
      let arg = this.calcarg(type,base,aa[0],aa[1]);
      UtilmultiMoveLine(ctx,arg);
      ctx.closePath();
      ctx.fillStyle = "#000"
      ctx.fill();
    }
    //------------------------------------------------------
    /* clip 準備 */
    let arg = this.calcarg(type,base,50);
    ctx.save()
    utilclippath(ctx,arg);/* clip */
    let [a,b] = this.ihash[id];
    let p = [100,740-604,796,604,0,0,796,604];/* 1000x740 */
    ctx.drawImage(this.img[a],p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]);
    ctx.drawImage(this.img[b],p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]);
    ctx.restore()
  }
  draw(ctx,base,flag){
    ctx.save()
    ctx.filter = 'grayscale(100%)'
    let p = [100,740-604,796,604,0,0,796,604];/* 1000x740 */
    ctx.drawImage(this.img[2],p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]);
    if(!flag){ctx.restore()}
    this.bgdraw(ctx, base, 0, "grass"); // 左
    this.bgdraw(ctx, base, 1, "ruins"); // 右
    if(flag){ctx.restore()}
  }
}
// バトル
class battleMain {
  constructor(ctx) {
    this.gsize = [796,604];
    this.chara = [];
    this.ctx = ctx;
    this.flag = 1;
    this.cutin = false;
    this.bgc = new backgroundClass(this);
    this.cin = new cutinClass(this);

    // TEST
    this.img4 = new Image();
    this.img4.src = "img/add/gamenfire.png";
  }
  keycont(e){
    let k = e.key;
    if(k=="z"){
      this.cflag = 1;
    }
    if(k=="x"){
      this.cflag = 2;
    }
  }
  // キャラクターの読み込み
  initload(csdr,esdr) {
    // Team
    this.ch = new teamClass(this);
    this.ch.initLoad(0,csdr);
    this.en = new teamClass(this);
    this.en.initLoad(1,esdr);
    // initialize
    this.sts = 1;
    this.initcnt = 180;
    // 背景リセット
    let [gCVX, gCVY] = this.gsize;
    let ctx = this.ctx;
    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);
    //音楽開始
    //audioPlayBGM("MusMus-BGM-171")
  }
  endfunc(){
    audioStopBGM();
    audioStopBGS();
  }
  basecalc(sts,tm){
    let base = 796/2;
    if(sts == 1){
      //let tm = this.initcnt;
      if(tm > 120){
        base = base-400+1200*((tm-120)/(180-120))
      }else if(tm > 60){
        base = base-400
      }else if(tm > 30){
        base = base-400*((tm-30)/(60-30))
      }
    }
    if(sts==3){ // 80
      let tm = this.initcnt;
      let aa = 60;
      let th = 2*Math.PI*((tm%80)/80);
      base += aa * Math.sin(th);
    }
    if(sts==4){
      let tm = this.initcnt;
      let tp = this.sts4type;
      {
        let aa = 0;
        if(tm > 140){
          aa = tm-140
        }
        if(tm <= 20){
          aa = 20-tm;
        }
        if(tp==1){
          let ww = (base-(796-100))*(aa/20);
          base = (796-100)+ww;
        }else{
          let ww = (base-(100))*(aa/20);
          base = (100)+ww;
        }
      }
    }
    if(sts==5){
      base = this.sts5base;
    }
    if(sts==6){
      base = this.sts6base;
    }
    return base;
  }

  draw0(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = 150;
      this.sts = 2;
      return this.draw1(ctx)
    }
  }

  draw1(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = 60;
      this.sts = 3;
      return this.draw2(ctx)
    }
    //立ち絵
    this.ch.drawInit(ctx);
    this.en.drawInit(ctx);
    // カットイン演出
    this.cin.draw1x(ctx,this.initcnt,140)
  }

  draw2(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = 80;
      //return;
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    //兵士ためし
    for(let cc of this.ch.chara){
      cc.move();
      cc.draw(ctx);
    }
    for(let cc of this.en.chara){
      cc.move();
      cc.draw(ctx);
    }
  }
  draw3(ctx,base){
    if (this.initcnt-- <= 0) {
      this.initcnt = (this.sts4type==1)?80:40;
      this.sts = 3;
      return this.draw2(ctx)
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    // カットイン中：４ (baseで決めるべきか？？？)
    let dx = -1;
    if(base > 796-200){
      dx = (base-(796-100)); // dx 0-100
      this.en.drawCutin(ctx,dx,this.initcnt);
    }
    if(base < 200){
      dx = (base-(100)); // dx 0-100
      this.ch.drawCutin(ctx,dx,this.initcnt);
    }
    // セリフが100-20
    // 100 の時にちょっと寄り道、５
    if(this.initcnt == 100){
      this.sts=5;
      this.sts5tm = 150; // これで回る
      this.sts5base = base;
      this.sts5dx = dx;
      this.sts5type = this.sts4type;
      this.sts5ch = (this.sts4type==1)? this.en : this.ch;
    }
    if(this.initcnt == 20 && this.sts4next > 0){
      this.sts = 6;
      //業火
      if(this.sts4next == 3){
        this.sts6type = this.sts4next;
        this.sts6tm = 180;
        this.sts6base = -100; // 相手側
      }
      if(this.sts4next == 7){
        this.sts6type = this.sts4next;
        this.sts6tm = 180;
        this.sts6base = -100; // 自分側
      }
    }
  }

  draw4(ctx){
    if (this.sts5tm-- <= 0) {
      console.log(this.sts5ch.teamID); // 3
      this.sts4next = 0;
      if(this.sts5ch.teamID==3){
        this.sts4next = 3;// 火計
        this.ch.pupset(2);
      }
      if(this.sts5ch.teamID==7){
        this.sts4next = 7;
        this.ch.pupset(1);
      }
      this.sts = 4
      return this.draw3(ctx);
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    this.sts5ch.drawCutin(ctx,this.sts5dx,this.initcnt);
    // カットイン演出
    this.cin.draw4x(ctx,this.sts5tm,160,this.sts5type)
  }

  draw5(ctx){
    if(this.sts6tm-- <= 0) {
      audioStopBGS();
      this.ch.pupset(0);
      this.sts = 3;
      return this.draw2(ctx);
    }
    // 火計
    if(this.sts6type == 3){
      //兵士ためし
      this.ch.pupdraw(ctx);
      //640x2400 = 640,480 x 5
      let [w,h] = [640,480];
      let ix = Math.floor(this.sts6tm/4)%5;
      //[796,604]
      ctx.drawImage(this.img4,0,h*ix,w,h,0,0,796,604);
      if(this.sts6tm==175){
        audioPlayBGS("Fire1");
      }
    }
    // 号令 (180F)
    if(this.sts6type == 7){//796,604
      //兵士ためし
      this.ch.pupdraw(ctx);
    }
  }

  loopfunc() {
    let [gCVX, gCVY] = this.gsize;
    if (this.endcnt > 0) {
      this.endcnt--;
      if (this.endcnt <= 0) {
        endFunc();
        return;
      }
    }
    // 入力処理
    if(this.cflag!=0){
      if(this.sts==3){
        this.sts = 4;
        this.sts4type = this.cflag; // 敵味方の区別。操作ボタン。
        this.sts4pre = this.initcnt; // 使うことはなさそう。
        this.initcnt = 160;
        audioInvokeSE("Thunder10");
      }
      this.cflag=0;
    }

    let ctx = this.ctx;
    let flag = (this.sts==2)?true:false;

    // 背景リセット
    ctx.fillStyle = 'rgb(80,80,80)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);
    // 背景
    let base = this.basecalc(this.sts,this.initcnt);
    this.bgc.draw(ctx,base,flag);

    // 立ち合い処理
    if (this.sts == 1) {
      return this.draw0(ctx);
    }
    if (this.sts == 2) {
      return this.draw1(ctx);
    }
    if (this.sts == 3) {
      return this.draw2(ctx);
    }
    if (this.sts == 4) {
      return this.draw3(ctx,base); // base で判断している処理があるため・・
    }
    if (this.sts == 5) {
      return this.draw4(ctx);
    }
    if (this.sts == 6) {
      return this.draw5(ctx);
    }
  }

  memberDraw(ctx){
    ctx.strokeStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.strokeRect(80,100,240,340);
    ctx.strokeRect(gCVX-320,100,240,340);

    // 敵側の配置
    ctx.fillStyle = 'rgb(255,0,0)'; //塗りつぶしの色
    for(let i=0;i<8;i++){
      let ix = Math.floor(i/4);
      let iy = (i%4);
      let [cx,cy] = [80+30+120*ix,100+30+80*iy-20*ix];
      ctx.fillRect(cx,cy,64,64);//64x64
    }
    // 味方側の配置
    ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
    for(let i=0;i<8;i++){
      let ix = Math.floor(i/4);
      let iy = (i%4);
      let [cx,cy] = [gCVX-320+120+30-120*ix,100+30+80*iy-20*ix];
      ctx.fillRect(cx,cy,64,64);//64x64
    }
  }

}

