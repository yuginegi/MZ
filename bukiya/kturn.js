//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンド
 * @author wasyo
 *
 * @help kturn.js
 *
 * 商人の最終章コマンド。ターン処理
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/
//=============================================================================
// RPG Maker MZ - テストなのです
//=============================================================================
// Sorry, Only Japanese

/*:
 * @target MZ
 * @plugindesc 玉座コマンド ターン処理
 * @author wasyo
 *
 * @help kturn.js
 *
 * 商人の最終章コマンド。開発など
 * 
 */

/* 相変わらずですけど、くそコードになってますm(__)m リファクタリング（ＴへＴ）*/

class kturn{
  constructor(par){
    this.par = par;
    this.cdb = par.cdb; // キャラDB
    this.kmapdata = par.kmapdata; // マップデータ
    this.turn = 0;//読み込み必要
  }
  // 結果表示
  turnrepo(){
    //初期化
    $gameVariables.setValue(this.par.ids[0], 0);
    //表示
    this.initCanvas();
  }
  initCanvas(){
    //let [gcw,gch] = [window.innerWidth,window.innerHeight];
    let gwnd = document.getElementById("gameCanvas");
    //gwnd = window;
    let [gcw,gch] = [gwnd.width,gwnd.height];
    console.log([gcw,gch]);
    let [pad,mgn] = [10,30];
    let [x,y,w,h] = [mgn-pad,mgn-pad,gcw-2*(pad+mgn),gch-2*(pad+mgn)];
    // use generateElement, 13 lines => 5 lines.
    let par = {type:"div",id:"turnrepo",style:{
      position:"relative",display:"display",backgroundColor:"#000",color:"#FFF",
      left:x+'px',top:y+'px',width:w+'px',height:h+'px',zIndex:10,padding:pad+'px',
    }};
    let div = generateElement(document.body, par);
    let btndiv = generateElement(div, {type:"div",style:
    {backgroundColor:"#00F",position:"absolute",left:(w-110)+"px",top:"5px",width:"78px",height:"36px",padding:"5px 20px"}
    });
    let timg = this.par.geneStrImg("btnX","閉じる"); //78x36
    btndiv.appendChild(timg);
    btndiv.onclick = this.cfunc.bind(this);
    this.drawdiv(div,"\\C[1]ここに結果を出す",20,100,300,300)
  }
  drawdiv(base,txt,x,y,w,h){
    let btndiv = generateElement(base, {type:"div",style:
    {position:"absolute",left:x+"px",top:y+"px",width:w+"px",height:h+"px"}
    });
    let timg = this.par.geneStrImg(null,txt); //78x36
    btndiv.appendChild(timg);
  }
  cfunc(){
    $gameVariables.setValue(this.par.ids[0], this.turn);
    //let e = document.getElementById("turnrepo");
    //e.remove();
    document.getElementById("turnrepo").remove();
  }
  //　ターン終了
  turnend(){
    let cdb = this.cdb;
    console.log("turn end.");
    let gekiha={};
    for(let i in cdb.attackarea){
      let [a,h] = [cdb.attackarea[i],cdb.attackhash[i]];
      console.log("ACTION "+i+":",a,h);
      let e = this.kmapdata.getenelist(a);
      console.log(a,h,e,e[h]);
      let [area,enm,eimg,etype,epow] = this.kmapdata.getEneInfo(a,h);
      console.log(area,enm,eimg,etype,epow);

      // 味方の攻撃力を得る
      let s0 = this.cdb.getStatus(i);
      let s1 = this.getSkillExt(i);
      console.log("st:",s0,s1);
      let pb = this.getSkillWep(i);
      let pbase = 1 + 0.1*pb[0];
      console.log(pb,pbase);
      //敵の能力を得る
      let est = this.kmapdata.getEneStatus(a,h);
      console.log(est);
      let wp = this.getWP(est.type);
      // ダメージ計算
      let pw=0;
      for(let i=0;i<3;i++){
        let pp = wp[i]*(s0[i]+s1[i]);
        console.log(i,"pw:"+pp);
        pw += pp;
      }
      // 敵ＨＰ計算
      let nhp = est.hp - Math.floor(pw*pbase);
      console.log("HP:",est.hp,nhp);
      this.kmapdata.setEneStatus(a,h,"hp",(nhp>0)?nhp:0);
      if(nhp <= 0){
        nhp = 0;
        let key = a+"_"+h;
        gekiha[key] = [a,h];
      }
    }
    for(let kk in gekiha){
      console.log("gekiha:",kk,gekiha[kk]);
    }
    this.turn++;
    $gameVariables.setValue(this.par.ids[0], this.turn);
  }
  // アタック表
  getWP(key){
    let [n,w,r] = [1.0,1.2,0.8]; // 通常、弱点、抵抗
    let hh ={ // 力には技！ 技には魔法！ 魔法には力だ！ → 武相手に魅力が効く
      "武":[n,r,w], // 武相手に魅力が効く
      "知":[w,n,r], // 知相手に武力が効く
      "魅":[r,w,n], // 魅相手に知力が効く
    };
    return hh[key];
  }
  // スキルで増えた能力を得る
  getSkillExt(id){
    let ulist = this.par.chardata.skilldata.getulist(id);
    let ret = [0,0,0];
    for(let j=0;j<3;j++){
    for(let i=10*j;i<10*(j+1);i++){
      ret[j] += ulist[i];
    }}
    return ret;
  }
  // スキルで増えた能力を得る
  getSkillWep(id){
    return this.par.chardata.skilldata.weaponlv[id];
  }
  getSkillWep_old(id){
    let ulist = this.par.chardata.skilldata.getulist(id);
    let ret = [0,0];
    for(let j=0;j<2;j++){
      let st = 30+5*j;
    for(let i=st;i<st+5;i++){
      ret[j] += ulist[i];
    }}
    return ret;
  }
}



//=====================================================================
