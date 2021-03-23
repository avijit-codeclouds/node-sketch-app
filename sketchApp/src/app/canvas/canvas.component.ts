import {
  Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild
} from '@angular/core';
import { ShapeService } from '../services/shape.service'
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  
  canvasList : any
  sharedCanvasList : any

  constructor(
    private shapeService: ShapeService,
    public authService: AuthService,
    public router: Router,) { }

    ngOnInit() {
      this.shapeService.canvasList().subscribe(res => {
        // console.log(res)
        if(res.success == true){
          this.canvasList = res.result
        }
      },err => {
        console.log(err)
      })
      //shared with me canvas
      this.shapeService.sharedWithMeCanvas().subscribe(response => {
        // console.log(response)
        this.sharedCanvasList = response.result
      },err => {
        console.log(err)
      })
    }

}
