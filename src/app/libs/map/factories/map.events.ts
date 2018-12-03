import { MapObjects, MapObjectTypes } from './map.objects';

export const MapEvents = {
  /**
   * When a pushpin is clicked, show the infobox
   * @param e
   */
  pushpinClicked: (e: any, infoBox: Microsoft.Maps.Infobox) => {
    // Make sure the infobox has metadata to display.
    if (e.targetType === 'pushpin') {
      const pin: Microsoft.Maps.Pushpin = e.target;
      // Set the infobox options with the metadata of the pushpin.
      infoBox.setOptions({
        location: pin.getLocation(),
        /**
        htmlContent: 
        `<div class="infobox">
            <h3>Hello World</h3>
        </div>`,
         */
        title: pin.metadata.title,
        description: pin.metadata.description,
        visible: true,
      });
      // this.infoBox.setLocation(pin.getLocation());
    }
  },

  /**
   * On a map click event, add a pushpin on the clicked location
   * @param e
   * @param map
   * @param type
   */
  mapClickEvent: (e: Microsoft.Maps.IMouseEventArgs, map: Microsoft.Maps.Map, options: Map.Options) => {
    
    // If pushpin type is set to single, clear out all other pins
    if (options.pushPinsAddable === 'single') {
        map.entities.clear();
    }
    // Options for pushpins
    const pinOptions: Microsoft.Maps.IPushpinOptions = {};
    // If custom icon specified
    if (options.pushPinIcon) {
      pinOptions.icon = options.pushPinIcon;
    }

    // Create new pushpin
    const pushpin = MapObjectTypes.pushpin(e.location, pinOptions);
    map.entities.add(pushpin);
   
    if (options.pushPinRadius) {
      MapObjects.circleDraw(map, e.location, options.pushPinRadius);
    }
  }
};
