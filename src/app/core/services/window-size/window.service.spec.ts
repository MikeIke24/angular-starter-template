import { of } from 'rxjs';
import { WindowService } from './window.service';

describe('WindowService', () => {

  let windowService: WindowService;
  const mockBreakpointObserver = jasmine.createSpyObj('breakpointObserver', ['observe']);
  const mockBreakpointState = jasmine.createSpy('breakpointState');

  beforeEach(() => {
    mockBreakpointObserver.observe.and.returnValue(of(mockBreakpointState));
    windowService = new WindowService(mockBreakpointObserver);
  });

  it('should be created', () => {
    expect(windowService).toBeTruthy();
    expect(mockBreakpointObserver.observe).toHaveBeenCalledWith(['(max-width: 599px)']);
  });

  it('#isMobile should return observable of BreakpointState value', () => {
    const result$ = windowService.isMobile();
    result$.subscribe(res => {
      expect(res).toEqual(jasmine.any(Boolean));
    });
  });
});
