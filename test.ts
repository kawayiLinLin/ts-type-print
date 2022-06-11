type B = 2
console.log(B)

interface C {
    b?: () => void
}
console.log(C)

enum D {
    A = 2
}
console.log(D)

function f() {
    return 'x'
}


type F = typeof f
console.log(F)

type G = 'x' | 1 | symbol
console.log(G)

type H = { x: 1 };
console.log(H)


type I = { x: 1 } & { y: 2 }
console.log(I)

type J = {
    [key in keyof H]: H[key]
}
console.log(J)

type K = {
    a: '1' | '2' | '3'
    [key: string]: any
}

console.log(K)