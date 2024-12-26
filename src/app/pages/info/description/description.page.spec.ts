import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionPage } from './description.page';

describe('DescriptionPage', () => {
  let component: DescriptionPage;
  let fixture: ComponentFixture<DescriptionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DescriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
