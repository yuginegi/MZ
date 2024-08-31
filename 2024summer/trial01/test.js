let testhtml = {};
function testhtmlinit() {
  testhtml.a = new test0();
}
function testhtmlinvoke() {
  let e = document.getElementById("WRAPTOP");
  if (e) {
    testhtml.a.endinvoke();
  } else {
    testhtml.a.invoke();
  }
}
window.onload = testhtmlinit;
