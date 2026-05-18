import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilDevPage } from './perfil-dev.page';

describe('PerfilDevPage', () => {
  let component: PerfilDevPage;
  let fixture: ComponentFixture<PerfilDevPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilDevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
