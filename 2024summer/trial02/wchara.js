class characlass {
  constructor(type,soltype) {
    //DBG//console.log("new characlass")
    let [gCVX] = [796];
    //let imgsrc = ["img/sv_actors/Actor1_1.png", "img/sv_actors/Actor1_2.png"];
    let imgsrc = ["img/sv_add/EN1_1.png", "img/sv_add/EN1_2.png","","img/sv_add/Ehakone.png"];
    let img = new Image();
    //DBG//console.log("characlass",soltype);
    img.src = (soltype)? imgsrc[soltype] : imgsrc[type];
    this.img = img;
    let wepsrc = "img/system/Weapons1.png";
    let wep = new Image();
    wep.src = wepsrc;
    this.wep = wep;
    // 位置情報
    this.pos = [gCVX - 200, 100];
    this.mvpos = [0, 0];
    this.psz = [64, 64];
    // 向き：左か右か
    this.dr = type;
    // ステータス
    this.sts = [0, 0];
    this.state = "";
    // 攻撃方法
    this.atkwep = 0;
    this.wepdef = {
      0: [0, 0, 1, 1], 1: [0, 1, 1, 1], 2: [0, 2, 1, 1],
      3: [0, 3, 1, 1], 4: [0, 4, 1, 1], 5: [0, 5, 1, 1],
      // 10:銃、爪、拳、槍
      10: [1, 2, 1, 0], 11: [1, 3, 1, 0], 12: [1, 4, 1, 0], 13: [1, 5, 1, 0],
      // 20:弓、ボウガン、銃
      20: [1, 0, 1, 2], 21: [1, 1, 1, 2], 22: [1, 2, 1, 2],
    }
    // データ定義
    this.stsdef = {
      // 攻撃
      0: { a: 0, b: 0 }, 1: { a: -1, b: -1 }, 2: { a: 2, b: 0 },
      // やられ
      10: { a: 2, b: 2 }, 11: { a: 2, b: 5 },
      // 勝ち
      30: { a: 0, b: 0 }, 31: { a: 2, b: 1 },
      // PUP
      40: { a: 0, b: 0 }, 41: { a: 2, b: 1 },
      // MOVE
      50: { a: 2, b: 0 }, 51: { a: 0, b: 0 }
    };
  }
  setimage(imgsrc) {
    this.img.src = imgsrc;
  }

  // 動き方のコントロール
  nextsts(s, t) {
    let nxt = {
      "dead":this.nextsts2,
      "win":this.nextsts3,
      "pup":this.nextsts4,
      "dam":this.nextsts5,
      "move1":this.nextsts6a,
      "move2":this.nextsts6b,
    }
    
    if(nxt[this.state]){
      let func = nxt[this.state].bind(this);
      func(s, t);
    } else {
      // ココが通常の動き
      if (this.dr) {
        this.sts = [1, t + 1];
      } else {
        this.nextsts1(s, t)
      }
    }
  }
  // 攻撃の時のアニメーション
  nextsts1(s, t) {
    t = t + 1;
    let schg = {
      0: { nxt: 1, ttt: 10 },
      1: { nxt: 2, ttt: 40 },
      2: { nxt: 0, ttt: 20 },
    }

    if (t > schg[s].ttt) {
      s = schg[s].nxt;
      t = 0;
    } else if (this.atkwep < 15) {
      // 前進
      if (s == 0) {
        this.mvpos[0] -= 6;
      }
      // 後退
      if (s == 2) {
        this.mvpos[0] += 3;
        this.mvpos[1] = (100 / 100) * (t - 0) * (t - 20);
      }
    }
    this.sts = [s, t]
  }
  // 入場
  nextsts6a(s, t) {
    let [a, b, t1, t2] = [12, 0, 20, 60]
    if (s < 51) { // t=0 にセット
      s = 51;
      t = 0;
      this.mvpos[0] = a * (t2 - t1);
      this.mvpos[1] = b * (t2 - t1);
    } else if (s == 51 && t >= t1 && t < t2) {
      this.mvpos[0] -= a;
      this.mvpos[1] -= b;
    }
    this.sts = [s, t + 1];
  }
  // 入場
  nextsts6b(s, t) {
    if (s < 50) { // t=0 にセット
      s = 50;
      t = 0;
      this.mvpos[0] = 20 * 30;
      this.mvpos[1] = -5 * 30;
    } else if (s == 50 && t > 30) {
      s = s + 1;
      t = 0;
    } else if (s == 50) {
      this.mvpos[0] -= 20;
      this.mvpos[1] += 5;
    }
    this.sts = [s, t + 1];
  }
  // 被ダメ時のアニメーション
  nextsts5(s, t) {
    if (s < 10) { // t=0 にセット
      s = 10;
      t = 0;
    } else if (s == 10 && t > 90) {
      s = s + 1;
      t = 0;
    }
    this.sts = [s, t + 1];
  }
  // Power Up ポーズ
  nextsts4(s, t) {
    // 最初は突っ立ってるだけ
    if (s < 40) {
      s = 40;
      t = 0;
    }
    // 喜びのポーズ
    if (s == 40 && t > 90) {
      s = 41;
    }
    this.sts = [s, t + 1];
  }
  // 勝利ポーズ
  nextsts3(s, t) {
    const calc = (x, mv) => {
      if (-mv <= x && x <= mv) {
        return 0;
      } else {
        return (x > 0) ? x - mv : x + mv;
      }
    }
    if (s < 30) {
      this.sts = [30, 0]
    } else if (s == 30) {
      let mv = 5;
      let [x, y] = this.mvpos;
      x = calc(x, mv);
      y = calc(y, mv);
      this.mvpos = [x, y];
      if (t > 30 && x == 0 && y == 0) {
        this.sts = [31, 0];
      } else {
        this.sts[1] = this.sts[1] + 1
      }
    } else {
      this.sts[1] = this.sts[1] + 1
    }
  }
  // ひん死時のアニメーション
  nextsts2(s, t) {
    if (s < 10) {
      s = 10;
      t = 0;
      this.mvpos[1] = 0
    } else if (s < 15 && t > 30) {
      s = s + 1;
      t = 0;
    }
    this.sts = [s, t + 1];
  }
  effe4(ctx,t){
    let [x, y] = this.pos;
    ctx.fillStyle = "rgba(255,255,0,0.5)"
    let h = 64 * (t / 90)
    if (this.dr) {
      x = 796 - x - 64;
    }
    ctx.fillRect(x, y + 64 - h, 64, h);
  }
  //--- draw function ---
  movedraw(ctx) {
    // move
    this.move();
    // draw
    this.stsdraw(ctx);
  }
  move() {
    if (this.waittime > 0) {
      this.waittime--;
      return;
    }
    // Next
    let [s, t] = this.sts;
    this.nextsts(s, t);
  }
  // 状態・動き方のコントロール
  stsdraw(ctx) {
    let [s, t] = this.sts;
    // 登場時の待機時間は出現しない
    if ((this.state=="move1"||this.state=="move2") && s < 50){
      return;
    }
    let p = this.stsdef;
    if (p[s]) {
      this.drawChara(ctx, t, p[s].a, p[s].b);
      if (s == 40) {this.effe4(ctx,t);} // PUP演出
    }
  }
  // 左か右かを判定して描画
  drawChara(ctx, tt, ix, iy) {
    if (this.dr) {
      let [gCVX] = [796];
      ctx.save();		// canvas状態を保存
      ctx.scale(-1, 1); // 左右反転にする（１）
      ctx.translate(-gCVX, 0); // 左右反転にする（２）
      this.drawmain(ctx, tt, ix, iy); // 描画
      ctx.restore();
    } else {
      this.drawmain(ctx, tt, ix, iy); // 描画
    }
  }
  drawmain(ctx, tt, inpx, inpy) {
    const cid = (tt, cycle) => {
      let id = Math.floor((tt) / cycle) % 4;
      return (id == 3) ? 1 : id;
    }
    const cid2 = (tt, cycle) => {
      let id = Math.floor((tt) / cycle) % 4;
      return (id == 3) ? 2 : id;
    }

    // 武器つかうときは特別に
    let cflag = false;
    let [ii, jj, ix, iy] = [-1, -1, inpx, inpy];
    if (inpx < 0 && inpy < 0) {
      [ii, jj, ix, iy] = this.wepdef[this.atkwep];
    }

    // 描画パラメータ
    let [x, y] = this.pos;
    let [mx, my] = this.mvpos;
    let [w, h] = this.psz;
    let cc = cid(tt, 5);

    if (inpx < 0) {
      // 弓矢系のため、ｃｃ上書き
      if (this.atkwep > 15) {
        cc = cid(tt, 10);
        cc = (cc <= 1) ? 0 : 1;
        cflag = true;
      } else {
        cflag = (cc != 0) ? true : false;
      }
    }
    let [dix, diy] = [64 * (3 * ix + cc), 64 * iy]

    // キャラ描画
    ctx.drawImage(this.img, dix, diy, 64, 64, x + mx, y + my, w, h);

    // 武器（576/6）＝ 96
    if (this.atkwep <= 5) {// 剣は少なくともコレ。
      cc = cid2(tt, 5);
    }
    if (ii >= 0 && jj >= 0 && cflag) {
      let [wi, wj] = [3 * ii + cc, jj];
      let [wx, wy] = [576 / 6, 64]
      let [ww, wh] = [wx, wy];
      ctx.drawImage(this.wep, wx * wi, wy * wj, wx, wy, x + mx - 32, y + my, ww, wh);
    }
  }
}