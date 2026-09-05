'use client';
import { useEffect, useRef, useState } from 'react';

export default function Sculpture({ variant = 'hero', assembled = false, paused = false }) {
  const host = useRef(null);
  const options = useRef({ assembled, paused });
  const [failed, setFailed] = useState(false);
  useEffect(() => { options.current = { assembled, paused }; }, [assembled, paused]);
  useEffect(() => {
    let disposed = false, cleanup = () => {}, loaded = false;
    const el = host.current;
    if (!el) return;
    async function init() {
      if (loaded) return;
      loaded = true;
      try {
        const [T, { RoundedBoxGeometry }, { RoomEnvironment }] = await Promise.all([
          import('three'), import('three/addons/geometries/RoundedBoxGeometry.js'), import('three/addons/environments/RoomEnvironment.js')
        ]);
        if (disposed) return;
        const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        el.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const pmrem = new T.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const env = pmrem.fromScene(room, 0.04);
        scene.environment = env.texture;
        room.dispose();
        const camera = new T.PerspectiveCamera(36, 1, .1, 100);
        camera.position.z = variant === 'hero' ? 16 : 11;
        const group = new T.Group();
        scene.add(group);
        const blue = new T.MeshPhysicalMaterial({ color: 0x1226ed, metalness: .48, roughness: .19, clearcoat: 1 });
        const white = new T.MeshPhysicalMaterial({ color: 0xe2e5ed, metalness: .3, roughness: .2, clearcoat: 1 });
        const black = new T.MeshPhysicalMaterial({ color: 0x151820, metalness: .62, roughness: .24, clearcoat: 1 });
        const silver = new T.MeshPhysicalMaterial({ color: 0x8994ae, metalness: .98, roughness: .16 });
        const materials = [blue, white, black, blue, blue, silver];
        const geometries = [new T.TorusGeometry(.66,.25,20,56), new RoundedBoxGeometry(1.05,1.05,1.05,4,.15), new T.IcosahedronGeometry(.75,1)];
        const objects = [];
        const count = variant === 'hero' ? 32 : variant === 'network' ? 17 : 9;
        for(let i=0;i<count;i++) {
          const mesh = new T.Mesh(geometries[variant === 'stack' ? 1 : i%3], materials[i%6]);
          const phi = i * 2.39996;
          const y = 1 - (i / (count-1)) * 2;
          const radius = Math.sqrt(1-y*y);
          const spread = variant === 'hero' ? 2.9 : 2.2;
          const loose = new T.Vector3(Math.cos(phi)*radius*spread, y*spread*.91, Math.sin(phi)*radius*spread);
          const tight = variant === 'stack' ? new T.Vector3(0, (i-4)*.49, 0) : new T.Vector3(((i%4)-1.5)*1.06, (Math.floor(i/4)%4-1.5)*1.06, (Math.floor(i/16)-.5)*1.06);
          mesh.position.copy(variant === 'stack' ? tight : loose);
          mesh.rotation.set(i*.6,i*.83,i*.31);
          if(variant === 'stack') { mesh.scale.set(2.4,.29,2.4);mesh.rotation.set(0,i*.13,0); }
          group.add(mesh);
          objects.push({ mesh, loose, tight, rotation: mesh.rotation.clone(), phase:i*.74 });
        }
        const core = new T.Mesh(new T.TorusKnotGeometry(.9,.26,110,18),blue);
        if(variant==='hero') group.add(core);
        if(variant==='network') {
          const points = [];
          objects.forEach((a,i)=>{objects.slice(i+1).forEach(b=>{if(a.loose.distanceTo(b.loose)<2.7)points.push(a.loose,b.loose)})});
          const lines = new T.LineSegments(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0x6e7cff,transparent:true,opacity:.35}));
          group.add(lines);
        }
        const key = new T.DirectionalLight(0xffffff,4);key.position.set(-3,5,7);scene.add(key);
        const rim = new T.PointLight(0x3a4cff,60);rim.position.set(5,1,2);scene.add(rim);
        let visible = true, frame = 0, elapsed = 0, last = 0, progress = 0;
        let px=0,py=0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const move = e => {const r=el.getBoundingClientRect();px=((e.clientX-r.left)/r.width-.5)*.5;py=((e.clientY-r.top)/r.height-.5)*.3;};
        const reset = ()=>{px=0;py=0;};
        el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);
        const resize = () => {
          const w=el.clientWidth,h=el.clientHeight;
          if(!w||!h)return;
          renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();
          const mobile=w<700;
          group.position.set(variant==='hero' ? (mobile ? .4 : 2.6) : 0, variant==='hero' && mobile ? -.65 : 0, 0);
          group.scale.setScalar(variant==='hero' && mobile ? .79 : 1);
        };
        const ro=new ResizeObserver(resize);ro.observe(el);resize();
        const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});io.observe(el);
        let needsStatic=true;
        const render = time => {
          frame=requestAnimationFrame(render);
          const delta=Math.min((time-last)/1000,.05);last=time;
          if(!visible||document.hidden)return;
          const still=reduced.matches||options.current.paused;
          if(!still)elapsed+=delta;
          const target=options.current.assembled ? 1 : 0;
          const changed=Math.abs(progress-target)>.001;
          if(still&&!changed&&!needsStatic)return;
          needsStatic=false;
          progress=still?target:T.MathUtils.lerp(progress,target,.045);
          group.rotation.y=T.MathUtils.lerp(group.rotation.y,still?.28:Math.sin(elapsed*.13)*.24+px,.04);
          group.rotation.x=T.MathUtils.lerp(group.rotation.x,still?.08:py+.08,.04);
          objects.forEach(({mesh,loose,tight,rotation,phase})=>{
            if(variant!=='stack') {
              mesh.position.lerpVectors(loose,tight,progress);
              if(!still)mesh.position.y+=Math.sin(elapsed*.45+phase)*.09*(1-progress);
              mesh.rotation.set(rotation.x*(1-progress)+elapsed*.08*(1-progress),rotation.y*(1-progress)+elapsed*.07*(1-progress),rotation.z*(1-progress));
            }else mesh.rotation.y=rotation.y+Math.sin(elapsed*.25)*.22;
          });
          core.rotation.set(elapsed*.1,elapsed*.12,0);core.scale.setScalar(1-progress*.9);
          renderer.render(scene,camera);
        };
        const invalidate=()=>{needsStatic=true;};
        window.addEventListener('resize',invalidate);reduced.addEventListener('change',invalidate);
        frame=requestAnimationFrame(render);
        cleanup=()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);window.removeEventListener('resize',invalidate);reduced.removeEventListener('change',invalidate);scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const list=Array.isArray(o.material)?o.material:[o.material];list.forEach(m=>m.dispose())}});env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();};
      } catch(error) { if(!disposed)setFailed(true); }
    }
    const loader = new IntersectionObserver(entries=>{if(entries[0].isIntersecting){init();loader.disconnect();}},{rootMargin:'250px'});
    loader.observe(el);
    return ()=>{disposed=true;loader.disconnect();cleanup();};
  },[variant]);
  return <div ref={host} className={`sculpture sculpture-${variant}`} aria-hidden="true">{failed&&<div className="scene-fallback">DATA → INTELLIGENCE → ACTION</div>}</div>;
}
