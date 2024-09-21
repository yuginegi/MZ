class cutinClass {
  constructor(){
    let srclist = [
      // 絵具
      ["enogu1","img/add/title2.png"],
      ["enogu2","img/add/title3.png"],
      // 文字
      ["moji_bkaishi","img/add/bkaishi.png"],
      ["moji_keiryakuR","img/add/keiryaku.png"],
      ["moji_keiryakuB","img/add/keiryaku3.png"],
      // スプラ、擬音
      ["penki1","img/add/k0078_1.png"],
      ["penki2","img/add/k0078_4.png"],
      ["gion_gusya","img/add/ma134_7_9.png"],
      ["gion_baan","img/add/ma176_1_5.png"],
      ["sheet_gion2","img/add/gion2.png"],
    ];
    this.img = {}
    for(let cc of srclist){
      let [k,src] = cc;
      this.img[k] = new Image();
      this.img[k].src = src;
    }
  }
  enogu_draw(ctx,tt,tm,yy,ang,img){
    if(tt < tm){ 
      ctx.save();
      let [w,h] = [512,119]//512x119
      let [dw,dh] = [1.5*w,1.5*h]
      let [x,y] = [(796-dw)/2,yy]//書きたいところ
      // 回転の中心に中心点を移動する
      ctx.translate(796/2,604/2);
      // canvasを回転する
      ctx.rotate(Math.PI*(ang/180));
      let [dx,dy] = [x-796/2,y-604/2];
      ctx.drawImage(img,0,0,w,h,dx,dy,dw,dh);
      ctx.restore();
    }
    if(tt==tm){
      audioInvokeSE("Sword4");
    }
  }
  enogumoji(ctx,tb,tt,img,imgK,shc,x,y,dlist,h){
    this.enogu_draw(ctx,tt,tb-20*1,100,10,img);
    this.enogu_draw(ctx,tt,tb-20*2,200,360-10,img);
    this.enogu_draw(ctx,tt,tb-20*3,300,10,img);
    let tb2 = tb-20*2;
    if(tt < tb2){ //667x259
      ctx.save();
      ctx.shadowOffsetX=2;
      ctx.shadowOffsetY=2;
      ctx.shadowBlur = 10;
      ctx.shadowColor=shc;
      let nn = 40/dlist.length;
      let ii = Math.floor((tb2-tt)/nn);
      ii = (ii >= dlist.length)? dlist.length-1 : ii;
      let dw = dlist[ii];
      ctx.drawImage(imgK,0,0,dw,h,x,y,dw,h);
      ctx.restore();
    }
  }
  fillargs(ctx,args){
    UtilmultiMoveLine(ctx,args);
    ctx.fill();
  }
  // その時刻（tm）以下で、音を出して、DRAWする。
  draw4after(ctx,tt,tm,type){
    if(tt < tm){
      if(type==1){
        ctx.drawImage(this.img["penki1"],-100,-300);
        ctx.drawImage(this.img["penki2"],600,0);
        ctx.drawImage(this.img["penki2"],200,350);
        ctx.drawImage(this.img["gion_gusya"],0,0);
      }else{
        //光の線 [796,604]
        ctx.fillStyle = "#FFFF0080";
        this.fillargs(ctx, [[100,0],[796,350],[796,100],[450,0]]);
        this.fillargs(ctx, [[300,0],[0,100],[0,350],[750,0]]);
        this.fillargs(ctx, [[0,100],[696,604],[386,604],[0,300]]);
        // カッ！！
        ctx.drawImage(this.img["sheet_gion2"],170,220,155,200,400,20,155,200);
        ctx.drawImage(this.img["sheet_gion2"],170,878,150,145,500,100,150,145);
        ctx.drawImage(this.img["sheet_gion2"],550,860,100,150,650,120,100,150);
      }
    }
    if(tt == tm){//this.sts5tm
      let se = (type==1)?"Bite":"Skill3";//this.sts5type
      audioInvokeSE(se);
    }
  }
  // その時刻（tm）以下で、音を出して、DRAWする。
  draw1after(ctx,tt,tm){
    if(tt <= tm){//512x512,180-330
      ctx.drawImage(this.img["gion_baan"],0,180,512,150,150,20,512,150);//擬音
    }
    if(tt == tm){
      let se = "Damage4";
      audioInvokeSE(se);
    }
  }
  /******************************************************************
   * Public Functions
   ******************************************************************/
  // 計略打つ時
  keiryakucutin(ctx,tt,tb,type){
    let [k0,k1] = (type==1)?["enogu1","moji_keiryakuR"]:["enogu2","moji_keiryakuB"];
    let img = this.img[k0];
    let imgK = this.img[k1];
    let shc = (type==1)? '#880000':'#000088';
    let [x,y,w,h]=[220,150,381,240];
    let dlist = [184,w];// ２文字を1文字ずつ出す
    let tm = tb - 90;//90F待ってからafter処理する
    // メイン処理
    this.enogumoji(ctx,tb,tt,img,imgK,shc,x,y,dlist,h);
    this.draw4after(ctx,tt,tm,type)
  }
  // 戦闘開始時
  battlestart(ctx,tt,tb){
    let img = this.img["enogu1"];
    let imgK = this.img["moji_bkaishi"];
    let shc = '#880000'
    let [x,y,w,h]=[80,150,667,259];
    let dlist = [180,327,475,w]; // 4文字を1文字ずつ出す
    let tm = tb - 90;//90F待ってからafter処理する
    // メイン処理
    this.enogumoji(ctx,tb,tt,img,imgK,shc,x,y,dlist,h);
    this.draw1after(ctx,tt,tm)
  }
}

class keiryakuClass{
  constructor(){
    // TEST
    this.img4 = new Image();
    this.img4.src = "img/add/gamenfire.png";
  }
  // 3: 火計 敵→味方
  // 7: 号令 味方
  // 8: 号令 敵
  //----------------------
  // 計略時の演出
  //----------------------
  closeFunc(){
    if(this.char){
      this.char.pupset(0);
    }
    if(this.bgs){
      audioStopBGS();
    }
  }
  setCutinParam(id, ch, en){
    console.log(id); // 3
    //let next = 0;
    this.char = null;
    if(id==3){
      //next = 3;// 火計
      this.char = ch;
      ch.pupset(2);//damflag
    }
    if(id==7){
      //next = 7;
      this.char = ch;
      ch.pupset(1);//pupflag
    }
    if(id==8){
      this.char = en;
      this.char.pupset(1);//pupflag
    }
    this.id = id; // id is next if exists.
    //this.next = next;
    this.bgs = false;
    //return next;
  }
  getInitParam(){
    // this.id で 決めるべき。
    let id = this.id;
    let bb = [-100,796+100];//796,604
    let tm = 0; // 演出時間は３秒くらい
    let base = bb[0]; // プレイヤー側
    if(id==3){
      [tm,base] = [180,bb[0]];
    }
    if(id==7){
      [tm,base] = [180,bb[0]];
    }
    if(id==8){
      [tm,base] = [180,bb[0]];
    }
    return [tm,base];
  }
  // １８０Ｆ　演出
  cutinEffect(ctx,tt){
    // 火計
    if(this.id == 3){
      //兵士ためし
      this.char.pupdraw(ctx);
      //640x2400 = 640,480 x 5
      let [w,h] = [640,480];
      let ix = Math.floor(tt/4)%5;
      //[796,604]
      ctx.drawImage(this.img4,0,h*ix,w,h,0,0,796,604);
      if(tt==175){
        audioPlayBGS("Fire1");
        this.bgs = true;
      }
    }
    // 号令 (180F)//796,604
    if(this.id == 7){
      this.char.pupdraw(ctx);
    }
    if(this.id == 8){
      this.char.pupdraw(ctx);
    }
  }
}