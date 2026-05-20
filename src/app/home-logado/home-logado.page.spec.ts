import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeLogadoPage } from './home-logado.page';

describe('HomeLogadoPage', () => {
  let component: HomeLogadoPage;
  let fixture: ComponentFixture<HomeLogadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLogadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
