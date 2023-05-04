import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  host: {
    class: 'animate-pulse rounded-lg bg-violet-100 block'
  },
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent {
  width?: string;
  height?: string;
  className?: string[];

  constructor(private host: ElementRef<HTMLElement>) {}


  ngOnInit() {
    const host = this.host.nativeElement;

    if (this.className) {
      host.classList.add(...this.className);
    }

    host.style.width = this.width || '100%';
    host.style.height = this.height || '100%';
  }
}
