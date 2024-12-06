class backgroundClass {
  constructor(parent){
    this.parent = parent;
    this.gsize = [796,604];
    this.img = [];
    if(0){
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
    }
    
    for(let i=0;i<4;i++){
      this.img[i] = new Image();
    }
    this.ihash = {
      "grass":[0,1],
      "ruins":[2,3],
    }
  }
  init(stg=0){
    //console.log("bgc",stg);
    let flist = [ /* 1000x740 */
      "img/battlebacks1/Grassland.png",
      "img/battlebacks2/Grassland.png",
      "img/battlebacks1/Ground1.png",
      "img/battlebacks2/Ruins2.png"
    ]; //--- default １面 ---
    if(stg==2){ // ２面
      flist = [ /* 1000x740 */
        "img/battlebacks1/RockCave.png",
        "img/battlebacks2/DirtCave.png",
        "img/battlebacks1/Road1.png",
        "img/battlebacks2/RockCave.png"
      ];
    }
    if(stg==3){ // ３面
      flist = [ /* 1000x740 */
        "img/battlebacks1/Fort1.png",
        "img/battlebacks2/Fort1.png",
        "img/battlebacks1/DecorativeTile1.png",
        "img/battlebacks2/Castle3.png"
      ];
    }
    for(let i=0;i<4;i++){
      this.img[i].src = flist[i];
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
      let arg = this.calcarg(type,base,aa[0],aa[1]);
      UtilmultiMoveLine(ctx,arg);
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
    // 背景リセット
    let [gCVX, gCVY] = this.gsize;//[796,604];
    ctx.fillStyle = 'rgb(80,80,80)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);
    // 背景
    ctx.save()
    ctx.filter = 'grayscale(100%)'
    let p = [100,740-gCVY,gCVX,gCVY,0,0,gCVX,gCVY];/* 1000x740 */
    ctx.drawImage(this.img[2],p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7]);
    if(!flag){ctx.restore()}
    this.bgdraw(ctx, base, 0, "grass"); // 左
    this.bgdraw(ctx, base, 1, "ruins"); // 右
    if(flag){ctx.restore()}
  }
}


