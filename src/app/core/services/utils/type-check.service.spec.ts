import { TestBed } from '@angular/core/testing';

import { TypeCheckService } from './type-check.service';

describe('TypeCheckService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [TypeCheckService]
  }));

  it('should be created', () => {
    const service: TypeCheckService = TestBed.get(TypeCheckService);
    expect(service).toBeTruthy();
  });

  it('should return true for all valid numbers', () => {
    const numbers = ['1', '0', '-1', '-100', '-1.1', '1.01', '.02', '0.250', '2000'];
    numbers.forEach(n => {
      console.log(n, TypeCheckService.isStringNumber(n));
      expect(TypeCheckService.isStringNumber(n)).toBe(true);
    });
  });

  it('should return false for all invalid', () => {
    const numbers = ['1.2.4', '1-1', '2016-34-9', '-12.3.4'];
    numbers.forEach(n => {
      console.log(n, TypeCheckService.isStringNumber(n));
      expect(TypeCheckService.isStringNumber(n)).toBe(false);
    });
  });
});
