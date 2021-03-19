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

  constructor(
    private shapeService: ShapeService,
    private authService: AuthService,
    private router: Router,
    private eventHandler: EventHandlerService, private ngZone: NgZone,
    private fabricService: EventHandlerService
  ) { 
    this.btnStatus = true
  }

  ngOnInit() {
    let width = 1920//window.innerWidth * 0.9;
    let height = 350
    console.log(window.innerWidth)
    console.log(window.innerHeight)
    if (this.eventHandler.canvas) {
      this.eventHandler.canvas.dispose();
    }
    this.canvas = new fabric.Canvas('canvas', {
      selection: false,
      preserveObjectStacking: true,
      backgroundColor : '#ffffff'//"#f9f9f9"
    });
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


  saveDraw(){
    console.log('draw image ...')
    console.log(this.getRandomString(15))
    console.log(`get draw string ::`)
    console.log(this.canvas)
    // if(this.getJsonStage != undefined){
    //   console.log(this.getJsonStage)
    //   //get owner details
    //   this.shapeService.getAuthUserDetails().subscribe(res => {
    //     console.log(res._id)
    //     let payload = {
    //       node : this.getJsonStage,
    //       canvas_id : this.getRandomString(15),
    //       owner_id : res._id
    //     }
    //     this.shapeService.saveDrawString(payload).subscribe(res => {
    //       console.log(res)
    //       console.log(res.result.canvas_id)
    //       if(res.success == true){
    //         this.router.navigateByUrl("/canvas/"+res.result._id);
    //       }
    //     },
    //     err => {
    //       console.log(err)
    //     })
    //   },err => {
    //     console.log(err)
    //   })
    // }
  }

  modeChange(mode : any){
    this.modeType = mode
    console.log(`mode :: ${this.modeType}`)
  }

  // addLineListeners(color : any) {
  //   const component = this;
  //   let lastLine;
  //   let isPaint;
  //   this.stage.on('mousedown touchstart', function (e) {
  //     if (!component.selectedButton['line'] && !component.erase) {
  //       return;
  //     }
  //     isPaint = true;
  //     const mode = component.erase ? 'erase' : 'brush';
  //     var pos = component.stage.getPointerPosition();
  //     lastLine = component.shapeService.line(pos, mode, color)
  //     component.layer.add(lastLine);
  //     component.shapes.push(lastLine);
  //     // let jsonStage = component.stage.toJSON();
  //     // console.log(`jsonStage ::`)
  //     // console.log(jsonStage)
  //   });
  //   this.stage.on('mouseup touchend', function () {
  //     isPaint = false;
  //   });
  //   // and core function - drawing
  //   this.stage.on('mousemove touchmove', function () {
  //     if (!isPaint) {
  //       return;
  //     }
  //     const pos = component.stage.getPointerPosition();
  //     var newPoints = lastLine.points().concat([pos.x, pos.y]);
  //     lastLine.points(newPoints);
  //     component.layer.batchDraw();
  //     let jsonStage = component.stage.toJSON();
  //     component.getJsonStage = jsonStage
  //     component.disableSaveBtn = false
  //     console.log(`jsonStage ::`)
  //     console.log(jsonStage)
  //   });
  // }

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
    console.log(this.hexMessage)
    console.log(`color :: ${this.color}`)
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
