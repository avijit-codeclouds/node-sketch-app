import { Component, OnInit } from '@angular/core';
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

  disableSaveBtn : boolean = true

  constructor(private fabricService: EventHandlerService) {
    this.selectedColour = fabricService.selectedColour;
  }

  async select(tool: DrawingTools,colour: any) {
    // console.log(tool)
    this.fabricService.selectedColour = colour;
    this.selectedColour = this.fabricService.selectedColour;
    this.fabricService.selectedTool = tool;
    this.selected = this.fabricService.selectedTool;
  }

  ngOnInit() {
  }

  saveDraw(){
    console.log(`clicked...`)
  }

}
