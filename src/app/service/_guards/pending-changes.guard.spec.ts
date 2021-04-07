import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { ComponentCanDeactivate, PendingChangesGuard, PendingChangesGuardMessage } from './pending-changes.guard';

@Component({template:""})
export class DummyComponent implements ComponentCanDeactivate {
  block: boolean;
  canDeactivate() {
    return !this.block;
  }
}

describe('PendingChangesGuard', () => {
  let injector: TestBed;
  let service: PendingChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [PendingChangesGuard],
    });
    injector = getTestBed();
    service = injector.get(PendingChangesGuard);
  });

  it('guard should block, confirm, no, blocked', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    let dummyComponent = new DummyComponent();
    dummyComponent.block = true;
    let blocked = !service.canDeactivate(dummyComponent);
    expect(blocked).toBe(true);
    expect(window.confirm).toHaveBeenCalledWith(PendingChangesGuardMessage);
  });

  it('guard should block, confirm, yes, not blocked', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    let dummyComponent = new DummyComponent();
    dummyComponent.block = true;
    let blocked = !service.canDeactivate(dummyComponent);
    expect(blocked).toBe(false);
    expect(window.confirm).toHaveBeenCalledWith(PendingChangesGuardMessage);
  });

  it('guard should block, confirm, yes, not blocked', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    let dummyComponent = new DummyComponent();
    dummyComponent.block = false;
    let blocked = !service.canDeactivate(dummyComponent);
    expect(blocked).toBe(false);
    expect(window.confirm).toHaveBeenCalledTimes(0);
  });
});
