"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const MASK_SIZE = 1024;
const BRUSH_RADIUS = 120;
const BASE_OFFSET_Y = -0.14;

function fitCover(plane, texture, width, height) {
  if (!texture?.image || !width || !height) return;
  const imgAspect = texture.image.width / texture.image.height;
  const winAspect = width / height;

  if (imgAspect >= winAspect) {
    plane.scale.set(imgAspect, 1, 1);
  } else {
    plane.scale.set(winAspect, winAspect / imgAspect, 1);
  }
}

export default function HeroImageReveal({
  className,
  mainImage = "/assets/Harshad_image_1.webp",
  secondImage = "/assets/Harshad_image_2.webp",
  interactionRef,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const interactionEl =
      interactionRef?.current || container.closest("section") || container;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const getSize = () => ({
      width: container.clientWidth || window.innerWidth,
      height: container.clientHeight || window.innerHeight,
    });

    const updateCamera = () => {
      const { width, height } = getSize();
      const aspect = width / Math.max(height, 1);
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    updateCamera();

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = MASK_SIZE;
    maskCanvas.height = MASK_SIZE;
    const maskCtx = maskCanvas.getContext("2d", { alpha: true });
    if (!maskCtx) return () => renderer.dispose();
    maskCtx.fillStyle = "black";
    maskCtx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);

    const maskTexture = new THREE.CanvasTexture(maskCanvas);
    maskTexture.minFilter = THREE.LinearFilter;
    maskTexture.magFilter = THREE.LinearFilter;

    const paintBrush = (x, y, dx = 0, dy = 0) => {
      const speed = Math.hypot(dx, dy);
      const angle = speed > 1 ? Math.atan2(dy, dx) : 0;
      const stretch = 1 + Math.min(speed / (BRUSH_RADIUS * 0.4), 3.0);

      maskCtx.save();
      maskCtx.translate(x, y);
      maskCtx.rotate(angle);
      maskCtx.scale(stretch, 1);

      const gradient = maskCtx.createRadialGradient(0, 0, 0, 0, 0, BRUSH_RADIUS);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.65, "rgba(255,255,255,0.9)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");

      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.fillStyle = gradient;
      maskCtx.beginPath();
      maskCtx.arc(0, 0, BRUSH_RADIUS, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.restore();

      maskTexture.needsUpdate = true;
    };

    const plane1Material = new THREE.MeshBasicMaterial();
    const plane1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), plane1Material);
    plane1.position.z = 0;
    scene.add(plane1);

    const plane2Material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: { value: null },
        uMask: { value: maskTexture },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uMask;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec2 wUv = vUv + vec2(
            sin(vUv.y * 5.0 + uTime * 0.9) * 0.02,
            cos(vUv.x * 5.0 + uTime * 0.7) * 0.02
          );

          vec2 d1 = vec2(
            sin(wUv.y * 4.0 + uTime * 1.4) * cos(wUv.x * 3.0 + uTime * 1.1),
            cos(wUv.x * 3.5 + uTime * 1.3) * sin(wUv.y * 2.5 + uTime * 0.9)
          ) * 0.045;

          vec2 d2 = vec2(
            sin(wUv.y * 11.0 - uTime * 2.6 + wUv.x * 5.0),
            cos(wUv.x * 9.0  + uTime * 2.9 - wUv.y * 6.0)
          ) * 0.022;
          vec2 distort = d1 + d2;

          float mask = texture2D(uMask, vUv + distort).r;

          float noise =
            sin(vUv.x * 18.0 + uTime * 2.0) * cos(vUv.y * 16.0 + uTime * 1.7) * 0.22
            + sin(vUv.x * 38.0 - uTime * 3.2) * cos(vUv.y * 33.0 + uTime * 2.6) * 0.11;

          float edgeMask = smoothstep(0.05, 0.35, mask) * (1.0 - smoothstep(0.35, 0.65, mask));
          float liquidMask = mask + noise * edgeMask * 1.8;
          float alpha = smoothstep(0.45, 0.55, liquidMask);

          vec4 imgColor = texture2D(uTexture, vUv);
          vec4 revealColor = vec4(imgColor.rgb, alpha);

          float t = mod(uTime, 5.0) / 5.0;
          float target = t * 2.5 - 0.25;
          float dist = (vUv.x + vUv.y) - target;
          float sweepIntensity = max(0.0, 1.0 - abs(dist) / 0.1);

          vec2 grid = fract(vUv * 100.0);
          float thickness = 0.03;
          bool isLine = grid.x < thickness || grid.y < thickness || abs(grid.x - grid.y) < thickness;

          vec4 wireColor = vec4(0.0);
          if (sweepIntensity > 0.0) {
            float baseAlpha = sweepIntensity * 0.18;
            wireColor = vec4(imgColor.rgb, isLine ? sweepIntensity : baseAlpha);
          }

          gl_FragColor = mix(revealColor, wireColor, wireColor.a);
        }
      `,
    });

    const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), plane2Material);
    plane2.position.z = 0.01;
    scene.add(plane2);

    const textureLoader = new THREE.TextureLoader();
    let disposed = false;

    textureLoader.load(mainImage, (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      plane1Material.map = tex;
      plane1Material.needsUpdate = true;
      const { width, height } = getSize();
      fitCover(plane1, tex, width, height);
    });

    textureLoader.load(secondImage, (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      plane2Material.uniforms.uTexture.value = tex;
      plane2Material.needsUpdate = true;
      const { width, height } = getSize();
      fitCover(plane2, tex, width, height);
    });

    let mouseNormX = 0;
    let mouseNormY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let smoothZ = 0;
    let prevMouse = null;
    let lastMouseTime = performance.now();

    const worldToMask = (worldX, worldY) => {
      const scaleX = plane2.scale.x;
      const scaleY = plane2.scale.y;
      const localX = worldX - plane2.position.x;
      const localY = worldY - plane2.position.y;
      const cx = ((localX + scaleX) / (2 * scaleX)) * MASK_SIZE;
      const cy = ((scaleY - localY) / (2 * scaleY)) * MASK_SIZE;
      return { cx, cy };
    };

    const handleMove = (clientX, clientY) => {
      lastMouseTime = performance.now();
      const { width, height } = getSize();
      mouseNormX = (clientX / width - 0.5) * 2;
      mouseNormY = -(clientY / height - 0.5) * 2;
      const winAspect = width / Math.max(height, 1);
      const worldX = ((clientX / width) * 2 - 1) * winAspect;
      const worldY = 1 - (clientY / height) * 2;
      const { cx, cy } = worldToMask(worldX, worldY);

      if (prevMouse) {
        const dx = cx - prevMouse.x;
        const dy = cy - prevMouse.y;
        const steps = Math.max(1, Math.floor(Math.hypot(dx, dy) / (BRUSH_RADIUS * 0.25)));
        for (let i = 0; i <= steps; i += 1) {
          paintBrush(
            prevMouse.x + (dx * i) / steps,
            prevMouse.y + (dy * i) / steps,
            dx,
            dy,
          );
        }
      } else {
        paintBrush(cx, cy);
      }
      prevMouse = { x: cx, y: cy };
    };

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      handleMove(x, y);
    };

    const onMouseLeave = () => {
      prevMouse = null;
    };

    const onTouchStart = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      const rect = container.getBoundingClientRect();
      prevMouse = null;
      handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    const onTouchMove = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      const rect = container.getBoundingClientRect();
      handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    const onTouchEnd = () => {
      prevMouse = null;
    };

    const onResize = () => {
      updateCamera();
      if (plane1Material.map) {
        const { width, height } = getSize();
        fitCover(plane1, plane1Material.map, width, height);
      }
      if (plane2Material.uniforms.uTexture.value) {
        const { width, height } = getSize();
        fitCover(plane2, plane2Material.uniforms.uTexture.value, width, height);
      }
    };

    interactionEl.addEventListener("mousemove", onMouseMove);
    interactionEl.addEventListener("mouseleave", onMouseLeave);
    interactionEl.addEventListener("touchstart", onTouchStart, { passive: true });
    interactionEl.addEventListener("touchmove", onTouchMove, { passive: true });
    interactionEl.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      const elapsed = clock.getElapsedTime();
      plane2Material.uniforms.uTime.value = elapsed;

      const secondsSinceMouse = (performance.now() - lastMouseTime) / 1000;
      const targetX = mouseNormX;
      const targetY = mouseNormY;

      if (secondsSinceMouse > 2.0) {
        const zigX = Math.sin(elapsed * 1.1);
        const zigY = Math.sin(elapsed * 0.7);
        const { width, height } = getSize();
        const winAspect = width / Math.max(height, 1);
        const worldX = zigX * winAspect;
        const worldY = zigY;
        const { cx, cy } = worldToMask(worldX, worldY);
        paintBrush(cx, cy);
      }

      smoothX += (targetX - smoothX) * 0.06;
      smoothY += (targetY - smoothY) * 0.06;
      const dist = Math.hypot(targetX, targetY);
      smoothZ += (dist - smoothZ) * 0.06;

      plane1.position.x = smoothX * 0.004;
      plane1.position.y = BASE_OFFSET_Y + smoothY * 0.004;
      plane1.position.z = -smoothZ * 0.01;

      plane2.position.x = smoothX * 0.007;
      plane2.position.y = BASE_OFFSET_Y + smoothY * 0.007;
      plane2.position.z = 0.01 + smoothZ * 0.015;

      // Keep planes front-facing to avoid edge clipping on top during hover.
      plane1.rotation.set(0, 0, 0);
      plane2.rotation.set(0, 0, 0);

      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.fillStyle = "rgba(0,0,0,0.018)";
      maskCtx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
      maskTexture.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      interactionEl.removeEventListener("mousemove", onMouseMove);
      interactionEl.removeEventListener("mouseleave", onMouseLeave);
      interactionEl.removeEventListener("touchstart", onTouchStart);
      interactionEl.removeEventListener("touchmove", onTouchMove);
      interactionEl.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);

      if (plane1Material.map) plane1Material.map.dispose();
      if (plane2Material.uniforms.uTexture.value) {
        plane2Material.uniforms.uTexture.value.dispose();
      }
      plane1.geometry.dispose();
      plane2.geometry.dispose();
      plane1Material.dispose();
      plane2Material.dispose();
      maskTexture.dispose();
      renderer.dispose();
    };
  }, [mainImage, secondImage, interactionRef]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
}
