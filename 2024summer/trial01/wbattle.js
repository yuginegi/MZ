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
    b.initload(7,3);
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
    if(n==7){
      let imgsrc = "img/pictures/Actor1_5.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "いけ！";
      this.ctxt = "ここが勝負時だ！";
    }else if(n==3){
      let imgsrc = "img/sv_add/duran.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "相手をしてやろう";
      this.ctxt = "地獄の業火をくらえ！";
    }else{
      let imgsrc = "img/pictures/Actor2_8.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "守ってみせまする";
      this.ctxt = "守ってみせまする";
    }
  }
  drawInit(ctx){
    let [gCVX, gCVY] = this.gsize;
    let [x,y] = this.pxy;
    {
      ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
      let p = this.wpar;
      ctx.fillRect(p[0],p[1],p[2],p[3]);
      ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
      ctx.font = "40px MSゴシック";
      p = this.tpar;
      ctx.fillText(this.itxt, p[0],p[1]);
    }
    ctx.save();
    ctx.shadowColor='rgb(0,255,255)';
    ctx.shadowOffsetX=10;
    ctx.shadowOffsetY=-3;
    ctx.drawImage(this.img, x, y);
    ctx.restore();
  }
  drawCutin(ctx,base){
    let [gCVX, gCVY] = this.gsize;
    let [x,y] = this.pxy;
    x = (gCVX-330)/2;
    let dx = gCVX*(base/100)
    {
      ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
      let p = this.wpar;
      let y1 = gCVY*(0/3)+20;
      ctx.fillRect(p[0],y1,p[2],p[3]);
      ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
      ctx.font = "40px MSゴシック";
      p = this.tpar;
      let y2 = 100;
      ctx.fillText(this.ctxt, p[0],y2); // y:上に出す
    }
    ctx.save();
    ctx.shadowColor='rgb(0,255,255)';
    ctx.shadowOffsetX=10;
    ctx.shadowOffsetY=-3;
    ctx.drawImage(this.img, x+dx, y);
    ctx.restore();
  }
  setwaittime(e, n) {
    let wt = Math.floor(n * Math.random());
    //e.setSts(wt);
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
  calcarg(type,base){
    let [ww,hh] = [796,604];
    let arg = (type==0)?[[ww,hh],[ww,0]]:[[0,hh],[0,0]];
    let m0 = 30;
    let mm = (type==0)? +1*m0:-1*m0;
    let n = 8;
    for(let i=0;i<=n;i++){
      let x = (i%2==0)?base+mm+25:base+mm-25;
      let y = hh/n*i;
      arg.push([x,y]);
    }
    return arg;
  }
  bgdraw(ctx, base, type, id){
    /* clip 準備 */
    ctx.save()
    ctx.beginPath();
    let arg = this.calcarg(type,base);
    UtilmultiMoveLine(ctx,arg);
    ctx.closePath();
    ctx.clip()
    /* clip */
    let [a,b] = this.ihash[id];
    let p = [100,740-604,796,604,0,0,796,604];/* 1000x740 */
    ctx.drawImage(this.img[a],p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]);
    ctx.drawImage(this.img[b],p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]);
    /* clip 後片付け */
    ctx.restore()
  }
  draw(ctx,base){
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
      this.sts3 = 0;
    }
    //立ち絵
    this.ch.drawInit(ctx);
    this.en.drawInit(ctx);
  }
  draw2(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = 80;
      this.sts3+=1;
    }
    let [gCVX, gCVY] = this.gsize; // [796,604]
    //----
    let p = [];
    let mm = 80;
    let ybar = gCVY-10-mm;//10;
    let ypos = gCVY-159;//10
    let wbar = gCVX/2-10;
    // バー描画
    {
      ctx.fillStyle = 'rgb(255,0,0)'; //塗りつぶしの色
      ctx.fillRect(10,ybar,wbar,mm);
      ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
      ctx.fillRect(gCVX/2,ybar,wbar,mm);
      // きらりん
      let nn = 10;
      if(this.initcnt<=2*nn){
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; //塗りつぶしの色
        let tt = 2*nn-this.initcnt;//0-19
        let dw = wbar/nn;
        let xx = 10+wbar-dw*(2*nn-tt);
        let ww = wbar;
        let xe = xx+ww;
        if(xe > gCVX/2){
          ww = gCVX/2-xx;
        }
        if(xx <= 10){
          xx = 10;
          ww = xe-xx;
        }
        ctx.fillRect(xx,ybar,ww,mm);
        //逆向き
        xx = gCVX - xx - ww;
        ctx.fillRect(xx,ybar,ww,mm);
      }
    }
    // キャラ描画
    ctx.save();
    ctx.shadowOffsetX=5;
    ctx.shadowOffsetY=-5;
    ctx.shadowBlur = 10;
    ctx.shadowColor='rgb(255,0,255)';
    p = [this.img1,0,0,144,144];
    ctx.drawImage(p[0],p[1],p[2],p[3],p[4],10,ypos,144,144);
    ctx.shadowColor='rgb(0,255,255)';
    p = [this.img2,0,144,144,144];
    ctx.drawImage(p[0],p[1],p[2],p[3],p[4],gCVX-159,ypos,144,144);
    ctx.restore();
    // 描画(上の黄色)
    ctx.fillStyle = 'rgb(255,255,0)'; //塗りつぶしの色
    ctx.fillRect(10,10,wbar*2,30);

    /* this.memberDraw(ctx) */

    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.fillText("戦闘中",220,550);
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

  basecalc(){
    let base = 796/2;
    if(this.sts == 1){
      let tm = this.initcnt;
      if(tm > 120){
        base = base+400-1200*((tm-120)/(180-120))
      }else if(tm > 60){
        base = base+400
      }else if(tm > 30){
        base = base+400*((tm-30)/(60-30))
      }
    }
    if(this.sts==3){ // 80
      let tm = this.initcnt;
      let aa = 60;
      let th = 2*Math.PI*((tm%80)/80);
      base += aa * Math.sin(th);
      let tt = this.sts3%10;
      if(tt==2 || tt==3){
        let aa = 0;
        if(tt==2 && this.initcnt > 60){
          aa = this.initcnt-60
        }
        if(tt==3 && this.initcnt <= 20){
          aa = 20-this.initcnt;
        }
        let ww = (base-100)*(aa/20);
        base = (100)+ww;
      }
      if(tt==7 || tt==8){
        let aa = 0;
        if(tt==7 && this.initcnt > 60){
          aa = this.initcnt-60
        }
        if(tt==8 && this.initcnt <= 20){
          aa = 20-this.initcnt;
        }
        let ww = (base-(796-100))*(aa/20);
        base = (796-100)+ww;
      }
    }
    return base;
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

    let ctx = this.ctx;
    // 背景リセット
    ctx.fillStyle = 'rgb(80,80,80)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);
    // 背景
    let base = this.basecalc();
    this.bgc.draw(ctx,base);
    if(this.sts==3 && base > 796-200){
      let dx = (base-(796-100)); // dx 0-100
      this.en.drawCutin(ctx,dx);
    }
    if(this.sts==3 && base < 200){
      let dx = (base-(100)); // dx 0-100
      this.ch.drawCutin(ctx,dx);
    }

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
  }
}
