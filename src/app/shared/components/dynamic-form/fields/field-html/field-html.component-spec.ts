import { FieldHtmlComponent } from './field-html.component';

describe('workspace-project App', () => {
  let component: FieldHtmlComponent;

  beforeEach(() => {
    component = new FieldHtmlComponent();
  });

  it('configCkEditor should not be null', () => {
    expect(!component.configCkEditor.null());
  });
});
