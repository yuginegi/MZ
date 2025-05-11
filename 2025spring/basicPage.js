class basicPage{
  constructor(base,inp){
    // BASEから引継ぎ
    this.size = base.size
    this.basediv = base.basediv
    this.closefunccode = base.closefunccode.bind(base);
    this.initResource(inp);
    this.initHTML();
  }
  // inpに応じてthis.baseparを作成する
  initResource(inp){}
  // 基本的には以下を実装する
  initHTML(){
    // 初期ページ
    let base = generateElement(this.basediv, this.basepar);
    // クリックしたら閉じる
    base.addEventListener("click", this.closefunccode.bind(this));
  }
  //=========================
  // gamepad Functions
  setcont(func){
    this.gp = new gamePad();
    setInterval(func,1000/60);
  }
  unsetcont(){
    if(this.gp){
      this.gp.endfunc();
      delete this.gp;
    }
  }
  //=========================
  // Utility Functions
  calcpar(size,mg){
    let w = size[0] - mg[0];
    let h = size[1] - mg[1];
    let l = (mg[0])/2;
    let t = (mg[1])/2;
    return [w,h,l,t];
  }
  setpar(par,arg){
    let [w,h,l,t] = arg
    console.log(w,h,l,t)
    par.style.width  = w + "px";
    par.style.height = h + "px";
    par.style.left   = l + "px";
    par.style.top    = t + "px";
  }
  preparebasepar(id,bgc,size,mg){
    this.divid = id
    let basepar = {type: "div", id: id,
      style: {position: "relative", zIndex: 20}
    };
    // サイズ
    this.setpar(basepar,this.calcpar(size,mg));
    // 背景色
    basepar.style.backgroundColor = bgc;
    return basepar
  }
  //=========================
  // HOVER Functions
  setHoverChangeColor(base,cl){
    const chcolorfunc = (e) => {
      let tar = e.currentTarget;
      tar.style.backgroundColor = (e.type == "mouseenter")? cl[0]:cl[1];
    }
    base.addEventListener("mouseenter", chcolorfunc);
    base.addEventListener("mouseleave", chcolorfunc);
  }
}

class testPage1 extends basicPage{
  initResource(inp){
    this.divid = "TCUTIN"
    // BASEのパラメータ
    this.basepar = {
      type: "div", id: this.divid,
      style: {backgroundColor: "#00FF00A0", position: "relative", zIndex: 20}
    };
    this.setpar(this.basepar,this.calcpar(this.size,[20,20]));
  } 
}
