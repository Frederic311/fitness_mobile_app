import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainCoachPage } from './main-coach.page';

describe('MainCoachPage', () => {
  let component: MainCoachPage;
  let fixture: ComponentFixture<MainCoachPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MainCoachPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
