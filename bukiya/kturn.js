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

function setClass2kturn(par){
  /* NOP */
}

(() => {
  'use strict';

class kturnclass{
  constructor(){
    setClass2kturn = this.setclass.bind(this);
  }
  // 開発とやり取りするための特別処理
  setclass(par){
    console.log("setClass2kturn.");
    this.par = par;
    return this;
  }
  // 初期化
  init(){
    console.log("init invoke.");
    let par = this.par;
    this.retVal = par.ids[0];
    this.skilldata = par.chardata.skilldata; // スキルデータ（参照専用）
    this.cdb = par.cdb; // キャラDB：setStatusHP、setAttackData
    this.kmapdata = par.kmapdata; // マップデータ
    this.kjyodata = par.kjyodata; // 城データ
  }
  seisan(tar){
    console.log("seisan invoke.");
    let s = tar.psts; // リファレンス：短くしただけ
    console.log("gin",s[2],"農業",s[4],"商業",s[5]);
    // 加算
    s[8] += s[4];
    s[2] += s[5];
    // 表示
    let gtxt = "銀："+s[2];
    let gtxt2 = "(＋"+s[5]+")";
    let ktxt = "糧："+s[8];
    let ktxt2 = "(＋"+s[4]+")";
    // 出力用の箱に入れる
    $gameVariables.setValue(21, gtxt); // 銀のテキスト
    $gameVariables.setValue(22, gtxt2); // 銀のテキスト
    $gameVariables.setValue(23, ktxt); // 糧のテキスト
    $gameVariables.setValue(24, ktxt2); // 糧のテキスト
  }
  // 結果表示
  turnrepo(){
    let t = this.kjyodata.loadturn();
    let turn = t - 1; // すでに加算しているため
    console.log("turnrepo:",this.retVal)
    //初期化
    $gameVariables.setValue(this.retVal, 0);
    //表示
    let charlist = Object.keys(this.atklogs).map((x)=>{return Number(x)});
    if(charlist.length > 0){
      this.initCanvas(turn,charlist);
    }else{
      $gameVariables.setValue(this.retVal, turn);
    }
  }
  initCanvas(turn,charlist){
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
    this.drawdiv(div,"\\C[1]戦闘結果："+turn+"ターン",20,10,300,300)
    // 勇者・商人一覧
    for(let i of charlist){
      let n = 10;
      let par = [10+60*(i%n),60+75*Math.floor(i/n),i];
      let e = new charaImg(this.cdb, par);
      let tar = e.can;
      set3func(tar,this,this.cfunc2);
      div.append(tar);
    }
    let charid = charlist[0];
    // 結果領域
    {
      let [x,y,w,h] = [20,140,340,380] // 左寄せなら x=20 
      let rdiv = generateElement(div, {type:"div",id:"turndiv",
        style:{position:"absolute",backgroundColor:"#004",padding:"10px",
        left:x+'px',top:y+'px',width:w+'px',height:h+'px'}});
      this.restarealist = [];
      for(let i=0;i<9;i++){
        let timg = this.par.geneStrImg("cres"+i,"あああ");
        rdiv.appendChild(timg);
        this.restarealist.push(timg);
        generateElement(rdiv, {type:"br"});
      }
      this.updatetxtarea(charid);
    }
    // キャラ表示
    {
      let [x,y,w,h] = [400,140,400,400] // 左寄せなら x=20 
      let pdiv = generateElement(div, {type:"div",id:"turndiv",
        style:{position:"absolute",
        left:x+'px',top:y+'px',width:w+'px',height:h+'px'}});
      let imgsrc = 'img/pictures/'+this.cdb.getPict(charid)+'.png';
      let pic = this.par.geneTagImg("turnchara",imgsrc);
      pic.classList.add("CharaShadow");
      pdiv.appendChild(pic);
      this.imggg = pic;
      // キャラ名
      this.ecan = new animationText([60,360,0]);//左寄せなら x=40 
      let e = this.ecan;
      e.txtlist = null;
      e.id = "turnctxt";
      pdiv.append(e.can);
      this.ecan.resettext([this.cdb.getName(charid)]);
    }
  }
  updatetxtarea(id){
    let ah = this.atklogs[id];
    let gekiha = ah.gekiha;
    let [ad,pd,pw] = [ah["atk"],ah["dmg"],ah["lhp"]]
    let bt0 = ah["area"]+"　での戦い";//ah["area"]+"で"+ah["enm"]+"と交戦中";
    let bt1 = ah["enm"]+"　と交戦中";;//ah["area"]+"で"+ah["enm"]+"と交戦中";
    let at = this.cdb.getName(id) + "　の攻撃！！";
    let gt = (gekiha)? "\\C[3]"+ah["enm"]+"を倒した！":"　"; //"\\C[3]倒した　\\C[2]倒された"
    let ht = {
      "cres0":bt0,"cres1":bt1,"cres2":at,
      "cres3":"与ダメージ： "+ad,"cres4":"被ダメージ： "+pd,"cres5":"残兵力　　： "+pw,
      "cres6":"　","cres7":"　","cres8":gt,
    };
    for(let k in ht){
      this.par.updateStrImg(k,ht[k]);
    }   
  }
  drawdiv(base,txt,x,y,w,h){
    let btndiv = generateElement(base, {type:"div",style:
    {position:"absolute",left:x+"px",top:y+"px",width:w+"px",height:h+"px"}
    });
    let timg = this.par.geneStrImg(null,txt); //78x36
    btndiv.appendChild(timg);
  }
  cfunc(event){
    $gameVariables.setValue(this.retVal, this.turn);
    document.getElementById("turnrepo").remove();
  }
  cfunc2(event){
    let type = event.type;
    //console.log(type,event.target.id);
    if(type=="click"){return;}
    if(type=="mouseover"){
      let num = event.target.id.match(/\d+/g)[0];
      this.imggg.src = 'img/pictures/'+this.cdb.getPict(num)+'.png';
      this.imggg.classList.add("fadeIn");
      this.ecan.resettext([this.cdb.getName(num)]);
      audioInvoke("Book1");
      this.updatetxtarea(num);
    }else{
      this.imggg.classList.remove("fadeIn");
    }
  }

  //　ターン終了
  turnend(){
    this.turn = this.kjyodata.loadturn();
    console.log("turn end.",this.turn);
    // 戦闘処理
    this.turnAttackFunc();
    // seisan で 計算して、saveturn で SAVE する
    this.seisan(this.kjyodata);
    // ターン経過　this.turn++;
    this.kjyodata.saveturn( this.turn+1 );
    // メッセージ用に、ターン数を返す
    $gameVariables.setValue(this.retVal, this.turn);
  }
  // kmapdata で挟む
  turnAttackFunc(){
    //this.kmapdata.loadValue();
    let gekiha={};
    this.atklogs = {};
    let [ah,aa] = this.cdb.getAttackAll();//有効なものがあるか調べるため
    for(let i in aa){
      let atklog ={}
      let [a,h] = [aa[i],ah[i]];
      console.log("ACTION "+i+":",a,h);
      if(!(a&&h)){
        console.log("ACTION SKIP");
        continue;
      }

      //敵の能力を得る
      [atklog["area"],atklog["enm"],] = this.kmapdata.getEneInfo(a,h);
      // 味方の攻撃力を得る
      [atklog["atk"]] = this.turnendAtk(i,a,h,gekiha);
      // 被ダメ(勇者がダメージを受ける)
      [atklog["dmg"],atklog["lhp"]] = this.turnendDef(i,a,h,aa,ah);

      this.atklogs[i] = atklog;
    } //===  for(let i in aa) ===
    for(let kk in gekiha){
      console.log("gekiha:",kk,gekiha[kk]);
      for(let i in aa){
        if(gekiha[kk][0]==aa[i] && gekiha[kk][1]==ah[i]){
          console.log(i,"setAttackData Reset")
          this.cdb.setAttackData(i,null,null); // 更新
          this.atklogs[i].gekiha = true;
        }
      }
    }
    //this.kmapdata.saveValue();
  }
  // 味方の攻撃力を得る計算
  turnendAtk(i,a,h,gekiha){
    //敵の能力を得る
    let est = this.kmapdata.getEneStatus(a,h);
    let s0 = this.cdb.getStatus(i);
    let s1 = this.getSkillExt(i);
    //DBG//console.log("st:",s0,s1);
    let pb = this.getSkillWep(i);
    let pbase = 1 + 0.1*pb[0]; // 武器効果
    //DBG//console.log(pb,pbase);
    let wp = this.getWP(est.type);
    // ダメージ計算
    let pw=0;
    for(let i=0;i<3;i++){
      let pp = wp[i]*(s0[i]+s1[i])*(s0[i]+s1[i]);
      //DBG//console.log(i,"pw:"+pp);
      pw += pp;
    }
    // 実際の攻撃力（与ダメ）
    let atk = Math.floor(pw*pbase);
    // 敵ＨＰ計算
    let nhp = est.hp - atk;//atklog["atk"];
    //DBG//console.log("HP:",est.hp,nhp);
    this.kmapdata.setEneStatus(a,h,"hp",(nhp>0)?nhp:0);
    if(nhp <= 0){
      nhp = 0;
      let key = a+"_"+h;
      gekiha[key] = [a,h];
    }
    return [atk];
  }
  // 味方の被ダメの計算
  turnendDef(i,a,h,aa,ah){
    //敵の能力を得る
    let est = this.kmapdata.getEneStatus(a,h);
    let partyNums = 0;
    for(let ii in aa){
      let [ai,hi] = [aa[ii],ah[ii]];
      if(ai==a&&hi==h){partyNums++;}
    }
    let pn = rangeValue(partyNums,1,3,1,3); // 1or2or3
    let c1 = this.cdb.getStatusHP(i);
    let pb = this.getSkillWep(i);
    let pbase = 1 + 0.1*pb[1]; // 防具効果
    //DBG//console.log(est.atk,c1,partyNums,pn);
    let dmg = Math.floor((est.atk/pn)/pbase);
    let dhp = c1-dmg;
    this.cdb.setStatusHP(i,dhp); // 更新
    return [dmg,dhp]
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
    let ulist = this.skilldata.getulist(id);
    let ret = [0,0,0];
    for(let j=0;j<3;j++){
    for(let i=10*j;i<10*(j+1);i++){
      ret[j] += ulist[i];
    }}
    return ret;
  }
  // スキルで増えた能力を得る
  getSkillWep(id){
    return this.skilldata.weaponlv[id];
  }
}

console.log("kturn.js loaded.");
const kturn = new kturnclass();
})();
