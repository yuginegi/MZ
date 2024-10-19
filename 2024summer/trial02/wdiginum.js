
class diginumresource{
  constructor(){
    //数字の読み込み(1個だけにしたいけど)
    this.digis = []
    for(let i=0;i<10;i++){
      let e = new Image();
      e.src = "img/add/num/digi"+i+".png";
      this.digis[i] = e;
    }
    this.digisRed = []
    for(let i=0;i<10;i++){
      let e = new Image();
      e.src = "img/add/num/daka"+i+".png";
      this.digisRed[i] = e;
    }
  }
  getres(base){
    base.digis = this.digis;
    base.digisRed = this.digisRed;
  }
}

class diginum{
  constructor(parent){
    this.parent = parent;
    this.digis = parent.digis;
    this.digisRed = parent.digisRed;
    this.v = 0;//HP表示
    this.cnt = 0;
  }
  setVal(v,mcnt,wpos,mode=0){
    this.v = v;
    this.mcnt = mcnt;
    this.cnt = 0;
    this.wpos = wpos;
    this.mode = mode;
    //if(mode > 0)
    if(v >= 100){ // デカくする
      this.mode = (mode==0)?1:mode;
      this.mcnt = 180;
    }
  }
  getlen(){
    let hp = this.parent.hp;
    if(hp < 0){
      return [0];
    }
    let strHP = hp.toString();
    let n = strHP.length;
    let aa = 1/3;
    let xx = [0];
    for(let i=0;i<n;i++){
      let v = parseInt(strHP[i]);
      let img = this.digis[v];
      xx[i+1] = xx[i]+aa*(img.width);
    }
    return xx;
  }
  getlen2(hp,ain=1/3){
    if(hp < 0){hp=0;}
    let strHP = hp.toString();
    let n = strHP.length;
    let aa = ain;
    let xx = [0];
    for(let i=0;i<n;i++){
      let v = parseInt(strHP[i]);
      let img = this.digis[v];
      xx[i+1] = xx[i]+aa*(img.width);
    }
    return [xx,n,strHP];
  }
  // 数字を出す
  digidraw(ctx){
    let type = this.parent.type;
    let hp = this.parent.hp;
    if(hp < 0){
      hp = 0;
    }
    let [xx,n,strHP] = this.getlen2(hp);
    let aa = 1/3;
    let xpos = (type==0)? 450:350-xx[n];
    let ypos = this.parent.gsize[1]-159;//10
    this.drawcore(ctx,xpos,ypos,aa,xx,n,strHP,this.digis)
  }
  // ダメージ数字
  digidraw2(ctx){
    if(this.cnt==0){
      // SE
      let se;
      if(this.v>=100){
        se = "Thunder10";
      }else if(this.v>0){
        se = "Blow6";
      }else{
        se = "Parry";
      }
      audioInvokeSE(se);
    }
    if(this.cnt++ > this.mcnt){
      this.delflag = true;
      return;
    }
    let [aa,ya1,ya2,yt] = [1/3,-20,-50,15]
    if(this.mode!=0){
      //return this.digidraw2SP(ctx);
      [aa,ya1,ya2,yt] = [2/3,-60,-150,30]
    }
    let cnt = this.cnt;
    //let aa = 1/3;
    let [xx,n,strHP] = this.getlen2(this.v,aa);
    let xpos = this.wpos-xx[n];
    if(this.mode!=0){
      xpos = (this.wpos > 400) ? 450 : 100;
    }
    let y0 = this.parent.gsize[1]-159 -20;
    //let [ya1,ya2] = [-20,-50];
    //let yt = 15; // this.mcnt 60
    let th = Math.PI/yt; // Math.PI=180°
    let ypos = y0 + ya1;
    if(cnt < yt){
      ypos = y0 + ya1*(cnt/yt) + ya2*Math.sin(th*cnt);
    }
    this.drawcore(ctx,xpos,ypos,aa,xx,n,strHP,this.digisRed)
  }
  // 大きいダメージ数字
  digidraw2SP(ctx){
    let cnt = this.cnt;
    let aa = 2/3; // ★
    let [xx,n,strHP] = this.getlen2(this.v,aa);
    let xpos = (this.wpos > 400) ? 450 : 100; // ★
    let y0 = this.parent.gsize[1]-159 -20;
    let [ya1,ya2] = [-60,-150]; // ★
    let yt = 30; // this.mcnt 180 // ★
    let th = Math.PI/yt; // Math.PI=180°
    let ypos = y0 + ya1;
    if(cnt < yt){
      ypos = y0 + ya1*(cnt/yt) + ya2*Math.sin(th*cnt);
    }
    this.drawcore(ctx,xpos,ypos,aa,xx,n,strHP,this.digisRed)
  }
  drawcore(ctx,xpos,ypos,aa,xx,n,strHP,ilist){
    for(let i=0;i<n;i++){
      let v = parseInt(strHP[i]);
      let img = ilist[v];
      let [w,h] = [img.width,img.height]
      let x = xpos+xx[i];
      ctx.drawImage(img,0,0,w,h,x,ypos+10,aa*w,aa*h);
    }
  }
}
