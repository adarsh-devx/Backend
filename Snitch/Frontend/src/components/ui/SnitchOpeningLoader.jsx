import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * SnitchOpeningLoader
 * EXACT WebGL Perlin Noise Upward Dissolve Animation extracted directly from meermohsin.me:
 * 1. Fixed full-screen preloader overlay (.site-pre-loader) with body scroll locked (zero right-side scrollbar/border)
 * 2. Exact giant cursive calligraphy counter in 'Ruthie' font (000 -> 100)
 * 3. Exact WebGL 3-octave Perlin noise upward dissolve shader with tight, compact distance between Black and White
 * 4. Crisp organic liquid burning edge moving from bottom to top, revealing the Snitch homepage underneath
 * 5. Snitch Atelier palette: Obsidian Noir (#0a0a0c) & Bone Ivory (#F3F1E9)
 * 6. Zero clutter (no soundwaves, no extra text)
 */
export default function SnitchOpeningLoader({ onComplete }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const countRef = useRef(null);

  const [isRendered, setIsRendered] = useState(true);

  useEffect(() => {
    // Lock scroll on body and documentElement to eliminate any right-side scrollbar gray/white border
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // In development, allow user to always see the animation on reload
    // Only skip if explicitly requested via ?no_loader=true
    const skipLoader = window.location.search.includes("no_loader=true");
    if (skipLoader) {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      setIsRendered(false);
      if (onComplete) onComplete();
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const countEl = countRef.current;
    if (!canvas || !container || !countEl) return;

    // --- WebGL Context & Exact Shader from meermohsin.me ---
    const gl =
      canvas.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: false }) ||
      canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });

    if (!gl) {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      setIsRendered(false);
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // EXACT Fragment Shader from meermohsin.me, with tightened black-white transition distance
    const fsSource = `
      precision highp float;
      uniform float uTransition;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec3 uBorderColor;
      varying vec2 vUv;

      // CLASSIC 3D PERLIN NOISE FUNCTIONS (Exact from meermohsin.me)
      vec4 permute(vec4 x) { return mod(((x*104.0)+1.0)*x, 289.0); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

      float cnoise(vec3 P) {
        vec3 Pi0 = floor(P);
        vec3 Pi1 = Pi0 + vec3(1.0);
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P);
        vec3 Pf1 = Pf0 - vec3(1.0);
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g100, g100), dot(g010, g010), dot(g110, g110)));
        g000 *= norm0.x;
        g100 *= norm0.y;
        g010 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g101, g101), dot(g011, g011), dot(g111, g111)));
        g001 *= norm1.x;
        g101 *= norm1.y;
        g011 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        float n_z = mix(mix(n000, n100, fade_xyz.x), mix(n010, n110, fade_xyz.x), fade_xyz.y);
        float n_dz = mix(mix(n001, n101, fade_xyz.x), mix(n011, n111, fade_xyz.x), fade_xyz.y);
        return 2.2 * mix(n_z, n_dz, fade_xyz.z);
      }

      void main() {
        // 1. Pixelation filter from meermohsin.me
        float pixelSize = 0.1;
        vec2 grid = uResolution / pixelSize;
        vec2 pixelatedUv = floor(vUv * grid) / grid;

        // 2. Correct aspect ratio
        float aspect = uResolution.x / uResolution.y;
        vec2 correctedUv = (pixelatedUv - 0.5) * vec2(aspect, 1.0) + 0.5;

        // EXACT Bottom -> Top reveal formula from meermohsin.me
        float reveal = mix(-1.5, 1.5, correctedUv.y);

        // 3-octave organic noisy edge
        float noise =
          cnoise(vec3(correctedUv * 4.0, uTime * 0.15)) * 0.35 +
          cnoise(vec3(correctedUv * 12.0, uTime * 0.30)) * 0.18 +
          cnoise(vec3(correctedUv * 24.0, uTime * 0.50)) * 0.08;

        // Reveal threshold moving upward
        float threshold = mix(-3.0, 2.0, uTransition);

        // Tightened slope factor: narrows the distance between Black and White so they are close and crisp
        float slope = 2.8;
        float rawStrength = (reveal + noise - threshold) * slope;
        float strength = clamp(rawStrength, 0.0, 1.0);

        // Volumetric Glow Edge Detection (tight band along the organic boundary)
        float edge = 1.0 - abs(rawStrength);
        edge = pow(clamp(edge, 0.0, 1.0), 6.0);
        edge *= min(uTransition * 1.5, 1.0);

        // Snitch Atelier Palette: Deep Obsidian Noir & Bone Ivory Luminescence
        vec3 deepMidnightColor = vec3(0.06, 0.06, 0.07);
        vec3 richGlowingColor = uBorderColor * 1.4;

        vec3 edgeColor = mix(
          deepMidnightColor,
          richGlowingColor,
          sin(uTime * 1.5) * 0.5 + 0.5
        );

        vec3 baseObsidian = vec3(0.04, 0.04, 0.05); // #0a0a0c

        vec3 planeColor = mix(
          baseObsidian,
          edgeColor * 5.0,
          edge
        );

        // Combine solid plane opacity and retro glow
        float finalAlpha = max(strength, edge);

        // Subtle scanlines & film grain from meermohsin.me
        float scan = sin(gl_FragCoord.y * 2.5) * 0.02;
        planeColor += scan;

        float grain = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711, 0.00584))));
        planeColor += (grain - 0.5) * 0.02;

        gl_FragColor = vec4(planeColor, finalAlpha);
      }
    `;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "position");

    const uTransitionLoc = gl.getUniformLocation(prog, "uTransition");
    const uResolutionLoc = gl.getUniformLocation(prog, "uResolution");
    const uTimeLoc = gl.getUniformLocation(prog, "uTime");
    const uBorderColorLoc = gl.getUniformLocation(prog, "uBorderColor");

    let uniforms = {
      transition: 0.0,
      time: 0.0,
      width: window.innerWidth,
      height: window.innerHeight,
    };

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      uniforms.width = canvas.width;
      uniforms.height = canvas.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let startTime = performance.now();
    let animId;

    function renderLoop() {
      const now = performance.now();
      uniforms.time = (now - startTime) / 1000;

      // Clear buffer to transparent every frame so dissolving alpha reveals HTML content
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uTransitionLoc, uniforms.transition);
      gl.uniform2f(uResolutionLoc, uniforms.width, uniforms.height);
      gl.uniform1f(uTimeLoc, uniforms.time);
      // Bone Ivory luminescence for Snitch edge glow
      gl.uniform3f(uBorderColorLoc, 0.95, 0.94, 0.91);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(renderLoop);
    }
    animId = requestAnimationFrame(renderLoop);

    // --- EXACT GSAP NUMBER COUNTER & WEBGL DISSOLVE SEQUENCE from meermohsin.me ---
    const counterObj = { value: 0 };
    let hasTriggeredDissolve = false;

    function triggerDissolve() {
      if (hasTriggeredDissolve) return;
      hasTriggeredDissolve = true;

      // Allow background transparency on container as dissolve starts
      if (container) {
        container.style.backgroundColor = "transparent";
      }

      // Animate WebGL Perlin Noise Dissolve upward (3 seconds with power2.inOut)
      gsap.to(uniforms, {
        transition: 1.0,
        duration: 3.0,
        ease: "power2.inOut",
        onComplete() {
          sessionStorage.setItem("snitch_loader_played", "true");
          cancelAnimationFrame(animId);
          window.removeEventListener("resize", resize);
          document.body.style.overflow = prevBodyOverflow;
          document.documentElement.style.overflow = prevHtmlOverflow;
          setIsRendered(false);
          if (onComplete) onComplete();
        },
      });
    }

    // Number counting (000 to 100 over 3.2s)
    gsap.to(counterObj, {
      value: 100,
      duration: 3.2,
      ease: "power2.inOut",
      onUpdate() {
        if (countEl) {
          countEl.textContent = Math.floor(counterObj.value)
            .toString()
            .padStart(3, "0");
        }
      },
      onComplete() {
        // Fade out counter numbers smoothly over 1.45s as in meermohsin.me
        gsap.to(countEl, {
          opacity: 0,
          duration: 1.45,
          ease: "power3.out",
        });

        // Dissolve completes and container fades out
        gsap.to(container, {
          opacity: 0,
          duration: 0.5,
          delay: 2.5,
          ease: "power3.out",
        });
      },
    });

    // Exactly like meermohsin.me: dissolve triggers at 2.8s as counter reaches 100
    const dissolveTimer = setTimeout(() => {
      triggerDissolve();
    }, 2800);

    return () => {
      clearTimeout(dissolveTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [onComplete]);

  if (!isRendered) return null;

  return (
    <>
      {/* EXACT CSS Structure from meermohsin.me with zero scrollbar borders */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ruthie&display=swap');

        .site-pre-loader {
          position: fixed;
          inset: 0;
          width: 100vw;
          width: 100%;
          height: 100vh;
          height: 100%;
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
          z-index: 99999999;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #0a0a0c; /* Start with obsidian black to guarantee 0 seam or border */
          pointer-events: auto;
          user-select: none;
          overflow: hidden;
        }

        #loader-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          display: block;
          z-index: 0;
          pointer-events: none;
        }

        /* Film grain texture overlay from meermohsin.me */
        .site-pre-loader::after {
          content: "";
          position: absolute;
          top: -12.5%;
          left: -12.5%;
          z-index: 5;
          width: 125%;
          height: 125%;
          background: url(https://user-images.githubusercontent.com/22321142/100630839-55bd1f00-332b-11eb-9e4c-5989758da284.png) repeat center center;
          opacity: 0.12;
          pointer-events: none;
        }

        /* Number count overlay matching meermohsin.me structure & Ruthie font */
        .number-count {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 20;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 1;
          font-family: 'Ruthie', cursive;
          font-size: clamp(9rem, 26vw, 24rem);
          color: #F3F1E9; /* Snitch signature bone ivory */
          text-shadow: 0 0 35px rgba(243, 241, 233, 0.15);
          pointer-events: none;
          will-change: opacity;
        }
      `}</style>

      <div className="site-pre-loader" ref={containerRef}>
        {/* Exact WebGL Perlin Noise Dissolve Canvas */}
        <canvas id="loader-canvas" ref={canvasRef} />

        {/* Center Giant Ruthie Number Count */}
        <div className="number-count" ref={countRef}>
          000
        </div>
      </div>
    </>
  );
}
