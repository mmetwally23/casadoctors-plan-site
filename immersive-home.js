import * as THREE from './vendor/three.module.min.js';

let disposeCurrent;
window.initImmersiveHome = function () {
  disposeCurrent?.();
  const host = document.querySelector('#careCanvas');
  if (!host) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true,alpha:true}); }
  catch { host.classList.add('webgl-fallback'); return; }
  host.appendChild(renderer.domElement);
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xe9eee5,1);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(36,1,.1,150);
  scene.add(new THREE.HemisphereLight(0xffffff,0x9fae96,2.5));
  const sun=new THREE.DirectionalLight(0xfff4df,4); sun.position.set(6,12,7);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-9;sun.shadow.camera.right=9;sun.shadow.camera.top=9;sun.shadow.camera.bottom=-9;sun.shadow.bias=-.001;scene.add(sun);
  const colors={cream:0xf5f0df,mint:0xa8c9b9,teal:0x318e87,dark:0x244e50,peach:0xe2b491,white:0xfffcf4,wood:0xc7a584};
  const materials={};Object.entries(colors).forEach(([k,v])=>materials[k]=new THREE.MeshStandardMaterial({color:v,roughness:.68}));
  function box(g,x,y,z,w,h,d,c='cream',r=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),materials[c]);m.position.set(x,y,z);m.rotation.y=r;m.castShadow=m.receiveShadow=true;g.add(m);return m;}
  function cylinder(g,x,y,z,r,h,c='mint'){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,32),materials[c]);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);return m;}
  function ball(g,x,y,z,r,c='mint'){const m=new THREE.Mesh(new THREE.SphereGeometry(r,28,20),materials[c]);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;}
  function label(g,text,x,y,z,w=2,h=.65,color='#244e50',bg='#fffaf0'){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,768,256);ctx.fillStyle=color;ctx.font='bold 72px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,384,130);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas),side:THREE.DoubleSide}));mesh.position.set(x,y,z);g.add(mesh);return mesh;}
  function plant(g,x,z){cylinder(g,x,.25,z,.23,.5,'peach');cylinder(g,x,.85,z,.045,1.2,'wood');ball(g,x,1.2,z,.4);ball(g,x+.22,1.5,z,.3);}
  function room(){const g=new THREE.Group();box(g,0,-.28,0,7,.5,6,'cream');box(g,0,1.7,-2.8,7,3.5,.16,'cream');box(g,-3.4,1.7,0,.16,3.5,5.6,'cream');box(g,-1.7,2,-2.68,1.6,1.4,.08,'mint');box(g,-1.7,2,-2.58,.045,1.4,.05,'white');box(g,-1.7,2,-2.58,1.6,.045,.05,'white');plant(g,2.6,-2);return g;}
  function phone(g,x,z,confirmed=false){box(g,x,1.3,z,1.3,2.35,.18,'dark');box(g,x,1.3,z+.105,1.14,2.08,.03,'white');label(g,'CASADOCTORS',x,2.05,z+.13,1,.22);label(g,confirmed?'✓':'♡',x,1.5,z+.14,.7,.6,'#318e87');label(g,confirmed?'CONFIRMED':'NEARBY CARE',x,.95,z+.14,1,.23);box(g,x,.55,z+.13,.85,.15,.03,'teal');}
  const rooms=[];
  const first=room();box(first,0,.55,.6,2.8,1.1,1,'mint');box(first,0,1,.9,2.8,.35,.9,'mint');box(first,-1.45,.8,.6,.25,1,1,'mint');box(first,1.45,.8,.6,.25,1,1,'mint');box(first,.1,.5,-.8,2,.12,1,'wood');cylinder(first,-.7,.22,-.8,.07,.5,'wood');cylinder(first,.8,.22,-.8,.07,.5,'wood');phone(first,1.7,1.7);label(first,'CALLING…',.5,2.7,-1.7,1.9,.6);label(first,'NO AVAILABILITY',1.9,2.1,-1.5,2,.5);label(first,'TOO FAR',-.6,1.8,-1.6,1.4,.5);cylinder(first,2.2,3,-2.55,.38,.1,'peach').rotation.x=Math.PI/2;label(first,'12:45',2.2,3,-2.45,.5,.22);rooms.push(first);
  const neighborhood=new THREE.Group();box(neighborhood,0,-.28,0,8,.5,7,'cream');box(neighborhood,0,.005,0,1.1,.03,7,'white');box(neighborhood,0,.02,.2,8,.03,1,'white');for(let i=0;i<6;i++){const x=i%2?2:-2,z=Math.floor(i/2)*2-2,h=[1.8,2.5,1.5,2,1.7,2.3][i];box(neighborhood,x,h/2,z,1.4,h,1.3,i===1?'mint':'cream');box(neighborhood,x,h+.12,z,1.55,.2,1.45,'wood');for(let j=0;j<3;j++)box(neighborhood,x-.4+j*.4,h*.65,z+.67,.2,.35,.04,'dark');if(i===1){label(neighborhood,'CLINIC',x,h*.32,z+.69,1,.3);ball(neighborhood,x,h+.8,z,.3,'teal');cylinder(neighborhood,x,h+.45,z,.065,.5,'teal');}}plant(neighborhood,-3,2);plant(neighborhood,3,-2);label(neighborhood,'1.2 km',.3,2,1.4,1.7,.55);rooms.push(neighborhood);
  const clinic=room();box(clinic,.5,.7,-.8,3,1.4,.9,'wood');box(clinic,.5,1.45,-.8,3.1,.15,1,'white');box(clinic,.4,1.85,-.8,.85,.65,.1,'dark');box(clinic,.4,1.85,-.735,.72,.5,.025,'mint');box(clinic,-2,.5,1.3,1,1,.9,'mint');box(clinic,-2,1,1.5,1,.25,.6,'mint');label(clinic,'YOUR DOCTOR',.5,2.7,-2.6,2.7,.6);label(clinic,'Specialty · Location · Fee',.5,2.15,-2.59,2.7,.35);phone(clinic,2,1.3);rooms.push(clinic);
  const calendar=room();box(calendar,0,1.9,-2.5,3.8,2.4,.12,'white');label(calendar,'YOUR TIME',0,2.8,-2.4,2.7,.4);for(let i=0;i<12;i++){const x=(i%4)*.8-1.2,y=2.2-Math.floor(i/4)*.55;box(calendar,x,y,-2.35,.65,.42,.05,i===6?'teal':'mint');}label(calendar,'16:00',2,2,0,1.4,.55);phone(calendar,.2,1);box(calendar,-1.5,.5,.5,1.5,.1,1,'wood');rooms.push(calendar);
  const final=room();phone(final,0,.8,true);cylinder(final,0,.07,.8,1.3,.12,'mint');label(final,'ALL SET.',0,2.8,-2.5,2.6,.65);box(final,-2,.6,.3,1.4,1.2,.9,'mint');box(final,-2,1.1,.5,1.4,.2,.8,'mint');rooms.push(final);
  rooms.forEach((r,i)=>{r.position.x=i*18;scene.add(r);});
  let current=0,focusX=0,pointer={x:0,y:0},frame=0,dead=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function size(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
  function select(e){current=e.detail.index; if(reduced)focusX=current*18;}
  function pointerMove(e){pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;}
  const resize=new ResizeObserver(size);resize.observe(host);window.addEventListener('care-scene',select);window.addEventListener('pointermove',pointerMove,{passive:true});size();
  function animate(){if(dead)return;frame=requestAnimationFrame(animate);focusX+=(current*18-focusX)*.07;const narrow=host.clientWidth<700;camera.position.set(focusX+8+(reduced?0:pointer.x*.6),7+(reduced?0:-pointer.y*.3),narrow?12:11);camera.lookAt(focusX,1.15,narrow?0:0);renderer.render(scene,camera);}
  animate();host.classList.add('scene-ready');
  disposeCurrent=()=>{dead=true;cancelAnimationFrame(frame);resize.disconnect();window.removeEventListener('care-scene',select);window.removeEventListener('pointermove',pointerMove);scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material]){m.map?.dispose();m.dispose();}}});renderer.dispose();};
};
window.stopImmersiveHome=()=>disposeCurrent?.();
window.initImmersiveHome();
