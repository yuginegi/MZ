//console.log(getDevice())
//var isSp = getDevice()=="sp";
//var isSp = false;

var tarctx;
var effects = {};

var main = function () {
console.log("main start")
// /var _app = document.getElementById("app");
var canvas = document.getElementById("canvas");
var width  = canvas.width;
var height = canvas.height;

var scene = new THREE.Scene();
// new THREE.PerspectiveCamera(視野角, アスペクト比, near, far)
var fov    = 30;
var aspect = width / height;
var near   = 1;
var far    = 1000;

// カメラは必要 → renderで使う。
var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
var target = new THREE.Vector3(0, 0, 0); // X,Y,Z 
camera.position.set( 0, 2, 40 );
camera.lookAt(target);

// レンダリング。描画するの意味
var renderer = new THREE.WebGLRenderer({canvas: canvas, preserveDrawingBuffer: true});
renderer.setSize( width, height );

const loadfunk = () => {console.log("loadad")}

//effekseer.init(renderer.context);
console.log("invoke context")

let xxx = effekseer.createContext();
xxx.init(renderer.getContext());

//tarctx = xxx;

//effects["Sample"] = effekseer.loadEffect("Res/Sample.efkefc",1,loadfunk,loadfunk);
effects["Laser02"] = xxx.loadEffect("Resource_/Laser01.efk");
effects["Watter02"] = xxx.loadEffect("effects/WaterAll2.efkefc");

( function renderLoop (tar) {
  // ループで描画
  requestAnimationFrame( renderLoop.bind(null, tar) );

  //let tar = tarctx; // effekseer
  // これが大事（これをスキップすると止められる）
  tar.update();

  renderer.render( scene, camera );
  tar.setProjectionMatrix(camera.projectionMatrix.elements);
  tar.setCameraMatrix(camera.matrixWorldInverse.elements);
  tar.draw();

} )(xxx);

console.log("main end")

//console.log(tarctx , effekseer);
tarctx = xxx
};

var mainCore = function () {
  console.log("mainCore invoke");
  const effekseerWasmUrl = "js/libs/effekseer.wasm";
  effekseer.initRuntime(effekseerWasmUrl, main, false)
}
window.addEventListener( 'DOMContentLoaded', mainCore, false );

function playEffect(effect) {
	if (!tarctx || !effects[effect])
	{
		console.log("playEffect Failed")
		return
	}
	//stopAll();
	console.log("playEffect invoke")
	tarctx.play(effects[effect], 0, 0, 0);
}
function stopAll() {}
function togglePause (){}
function toggleRotate (){}
function capture () {}
  
var canvas = document.getElementById('canvas');
var container = document.getElementById('app');
sizing();
function sizing() {
	canvas.height = container.offsetHeight;
	canvas.width = container.offsetWidth;
}
