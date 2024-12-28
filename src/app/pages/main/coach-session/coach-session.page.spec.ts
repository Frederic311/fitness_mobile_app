import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoachSessionPage } from './coach-session.page';

describe('CoachSessionPage', () => {
  let component: CoachSessionPage;
  let fixture: ComponentFixture<CoachSessionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CoachSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
