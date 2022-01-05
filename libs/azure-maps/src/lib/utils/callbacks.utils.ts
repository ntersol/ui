import { EventEmitter } from '@angular/core';
import { Action } from '../store/azure-maps.actions';
import { AzureMapsStore } from '../store/azure-maps.store';
import * as mapboxgl from 'mapbox-gl';

/**
 * Load event, named function is required to clean up listeners
 * @param store
 * @param map
 */
export function load(store: AzureMapsStore, map: any) {
  return function (e: any) {
    store.stateChange(Action.mapLoaded(map));
    store.events.load$.next(e);
  };
}
/**
export function styledata(store: AzureMapsStore) {
  return function (e: mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData) {
    store.events.styledata$.next(e);
  };
}
 */

export function zoomend(store: AzureMapsStore) {
  return function (e: mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData) {
    store.stateChange(Action.zoomChange(e.target.getZoom()));
  };
}

export function zoomendEmit(
  zoomEmitter: EventEmitter<mapboxgl.MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined> & mapboxgl.EventData>,
) {
  return function (e: mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData) {
    zoomEmitter.emit(e);
  };
}

export function dragend(
  dragEmitter: EventEmitter<mapboxgl.MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined> & mapboxgl.EventData>,
) {
  return function (e: mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData) {
    dragEmitter.emit(e);
  };
}
