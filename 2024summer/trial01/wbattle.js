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
    this.btm.rootclass = this;

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

    this.dfunc = [this.draw0,this.draw1,this.draw2,this.draw3,this.draw4];
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
      //if(this.sts5tm >= 0){base = this.sts5base; }else 
      if(this.sts6tm >= 0){
        base = this.sts6base;
      }else{
        /***************************************************************
         * aa が小さいと ww が０
         * つまり、160->140 ＝ base->(796-100)
         * 140-20 は aa=0,ww=0;
         * 20->0 ＝ (796-100)->base
         * baseがだいたい真ん中。300を20Fかけて移動するくらいの理解で良い。
         * dx = (base-(796-100)) とは、dx = ((796-100)+ww) - (796-100)
         ***************************************************************/
        let aa = 0;
        if(tm > 140){aa = tm-140;}
        if(tm < 20){aa = 20-tm;}
        let bb = (tp==1)? (796-100) : (100);
        let ww = (base-bb)*(aa/20);
        base = bb+ww;
        this.sts4dx = ww;
      }
      this.sts4base = base;
    }
    if(sts==5){ // sts = 5 200 から start
      // sts = 4 のように、時刻で移動させる
      let tb = this.draw4mx -20;
      let tm = this.initcnt;
      let tp = (this.ch.hp <= 0)? 0:1; // やられた側へ
      let aa = 0;
      if(tm > tb){aa = tm-tb;}
      // aa さえもらえれば
      let bb = (tp==1)? (796-100) : (100);
      let ww = (base-bb)*(aa/20);
      base = bb+ww;
    }
    return base;
  }

  draw0(ctx){ // 180
    if(this.initcnt == 180){
      this.ch.moveset(1);
      this.en.moveset(2);
    }
    if (this.initcnt-- <= 0) {
      this.initcnt = 150;
      this.sts = 2;
      this.ch.moveset(0);
      this.en.moveset(0);
      return this.draw1(ctx)
    }
    // 兵士
    let tm = this.initcnt;
    if(60 < tm && tm < 180){
      this.ch.pupdraw(ctx);
    }
    if(0 < tm && tm < 60){
      this.en.pupdraw(ctx);
    }
    // 下のバー
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
  }

  draw1(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = 60;
      this.sts = 3;
      this.sts3tm = 0
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
    // 兵士
    this.ch.charadraw(ctx);
    this.en.charadraw(ctx);
    // 下のバー
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
  }

  //=== 計略演出効果(sts=4) =======
  draw3(ctx){
    if(this.sts5tm >= 0){
      return this.draw3A(ctx)
    }
    if(this.sts6tm >= 0){
      return this.draw3B(ctx)
    }
    //DBG//console.log(this.initcnt);
    if (this.initcnt-- <= 0) {
      this.initcnt = (this.sts4type==1)?80:40;
      this.sts = 3;
      this.sts3tm = 0
      return this.draw2(ctx)
    }
    // 描画メイン
    this.draw3main(ctx);
    // 100 の時にちょっと寄り道、５
    if(this.initcnt == 100){
      this.enterdraw3A();
    }
    // 20 の時にちょっと寄り道、６
    if(this.initcnt == 20){
      this.enterdraw3B();
    }
  }
  draw3main(ctx){
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    // 指揮官のカットイン表示
    if(0 < this.sts4base && this.sts4base < 200){
      //DBG//console.log("Player cutin",this.sts4base);
      this.ch.drawCutin(ctx,this.sts4dx,this.initcnt);
    }
    if(796-200 < this.sts4base && this.sts4base < 796 ){
      //DBG//console.log("Enemys cutin",this.sts4base);
      this.en.drawCutin(ctx,this.sts4dx,this.initcnt);
    }
  }
  enterkeiryaku(){
    this.sts = 4;
    this.initcnt = 160;
    this.sts4type = this.cflag; // 敵味方の区別。操作ボタン。
    audioInvokeSE("Thunder10");
    this.sts5tm = -1;// 抜けるときは -1 になる。ので、無効化は-1
    this.sts6tm = -1;// 抜けるときは -1 になる。ので、無効化は-1
  }
  enterdraw3A(){
    this.sts5tm = 150; // これで回る
    this.sts5dx = this.sts4dx;
    this.sts5type = this.sts4type;
    this.sts5ch = (this.sts4type==1)? this.en : this.ch;
  }
  enterdraw3B(){
    let [tm,base] = this.keiryaku.getInitParam();
    this.sts6tm = tm; // これで回る
    this.sts6base = base;
    console.log(tm,base);
  }

  draw3A(ctx){
    if (this.sts5tm-- <= 0) {
      this.keiryaku.setCutinParam(this.sts5ch.kwiryaku, this.ch, this.en);
      //this.sts = 4
      return this.draw3(ctx);
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    this.sts5ch.drawCutin(ctx,this.sts5dx,this.initcnt);
    // カットイン演出
    this.cin.keiryakucutin(ctx,this.sts5tm,160,this.sts5type)
  }

  draw3B(ctx){
    if(this.sts6tm-- <= 0) {
      this.keiryaku.closeFunc();
      // のこり２０Ｆの指揮官の引っ込む表示するとき
      //this.sts = 4
      return this.draw3(ctx);
      // のこり２０Ｆを捨てて、戦闘に戻るとき
      this.sts = 3;
      return this.draw2(ctx);
    }
    this.keiryaku.cutinEffect(ctx,this.sts6tm);
  }

  //=== 決着(sts=5) =======
  // 200-160 HP バーが出る
  // 160-140 カットインで出てくる
  // 80-20 敗北セリフ
  // 40- キャラ引っ込む
  // draw4B 勝利セリフ
  draw4(ctx){
    if(this.draw4ex >= 0){
      return this.draw4B(ctx)
    }
    // 戦闘終了
    if (this.initcnt-- <= 0) {
      this.rootclass.endinvoke();
      return;
    }
    // バーはある程度残す
    if(this.initcnt >=(this.draw4mx-40)){
      this.ch.commondraw2(ctx,1);
      this.en.commondraw2(ctx,0);
      return
    }
    // 指揮官のカットイン表示
    {
      let tm = this.initcnt;
      let tp = this.draw4tp;//(this.ch.hp <= 0)? 0:1;
      this.draw4leader(ctx,0,tm,tp, [(this.draw4mx-60),20,40,20])
    }
    // 勝利セリフに移行
    if(this.initcnt==0){
      this.draw4mx = 160;
      this.draw4ex = this.draw4mx;
    }
  }
  draw4B(ctx){
    if (this.draw4ex-- <= 0) {
      return this.draw4(ctx);
    }
    // 指揮官のカットイン表示
    {
      let tm = this.draw4ex;
      let tp = 1-this.draw4tp;//(this.ch.hp <= 0)? 1:0; // 逆
      this.draw4leader(ctx,1,tm,tp, [(this.draw4mx-20),20,0,20])
    }
  }
  draw4leader(ctx,ed,tm,tp,arg){
    let [t1,n1,t2,n2] = arg;
    let team = (tp==0)?this.ch:this.en;
    let aa = 0;
    if(tm-t1 > 0){aa = (tm-t1)/n1;}
    if(t2-tm > 0){aa = (t2-tm)/n2;}
    let dx = (tp==0)?400*aa:-400*aa;
    team.endCutin(ctx,dx,tm,ed);
  }

  battleCalc(dd,aa){
    let atk = aa.getAtk();
    let def = dd.getDef();
    let v = atk - def;
    dd.setDamage(v);
  }
  hpcheck(){
    if(this.ch.hp > 0 && this.en.hp > 0){return;}
    this.draw4mx = 200;
    this.draw4tp = (this.ch.hp <= 0)? 0:1;
    this.sts = 5;
    this.initcnt = this.draw4mx;
  }

  loopfunc() {
    // 入力処理
    if(this.cflag!=0){
      if(this.sts==3){
        this.enterkeiryaku();
      }
      this.cflag=0; // 入力を空にする
    }
    // 戦闘中か？ そうなら、ダメージ計算
    if(this.sts == 3){
      this.sts3tm++;
      if(this.sts3tm%180==0){
        this.battleCalc(this.ch,this.en);
        this.battleCalc(this.en,this.ch);
      }
      // HPの判定
      this.hpcheck();
    }

    // 描画処理
    let ctx = this.ctx;
    // 背景
    let base = this.basecalc(this.sts,this.initcnt);
    this.bgc.draw(ctx,base,(this.sts==2));
    // シーンごとの描画処理
    if(this.dfunc[this.sts-1]){
      let func = this.dfunc[this.sts-1].bind(this);
      return func(ctx);
    }
    return;
  }
}

