// Original pre-rendered CasaDoctors 3D artwork with interactive scene transitions.
// These are rendered illustrations, rather than rotatable meshes.
let disposeCurrent;
const sourceCache=new Map();
const copy={ar:[['مكالمات كتير. ولسه بتدوّر.','المكان والميعاد، مش دايمًا مناسبين.'],['اختيارات أقرب ليك.','قارن المكان والمواعيد المتاحة.'],['التفاصيل قبل القرار.','التخصص · المكان · سعر الكشف'],['اختار اللي يناسب يومك.','اليوم والساعة قدّامك.'],['خطوتك الجاية واضحة.','راجع التفاصيل، ووصل للمساعدة.']],en:[['Still calling around?','Location and time can be hard to match.'],['Closer options.','Compare location and available times.'],['Details before decisions.','Specialty · Location · Consultation fee'],['A time that fits.','Choose your day and appointment.'],['A clear next step.','Review the details and find support.']]};
const alt={ar:['تصوّر ثلاثي الأبعاد لغرفة عائلية مع رموز مكالمات توضح وقت البحث عن دكتور','تصوّر ثلاثي الأبعاد لمنطقة سكنية ومسار إلى عيادة قريبة','تصوّر ثلاثي الأبعاد لعيادة وبيانات تساعد على اختيار الدكتور','تصوّر ثلاثي الأبعاد لنتيجة وموبايل لاختيار الميعاد','تصوّر ثلاثي الأبعاد لموبايل يعرض رمز تأكيد الحجز في غرفة عائلية'],en:['Detailed 3D-rendered family room with calling symbols representing the search for care','Detailed 3D-rendered neighborhood showing a route to a nearby clinic','Detailed 3D-rendered clinic with a provider information card','Detailed 3D-rendered calendar and smartphone representing appointment selection','Detailed 3D-rendered family room with a booking confirmation symbol']};
async function source(index){if(!sourceCache.has(index))sourceCache.set(index,import('./premium-scenes/scene-'+index+'.js').then(m=>m.default));return sourceCache.get(index);}
window.initImmersiveHome=function(){
  disposeCurrent?.();
  const host=document.querySelector('#careCanvas');if(!host)return;
  const language=document.documentElement.lang==='ar'?'ar':'en';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dead=false,current=0,version=0,idleTimer;
  host.removeAttribute('aria-hidden');host.className='premium-art';
  host.innerHTML='<div class="render-glow" aria-hidden="true"></div><div class="render-stack"></div><div class="scene-caption"><span class="scene-caption-dot" aria-hidden="true"></span><div><b></b><small></small></div></div>';
  const stack=host.querySelector('.render-stack'),caption=host.querySelector('.scene-caption');
  async function select(index){current=index;const request=++version;
    caption.querySelector('b').textContent=copy[language][index][0];caption.querySelector('small').textContent=copy[language][index][1];host.dataset.scene=index;
    try{const url=await source(index);if(dead||request!==version)return;
      const img=new Image();img.src=url;img.alt=alt[language][index];img.className='render-image';img.width=1254;img.height=1254;img.decoding='async';await img.decode();if(dead||request!==version)return;
      const old=stack.querySelector('.render-image.is-current');stack.appendChild(img);requestAnimationFrame(()=>{if(dead)return;img.classList.add('is-current');old?.classList.remove('is-current');host.classList.add('scene-ready');});
      setTimeout(()=>{if(old?.isConnected)old.remove();},reduced?0:950);
      if(index<4){clearTimeout(idleTimer);idleTimer=setTimeout(()=>source(index+1).catch(()=>{}),900);}
    }catch{if(!dead)caption.querySelector('small').textContent=language==='ar'?'تقدر تبدأ البحث مباشرة.':'You can start your search directly.';}
  }
  function onScene(e){if(e.detail.index!==current)select(e.detail.index);}
  function pointer(e){if(reduced||e.pointerType==='touch')return;const box=host.getBoundingClientRect();host.style.setProperty('--art-x',((e.clientX-box.left)/box.width-.5)*7+'px');host.style.setProperty('--art-y',((e.clientY-box.top)/box.height-.5)*7+'px');}
  function reset(){host.style.setProperty('--art-x','0px');host.style.setProperty('--art-y','0px');}
  window.addEventListener('care-scene',onScene);host.addEventListener('pointermove',pointer,{passive:true});host.addEventListener('pointerleave',reset);
  const active=document.querySelector('.care-dots [aria-current="true"]');select(Number(active?.dataset.careGo||0));
  disposeCurrent=()=>{dead=true;clearTimeout(idleTimer);window.removeEventListener('care-scene',onScene);host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',reset);};
};
window.stopImmersiveHome=()=>disposeCurrent?.();window.initImmersiveHome();
