// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { isEqualTo } from '../chars.validators';

describe('Validator | Character | isEqualTo', () => {

    it('should be valid', () => {
        let control = new FormControl('12345');
        expect(isEqualTo(5)(control)).toEqual(null);
    });
    it('should be required by default and throw error if nill value', () => {
        let control = new FormControl(null);
        expect(isEqualTo(5)(control)).toEqual({ required: 'This field is required' });
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

    it('should support custom error messages', () => {
        let control = new FormControl('123456');
        const msg = 'Custom error message'
        expect(isEqualTo(5, { errorMessage: msg })(control)).toEqual({ isEqualTo: msg });
    });

    it('should be able to disable the required option', () => {
        let control = new FormControl(null);
        expect(isEqualTo(5, { notRequired: true })(control)).toEqual(null);
    });
    it('should be able to use a custom error property', () => {
        let control = new FormControl('1234');
        expect(isEqualTo(5, { customID: 'test' })(control)).toEqual({ test: 'Please enter exactly <strong>5 characters</strong>' });
    });
});
