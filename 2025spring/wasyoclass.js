
class menuPage extends basicPage{
  constructor(base,inp){
    super(base,inp);
    // コントローラのセット
    this.setcont(this.updatedraw.bind(this));
  }
  delete(){
    this.unsetcont();
  }
  initResource(){
    // コントローラのアンセット
    this.delete = this.unsetcont;
    // 典型パターン
    this.basepar = this.preparebasepar("TCUTIN","#0000FF50",this.size,[20,20])
  }
  initHTML(){
    // 初期ページ
    let base = generateElement(this.basediv, this.basepar);
    // 雑なボタン配置
    {
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
      this.btnmenu[0][0].textContent = "CLOSE"
      // 初期化（大事）
      this.mtarget = [0,0];
      this.waittime = 10;
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
 
  updatedraw(){
    if(this.waittime > 0){
      this.waittime--;
      return;
    }
    // コントローラが無ければスカッと抜ける
    if(!this.gp){return}

    let wt = 6;
    let m = this.btnmenu.length;
    let n = this.btnmenu[0].length;
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