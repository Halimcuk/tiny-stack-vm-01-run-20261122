import{readFileSync,readdirSync,mkdirSync,writeFileSync}from"node:fs";
import{join}from"node:path";
const I=process.env.MAKEFUN_INPUT_DIR||"/input",O=process.env.MAKEFUN_OUTPUT_DIR||"/output";
const P=new Uint8Array(256),Q=new Uint8Array(256);
for(const o of[16,17,18,19,20,21,22,24,25,26,28,29,30,32,33,34]){P[o]=2;Q[o]=1}
P[4]=1;Q[4]=2;P[5]=2;Q[5]=2;P[6]=2;Q[6]=3;P[7]=3;Q[7]=3;
for(const o of[3,23,27,49,50,64,80,81,83])P[o]=1;
Q[23]=1;Q[27]=1;Q[64]=1;P[65]=2;Q[1]=1;Q[2]=1;Q[82]=1;
function run(g,n){
const L=g.length,d=new Int16Array(L),v=new Int32Array(L);
for(let i=0;i<L;i++){
const o=g[i];
if(o<8||(o>15&&o<35)||(o>47&&o<53)||o===64||o===65||(o>79&&o<84)){
const l=o===1?1:o===2?4:o>=48&&o<52?2:0;
if(i+1+l>L){d[i]=-2;continue}
d[i]=o;
if(l===1)v[i]=g[i+1]<<24>>24;
else if(l===4)v[i]=g[i+1]|g[i+2]<<8|g[i+3]<<16|g[i+4]<<24;
else if(l===2)v[i]=o===51?g[i+1]|g[i+2]<<8:(g[i+1]|g[i+2]<<8)<<16>>16;
}else d[i]=-1;
}
const s=new Int32Array(256),c=new Int32Array(64),m=new Int32Array(256),u=new Uint8Array(65536);
let p=0,sp=0,cp=0,ol=0,ip=0,st=0;
for(;;){
if(st>=1e6)return[10,u,ol];
if(p<0||p>=L)return[9,u,ol];
const o=d[p];
if(o===-1)return[5,u,ol];
if(o===-2)return[9,u,ol];
st++;const q=p;p+=1+(o===1?1:o===2?4:o>=48&&o<52?2:0);
if(sp<P[o])return[2,u,ol];
if(sp-P[o]+Q[o]>256)return[3,u,ol];
switch(o){
case 0:return[0,u,ol];
case 1:case 2:s[sp++]=v[q];break;
case 3:sp--;break;
case 4:s[sp]=s[sp-1];sp++;break;
case 5:{const t=s[sp-1];s[sp-1]=s[sp-2];s[sp-2]=t;break}
case 6:s[sp]=s[sp-2];sp++;break;
case 7:{const t=s[sp-3];s[sp-3]=s[sp-2];s[sp-2]=s[sp-1];s[sp-1]=t;break}
case 16:{const b=s[--sp];s[sp-1]+=b;break}
case 17:{const b=s[--sp];s[sp-1]-=b;break}
case 18:{const b=s[--sp];s[sp-1]=Math.imul(s[sp-1],b);break}
case 19:{const b=s[--sp];if(!b)return[4,u,ol];s[sp-1]=(s[sp-1]/b)|0;break}
case 20:{const b=s[--sp];if(!b)return[4,u,ol];s[sp-1]=s[sp-1]%b;break}
case 21:{const b=s[--sp];if(!b)return[4,u,ol];s[sp-1]=((s[sp-1]>>>0)/(b>>>0))|0;break}
case 22:{const b=s[--sp];if(!b)return[4,u,ol];s[sp-1]=((s[sp-1]>>>0)%(b>>>0))|0;break}
case 23:s[sp-1]=-s[sp-1];break;
case 24:{const b=s[--sp];s[sp-1]&=b;break}
case 25:{const b=s[--sp];s[sp-1]|=b;break}
case 26:{const b=s[--sp];s[sp-1]^=b;break}
case 27:s[sp-1]=~s[sp-1];break;
case 28:{const b=s[--sp];s[sp-1]<<=b;break}
case 29:{const b=s[--sp];s[sp-1]>>=b;break}
case 30:{const b=s[--sp];s[sp-1]=s[sp-1]>>>b;break}
case 32:{const b=s[--sp];s[sp-1]=s[sp-1]===b?1:0;break}
case 33:{const b=s[--sp];s[sp-1]=s[sp-1]<b?1:0;break}
case 34:{const b=s[--sp];s[sp-1]=(s[sp-1]>>>0)<(b>>>0)?1:0;break}
case 48:p+=v[q];break;
case 49:if(s[--sp]===0)p+=v[q];break;
case 50:if(s[--sp]!==0)p+=v[q];break;
case 51:if(cp>=64)return[7,u,ol];c[cp++]=p;p=v[q];break;
case 52:if(!cp)return[8,u,ol];p=c[--cp];break;
case 64:{const a=s[sp-1];if(a<0||a>255)return[6,u,ol];s[sp-1]=m[a];break}
case 65:{const a=s[sp-1],x=s[sp-2];if(a<0||a>255)return[6,u,ol];m[a]=x;sp-=2;break}
case 80:{
const x=s[sp-1];let a=x<0?-x:x;
const n=a<10?1:a<100?2:a<1e3?3:a<1e4?4:a<1e5?5:a<1e6?6:a<1e7?7:a<1e8?8:a<1e9?9:10;
const l=n+(x<0?1:0);
if(ol+l>65536)return[11,u,ol];
let j=ol+l;
if(!a)u[--j]=48;else while(a>0){u[--j]=48+a%10;a=(a/10)|0}
if(x<0)u[ol]=45;
ol+=l;sp--;break}
case 81:if(ol>=65536)return[11,u,ol];u[ol++]=s[--sp]&255;break;
case 82:s[sp++]=ip<n.length?n[ip++]:-1;break;
case 83:return[s[--sp]&255,u,ol];
}
}
}
for(const id of readdirSync(I).sort()){
const r=run(readFileSync(join(I,id,"program.bin")),readFileSync(join(I,id,"input.bin")));
mkdirSync(join(O,id),{recursive:true});
writeFileSync(join(O,id,"stdout.bin"),r[1].subarray(0,r[2]));
writeFileSync(join(O,id,"exit.txt"),r[0]+"\n");
}
