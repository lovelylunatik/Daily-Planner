function e(){return new Date().toISOString().split(`T`)[0]}function t(t){return t&&t!==e()}function n(e){return new Date(e+`T00:00:00`).toLocaleDateString(`en-US`,{weekday:`long`,month:`long`,day:`numeric`})}function r(e){let t=Object.keys(e).sort();if(t.length===0)return;let n=Object.values(e).reduce((e,t)=>e+t.content.trim().split(/\s+/).filter(Boolean).length,0),r=e=>new Date(e+`T00:00:00`).toLocaleDateString(`en-US`,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`}),i=r(t[0]),a=r(t[t.length-1]),o=``;o+=`╔══════════════════════════════════════════════════════════════╗
`,o+=`║                                                              ║
`,o+=`║          T H E   G R I M O I R E                             ║
`,o+=`║                                                              ║
`,o+=`║     A journal of stars, seasons & whispered things           ║
`,o+=`║                                                              ║
`,o+=`║     ${i}`.padEnd(63,` `)+`║
`,o+=`║     through ${a}`.padEnd(63,` `)+`║
`,o+=`║                                                              ║
`,o+=`╚══════════════════════════════════════════════════════════════╝
`,o+=`

`;for(let n of t){let t=e[n],r=new Date(n+`T00:00:00`),i=r.toLocaleDateString(`en-US`,{weekday:`long`}),a=r.toLocaleDateString(`en-US`,{month:`long`}),s=r.getDate(),c=r.getFullYear();o+=`═══ ${i}, ${a} ${s}, ${c} ═══\n\n`,o+=t.content.trim(),o+=`


`}o+=`═══════════════════════════════════════════════════════════════
`,o+=`   ✦  ${t.length} entr${t.length===1?`y`:`ies`} · ${n.toLocaleString()} word${n===1?``:`s`}  ✦\n`,o+=`═══════════════════════════════════════════════════════════════
`;let s=new Blob([o],{type:`text/plain;charset=utf-8`}),c=URL.createObjectURL(s),l=document.createElement(`a`);l.href=c,l.download=`the-grimoire-${t[t.length-1]}.txt`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(c)}export{e as i,n,t as r,r as t};