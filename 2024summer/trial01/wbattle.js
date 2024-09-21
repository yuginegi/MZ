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
    this.keiryaku = new keiryakuClass(this);

    this.dfunc = [this.draw0,this.draw1,this.draw2,this.draw3,this.draw4,this.draw5];
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
      let tm = this.initcnt; // 160 START
      let tp = this.sts4type;
      this.sts4dx = null;
      {
        /***************************************************************
         * aa が小さいと ww が０
         * つまり、160->140 ＝ base->(796-100)
         * 20->0 ＝ (796-100)->base
         * baseがだいたい真ん中。300を20Fかけて移動するくらいの理解で良い。
         * dx = (base-(796-100)) とは、dx = ((796-100)+ww) - (796-100)
         ***************************************************************/
        let aa = 0;
        if(tm > 140){aa = tm-140;}
        if(tm <= 20){aa = 20-tm;}
        if(tp==1){
          let ww = (base-(796-100))*(aa/20);
          base = (796-100)+ww; // ww = base-(796-100)
          this.sts4dx = ww;
        }else{
          let ww = (base-(100))*(aa/20);
          base = (100)+ww; // ww = base-100
          this.sts4dx = ww;
        }
      }
      this.sts4base = base;
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
    this.cin.battlestart(ctx,this.initcnt,140)
  }

  draw2(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = 80;
      return this.draw2(ctx);
    }
    // 下のバー
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    // 兵士
    this.ch.charadraw(ctx);
    this.en.charadraw(ctx);
  }
  draw3(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = (this.sts4type==1)?80:40;
      this.sts = 3;
      return this.draw2(ctx)
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    // 指揮官のカットイン表示
    if(this.sts4base > 796-200){
      this.en.drawCutin(ctx,this.sts4dx,this.initcnt);
    }
    if(this.sts4base < 200){
      this.ch.drawCutin(ctx,this.sts4dx,this.initcnt);
    }
    // セリフが100-20
    // 100 の時にちょっと寄り道、５
    if(this.initcnt == 100){
      this.sts = 5;
      this.sts5tm = 150; // これで回る
      this.sts5base = this.sts4base;//base
      this.sts5dx = this.sts4dx;//dx;
      this.sts5type = this.sts4type;
      this.sts5ch = (this.sts4type==1)? this.en : this.ch;
    }
    if(this.initcnt == 20){
      this.sts = 6;
      let [tm,base] = this.keiryaku.getInitParam();
      this.sts6tm = tm;
      this.sts6base = base;
    }
  }

  draw4(ctx){
    if (this.sts5tm-- <= 0) {
      this.keiryaku.setCutinParam(this.sts5ch.kwiryaku, this.ch, this.en);
      this.sts = 4
      return this.draw3(ctx);
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    this.sts5ch.drawCutin(ctx,this.sts5dx,this.initcnt);
    // カットイン演出
    this.cin.keiryakucutin(ctx,this.sts5tm,160,this.sts5type)
  }

  draw5(ctx){
    if(this.sts6tm-- <= 0) {
      this.keiryaku.closeFunc();
      this.sts = 3;
      return this.draw2(ctx);
    }
    this.keiryaku.cutinEffect(ctx,this.sts6tm);
  }

  loopfunc() {
    /* 
    // 抜ける処理（今は動いてない、外から「endinvoke」が呼ばれる）
    if (this.endcnt > 0) {
      console.log("loopend?")
      this.endcnt--;
      if (this.endcnt <= 0) {
        console.log("loopend?")
        endFunc();
        return;
      }
    }*/
    // 入力処理
    if(this.cflag!=0){
      if(this.sts==3){
        this.sts = 4;
        this.initcnt = 160;
        this.sts4type = this.cflag; // 敵味方の区別。操作ボタン。
        //this.sts4pre = this.initcnt; // 使うことはなさそう。
        audioInvokeSE("Thunder10");
      }
      this.cflag=0; // 入力を空にする
    }

    // 描画処理
    let ctx = this.ctx;
    //let flag = (this.sts==2)?true:false;

    // 背景
    let base = this.basecalc(this.sts,this.initcnt);
    this.bgc.draw(ctx,base,(this.sts==2));
    //if(this.sts >=1 && this.sts <= this.dfunc.length)
    if(this.dfunc[this.sts-1]){
      let func = this.dfunc[this.sts-1].bind(this);
      return func(ctx);
    }
    return;
  }
}

