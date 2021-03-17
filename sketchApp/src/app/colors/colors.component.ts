import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {

  hexMessage: string 

  @Output() hexMessageEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  handleChange($event: ColorEvent) {
    console.log($event.color);
    console.log($event.color.hex)
    this.hexMessage = $event.color.hex
    this.hexMessageEvent.emit(this.hexMessage)

    // color = {
    //   hex: '#333',
    //   rgb: {
    //     r: 51,
    //     g: 51,
    //     b: 51,
    //     a: 1,
    //   },
    //   hsl: {
    //     h: 0,
    //     s: 0,
    //     l: .20,
    //     a: 1,
    //   },
    // }
  }

}
