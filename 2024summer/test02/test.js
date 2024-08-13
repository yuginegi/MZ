let gCVX = 816;
let gCVY = 624;
function init() {
  console.log("init()");
  let cnv = document.getElementById("canv");
  console.log(cnv);
  let ctx = cnv.getContext("2d"); // Not "2D", "2d" is work.
  console.log(ctx);

  // キャラの設置
  let btm = new battleMain(ctx);
  btm.initload();
  // ループ設置
  setInterval(btm.loopfunc.bind(btm), 1000 / 60);
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
  }
  // キャラクターの読み込み
  initload(){
    // Team
    this.ch = new teamClass(0);
    this.ch.initLoad(7);
    this.en = new teamClass(1);
    this.en.initLoad(3);
  }

  loopfunc() {

    // 戦闘処理
    if(this.ch.hp > 0 && this.en.hp > 0){
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
      }
      if(this.ch.hp <= 0){
        this.en.setWin();
      }
    }
  
    let ctx = this.ctx;
    // 背景リセット
    ctx.fillStyle = 'rgb(0,255,255)'; //塗りつぶしの色
    ctx.fillRect(0, 0, gCVX, gCVY);
    // 絵を描く
    let chara = this.ch.chara.concat(this.en.chara);
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
  }
}

window.onload = init;