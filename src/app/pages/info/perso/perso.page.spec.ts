import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersoPage } from './perso.page';

describe('PersoPage', () => {
  let component: PersoPage;
  let fixture: ComponentFixture<PersoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
