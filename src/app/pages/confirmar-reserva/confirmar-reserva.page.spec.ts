import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarReservaPage } from './confirmar-reserva.page';

describe('ConfirmarReservaPage', () => {
  let component: ConfirmarReservaPage;
  let fixture: ComponentFixture<ConfirmarReservaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarReservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
