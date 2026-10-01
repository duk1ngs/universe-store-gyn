"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  float ring(vec2 point, float radius, float width) {
    float distanceFromCenter = length(point);
    return 1.0 - smoothstep(0.0, width, abs(distanceFromCenter - radius));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    float distanceFromCenter = length(uv);
    float angle = atan(uv.y, uv.x);
    float pulse = sin(angle * 2.0 - u_time * 0.19) * 0.006;
    vec2 diskUv = vec2(uv.x, uv.y * 1.7);
    float disk = ring(diskUv, 0.39 + pulse, 0.095);
    float diskLight = (0.68 + 0.32 * sin(angle * 2.0 + u_time * 0.22)) * disk;
    float halo = ring(uv, 0.255 + pulse, 0.052);
    float lens = ring(uv, 0.297, 0.043) * 0.42;
    float innerHalo = ring(uv, 0.218, 0.019) * 0.31;
    float dustArc = ring(diskUv, 0.47 + pulse * 0.6, 0.045) * (0.38 + 0.62 * sin(angle * 11.0 - u_time * 0.27) * sin(angle * 5.0 + u_time * 0.16));
    float falloff = 1.0 - smoothstep(0.07, 0.85, distanceFromCenter);
    float voidMask = 1.0 - smoothstep(0.14, 0.22, distanceFromCenter);
    float light = (diskLight * 0.11 + halo * 0.19 + lens * 0.09 + innerHalo * 0.11 + max(dustArc, 0.0) * 0.035) * falloff;
    float haze = (1.0 - smoothstep(0.32, 1.15, distanceFromCenter)) * 0.014;

    vec2 starGrid = uv * 47.0;
    vec2 starCell = floor(starGrid);
    float starSeed = hash(starCell);
    vec2 starOffset = vec2(hash(starCell + 17.0), hash(starCell + 31.0)) - 0.5;
    float star = step(0.985, starSeed) * (1.0 - smoothstep(0.015, 0.085, length(fract(starGrid) - 0.5 - starOffset * 0.45)));
    star *= 0.13 + 0.045 * sin(u_time * 0.5 + starSeed * 19.0);

    vec3 color = vec3(0.012 + haze + light + star);
    color *= 1.0 - voidMask * 0.995;
    float visibleLight = smoothstep(0.004, 0.085, haze + light + star);
    float alpha = clamp(voidMask + visibleLight * 0.92, 0.0, 1.0);
    gl_FragColor = vec4(color, alpha);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function BlackHole({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!canvas || !gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    const time = gl.getUniformLocation(program, "u_time");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const startedAt = performance.now();
    let frame = 0;
    let running = false;
    let lastRender = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
    };

    const render = (now: number, force = false) => {
      if (force || now - lastRender >= 33) {
        lastRender = now;
        gl.uniform1f(time, reducedMotion.matches ? 0 : (now - startedAt) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (running) frame = requestAnimationFrame(render);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      running = !reducedMotion.matches && !document.hidden;
      render(performance.now(), true);
    };

    const observer = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);
    if (!observer) window.addEventListener("resize", resize, { passive: true });
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    resize();
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("black-hole-canvas", className)} aria-hidden="true" />;
}
