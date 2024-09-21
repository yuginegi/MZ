// Team
class teamClass {
  constructor(parent) {
    this.parent = parent;
    this.chara = [];
    this.gsize = parent.gsize;
    this.initcnt = 0;
    this.teamID = 0;
    //数字の読み込み(1個だけにしたいけど)
    this.digis = []
    for(let i=0;i<10;i++){
      let e = new Image();
      e.src = "img/add/num/digi"+i+".png";
      this.digis[i] = e;
    }
    this.dcnt = 0;
    this.dam = -1;
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
      this.twep = 1;
      this.hp = 526;
    }else if(n==3){
      //let imgsrc = "img/sv_add/duran.png";
      let imgsrc = "img/pictures/aa_duran.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "相手をしてやろう";
      this.ctxt = "地獄の業火をくらえ！";
      this.simg = new Image();
      this.simg.src = "img/faces/aa_duran.png";
      this.spar = [this.simg,0,0,144,144];
      this.twep = 13;
      this.hp = 987;
    }else{
      let imgsrc = "img/pictures/Actor2_8.png";
      this.img = new Image();
      this.img.src = imgsrc;
      this.itxt = "守ってみせまする";
      this.ctxt = "守ってみせまする";
      this.simg = new Image();
      this.simg.src = "img/faces/Actor2.png";
      this.spar = [this.simg,144*3,144,144,144];
      this.twep = 22;
      this.hp = 430;
    }
    this.teamID = n;
    
    {
      let [x0,x1] = [796-200,796-100]

      for(let i=0;i<3;i++){
        this.addchara(type, x0,150+80*i);
      }
      for(let i=0;i<4;i++){
        this.addchara(type, x1,100+80*i);
      }
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
  // 計略のカットイン
  drawCutin(ctx,base,tm){
    let [gCVX, gCVY] = this.gsize;
    let [x,y] = this.pxy;
    x = (gCVX-330)/2;//330:PNG.width
    let dx = gCVX*(base/100)
    // セリフ
    if(20 < tm && tm < 80){
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
    // キャラの背景（薄い赤・薄い青）
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
  // 数字を出す
  digidraw(ctx,type,hp){
    if(hp < 0){
      return;
    }
    let ypos = this.gsize[1]-159;//10
    let strHP = hp.toString();
    //parseInt. digi.H=112.
    let aa = 1/3;
    let xx = [0];
    let n = strHP.length;
    for(let i=0;i<n;i++){
      let v = parseInt(strHP[i]);
      let img = this.digis[v];
      xx[i+1] = xx[i]+aa*(img.width);
    }
    for(let i=0;i<n;i++){
      let v = parseInt(strHP[i]);
      let img = this.digis[v];
      let [w,h] = [img.width,img.height]
      let x = (type==0)? 450+xx[i]:350-xx[n]+xx[i];
      ctx.drawImage(img,0,0,w,h,x,ypos+10,aa*w,aa*h);
    }
    // 
    let x0 =  (type==0)? 450+xx[n]:350;
    this.digidraw2(ctx,x0,this.dcnt);
  }
  digidraw2(ctx,wpos,cnt){
    if(cnt > 30){
      return;
    }
    if(this.dam < 0){
      return;
    }
    let hp = this.dam;
    let y0 = this.gsize[1]-159 -20;
    let ypos = (cnt < 10)? y0 -2*cnt: y0 -20;
    let strHP = hp.toString();
    //parseInt. digi.H=112.
    let aa = 1/3;
    let xx = [0];
    let n = strHP.length;
    for(let i=0;i<n;i++){
      let v = parseInt(strHP[i]);
      let img = this.digis[v];
      xx[i+1] = xx[i]+aa*(img.width);
    }
    for(let i=0;i<n;i++){
      let v = parseInt(strHP[i]);
      let img = this.digis[v];
      let [w,h] = [img.width,img.height]
      let x = wpos-xx[n]+xx[i];
      ctx.drawImage(img,0,0,w,h,x,ypos+10,aa*w,aa*h);
    }
  }
  // 下のキャラ描画
  commondraw2(ctx){
    let type = this.type; 
    let [gCVX, gCVY] = this.gsize; // [796,604]
    let ypos = gCVY-159;//10
    // バー描画
    this.bardraw2(ctx,type);
    // 上から数字もらえれば出します。にする。
    {
      this.dcnt++;
      if(this.dcnt>=180){
        this.dcnt = 0;
        this.dam = 20;
        this.hp -= this.dam; 
      }
      this.digidraw(ctx,type,this.hp);
    }

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
  pupset(inp){
    this.pupsts = inp;
    this.pchara = [];
    if(inp == 0){
      this.pchara = [];
    }else{
      for(let i=0;i<7;i++){
        let x = 796/2+80*(i-3); //796
        let y = (i%2==0)?150:250;
        let e = new characlass(this.type);
        e.pos = [x,y]
        if(inp == 1){e.pupflag = true;}
        if(inp == 2){e.damflag = true;}
        this.pchara.push(e);
      }
    }
  }
  pupdraw(ctx){
    for (let cc of this.pchara) {
      cc.move();
      cc.draw(ctx);
    }
  }

  // 一般的な動かしてDRAW
  charadraw(ctx){
    for (let cc of this.chara) {
      cc.move();
      cc.draw(ctx);
    }
  }

  setwaittime(e, n) {
    let wt = Math.floor(n * Math.random());
    e.waittime = wt;
  }
  addchara(type, x, y) {
    let e = new characlass(type);
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
