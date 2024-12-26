import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerPage } from './banner.page';

describe('BannerPage', () => {
  let component: BannerPage;
  let fixture: ComponentFixture<BannerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
