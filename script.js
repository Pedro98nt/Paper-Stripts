class PaperStrip {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.direction = Math.floor(Math.random() * 4);
      let hue = Math.random() * 60 + 90;
      this.color = `hsl(${hue}, 60%, 70%)`;
    }
  
    update() {
      let deltaDirection = this.maybeTurn();
      this.draw(deltaDirection);
      this.move();
    }
  
    maybeTurn() {
      let deltaDirection;
      if (Math.random() > 0.75) {
        deltaDirection = Math.floor(Math.random() * 3) - 1;
        if (deltaDirection !== 0) {
          this.direction += deltaDirection;
          if (this.direction === -1) this.direction = 3;
          if (this.direction === 4) this.direction = 0;
        }
      }
      return deltaDirection;
    }
  
    draw(deltaDirection) {
      let shouldTurn = deltaDirection && deltaDirection !== 0;
      ctx.save();
      ctx.fillStyle = this.color;
      if (shouldTurn) {
        this.drawTriangle(deltaDirection);
      } else {
        if (this.direction === 2 || this.direction === 0) {
          ctx.shadowColor = "gray";
          ctx.shadowOffsetY = 1;
          ctx.shadowOffsetX = 0;
        } else if (this.direction === 1 || this.direction === 3) {
          ctx.shadowColor = "gray";
          ctx.shadowOffsetY = 0;
          ctx.shadowOffsetX = 1;
        }
        ctx.fillRect(this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size);
      }
      ctx.restore();
    }
  
    drawTriangle(deltaDirection) {
      let angle = Math.PI / 2 * this.direction;
  
      ctx.shadowColor = "black";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.translate(this.x, this.y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.scale(deltaDirection, -1);
      ctx.beginPath();
      ctx.moveTo(-this.size / 2, this.size / 2);
      ctx.lineTo(this.size / 2, -this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.closePath();
      ctx.fill();
  
      ctx.beginPath();
      ctx.moveTo(this.size / 2, -this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.stroke();
    }
  
    move() {
      let angle = Math.PI / 2 * this.direction;
      let deltaX = Math.cos(angle) * this.size;
      let deltaY = Math.sin(angle) * this.size;
      this.x += deltaX;
      this.y += deltaY;
    }}
  
  
  let canvas;
  let ctx;
  let w, h;
  let tick;
  let paperStrips;
  
  function setup() {
    tick = 0;
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    reset();
    window.addEventListener("resize", () => {
      reset();
    });
    canvas.addEventListener("click", reset);
  }
  
  function reset() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    ctx.strokeStyle = "gray";
    ctx.fillStyle = "#DFF";
    ctx.fillRect(0, 0, w, h);
    setupPaperStrips();
  }
  
  function setupPaperStrips() {
    paperStrips = [];
    let nrOfStrips = w * h / 50000;
    for (let i = 0; i < nrOfStrips; i++) {
      let x = Math.round(Math.random() * w);
      let y = Math.round(Math.random() * h);
      let paperStrip = new PaperStrip(x, y, 30);
      paperStrips.push(paperStrip);
    }
  }
  
  function draw() {
    requestAnimationFrame(draw);
    if (tick % 8 === 0) {
      paperStrips.forEach(p => {
        p.update();
      });
    }
    tick++;
  }
  
  setup();
  draw();