import { Component, ViewChild, ElementRef } from '@angular/core';

type coords = [number, number];
const v1: coords = [300, 0];
const v2: coords = [0, 800];
const v3: coords = [600, 800];

@Component({
  selector: 'my-app',
  template: `
    draw?<input type=checkbox [(ngModel)]="isDrawing"/><br />
    speed <input type=number [(ngModel)]="speed"/><br />
    <canvas #myCanvas height=800 width=600 ></canvas>
  `,
})
export class AppComponent {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  isDrawing: boolean = true;
  speed: number = 500;
  x: coords = [0, 0];
  private ctx: CanvasRenderingContext2D;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.drawBorder();
    let maxTries = 100;
    while (!pointInTriangle(this.x, v1, v2, v3) && maxTries > 0) {
      this.x = [
        Math.round(Math.random() * 600),
        Math.round(Math.random() * 800),
      ];
      maxTries--;
    }

    setTimeout(() => {
      this.drawPoint(this.x);

      setTimeout(() => {
        this.doDrawNextPoint();
      }, 300);
    }, 200);
  }

  drawPoint(x: coords) {
    this.ctx.beginPath();
    this.ctx.arc(x[0], x[1], 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'darkred';
    this.ctx.fill();
  }

  drawBorder() {
    this.ctx.beginPath();
    this.ctx.moveTo(...v1);
    this.ctx.lineTo(...v2);
    this.ctx.lineTo(...v3);
    this.ctx.lineTo(...v1);
    this.ctx.stroke();
  }

  doDrawNextPoint() {
    setTimeout(() => {
      if (this.isDrawing) {
        let dir: coords;
        switch (Math.floor(Math.random() * 3)) {
          case 0:
            dir = v1;
            break;
          case 1:
            dir = v2;
            break;
          default:
            dir = v3;
        }

        this.x = [
          Math.round((this.x[0] + dir[0]) / 2),
          Math.round((this.x[1] + dir[1]) / 2),
        ];
        this.drawPoint(this.x);
      }

      this.doDrawNextPoint();
    }, this.speed);
  }
}

function sign(p1: coords, p2: coords, p3: coords): number {
  return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
}

function pointInTriangle(pt: coords, v1: coords, v2: coords, v3: coords) {
  let d1, d2, d3;
  let has_neg, has_pos;

  d1 = sign(pt, v1, v2);
  d2 = sign(pt, v2, v3);
  d3 = sign(pt, v3, v1);

  has_neg = d1 < 0 || d2 < 0 || d3 < 0;
  has_pos = d1 > 0 || d2 > 0 || d3 > 0;

  return !(has_neg && has_pos);
}
