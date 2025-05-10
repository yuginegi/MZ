//====================================================================
// コントローラ。たぶん共通で使えるはず
class gamePad{
  constructor(){}
  startfunc(){
    this.gamepad = null;
    this.cntintval = setInterval(this.cntfunc.bind(this),1000/60);
  }
  endfunc(){
    clearInterval(this.cntintval);
  }
  cntfunc(){
    // ゲームパッドを取得する
    var gamepad_list = navigator.getGamepads();
    for(let i=0;i<gamepad_list.length;i++){
      let pad = gamepad_list[i];
      if(pad){
        return this.cntmainfunc(pad)
      }
    }
    return {};
  }
  cntmainfunc(gamepad){
    let gameInput = {
      left: (gamepad.axes[0] < -0.5),
      right: (gamepad.axes[0] > 0.5),
      top: (gamepad.axes[1] < -0.5),
      bottom: (gamepad.axes[1] > 0.5),
      a: (gamepad.buttons[1].pressed),
      b: (gamepad.buttons[0].pressed),
      x: (gamepad.buttons[3].pressed),
      y: (gamepad.buttons[2].pressed),
      l: (gamepad.buttons[4].pressed),
      r: (gamepad.buttons[5].pressed),
    };
    return gameInput;
  }
}

class tcutinClass{
  constructor(){
    this.name = "tcutinClass";
    this.viewclass = null;
    window.addEventListener('resize', this.resizeFunc.bind(this));
  }
  //=== 共通処理 ===
  invoke(inp){
    console.log("[TCUTIN] invoke");
    savegmbusy(); // rollbackmbusy is called at close timing.
    this.delete();
    this.initHTML(inp);
    this.resizeFunc();
  }
  closefunccode(){
    console.log("[TCUTIN] close");
    this.delete();
    rollbackmbusy();
  }
  delete(){
    if(this.viewclass){
      // 設置したDIVを消す
      const element = document.getElementById(this.viewclass.divid);
      if (element) {
        element.remove();
      }
      // 表示クラスのdeleteが定義されてたら呼ぶ
      if(this.viewclass.delete){
        this.viewclass.delete();
      }
      // 表示クラスを消す
      delete this.viewclass;
      this.viewclass = null;
    }
  }
  // リサイズトリガー
  resizeFunc(){
    if(this.viewclass){
      utilResizeFunc(this.viewclass.divid);
    }
  }
  // this.viewclass で制御する
  initHTML(inp){
    // viewclass内で終了時に呼ぶ関数をセットする
    let ed = this.closefunccode.bind(this);
    if(inp == "test2"){
      this.viewclass = new basicPage(this, inp);
      return;
    }
    if(inp == "test1"){
      this.viewclass = new controllerPage(this, inp);
      return;
    }
    if(inp == "test3"){
      this.viewclass = new menuPage(this, inp);
      return;
    }
    // 選ぶものが無ければスカッと抜ける
    this.closefunccode();
  }
}

class basicPage{
  constructor(base,inp){
    this.closefunccode = base.closefunccode.bind(base);
    this.initResource();
    this.initHTML(inp);
  }
  initResource(){
    // サイズ (816, 624)
    this.size = [gXXX,gYYY]
    let mg = [20,20];
    this.guisize = [gXXX - mg[0], gYYY - mg[1]];
    this.divid = "TCUTIN"
    // BASEのパラメータ
    this.basepar = [];
    this.basepar["test2"] = { /* W & H are FIXED. RESIZED BY SCALE */
      type: "div", id: this.divid,
      style: { /* Left,Top,scale are CHANGED */
        backgroundColor: "#00FF00A0", position: "relative", zIndex: 20,
        width: this.guisize[0] + "px", height: this.guisize[1] + "px",
      }
    };
  }
  initHTML(inp){
    // 初期ページ
    let base = generateElement(document.body, this.basepar[inp]);
    // クリックしたら閉じる
    base.addEventListener("click", this.closefunccode.bind(this));
  }
}

class controllerPage{
  constructor(base,inp){
    this.closefunccode = base.closefunccode.bind(base);
    // コントローラのアンセット
    this.delete = this.unsetcont;
    this.initResource();
    this.initHTML(inp);
    // コントローラのセット
    this.setcont();
  }
  setcont(){
    this.gp = new gamePad();
    setInterval(this.updatedraw.bind(this),1000/60);
  }
  unsetcont(){
    if(this.gp){
      this.gp.endfunc();
      delete this.gp;
    }
  }
  initResource(){
    // サイズ (816, 624)
    this.size = [gXXX,gYYY]
    let mg = [20,20];
    this.guisize = [gXXX - mg[0], gYYY - mg[1]];
    this.divid = "TCUTIN"
    // BASEのパラメータ
    this.basepar = [];
    this.basepar["test1"] = { /* W & H are FIXED. RESIZED BY SCALE */
      type: "div", id: this.divid,
      style: { /* Left,Top,scale are CHANGED */
        backgroundColor: "#0000FF50", position: "relative", zIndex: 20,
        width: this.guisize[0] + "px", height: this.guisize[1] + "px",
      }
    };
  }
  initHTML(inp){
    // 初期ページ
    let base = generateElement(document.body, this.basepar[inp]);
    if(inp == "test1"){
      let array = ["right","bottom","top","left","aa","bb","xx","yy","ll","rr"];
      for(let k of array){
        this.addBtnArea(base,k);
      }
    }
    // クリックしたら閉じるボタン
    {
      let par = {
        type: "div", id: "closebtn", textContent:"close",
        style: { fontSize :30+"px", textAlign: 'center',
          backgroundColor: "#000080", position: "absolute", zIndex: 20,
          right:"20px", top:"20px", width: "120px", height: "40px",
        }
      }
      let btn = generateElement(base, par);
      btn.addEventListener("click", this.closefunccode.bind(this));
      btn.addEventListener("mouseenter", this.chcolor.bind(this));
      btn.addEventListener("mouseleave", this.chcolor.bind(this));
    }
  }
  chcolor(e){
    let tar = e.currentTarget;
    tar.style.backgroundColor = (e.type == "mouseenter")? "#4040FF":"#000080";
  }
  addBtnArea(base,key){
    let par = {
      right: [0,"right","→",250,300],
      bottom:[0,"bottom","↓",150,400],
      top:   [0,"top","↑",150,200],
      left:  [0,"left","←",50,300],
      aa:  [0,"aa","A",650,300],
      bb:  [0,"bb","B",550,400],
      xx:  [0,"xx","X",550,200],
      yy:  [0,"yy","Y",450,300],
      ll:  [1,"ll","L",100,100],
      rr:  [1,"rr","R",500,100],
    }
    if(!Array.isArray(par[key])){return;}
    let [type,id,txt,l,t] = par[key];
    let [fs,w,h] = (type==0)?[70,100,100]:[40,200,50]
    generateElement(base,{type: "div", id: id, textContent:txt,
      style: {fontSize :fs+"px", textAlign: 'center',
        backgroundColor: "#00FF00", position: "absolute", zIndex: 20,
        width: w+"px", height: h+"px", left:l+"px",top:t+"px"
      }
    })
  }
  updatedraw(){
    if(this.gp){
      // INPUTを獲得
      let inp = this.gp.cntfunc();
      // パラメータを詰める
      let par = {
        "top":inp.top,"left":inp.left,"right":inp.right,"bottom":inp.bottom,
        "aa":inp.a,"bb":inp.b,"xx":inp.x,"yy":inp.y,"ll":inp.l,"rr":inp.r,
      }
      // 色を変える
      for(let k in par){
        let cc = document.getElementById(k);
        if(cc){
          cc.style.backgroundColor = (par[k])? "#FF00FF" : "#00FFFF"
        }
      }
    }
  }
}

class menuPage{
  constructor(base,inp){
    this.closefunccode = base.closefunccode.bind(base);
    // コントローラのアンセット
    this.delete = this.unsetcont;
    this.initResource();
    this.initHTML(inp);
    // コントローラのセット
    this.setcont();
  }
  delete(){
    this.unsetcont();
  }
  setcont(){
    this.gp = new gamePad();
    setInterval(this.updatedraw.bind(this),1000/60);
  }
  unsetcont(){
    if(this.gp){
      this.gp.endfunc();
      delete this.gp;
    }
  }
  initResource(){
    // サイズ (816, 624)
    this.size = [gXXX,gYYY]
    let mg = [20,20];
    this.guisize = [gXXX - mg[0], gYYY - mg[1]];
    this.divid = "TCUTIN"
    // BASEのパラメータ
    this.basepar = { /* W & H are FIXED. RESIZED BY SCALE */
      type: "div", id: this.divid,
      style: { /* Left,Top,scale are CHANGED */
        backgroundColor: "#0000FF50", position: "relative", zIndex: 20,
        width: this.guisize[0] + "px", height: this.guisize[1] + "px",
      }
    };
  }
  initHTML(){
    // 初期ページ
    let base = generateElement(document.body, this.basepar);
    this.btnmenu = []
    for(let j=0;j<4;j++){
      this.btnmenu[j] = [];
    for(let i=0;i<9;i++){
      let par = {
        type: "div", id: "menu"+(j+1)+"_"+(i+1), textContent:"menu"+(i+1),
        style: { fontSize :30+"px", textAlign: 'center',
          backgroundColor: "#00FFFF", position: "absolute", zIndex: 20,
          left:(40+150*j)+"px", top:(40+60*i)+"px", width: "120px", height: "40px",
        }
      }
      this.btnmenu[j][i] = generateElement(base, par);
    }}
    this.mtarget = [0,0];
    this.waittime = 10;
    this.btnmenu[0][0].textContent = "CLOSE"

    // クリックしたら閉じるボタン
    {
      let par = {
        type: "div", id: "closebtn", textContent:"close",
        style: { fontSize :30+"px", textAlign: 'center',
          backgroundColor: "#000080", position: "absolute", zIndex: 20,
          right:"20px", top:"20px", width: "120px", height: "40px",
        }
      }
      let btn = generateElement(base, par);
      btn.addEventListener("click", this.closefunccode.bind(this));
      btn.addEventListener("mouseenter", this.chcolor.bind(this));
      btn.addEventListener("mouseleave", this.chcolor.bind(this));
    }
  }
  chcolor(e){
    let tar = e.currentTarget;
    tar.style.backgroundColor = (e.type == "mouseenter")? "#4040FF":"#000080";
  }

  updatedraw(){
    let wt = 6;
    let m = this.btnmenu.length;
    let n = this.btnmenu[0].length;
    if(this.waittime > 0){
      this.waittime--;
      return;
    }
    if(this.gp){
      // INPUTを獲得
      let inp = this.gp.cntfunc();
      // 選択したかどうか
      if(inp.b){
        if(this.mtarget[0]==0&&this.mtarget[1]==0){
          this.closefunccode();
        }
      }

      // パラメータを詰める
      if(inp.bottom){
        this.mtarget[1] = (this.mtarget[1]+1)%n;
        this.waittime = wt;
      }
      if(inp.top){
        this.mtarget[1] = (this.mtarget[1]+n-1)%n;
        this.waittime = wt;
      }
      if(inp.right){
        this.mtarget[0] = (this.mtarget[0]+1)%m;
        this.waittime = wt;
      }
      if(inp.left){
        this.mtarget[0] = (this.mtarget[0]+m-1)%m;
        this.waittime = wt;
      }
      // 色を変える
      for(let j=0;j<m;j++){
      for(let i=0;i<n;i++){
        let flag = (j==this.mtarget[0])&&(i==this.mtarget[1]);
        this.btnmenu[j][i].style.backgroundColor = (flag)? "#FF00FF" : "#00FFFF"
      }}
    }
  }
}