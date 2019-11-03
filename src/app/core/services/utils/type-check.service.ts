import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypeCheckService {

  constructor() { }

  static isStringNumber(s: string): boolean {
    return typeof s !== 'string' ? false : !isNaN(Number(s)) && !isNaN(parseFloat(s));
  }
}
