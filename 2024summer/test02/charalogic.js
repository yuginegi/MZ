class characlass {
	constructor(type) {
		//let imgsrc = ["img/sv_actors/Actor1_1.png", "img/sv_actors/Actor1_2.png"];
		let imgsrc = ["img/sv_actors/EN1_1.png", "img/sv_actors/EN1_2.png"];
		let img = new Image();
		img.src = imgsrc[type];
		this.img = img;
		let wepsrc = "img/system/Weapons1.png";
		let wep = new Image();
		wep.src = wepsrc;
		this.wep = wep;
		// 位置情報
		this.pos = [gCVX - 200, 100];
		this.mvpos = [0, 0];
		this.psz = [64 * 2, 64 * 2];
		// 向き：左か右か
		this.dr = type;
		// ステータス
		this.sts = [0, 0];
		this.deadflag = false;
		this.winflag = false;
		// 攻撃方法
		this.atkwep = 0;
		this.wepdef = {
			0:[0,0,1,1],1:[0,1,1,1],2:[0,2,1,1],
			3:[0,3,1,1],4:[0,4,1,1],5:[0,5,1,1],
			10:[1,2,1,0],11:[1,3,1,0],12:[1,4,1,0],13:[1,5,1,0],
			20:[1,0,1,2],	21:[1,1,1,2],22:[1,2,1,2],
		}
		// データ定義
		this.stsdef = {
			// 攻撃
			0: { a: 0, b: 0 }, 1: { a: -1, b: -1 }, 2: { a: 2, b: 0 },
			// やられ
			10: { a: 2, b: 2 }, 11: { a: 2, b: 5 },
			// 勝ち
			30: { a: 0, b: 0 }, 31: { a: 2, b: 1 }
		};
	}
	setimage(imgsrc){
		this.img.src = imgsrc;	
	}

	// 動き方のコントロール
	nextsts(s, t) {
		if (this.deadflag) {
			this.nextsts2(s, t);
		} else if (this.winflag) {
			this.nextsts3(s, t);
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
		} else if(this.atkwep < 15){
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

	//--- draw function ---
	move(){
		if (this.waittime > 0) {
			this.waittime--;
			return;
		}

		// Next
		let [s, t] = this.sts;
		this.nextsts(s, t);
	}
	effe(ctx,type,tt){
		if(this.dr!=type){return;}
		if(this.deadflag){return;}
		let [x, y] = this.pos;
		let [mx, my] = this.mvpos;
		let [w, h] = this.psz;
		let a = tt/90.0;
		ctx.fillStyle = 'rgba(255,255,0,0.5)'; //塗りつぶしの色
		ctx.fillRect(x + mx, y + my + a*h, w, h - a*h);
	}
	draw(ctx) {
		// draw
		this.stsdraw(ctx);
	}
	// 状態・動き方のコントロール
	stsdraw(ctx) {
		let [s, t] = this.sts;
		let p = this.stsdef;
		if (p[s]) {
			this.drawChara(ctx, t, p[s].a, p[s].b);
		}
	}
	// 左か右かを判定して描画
	drawChara(ctx, tt, ix, iy) {
		if (this.dr) {
			ctx.save();		// canvas状態を保存
			ctx.scale(-1, 1); // 左右反転にする（１）
			ctx.translate(-gCVX, 0); // 左右反転にする（２）
		}
		this.drawmain(ctx, tt, ix, iy); // 描画
		if (this.dr) {
		  ctx.restore();
		}
	}
	drawmain(ctx, tt, inpx, inpy) {
		const cid = (tt, cycle) => {
			let id = Math.floor((tt) / cycle) % 4;
			return (id == 3) ? 1 : id;
		}

		// 武器つかうときは特別に
		let cflag = false; 
		let [ii,jj,ix,iy]=[-1,-1,inpx,inpy];
		if(inpx < 0 && inpy < 0){
			[ii,jj,ix,iy] = this.wepdef[this.atkwep];
		}

    // 描画パラメータ
		let [x, y] = this.pos;
		let [mx, my] = this.mvpos;
		let [w, h] = this.psz;
		let cc = cid(tt, 5);

		if(inpx< 0){	
			// 弓矢系のため、ｃｃ上書き
			if(this.atkwep > 15){
				cc = cid(tt, 10);
				cc = (cc<=1)?0:1;
				cflag = true;
			}else{
				cflag = (cc!=0)? true : false;
			}
		}
		let [dix, diy] = [64 * (3 * ix+cc), 64 * iy]
		
		// キャラ描画
		ctx.drawImage(this.img, dix, diy, 64, 64, x + mx, y + my, w, h);

		// 武器（576/6）＝ 96
		if(ii>=0 && jj>=0 && cflag){
			let [wi,wj]=[3*ii+cc,jj];
			let [wx,wy]=[576/6, 64]
			let [ww,wh]=[wx*2,wy*2];
			ctx.drawImage(this.wep, wx*wi,wy*wj,wx,wy, x + mx-64, y + my, ww,wh);
		}
	}
}