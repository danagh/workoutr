import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: 'img'
})
export class LazyImgDirective implements OnInit {
  private nativeElement: HTMLImageElement

  constructor({ nativeElement }: ElementRef<HTMLImageElement>) {
    this.nativeElement = nativeElement;
  }
    

  ngOnInit() {
    this.nativeElement.style.height = '0px';
    this.nativeElement.style.width = '0px';
    this.nativeElement.onload = () => {
      this.nativeElement.parentElement?.classList.add('loaded');
      this.nativeElement.parentElement?.classList.remove('animate-pulse');
      this.nativeElement.style.height = 'inherit';
      this.nativeElement.style.width = 'inherit';
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
      this.observerCallback(entries, observer);
    });

    imageObserver.observe(this.nativeElement);
  }

  observerCallback(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach(entry => {
      const image = entry.target as HTMLImageElement;
      const src = image.attributes.getNamedItem('data-src');
      if (!src) {
        observer.unobserve(image);
        return;
      }

      if (entry.isIntersecting) {
        image.src = src.value;
        observer.unobserve(image);
      }
    });
  }
}
