import { NtsAzureMaps } from '..';
import { HtmlMarker, Popup } from 'azure-maps-control';
import * as atlas from 'azure-maps-control';
import { HtmlMarkerLayer } from '../layers/htmlMarkerLayer.layer';

/**
 * Add markers to map
 * @param map
 * @param markers
 */
export const markersAdd = (map?: atlas.Map | null, markers?: NtsAzureMaps.HtmlMarker[] | null, settings?: NtsAzureMaps.Settings | null) => {
  if (!map || !markers?.length) {
    return;
  }

  // Hold popup instance
  let popup: atlas.Popup | undefined;
  // If global popup specified, create a single instance popup
  if (settings?.popup?.global) {
    popup = new atlas.Popup({
      position: [0, 0],
      pixelOffset: [0, -18],
      ...settings?.popup?.global.options,
    });

    // When this popup is closed, emit event to parent
    map.events.add('close', popup, () => {
      // Wait till after call stack completes
      setTimeout(() => {
        // Check if there is still an open popup
        const isPopupOpen = map.popups.getPopups().reduce((a, b) => (a ? a : b.isOpen()), false);
        // If no popups are open, notify parent
        if (!isPopupOpen) {
          markers[0].events?.popup?.close?.emit();
        }
      });
    });
  }

  markers.forEach(m => {
    // Create marker class
    const marker = new HtmlMarker(m.options);
    // Add a custom ID if specified
    // AM doesn't expose a method to set the marker ID
    if (m.id) {
      (marker as any).id = m.id;
    }
    // Create popup
    if (m.popup) {
      const options = {
        ...m.popup,
        // Wrap pin content in container div so that an eventlistener can be attached
        // Resolves issue with clicking the close popup button firing the click event
        // Also removes the event listener automatically
        content: `<div class="popup-content-container-main">${m.popup.content}</div>`,
      } as atlas.PopupOptions;
      popup = new Popup(options);
      // popup.containerDiv is private
      // Accessing the element is necessary to add a pin click event
      const container = ((popup as any).containerDiv as HTMLDivElement).querySelectorAll('.popup-content-container-main');
      if (container.length) {
        container[0].addEventListener('click', () => m.events?.popup?.click?.emit(m));
      }
      // Update popup options
      marker.setOptions({ popup: popup });
    }

    // Add marker events
    markerEvents(map, marker, popup, settings, m);

    // Add marker to map
    map.markers.add(marker);
  });
};

/**
 * Attach marker events
 * @param map
 * @param marker
 * @param popup
 * @param settings
 * @param model
 */
export const markerEvents = (
  map?: atlas.Map | null,
  marker?: atlas.HtmlMarker,
  popup?: atlas.Popup,
  settings?: NtsAzureMaps.Settings | null,
  model?: NtsAzureMaps.HtmlMarker | Record<any, any>,
) => {
  if (!map || !marker) {
    return;
  }
  // Emit double click event for popup
  map.events.add('dblclick', marker, e =>
    settings?.events?.popup?.dblclick?.emit({
      properties: model,
      type: 'dblclick',
      entity: marker,
      e: e,
    }),
  );

  // Emit mouse enter event to parent
  map.events.add('mouseenter', marker, e =>
    settings?.events?.marker?.mouseenter?.emit({
      properties: model,
      type: 'mouseenter',
      entity: marker,
      e: e,
    }),
  );

  // If popup exists, emit popup close event to parent
  if (popup) {
    map.events.add('close', popup, e => {
      settings?.events?.popup?.close?.emit({
        properties: model,
        type: 'mouseenter',
        entity: marker,
        e: e,
      });
    });
  }

  // Add click event to emit to parent component
  // Adds active class to clicked pin, remove from other pins
  markerClick(map, marker, popup, settings, model);
};

/**
 * Manage the marker click event
 * @param map
 * @param marker
 * @param popup
 * @param settings
 */
export const markerClick = (
  map?: atlas.Map | null,
  marker?: atlas.HtmlMarker,
  popup?: atlas.Popup,
  settings?: NtsAzureMaps.Settings | null,
  model?: NtsAzureMaps.HtmlMarker | Record<any, any>,
) => {
  if (!map || !marker) {
    return;
  }

  // If popup, remove the active state on the marker when the popup is closed
  if (popup) {
    map.events.add('close', popup, () => {
      map.markers.getMarkers().forEach(m2 => {
        const elem = (m2 as any).element as HTMLDivElement;
        elem.classList.remove('marker-active');
      });
    });
  }

  // Look for a property of $$active in the model or marker. Currently used by the htmlmarker layer
  // If so set active state
  if ((model as any)?.$$active) {
    const elemCurrent = (marker as any).element as HTMLDivElement;
    // Add active css class, wrapped in settimeout because this event fires before global update
    setTimeout(() => elemCurrent.classList.add('marker-active'));
  }
  // Add click event
  map.events.add('click', marker, e => {
    // marker.element is private
    // Accessing the element is necessary to add a pin active state
    // Remove active state from other markers
    if (settings?.popup?.singleInstance) {
      map.markers.getMarkers().forEach(m2 => {
        // Nil check for badly formed popups
        if (m2.getOptions()?.popup?.close) {
          // Close any open popups
          m2.getOptions()?.popup?.close();
        }
        const elem = (m2 as any).element as HTMLDivElement;
        elem.classList.remove('marker-active');
      });
    }

    // Add active state
    const elemCurrent = (marker as any).element as HTMLDivElement;
    // Add active css class, wrapped in settimeout because this event fires before global update
    setTimeout(() => elemCurrent.classList.add('marker-active'));
    // If popup supplied, toggle it on click
    if (popup && settings?.popup?.global) {
      // Update global popup's position and content
      // Content is generated on acccess time
      const content = settings?.popup?.global?.content ? settings?.popup?.global?.content(model as any) : '';
      popup.setOptions({
        position: marker.getOptions().position,
        // Wrap pin content in container div so that an eventlistener can be attached
        // Resolves issue with clicking the close popup button firing the click event
        // Also removes the event listener automatically
        content: `<div class="popup-content-container-main">${content}</div>`,
      });
      // Add click event emitter to pass popup click to parent component
      const container = ((popup as any).containerDiv as HTMLDivElement).querySelectorAll('.popup-content-container-main');
      if (container.length) {
        container[0].addEventListener('click', e2 =>
          settings.events?.popup?.click?.emit({
            properties: model,
            type: 'click',
            entity: popup,
            e: e2,
          }),
        );
      }

      // Wrapped in settimeout because the global map click event fires after this one
      setTimeout(() => popup?.open(map));
    } else if (marker.getOptions().popup) {
      // Popup click event happens BEFORE map click event
      // Wrapped in settimeout to support clicking outside pin closing the pin
      setTimeout(() => marker.togglePopup());
    }
    // Emit pin click to parent component
    settings?.events?.marker?.click?.emit({
      properties: model,
      type: 'click',
      entity: marker,
      e: e,
    });
  });
};

/**
 * Set/unset active market status
 * @param map
 * @param markersActive
 */
export const markersActiveUpdate = (map?: atlas.Map | null, markersActive?: string[] | null) => {
  if (!map) {
    return;
  }

  // Get any marker layers
  const layers = map?.layers.getLayers().filter((l: any) => l.markerLayer) as HtmlMarkerLayer[];
  // Pass the marker layers any active markers
  if (layers?.length) {
    layers.forEach(l => l.markersActiveChange(markersActive));
  }

  // Remove all active
  map.markers.getMarkers().forEach((m: any) => {
    // If this marker is active, do not remove the active status
    if (markersActive?.length && markersActive.includes(m.id)) {
      return;
    } else {
      const elem = m.element as HTMLDivElement;
      elem.classList.remove('marker-active');
    }
  });

  // Set active
  if (markersActive?.length) {
    map.markers.getMarkers().forEach((m: any) => {
      if (markersActive.includes(m.id)) {
        const elem = m.element as HTMLDivElement;
        elem.classList.add('marker-active');
      }
    });
  }
};

/**
 * Remove event listeners on markers and popups
 * @param map
 */
export const markersCleanup = (map?: atlas.Map | null) => {
  if (!map) {
    return;
  }
  const markers = map.markers.getMarkers();
  if (!markers.length) {
    return;
  }
  markers.forEach(m => {
    // Remove any event listeners from the marker, also removes on children
    // This is a dirty way to do it but the simpliest with anonymous functions
    // Acceptable in this case because they are being removed prior to the marker element being destroyed
    const elem = (m as any).element as HTMLDivElement;
    const clone = elem?.cloneNode(true);
    elem?.parentNode?.replaceChild(clone, elem);

    // Remove popup event listeners, also removes on children
    const popup = m.getOptions().popup;
    if (popup) {
      const popElem = (popup as any).containerDiv as HTMLDivElement;
      const popClone = popElem?.cloneNode(true);
      popElem?.parentNode?.replaceChild(popClone, popElem);
    }
  });
};

/**
 * Convert a location array to a geo JSON
 * @param locations

export const markersConvertToGeoJSON = (markers: NtsAzureMaps.HtmlMarker[]): mapboxgl.GeoJSONSourceRaw => {
  return {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: markers.map(() => {
        return <any>{
          type: 'Feature',
          geometry: {
            type: 'Point',
            // coordinates: [m.getLngLat().lng, m.getLngLat().lat],
          },
        };
      }),
    },
  } as mapboxgl.GeoJSONSourceRaw;
};
 */
