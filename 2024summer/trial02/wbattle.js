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
    //DBG//強制的に勝つ
    //this.btm.btlresult = 1;
    this.endfunc(this.btm.btlresult);
  }
  clickfunc(ii) {
    console.log("clickfunc",ii);
    this.btm.cflag = ii;
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
      type: "button", textContent: "ESCAPE",
      style: { position: "absolute", right: "5px", top: "5px" }
    });
    btn.addEventListener("click", this.endinvoke.bind(this));
    window.addEventListener('keydown', this.kfunc.bind(this));
    // 計略ボタン enterkeiryaku で処理してくれるので、セットする
    {
      let bcolor = "#FFFF0000";
      let btnK1 = generateElement(base, {
        type: "div", id: "btnK1",
        style: {backgroundColor: bcolor, // gCVX-159-72-5, gCVY-72-10
        position: "absolute", left: (w-144-10)+"px", top: (h-144-10)+"px", 
        width: 144 + "px", height: 144 + "px"
        }
      });
      btnK1.addEventListener("click", this.clickfunc.bind(this,2));
      let btnK2 = generateElement(base, {
        type: "div", id: "btnK2",
        style: {backgroundColor: bcolor, // gCVX-159-72-5, gCVY-72-10
        position: "absolute", left: (w-144-10-10-72)+"px", top: (h-72-10)+"px", 
        width: 72 + "px", height: 72 + "px"
        }
      });
      btnK2.addEventListener("click", this.clickfunc.bind(this,3));
      let btnK3 = generateElement(base, {
        type: "div", id: "btnK3",
        style: {backgroundColor: bcolor, // gCVX-159-72-5, gCVY-72-10
        position: "absolute", left: (w-144-10-10-72-5-72)+"px", top: (h-72-10)+"px", 
        width: 72 + "px", height: 72 + "px"
        }
      });
      btnK3.addEventListener("click", this.clickfunc.bind(this,4));
    }
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
    this.btlresult = 0;

    this.dfunc = [this.draw0,this.draw1,this.draw2,this.draw3,this.draw4,this.draw5];
    // krdata for eventflag
    this.krdata = {
      999:{tm:180,
      tp:1, //ENEMY
      cutintm:160,statm:140,endtm:20,
      serif:"げええ！！",
      ch:-1,
      },
      1:{tm:300,
        tp:0, //PLAYER
        cutintm:280,statm:260,endtm:20,
        //serif:null,
        serifArr:[
          [260,"攻撃なら得意だよ！"],
          [180,"計略で速度を上げるっ"],
          [100,"いつでも任せて！"],
        ],
        ch:0,
      },
      2:{tm:300,
        tp:0, //PLAYER
        cutintm:280,statm:260,endtm:20,
        //serif:null,
        serifArr:[
          [260,"気を付けてください！"],
          [180,"大ダメージが来ます！"],
          [100,"私の計略で守ります！"],
        ],
        ch:1,
      },
      // ２面
      9:{tm:140,tp:0, //PLAYER
      cutintm:120,statm:100,endtm:20,
      serifArr:[
        [100,"くらいなさい！"],
      ],
      ch:1,next:[0,4] // 計略を撃つ(２人目)
      },
      10:{tm:300,
        tp:1, //ENEMY
        cutintm:280,statm:260,endtm:20,
        serifArr:[
          [260,"返り討ちにする！"],
          [180,"我らの忍術・・・"],
          [100,"貴様に破れるか！"],
        ],
        ch:0,
        next:[0,11] // 計略を撃つ
      },
      11:{tm:300,
        tp:1, //ENEMY
        cutintm:280,statm:260,endtm:20,
        serifArr:[
          [260,"やらせはしない"],
          [180,"我ら忍術による鉄壁"],
          [100,"苦しむがいい！！"],
        ],
        ch:1,
        next:[1,13] // 回復に対して EVENT13
      },
      12:{tm:300,
        tp:0, //PLAYER
        cutintm:280,statm:260,endtm:20,
        serifArr:[
          [260,"なるほど、あの強化は"],
          [180,"わたしの計略にお任せ"],
          [100,"ぱぱぱっとします！"],
        ],
        ch:0,
      },
      13:{tm:300,tp:0, //PLAYER
        cutintm:280,statm:260,endtm:20,
        serifArr:[
          [260,"堅い守りですね・・"],
          [180,"良き時に私の計略を"],
          [100,"剣撃で突破します！！"],
        ],
        ch:1,
      },
      14:{tp:1,next:[0,12],tm:0},
      // ３面
      15:{tm:300,tp:1, //ENEMY
        cutintm:280,statm:260,endtm:20,
        serifArr:[
          [260,"わたしに逆らうとは"],
          [180,"炎獄のデュランが・・"],
          [100,"焼き尽くしてやる！"],
        ],
        next:[0,10] // 計略を撃つ
      },
      16:{tm:300,tp:1, //ENEMY
        cutintm:280,statm:260,endtm:20,
        serifArr:[
          [260,"デュラン様！"],
          [180,"守ってみせます・・・"],
          [100,"命を賭しても！！"],
        ],
        ch:0,next:[0,11] // 計略を撃つ
      },
      // ３面味方
      17:{tm:300,tp:0, //PL
        cutintm:280,statm:260,endtm:20,
        serifArr:[
          [260,"回復はお任せください"],
          [180,"あまり打てませんので"],
          [100,"ここぞという時に！"],
        ],
        ch:0,next:[0,3] // 計略を撃つ(１人目)
      },
      18:{tm:300,tp:0, //PL
        cutintm:280,statm:260,endtm:20,
        serifArr:[
          [260,"あの炎は周期的らしい"],
          [180,"タイミングを見て"],
          [100,"わたしの計略を！！"],
        ],
        ch:1,next:[0,4] // 計略を撃つ(２人目)
      },
    };
  }
  keycont(e){
    let k = e.key;
    //DBG//if(k=="z"){this.cflag = 1;}
    if(k=="x"){this.cflag = 2;}
    if(k=="c"){this.cflag = 3;}
    if(k=="v"){this.cflag = 4;}
    // ENEMY
    if(k=="q"){this.cflag = 10;}
    if(k=="w"){this.cflag = 11;}
    if(k=="e"){this.cflag = 12;}
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
    // 背景セット
    this.bgc.init(csdr-6);
    // 背景リセット
    let [gCVX, gCVY] = this.gsize;
    let ctx = this.ctx;
    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);
    //音楽開始
    //audioPlayBGM("MusMus-BGM-171")
    // 勝敗フラグ
    this.btlresult = 0;
    this.eventflag = 0;
    this.nextFlag = 0;
    // TEST
    this.imgface = new Image();
    this.imgface.src = "img/faces/Actor1.png"
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
      let tp = this.sts4type; // 方向決めにしか使ってない
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
    if(tm==150||tm==140||tm==130|| tm==60||tm==50||tm==40){
      //audioInvokeSE("Run",100,60)
      audioInvokeSE("Run")
    }

    // 下のバー
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
  }

  draw1(ctx){
    if (this.initcnt-- <= 0) {
      this.initcnt = 60;
      this.sts = 3;
      //this.sts3tm = 0
      this.sts3tmTM = [this.ch.getAgi(),this.en.getAgi()]
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
    // ゲスト 足してみる
    if(1){
      this.ch.drawGuest(ctx);
      this.en.drawGuest(ctx);
    }else{
      let [gCVX, gCVY] = this.gsize;
      let [x,y,w,h] = [gCVX-159-72-5, gCVY-72-10, 72, 72]
      let pos = [x,x-72-5];
      for(let i=0;i<2;i++){
        let px = pos[i]; 
        ctx.fillStyle = "#000088";
        let flag = Math.floor(this.initcnt/8)%5;
        if(flag){
          // 必殺技打てるかどうか確認する
          let rtn = this.ch.checkKeiryaku(i+1);
          if(rtn==0){
            let cl = ["#00FFFF","#00CCCC","#00AAAA","#008888"];
            ctx.fillStyle = cl[flag-1];
          }
        }
        let mg = 2;
        ctx.fillRect(px-mg,y-mg,w+2*mg,h+2*mg);
        // 
        if(0){
          ctx.drawImage(this.imgface,0+144*i,0,144,144,px,y,w,h)
        }else{
          this.ch.drawSupport(ctx,i,px,y,w,h);
        }
      }
    }
    // カウントダウン 足してみる
    let [gCVX, gCVY] = this.gsize;
    let fm = 40;
    let [x,y,w,h] = [gCVX/2, gCVY-fm-10, 60, fm]
    let pos = [(gCVX-w)/2+35,(gCVX-w)/2-35];// 味方、敵
    for(let i=0;i<2;i++){
      let px = pos[i]; 
      ctx.fillStyle = "#000000";
      ctx.fillRect(px,y,w,h);
      //let v = 179-(this.sts3tm%180);
      let v = this.sts3tmTM[i];
      v = Math.floor(v/10);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = fm+"px MSゴシック";
      ctx.fillText(""+v,px+w/2,y,w);
    }
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
      //this.sts3tm = 0
      this.sts3tmTM = [this.ch.getAgi(),this.en.getAgi()]
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
      this.ch.drawCutin(ctx,this.sts4dx,this.initcnt,this.sts4keiryaku);
    }
    if(796-200 < this.sts4base && this.sts4base < 796 ){
      //DBG//console.log("Enemys cutin",this.sts4base);
      this.en.drawCutin(ctx,this.sts4dx,this.initcnt,this.sts4keiryaku);
    }
  }
  enterkeiryaku(){
    //打てるかチェックする（2,3,4）
    if(this.cflag < 10){
      let rtn = this.ch.checkKeiryaku(this.cflag-2);
      if(rtn){
        console.log("Can't do KEIRYAKU")
        return;
      }
      this.ch.resetKeiryaku(this.cflag-2)
      this.sts4type = 0; // 敵味方の区別。操作ボタン。
      this.sts4keiryaku = this.cflag-2;
    }else{ // 10,11,12
      let rtn = this.en.checkKeiryaku(this.cflag-10);
      if(rtn){
        console.log("Can't do KEIRYAKU")
        return;
      }
      this.sts4type = 1; // 敵味方の区別。操作ボタン。
      this.sts4keiryaku = this.cflag-10;
    }
    this.sts = 4;
    this.initcnt = 160;
    audioInvokeSE("Thunder10");
    this.sts5tm = -1;// 抜けるときは -1 になる。ので、無効化は-1
    this.sts6tm = -1;// 抜けるときは -1 になる。ので、無効化は-1
  }
  enterEvent(){
    console.log("EVENT!!",this.eventflag)
    this.sts = 6;
    this.stsEtype = this.eventflag; // EVENT
    let sdt = this.krdata;
    this.stsEvtdt = sdt[this.eventflag];
    this.initcnt = sdt[this.eventflag].tm;
    audioInvokeSE("Thunder10");
  }
  enterdraw3A(){
    this.sts5tm = 150; // これで回る
    this.sts5dx = this.sts4dx;
    this.sts5keiryaku = this.sts4keiryaku;//this.sts4type;
    this.sts5type = this.sts4type;//this.sts4type;
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
      this.keiryaku.setCutinParam(this.sts5ch.getkwiryaku(this.sts5keiryaku), this.ch, this.en);
      //this.sts = 4
      return this.draw3(ctx);
    }
    this.ch.commondraw2(ctx,1);
    this.en.commondraw2(ctx,0);
    this.sts5ch.drawCutin(ctx,this.sts5dx,this.initcnt,this.sts5keiryaku);
    // カットイン演出
    this.cin.keiryakucutin(ctx,this.sts5tm,160,this.sts5type)
  }

  draw3B(ctx){
    if(this.sts6tm-- <= 0) {
      this.keiryaku.closeFunc();
      // のこり２０Ｆの指揮官の引っ込む表示するとき
      //this.sts = 4
      return this.draw3(ctx);
    }
    this.keiryaku.cutinEffect(ctx,this.sts6tm);
  }
  //=== EVENT CUTIN (sts=6) =======
  draw5(ctx){
    if (this.initcnt-- <= 0) {
      this.sts = 3;
      let sss = this.stsEvtdt;
      this.nextFlag = sss.next;
      return this.draw2(ctx)
    }
    // 指揮官のカットイン表示
    {
      let sss = this.stsEvtdt;
      let tm = this.initcnt;
      let tp = sss.tp;
      let [t1,n1,t2,n2] = [sss.cutintm,20,sss.endtm,20]
      let aa = 0;
      if(tm-t1 > 0){aa = (tm-t1)/n1;}
      if(t2-tm > 0){aa = (t2-tm)/n2;}
      let dx = (tp==0)?400*aa:-400*aa; // 出たり入ったり
      let team = (tp==0)?this.ch:this.en;
      team.serifCutin(ctx,dx,tm,sss);//4tharg 0:まけ、1:勝ち
      //console.log(sss.next,sss)
      //this.nextFlag = sss.next;
    }
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
    //DBG//console.log("endCutin",dx,tm,ed);
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
    this.btlresult = (this.ch.hp <= 0)? 2:1; // 負け・勝ち
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
    // EVENT処理 (EVENTは予約できる)
    else if(this.sts==3 && this.eventflag!=0){
      this.enterEvent();
      this.eventflag=0; // 入力を空にする
    }
    // NEXT処理：もし、入力もEVENTも無ければ、
    else if(this.sts==3 && this.nextFlag){
      let [tp,val] = this.nextFlag;
      if(tp==0){ // 入力
        this.cflag = val;
      }else{ // EVENT
        this.eventflag=val;
      }
      this.nextFlag = 0;
    }

    // 戦闘中か？ そうなら、ダメージ計算
    if(this.sts == 3){
      //this.sts3tm++;
      for(let i=0;i<2;i++){
        this.sts3tmTM[i]--;
        if(this.sts3tmTM[i]<=0){
          let tar = [this.ch,this.en];
          this.battleCalc(tar[1-i],tar[i]);// DEF,ATK
          this.sts3tmTM[i] = tar[i].getAgi();
          // チャージする
          tar[i].chargeFunc();
        }
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
