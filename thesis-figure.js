'use strict';
(() => {
 const board=document.querySelector('.thesis-workbench');if(!board)return;
 const svg=board.querySelector('.workbench-wires'),ns='http://www.w3.org/2000/svg';
 const node=key=>board.querySelector(`[data-map-node="${key}"]`);
 function draw(){
  const base=board.getBoundingClientRect();if(!base.width)return;
  svg.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);svg.replaceChildren();
  const defs=document.createElementNS(ns,'defs');
  for(const [name,color] of [['base','#aaa08b'],['condition','#a28b52'],['adapt','#ae5a38'],['compress','#a17c2d']]){
   const marker=document.createElementNS(ns,'marker');marker.id='arrow-'+name;marker.setAttribute('viewBox','0 0 8 8');marker.setAttribute('refX','7');marker.setAttribute('refY','4');marker.setAttribute('markerWidth','6');marker.setAttribute('markerHeight','6');marker.setAttribute('orient','auto');
   const p=document.createElementNS(ns,'path');p.setAttribute('d','M1 1L7 4L1 7');p.setAttribute('fill','none');p.setAttribute('stroke',color);p.setAttribute('stroke-width','1.2');marker.append(p);defs.append(marker);
  }svg.append(defs);
  const box=k=>{const r=node(k).getBoundingClientRect();return{x:r.x-base.x,y:r.y-base.y,w:r.width,h:r.height,cx:r.x-base.x+r.width/2,cy:r.y-base.y+r.height/2}};
  const b={};for(const k of ['model','task','constraints','controller','adaptation','compression','output'])b[k]=box(k);
  function path(d,type,phase){for(const flow of [false,true]){const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('class',`workbench-wire ${type}-wire phase-${phase}${flow?' wire-flow':''}`);if(!flow)p.setAttribute('marker-end',`url(#arrow-${type})`);svg.append(p);}}
  const mobile=matchMedia('(max-width:850px)').matches,ctrl=b.controller;
  // Conditioning enters the controller separately from the pretrained model.
  for(const [k,offset]of [['task',-.22],['constraints',.22]]){const a=b[k],tx=ctrl.cx+ctrl.w*offset,ty=ctrl.y-5,sy=a.y+a.h+4,mid=sy+(ty-sy)*.48;path(`M${a.cx} ${sy}V${mid}H${tx}V${ty}`,'condition','controller');}
  const m=b.model;path(`M${m.x+m.w+4} ${m.cy}H${ctrl.x-6}`,'base','input');
  for(const k of ['adaptation','compression']){
   const a=b[k],type=k==='adaptation'?'adapt':'compress';
   if(!mobile){const sx=ctrl.x+ctrl.w+5,sy=ctrl.cy+(k==='adaptation'?-20:20),tx=a.x-6,ty=a.cy,mid=(sx+tx)/2;path(`M${sx} ${sy}H${mid}V${ty}H${tx}`,type,'specialize');const out=b.output,merge=out.x-18;path(`M${a.x+a.w+4} ${a.cy}H${merge}V${out.cy}H${out.x-6}`,type,'output');}
   else{const sx=ctrl.cx+(k==='adaptation'?-18:18),sy=ctrl.y+ctrl.h+4,ty=a.y-6,mid=sy+(ty-sy)*.52;path(`M${sx} ${sy}V${mid}H${a.cx}V${ty}`,type,'specialize');const o=b.output,tx=o.cx+(k==='adaptation'?-20:20),ty2=o.y-6,sy2=a.y+a.h+4,mid2=sy2+(ty2-sy2)*.5;path(`M${a.cx} ${sy2}V${mid2}H${tx}V${ty2}`,type,'output');}
  }
 }
 new ResizeObserver(draw).observe(board);document.fonts.ready.then(draw);window.addEventListener('load',draw);draw();
})();
