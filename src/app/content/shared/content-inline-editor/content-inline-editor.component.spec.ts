import { TestBed } from "@angular/core/testing";
import { ShowLinkPipe } from "./content-inline-editor.component";

describe('ContentInlineEditorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [ ]
    })
    .compileComponents();
  });

  beforeEach(() => {
  });

  it('ShowLinkPipe should filter links', () => {
    let pipe = new ShowLinkPipe();
    let links = [{rel:'a'}, {rel:'b'}, {rel:'updateContentDescription'}, {rel:'inheritContentValue'}, {rel:'clearContentValue'}, {rel:'c'}]
    let result = pipe.transform(links as any);
    expect(result.length).toBe(3);
    expect(result).toBeTruthy(result.find(x => x.rel == 'updateContentDescription'));
    expect(result).toBeTruthy(result.find(x => x.rel == 'inheritContentValue'));
    expect(result).toBeTruthy(result.find(x => x.rel == 'clearContentValue'));
  });
});
