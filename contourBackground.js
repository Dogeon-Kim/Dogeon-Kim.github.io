const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.id = "contour-bg";
document.body.appendChild(canvas);

canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "0";
canvas.style.pointerEvents = "none";
canvas.style.filter = "none";
canvas.style.opacity = "1.0";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let time = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;
});

function noise(x, y, t) {
  const distortion = Math.sin((x * mouseX + y * mouseY) * 0.01 + t * 0.2);
  return (
    0.5 * Math.sin(x * 0.004 + t * 0.25 + distortion) * Math.cos(y * 0.004 + t * 0.15) +
    0.5 * Math.sin(x * 0.006 + t * 0.35) * Math.cos(y * 0.006 + t * 0.2)
  );
}

function drawContours() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const spacing = 4;
  const cols = Math.floor(canvas.width / spacing);
  const rows = Math.floor(canvas.height / spacing);
  const thresholdLevels = 14;
  const thresholdStep = 2 / thresholdLevels;
  const maxDistSquared = spacing * spacing * 3;

  for (let l = 0; l < thresholdLevels; l++) {
    const threshold = -1 + l * thresholdStep;
    const intensity = 0.2 + (l / thresholdLevels) * 0.5;

    const contours = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = x * spacing;
        const py = y * spacing;
        const val = noise(px, py, time * 0.01);

        if (Math.abs(val - threshold) < 0.01) {
          contours.push({ x: px, y: py });
        }
      }
    }

    if (contours.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < contours.length - 1; i++) {
        const p1 = contours[i];
        const p2 = contours[i + 1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSquared) {
          ctx.lineTo(p2.x, p2.y);
        } else {
          ctx.moveTo(p2.x, p2.y);
        }
      }
      ctx.strokeStyle = `rgba(48, 48, 48, ${intensity.toFixed(2)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  time += 1.2;
  requestAnimationFrame(drawContours);
}

drawContours();
