class controllerPage extends basicPage{
  constructor(base,inp){
    super(base,inp);
    // コントローラのセット
    this.setcont(this.updatedraw.bind(this));
  }

  initResource(inp){
    // コントローラのアンセット
    this.delete = this.unsetcont;
    // 典型パターン
    this.basepar = this.preparebasepar("TCUTIN","#0000FF50",this.size,[20,20])
  }
  initHTML(){
    // 初期ページ
    let base = generateElement(this.basediv, this.basepar);
    // ボタンの配置
    {
      let array = ["right","bottom","top","left","aa","bb","xx","yy","ll","rr"];
      for(let k of array){
        this.addBtnArea(base,k);
      }
    }
    // クリックしたら閉じるボタン
    {
      let cl = ["#4040FF","#000080"];
      let par = {
        type: "div", id: "closebtn", textContent:"close",
        style: { fontSize :30+"px", textAlign: 'center',
          backgroundColor: cl[1], position: "absolute", zIndex: 20,
          right:"20px", top:"20px", width: "120px", height: "40px",
        }
      }
      let btn = generateElement(base, par);
      btn.addEventListener("click", this.closefunccode.bind(this));
      // 色切り替え
      this.setHoverChangeColor(btn,cl);
    }
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
