import {
  Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, NgZone, TemplateRef
} from '@angular/core';
import { ShapeService } from '../services/shape.service'
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { fabric } from 'fabric';
import { EventHandlerService } from '../services/event-handler.service';
import { CustomFabricObject, DrawingTools, DrawingColours } from '../services/models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; 

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-canvasspecific',
  templateUrl: './canvasspecific.component.html',
  styleUrls: ['./canvasspecific.component.css']
})
export class CanvasspecificComponent implements OnInit {

  canvas_id : any
  eraserColor : any = '#ffffff'
  getNode : any = ''

  hexMessage:string;
  disableSaveBtn : boolean = true
  shapes: any = [];
  selectedButton: any = {
    'line': false,
    'erase': false,
  }
  erase: boolean = false;
  color = ''
  modeType : string = 'brush';
  getJsonStage : any

  canvas: fabric.Canvas;
  resultCanvasJSON : any 
  btnStatus : boolean = true
  DrawingTools = DrawingTools;
  selected = this.fabricService.selectedTool;
  update : boolean = true
  getCanvas_id : any
  userList : any
  actualSharedUser : any

  public colours = Object.values(DrawingColours);
  public selectedColour: DrawingColours;

  modalRef: BsModalRef;//show modal
  getWindowLink : string
  isReadOnly : boolean = true
  form: FormGroup;
  hideBtnNow : boolean = true
  isSharedUser : boolean = false

  constructor(
    private shapeService: ShapeService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventHandler: EventHandlerService, private ngZone: NgZone,
    private fabricService: EventHandlerService,
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { 
    console.log(this.activatedRoute.snapshot.params['canvas_id']);
    this.canvas_id = this.activatedRoute.snapshot.params['canvas_id']
    this.getWindowLink = window.location.href
    this.form = this.formBuilder.group({
      url: [{ value: '', disabled: true }, Validators.required],
      user_ids: this.formBuilder.array([])
    });
    
    // this.form = this.formBuilder.group({
    //   useremail: this.formBuilder.array([])
    // });
  }

  onChange(email: string, isChecked: boolean) {
    const user_ids_arr = <FormArray>this.form.controls.user_ids;

    if (isChecked) {
      user_ids_arr.push(new FormControl(email));
    } else {
      let index = user_ids_arr.controls.findIndex(x => x.value == email)
      user_ids_arr.removeAt(index);
    }
  }

  openSnackBar(message: string, action: string = 'Done') { 
    // openSnackBar('GAME ONE','HURRAH !!!!!')
    this._snackBar.open(message, action, { 
      duration: 2000, 
    }); 
  } 

  //  openModal(template: TemplateRef<any>) {
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  removeDepartment(name: string): void {
    // console.log(this.userList)
    // this.userList = this.userList.filter(item => item != name);
    return this.userList = this.userList.filter(item => item._id != name);
  }

  getModalMsg($event){
    if($event == true){
      this.shapeService.getUserList().subscribe(result => {
        console.log(result)
        this.userList = result
        this.shapeService.getParticularCanvas(this.canvas_id).subscribe(res => {
          let sharedUsers = res.result.shared
          let obj = this.userList
          for(let i=0;i<sharedUsers.length;i++){
            this.removeDepartment(sharedUsers[i])
          }  
          this.actualSharedUser = this.userList
          // sharedUsers = this.removeDepartment("6049f667df747c8b0166cc99");
          },err => {
            console.log(err)
          })
      },
      err => {
        console.log(err)
      })
      document.getElementById("openModalButton").click();
    }
  }

  shareCanvas(){
    console.log('share canvas...')
    // console.log(this.form.value.user_ids)
    let payload = {
      canvas_id : this.canvas_id,
      user_ids : this.form.value.user_ids
    }
    this.shapeService.updateShareCanvas(payload).subscribe(result => {
      console.log(result)
      if(result.success == true){
        document.getElementById('closeModal').click()
        this.openSnackBar('Canvas Shared')
      }
    },err => {
      console.log(err)
    })
  }

  ngOnInit() {
    this.shapeService.getParticularCanvas(this.canvas_id).subscribe(res => {
      console.log(res)
      this.getNode = res.result.node
      this.shapeService.getAuthUserDetails().subscribe(data => {
        if(res.result.owner_id == data._id){
          this.isSharedUser = false
        }else{
          this.isSharedUser = true
        }
        // console.log(`isSharedUser :: ${this.isSharedUser}`)
      },err => {
        console.log(err)
      })
      // console.log(this.getNode)
      // let width = 1920//window.innerWidth * 0.9;
      // let height = 350
      console.log(window.innerWidth)
      console.log(window.innerHeight)
      let json = this.getNode
      if (this.eventHandler.canvas) {
        this.eventHandler.canvas.dispose();
      }
      this.canvas = new fabric.Canvas('canvas', {
        selection: false,
        preserveObjectStacking: true,
        backgroundColor : '#ffffff'//"#f9f9f9"
      });
      this.canvas.loadFromJSON(json, this.canvas.renderAll.bind(this.canvas));
      this.eventHandler.canvas = this.canvas;
      this.eventHandler.extendToObjectWithId();
      fabric.Object.prototype.objectCaching = false;
      this.addEventListeners();
    },
    err => {
      console.log(err)
    })
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
    this.getCanvas_id = this.canvas_id
  }

  private onCanvasMouseMove(event: { e: Event }) {
    this.btnStatus = false
    this.eventHandler.mouseMove(event.e);
    this.resultCanvasJSON = this.getCanvasJSON()
    this.getCanvas_id = this.canvas_id
  }

  private onCanvasMouseUp() {
    this.eventHandler.mouseUp();
    this.resultCanvasJSON = this.getCanvasJSON()
    this.getCanvas_id = this.canvas_id
  }

  private onSelectionCreated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
    this.resultCanvasJSON = this.getCanvasJSON()
    this.getCanvas_id = this.canvas_id
  }

  private onSelectionUpdated(e: { target: CustomFabricObject }) {
    this.eventHandler.objectSelected(e.target);
    this.resultCanvasJSON = this.getCanvasJSON()
    this.getCanvas_id = this.canvas_id
  }

  private onObjectMoving(e: any) {
    this.eventHandler.objectMoving(e.target.id, e.target.type, e.target.left, e.target.top);
    this.resultCanvasJSON = this.getCanvasJSON()
    this.getCanvas_id = this.canvas_id
  }

  private onObjectScaling(e: any) {
    this.eventHandler.objectScaling(
      e.target.id,
      e.target.type,
      { x: e.target.scaleX, y: e.target.scaleY },
      { left: e.target.left, top: e.target.top },
    );
    this.resultCanvasJSON = this.getCanvasJSON()
    this.getCanvas_id = this.canvas_id
  }

  private avoidDragAndClickEventsOfOtherUILibs(e: Event) {
    e.stopPropagation();
  }

}
