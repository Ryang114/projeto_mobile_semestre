import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugLogsPage } from './debug-logs.page';

describe('DebugLogsPage', () => {
  let component: DebugLogsPage;
  let fixture: ComponentFixture<DebugLogsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

