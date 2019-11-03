import { TestBed } from '@angular/core/testing';

import { ScreenSizeBreakpointService } from './screen-size-breakpoint.service';

describe('ScreenSizeBreakpointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScreenSizeBreakpointService = TestBed.get(ScreenSizeBreakpointService);
    expect(service).toBeTruthy();
  });
});
