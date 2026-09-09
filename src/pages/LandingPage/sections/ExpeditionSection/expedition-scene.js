import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const clamp = T.MathUtils.clamp;

const segment = (a, b, p) => {
  const x = clamp((p - a) / (b - a), 0, 1);

  return x * x * (3 - 2 * x);
};

const mix = T.MathUtils.lerp;

export async function createExpedition(host, readState, onReady) {
  const renderer = new T.WebGLRenderer({
    alpha: false,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 700 ? 1.2 : 1.5),
  );
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  host.appendChild(renderer.domElement);
  let frame = 0,
    visible = true,
    width = 1,
    height = 1,
    last = 0,
    time = 0,
    px = 0,
    py = 0,
    rx = 0,
    ry = 0,
    needsRender = true;
  const resources = new Set();

  const track = (x) => {
    resources.add(x);

    return x;
  };

  const universe = new T.Scene();
  universe.background = new T.Color(0x02040a);
  universe.fog = new T.FogExp2(0x02040a, 0.018);
  const camera = new T.PerspectiveCamera(43, 1, 0.1, 350);
  camera.position.set(0, 0.4, 10);
  const room = new RoomEnvironment(),
    pmrem = new T.PMREMGenerator(renderer),
    env = track(pmrem.fromScene(room, 0.04));
  room.dispose();
  universe.environment = env.texture;
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(universe, camera));
  const bloom = new UnrealBloomPass(new T.Vector2(1, 1), 0.75, 0.55, 0.9);
  composer.addPass(bloom);
  const speedPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      amount: { value: 0 },
      fade: { value: 1 },
    },
    vertexShader:
      'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `uniform sampler2D tDiffuse;uniform float amount;uniform float fade;varying vec2 vUv;
  void main(){vec2 d=vUv-.5;vec2 shift=d*amount*.0012;vec4 col=texture2D(tDiffuse,vUv);col.r=texture2D(tDiffuse,vUv+shift).r;col.b=texture2D(tDiffuse,vUv-shift).b;
  vec3 smear=vec3(0.);for(int i=1;i<=4;i++){smear+=texture2D(tDiffuse,vUv-d*float(i)*amount*.002).rgb;}col.rgb=mix(col.rgb,smear*.25,amount*.22);float vignette=1.-dot(d,d)*.38;gl_FragColor=vec4(col.rgb*vignette*fade,1.);}`,
  });
  composer.addPass(speedPass);
  composer.addPass(new OutputPass());
  const screenTarget = track(
    new T.WebGLRenderTarget(1024, 640, { type: T.HalfFloatType }),
  );
  // A physical tablet with a live view of the same world inside its screen.
  const deviceScene = new T.Scene();
  deviceScene.background = new T.Color(0xf1f1f7);
  deviceScene.environment = env.texture;
  const deviceCamera = new T.PerspectiveCamera(42, 1, 0.1, 100);
  deviceCamera.position.set(0, 0, 12);
  const device = new T.Group();
  deviceScene.add(device);
  const frameMat = track(
    new T.MeshStandardMaterial({
      color: 0x101114,
      metalness: 0.82,
      roughness: 0.27,
      envMapIntensity: 0.8,
    }),
  );
  const tablet = new T.Mesh(
    track(new RoundedBoxGeometry(5.5, 3.6, 0.2, 5, 0.25)),
    frameMat,
  );
  device.add(tablet);
  const screenMat = track(
    new T.MeshBasicMaterial({ map: screenTarget.texture, toneMapped: false }),
  );
  const screen = new T.Mesh(track(new T.PlaneGeometry(5.16, 3.23)), screenMat);
  screen.position.z = 0.112;
  device.add(screen);
  const lens = new T.Mesh(
    track(new T.SphereGeometry(0.032, 12, 8)),
    track(
      new T.MeshStandardMaterial({
        color: 0x01040a,
        metalness: 0.7,
        roughness: 0.13,
      }),
    ),
  );
  lens.position.set(-2.66, 0, 0.12);
  device.add(lens);
  const light = new T.DirectionalLight(0xffffff, 2.4);
  light.position.set(-2, 4, 7);
  deviceScene.add(light);
  // Space lighting and real model.
  const key = new T.DirectionalLight(0xf0f7ff, 1.6);
  key.position.set(-3, 5, 8);
  universe.add(key);
  const rim = new T.DirectionalLight(0xa9bbdb, 1.2);
  rim.position.set(4, 2, -4);
  universe.add(rim);
  const pink = new T.PointLight(0xfd5399, 30, 22);
  universe.add(pink);
  universe.add(new T.AmbientLight(0xaacbff, 0.32));
  const astronaut = new T.Group();
  universe.add(astronaut);
  const space = new T.Group();
  universe.add(space);
  const starPositions = new Float32Array(1000 * 3);

  for (let i = 0; i < 1000; i++) {
    starPositions[i * 3] = Math.sin(i * 127.1) * 90;
    starPositions[i * 3 + 1] = Math.cos(i * 311.7) * 65;
    starPositions[i * 3 + 2] = -15 - (i % 97) * 2.3;
  }

  const starGeo = track(new T.BufferGeometry());
  starGeo.setAttribute('position', new T.BufferAttribute(starPositions, 3));
  const stars = new T.Points(
    starGeo,
    track(
      new T.PointsMaterial({
        color: 0xadcfff,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
      }),
    ),
  );
  universe.add(stars);
  const earthTexture = track(
    await new T.TextureLoader().loadAsync('/textures/earth.jpg'),
  );
  earthTexture.colorSpace = T.SRGBColorSpace;
  const earth = new T.Mesh(
    track(new T.SphereGeometry(10, 64, 40)),
    track(
      new T.MeshStandardMaterial({
        map: earthTexture,
        roughness: 1,
        metalness: 0,
        envMapIntensity: 0.1,
      }),
    ),
  );
  earth.position.set(-1, -11, -12);
  earth.rotation.z = 0.17;
  space.add(earth);
  const atmosphere = new T.Mesh(
    track(new T.SphereGeometry(10.12, 64, 40)),
    track(
      new T.ShaderMaterial({
        transparent: true,
        blending: T.AdditiveBlending,
        side: T.BackSide,
        depthWrite: false,
        uniforms: { glow: { value: new T.Color(0x3fbfff) } },
        vertexShader:
          'varying vec3 vNormal;varying vec3 vPosition;void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);vPosition=p.xyz;gl_Position=projectionMatrix*p;}',
        fragmentShader:
          'varying vec3 vNormal;varying vec3 vPosition;uniform vec3 glow;void main(){float f=pow(1.-abs(dot(normalize(vNormal),normalize(-vPosition))),3.);gl_FragColor=vec4(glow*f,f*.9);}',
      }),
    ),
  );
  atmosphere.position.copy(earth.position);
  space.add(atmosphere);
  const gltf = await new GLTFLoader().loadAsync('/models/astronaut.glb');
  const model = gltf.scene,
    box = new T.Box3().setFromObject(model),
    center = box.getCenter(new T.Vector3()),
    size = box.getSize(new T.Vector3());
  model.position.sub(center);
  const body = new T.Group();
  body.add(model);
  body.scale.setScalar(4.8 / size.y);
  astronaut.add(body);
  model.traverse((o) => {
    if (o.isMesh) {
      o.material.envMapIntensity = 0.55;
      track(o.geometry);
      track(o.material);

      for (const value of Object.values(o.material))
        if (value?.isTexture) track(value);
    }
  });
  // Keep the original astronaut; deform only its left sleeve around the shoulder.
  const wave = { value: 0 };
  model.traverse((o) => {
    if (!o.isMesh) return;

    o.material.onBeforeCompile = (shader) => {
      shader.uniforms.eigiWave = wave;
      shader.vertexShader = 'uniform float eigiWave;\n' + shader.vertexShader;
      const rig = `float sleeve=smoothstep(.27,.40,-position.x)*smoothstep(.86,1.04,position.y);float angle=eigiWave*sleeve;mat2 turn=mat2(cos(angle),sin(angle),-sin(angle),cos(angle));`;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        '#include <beginnormal_vertex>\n' +
          rig +
          'objectNormal.xy=turn*objectNormal.xy;',
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\ntransformed.xy=turn*(transformed.xy-vec2(-.31,1.5))+vec2(-.31,1.5);',
      );
    };
  });
  // A deep, twisting truss tunnel, built as instances rather than hundreds of draw calls.
  const tunnel = new T.Group();
  universe.add(tunnel);
  const metalMat = track(
    new T.MeshStandardMaterial({
      color: 0x627c8e,
      metalness: 0.88,
      roughness: 0.28,
      envMapIntensity: 0.5,
    }),
  );
  const glowMat = track(
    new T.MeshStandardMaterial({
      color: 0xc4d0ff,
      emissive: 0x667ed1,
      emissiveIntensity: 1.2,
      metalness: 0.3,
      roughness: 0.2,
    }),
  );
  const hotMat = track(
    new T.MeshStandardMaterial({
      color: 0xc4d0ff,
      emissive: 0x667ed1,
      emissiveIntensity: 1.2,
      metalness: 0.2,
      roughness: 0.2,
    }),
  );
  const unit = track(new T.BoxGeometry(1, 1, 1)),
    beamCount = 54 * 8 * 3;
  const truss = new T.InstancedMesh(unit, metalMat, beamCount),
    cyan = new T.InstancedMesh(unit, glowMat, 54 * 4),
    magenta = new T.InstancedMesh(unit, hotMat, 54 * 4);
  tunnel.add(truss, cyan, magenta);
  const dummy = new T.Object3D(),
    axis = new T.Vector3(1, 0, 0),
    a = new T.Vector3(),
    b = new T.Vector3(),
    direction = new T.Vector3();

  const vertex = (i, j) => {
    const angle = (j / 8) * Math.PI * 2 + i * 0.083;
    const radius = 5.4 + Math.sin(i * 0.38) * 0.32;

    return new T.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      -i * 4.1 - 5,
    );
  };

  let ti = 0,
    ci = 0,
    mi = 0;

  function place(mesh, index, from, to, thickness) {
    dummy.position.copy(from).add(to).multiplyScalar(0.5);
    direction.copy(to).sub(from);
    dummy.quaternion.setFromUnitVectors(axis, direction.clone().normalize());
    dummy.scale.set(direction.length(), thickness, thickness);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  }

  for (let i = 0; i < 54; i++)
    for (let j = 0; j < 8; j++) {
      a.copy(vertex(i, j));
      b.copy(vertex(i, (j + 1) % 8));
      place(truss, ti++, a, b, 0.09);
      place(truss, ti++, a, vertex(i + 1, j), 0.065);
      place(truss, ti++, a, vertex(i + 1, (j + 1) % 8), 0.035);
      const edge = a.clone().lerp(b, 0.18),
        end = a.clone().lerp(b, 0.48);

      if (j % 2 === 0) place(cyan, ci++, edge, end, 0.045);
      else place(magenta, mi++, edge, end, 0.038);
    }

  [truss, cyan, magenta].forEach((m) => {
    m.instanceMatrix.needsUpdate = true;
    m.frustumCulled = false;
  });
  const beamLight = new T.PointLight(0xa9b9e1, 85, 32, 1.5);
  universe.add(beamLight);
  // Floating type badges and crystalline objects in the closing world.
  const finale = new T.Group();
  universe.add(finale);
  const badges = [];
  const badgeWords = [
    'SHIP IT',
    '</>',
    'eigi_ai',
    'BUILD',
    'AI',
    'NEXT',
    '01 → ∞',
    'DEPLOY',
  ];
  const badgeColors = [
    '#c8d1e7',
    '#eef0f4',
    '#b7c3df',
    '#eef0f4',
    '#c8d1e7',
    '#b7c3df',
    '#eef0f4',
    '#c8d1e7',
  ];
  badgeWords.forEach((word, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(5, 5, 502, 210, 80);
    ctx.fill();
    ctx.fillStyle = '#11131a';
    ctx.beginPath();
    ctx.roundRect(13, 13, 486, 194, 73);
    ctx.fill();
    ctx.fillStyle = badgeColors[i];
    ctx.beginPath();
    ctx.roundRect(22, 22, 468, 176, 66);
    ctx.fill();
    ctx.fillStyle = '#11131a';
    ctx.font = `bold ${word.length > 5 ? 61 : 80}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, 256, 115);
    const tex = track(new T.CanvasTexture(canvas));
    tex.colorSpace = T.SRGBColorSpace;
    const badge = new T.Mesh(
      track(new T.PlaneGeometry(2.2, 0.95)),
      track(
        new T.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: T.DoubleSide,
          toneMapped: false,
        }),
      ),
    );
    finale.add(badge);
    badges.push(badge);
  });
  const crystalGeo = track(new T.OctahedronGeometry(0.27, 0)),
    crystalMat = track(
      new T.MeshPhysicalMaterial({
        color: 0xa1d8ff,
        metalness: 0.95,
        roughness: 0.12,
        clearcoat: 1,
        envMapIntensity: 2,
      }),
    );
  const crystals = [];

  for (let i = 0; i < 14; i++) {
    const crystal = new T.Mesh(crystalGeo, crystalMat);
    finale.add(crystal);
    crystals.push(crystal);
  }

  const stageColor = new T.Color(0xf1f1f7),
    black = new T.Color(0x02040a);

  const resize = () => {
    width = host.clientWidth;
    height = host.clientHeight;

    if (!width || !height) return;

    renderer.setSize(width, height);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    deviceCamera.aspect = width / height;
    deviceCamera.updateProjectionMatrix();
    needsRender = true;
  };

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    needsRender = true;
  });
  io.observe(host);

  const move = (e) => {
    const r = host.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
    needsRender = true;
  };

  const reset = () => {
    px = py = 0;
    needsRender = true;
  };

  host.parentElement.addEventListener('pointermove', move);
  host.parentElement.addEventListener('pointerleave', reset);
  let lastP = -1,
    wasPaused = false;

  const render = (now) => {
    frame = requestAnimationFrame(render);
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;

    if (!visible || document.hidden) return;

    const state = readState(),
      paused = state.paused;
    const p = state.reduced ? 0 : state.progress;

    if (paused && !needsRender && lastP === p && wasPaused) return;

    lastP = p;
    wasPaused = paused;
    needsRender = false;

    if (!paused) time += dt * 0.35;

    const damping = 1 - Math.exp(-dt * 5);
    rx = mix(rx, paused ? 0 : px, damping);
    ry = mix(ry, paused ? 0 : py, damping);
    const open = segment(0.07, 0.24, p),
      enter = segment(0.35, 0.48, p),
      flight = segment(0.42, 0.82, p),
      out = segment(0.81, 0.91, p);
    const mobile = width < 650;
    space.visible = p < 0.48;
    space.scale.setScalar(1 - enter * 0.6);
    earth.rotation.y = time * 0.015;
    tunnel.visible = p > 0.37 && p < 0.91;
    tunnel.rotation.z = Math.sin(flight * 3) * 0.04;
    finale.visible = p > 0.8;
    wave.value = out * (-2.05 + Math.sin(time * 5) * 0.16);
    astronaut.rotation.set(
      Math.sin(time * 0.32) * 0.035,
      rx * 0.2 + Math.sin(time * 0.24) * 0.1,
      -0.06 + Math.sin(time * 0.4) * 0.045 + Math.sin(flight * Math.PI) * 0.55,
    );
    camera.fov = mix(43, 51, Math.sin(flight * Math.PI));
    camera.updateProjectionMatrix();
    const cameraZ = mix(10, -207, flight);
    camera.position.set(
      Math.sin(flight * 7) * 0.45 + rx * 0.25,
      ry * 0.2,
      cameraZ,
    );
    const roll = Math.sin(flight * Math.PI) * 0.15;
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.lookAt(0, 0, cameraZ - 25);
    const astronautZ = mix(0, cameraZ - 20, enter);
    astronaut.position.set(
      mix(Math.sin(enter * Math.PI) * 0.6, mobile ? 0 : 2.15, out),
      Math.sin(time * 0.8) * 0.16 - 0.2 - enter * (1 - out) * 0.55,
      mix(astronautZ, -217, out),
    );
    astronaut.scale.setScalar(
      mix(mix(1, 0.35, segment(0.48, 0.66, p)), 1.05, out),
    );
    key.position.set(camera.position.x - 3, 5, cameraZ + 5);
    key.target.position.set(0, 0, cameraZ - 10);
    key.target.updateMatrixWorld();
    rim.position.set(4, 3, cameraZ - 13);
    rim.target.position.set(0, 0, cameraZ - 10);
    rim.target.updateMatrixWorld();
    pink.position.set(-3, -1, cameraZ - 8);
    pink.intensity = mix(0, 65, flight) * (1 - out);
    beamLight.position.set(1, 1, cameraZ - 3);
    beamLight.intensity = 85 * (1 - out);
    glowMat.emissiveIntensity = mix(1.2, 2.1, flight);
    hotMat.emissiveIntensity = mix(0.2, 2.3, segment(0.5, 0.75, p));
    badges.forEach((badge, i) => {
      const side = i % 2 === 0 ? -1 : 1,
        row = Math.floor(i / 2);
      const x = side * (mobile ? 2 : 4.3) + Math.sin(time * 0.33 + i) * 0.25;
      const y = 3.2 - row * 2.1 + Math.sin(time * 0.45 + i) * 0.18;
      badge.position.set(x, y, -214 - (i % 3) * 0.7);
      badge.rotation.set(
        Math.sin(time * 0.3 + i) * 0.12,
        Math.sin(time * 0.2 + i) * 0.12,
        side * 0.15 + Math.sin(time * 0.3 + i) * 0.09,
      );
      badge.scale.setScalar(mobile ? 0.7 : 1);
    });
    crystals.forEach((c, i) => {
      const angle = i * 2.39996;
      c.position.set(
        Math.cos(angle) * (3 + (i % 4)),
        Math.sin(angle) * (3 + (i % 3)),
        -213 - (i % 8),
      );
      c.rotation.set(time * 0.12 + i, time * 0.17 + i * 0.3, 0);
    });
    bloom.strength = p < 0.35 ? 0.16 : mix(0.22, 0.025, out);
    bloom.radius = 0.45;
    bloom.threshold = 1.3;
    speedPass.uniforms.amount.value = paused
      ? 0
      : Math.sin(flight * Math.PI) * 0.18;
    speedPass.uniforms.fade.value = 1;

    if (p < 0.24) {
      const deviceDepth = mix(0, 3, open),
        viewHeight =
          2 *
          Math.tan(T.MathUtils.degToRad(deviceCamera.fov / 2)) *
          (12 - deviceDepth);
      const fullScale =
        Math.max(viewHeight / 3.23, (viewHeight * deviceCamera.aspect) / 5.16) *
        1.015;
      const scale = mix(mobile ? 0.59 : 0.91, fullScale, open);
      const originalAspect = camera.aspect,
        originalFov = camera.fov;
      // Match the screen's cropped frustum to the full viewport before handing off.
      camera.aspect = 5.16 / 3.23;
      camera.fov = T.MathUtils.radToDeg(
        2 *
          Math.atan(
            Math.tan(T.MathUtils.degToRad(originalFov / 2)) *
              Math.max(1, (3.23 * scale) / viewHeight),
          ),
      );
      camera.updateProjectionMatrix();
      renderer.setRenderTarget(screenTarget);
      renderer.render(universe, camera);
      renderer.setRenderTarget(null);
      camera.aspect = originalAspect;
      camera.fov = originalFov;
      camera.updateProjectionMatrix();
      device.scale.setScalar(scale);
      device.position.set(
        mix(mobile ? 0 : -3.1, 0, open),
        mix(mobile ? -1.15 : -0.65, 0, open),
        deviceDepth,
      );
      device.rotation.set(
        mix(-0.08, 0, open) + ry * 0.035 * (1 - open),
        mix(0.2, 0, open) + rx * 0.07 * (1 - open),
        mix(-0.035, 0, open),
      );
      deviceScene.background
        .copy(stageColor)
        .lerp(black, segment(0.18, 0.24, p));
      renderer.render(deviceScene, deviceCamera);
    } else composer.render();

    host.dataset.phase =
      p < 0.24 ? 'device' : p < 0.42 ? 'space' : p < 0.83 ? 'tunnel' : 'finale';
    host.dataset.progress = p.toFixed(3);
  };

  onReady();
  frame = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    io.disconnect();
    host.parentElement?.removeEventListener('pointermove', move);
    host.parentElement?.removeEventListener('pointerleave', reset);
    resources.forEach((r) => r.dispose?.());
    composer.dispose();
    bloom.dispose();
    speedPass.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
