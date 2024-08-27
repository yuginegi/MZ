let gCVX = 816/2;
let gCVY = 624/2;
let actionFlag = 0; // LOOPの停止用
let gitflag; // LOOPの停止用

//https://qiita.com/stivan622/items/d6e32475174c94648c6a
function getdoubleDigestNumer(number,nn) {
  return ("0" + number).slice(-1*nn)
}

function cnvctx(){
  let cnv = document.getElementById("canv");
  //console.log(cnv);
  let ctx = cnv.getContext("2d"); // Not "2D", "2d" is work.
  //console.log(ctx);
  return [cnv,ctx];
}
function setMsg(ctx,msg){
  ctx.fillStyle = 'rgb(0,255,255)'; //塗りつぶしの色
  ctx.fillRect(0, 0, gCVX, gCVY);
  ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
  ctx.font = "30px MSゴシック";
  ctx.fillText(msg, 150, gCVY-20);
}

function init() {
  console.log("init()");
  let [cnv,ctx] = cnvctx();
  setMsg(ctx,"CLICK START 0");
  cnv.addEventListener("click", startFunc);
}

function startFunc(){
  if(actionFlag!=0){return;}
  actionFlag = 1;
  let [cnv,ctx] = cnvctx();
  // キャラの設置
  let btm = new battleManage(cnv,ctx);
  btm.initload();
  // ループ設置
  let lfps = 60;
  btm.fps = lfps;
  gitflag = setInterval(btm.loopfunc.bind(btm), 1000 / lfps);
}

class battleManage{
  constructor(cnv,ctx){
    this.cnv = cnv;
    this.ctx = ctx;
		let imgsrc1 = "img/pictures/Actor1_5.png";
		this.img1 = new Image();
    this.img1.src = imgsrc1;
		let imgsrc2 = "img/pictures/Actor2_8.png";
		this.img2 = new Image();
    this.img2.src = imgsrc2;
  }
  initload(){
    console.log("initload invoked.");
    this.btnlistinit();
    // init 
    this.tt = 0; // F
    this.sts = 0;
    // For 0
    this.initpart = 0;
    this.initreq = 60;//180;
    // For 1
    this.nanpart = 0;
    this.nanstep = 0;
    // For 2
  }
  btnlistinit(){
    let base = document.getElementById("carea");
    let setbtn = (base,fff,left,top,bnm) => {
      let p = document.createElement("button");
      p.style.position= "absolute";
      p.style.top= top+"px";
      p.style.left= left+"px";
      p.textContent = bnm;
      base.appendChild(p);
      p.addEventListener("click", fff);
      return p;
    }
    this.btn  = setbtn(base,this.cfunc1.bind(this,1), 320,10, "BUTTON1");
    this.btn2 = setbtn(base,this.cfunc1.bind(this,2), 320,40, "BUTTON2");
    this.btn3 = setbtn(base,this.cfunc1.bind(this,3), 220,10, "BUTTON3");
    this.btn4 = setbtn(base,this.cfunc1.bind(this,4), 220,40, "BUTTON4");
    //ボタン無効化はこっちに任せる
    this.btnlistset(true);
  }
  btnlistset(flag){
    this.btn.disabled = flag;
    this.btn2.disabled = flag;
    this.btn3.disabled = flag;
    this.btn4.disabled = flag;
  }
  cfunc1(opt=1){
    console.log("clicked "+opt);
    this.stepControl(opt);
  }
  loopfunc(){
    // MOVE Control
    this.stsControl(this.sts);
    // VIEW
    let ctx = this.ctx;
    this.viewBG(ctx);
    let txt = getdoubleDigestNumer((this.tt++)%this.fps,2)+" F";
    this.viewfps(ctx,txt);
    let sts = "sts="+this.sts;
    this.viewsts(ctx,sts);
    // ほんとうのVIEW
    this.drawControl(ctx);
  }
  //背景
  viewBG(ctx){
    ctx.fillStyle = 'rgb(0,255,255)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);
  }
  //デバッグメッセージ
  viewfps(ctx,txt){
    ctx.fillStyle = 'rgb(128,128,128)'; //塗りつぶしの色
    ctx.font = "15px MSゴシック";
    ctx.fillText(txt, 120, 20);
  }
  //デバッグメッセージ
  viewsts(ctx,txt){
    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.font = "30px MSゴシック";
    ctx.fillText(txt, 20, 30);
  }
  //デバッグメッセージ
  viewsimple(ctx,txt){
    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.font = "30px MSゴシック";
    ctx.fillText(txt, 20, gCVY/2-50);
  }
  stsControl(ii){
    let flist = [this.stsControl0,this.stsControl1,this.stsControl2,this.stsControl3,this.stsControl4];
    if(flist[ii]){
      let func = flist[ii].bind(this);
      func();
    }
  }
  drawControl(ctx){
    let ii = this.sts
    let tlist = ["初期化","名乗りあい","戦闘中","勝負あり","カットイン"];
    let txt = (tlist[ii])?tlist[ii]:"STS="+ii;
    this.viewsimple(ctx,txt);
    // DRAW
    let flist = [this.draw0,this.draw1,this.draw2,null,this.draw4];
    if(flist[ii]){
      let func = flist[ii].bind(this);
      func(ctx);
    }
  }
  stepControl(opt=1){
    // 0->1
    if(this.sts==0){
      this.sts=1;
      this.nanpart = 0;
      this.nanstep = 0;
      this.btnlistset(true);
      return;
    }
    // 1->2
    if(this.sts==1){
      this.sts=2;
      this.btlpart = 0;
      this.hp = 100;
      this.readysts = 0;
      this.readyreq = 30;
      this.btnlistset(true);
      return;
    }
    // 2->3
    if(this.sts==2){
      this.sts=4;
      this.btnlistset(true);
      this.cinpart = 0;
      this.cinstep = 0;
      this.readysts = 0;
      this.readyreq = 30;
      // Opt
      console.log("opt:",opt,this.mode)
      if(opt==2){
        this.mode = 2;
        this.cinreq = [60,90,120,180,240];
      }else if(opt==3){
        this.mode = 3;
        this.cinreq = [60,90,120,180,220,240];
      }else if(opt==4){
        this.mode = 4;
        this.cinreq = [60,90,120,180,220,240];
      }else{
        // opt==1
        this.mode = 1;
        this.cinreq = [60,90,120,180,240];
      }
      return;
    }
    if(this.sts==3){
      // init 
      this.tt = 0; // F
      this.sts = 0;
      // For 0
      this.initpart = 0;
      this.initreq = 60;//180;
    }
  }
  //--------------------------------------------------------------
  stsControl0(){
    if(this.initpart >= this.initreq){
      this.btn.disabled  = false;
    }
    this.initpart++;
  }
  stsControl1(){
    if(this.nanpart >= 120){
      this.btn.disabled = false;
    }
    if(this.nanpart == 40){
      this.nanstep = 1;
    }
    if(this.nanpart == 80){
      this.nanstep = 2;
    }
    this.nanpart++;
  }
  stsControl2(){
    this.btlpart++;
    if(this.readysts < this.readyreq){
      this.readysts++;
      // 必殺技が打てる状況にする
      if(this.readysts==this.readyreq){
        this.btnlistset(false);
      }
    }
    this.hp -= 0.2;
    if(this.hp <= 0){
      this.sts = 3;
      this.rstpart = 0;
      this.btnlistset(true);
    }
  }
  stsControl3(){
    if(this.rstpart >= 120){
      this.btn.disabled = false;
    }
    this.rstpart++;
  }
  stsControl4(){
    this.cinpart++;
    // step control
    let nn = this.cinreq.length;
    if(this.cinpart >= this.cinreq[nn-1]){
      this.sts = 2;
    }
    for(let i=0;i<nn;i++){
      if(this.cinpart == this.cinreq[i]){
        this.cinstep = i+1;
      }
    }
  }
  draw0(ctx){
    let yy=0;
    let mm = 20;
    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.fillRect(mm, yy+(gCVY-mm)/2, gCVX-2*mm, mm);
    ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
    let ww = (gCVX-2*mm)*(this.initpart/this.initreq);
    ww = (ww > (gCVX-2*mm))?(gCVX-2*mm):ww;
    ctx.fillRect(mm, yy+(gCVY-mm)/2, ww, mm);
  }
  draw1chara(ctx,mode,x1,y1){
    let img = (mode==1)?this.img1:this.img2;
    let [x0,y0,w0,h0] = [0,0,330,350];
    let aa = 0.5;
    let [w1,h1] = [aa*w0,aa*h0];
    ctx.drawImage(img,x0,y0,w0,h0,x1,y1,w1,h1);
  }
  draw1(ctx){
    if(this.nanstep>=1){
      let txt="攻撃側セリフ";
      ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
      ctx.font = "30px MSゴシック";
      ctx.fillText(txt, gCVX/2+10, gCVY-10);
      this.draw1chara(ctx,1,gCVX/2+30, gCVY-220)
    }
    if(this.nanstep>=2){
      let txt="守備側セリフ";
      ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
      ctx.font = "30px MSゴシック";
      ctx.fillText(txt, 20, gCVY-170);
      this.draw1chara(ctx,2,20, gCVY-170)
    }
  }
  draw2(ctx){
    this.drawChara(ctx);
    // HP
    let txt = "HP:"+Math.ceil(this.hp);
    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.font = "30px MSゴシック";
    ctx.fillText(txt, 300, gCVY-20);
    {
      let mm = 20;
      let ww = 300-2*mm; // 300-20*2
      let yy = gCVY-20-mm;
      ctx.fillStyle = 'rgb(255,0,0)'; //塗りつぶしの色
      ctx.fillRect(mm, yy, ww, mm);
      ctx.fillStyle = 'rgb(255,255,0)'; //塗りつぶしの色
      let www = ww*(this.hp/100);
      www = (www > ww)?ww:www;
      ctx.fillRect(mm+ww-www, yy, www, mm);
    }
  }
  draw4(ctx){
    this.draw2(ctx);
    if(this.mode==2){
      this.draw4_2(ctx);
    }else if(this.mode==3){
      this.draw4_3(ctx);
    }else if(this.mode==4){
      this.draw4_4(ctx);
    }else{
      this.draw4_1(ctx);
    }
  }

  //------------CUTIN------------------------

  // 味方
  draw4_1(ctx){
    if(this.cinstep < 3){
      let xx = gCVX/2;
      let yy = 200;
      if(this.cinstep == 0){
        xx = xx + (this.cinreq[0]-this.cinpart)*5;
      }
      // キャラ
      ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
      ctx.fillRect(xx,yy,32,32);

      if(this.cinstep == 2){
        let txt = "いけー！";
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.font = "30px MSゴシック";
        ctx.fillText(txt, 140, gCVY/2+20);
      }
    }else{
      let xx = gCVX/2+100;
      if(this.cinstep == 3){
        xx = xx + (this.cinreq[3]-this.cinpart)*2;
      }
      // キャラ
      ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
      for(let i=0;i<3;i++){
        let yy = 120+50*i;
        ctx.fillRect(xx,yy,32,32);
      }
      if(this.cinstep == 4){
        let txt = "わー！";
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.font = "30px MSゴシック";
        ctx.fillText(txt, 200, 150);
        ctx.fillText(txt, 180, 230);
      }      
    }
  }
  // 味方・回復
  draw4_3(ctx){
    if(this.cinstep < 3){
      let xx = gCVX/2;
      let yy = 200;
      if(this.cinstep == 0){
        xx = xx + (this.cinreq[0]-this.cinpart)*5;
      }
      // キャラ
      ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
      ctx.fillRect(xx,yy,32,32);

      if(this.cinstep == 2){
        let txt = "がんばれー！";
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.font = "30px MSゴシック";
        ctx.fillText(txt, 140, gCVY/2+20);
      }
    }else{
      let xx = gCVX/2+100;
      if(this.cinstep == 3){
        xx = xx + (this.cinreq[3]-this.cinpart)*2;
      }
      // キャラ
      ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
      for(let i=0;i<3;i++){
        let yy = 120+50*i;
        ctx.fillRect(xx,yy,32,32);
      }
      if(this.cinstep == 4){
        let txt = "わー！";
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.font = "30px MSゴシック";
        ctx.fillText(txt, 200, 150);
        ctx.fillText(txt, 180, 230);
        this.hp += (30/(this.cinreq[4]-this.cinreq[3]));
        if(this.hp > 100){this.hp = 100;}
      }   
      if(this.cinstep >= 4){
        ctx.fillStyle = 'rgba(255,255,0,0.5)'; //塗りつぶしの色
        let pp = 30;
        let [xx,y0,ww,h0] = [gCVX/2+100-pp,gCVY/3+10,32+2*pp,gCVY/2-10];
        let [mm,nn] = [1,(this.cinreq[5]-this.cinreq[3])];
        let tt = Math.floor(this.cinpart/mm)%nn;
        let hh = h0*(tt/(nn-1));
        let yy = y0+h0-hh;
        ctx.fillRect(xx,yy,ww,hh);
      }   
    }
  }

  // 敵
  draw4_2(ctx){
    if(this.cinstep < 3){
      let xx = gCVX/2-50;
      let yy = 200;
      if(this.cinstep == 0){
        xx = xx - (this.cinreq[0]-this.cinpart)*5;
      }
      // キャラ
      ctx.fillStyle = 'rgb(255,0,0)'; //塗りつぶしの色
      ctx.fillRect(xx,yy,32,32);

      if(this.cinstep == 2){
        let txt = "守り抜けー！";
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.font = "30px MSゴシック";
        ctx.fillText(txt, 140, gCVY/2+20);
      }
    }else{
      let xx = gCVX/2-100;
      if(this.cinstep == 3){
        xx = xx - (this.cinreq[3]-this.cinpart)*2;
      }
      // キャラ
      ctx.fillStyle = 'rgb(255,0,0)'; //塗りつぶしの色
      for(let i=0;i<3;i++){
        let yy = 120+50*i;
        ctx.fillRect(xx,yy,32,32);
      }
      if(this.cinstep == 4){
        let txt = "おー！";
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.font = "30px MSゴシック";
        ctx.fillText(txt, 200, 150);
        ctx.fillText(txt, 180, 230);
      }      
    }
  }

  // 敵・攻撃
  draw4_4(ctx){
    if(this.cinstep < 3){
      let xx = gCVX/2-80;
      let yy = 200;
      if(this.cinstep == 0){
        xx = xx - (this.cinreq[0]-this.cinpart)*5;
      }
      // キャラ
      ctx.fillStyle = 'rgb(255,0,0)'; //塗りつぶしの色
      ctx.fillRect(xx,yy,32,32);
      for(let i=0;i<3;i++){
        let yy = 120+50*i;
        ctx.fillRect(xx-80,yy,32,32);
      }

      if(this.cinstep == 2){
        let txt = "くらえ！業火の炎！";
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.font = "30px MSゴシック";
        ctx.fillText(txt, 120, gCVY/2+20);
      }
    }else{
      let xx = gCVX/2+100;
      if(this.cinstep >= 4){
        xx = xx - (this.cinreq[3]-this.cinpart)*5;
      }
      // キャラ
      ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
      for(let i=0;i<3;i++){
        let yy = 120+50*i;
        ctx.fillRect(xx,yy,32,32);
      }
      if(this.cinstep == 4){
        let txt = "ぎゃー！";
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.font = "30px MSゴシック";
        ctx.fillText(txt, 200, 150);
        ctx.fillText(txt, 180, 230);
        this.hp -= (20/(this.cinreq[4]-this.cinreq[3]));
      }
      if(this.cinstep >= 4){
        ctx.fillStyle = 'rgba(255,0,0,0.5)'; //塗りつぶしの色
        let [xx,y0,ww,h0] = [gCVX/2,gCVY/3+10,gCVX/2-20,gCVY/2-10];
        let [mm,nn] = [3,5];
        let tt = Math.floor(this.cinpart/mm)%nn;
        let hh = h0*(tt/(nn-1));
        let yy = y0+h0-hh;
        ctx.fillRect(xx,yy,ww,hh);
      }
    }
  }

  drawChara(ctx){
    let txt="戦闘処理中";
    let n = Math.floor((this.btlpart%180)/45);
    for(let i=0;i<n;i++){
      txt += ".";
    }
    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.font = "30px MSゴシック";
    ctx.fillText(txt, 200, gCVY/2-50);
  }
}

window.onload = init;
