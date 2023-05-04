import { Component, Input } from '@angular/core';
import { Program } from '../../types/common';

@Component({
  selector: 'app-program-card',
  templateUrl: './program-card.component.html',
  styleUrls: ['./program-card.component.css']
})
export class ProgramCardComponent {
  @Input()
  program: Program;
}
