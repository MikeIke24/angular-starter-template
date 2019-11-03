import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StringUtilsService {

    constructor() {
    }

    static toTitleCase(s: string): string {
        if (!!s) {
            s = s.toLowerCase();
            return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
        }
        return s;
    }

    static snakeCasetoTitleCase(s: string): string {
        if (!!s) {
            s = s.toLowerCase();
            s = s.split('-').map(s2 => `${s2.charAt(0).toUpperCase()}${s2.slice(1)}`).join(' ');
            return s;
        }
        return s;
    }

    static camelCaseToTitleCase(s: string) {
        if (s == null || s === '') {
            return s;
        }

        s = s.trim();
        let newText = '';
        for (let i = 0; i < s.length; i++) {
            if (/[A-Z]/.test(s[i])
                && i !== 0
                && /[a-z]/.test(s[i - 1])) {
                newText += ' ';
            }
            if (i === 0 && /[a-z]/.test(s[i])) {
                newText += s[i].toUpperCase();
            } else {
                newText += s[i];
            }
        }
        return newText;
    }

    static extractLettersAndNumbers(s: string): string {
        return s.replace(/[^A-Za-z0-9]+/g, '');
    }
}
