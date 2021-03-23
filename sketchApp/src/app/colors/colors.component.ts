import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {

  hexMessage: string 
  makeRGB : string //rgba(255,255,0,1)

  @Output() hexMessageEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  handleChange($event: ColorEvent) {
    // console.log($event.color);
    // console.log($event.color.hex)
    // console.log($event.color.rgb)
    let rgb = $event.color.rgb
    this.makeRGB = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+rgb.a+')'
    // console.log(this.makeRGB)
    this.hexMessage = this.makeRGB//$event.color.hex
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
