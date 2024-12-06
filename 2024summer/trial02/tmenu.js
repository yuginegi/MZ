//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc メニュープラグイン
 * @author yuginegi
 *
 * @help tmenu.js
 *
 * HTML側の操作と連携させる
 * クリックすると戻ってこれる
 * 
 * @command invoke
 * @text 呼び出し
 * @desc 呼び出し
 * @arg val
 * @type text
 * @desc 手がかりのセットID
 * @arg num
 * @type number
 * @desc 総手がかり数
 * 
 * 
 */

(() => {
  'use strict';

  class menucommonClass{
    constructor(){
      this.name = "menucommonClass";
      window.addEventListener('resize', this.resizeFunc.bind(this));
      // サイズ (816, 624)
      this.size = [816,624]
      this.guisize = [816 - 20, 624 - 20];
      this.target = "TMENU";
      this.contdiv = "TMCONT";
      // Resource
      {  // Resource START
        // BASEのパラメータ
        this.basepar = { /* W & H are FIXED. RESIZED BY SCALE */
          type: "div", id: this.target,
          style: { /* Left,Top,scale are CHANGED */
            backgroundColor: "#0000FF50", position: "relative", zIndex: 20,
            width: this.guisize[0] + "px", height: this.guisize[1] + "px"
          }
        };
        // コンテンツのパラメータ
        this.contpar = {
          type: "div", id: this.contdiv,
          style: {
            backgroundColor: "#00000000",
            width: this.guisize[0] + "px", height: 420 + "px"
          }
        };
        this.css = {
          div1:{style:{backgroundColor:"#0000FF00"}},
          closebutton:{style:{zIndex:21,backgroundColor:"#00000080",padding:"5px 10px 5px 10px","text-align":"center"}},
          btmstyle:{style:{zIndex:21,backgroundColor:"#0000CC",padding:"10px"}},
        }
      } // Resource END
    }
    invoke(){
      const element = document.getElementById(this.target);
      if (!element) {
        this.initHTML(); // 初回
      }else{
        this.show();
      }
    }
    show(){
      console.log("show",this);
      this.updateImgSrcTEXT("bt_txtimg",this.guimsg);
      // RESET
      this.updatedisplay(this.target,"block");
      this.updatedisplay(this.contdiv,"block");
      this.updateImgSrcTEXT("btnimg_CLOSE","CLOSE")
      this.closeback = null;
    }
    hide(){
      //DBG//console.log("hide",this.name)
      this.updatedisplay(this.target,"none");
    }
    // div
    creatediv(base,inp,w,h){
      let defaultpar = {type: "div", id: inp,
        style: {backgroundColor: "#000000",width: w + "px", height: h + "px"}};
      return generateElement(base,defaultpar);
    }
    createContents(base){}
    initHTML() {
      // メイン
      let base = generateElement(document.body, this.basepar);
      base.style.backgroundColor = "#0000FF80";
      this.resizeFunc();
      // コンテンツ(796x604)
      let contents = generateElement(base, this.contpar);
      setabspos(contents,0,0);
      this.createContents(contents);
      // CLOSEボタン
      {
        let mm = this.creatediv(base,"bt_close",100,40);//40
        setStyleElement(mm, this.css.closebutton);
        setabspos(mm,5,5,1);
        // CLOSEの文字
        let ii = geneTagImgFromTEXT("btnimg_CLOSE","CLOSE");
        mm.appendChild(ii);
        // mause event
        set3func(mm,this,this.closefunc);
      }
      // BOTTOM MENU 
      {
        let [ww,hh] = [796-20,(604-60-10-350)-20];//184=604-420
        this.btmmenu = this.creatediv(base,"btmmenu",ww,hh);
        setStyleElement(this.btmmenu, this.css.btmstyle);
        setabspos(this.btmmenu,0,420);
        // テキストの描画エリア
        let btm = this.creatediv(this.btmmenu,"btarea",ww-20,hh-20);
        setStyleElement(btm, {style:{padding:"10px"}});
        // テキスト
        let btmtxt = geneTagImgFromTEXT("bt_txtimg", "メニューです");
        btm.appendChild(btmtxt);
      }
      base.addEventListener('mousedown',this.cff.bind(this));
    }
    // close func (右クリックとか、Xでもここに来る？)
    cff(e){
      //DBG//console.log("Right Clicked.", e.button )
      if(e.button==2){ // https://ja.javascript.info/mouse-events-basics
        //DBG//console.log("this.closeback",this.closeback,this)
        if(this.closeback){
          this.backfunc();
        }else{
          smresume1()
        }
      }
    }
    // 右のキャラグラ表示 (グラはimgsetでそれぞれ対応する)
    drawrchara(contents,pre,func=null,tar=null){
      let img0 = this.creatediv(contents,pre+"RIGHT",330,350);
      setStyleElement(img0, this.css.div1);
      setabspos(img0,450,80);
      this.menu0 = img0;
      this.imgset();
      // mause event
      if(func){
        set3func(img0,this,func);
      }
    }
    //メニューヘッダ表示
    drawhead(contents,pre,imgfile){
      let img0 = this.creatediv(contents,pre+"HEAD",10,10);
      setStyleElement(img0, this.css.div1);
      setabspos(img0,60,40);
      // メニューイメージ
      let img = "/img/add/"+imgfile;
      let p = geneTagImg(pre+"HEADIMG",img);
      let imgmenustyle = {classList_add:"fadeInM"};
      setStyleElement(p, imgmenustyle);
      img0.append(p);
      // mause event
      set3func(p,this,this.tfunc);
    }
    imgsetCore(pre,ifile){
      //DBG//console.log("imgset",this.name);
      this.menu0.innerHTML ="";
      if(!ifile){return;}
      let p = document.createElement("img");
      p.id = pre+"imgx";
      p.src = "/img/pictures/"+ifile;
      p.classList.add("fadeIn");
      p.classList.add("CharaShadow");
      this.menu0.append(p);
    }
    // CLOSE の代わりの戻るボタン、BACK
    backfunc(){
      this.tagRemove(this.closeback);
      generateTextClear();
      this.closeback = null;
      this.show();
    }
    // CLOSE用
    closefunc(e){
      let p = e.currentTarget;//現在のイベントハンドラーが装着されているオブジェクトを表します。
      let func = smresume1; // メニューをたたむ
      if(this.closeback){
        func = this.backfunc.bind(this);
      }
      return this.mfcommonTXT(p,e.type,func,"#00FFFF80","#00000080","bt_txtimg","閉じます");
    }
    // テキストの背景色を置き換えるタイプ
    mfcommonTXT(p, type, func, c1, c2, tar=null, exp=null){
      // クリック
      if(type=="click"){
        if(func){func();}
        return;
      }
      // マウス移動
      if(type=="mouseenter"){
        //DBG//console.log("[mfcommon]mouseenter ",p);
        p.style.backgroundColor = c1;
        // テキストを書き換える
        this.updateImgSrcTEXT(tar,exp)
      }else{
        //DBG//console.log("[mfcommon]else "+type);
        p.style.backgroundColor = c2;
      }
    }
    // 画像を置き換えるタイプ
    mfcommonIMG(p, type, func, c1, c2, tar=null, exp=null){
      // クリック
      if(type=="click"){
        if(func){func();}
        return;
      }
      // マウス移動
      if(type=="mouseenter"){
        this.updateImgSrc(p.id,c1)
        this.updateImgSrcTEXT(tar,exp)
      }else{
        this.updateImgSrc(p.id,c2)
      }
    }
    // Common Function -> utils.js
    tagRemove(id){
      let eee = document.getElementById(id);
      if(eee){
        eee.remove();
      }
    }
    updatedisplay(id,mode){
      //DBG//console.log("updatedisplay",id,mode)
      const eee = document.getElementById(id);
      if (eee) {
        eee.style.display = mode;
      }
    }
    updateImgSrc(id,src){
      if(!id){console.log("[updateImgSrc] id is null.");return;}
      let eee = document.getElementById(id);
      if(eee){
        eee.src = src;
      }
    }
    updateImgSrcTEXT(id,text){
      return this.updateImgSrc(id,getImgSrcFromTEXT(text))
    }
    resizeFunc(){
      utilResizeFunc(this.target);
    }
  }

  class storyClass extends menucommonClass{
    constructor(parent){
      super();
      this.parent = parent;
      this.name = "storyClass";
      this.contdiv = "STLIST";
      // Resource
      {  // Resource START
        // コンテンツのパラメータ（上書き）
        this.contpar.id = this.contdiv;
      } // Resource END
      this.listpos = [50,120+75,10];
      this.ilist = { // cid は１から・・・
        0:{flag:11,ff:"Actor1", cid:5},
        1:{flag:1,ff:"People2",cid:3},
        //2:{flag:5,ff:"Actor1", cid:2},
        //3:{flag:12,ff:"Actor1", cid:1},
        2:{flag:5,sp:"tb2_1",ff:"tb2",cid:1},
        3:{flag:12,sp:"tb1_1",ff:"tb1",cid:1},
        4:{flag:13,ff:"Actor1", cid:5},
        5:{flag:28,sp:"coconaB1",ff:"Heroine2",cid:1},
        6:{flag:29,sp:"mina1",ff:"minami",cid:1},
      }
      this.explist = [
        "旅の目的",
        "アルスとの出会い",
        "旅の勇者との交流",
        "ハコネの問題、一件落着",
        "アシガラの異変",
        "旅の精霊術士、登場",
        "旅の剣士、登場",
        "未開放8",
        "未開放9",
        "未開放10",
      ];
      this.guimsg = "これまでのストーリーです";
    }
    show(){
      this.addHTML();
    }
    addHTML() {
      let pre = "ST";
      let base = document.getElementById(this.target)
      // コンテンツ(796x604)
      let contents = generateElement(base, this.contpar);
      setabspos(contents,0,0);
      // CENTER MENU
      this.drawrchara(contents,pre);
      // ヘッダ表示
      this.drawhead(contents,pre,"msky1.png");
      // リスト
      this.drawlist(contents);
      // メニュー更新
      this.updateImgSrcTEXT("bt_txtimg",this.guimsg);
      // CLOSE更新
      this.updateImgSrcTEXT("btnimg_CLOSE","BACK")
      this.parent.closeback = this.contdiv;
    }
    drawlist(contents){
      let [bx,by,n] = this.listpos;
      for(let i=0;i<n;i++){
        if(!this.ilist[i]){continue;}
        let flag = this.ilist[i].flag;
        if(!$gameSwitches.value(flag)){continue;}
        let [ix,iy]=[i%5,Math.floor(i/5)];
        let [xx,yy]=[bx+70*ix,by+75*iy];
        let id = (i%10+1);
        let [ff,cid] = [this.ilist[i].ff,this.ilist[i].cid];
        let ii = new charaImg([xx,yy,cid],ff,id);
        contents.append(ii.can);
        // mause event
        set3func(ii.can,this,this.tfunc);
      }
    }
    //　イメージをセットする。CENTER MENU から呼ばれる Refresh。
    imgset(i=0){
      if(this.ilist[i] && this.ilist[i].sp){
        let ifile = this.ilist[i].sp+".png";
        this.imgsetCore("",ifile);
      }else{
        let [ff,cid] = (this.ilist[i])?[this.ilist[i].ff,this.ilist[i].cid]:["Actor1",5];
        this.imgsetCore("",ff+"_"+cid+".png");
      }
    }

    tfunc(e){
      let p = e.currentTarget;
      let type = e.type;
      // クリック
      if(type=="click"){
        console.log("click")
        return;
      }
      // マウス移動
      if(type=="mouseenter"){
        if(p.id == "STHEADIMG"){
          return this.updateImgSrcTEXT("bt_txtimg",this.guimsg);
        }
        this.updateImgSrcTEXT("bt_txtimg",this.explist[p.vid-1]);
        this.imgset(p.vid-1);
      }else{
        /* mouse leave */
      }
    }
  }

  class partyClass extends menucommonClass{
    constructor(parent){
      super();
      this.parent = parent;
      this.name = "partyClass";
      this.contdiv = "PTLIST";
      // Resource
      {  // Resource START
        // コンテンツのパラメータ（上書き）
        this.contpar.id = this.contdiv;
      } // Resource END
      this.guimsg = "助けてくれる仲間たち";
      //
      if(1){
        this.initdata();
      }else{
        this.ilist = {
          3:{flag:4,ff:"Actor1",cid:0,exp:"旅の男"},
          4:{flag:5,ff:"Actor1",cid:1,exp:"旅の女"},
          1:{flag:11,ff:"Actor1",cid:4,exp:"ユウ"},
          2:{flag:1,ff:"People2",cid:2,exp:"アルス"},
        }
      }
    }
    setdata(){
      let val = $gameVariables.value(1);
      let key = (val && val.id) ? val.id : "default";
      this.ilist = this.ilistdata[key]?this.ilistdata[key]:this.ilistdata["default"]
    }
    initdata(){
      let tdata = {};
      {
        tdata["default"] = {
          1:{flag:11,ff:"Actor1",cid:4,exp:"ユウ"},
        }
      }
      {
        tdata["hakone"] = {
          3:{flag:4,sp:"tb1_1",ff:"tb1_2",cid:0,exp:"旅の男"},
          4:{flag:5,sp:"tb2_1",ff:"tb2_2",cid:0,exp:"旅の女"},
          1:{flag:11,ff:"Actor1",cid:4,exp:"ユウ"},
          2:{flag:1,ff:"People2",cid:2,exp:"アルス"},
        }
      }
      {
        tdata["ashigara"] = {
          3:{flag:28,sp:"coconaB1",ff:"heroine",cid:0,exp:"旅の精霊術士"},
          4:{flag:29,sp:"mina1",ff:"mina2",cid:0,exp:"旅の剣士"},
          2:{flag:32,ff:"People4",cid:6,exp:"アシガラの職人"},
          1:{flag:11,ff:"Actor1",cid:4,exp:"ユウ"},
        }
      }
      {
        tdata["odawara"] = {
          3:{flag:42,ff:"Actor1",cid:5,exp:"旅１"},
          4:{flag:43,ff:"Actor1",cid:7,exp:"旅２"},
          2:{flag:51,ff:"People3",cid:2,exp:"リュート王子"},
          1:{flag:11,ff:"Actor1",cid:4,exp:"ユウ"},
        }
      }
      // set
      this.ilistdata   = tdata;
    }
    show(){
      this.addHTML();
    }
    addHTML() {
      let pre = "PT";
      let base = document.getElementById(this.target)
      // コンテンツ(796x604)
      let contents = generateElement(base, this.contpar);
      setabspos(contents,0,0);
      // データ初期化
      this.setdata()
      // CENTER MENU
      this.drawrchara(contents,pre);
      // ヘッダ表示
      this.drawhead(contents,pre,"msky3.png");
      // キャラのリスト
      this.charalist(contents,pre);
      // メニュー更新
      this.updateImgSrcTEXT("bt_txtimg",this.guimsg);
      // CLOSE更新
      this.updateImgSrcTEXT("btnimg_CLOSE","BACK")
      this.parent.closeback = this.contdiv;
    }
    charalist(contents){
      let [bx,by,n] = [50,120,4];
      let facelist = this.ilist
      for(let i=0;i<n;i++){
        let id = (i+1);
        if(!facelist[id]){continue;}
        let flag = facelist[id].flag;
        if(!$gameSwitches.value(flag)){continue;}
        let [xx,yy]=[bx+170*(i%2),by+150*Math.floor(i/2)];
        let [ff,cid] = [facelist[id].ff,facelist[id].cid];
        let ii = new charaFace([xx,yy,cid],ff,id);
        contents.append(ii.can);
        // mause event
        set3func(ii.can,this,this.tfunc);
      }
    }
    imgset(vid=0){
      let ifile = null;
      if(vid>0){
        if(this.ilist[vid].sp){
          ifile = this.ilist[vid].sp+".png";
        }else{
          let [ff,cid] = [this.ilist[vid].ff,this.ilist[vid].cid]
          ifile = ff+"_"+(cid+1)+".png";
        }
        //DBG//console.log("ifile",ifile)
      }
      this.imgsetCore("PT",ifile);
    }
    tfunc(e){
      let p = e.currentTarget;
      let type = e.type;
      // クリック
      if(type=="click"){
        console.log("click")
        return;
      }
      // マウス移動
      if(type=="mouseenter"){
        if(p.id == "PTHEADIMG"){
          return this.updateImgSrcTEXT("bt_txtimg",this.guimsg);
        }
        this.updateImgSrcTEXT("bt_txtimg",this.ilist[p.vid].exp);
        this.imgset(p.vid);
      }else{
        /* mouse leave */
      }
    }
  }

  // 手がかり表示（123行）
  class tegakaListClass extends menucommonClass{
    constructor(parent){
      super();
      this.parent = parent;
      this.name = "tegakaListClass";
      this.contdiv = "TGLIST";
      // Resource
      {  // Resource START
        // コンテンツのパラメータ（上書き）
        this.contpar.id = this.contdiv;
      } // Resource END
      this.guimsg = "これまで集めた手がかりです";

      if(1){
        this.initdata();
      }else{
      /*** ここからが1面のデータ *******/
      // 手がかりデータ
      this.ilist = {
        1:{tid:"mati1",ff:"People1",cid:8},
        2:{tid:"mati2",ff:"People1",cid:6},
        3:{tid:"mati3",ff:"People1",cid:3},
        4:{tid:"mati4",ff:"People1",cid:7},
        5:{tid:"mati5",ff:"People1",cid:6},
        6:{tid:"mati6",ff:"People1",cid:6},
        7:{tid:"mati7",ff:"Actor3",cid:7},
        8:{tid:"mati8",ff:"Evil",cid:1},
        9:{tid:"mati9",ff:"People2",cid:3},
        10:{tid:"mati10",ff:"People3",cid:1},
      }
      this.explist = [
        "領主様も昔はとてもやさしいお方でした。\n今ではすっかり別人。。。\n食べるものも着るものも、家族までも失いました。",
        "この地方はとても住みやすかったのですけどね。\n今となっては・・・。\nどこかに移住しようと思っています。",
        "あいつが、あいつが来てから\nこの辺は変わっちまった。\n借金の形で、おれの妹まで連れていかれた・・・。",
        "何もないがゆっくりしていってくれ。\n商売しづらくなっちまったよ、この村も・・。\n今ではすっかり海賊が我が物顔で歩いてやがる。\n昔はこんなじゃない、治安が良かったんだがな・・",
        "食べるものを入手するのも大変です。\n領主様のところにお仕えすれば・・・。\nしかし、若い女の人しか雇わないと聞きます。", //5
        "ごめんなさい、もう食材が無くて、、\nこの地方はもうダメね・・\n厳しい取り立てでもう限界・・",
        "港の方でこっそり売ってくれるんだ。\n食糧や酒などが手に入るって話だぜ。",
        "※ 船の捜索\n船には食料品がたくさんあった\n高く売って儲けている奴がどこかにいる",
        "※ 立ち聞き\n重税や買い占めで価格のつり上げ\n領主がダイコクにすり替わっているとか\nアルス「なんということだ・・。",
        "ダイコク屋に軟禁されていたのだ。\nあいつらは、、、"
      ];
      /*** ここからが2面のデータ *******/
      // 手がかりデータ
      this.ilist = {
        1:{tid:"mati1",ff:"People1",cid:8},
        2:{tid:"mati2",ff:"People1",cid:6},
        3:{tid:"mati3",ff:"People1",cid:3},
        4:{tid:"mati4",ff:"People1",cid:7},
        5:{tid:"mati5",ff:"People1",cid:6},
        6:{tid:"mati6",ff:"People1",cid:6},
        7:{tid:"mati7",ff:"Actor3",cid:7},
        8:{tid:"mati8",ff:"Evil",cid:1},
        9:{tid:"mati9",ff:"People2",cid:3},
        10:{tid:"mati10",ff:"People3",cid:1},
      }
      this.explist = [
        "領主様も昔はとてもやさしいお方でした。\n今ではすっかり別人。。。\n食べるものも着るものも、家族までも失いました。",
        "この地方はとても住みやすかったのですけどね。\n今となっては・・・。\nどこかに移住しようと思っています。",
        "あいつが、あいつが来てから\nこの辺は変わっちまった。\n借金の形で、おれの妹まで連れていかれた・・・。",
        "何もないがゆっくりしていってくれ。\n商売しづらくなっちまったよ、この村も・・。\n今ではすっかり海賊が我が物顔で歩いてやがる。\n昔はこんなじゃない、治安が良かったんだがな・・",
        "食べるものを入手するのも大変です。\n領主様のところにお仕えすれば・・・。\nしかし、若い女の人しか雇わないと聞きます。", //5
        "ごめんなさい、もう食材が無くて、、\nこの地方はもうダメね・・\n厳しい取り立てでもう限界・・",
        "港の方でこっそり売ってくれるんだ。\n食糧や酒などが手に入るって話だぜ。",
        "※ 船の捜索\n船には食料品がたくさんあった\n高く売って儲けている奴がどこかにいる",
        "※ 立ち聞き\n重税や買い占めで価格のつり上げ\n領主がダイコクにすり替わっているとか\nアルス「なんということだ・・。",
        "ダイコク屋に軟禁されていたのだ。\nあいつらは、、、"
      ];
      }
      // メニューレイアウト（Aタイプ） Y=195 スタート
      //this.listpos = [50,120+75,10];
      //this.infopos = [80,120];
      // メニューレイアウト（Bタイプ） Y=120 スタート
      //this.listpos = [50,120,20];
      //this.infopos = [380,40];
    }
    getinfopos(n){
      if(n > 15){
        return [380,40]
      }
      return [80,120]
    }
    getlistpos(n){
      if(n > 15){
        return [50,120,n]
      }
      return [50,120+75,n]
    }
    setdata(key){
      this.ilist   = this.ilistdata[key]
      this.explist = this.explistdata[key]
    }
    initdata(){
      let tdata = {};
      let expif = {};
      /*** ここからが1面のデータ *******/
      {
        // 手がかりデータ
        tdata["hakone"] = {
          1:{tid:"mati1",ff:"People1",cid:8},
          2:{tid:"mati2",ff:"People1",cid:6},
          3:{tid:"mati3",ff:"People1",cid:3},
          4:{tid:"mati4",ff:"People1",cid:7},
          5:{tid:"mati5",ff:"People1",cid:6},
          6:{tid:"mati6",ff:"People1",cid:6},
          7:{tid:"mati7",ff:"Actor3",cid:7},
          8:{tid:"mati8",ff:"Evil",cid:1},
          9:{tid:"mati9",ff:"People2",cid:3},
          10:{tid:"mati10",ff:"People3",cid:1},
        }
        expif["hakone"] = [
          "領主様も昔はとてもやさしいお方でした。\n今ではすっかり別人。。。\n食べるものも着るものも、家族までも失いました。",
          "この地方はとても住みやすかったのですけどね。\n今となっては・・・。\nどこかに移住しようと思っています。",
          "あいつが、あいつが来てから\nこの辺は変わっちまった。\n借金の形で、おれの妹まで連れていかれた・・・。",
          "何もないがゆっくりしていってくれ。\n商売しづらくなっちまったよ、この村も・・。\n今ではすっかり海賊が我が物顔で歩いてやがる。\n昔はこんなじゃない、治安が良かったんだがな・・",
          "食べるものを入手するのも大変です。\n領主様のところにお仕えすれば・・・。\nしかし、若い女の人しか雇わないと聞きます。", //5
          "ごめんなさい、もう食材が無くて、、\nこの地方はもうダメね・・\n厳しい取り立てでもう限界・・",
          "港の方でこっそり売ってくれるんだ。\n食糧や酒などが手に入るって話だぜ。",
          "※ 船の捜索\n船には食料品がたくさんあった\n高く売って儲けている奴がどこかにいる",
          "※ 立ち聞き\n重税や買い占めで価格のつり上げ\n領主がダイコクにすり替わっているとか\nアルス「なんということだ・・。",
          "ダイコク屋に軟禁されていたのだ。\nあいつらは、、、"
        ];
      }
      /*** ここからが2面のデータ *******/
      {
        // 手がかりデータ
        tdata["ashigara"] = {
          1:{tid:"mati1",ff:"SF_People1",cid:2},
          2:{tid:"mati2",ff:"People4",cid:7},
          3:{tid:"mati3",ff:"People1",cid:7},
          4:{tid:"mati4",ff:"People1",cid:8},
          5:{tid:"mati5",ff:"People4",cid:6},
          6:{tid:"mati6",ff:"People1",cid:5},
          7:{tid:"mati7",ff:"People4",cid:6},
          8:{tid:"mati8",ff:"SF_People1",cid:6},
          9:{tid:"mati9",ff:"People1",cid:1},
          10:{tid:"mati10",ff:"People1",cid:3},
          11:{tid:"mati11",ff:"SF_People1",cid:8},
          12:{tid:"mati12",ff:"People4",cid:7},
        }
        expif["ashigara"] = [
          "お父さんが、悪い奴に連れていかれちゃった・・\nううう・・・",
          "あいつらは私に偽物づくりをさせるために、\n手技師の私を洞窟に無理やり連れていって・・\n贋作作りの作業をさせられていました。\nすみません、子供の命で脅されて・・・",
          "最近できた店のものが売れていると聞く\n健康被害などが無ければよいがのう\n健康や寿命は金では買い戻せんて\nわしらみたいな貧乏人にはな・・",
          "税金が高いから、生活も楽じゃないから\n質より安いものを選んで買ってしまうのよね",
          "ここの店の品物は良いものだ。\n決して高くない、良心的な値段設定だ。\nその巷で売れてるものをもし持ってきてくれたら\n腕は確かなアタイが鑑定してやるよ",//5
          /* 05 */
          "別の店で安いものが売られているから、\nうちの商売はあがったりなんだ・・\nあんなに安く売れるはずがない\nアレは本物なのだろうか・・",
          "おう、これが噂の・・・\nふむふむ、これは・・！！\nよくできているが、これは禁止されている材料だ\n吸い込んだりすると悪性疾患を発症するものだな",
          "この街は手工業が盛んです\n東に住んでいる女の子のお父さん、\n町一番の腕の良い手技師なんですよ\n最近、見かけないですね",
          "そこの石像、なんか変なんだよなー\n忍者みたいな人がよく触りに来るんだよ\n謎解きが好きなのかな？",
          "買いすぎちゃったから１個あげるよ\nいやあ、こんなに安く買えるなんて",
          /* 10 */
          "うげえ、まさかそんな・・\nあの女に騙されたのか、うまい話があると・・\n北の洞窟に迷い込んでしまったときに\n女忍者に話を持ちかけられたのだ",
          "これが禁止材料です。安く作れますが\nご存じの通り、健康被害があります\n何十年も手工業職人には当たり前なのです",
        ];
      }
      /*** ここからが3面のデータ *******/
      {
        // 手がかりデータ
        tdata["odawara"] = {
          1:{tid:"mati1",ff:"People4",cid:2},
          2:{tid:"mati2",ff:"People4",cid:2},
          3:{tid:"mati3",ff:"People4",cid:2},
          4:{tid:"mati4",ff:"People4",cid:4},
          5:{tid:"mati5",ff:"People4",cid:2},
          6:{tid:"mati6",ff:"People4",cid:8},
          7:{tid:"mati7",ff:"People4",cid:8},
          8:{tid:"mati8",ff:"People3",cid:5},
          9:{tid:"mati9",ff:"People4",cid:8},
          10:{tid:"mati10",ff:"People4",cid:2},
          11:{tid:"mati11",ff:"People4",cid:4},
          12:{tid:"mati12",ff:"People4",cid:4},
          13:{tid:"mati13",ff:"People4",cid:6},
          14:{tid:"mati14",ff:"SF_Actor1",cid:5},
          15:{tid:"mati15",ff:"SF_Actor3",cid:1},
          16:{tid:"mati16",ff:"People3",cid:1},
          17:{tid:"mati17",ff:"People3",cid:3},
          18:{tid:"mati18",ff:"People2",cid:3},
          19:{tid:"mati19",ff:"Actor1",cid:5},
          20:{tid:"mati20",ff:"Actor3",cid:7},
        }
        expif["odawara"] = [
          "王妃と宰相はいつも夜遅くまで\n綿密にお打合せされております\n国の大事について熱心に\n議論されているのでしょうか",
          "王様も最近元気がなくなられて\n少し前までは治政に尽力され、\nとても行動的で情熱的でした\nご病気なのでしょうか・・",
          "王様が体調不良になったのは最近\nそれからというもの、宰相様が\n王妃様とご一緒に治世されております",
          "変わったことと言えば、\n西の塔の小部屋によく人が出入りしている。\nココならよく見えるのよ。",
          "いまの宰相様になったのは最近ですね\nすごく頭の良いかたという感じで・・\nルックスも素敵なのでファンも多く\n実は私もファンなのです・・・",
          /* 05 */
          "宰相様が変わってからリュート様は、\n武術・勉学により一層励んでいますね\n私たちの、頼りになる自慢の王子です\n将来、この国は安泰です",
          "アレン王子は前にも増しておとなしくなり\n昔は口数少なくても表情豊かでした\n最近は笑顔を見たことがありません・・",
          "リュート王子は優秀で、努力も欠かしません\nしかし、跡継ぎ候補にアレン王子を推す動きが・・\n王様がユウ様に相談したいそうです、\n城の裏口の小部屋にお越しください。",
          "忍者って変化の術が使えるんですってね\nわたしも素敵なお姫様とかになれるのかしら",
          "宰相様はお部屋の掃除を自分でなされます\n私たちメイドは入ってはいけないのです\n宰相様はきれい好きなのですかね？\nもしくは見られたくない・・ウフフ",          
          /* 10 */
          "王妃様、以前はとても優しかったが\n宰相殿がデュラン様になってから\n人が変わってしまったように・・",
          "王妃様とリュート王子は実の親子では\nないのですが、とても仲良かったのです\n以前までは・・・といっても、\nそんなに前のことではないです",
          "悪い噂を聞くようになったのは\n宰相が変わってからかな\n政治力は良く発揮しているようだが\n人事的な、権力的な良く無い噂を聞く",
          "城に忍者が出入りしているって噂だ\nアシガラで悪さをしていたのも忍者だった\nなにか関係があるのだろうか",
          "宰相と忍者が密会しているって噂だ\nその忍者は女だとかどうとか\nそれが本当なのだとしたら\nなかなか変わったカップルだな",
          /* 15 */
          "わしの命は長くはないだろう・・。\n随分と遅効性の毒を盛られたものだ。\n宰相も王妃も跡継ぎは下の子を推してくる・・・。\n何を迷っていたのであろうか、跡継ぎは長男で行く。",
          "王妃には、義母とはいえ良くしてもらいました。\n私に反対の意思はありません。\n国のために自分の能力を活かせればよいです。\nこれは陰謀です。王の座など求めません。",
          "密書を奪ってきました。\n父上母上に続いて兄上まで失いたくない。\nどうか、宰相とニセ王妃を止めてください。\nうう・・・",
          "※ 立ち聞き\nニセ王妃とこの宰相デュランで\nこの国を好きにさせてもらうとしよう\nユウ「なんたる卑劣！許せん！",
          "いままではリュート様が指揮を執っておりましたが\n最近では宰相様が指揮を執るようになりました\n王妃様のご指名とのことですが、\n政治家如きがリュート様には遠く及びません",          
        ];
      }
      // set
      this.ilistdata   = tdata;
      this.explistdata = expif;
    }
    show(){
      this.addHTML();
    }
    addHTML() {
      let pre = "TG";
      let base = document.getElementById(this.target)
      // コンテンツ(796x604)
      let contents = generateElement(base, this.contpar);
      setabspos(contents,0,0);
      // CENTER MENU
      this.drawrchara(contents,pre);
      // ヘッダ表示
      this.drawhead(contents,pre,"msky2.png");
      // 手がかり情報の表示
      this.infolist(contents,pre)
      // リスト
      this.drawlist(contents);
      // メニュー更新
      this.updateImgSrcTEXT("bt_txtimg",this.guimsg);
      // CLOSE更新
      this.updateImgSrcTEXT("btnimg_CLOSE","BACK")
      this.parent.closeback = this.contdiv;
    }
    
    infolist(contents,pre){
      let val = $gameVariables.value(1);
      //DBG//console.log(val);
      if(!val || !val.num){return;}
      this.setdata(val.id);
      let [ix,iy] = this.getinfopos(val.num);
      let str = "手がかり回収率 "+(Object.keys(val).length -2)+"／"+(val.num);
      let img0 = this.creatediv(contents,pre+"INFO",10,10);
      setStyleElement(img0, this.css.div1);
      setabspos(img0,ix,iy); // ここに設置。２０人の時は調整必要
      // テキスト
      let btmtxt = geneTagImgFromTEXT(pre+"info_txtimg", str);
      img0.appendChild(btmtxt);
    }
    drawlist(contents){
      let val = $gameVariables.value(1);//this.ids[0]
      if(!val || !val.num){return;}
      this.setdata(val.id);
      let [bx,by,n] = this.getlistpos(val.num);
      n = val.num
      for(let i=0;i<n;i++){
        let [ix,iy]=[i%5,Math.floor(i/5)];
        let [xx,yy]=[bx+70*ix,by+75*iy];
        let id = i+1;//(i%10+1);
        let p=this.ilist[id]
        if(!val[p.tid]){continue;}
        let ii = new charaImg([xx,yy,p.cid],p.ff,id);
        contents.append(ii.can);
        // mause event
        set3func(ii.can,this,this.tfunc);
      }
    }
    //　イメージをセットする。CENTER MENU から呼ばれる Refresh。
    imgset(vid=0){
      let ifile = null;
      if(vid>0){
        let [ff,vv] = [this.ilist[vid].ff,this.ilist[vid].cid]
        ifile = ff+"_"+vv+".png";
      }
      this.imgsetCore("TG",ifile);
    }
    tfunc(e){
      let pre = "TG";
      let p = e.currentTarget;
      let type = e.type;
      // クリック
      if(type=="click"){
        console.log("click")
        return;
      }
      // マウス移動
      if(type=="mouseenter"){
        if(p.id == pre+"HEADIMG"){
          return this.updateImgSrcTEXT("bt_txtimg",this.guimsg);
        }
        // テキストを書き換える // "新GUI"+p.id+" "+p.vid
        this.updateImgSrcTEXT("bt_txtimg",this.explist[p.vid-1]);
        this.imgset(p.vid);
      }else{
        //DBG//console.log("[mfcommon]else "+type);
      }
    }
  }

  // トップメニュー
  class tmenuClass extends menucommonClass{
    constructor(){
      super();
      this.name = "tmenuClass";
      this.guimsg = "ユウ「世直し旅と参ろうじゃないか";
      // Resource
      {  // Resource START
        // top menuのパラメータ
        this.menupar = {
          story:{text:"ストーリー", explain:"ストーリーを振り返ります",
          img:"mblu1.png",himg:"msky1.png",func:this.pagefunc.bind(this,1)},
          clues:{text:"手がかり", explain:"いままで集めた手がかりを確認します",
          img:"mblu2.png",himg:"msky2.png",func:this.pagefunc.bind(this,2)},
          party:{text:"仲間", explain:"とりあえず別画面、仲間",
          img:"mblu3.png",himg:"msky3.png",func:this.pagefunc.bind(this,3)},
          save:{text:"セーブ", explain:"セーブします",
          img:"mblu4.png",himg:"msky4.png",func:savefunc},
        }
      } // Resource END
      // nextpage Class List
      {
        let st = new storyClass(this);
        let tg = new tegakaListClass(this);
        let pt = new partyClass(this);
        this.nextpage = {1:st,2:tg,3:pt}
      }
    }
    createContents(base){
      // CENTER MENU
      this.drawrchara(base,"CM",this.mfuncX);
      // MENU
      this.drawlist(base);
    }
    // MENU表示
    drawlist(base){
      let keys = Object.keys(this.menupar);
      for(let i=0;i<keys.length;i++){
        let img0 = this.creatediv(base,"MENU"+(i+1),10,10);
        setStyleElement(img0, this.css.div1);
        setabspos(img0,60,60+(90*i));
        // メニューイメージ
        let img = "/img/add/" + this.menupar[keys[i]].img;
        let p = geneTagImg(keys[i],img);
        let imgmenustyle = {classList_add:"fadeInM",style:{"animation-duration":((1*i+5)/10)+"s"}};
        setStyleElement(p, imgmenustyle);
        img0.append(p);
        // mause event
        set3func(p,this,this.mfuncX);
      }
    }
    //　イメージをセットする。CENTER MENU から呼ばれる Refresh。
    imgset(){
      this.imgsetCore("","Actor1_5.png")
    }
    // 自分を隠して、別の窓を出す
    pagefunc(xx){
      //DBG//console.log("pagefunc invoke.", xx)
      this.updatedisplay(this.contdiv,"none");
      if(this.nextpage[xx]){this.nextpage[xx].show();}
    }
    // クリックやマウスオーバーの実行制御
    mfuncX(e){
      let p = e.currentTarget;//現在のイベントハンドラーが装着されているオブジェクトを表します。
      let mm = this.menupar[p.id];
      let func = (mm) ? mm.func : null;
      let exp = (mm) ? mm.explain : "メニュー「"+p.id+"」が選択";
      if(p.id=="CMRIGHT"){
        exp = this.guimsg;
        func = statusfunc;
      }
      let ph = "/img/add/";
      let [img,himg] = (mm) ? [mm.img,mm.himg] : [null,null];
      return this.mfcommonIMG(p,e.type,func,ph+himg,ph+img,"bt_txtimg",exp)
    }
  }

  var current = document.currentScript.src;
  let modname = current.match(/([^/]*)\./)[1];
  console.log("modname is "+modname);
  // 初期値、上からもらえる
  var parameters = PluginManager.parameters(modname);
  var paraids = parameters['values'];
  console.log(paraids,typeof(paraids));
  let tmenu = new tmenuClass(paraids);

  /*=== HOOK =======*/

  // マップからメニューを開かせない
  // Window_MenuCommand.initCommandPosition() は メニューとコマンドだけ
  const TE = TouchInput.update;
  const IE = Input.update;
  const TD = function() {};
  var gHookMenuMode = false;
  function smresume(){
    if(gHookMenuMode==false){
      console.log("endMenu skip");
      return;
    }
    //DBG//console.log("endMenu");
    // 村人を動かす
    SceneManager.resume()
    // 操作再開
    TouchInput.clear();
    Input.clear();
    TouchInput.update = TE;
    Input.update = IE;
    // TEST
    tmenu.hide();
    // メニューを再び押せるように
    setTimeout(resfunc,100);
  }
  function resfunc(){
    gHookMenuMode = false;
    $gameSystem.enableMenu();
  }
  function smresume1(){
    generateTextClear();
    smresume();
    // MENUのために (ほかに遷移していないので、わざわざ呼び出す必要がある)
    const element = document.getElementById('TEGAKARI');
    if (element) {
      //DBG//console.log("SET BLOCK")
      element.style.display = "BLOCK";
    }
  }
  Scene_Map.prototype.callMenu = function() {
    if(gHookMenuMode!=false){
      console.log("callMenu skip");
      return;
    }
    gHookMenuMode = true;
    //DBG//console.log("callMenu");
    this.menuCalling = false; // 繰り返し呼びを止める
    // 村人を動かさない
    SceneManager.stop()
    // 入力のクリア
    TouchInput.update = TD;TouchInput.clear();
    Input.update = TD;Input.clear();
    $gameTemp.clearDestination();
    // 無効化する
    $gameSystem.disableMenu();
    // TEST
    tmenu.invoke();
    // MENUのために
    const element = document.getElementById('TEGAKARI');
    if (element) {
      //DBG//console.log("SET NONE")
      element.style.display = "none";
    }
    // メニューを隠す
    //Scene_Map.prototype.hideMenuButton()
    this.hideMenuButton();
  }
  // Status
  function statusfunc(){
    console.log("statusfunc invoke");
    smresume();//$gameSystem.enableMenu();
    SceneManager.push(Scene_Status);
  }
  // Save
  function savefunc(){
    console.log("savefunc invoke");
    smresume();//$gameSystem.enableMenu();
    SceneManager.push(Scene_Save);
  }

  /*=== HOOK =======*/

  /* PluginManager.registerCommand： 第１引数 は ファイル名！！ */

  // invoke
  PluginManager.registerCommand(modname, "invoke", args => {
    tmenu.invoke();
  });

})();