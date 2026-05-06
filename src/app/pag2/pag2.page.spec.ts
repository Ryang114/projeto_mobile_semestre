import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pag2Page } from './pag2.page';

describe('Pag2Page', () => {
  let component: Pag2Page;
  let fixture: ComponentFixture<Pag2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Pag2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
