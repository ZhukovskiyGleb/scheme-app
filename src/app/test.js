function S() {
  return S.prototype.instance;
}
S.prototype.instance = new S();

var a1 = new S();
var a2 = new S();

console.log(a1 === a2);
console.log(a1 instanceof S);
console.log(a2 instanceof S);
