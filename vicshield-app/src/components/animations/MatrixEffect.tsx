import { useRef, useLayoutEffect } from "react";

type Dot = { x: number; y: number; vx: number; vy: number };

export default function MatrixEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const dropsRef = useRef<{ y: number; speed: number }[]>([]);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const wavesRef = useRef<{ x: number; y: number; start: number }[]>([]);

  const FONT_SIZE = 16;
  const CHARS =
    "0101010 ｱｶｸﾂﾛ┃╱╲╳╔╚╬═╦╩∆∑∏∂√∞≈≠≡⋆⋈⟠αβγδελμξπρστωЖЯИФЦШЮЭДБГЛПЧ".split("");
  const WAVE_DURATION = 5000;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // canvas phụ cho text blur
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d")!;
    let mounted = true;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      offscreen.width = canvas.width;
      offscreen.height = canvas.height;

      const columns = Math.floor(canvas.width / FONT_SIZE);
      dropsRef.current = Array(columns)
        .fill(0)
        .map(() => ({
          y: Math.floor(Math.random() * (canvas.height / FONT_SIZE)),
          speed: 1 + Math.random() * 2,
        }));

      dotsRef.current = Array.from({ length: 140 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));
    }

    function drawLoop() {
      if (!mounted || !ctx || !canvas) return;
      ctx.fillStyle = "#1c1c28";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();

      // clear offscreen trước mỗi frame
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.font = `${FONT_SIZE}px monospace`;
      offCtx.textBaseline = "top";

      // // --- digital rain vẽ vào offscreen ---
      // dropsRef.current.forEach((drop, i) => {
      //   let x = i * FONT_SIZE;
      //   let y = drop.y * FONT_SIZE;

      //   // wave distortion
      //   for (const w of wavesRef.current) {
      //     const elapsed = now - w.start;
      //     if (elapsed > WAVE_DURATION) continue;
      //     const radius =
      //       (elapsed / WAVE_DURATION) *
      //       Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

      //     const dx = x - w.x;
      //     const dy = y - w.y;
      //     const dist = Math.sqrt(dx * dx + dy * dy);
      //     if (Math.abs(dist - radius) < 40) {
      //       const offset = (40 - Math.abs(dist - radius)) * 0.3;
      //       x += (dx / dist) * offset;
      //       y += (dy / dist) * offset;
      //     }
      //   }

      //   const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      //   offCtx.fillStyle = "rgba(180,255,180,0.25)";
      //   offCtx.fillText(char, x, y);

      //   // trail
      //   for (let k = 1; k < 10; k++) {
      //     const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
      //     offCtx.fillStyle = `rgba(180,255,180,${1 - k / 10})`;

      //     let trailX = i * FONT_SIZE;
      //     let trailY = (drop.y - k) * FONT_SIZE;

      //     // wave distortion cho trail
      //     for (const w of wavesRef.current) {
      //       const elapsed = now - w.start;
      //       if (elapsed > WAVE_DURATION) continue;
      //       const radius =
      //         (elapsed / WAVE_DURATION) *
      //         Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
      //       const dx = trailX - w.x;
      //       const dy = trailY - w.y;
      //       const dist = Math.sqrt(dx * dx + dy * dy);
      //       if (Math.abs(dist - radius) < 40) {
      //         const offset = (40 - Math.abs(dist - radius)) * 0.3;
      //         trailX += (dx / dist) * offset;
      //         trailY += (dy / dist) * offset;
      //       }
      //     }

      //     offCtx.fillText(trailChar, trailX, trailY);
      //   }

      //   drop.y += drop.speed * 0.025;
      //   if (drop.y * FONT_SIZE > canvas.height) {
      //     drop.y = 0;
      //   }
      // });

      // // --- copy offscreen lên canvas chính với blur ---
      // ctx.filter = "blur(2px)";
      // ctx.drawImage(offscreen, 0, 0);
      // ctx.filter = "none";

      // --- dots network (không blur) ---
      const dots = dotsRef.current;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      dots.forEach((dot) => {
        let { x, y } = dot;

        // wave distortion cho dots
        for (const w of wavesRef.current) {
          const elapsed = now - w.start;
          if (elapsed > WAVE_DURATION) continue;
          const radius =
            (elapsed / WAVE_DURATION) *
            Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
          const dx = x - w.x;
          const dy = y - w.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(dist - radius) < 40) {
            const offset = (40 - Math.abs(dist - radius)) * 0.4;
            x += (dx / dist) * offset;
            y += (dy / dist) * offset;
          }
        }

        // update pos
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();

        dots.forEach((other) => {
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 120})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // connect to mouse
        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(0,150,255,${1 - dist / 150})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }
      });

      // cleanup waves
      wavesRef.current = wavesRef.current.filter(
        (w) => now - w.start < WAVE_DURATION
      );

      animationRef.current = requestAnimationFrame(drawLoop);
    }

    resize();
    animationRef.current = requestAnimationFrame(drawLoop);

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    function onClick(e: MouseEvent) {
      wavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        start: performance.now(),
      });
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    return () => {
      mounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, [CHARS]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
