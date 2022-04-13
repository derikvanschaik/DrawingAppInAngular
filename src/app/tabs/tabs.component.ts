import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import Line from './Line';
import Tab from './Tab'; 

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})

export class TabsComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: any; // only way this compiles 

  tabs: Tab[] = []; 
  activeTab: number = 0;
  isDrawing: boolean = false;
  x: number = 0;
  y:number = 0;  

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.newTab(); // init a default tab 
  }
  constructor() {
  }

  newTab(): void {
    const newTab: Tab = {title: 'Untitled', lines: [], curLineIdx: 0} 
    this.tabs.push(newTab);
  }
  closeTab(removeTabIdx: number): void {
    this.tabs.splice(removeTabIdx, 1);
    this.isDrawing = false; 
    this.clearCanvas();
    this.activeTab = this.tabs.length -1; 
    this.drawLinesOfCurrentTab(); 
  }
  changeTab(tabIdx: number): void {
    this.activeTab = tabIdx;
    this.isDrawing = false;
    this.clearCanvas();
    this.drawLinesOfCurrentTab(); 
  }
  handleMouseDown(e: any): void{
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.isDrawing = true;
    // add new line for tracking 
    const line: Line = {points: [[this.x, this.y]], color: 'black', width: 1}; 
    this.tabs[this.activeTab].lines.push(line); 

  }
  handleMouseMove(e: any): void{
    if(!this.isDrawing) return 
    this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
    this.x = e.offsetX;
    this.y = e.offsetY;
    // add x and y to line points
    const curLineIdx = this.tabs[this.activeTab].curLineIdx; 
    this.tabs[this.activeTab].lines[curLineIdx].points.push([this.x, this.y]); 

  }
  handleMouseUp(e: any): void {
    this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
    const curLineIdx = this.tabs[this.activeTab].curLineIdx; 
    this.tabs[this.activeTab].lines[curLineIdx].points.push([this.x, this.y]);
    // done drawing a line so increment curLineIdx prop 
    this.tabs[this.activeTab].curLineIdx += 1;
    // reset fields 
    this.x = 0;
    this.y = 0;
    this.isDrawing = false;
  }
  drawLinesOfCurrentTab(): void{
    const lines: Line[] = this.tabs[this.activeTab].lines;
    for(const line of lines){
      for(let i: number = 1; i < line.points.length; i++){ 
        this.drawLine(line.points[ i - 1][0], line.points[i - 1][1], 
                      line.points[i][0], line.points[i][1]); 
      }
    }
  }
  // canvas drawing methods 
  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.beginPath(); 
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }
  clearCanvas(): void{
    this.ctx.clearRect(0, 0,this.canvas.nativeElement.width,this.canvas.nativeElement.height); 
  }
  


}
