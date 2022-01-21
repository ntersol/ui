// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { isEqualTo } from './chars.validators';

describe('Character validator', () => {

    it('should be valid', () => {
        let control = new FormControl('12345');
        expect(isEqualTo(5)(control)).toEqual(null);
    });
});
