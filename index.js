console.log("2");
console.log("{\n\tb?: () => void;\n}");
var D;
(function (D) {
    D[D["A"] = 2] = "A";
})(D || (D = {}));
console.log("D");
function f() {
    return 'x';
}
console.log("{}");
console.log("symbol | \"x\" | 1");
console.log("{\n\tx: 1;\n}");
console.log("{ x: 1; } & { y: 2; }");
console.log("{\n\tx: 1;\n}");
console.log("{\n\ta: \"1\" | \"2\" | \"3\";\n}");
