import { Component, OnInit, OnChanges, SimpleChanges, Input, ViewChild, TemplateRef, ViewContainerRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination-list',
  templateUrl: './pagination-list.component.html',
  styleUrls: ['./pagination-list.component.css']
})
export class PaginationListComponent implements OnInit, OnChanges {
  @ViewChild("loadingButtonTemplate") loadingButtonTemplate: TemplateRef<any>;
  @ViewChild("labelTemplate") labelTemplate: TemplateRef<any>;
  @Input() label: string;
  @Input() template: TemplateRef<any>;
  @Input() data: any[] | null;
  @Output() loadMoreEvent = new EventEmitter();
  loadingMore: boolean = false;

  constructor(private vc: ViewContainerRef) {}

  ngOnInit() {
    this.handleLoadMore();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.data || this.data.length === 0) {
      return;
    }

    this.vc.clear();
    this.loadingMore = false;
    
    if (this.label) {
      this.vc.createEmbeddedView(this.labelTemplate);
    }

    this.data.forEach(object => {
      this.vc.createEmbeddedView(this.template, { data: object });
    });

    if (changes['data'].previousValue?.length !== this.data.length) {
      this.vc.createEmbeddedView(this.loadingButtonTemplate);
    }
  }

  handleLoadMore() {
    this.loadingMore = true;
    this.loadMoreEvent.emit();
  }
}
