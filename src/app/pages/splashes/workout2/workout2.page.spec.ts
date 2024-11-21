import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Workout2Page } from './workout2.page';

describe('Workout2Page', () => {
  let component: Workout2Page;
  let fixture: ComponentFixture<Workout2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Workout2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
