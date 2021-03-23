import {
  Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, AfterContentInit, NgZone
} from '@angular/core';
import { ShapeService } from '../services/shape.service'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { fabric } from 'fabric';
import { EventHandlerService } from '../services/event-handler.service';
import { CustomFabricObject, DrawingTools, DrawingColours } from '../services/models';
declare var $: any;

@Component({
  selector: 'app-canvasnew',
  templateUrl: './canvasnew.component.html',
  styleUrls: ['./canvasnew.component.css']
})
export class CanvasnewComponent implements OnInit {
  
  canvas: fabric.Canvas;
  DrawingTools = DrawingTools;
  selected = this.fabricService.selectedTool;

  public colours = Object.values(DrawingColours);
  public selectedColour: DrawingColours;

  hexMessage:string;

  // disableSaveBtn : boolean = true
  btnStatus : boolean = true
  resultCanvasJSON : any 

  shapes: any = [];
  selectedButton: any = {
    'circle': false,
    'rectangle': false,
    'line': false,
    'undo': false,
    'erase': false,
    'text': false
  }
  erase: boolean = false;
  color = ''
  modeType : string = 'brush';
  getJsonStage : any
  getWindowWidth : Number

  constructor(
    private shapeService: ShapeService,
    private authService: AuthService,
    private router: Router,
    private eventHandler: EventHandlerService, private ngZone: NgZone,
    private fabricService: EventHandlerService
  ) { 
    this.btnStatus = true
    this.getWindowWidth = window.innerWidth
  }

  ngOnInit() {
    let width = 1920//window.innerWidth * 0.9;
    let height = 350
    // console.log(window.innerWidth)
    // console.log(window.innerHeight)
    
    if (this.eventHandler.canvas) {
      this.eventHandler.canvas.dispose();
    }
    this.canvas = new fabric.Canvas('canvas', {
      selection: false,
      preserveObjectStacking: true,
      backgroundColor : '#ffffff'//"#f9f9f9"
    });
    this.canvas.setDimensions({width:window.innerWidth, height:350});
    // this.canvas.backgroundColor="#808080";
    this.eventHandler.canvas = this.canvas;
    this.eventHandler.extendToObjectWithId();
    fabric.Object.prototype.objectCaching = false;
    this.addEventListeners();
    // this.addLineListenersV2(this.color)
  }

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }



  modeChange(mode : any){
    this.modeType = mode
    // console.log(`mode :: ${this.modeType}`)
  }

  
  receiveMessage($event,colour: any,tool : any = 'PENCIL') {
    this.hexMessage = $event
    this.color = this.hexMessage
    // this.addLineListeners(this.color);
    // this.addLineListenersV2(this.color)
    colour = this.color
    this.fabricService.selectedColour = colour
    this.selectedColour = this.fabricService.selectedColour;
    this.fabricService.selectedTool = tool;
    this.selected = this.fabricService.selectedTool;
    // console.log(this.hexMessage)
    // console.log(`color :: ${this.color}`)
  }

  private addEventListeners() {
    this.canvas.on('mouse:down', e => this.ngZone.run(() => this.onCanvasMouseDown(e)));
    this.canvas.on('mouse:move', e => this.ngZone.run(() => this.onCanvasMouseMove(e)));
    this.canvas.on('mouse:up', () => this.ngZone.run(() => this.onCanvasMouseUp()));
    this.canvas.on('selection:created', e => this.ngZone.run(() => this.onSelectionCreated(e as any)));
    this.canvas.on('selection:updated', e => this.ngZone.run(() => this.onSelectionUpdated(e as any)));
    this.canvas.on('object:moving', e => this.ngZone.run(() => this.onObjectMoving(e as any)));
    this.canvas.on('object:scaling', e => this.ngZone.run(() => this.onObjectScaling(e as any)));
  }

  private getCanvasJSON(){
    return JSON.stringify(this.canvas)
    // console.log(JSON.stringify(this.canvas))
  }

  private onCanvasMouseDown(event: { e: Event }) {
    this.eventHandler.mouseDown(event.e);
    this.avoidDragAndClickEventsOfOtherUILibs(event.e);
    this.resultCanvasJSON = this.getCanvasJSON()
  }

  private onCanvasMouseMove(event: { e: Event }) {
    this.btnStatus = false
    this.eventHandler.mouseMove(event.e);
    this.resultCanvasJSON = this.getCanvasJSON()
  }

  private onCanvasMouseUp() {
    this.eventHandler.mouseUp();
    this.resultCanvasJSON = this.getCanvasJSON()
  }

  private onSelectionCreated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
    this.resultCanvasJSON = this.getCanvasJSON()
  }

  private onSelectionUpdated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
    this.resultCanvasJSON = this.getCanvasJSON()
  }

  private onObjectMoving(e: any) {
    this.eventHandler.objectMoving(e.target.id, e.target.type, e.target.left, e.target.top);
    this.resultCanvasJSON = this.getCanvasJSON()
  }

  private onObjectScaling(e: any) {
    this.eventHandler.objectScaling(
      e.target.id,
      e.target.type,
      { x: e.target.scaleX, y: e.target.scaleY },
      { left: e.target.left, top: e.target.top },
    );
    this.resultCanvasJSON = this.getCanvasJSON()
  }

  private avoidDragAndClickEventsOfOtherUILibs(e: Event) {
    e.stopPropagation();
  }

}
