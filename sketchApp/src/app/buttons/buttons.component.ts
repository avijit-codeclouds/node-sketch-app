import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventHandlerService } from '../services/event-handler.service';
import { DrawingTools, DrawingColours } from '../services/models';
import { ShapeService } from '../services/shape.service'
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  DrawingTools = DrawingTools;
  selected = this.fabricService.selectedTool;

  public colours = Object.values(DrawingColours);
  public selectedColour: DrawingColours;

  // disableSaveBtn : boolean = true

  @Input() btnStatus: boolean = true
  @Input() resultCanvasJSON : any
  @Input() update : boolean = false
  @Input() getCanvas_id : string
  @Input() isSharedUser : boolean
  @Output() openModalNow = new EventEmitter<any>();
  openMDL: boolean = false 


  msg : any = ''
  className : any = ''
  enableMessage: boolean = false
  showSharebtn : boolean = false
  particularCanvasId : any

  constructor(
    private fabricService: EventHandlerService,
    private shapeService: ShapeService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this.selectedColour = fabricService.selectedColour;
    console.log(this.activatedRoute.snapshot.params['canvas_id']);
    if(this.activatedRoute.snapshot.params['canvas_id'] != undefined){
      // this.showSharebtn = true
      this.particularCanvasId = this.activatedRoute.snapshot.params['canvas_id']
    }
  }

  async select(tool: DrawingTools,colour: any) {
    // console.log(tool)
    this.fabricService.selectedColour = colour;
    this.selectedColour = this.fabricService.selectedColour;
    this.fabricService.selectedTool = tool;
    this.selected = this.fabricService.selectedTool;
  }

  handleModal(){
    this.openMDL = true
    this.openModalNow.emit(this.openMDL)
  }

  ngOnInit() {
    console.log(this.btnStatus)
    this.shapeService.getParticularCanvas(this.particularCanvasId).subscribe(res => {
      console.log(res)
      this.shapeService.getAuthUserDetails().subscribe(data => {
        if(res.result.owner_id == data._id){
          this.showSharebtn = true
        }else{
          this.showSharebtn = false
        }
      },err => {
        console.log(err)
      })
    },err => {
      console.log(err)
    })
  }

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  openSnackBar(message: string, action: string = 'Done') { 
    // openSnackBar('GAME ONE','HURRAH !!!!!')
    this._snackBar.open(message, action, { 
      duration: 2000, 
    }); 
  } 

  saveDraw(){
    console.log(`update :: ${this.update}`)
    console.log(`getCanvas_id :: ${this.getCanvas_id}`)
    if(this.update == false){
      if(this.resultCanvasJSON != undefined){
        this.shapeService.getAuthUserDetails().subscribe(res => {
          console.log(res._id)
          let payload = {
            node : this.resultCanvasJSON,
            canvas_id : this.getRandomString(15),
            owner_id : res._id
          }
          this.shapeService.saveDrawString(payload).subscribe(res => {
            console.log(res)
            console.log(res.result.canvas_id)
            if(res.success == true){
              this.router.navigateByUrl("/canvas/"+res.result._id);
            }
          },
          err => {
            console.log(err)
          })
        },err => {
          console.log(err)
        })
      }
    }else{
      if(this.resultCanvasJSON != undefined){
        this.shapeService.getAuthUserDetails().subscribe(res => {
          console.log(this.isSharedUser)
          if(this.isSharedUser == true){
            let payload
            this.shapeService.getParticularCanvas(this.getCanvas_id).subscribe(res => {
              console.log(res.result.owner_id)
              payload = {
                node : this.resultCanvasJSON,
                canvas_id : this.getCanvas_id,
                owner_id : res.result.owner_id
              }
              console.log(payload)
              this.shapeService.updateCanvas(payload).subscribe(res => {
                console.log(res)
                this.openSnackBar('Updated')
                this.msg = res.msg
                this.enableMessage = true
                this.className = 'alert-info'
                setTimeout( () => {
                  this.enableMessage = false
                }, 5000)
                // console.log(res.result.canvas_id)
              },
              err => {
                console.log(err)
              })
            },err => {
              console.log(err)
            })
          }else{
            let payload
            payload = {
              node : this.resultCanvasJSON,
              canvas_id : this.getCanvas_id,
              owner_id : res._id
            }
            console.log(payload)
            this.shapeService.updateCanvas(payload).subscribe(res => {
              console.log(res)
              this.openSnackBar('Updated')
              this.msg = res.msg
              this.enableMessage = true
              this.className = 'alert-info'
              setTimeout( () => {
                this.enableMessage = false
              }, 5000)
              // console.log(res.result.canvas_id)
            },
            err => {
              console.log(err)
            })
          }
        },err => {
          console.log(err)
        })
      }
    }
  }

}
