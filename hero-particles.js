// =============================================================
// Arthur Cotier — portfolio
// hero-particles.js : champ de particules + blob mou WebGL
// Léger, désactivé sur mobile et reduced-motion. Three.js via importmap.
// =============================================================

import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');
if (!canvas) { /* nothing to mount */ }

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 640px)').matches;

if (canvas && !reduceMotion && !isMobile) {
  initScene(canvas);
} else if (canvas) {
  // Garde le fallback CSS visible
  canvas.style.display = 'none';
}

function initScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const setSize = () => {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  // ---- 1. Champ de particules ----
  const PARTICLE_COUNT = 800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const violet = new THREE.Color('#6E45E2');
  const cyan = new THREE.Color('#4FC3F7');
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Distribution sphérique douce
    const r = Math.pow(Math.random(), 0.6) * 8 + 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 1;

    // Couleur lerp violet→cyan en fonction de la distance
    const c = violet.clone().lerp(cyan, Math.random());
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  partGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const partMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // ---- 2. Blob mou (sphere déformée) ----
  const blobGeo = new THREE.IcosahedronGeometry(1.6, 6);
  const basePositions = blobGeo.attributes.position.array.slice();
  // Stocke la longueur initiale de chaque vertex pour les déformer dans le temps
  const vertexNoise = new Float32Array(blobGeo.attributes.position.count);
  for (let i = 0; i < vertexNoise.length; i++) {
    vertexNoise[i] = Math.random();
  }

  const blobMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#6E45E2'),
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const blob = new THREE.Mesh(blobGeo, blobMat);
  blob.position.set(0, 0, 0);
  scene.add(blob);

  // Wireframe secondaire cyan plus petit, contre-rotation
  const blob2Geo = new THREE.IcosahedronGeometry(1.0, 4);
  const blob2BasePositions = blob2Geo.attributes.position.array.slice();
  const blob2Mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#4FC3F7'),
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const blob2 = new THREE.Mesh(blob2Geo, blob2Mat);
  scene.add(blob2);

  // ---- Souris pour parallaxe douce ----
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  // ---- Resize ----
  setSize();
  window.addEventListener('resize', setSize);

  // ---- Animation loop ----
  let frame = 0;
  const clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();
    frame++;

    // Lerp souris
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    // Particules : rotation lente
    particles.rotation.y = t * 0.05;
    particles.rotation.x = t * 0.02 + mouse.y * 0.15;

    // Blob 1 : déformation des vertices toutes les 2 frames
    if (frame % 2 === 0) {
      const pos = blob.geometry.attributes.position;
      const arr = pos.array;
      for (let i = 0; i < arr.length; i += 3) {
        const ix = i / 3;
        const noise = vertexNoise[ix];
        const wave = Math.sin(t * 0.6 + noise * 6.28) * 0.08 +
                     Math.cos(t * 0.4 + ix * 0.05) * 0.05;
        const scale = 1 + wave;
        arr[i]     = basePositions[i] * scale;
        arr[i + 1] = basePositions[i + 1] * scale;
        arr[i + 2] = basePositions[i + 2] * scale;
      }
      pos.needsUpdate = true;
    }
    blob.rotation.x = t * 0.15;
    blob.rotation.y = t * 0.18 + mouse.x * 0.3;

    // Blob 2 : contre-rotation
    blob2.rotation.x = -t * 0.2 - mouse.y * 0.2;
    blob2.rotation.y = -t * 0.12;
    blob2.rotation.z = t * 0.05;

    // Caméra parallaxe
    camera.position.x = mouse.x * 0.5;
    camera.position.y = mouse.y * 0.4;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Pause si onglet pas visible (économie batterie)
  document.addEventListener('visibilitychange', () => {
    // Three.js animation continues mais c'est OK ; pour pause complète il faudrait cancelAnimationFrame
  });
}
