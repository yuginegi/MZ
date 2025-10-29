window.onload = ()=>{
  console.log("hello");
  init();
  mainfunc();
}
let wazalist = [];
let wazalevellist = [];
// 名前, 隊列, タイプ(攻撃１、防御２、回復３、パッシブ４), 値 
let skilllist = [
  ["なし",0,1,1],
  ["攻撃",1,1,10],
  ["防御",3,2,5],
  ["魔法A",3,1,10],
  ["魔法B",3,1,5],
  ["クラッシュ",1,1,20],
]
function init(){
  console.log(lv)
  wazalevellist[0] = [[0,1],[3,5]] // LV3で５を獲得
  wazalevellist[1] = [[0,1],[0,2]]
  wazalevellist[2] = [[0,3],[0,4]]
  wazalevellist[3] = [[0,1],[0,2],[0,4]]
  /*wazalist = [
    [1],[1,2],[3,4],[1,2,4]
  ];*/
  for(let i=0;i<4;i++){
    setwazalist(i)
  }
  //console.log(wazalist)
}
function setwazalist(i){
  let list = wazalevellist[i];
  wazalist[i] = [];
  for(let cc of list){
    if(cc[0] <= lv[i]){
      wazalist[i].push(cc[1])
    }
  }
  wazaset(i)
}

function dataset(id,txt){
  if(document.getElementById(id)==null){
    console.log(id+" is null ?")
  }
  document.getElementById(id).textContent = txt;
}

//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
let pospos = [0,0,0,0];
function setpos(id,type){
  let pos = ["不明","前衛","後衛","飛行","待機"]
  let n = pos.length;
  let t = (n+type)%n
  dataset("pp"+(id+1),pos[t]);
  pospos[id] = t;
}
function getpos(id){
  return pospos[id]
}
function changepos(id,type){
  if(id<0){id = chartarget;}
  setpos(id,type);
  // 前衛を選ぶ場合
  if(type == 1){
    for(let i=0;i<pospos.length;i++){
      if(i!=id && pospos[i]==1){// 前衛の場合、判定
        console.log("前衛は１人だけ",i)
        setpos(i,2);// 後衛にする
      }
    }
  }
  haiti();
}
function haiti(){
  let zenei = false;
  // 前衛は一人だけ（ほかの人は後衛に）
  for(let i=0;i<pospos.length;i++){
    if(pospos[i]==1){// 前衛の場合、判定
      if(zenei){
        console.log("前衛は１人だけ",i)
        setpos(i,2);// 後衛にする
      }else{
        zenei = true;
      }
    }
  }
  // 前衛がいない場合、全員後衛は不可能
  if(!zenei){
    console.log("誰かは前衛にする")
    for(let i=0;i<pospos.length;i++){
      if(pospos[i]==2){
        setpos(i,1);
        break;
      }
    }
  }
  console.log(pospos);
}
let chartarget = 0;
function poslist(){
  for(let i　of [1,2,3,4]){
    let e = document.getElementById("pos"+(i))
    e.addEventListener("click",changepos.bind(this,-1,i))
  }
}
function lvuplist(){
  for(let i　of [1,2,3,4]){
    let e = document.getElementById("lvup"+(i))
    e.addEventListener("click",levelup.bind(this,i))
  }
}

function posview(){
  //document.getElementById("ctar").textContent = chartarget
  document.getElementById("ctar").textContent = document.getElementById("pt"+(chartarget+1)).textContent 
}
function changetar(id){
  chartarget = id;
  posview();
  setLVUPNEED();
}
function targetclickset(i){
  let e = document.getElementById("pt"+(i+1))
  e.addEventListener("click", changetar.bind(this,i))
}

//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

let material = [10,20,30,40]
function getres(){
  for(let i=0;i<4;i++){
    let pos = getpos(i);
    if(pos==4){
      material[i]+=10;
    }
  }
  materialView();
}
function materialView(){
  let txt = ["赤","黄","緑","青"]
  for(let i=0;i<4;i++){
    let e = document.getElementById("lvup"+(i+1))
    e.textContent = txt[i]+":"+material[i]
  }
}
function setLVUPNEED(){
  let i = chartarget;
  document.getElementById("lvupneed").textContent = lv[i]*100
}

let lvmax = [1,1,1,1]
let lv = [1,1,1,1]
let hp = [100,120,80,90]
function statset(id){
  dataset("ch"+(id+1),"LV="+lv[id]+"/"+lvmax[id]+" HP="+hp[id])
}
function damageC(pid,dam){
  let p = document.getElementById("pt"+(pid+1)).textContent
  hp[pid] -= dam;
  if(hp[pid] <= 0){
    setpos(pid,4);
    haiti();
  }
  console.log(p,dam);
  statset(pid)
}
function levelmaxup(){
  //console.log("levelmaxup")
  for(let i=0;i<4;i++){
    let pos = getpos(i);
    if(pos==1||pos==2||pos==3){
      lvmax[i]++;
      statset(i);
    }
  }
  //console.log("levelmaxup",lvmax)
}
function levelup(tp0){ // tp は 赤・黄・緑・青 の意味
  let tp = tp0-1
  let i = chartarget;
  if(lv[i] < lvmax[i])
  {
    let pos = getpos(i);
    if(pos > 0){ // ポジション制約、今は無し
      console.log(i, tp, material[tp], lv[i]*100)
      if(material[tp] >= lv[i]*100){
        material[tp] -= lv[i]*100
        materialView();
        lv[i]++;
        console.log("Level UP", i, lv[i])
        setLVUPNEED();
        setwazalist(i)
        statset(i);
      }
    }
  }
}
function setBattle(){
  let e = document.getElementById("battle");
  e.addEventListener("click", doBattle.bind(this));
}
function enemyAdd(){
  let e = document.getElementById("enadd");
  e.addEventListener("click", ()=>{
    console.log("hello")
    enemy = [100,10,0]
    enemyView();
  });
}
function partyHeal(){
  let e = document.getElementById("cheal");
  e.addEventListener("click", ()=>{
    console.log("cheal")
    hp = [100,120,80,90]
    for(let i=0;i<4;i++){
      statset(i);
    }
  });
}
function getMaterialButton(){
  let e = document.getElementById("getres");
  e.addEventListener("click", getres);
}

function partyAttack(){
  console.log("＞＞＞味方の攻撃");
  let dam = 0;
  for(i=0;i<4;i++){
    // 隊列判定
    let pos = getpos(i);
    if(pos==4||pos==0){
      let p = document.getElementById("pt"+(i+1)).textContent
      console.log(p+"は、何もしない（待機中）")
      continue;
    }
    // セットされているわざ
    let wtar = wazasetlist[i];
    let waza = getwaza(i,wtar)
    // 隊列で行動可能か
    if((pos&waza[1]) > 0){
      let p = document.getElementById("pt"+(i+1)).textContent
      let w = waza
      if(w[2]==1){
        console.log(p+"の"+w[0]+"！！"+w[3]+"ダメージ");
        dam += w[3]
      }
      else if(w[2]==2){
        console.log(p+"は、"+w[0]+"（"+w[3]+"の防御力）");
      }
    }else{
      let p = document.getElementById("pt"+(i+1)).textContent
      console.log(p+"は、何もしない（隊列と行動が合わない）")
    }
  }
  enemy[0] = enemy[0] - dam;
  if(enemy[0]<=0){
    levelmaxup();
  }
  enemyView();
}

let enemy = [100,10,0];
function enemyAttack(){
  console.log("＞＞＞敵の攻撃");
  // 敵が普通の攻撃だったら
  // 前衛を探す
  let pid = pospos.indexOf(1);
  //console.log("pospos",pospos,pospos.indexOf(1),wazasetlist);
  // 相手の守備。何の技？
  let waza = getwaza(pid,wazasetlist[pid]);
  //console.log(waza)
  let def = 0;
  if(waza[2]==2){
    def += waza[3];
  }
  //　ダメージ計算
  let atk = enemy[1];
  let dam = atk - def;
  dam = (dam > 0)? dam : 0;
  damageC(pid,dam)
}
function enemyView(){
  let txt = "NONE";
  if(enemy[0] > 0){
    txt = "HP:"+enemy[0]+"　ATK:"+enemy[1]+"　DEF:"+enemy[2];
  }
  let e = document.getElementById("en1");
  e.textContent = txt;
}

function doBattle(){
  console.log("＝＝＝＜doBattle＞＝＝＝＝＝＝＝");
  if(!(enemy[0]>0)){
    console.log("敵はいない");
    return;
  }
  partyAttack();
  if(!(enemy[0]>0)){
    console.log("敵はいない");
    return;
  }
  enemyAttack();
}

//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

let wazasetlist = [-1,-1,-1,-1];
function wazaset(id){
  let l = document.getElementById("wlist"+(id+1));
  l.innerHTML = "";
  let i = 0;
  for(let cc of wazalist[id]){
  //console.log("wazaset",id,wazalist[id])
    let e = document.createElement("v");
    let waza = skilllist[cc]
    e.textContent = "　["+waza[0]+"]　";
    l.appendChild(e);
    // クリックイベント。「i」にバインド。大事。
    e.addEventListener("click",wazaselect.bind(this,id,i))
    i++;
  }
}
function wazaselect(ii,id){
  if(id < 0){id = wazasetlist[ii]}
  if(id < 0){id = 0;}
  // 隊列判定
  let pos = getpos(ii);
  // 技をゲット
  let sk = getwaza(ii,id);
  // 設定可能？
  console.log(pos,sk)
  if(pos&sk[1]){
    console.log("設定可能")
  }else{
    console.log("設定不可")
  }

  dataset("chw"+(ii+1),sk[0]);
  wazasetlist[ii]=id;
}
function getwaza(ii,id){
  return skilllist[wazalist[ii][id]];
}

//＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

function mainfunc(){
  enemyView();
  // 隊列選択
  poslist();
  // LVUP選択
  lvuplist();
  materialView();
  for(let i=0;i<4;i++){
    // ステ埋める（名前・HP）
    statset(i)
    // 隊列を選ぶ（初期値で前衛）
    setpos(i,1)
    // targetclickset
    targetclickset(i);
    // わざリスト埋める
    wazaset(i)
  }
  // 配置を決める
  haiti();
  // 隊列選択の初期値
  //posview();
  changetar(0);
  // 前衛を変える
  changepos(3,1);
  // 待機に変える
  changepos(3,4);
  // 技を決める
  for(let i=0;i<4;i++){
    wazaselect(i,0);
  }
  //=== 初期値変更
  {
    // 前衛を変える
    changepos(1,1);
    // 技を選ぶ
    wazaselect(1,1);
  }

  // 戦闘ボタン
  setBattle();
  // 追加ボタン
  enemyAdd();
  partyHeal();
  getMaterialButton();
}
