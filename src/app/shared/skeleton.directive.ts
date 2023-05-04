import { Directive, Input, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { SkeletonComponent } from './skeleton/skeleton.component';

@Directive({
  selector: '[skeleton]'
})
export class SkeletonDirective {
  @Input('skeleton') isLoading = false;
  @Input('skeletonRepeat') size = 1;
  @Input('skeletonWidth') width: string;
  @Input('skeletonHeight') height: string;
  @Input('skeletonClassName') className: string[];

  constructor(private template: TemplateRef<any>, private view: ViewContainerRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoading']) {
      this.view.clear();

      if (changes['isLoading'].currentValue) {
        Array.from({ length: this.size }).forEach(() => {
          const ref = this.view.createComponent(SkeletonComponent);

          Object.assign(ref.instance, {
            width: this.width,
            height: this.height,
            className: this.className
          });
        });
      } else {
        this.view.createEmbeddedView(this.template);
      }
    }
  }

}
