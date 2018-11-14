import { Directive, Input, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import _isEmpty from 'lodash/isEmpty';

@Directive({
  selector: '[fgeHighlightSearch]'
})
export class HighlightSearchDirective implements AfterViewInit {

  @Input() keyword: string;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    if (!_isEmpty(this.keyword)) {
      const rawText = this.element.nativeElement.innerText as string;
      const elementInnerText = rawText.toLowerCase();
      const keyword = this.keyword.toLowerCase();
      const index = elementInnerText.indexOf(keyword);
      if (index >= 0) {
        const content = this.buildHighlightedSection(rawText, keyword, index);
        this.renderer.setProperty(this.element.nativeElement, 'innerHTML', content);
      }
    }
  }

  private buildHighlightedSection(text: string, keyword: string, index: number) {
    const initSection = text.substr(0, index);
    const boldSection = text.substr(index, keyword.length);
    const finalSection = text.substr(index + keyword.length);
    return `${initSection}<strong>${boldSection}</strong>${finalSection}`;
  }
}
