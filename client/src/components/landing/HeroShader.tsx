import React, { useEffect, useRef } from "react";

export const HeroShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
    });
    resizeObserver.observe(canvas);
    syncSize();

    const glCtx =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!glCtx) return;
    const gl = glCtx;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float t = u_time * 0.15;
        vec2 mouseNorm = (u_mouse - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
        float mouseDist = length(uv - mouseNorm);
        float mouseGlow = smoothstep(0.4, 0.0, mouseDist) * 0.25;

        vec2 q = vec2(0.0);
        q.x = fbm(uv * 1.5 + vec2(t * 0.2, t * 0.1));
        q.y = fbm(uv * 1.5 + vec2(1.0));

        vec2 r = vec2(0.0);
        r.x = fbm(uv * 2.0 + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(uv * 2.0 + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float f = fbm(uv * 2.0 + r);

        vec2 gridUV = uv * 8.0;
        gridUV.y += t * 0.3;
        vec2 grid = abs(fract(gridUV - 0.5) - 0.5) / fwidth(gridUV);
        float line = min(grid.x, grid.y);
        float gridAlpha = 1.0 - min(line, 1.0);
        gridAlpha *= smoothstep(1.2, 0.1, length(uv));

        vec3 cDeepNavy = vec3(0.02, 0.039, 0.188); // #050A30
        vec3 cMidBlue  = vec3(0.063, 0.118, 0.380); // #101E61
        vec3 cElectric = vec3(0.137, 0.239, 1.0);   // #233DFF
        vec3 cCyan     = vec3(0.361, 0.714, 0.976); // #5CB6F9

        vec3 col = mix(cDeepNavy, cMidBlue, clamp(f * f * 2.5, 0.0, 1.0));
        col = mix(col, cElectric, clamp(length(q) * 0.45, 0.0, 1.0));
        col = mix(col, cCyan, clamp(length(r.x) * 0.35, 0.0, 1.0));
        col += cCyan * gridAlpha * (0.04 + 0.03 * sin(u_time * 1.5));
        col += cCyan * mouseGlow;

        float vignette = smoothstep(1.5, 0.3, length(uv));
        col *= vignette;

        gl_FragColor = vec4(col, 0.85);
      }
    `;

    function createShader(type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouseX = nx * canvas.width;
        mouseY = ny * canvas.height;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = (t: number) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
