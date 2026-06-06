import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleLugarPage } from './detalle-lugar.page';

describe('DetalleLugarPage', () => {
  let component: DetalleLugarPage;
  let fixture: ComponentFixture<DetalleLugarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleLugarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
