import { Component, OnInit, Input } from '@angular/core';
import { EventHandlerService } from '../services/event-handler.service';
import { DrawingTools, DrawingColours } from '../services/models';


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


  constructor(private fabricService: EventHandlerService) {
    this.selectedColour = fabricService.selectedColour;
    console.log(this.btnStatus)
  }

  async select(tool: DrawingTools,colour: any) {
    // console.log(tool)
    this.fabricService.selectedColour = colour;
    this.selectedColour = this.fabricService.selectedColour;
    this.fabricService.selectedTool = tool;
    this.selected = this.fabricService.selectedTool;
  }

  ngOnInit() {
    console.log(this.btnStatus)
  }

  saveDraw(){
    console.log(`clicked...`)
    console.log(this.resultCanvasJSON)
  }

}
