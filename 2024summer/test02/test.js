let gCVX = 816;
let gCVY = 624;
let actionFlag = 0; // LOOPの停止用
let gitflag; // LOOPの停止用

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
  ctx.font = "40px MSゴシック";
  ctx.fillText(msg, gCVX/2, gCVY/2);
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
  let btm = new battleMain(ctx);
  btm.initload();
  // ループ設置
  gitflag = setInterval(btm.loopfunc.bind(btm), 1000 / 60);
}

function endFunc(){
  clearInterval(gitflag);
  let [cnv,ctx] = cnvctx();
  setMsg(ctx,"CLICK START");
  actionFlag = 0;
}

// Team
class teamClass{
  constructor(type){
    this.chara = [];
    this.type = type;
  }
  initLoad(n){
    let [cn,en] = [7,7];
    if(this.type == 0){//みかた
      for (let i = 0; i < cn; i++) {
        // 隊列が２列だから
        let [x,y] = (i < 4)? [ gCVX - 300, 40 + 150 * i]:[gCVX - 120, 80 + 150 * (i-4)];
        // キャラセット
        let e = this.addchara(0, x,y);
        // 絵の差し替え
        let imglist = ["Actor3_7","EN1","Actor2_1","Actor2_4",
        "Actor1_5","Actor1_1","Actor1_2"]
        if(i<imglist.length){
          e.setimage("img/sv_actors/"+imglist[i]+".png");
        }
        // 武器の指定
        e.atkwep = (i==0)?20:(i>=4)?7+i:i;
      }
      this.hp = cn*100;
    }else{//てき
      for (let i = 0; i < en; i++) {
        let [x,y] = (i < 4)? [gCVX - 330, 40 + 150 * i] : [gCVX - 150, 80 + 150 * (i-4)];
        // キャラセット
        let e = this.addchara(1, x,y);
        // 武器の指定
        e.atkwep = (i<4)?10+(3-i):20+(i-4);
      }
      this.hp = en*100+50;
    }
    this.atk = 1;
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
  attack(dmg){
    this.hp -= dmg;
  }
  alive(){
    let hp = 0
    for(let cc of this.chara){
      if(cc.deadflag && this.hp > hp){
        cc.deadflag = false;
        cc.sts=[0,0]
      }
      hp += 100;
    }
  }
  check(){
    let hp = 0
    for(let cc of this.chara){
      if(this.hp <= hp){
        cc.deadflag = true;
      }
      hp += 100;
    }
  }
  // 勝ちフラグ
  setWin(){
    for(let cc of this.chara){
      cc.winflag = true;
    }
  }
}

// バトル
class battleMain {
  constructor(ctx) {
    this.chara = [];
    this.ctx = ctx;
    this.flag = 1;
    this.cutin = false;
		let imgsrc = "img/pictures/Actor1_5.png";
		this.img = new Image();
    this.img.src = imgsrc;
		let imgsrc2 = "img/pictures/Actor2_8.png";
		this.img2 = new Image();
    this.img2.src = imgsrc2;
  }
  // キャラクターの読み込み
  initload(){
    // Team
    this.ch = new teamClass(0);
    this.ch.initLoad(7);
    this.en = new teamClass(1);
    this.en.initLoad(3);
    this.initflag = 1;
    this.initcnt = 180;
  }

  loopfunc() {
    if(this.endcnt > 0){
      this.endcnt--;
      if(this.endcnt <= 0){
        endFunc();
        return;
      }
    }

    let ctx = this.ctx;
    // 背景リセット
    ctx.fillStyle = 'rgb(0,255,255)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);

    // 立ち合い処理
    if(this.initflag == 1){
      if(this.initcnt-- <= 0){
        this.initflag = 0;
      }
      //立ち絵
      {
        let x = 20;
        let y = 100;
        {
          ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
          ctx.fillRect(30, gCVY*(0/3)+20, gCVX-350, gCVY*(1/3)-80);
          ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
          ctx.font = "40px MSゴシック";
          ctx.fillText("守ってみせまする", 60, 100);
        }
        ctx.drawImage(this.img2,x,y);
      }
      {
        let x = gCVX - 350;
        let y = 100;
        ctx.drawImage(this.img,x,y);
        {
          ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
          ctx.fillRect(300, gCVY*(2/3)+50, gCVX-350, gCVY*(1/3)-80);
          ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
          ctx.font = "40px MSゴシック";
          ctx.fillText("いけ！", 350, gCVX*(2/3));
        }
      }
      return;
    }

    // 戦闘処理
    if(this.ch.hp > 0 && this.en.hp > 0){
      if(this.cutin == 0){
        // （味方→敵）攻撃判定
        this.en.attack(this.ch.atk);
        // （敵→味方）攻撃判定
        this.ch.attack(this.en.atk);
        // 生存チェック
        this.ch.check();
        this.en.check();
        // 勝利チェック
        if(this.en.hp <= 0){
          this.ch.setWin();
          this.endcnt = 300;
        }
        if(this.ch.hp <= 0){
          this.en.setWin();
          this.endcnt = 300;
        }
      }
      // カットイン処理
      if(this.flag == 1 && this.ch.hp <= 250){
        this.flag = 2;
        this.cutin = 60; // カットインする
      }
      if(this.flag == 2 && this.cutin <= 1){
        this.flag = 3;
        this.cutin = 90;
      }
      if(this.flag == 3 && this.cutin <= 1){
        this.ch.hp = 580;
        this.ch.alive();
        this.ch.check();
        this.flag = 0;
        this.cutin = 90;
      }
    }
  
    // 絵を描く
    let chara = this.ch.chara.concat(this.en.chara);
    if(this.cutin <= 0){
      for (let cc of chara) {
        cc.move();
      }
    }
    // 絵を描く
    for (let cc of chara) {
      cc.draw(ctx);
    }
    // ENEMY の HP を表示
    ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
    ctx.font = "40px MSゴシック";
    let hp = Math.ceil(this.en.hp);
    ctx.fillText("ENEMY:"+hp,10,600);
    let chhp = Math.ceil(this.ch.hp);
    ctx.fillText("PLAYER:"+chhp,560,600);

    // カットイン
    if(this.cutin > 0){
      this.cutin--;
      if(this.flag==0){
        for (let cc of chara) {
          cc.effe(ctx,0,this.cutin);
        }
      }else{
      ctx.fillStyle = 'rgb(0,255,0)'; //塗りつぶしの色
      ctx.fillRect(0, gCVY*(1/3), gCVX, gCVY*(1/3));
      //立ち絵
      let dx = (this.flag==2)?20*this.cutin:0;
      let x = gCVX - 430 + dx;
      let y = 100;
      ctx.drawImage(this.img,x,y);
      {
        ctx.fillStyle = 'rgb(0,0,255)'; //塗りつぶしの色
        ctx.fillRect(100, gCVY*(0/3)+20, gCVX-200, gCVY*(1/3)-120);
        ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
        ctx.fillText("勇者の大号令", 160, gCVY*(1/3)-120);
      }
      if(this.flag==3){
        ctx.fillStyle = 'rgb(0,0,0)'; //塗りつぶしの色
        ctx.fillRect(100, gCVY*(2/3)+20, gCVX-200, gCVY*(1/3)-40);
        ctx.fillStyle = 'rgb(255,255,255)'; //塗りつぶしの色
        ctx.fillText("「皆の者！力を見せろ！！", 120, gCVX*(2/3)-50);
        ctx.fillStyle = 'rgb(0,255,255)'; //塗りつぶしの色
        ctx.fillText("部隊を回復する", 180, gCVX*(2/3)+20);
      }
      }
    }

  }
}

window.onload = init;