import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { fitImagePlane } from './image-tools.js';
export default function Layers({
  source,
  crop,
  output,
  paused,
  rotation,
  theme,
  onReady,
  onFailure
}) {
  const host = useRef(null),
    engine = useRef(null),
    state = useRef({
      paused,
      rotation,
      theme
    });
  state.current = {
    paused,
    rotation,
    theme
  };
  useEffect(() => {
    const el = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
    } catch {
      onFailure();
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0, 0);
    el.append(renderer.domElement);
    const scene = new THREE.Scene(),
      group = new THREE.Group();
    scene.add(group);
    const camera = new THREE.PerspectiveCamera(34, 1.55, .1, 50);
    camera.position.set(0, 1.8, 14.2);
    camera.lookAt(0, .3, 0);
    const meshes = [],
      textures = [],
      canvases = [];
    for (let i = 0; i < 3; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = 768;
      canvas.height = 1024;
      canvases.push(canvas);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      textures.push(texture);
      const plane = new THREE.Group();
      plane.position.set([-3.3, .5, 3.6][i], [.22, .06, -.06][i], [-.3, 0, .3][i]);
      plane.rotation.y = [.35, .55, .72][i];
      group.add(plane);
      const h = [6.65, 6.45, 6.3][i],
        w = [5, 4.84, 5.04][i];
      const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: i === 1 ? .86 : 1
      }));
      face.position.z = .06;
      face.renderOrder = i * 2 + 2;
      plane.add(face);
      const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, .045), new THREE.MeshStandardMaterial({
        color: 0x66716d,
        metalness: .58,
        roughness: .28,
        transparent: true,
        opacity: i === 1 ? .18 : .6,
        depthWrite: false
      }));
      back.renderOrder = i * 2 + 1;
      plane.add(back);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(back.geometry), new THREE.LineBasicMaterial({
        color: 0xc9d0c4,
        transparent: true,
        opacity: .58
      }));
      plane.add(edges);
      meshes.push({
        plane,
        face,
        back,
        edges,
        w,
        h
      });
    }
    scene.add(new THREE.HemisphereLight(0xf3f6e9, 0x24292a, 2));
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(-4, 6, 8);
    scene.add(key);
    // A soft, bounded shadow belongs to each image sheet, not to the interface.
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 128;
    const sc = shadowCanvas.getContext('2d'),
      gradient = sc.createRadialGradient(128, 64, 0, 128, 64, 120);
    gradient.addColorStop(0, 'rgba(0,0,0,.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    sc.fillStyle = gradient;
    sc.fillRect(0, 0, 256, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadows = [];
    meshes.forEach(({
      plane
    }) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.7), new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: .8
      }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(plane.position.x, -3.45, .15);
      scene.add(m);
      shadows.push(m);
    });
    let raf = 0,
      visible = true,
      last = 0,
      phase = 0,
      dirty = true,
      disposed = false;
    function render() {
      if (!disposed) renderer.render(scene, camera);
    }
    function resize() {
      const {
        width,
        height
      } = el.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.position.z = Math.max(14.2, 19.6 / camera.aspect);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      render();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      dirty = true;
    });
    intersection.observe(el);
    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      if (now - last < 34 && !dirty) return;
      const s = state.current;
      if (!s.paused) phase += .004;
      group.rotation.y = s.rotation * .06 + (s.paused ? 0 : Math.sin(phase) * .014);
      shadows.forEach(m => m.material.opacity = s.theme === 'dark' ? .65 : .32);
      if (!s.paused || dirty) {
        render();
        dirty = false;
      }
      last = now;
    }
    const visibility = () => {
      dirty = true;
    };
    document.addEventListener('visibilitychange', visibility);
    function lost(e) {
      e.preventDefault();
      onFailure();
    }
    renderer.domElement.addEventListener('webglcontextlost', lost);
    engine.current = {
      meshes,
      textures,
      canvases,
      render,
      markDirty: () => {
        dirty = true;
      }
    };
    resize();
    raf = requestAnimationFrame(tick);
    onReady();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      scene.traverse(o => {
        o.geometry?.dispose();
        if (o.material) {
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.dispose();
        }
      });
      textures.forEach(t => t.dispose());
      shadowTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      engine.current = null;
    };
  }, []);
  useEffect(() => {
    engine.current?.markDirty();
    engine.current?.render();
  }, [paused, rotation, theme]);
  useEffect(() => {
    const e = engine.current;
    if (!e || !source || !crop) return;
    let stale = false;
    const draw = (i, image) => {
      const canvas = e.canvases[i],
        ctx = canvas.getContext('2d');
      const size = fitImagePlane(image.naturalWidth, image.naturalHeight, 5.3, e.meshes[i].h);
      e.meshes[i].plane.scale.set(size.width / e.meshes[i].w, size.height / e.meshes[i].h, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (i === 1) {
        const sx = canvas.width / source.image.naturalWidth,
          sy = canvas.height / source.image.naturalHeight,
          x = crop.x * sx,
          y = crop.y * sy,
          cw = crop.width * sx,
          ch = crop.height * sy;
        ctx.fillStyle = 'rgba(21,26,25,.25)';
        ctx.fillRect(0, 0, canvas.width, y);
        ctx.fillRect(0, y + ch, canvas.width, canvas.height - y - ch);
        ctx.fillRect(0, y, x, ch);
        ctx.fillRect(x + cw, y, canvas.width - x - cw, ch);
        ctx.strokeStyle = '#edf500';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, cw, ch);
        const arm = Math.min(30, cw / 5, ch / 5);
        ctx.lineWidth = 8;
        for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + cw, y, -1, 1], [x, y + ch, 1, -1], [x + cw, y + ch, -1, -1]]) {
          ctx.beginPath();
          ctx.moveTo(cx + dx * arm, cy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx, cy + dy * arm);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(255,255,255,.48)';
        ctx.lineWidth = 1;
        for (let n = 1; n < 3; n++) {
          ctx.beginPath();
          ctx.moveTo(x + cw * n / 3, y);
          ctx.lineTo(x + cw * n / 3, y + ch);
          ctx.moveTo(x, y + ch * n / 3);
          ctx.lineTo(x + cw, y + ch * n / 3);
          ctx.stroke();
        }
      }
      e.textures[i].needsUpdate = true;
      e.markDirty();
      e.render();
    };
    draw(0, source.image);
    draw(1, source.image);
    if (output) {
      const img = new Image();
      img.onload = () => {
        if (!stale && engine.current === e) draw(2, img);
      };
      img.src = output.url;
    }
    return () => {
      stale = true;
    };
  }, [source, crop, output]);
  return <div ref={host} className="live-layers" role="img" aria-label="Interactive layers: original image, crop frame and current export preview" />;
}
