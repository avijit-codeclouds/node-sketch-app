import {
  Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild
} from '@angular/core';
import Konva from 'konva';
import { ShapeService } from '../services/shape.service'
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-canvasspecific',
  templateUrl: './canvasspecific.component.html',
  styleUrls: ['./canvasspecific.component.css']
})
export class CanvasspecificComponent implements OnInit {

  canvas_id : any
  getNode : any = ''

  hexMessage:string;
  disableSaveBtn : boolean = true
  shapes: any = [];
  stage: Konva.Stage;
  layer: Konva.Layer;
  selectedButton: any = {
    'line': false,
    'erase': false,
  }
  erase: boolean = false;
  transformers: Konva.Transformer[] = [];
  color = ''
  modeType : string = 'brush';
  getJsonStage : any

  constructor(
    private shapeService: ShapeService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    console.log(this.activatedRoute.snapshot.params['canvas_id']);
    this.canvas_id = this.activatedRoute.snapshot.params['canvas_id']
  }

  ngOnInit() {
    this.shapeService.getParticularCanvas(this.canvas_id).subscribe(res => {
      console.log(res)
      this.getNode = res.result.node
      // console.log(this.getNode)
      // let width = 1920//window.innerWidth * 0.9;
      // let height = 350
      console.log(window.innerWidth)
      console.log(window.innerHeight)
      let json = this.getNode
      console.log(this.getNode)
      console.log(json)
      // let width = 1200;
      // let height = 400;
      this.stage = Konva.Node.create(json, 'canvas');
      // this.stage = new Konva.Stage({
      //   container: 'canvas',
      //   width: width,
      //   height: height,
      //   draggable: false
      // });
      this.layer = new Konva.Layer();
      this.stage.add(this.layer);
      this.color = '#0693E3'
      this.addLineListeners(this.color);
    },
    err => {
      console.log(err)
    })
  }

  saveDraw(){
    if(this.getJsonStage != undefined){
      console.log(this.getJsonStage)
      this.shapeService.getAuthUserDetails().subscribe(res => {
        console.log(res._id)
        let payload = {
          node : this.getJsonStage,
          canvas_id : this.canvas_id,
          owner_id : res._id
        }
        this.shapeService.updateCanvas(payload).subscribe(res => {
          console.log(res)
          console.log(res.result.canvas_id)
        },
        err => {
          console.log(err)
        })
      },err => {
        console.log(err)
      })
    }
  }

  modeChange(mode : any){
    this.modeType = mode
    console.log(`mode :: ${this.modeType}`)
  }

  addLineListeners(color : any) {
    const component = this;
    let lastLine;
    let isPaint;
    this.stage.on('mousedown touchstart', function (e) {
      if (!component.selectedButton['line'] && !component.erase) {
        return;
      }
      isPaint = true;
      const mode = component.erase ? 'erase' : 'brush';
      // const mode = 'erase'
      var pos = component.stage.getPointerPosition();
      lastLine = component.shapeService.line(pos, mode, color)
      component.layer.add(lastLine);
      component.shapes.push(lastLine);
      // let jsonStage = component.stage.toJSON();
      // console.log(`jsonStage ::`)
      // console.log(jsonStage)
    });
    this.stage.on('mouseup touchend', function () {
      isPaint = false;
    });
    // and core function - drawing
    this.stage.on('mousemove touchmove', function () {
      if (!isPaint) {
        return;
      }
      const pos = component.stage.getPointerPosition();
      var newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
      component.layer.batchDraw();
      let jsonStage = component.stage.toJSON();
      component.getJsonStage = jsonStage
      component.disableSaveBtn = false
      console.log(`jsonStage ::`)
      console.log(jsonStage)
    });
  }

  receiveMessage($event) {
    this.hexMessage = $event
    this.color = this.hexMessage
    this.addLineListeners(this.color);
    // this.addLineListenersV2(this.color)
    console.log(this.hexMessage)
    console.log(`color :: ${this.color}`)
  }

  clearSelection() {
    Object.keys(this.selectedButton).forEach(key => {
      console.log(this.selectedButton[key])
      this.selectedButton[key] = false;
    })
  }

  setSelection(type: string) {
    this.selectedButton[type] = true;
    console.log(this.selectedButton[type])
  }
  addShape(type: string) {
    this.clearSelection();
    this.setSelection(type);
    if (type == 'line') {
      this.addLine();
    }
  }
  addLine() {
    this.selectedButton['line'] = true;
  }
  
  undo() {
    const removedShape = this.shapes.pop();
    this.transformers.forEach(t => {
      t.detach();
    });
    if (removedShape) {
      removedShape.remove();
    }
    this.layer.draw();
  }
  addTransformerListeners() {
    const component = this;
    const tr = new Konva.Transformer();
    this.stage.on('click', function (e) {
      if (!this.clickStartShape) {
        return;
      }
      if (e.target._id == this.clickStartShape._id) {
        component.addDeleteListener(e.target);
        component.layer.add(tr);
        tr.attachTo(e.target);
        component.transformers.push(tr);
        component.layer.draw();
      }
      else {
        tr.detach();
        component.layer.draw();
      }
    });
  }
  addDeleteListener(shape) {
    const component = this;
    window.addEventListener('keydown', function (e) {
      if (e.keyCode === 46) {
        shape.remove();
        component.transformers.forEach(t => {
          t.detach();
        });
        const selectedShape = component.shapes.find(s => s._id == shape._id);
        selectedShape.remove();
        e.preventDefault();
      }
      component.layer.batchDraw();
    });
  }

}
