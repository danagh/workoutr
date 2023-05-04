import { Component, Input } from '@angular/core';
import { Program } from '../../types/common';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent {
  @Input()
  label: string = '';
  @Input()
  programs: Program[] | null = null;
}
