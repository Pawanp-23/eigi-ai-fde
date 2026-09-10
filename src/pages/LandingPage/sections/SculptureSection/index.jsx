'use client';

import { useEffect, useRef, useState } from 'react';

export default function Sculpture({
  variant = 'hero',
  assembled = false,
  paused = false,
  motion = undefined,
}) {
  const host = useRef(null),
    options = useRef({ assembled, paused, motion });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    options.current = { assembled, paused, motion };
  }, [assembled, paused, motion]);

  useEffect(() => {
    const el = host.current;

    if (!el) return;

    let disposed = false,
      loaded = false,
      cleanup = () => {};

    async function init() {
      if (loaded) return;

      loaded = true;

      try {
        const [T, { RoundedBoxGeometry }, { RoomEnvironment }] =
          await Promise.all([
            import('three'),
            import('three/addons/geometries/RoundedBoxGeometry.js'),
            import('three/addons/environments/RoomEnvironment.js'),
          ]);

        if (disposed) return;

        const hero = variant === 'hero',
          portal = variant === 'portal';
        const renderer = new T.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(
          Math.min(devicePixelRatio, innerWidth < 700 ? 1.3 : 1.65),
        );
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.NeutralToneMapping;
        renderer.toneMappingExposure = 0.95;
        el.appendChild(renderer.domElement);
        const scene = new T.Scene(),
          camera = new T.PerspectiveCamera(40, 1, 0.1, 90);
        camera.position.z = 15;
        const pmrem = new T.PMREMGenerator(renderer),
          room = new RoomEnvironment(),
          env = pmrem.fromScene(room, 0.03);
        scene.environment = env.texture;
        room.dispose();
        const group = new T.Group();
        scene.add(group);
        const materials = [
          new T.MeshPhysicalMaterial({
            color: 0x0016bd,
            metalness: 0.12,
            roughness: 0.3,
            clearcoat: 0.5,
            clearcoatRoughness: 0.16,
            envMapIntensity: 0.4,
          }),
          new T.MeshPhysicalMaterial({
            color: 0xf1f2f7,
            metalness: 0.12,
            roughness: 0.25,
            clearcoat: 0.5,
            envMapIntensity: 0.55,
          }),
          new T.MeshPhysicalMaterial({
            color: 0x11131b,
            metalness: 0.22,
            roughness: 0.25,
            clearcoat: 0.7,
            envMapIntensity: 0.55,
          }),
        ];
        const beam = new RoundedBoxGeometry(1.64, 0.53, 0.53, 3, 0.15),
          ring = new T.TorusGeometry(0.52, 0.19, 16, 48),
          block = new RoundedBoxGeometry(1.5, 0.24, 1.5, 3, 0.07);
        const objects = [],
          count = hero ? 42 : portal ? 36 : variant === 'stack' ? 8 : 22;

        for (let i = 0; i < count; i++) {
          const object = new T.Group(),
            material = materials[i % 7 < 4 ? 0 : i % 7 < 6 ? 1 : 2];

          if (variant === 'stack') {
            object.add(new T.Mesh(block, material));
            // Raised rows make each layer read as a document rather than a slab.
            for (let row = 0; row < 3; row++) {
              const line = new T.Mesh(
                new T.BoxGeometry(0.9 - row * 0.16, 0.025, 0.035),
                materials[i % 7 < 4 ? 1 : 0],
              );
              line.position.set(-row * 0.07, 0.135, -0.32 + row * 0.25);
              object.add(line);
            }
          } else if (variant === 'network') {
            object.add(
              new T.Mesh(
                new RoundedBoxGeometry(0.8, 1.05, 0.22, 2, 0.06),
                material,
              ),
            );
            for (let row = 0; row < 3; row++) {
              const line = new T.Mesh(
                new T.BoxGeometry(0.48, 0.045, 0.025),
                materials[i % 7 < 4 ? 1 : 0],
              );
              line.position.set(0, 0.23 - row * 0.2, 0.125);
              object.add(line);
            }
          } else if (i % 4 === 0) {
            object.add(new T.Mesh(ring, material));
          } else {
            const a = new T.Mesh(beam, material),
              b = new T.Mesh(beam, material),
              c = new T.Mesh(beam, material);
            b.rotation.z = Math.PI / 2;
            c.rotation.y = Math.PI / 2;
            object.add(a, b, c);
          }

          const phi = i * 2.399963,
            y = 1 - (i / (count - 1)) * 2,
            r = Math.sqrt(1 - y * y);
          const loose = new T.Vector3(
            Math.cos(phi) * r * 4,
            y * 3.3,
            Math.sin(phi) * r * 3.2,
          );
          const layer = Math.floor(i / 14),
            angle = ((i % 14) / 14) * Math.PI * 2 + layer * 0.17;
          const tunnel = new T.Vector3(
            Math.cos(angle) * (3.65 + layer * 0.2),
            Math.sin(angle) * (3.65 + layer * 0.2),
            -layer * 2.4,
          );
          object.position.copy(loose);
          object.rotation.set(i * 0.51, i * 0.37, i * 0.78);
          const size = hero ? 0.83 + (i % 3) * 0.12 : 0.75;
          object.scale.setScalar(size);
          group.add(object);
          objects.push({
            object,
            loose,
            tunnel,
            rotation: object.rotation.clone(),
            phase: i * 0.73,
            angle,
            size,
          });
        }

        const networkPoints = [];

        if (variant === 'network')
          objects.forEach((a, i) =>
            objects.slice(i + 1).forEach((b) => {
              if (a.loose.distanceTo(b.loose) < 3.5)
                networkPoints.push(a.loose, b.loose);
            }),
          );

        if (networkPoints.length)
          group.add(
            new T.LineSegments(
              new T.BufferGeometry().setFromPoints(networkPoints),
              new T.LineBasicMaterial({
                color: 0x6b82ff,
                transparent: true,
                opacity: 0.27,
              }),
            ),
          );

        const packets = [];
        if (variant === 'network') {
          const core = new T.Mesh(
            new RoundedBoxGeometry(1.25, 1.25, 1.25, 3, 0.18),
            materials[1],
          );
          group.add(core);
          const coreRing = new T.Mesh(
            new T.TorusGeometry(1.05, 0.035, 12, 64),
            materials[0],
          );
          coreRing.rotation.x = Math.PI / 2;
          core.add(coreRing);
          objects.forEach(({ loose }, i) => {
            group.add(
              new T.Line(
                new T.BufferGeometry().setFromPoints([new T.Vector3(), loose]),
                new T.LineBasicMaterial({
                  color: 0x8eabff,
                  transparent: true,
                  opacity: 0.22,
                }),
              ),
            );
            const packet = new T.Mesh(
              new T.SphereGeometry(0.055, 8, 8),
              materials[1],
            );
            group.add(packet);
            packets.push({ packet, target: loose, offset: i / objects.length });
          });
        }

        const key = new T.DirectionalLight(0xffffff, 1.8);
        key.position.set(-4, 5, 8);
        scene.add(key);
        const fill = new T.DirectionalLight(0xb8ccff, 0.6);
        fill.position.set(4, -2, 3);
        scene.add(fill);
        const dustPositions = new Float32Array(160 * 3);

        for (let i = 0; i < 160; i++) {
          dustPositions[i * 3] = Math.sin(i * 12.71) * 12;
          dustPositions[i * 3 + 1] = Math.cos(i * 6.33) * 8;
          dustPositions[i * 3 + 2] = -3 - (i % 24);
        }

        const dustGeo = new T.BufferGeometry();
        dustGeo.setAttribute(
          'position',
          new T.BufferAttribute(dustPositions, 3),
        );
        const dust = new T.Points(
          dustGeo,
          new T.PointsMaterial({
            color: 0x8194ff,
            size: 0.026,
            transparent: true,
            opacity: 0.35,
          }),
        );

        if (hero || portal) scene.add(dust);

        let visible = true,
          frame = 0,
          time = 0,
          last = 0,
          px = 0,
          py = 0,
          rx = 0,
          ry = 0,
          width = 0,
          height = 0,
          lastState = '',
          localProgress = 0.5,
          needsRender = true;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const surface =
          el.closest('.hero-scene') ||
          el.closest('.capability-card') ||
          el.parentElement;

        const move = (e) => {
          const rect = surface.getBoundingClientRect();
          px = (e.clientX - rect.left) / rect.width - 0.5;
          py = (e.clientY - rect.top) / rect.height - 0.5;
          needsRender = true;
        };

        const reset = () => {
          px = py = 0;
        };

        surface.addEventListener('pointermove', move);
        surface.addEventListener('pointerleave', reset);

        const resize = () => {
          width = el.clientWidth;
          height = el.clientHeight;

          if (!width || !height) return;

          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          needsRender = true;
        };

        const ro = new ResizeObserver(resize);
        ro.observe(el);
        resize();

        const io = new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting;
          needsRender = true;
        });
        io.observe(el);

        const scroll = () => {
          const rect = el.getBoundingClientRect();
          localProgress = T.MathUtils.clamp(
            (innerHeight - rect.top) / (innerHeight + rect.height),
            0,
            1,
          );
          needsRender = true;
        };

        window.addEventListener('scroll', scroll, { passive: true });
        scroll();

        const smooth = (a, b, p) => {
          const t = T.MathUtils.clamp((p - a) / (b - a), 0, 1);

          return t * t * (3 - 2 * t);
        };

        let mix = 0;

        const render = (now) => {
          frame = requestAnimationFrame(render);
          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;

          if (!visible || document.hidden) return;

          const opts = options.current,
            still = opts.paused || reduced.matches;
          const p = hero
            ? still
              ? 0
              : opts.motion?.current?.progress || 0
            : localProgress;
          const state = `${still}-${opts.assembled}-${width}-${height}`;

          if (still && !needsRender && state === lastState) return;

          lastState = state;
          needsRender = false;

          if (!still) time += dt;

          const ease = 1 - Math.exp(-dt * 5);
          rx = T.MathUtils.lerp(rx, still ? 0 : px, ease);
          ry = T.MathUtils.lerp(ry, still ? 0 : py, ease);
          const assembly = opts.assembled ? 1 : smooth(0.06, 0.53, p);
          mix = still ? assembly : T.MathUtils.lerp(mix, assembly, ease);
          const travel = smooth(0.54, 1, p),
            mobile = width < 650;

          if (hero) {
            group.position.set(
              T.MathUtils.lerp(mobile ? 0.3 : 2.8, 0, smooth(0, 0.4, p)),
              mobile ? -0.35 : 0,
              0,
            );
            group.rotation.set(
              T.MathUtils.lerp(0.15, 0, mix) + ry * 0.12,
              T.MathUtils.lerp(-0.38, 0, mix) + rx * 0.18,
              T.MathUtils.lerp(0.08, 0, mix) + travel * 0.3,
            );
            group.scale.setScalar(mobile ? 0.77 : 1.1);
            camera.position.set(
              rx * 0.24,
              ry * 0.16,
              T.MathUtils.lerp(mobile ? 15 : 14.7, mobile ? 4.1 : 3.1, travel),
            );
          } else if (portal) {
            group.position.set(mobile ? 0 : 2.5, 0, 0);
            group.rotation.set(
              0.15 + ry * 0.12,
              -0.23 + rx * 0.15,
              time * 0.06 + localProgress * 0.6,
            );
            group.scale.setScalar(mobile ? 0.95 : 1.2);
            camera.position.z = 13 - localProgress * 3;
          } else {
            group.position.set(0, 0, 0);
            group.scale.setScalar(variant === 'network' ? 0.82 : 0.88);
            group.rotation.set(
              0.15 + ry * 0.25,
              rx * 0.3 +
                (localProgress - 0.5) * 1.4 +
                (variant === 'network' ? time * 0.045 : 0),
              variant === 'stack' ? (localProgress - 0.5) * 0.12 : 0,
            );
            camera.position.z = variant === 'stack' ? 9 : 12;
          }

          objects.forEach(
            ({ object, loose, tunnel, rotation, phase, angle }, i) => {
              if (hero) {
                object.position.lerpVectors(loose, tunnel, mix);
                object.position.y += still
                  ? 0
                  : Math.sin(time * 0.5 + phase) * 0.085 * (1 - mix);
                object.rotation.set(
                  rotation.x * (1 - mix) + (still ? 0 : time * 0.1) * (1 - mix),
                  rotation.y * (1 - mix),
                  rotation.z * (1 - mix) + angle * mix,
                );
              } else if (portal) {
                const layer = Math.floor(i / 12),
                  a = (i / 12) * Math.PI * 2;
                object.position.set(
                  Math.cos(a) * (3.6 + layer * 0.2),
                  Math.sin(a) * (3.6 + layer * 0.2),
                  -layer * 2,
                );
                object.rotation.set(0.2, a + time * 0.09, a);
              } else if (variant === 'stack') {
                object.position.set(
                  Math.sin(i * 0.4 + time * 0.3) * 0.1,
                  (i - 3.5) * (0.48 + localProgress * 0.13),
                  0,
                );
                object.rotation.set(
                  0,
                  i * 0.12 +
                    (still ? 0 : Math.sin(time * 0.3 + i * 0.12) * 0.3) +
                    localProgress * 0.55,
                  0,
                );
                object.scale.set(2.2, 1, 2.2);
              } else {
                object.position.copy(loose);
                object.rotation.set(
                  rotation.x + time * 0.09,
                  rotation.y + time * 0.07,
                  rotation.z,
                );
              }
            },
          );
          packets.forEach(({ packet, target, offset }) => {
            packet.position
              .copy(target)
              .multiplyScalar((time * 0.16 + offset) % 1);
          });
          dust.rotation.z = time * 0.012;
          camera.lookAt(0, 0, -2);
          renderer.render(scene, camera);
        };

        const invalidate = () => {
          needsRender = true;
        };

        reduced.addEventListener('change', invalidate);
        frame = requestAnimationFrame(render);
        cleanup = () => {
          cancelAnimationFrame(frame);
          ro.disconnect();
          io.disconnect();
          window.removeEventListener('scroll', scroll);
          reduced.removeEventListener('change', invalidate);
          surface.removeEventListener('pointermove', move);
          surface.removeEventListener('pointerleave', reset);
          scene.traverse((o) => {
            o.geometry?.dispose();

            if (o.material)
              (Array.isArray(o.material) ? o.material : [o.material]).forEach(
                (m) => m.dispose(),
              );
          });
          dustGeo.dispose();
          dust.material.dispose();
          beam.dispose();
          ring.dispose();
          block.dispose();
          materials.forEach((m) => m.dispose());
          env.dispose();
          pmrem.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch (error) {
        if (!disposed) {
          setFailed(true);
          el.closest('.scroll-story')?.classList.add('scene-unavailable');
        }
      }
    }

    const loader = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          init();
          loader.disconnect();
        }
      },
      { rootMargin: '250px' },
    );
    loader.observe(el);

    return () => {
      disposed = true;
      loader.disconnect();
      cleanup();
    };
  }, [variant]);

  return (
    <div
      ref={host}
      className={`sculpture sculpture-${variant}`}
      aria-hidden="true"
    >
      {failed && (
        <div className="scene-fallback">DATA → INTELLIGENCE → ACTION</div>
      )}
    </div>
  );
}
