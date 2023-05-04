import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.css']
})
export class LoadingButtonComponent {
  @Input()
  color: string = 'none';
  @Input()
  type: string = 'basic';
  @Input()
  class: string = '';
  @Input()
  loading: boolean = false;
  @Input()
  buttonType: string = 'button';
  @Output()
  onClick = new EventEmitter();

  handleClick() {
    this.onClick.emit();
  }
}
