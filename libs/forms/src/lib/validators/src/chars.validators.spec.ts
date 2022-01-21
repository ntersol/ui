// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { isEqualTo } from './chars.validators';

describe('Character validator', () => {

    it('should be valid', () => {
        let control = new FormControl('12345');
        expect(isEqualTo(5)(control)).toEqual(null);
    });
    it('should be invalid because string is too short', () => {
        let control = new FormControl('1234');
        expect(isEqualTo(5)(control)).toEqual({ isEqualTo: 'Please enter exactly <strong>5 characters</strong>' });
    });
    it('should be invalid because string is too long', () => {
        let control = new FormControl('123456');
        expect(isEqualTo(5)(control)).toEqual({ isEqualTo: 'Please enter exactly <strong>5 characters</strong>' });
    });
    it('should be valid because it matches the characters in the other form control', () => {
        let fg = new FormGroup({
            a: new FormControl('1234567890'),
            b: new FormControl(10),
        });
        let control = fg.get('a');
        if (!control) {
            return;
        }
        expect(isEqualTo({ compareToField: 'b' })(control)).toEqual(null);
    });
    it('should be invalid because it is shorter than the other form control', () => {
        let fg = new FormGroup({
            a: new FormControl('123456789'),
            b: new FormControl(10),
        });
        let control = fg.get('a');
        if (!control) {
            return;
        }
        expect(isEqualTo({ compareToField: 'b' })(control)).toEqual({ isEqualTo: 'Please enter exactly <strong>10 characters</strong>' });
    });

    it('should be invalid because it is longer than the other form control', () => {
        let fg = new FormGroup({
            a: new FormControl('12345678901'),
            b: new FormControl(10),
        });
        let control = fg.get('a');
        if (!control) {
            return;
        }
        expect(isEqualTo({ compareToField: 'b' })(control)).toEqual({ isEqualTo: 'Please enter exactly <strong>10 characters</strong>' });
    });
});
