import { MediaQueryRecord } from './visible.models';

export const mediaQueries: MediaQueryRecord = {
  all: {
    min: null,
    max: null,
  },
  xs: {
    min: 0,
    max: 575.98,
  },
  sm: {
    min: 576,
    max: 767.98,
  },
  md: {
    min: 768,
    max: 991.98,
  },
  lg: {
    min: 992,
    max: 1199.98,
  },
  xl: {
    min: 1200,
    max: null,
  },
  'sm-up': {
    min: 576,
    max: null,
  },
  'md-up': {
    min: 768,
    max: null,
  },
  'lg-up': {
    min: 992,
    max: null,
  },
  'xl-up': {
    min: null,
    max: 1200,
  },
  'xs-down': {
    min: null,
    max: 575.98,
  },
  'sm-down': {
    min: null,
    max: 767.98,
  },
  'md-down': {
    min: null,
    max: 991.98,
  },
  'lg-down': {
    min: null,
    max: 1199.98,
  },
};
