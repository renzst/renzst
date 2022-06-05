function jumpTo(jumpDistance, pads, startPad) {
    let mod = pads === 1 ? 0 : (startPad + jumpDistance) % ((pads - 1) * 2);
    if (mod > (pads - 1)) {
        mod = mod - (mod % (pads - 1))*2;
    }
    return mod;
}
// other solutions use abs which is kinda hot, let's try it

function jumpTo2(jumpDistance, pads, startPad) {
    let mod = pads === 1 ? 0 : ((startPad + jumpDistance) % ((pads - 1) * 2));
    if (mod > (pads - 1)) {
        mod = Math.abs(mod - (pads - 1)*2);
    }
    return mod;
}

/* could also be a triangle wave function
 from wikipedia:
 4a/p * abs(((c + j - p/4) mod p) - p/2) - a

 here: with pads, jump, and startpad
 
 a = pads-1
 period = 2*(pads-1)
 j = jump
 c = startPad

 4(pads - 1) / 2(pads - 1) * abs(((c + j - 2(pads-1)/4) mod 2*(pads-1)) - pads-1
*/

function triangle(x, p, a) {
    return 4*a/p * Math.abs((((x-p/4)%p)+p)%p - p/2) - a;
}

function triangleJump(j, n, s) {
    let p = 2*(n-1);
    let a = (n-1)/2;}

let j;
let n = 3;
let s = 0;

for (let i = 0; i<8; i++) {
    j = i;
    //console.log(j, jumpTo(j,n,s), jumpTo2(j,n,s), triangleJump(j,n,s));
    console.log(triangleJump(j, n, s));

}

/* Modulo Thinking
1 pad = mod 1  0
2 pad = mod 2  0 1
3 pad = mod 4  0 1/3 2       s=1 n=3 j=2
4 pad = mod 6  0 1/5 2/4 3   s=0 j=4 4 mod 6  - 4 mod 3 = 2
5 pad = mod 8  0 1 2 3 4
6 pad = mod 10

if 1 return 1, else (pads-1)*2 = mod
*/