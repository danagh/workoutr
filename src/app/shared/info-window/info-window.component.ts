import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.css']
})
export class InfoWindowComponent {
  @Input()
  label: string;
  @Input()
  unit: string;
  @Input()
  extraClasses?: string = '';
}
