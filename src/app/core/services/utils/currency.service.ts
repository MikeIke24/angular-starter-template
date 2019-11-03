import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor() {
  }

  static divide(numerator: number, denominator: number) {
    return CurrencyService.numberToCurrency(numerator / denominator);
  }

  static stringToNumber(value: string): number {
    return parseFloat(CurrencyService.stringToCurrency(value));
  }

  static stringToCurrency(value: string): string {
    if (!CurrencyService.isStringNumber(value)) {
      throw new Error(`${value} is not a number.`);
    }
    const n = parseFloat(value);
    if (isNaN(n)) {
      throw new Error(`Could not convert ${value} to a number.`);
    }
    return CurrencyService.roundNumber(n, 2);
  }

  static numberToCurrency(value: number): string {
    return CurrencyService.roundNumber(value, 2);
  }

  static isStringNumber(s: string): boolean {
    if (typeof s !== 'string') {
      return false;
    } // we only process strings!
    return !isNaN(Number(s)) && !isNaN(parseFloat(s));
  }

  static roundNumber(value: number, decimalPlaces: number): string {
    if (decimalPlaces < 0) {
      throw new Error('Please pass in a decimal place value greater than 0. Parameter "decimalPlaces" must be greater than or equal to 0');
    }
    try {
      return Number(Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces)).toFixed(decimalPlaces);
    } catch (e) {
      return value.toFixed(decimalPlaces);
    }
  }

}
