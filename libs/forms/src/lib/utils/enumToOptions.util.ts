import { Forms } from "../forms.model";

/**
 * Converts an enum that uses pascal casing into a form fields options array
 * The value is turned into a label by splitting by upper case char
 * The value of the form field option is the enum value
 * 
 * @example
 *   export enum RetailLoCompPlan {
    InStateLoanReferral = 'InStateLoanReferral',
    InitialCompPeriod = 'InitialCompPeriod',
    SrJrComp = 'SrJrComp',
  }
  =>
  [{label:'In State Loan Referral', value: 'InStateLoanReferral'}, {label:'Initial Comp Period', value: 'InitialCompPeriod'}, {label:'Sr Jr Comp', value: 'SrJrComp'}]
 * @param enumObj 
 * @returns 
 */
export const enumToFieldOptions = <t extends object>(enumObj: t): Forms.FieldOptions[] => Object.keys(enumObj).map(key => ({
    label: String(enumObj[key as keyof t]).replace(/([a-z])([A-Z])/g, '$1 $2'),
    value: enumObj[key as keyof t]
}))