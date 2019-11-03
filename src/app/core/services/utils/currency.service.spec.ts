import {TestBed} from '@angular/core/testing';

import {CurrencyService} from './currency.service';

describe('CurrencyService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [CurrencyService]
    }));

    it('should be created', () => {
        const service: CurrencyService = TestBed.get(CurrencyService);
        expect(service).toBeTruthy();
    });

    it('should convert string 100 to string 100.00', () => {
        expect(CurrencyService.stringToCurrency('100')).toBe('100.00');
    });

    it('should NOT convert string 100abc to currency', () => {
        const testAmount = '100abc';
        let currency;
        try {
            currency = CurrencyService.stringToCurrency(testAmount);
        } catch (e) {
            currency = 'N/A';
            expect(e.message).toBe(`${testAmount} is not a number.`);
        }
        expect(currency).toBe('N/A');
    });

    it('should convert number 100.0 to string 100.00', () => {
        expect(CurrencyService.numberToCurrency(100.0)).toBe('100.00');
    });

    it('should convert number 0 to string 0.00', () => {
        expect(CurrencyService.numberToCurrency(0)).toBe('0.00');
    });

    it('should convert number 95.455 to string 95.45', () => {
        expect(CurrencyService.numberToCurrency(95.455)).toBe('95.46');
    });

    it('should convert number 1.005 to string 1.01', () => {
        expect(CurrencyService.numberToCurrency(1.005)).toBe('1.01');
    });

    it('should convert number 1.005 to string 1.01', () => {
        expect(CurrencyService.roundNumber(1.005, 2)).toBe('1.01');
    });

    it('should convert number 1.005 to string 1.01', () => {
        expect(CurrencyService.roundNumber(1.005, 0)).toBe('1');
    });

    it('should convert number 1.005 to string 1.01', () => {
        expect(CurrencyService.roundNumber(1.005, 1)).toBe('1.0');
    });

    it('should convert number 1.005 to string 1.01', () => {
        let currency;
        try {
            currency = CurrencyService.roundNumber(1.005, -1);
        } catch (e) {
            currency = 'N/A';
            expect(e.message).toBe(`Please pass in a decimal place value greater than 0`);
        }
        expect(currency).toBe('N/A');
    });
});
