"use client";

import { useEffect, useRef } from "react";

// Adapted from the Be Store intro's slow monochrome fluid field.
// The canvas stays behind the content; product color is handled by the hero.
const vertex = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragment = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - 1.0), u.x), u.y);
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
    float t = u_time * 0.055;
    float drift = noise(p * 2.2 + vec2(t, -t * 0.45));
    float beam = smoothstep(0.08, 0.72, noise(vec2(p.x * 0.95 + p.y * 1.5 - t + drift * 0.32, t * 0.2)));
    float side = 1.0 - smoothstep(0.15, 1.22, length(p));
    float light = beam * side * 0.105;
    gl_FragColor = vec4(vec3(0.008 + light), 1.0);
  }
`;

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const result = gl.createShader(type);
  if (!result) return null;
  gl.shaderSource(result, source);
  gl.compileShader(result);
  if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
    gl.deleteShader(result);
    return null;
  }
  return result;
}

export function UniverseAmbient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!canvas || !gl) return;
    const vert = shader(gl, gl.VERTEX_SHADER, vertex);
    const frag = shader(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vert || !frag || !program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let active = false;
    const started = performance.now();
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
    };
    const draw = (now: number) => {
      if (now - last > 50 || !active) {
        last = now;
        gl.uniform1f(time, motion.matches ? 0 : (now - started) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (active) frame = window.requestAnimationFrame(draw);
    };
    const sync = () => {
      window.cancelAnimationFrame(frame);
      active = !motion.matches && !document.hidden;
      draw(performance.now());
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    resize();
    sync();
    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, []);

  return <canvas className="universe-ambient-field" ref={canvasRef} aria-hidden="true" />;
}
