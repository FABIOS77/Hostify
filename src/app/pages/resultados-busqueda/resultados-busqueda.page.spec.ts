import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultadosBusquedaPage } from './resultados-busqueda.page';

describe('ResultadosBusquedaPage', () => {
  let component: ResultadosBusquedaPage;
  let fixture: ComponentFixture<ResultadosBusquedaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadosBusquedaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
