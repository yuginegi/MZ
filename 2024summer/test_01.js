let gCVX = 816;
let gCVY = 624;
function init(){
  console.log("init()");
  let cnv = document.getElementById("canv");
  console.log(cnv);
  let ctx = cnv.getContext("2d"); // Not "2D", "2d" is work.
  console.log(ctx);

//
  //dataload();
  for(let i=0;i<4;i++){
    let e = new characlass(0);
    e.pos[0] = gCVX-250;
    e.pos[1] = 40+150*i;
    let wt = i*4;
    wt = Math.floor(20*Math.random());
    e.setSts(wt);
    chara.push(e);
  }
  for(let i=0;i<3;i++){
    let e = new characlass(0);
    e.pos[0] = gCVX-120;
    e.pos[1] = 80+150*i;
    let wt = i*4+12;
    wt = Math.floor(20*Math.random());
    e.setSts(wt);
    chara.push(e);
  }
  for(let i=0;i<3;i++){
    let e = new characlass(1);
    e.pos[1] = 100+150*i;
    e.gt = i*4;
    e.setSts(i*4);
    e.hp = 200+i*50;
    chara.push(e);
  }
  // Special
//
  setInterval(mainloop,1000/60,ctx);
}

class characlass{
  constructor(type){
    let imgsrc = ["img/sv_actors/Actor1_1.png","img/sv_actors/Actor1_2.png"];
    let img = new Image();
    img.src = imgsrc[type];
    this.img = img;
    this.gt = 0;
    this.pos = [gCVX-200,100];
    this.mvpos = [0,0];
    this.psz = [64*2,64*2];
    this.dr = type;
    this.sts = null;
    this.hp = 200;
  }
  setSts(tt){
    this.waittime = tt;
    this.sts = [0,0];
  }
  // 状態
  stsdraw(ctx){
    let [s,t] = this.sts;
    let p = {
      0:{a:0,b:0},
      1:{a:1,b:0},
      2:{a:2,b:0},
      10:{a:2,b:2},
      11:{a:2,b:5}
    }
    this.drawChara(ctx,t,p[s].a,p[s].b);
    if(this.dr){
      this.nextsts2(s,t);
    }else{
      this.nextsts(s,t);
    }
  }
  nextsts2(s,t){
    // ひん死時のアニメーション
    if(this.hp <= 0){
      if(s<10){
        s=10;
        t=0;
      }else if(t > 30){
        s=11;
        t=0;
      }
    }else{
      s = 1;
    }
    this.sts = [s,t+1];
  }
  nextsts(s,t){
  // 攻撃の時のアニメーション
    t = t+1;
    let schg = {
      0:{nxt:1,ttt:10},
      1:{nxt:2,ttt:40},
      2:{nxt:0,ttt:20},
    }

    if(t > schg[s].ttt){
      s = schg[s].nxt;
      t = 0;
    }else{
      // 前進
      if(s==0){
        this.mvpos[0] -=6;
      }
      // 後退
      if(s==2){
        this.mvpos[0] +=3;
        this.mvpos[1]= (100/100)*(t-0)*(t-20);
      }
    }
    this.sts = [s,t]
  }

  //--- utility ---
  draw(ctx){
    if(this.waittime > 0){
      this.waittime--;
      return;
    }
    if(this.dr){
      this.hp -=1;
    }
    if(this.sts){
      this.stsdraw(ctx);
    }else{
      this.drawChara(ctx,this.gt++,1,0);
    }
  }
  drawChara(ctx,tt,ix,iy){
    if(this.dr){
      ctx.save();		// canvas状態を保存
      ctx.scale(-1, 1); // 左右反転にする（１）
      ctx.translate(-gCVX,0); // 左右反転にする（２）
      this.drawmain(ctx,tt,ix,iy);
      ctx.restore();
    }else{ 
      this.drawmain(ctx,tt,ix,iy);
    }
  }
  drawmain(ctx,tt,ix,iy){
    const cid = (tt,cycle) => {
      let id = Math.floor((tt)/cycle)%4;
      return (id==3) ? 1 : id;
    }
    let [x,y] = this.pos;
    let [mx,my] = this.mvpos;
    let [w,h] = this.psz;
    let [dix,diy] = [64*3*ix,64*iy]
    ctx.drawImage(this.img,dix+64*cid(tt,5),diy,64,64,x+mx,y+my,w,h);
  }
}

let chara=[];
function mainloop(ctx){
  // 初期化
  ctx.fillStyle = 'rgb(0,255,255)'; //塗りつぶしの色
  ctx.fillRect(0,0,gCVX,gCVY);

  // 絵を描く
  for(let cc of chara){
    cc.draw(ctx);
  }
  //chara[0].draw(ctx);
  //chara[1].draw(ctx);
}


window.onload = init;