import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Workout1Page } from './workout1.page';

describe('Workout1Page', () => {
  let component: Workout1Page;
  let fixture: ComponentFixture<Workout1Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Workout1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
