import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const lerp=T.MathUtils.lerp,clamp=T.MathUtils.clamp;
const hash=(x,z)=>{const a=Math.sin(x*127.1+z*311.7)*43758.5453;return a-Math.floor(a);};
const noise=(x,z)=>{const i=Math.floor(x),j=Math.floor(z),u=x-i,v=z-j,a=u*u*(3-2*u),b=v*v*(3-2*v);return lerp(lerp(hash(i,j),hash(i+1,j),a),lerp(hash(i,j+1),hash(i+1,j+1),a),b);};
const terrain=(x,z)=>{const valley=Math.pow(Math.min(Math.abs(x)/14,1.8),1.6);return -3.4+valley*(3.5+noise(x*.16,z*.16)*5)+noise(x*.4,z*.4)*.8+noise(x*1.4,z*1.4)*.28+noise(x*3.2,z*3.2)*.12;};
export async function createFrontier(host,read,variant){
 const portrait=variant==='hologram',resources=new Set(),track=o=>{resources.add(o);return o;};
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.6));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;host.appendChild(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color(portrait?0x03080c:0x111b22);scene.fog=new T.FogExp2(scene.background,portrait?.025:.027);
 const camera=new T.PerspectiveCamera(portrait?36:48,1,.1,180);
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new T.Vector2(1,1),portrait?.45:.25,.65,1.1);composer.addPass(bloom);composer.addPass(new OutputPass());
 const key=new T.DirectionalLight(0xd9eaff,3.2);key.position.set(-8,16,2);scene.add(key,new T.HemisphereLight(0x8fc9ed,0x050709,1.2));
 const floorLight=new T.PointLight(0x8de6ff,140,35,1.5);floorLight.position.set(0,7,-11);scene.add(floorLight);
 const modelGroup=new T.Group();scene.add(modelGroup);
 let gltf;
 try{gltf=await new GLTFLoader().loadAsync('/models/astronaut.glb');}catch(error){renderer.dispose();composer.dispose();bloom.dispose();renderer.domElement.remove();throw error;}
 const model=gltf.scene;model.updateMatrixWorld(true);const box=new T.Box3().setFromObject(model),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
 const meshes=[];model.traverse(o=>{if(o.isMesh){meshes.push(o);track(o.geometry);track(o.material);Object.values(o.material).forEach(v=>{if(v?.isTexture)track(v);});}});
 let hologram,core,rocks;const rockPositions=[];
 if(portrait){
  const count=22000,positions=new Float32Array(count*3),phases=new Float32Array(count),samplers=meshes.map(mesh=>new MeshSurfaceSampler(mesh).build()),point=new T.Vector3();
  for(let i=0;i<count;i++){const index=i%meshes.length;samplers[index].sample(point);point.applyMatrix4(meshes[index].matrixWorld).sub(center).multiplyScalar(7/size.y);positions.set([point.x,point.y,point.z],i*3);phases[i]=hash(i,12);}
  const geo=track(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(positions,3));geo.setAttribute('phase',new T.BufferAttribute(phases,1));
  const mat=track(new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{time:{value:0},tone:{value:new T.Color(0x85d9ff)},spread:{value:0}},vertexShader:'attribute float phase;uniform float time;uniform float spread;varying float light;void main(){vec3 p=position;float scan=sin(p.y*4.-time*.7);p.x+=sin(phase*80.+time)*spread*.3;p.z+=cos(phase*50.)*spread*.3;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(18./-mv.z,1.,3.);light=.35+phase*.4+pow(max(scan,0.),18.)*.7;}',fragmentShader:'uniform vec3 tone;varying float light;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(tone*light,(1.-smoothstep(.2,.5,d))*.85);}'}));
  hologram=new T.Points(geo,mat);modelGroup.add(hologram);
  // Contour field beneath the hologram, with no implied real team portrait.
  const gridPoints=[];for(let row=0;row<45;row++)for(let col=0;col<90;col++){const x=(col-45)*.25,z=(row-22)*.4;const y=-3.9+Math.sin(x*.8+z*.6)*.12;gridPoints.push(new T.Vector3(x,y,z),new T.Vector3(x+.25,y+Math.sin(x)*.025,z));}
  scene.add(new T.LineSegments(track(new T.BufferGeometry().setFromPoints(gridPoints)),track(new T.LineBasicMaterial({color:0x669ac1,transparent:true,opacity:.28}))));
 }else{
  model.position.sub(center);const body=new T.Group();body.add(model);body.scale.setScalar(2/size.y);modelGroup.add(body);modelGroup.position.set(0,terrain(0,-12)+1,-12);
  const land=track(new T.PlaneGeometry(100,130,240,260));land.rotateX(-Math.PI/2);land.translate(0,0,-35);const pos=land.attributes.position;
  const colors=new Float32Array(pos.count*3);for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),y=terrain(x,z);pos.setY(i,y);const n=.19+noise(x*.65,z*.65)*.14;colors.set([n*.8,n*.92,n],i*3);}land.setAttribute('color',new T.BufferAttribute(colors,3));land.computeVertexNormals();
  scene.add(new T.Mesh(land,track(new T.MeshStandardMaterial({vertexColors:true,roughness:.92,metalness:.16}))));
  const rockGeo=track(new T.IcosahedronGeometry(1,1)),rockMat=track(new T.MeshStandardMaterial({color:0x687982,roughness:.8,metalness:.2}));rocks=new T.InstancedMesh(rockGeo,rockMat,420);scene.add(rocks);const dummy=new T.Object3D();
  for(let i=0;i<420;i++){const x=(hash(i,2)-.5)*48,z=8-hash(i,3)*70,floating=i<76;const y=floating?terrain(x,z)+1+hash(i,5)*14:terrain(x,z);const scale=.05+hash(i,8)*(floating?.38:.25);rockPositions.push({x,y,z,scale,floating});dummy.position.set(x,y,z);dummy.scale.set(scale*1.3,scale*.65,scale);dummy.rotation.set(i,i*.7,i*.32);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);}rocks.instanceMatrix.needsUpdate=true;
  const count=6500,positions=new Float32Array(count*3),phases=new Float32Array(count);for(let i=0;i<count;i++){const y=1-i/(count-1)*2,r=Math.sqrt(1-y*y),angle=i*2.39996;positions.set([Math.cos(angle)*r*2.1,y*2.1,Math.sin(angle)*r*2.1],i*3);phases[i]=hash(i,6);}
  const geo=track(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(positions,3));geo.setAttribute('phase',new T.BufferAttribute(phases,1));
  core=new T.Points(geo,track(new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{time:{value:0},focus:{value:0}},vertexShader:'attribute float phase;uniform float time;uniform float focus;varying float light;void main(){vec3 p=position;float wave=sin(p.y*3.+time*.55)+cos(p.x*4.-time*.3);p*=1.+wave*.18*(1.-focus*.6);p.y+=sin(phase*25.+time*.4)*.12;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(24./-mv.z,1.,3.);light=.5+phase;}',fragmentShader:'varying float light;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vec3(.65,.88,1.)*light,1.-smoothstep(.1,.5,d));}'})));core.position.set(0,6.7,-13);scene.add(core);
  // Soft shaft of light from the particle source to the valley floor.
  const shaft=new T.Mesh(track(new T.CylinderGeometry(.4,3.8,18,48,1,true)),track(new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;void main(){float a=pow(sin(vUv.y*3.14159),2.)*pow(sin(vUv.x*3.14159),6.)*.012;gl_FragColor=vec4(.56,.8,1.,a);}'})));shaft.position.set(0,5,-13);scene.add(shaft);
 }
 const dustPos=new Float32Array(1600*3);for(let i=0;i<1600;i++){dustPos.set([(hash(i,31)-.5)*70,(hash(i,32)-.25)*32,-hash(i,33)*75],i*3);}const dust=new T.Points(track(new T.BufferGeometry()),track(new T.PointsMaterial({color:0xc1e9ff,size:.028,transparent:true,opacity:.5})));dust.geometry.setAttribute('position',new T.BufferAttribute(dustPos,3));scene.add(dust);
 let frame=0,last=0,time=0,width=1,height=1,visible=true,px=0,py=0,rx=0,ry=0,progress=0,focus=0,needsRender=true;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const resize=()=>{width=host.clientWidth;height=host.clientHeight;if(!width||!height)return;renderer.setSize(width,height);composer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();needsRender=true;};const ro=new ResizeObserver(resize);ro.observe(host);resize();
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;needsRender=true;});io.observe(host);
 const surface=host.parentElement,move=e=>{const r=surface.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;needsRender=true;},leave=()=>{px=py=0;needsRender=true;};surface.addEventListener('pointermove',move);surface.addEventListener('pointerleave',leave);
 let lastProgress=-1,lastDiscipline=-1;const dummy=new T.Object3D();
 function render(now){frame=requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.04);last=now;if(!visible||document.hidden)return;const options=read(),still=options.paused||reduced.matches;const p=reduced.matches?0:options.motion?.current?.progress||0;
  if(still&&!needsRender&&lastProgress===p&&lastDiscipline===options.discipline)return;lastProgress=p;lastDiscipline=options.discipline;needsRender=false;if(!still)time+=dt;const d=1-Math.exp(-dt*6);rx=lerp(rx,still?0:px,d);ry=lerp(ry,still?0:py,d);progress=lerp(progress,p,d);focus=lerp(focus,options.assembled?1:0,d);
  if(portrait){const shift=width<700?0:-1.6;camera.position.set(rx*.35,ry*.2,13);camera.lookAt(0,0,0);modelGroup.position.set(shift,-.3,0);modelGroup.rotation.y=rx*.25+Math.sin(time*.15)*.09;hologram.material.uniforms.time.value=time;hologram.material.uniforms.spread.value=Math.sin(time*.35)*.3+.35;const tones=[0x7fd7ff,0xa99dff,0x8ff0d7];hologram.material.uniforms.tone.value.lerp(new T.Color(tones[options.discipline%3]),d);}
  else{camera.position.set(lerp(8,1,progress)+rx*.8,lerp(7,1.6,progress)+ry*.3,lerp(22,4,progress));camera.lookAt(0,lerp(1,2.8,progress),-13);core.rotation.y=time*.12;core.rotation.z=Math.sin(time*.13)*.12;core.material.uniforms.time.value=time;core.material.uniforms.focus.value=focus;core.scale.setScalar(1+focus*.2);floorLight.intensity=140+focus*60;
   if(!still){for(let i=0;i<76;i++){const r=rockPositions[i];dummy.position.set(r.x,r.y+Math.sin(time*.3+i)*.28,r.z);dummy.rotation.set(i+time*.09,i*.7+time*.07,i*.32);dummy.scale.set(r.scale*1.3,r.scale*.65,r.scale);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);}rocks.instanceMatrix.needsUpdate=true;}
  }
  composer.render();host.dataset.ready='true';
 }
 frame=requestAnimationFrame(render);
 return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();surface.removeEventListener('pointermove',move);surface.removeEventListener('pointerleave',leave);resources.forEach(r=>r.dispose?.());composer.dispose();bloom.dispose();renderer.dispose();renderer.domElement.remove();};
}
