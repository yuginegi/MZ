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

class test0 {
  constructor() {
    this.name = "test0";
    console.log("test0 new construct");
    this.endfunc = () => { console.log("endfunc(): Please Override if you need."); }
    window.addEventListener('resize', this.resizeFunc.bind(this));
    this.sts = 0;
  }
  invoke() {
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
    b.initload(7,30);
    this.setintval = setInterval(b.loopfunc.bind(b), 1000 / 60);
  }
  endinvoke() {
    console.log("endinvoke");
    clearInterval(this.setintval);
    const element = document.getElementById('WRAPTOP');
    //element.remove();
    element.style.display = "none";
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

// Team
class teamClass {
  constructor(parent) {
    this.parent = parent;
    this.chara = [];
    this.gsize = parent.gsize;
    this.initcnt = 0;
  }
  // パラメータを頑張ってセット
  initLoad(type,n) {
    let [gCVX, gCVY] = this.gsize;
    this.type = type;
    if(type==0){
      // 右だから
      this.pxy = [796-350,100];
      this.wpar = [300, gCVY*(2/3)+50, gCVX-350, gCVY*(1/3)-80];
      this.tpar = [350, gCVX*(2/3)]
    }else{
      // 左だから
      this.pxy = [20,100];
      this.wpar = [30, gCVY*(0/3)+20, gCVX-350, gCVY*(1/3)-80];
      this.tpar = [60, 100]
    }
    // データ読み込み
    if(n==7){
      let imgsrc = "img/pictures/Actor1_5.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "いけ！";
      this.ctxt = "ここが勝負時だ！";
      this.simg = new Image();
      this.simg.src = "img/faces/Actor1.png";
      this.spar = [this.simg,0,144,144,144];
    }else if(n==3){
      let imgsrc = "img/sv_add/duran.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "相手をしてやろう";
      this.ctxt = "地獄の業火をくらえ！";
      this.simg = new Image();
      this.simg.src = "img/faces/aa_duran.png";
      this.spar = [this.simg,0,0,144,144];
    }else{
      let imgsrc = "img/pictures/Actor2_8.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "守ってみせまする";
      this.ctxt = "守ってみせまする";
      this.simg = new Image();
      this.simg.src = "img/faces/Actor2.png";
      this.spar = [this.simg,144*3,144,144,144];
    }
  }
  drawchara(ctx,x,y){
    ctx.save();
    ctx.shadowColor='rgb(0,255,255)';
    ctx.shadowOffsetX=10;
    ctx.shadowOffsetY=-3;
    ctx.drawImage(this.img, x, y);
    ctx.restore();
  }
  drawInit(ctx){
    //立ち合いのセリフ
    if(0){
      ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
      let p = this.wpar;
      ctx.fillRect(p[0],p[1],p[2],p[3]);
      ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
      ctx.font = "40px MSゴシック";
      p = this.tpar;
      ctx.fillText(this.itxt, p[0],p[1]);
    }
    // キャラの絵（dxに依存のみ）
    this.drawchara(ctx,this.pxy[0],this.pxy[1])
  }
  drawCutin(ctx,base,tm){
    let [gCVX, gCVY] = this.gsize;
    let [x,y] = this.pxy;
    x = (gCVX-330)/2;//330:PNG.width
    let dx = gCVX*(base/100)
    // セリフ
    if(40 < tm && tm < 100){
      ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
      let p = this.wpar;
      let y1 = gCVY*(0/3)+20;
      ctx.fillRect(p[0],y1,p[2],p[3]/2);
      ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
      ctx.font = "40px MSゴシック";
      p = this.tpar;
      //let y2 = 100;
      ctx.fillText(this.ctxt, p[0],60+4); // y:上に出す
    }
    {
      let st = 160;
      let mm = 20;
      let mt = st-mm;
      let x = 0;
      let w = (tm<mt)? gCVX: gCVX*(st-tm)/mm;
      if(this.type==0){
        ctx.fillStyle = 'rgba(0,255,0,0.5)'; //塗りつぶしの色
        x = gCVX-w;
      }else{
        ctx.fillStyle = 'rgba(255,0,0,0.5)'; //塗りつぶしの色
      }
      ctx.fillRect(x,100,w,350);
    }
    // キャラの絵（dxに依存のみ）
    this.drawchara(ctx,x+dx,y)
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
      ctx.beginPath();
      let arg = [
        [mm/2+xx,ypos],[mm/2+xx+ww,ypos],[xx+ww,ypos+mm],[xx,ypos+mm],
      ];
      UtilmultiMoveLine(ctx,arg);
      ctx.closePath();
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
    ctx.fillRect(x0,ypos,wbar,mm);
    // 白のきらりの仕掛け
    this.bardraw2white(ctx,type);
    //--- 線引く
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.beginPath();
    UtilmultiMoveLine(ctx,argZZ);
    ctx.closePath();
    ctx.stroke();
    /* clip 後片付け */
    ctx.restore()
  }
  // キャラにお引越しすべき
  commondraw2(ctx){
    let type = this.type; 
    let [gCVX, gCVY] = this.gsize; // [796,604]
    let ypos = gCVY-159;//10
    // バー描画
    ctx.fillStyle = (type==0)?'rgb(0,0,255)':'rgb(255,0,0)';
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
      let p = this.spar;
      ctx.drawImage(p[0],p[1],p[2],p[3],p[4],gCVX-159,ypos,144,144);
    }
    ctx.restore();
    this.initcnt = (this.initcnt<=0) ? 80-1:(this.initcnt-1);
  }

  setwaittime(e, n) {
    let wt = Math.floor(n * Math.random());
    e.waittime = wt;
  }
  addchara(type, x, y) {
    let e = new characlass(type);
    e.pos = [x, y];
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
      if (cc.deadflag && this.hp > hp) {
        cc.deadflag = false;
        cc.sts = [0, 0]
      }
      hp += 100;
    }
  }
  check() {
    let hp = 0
    for (let cc of this.chara) {
      if (this.hp <= hp) {
        cc.deadflag = true;
      }
      hp += 100;
    }
  }
  // 勝ちフラグ
  setWin() {
    for (let cc of this.chara) {
      cc.winflag = true;
    }
  }
}

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
  draw(ctx,base){
    ctx.save()
    ctx.filter = 'grayscale(100%)'
    let p = [100,740-604,796,604,0,0,796,604];/* 1000x740 */
    ctx.drawImage(this.img[2],p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]);
    ctx.restore()
    this.bgdraw(ctx, base, 0, "grass"); // 左
    this.bgdraw(ctx, base, 1, "ruins"); // 右
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

    // TEST
    this.img1 = new Image();
    this.img1.src = "img/faces/aa_duran.png";
    this.img2 = new Image();
    this.img2.src = "img/faces/Actor1.png";
    //this.img2.style.filter = "drop-shadow(30px 10px 4px #4444dd)";
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
    return base;
  }

  draw0(ctx){
    if (this.initcnt-- <= 0) {
      this.sts = 2;
      this.initcnt = 120;
    }
    return;
  }
  draw1(ctx){
    if (this.initcnt-- <= 0) {
      this.sts = 3;
      this.initcnt = 60;
    }
    //立ち絵
    this.ch.drawInit(ctx);
    this.en.drawInit(ctx);
  }

  draw2(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = 80;
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
  }
  draw3(ctx,base){
    if (this.initcnt-- <= 0) {
      this.initcnt = (this.sts4type==1)?80:40;
      this.sts = 3;
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    // カットイン中：４ (baseで決めるべきか・・・)
    if(base > 796-200){
      let dx = (base-(796-100)); // dx 0-100
      this.en.drawCutin(ctx,dx,this.initcnt);
    }
    if(base < 200){
      let dx = (base-(100)); // dx 0-100
      this.ch.drawCutin(ctx,dx,this.initcnt);
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
      }
      this.cflag=0;
    }

    let ctx = this.ctx;
    // 背景リセット
    ctx.fillStyle = 'rgb(80,80,80)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);
    // 背景
    let base = this.basecalc(this.sts,this.initcnt);
    this.bgc.draw(ctx,base);

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
  }
}

