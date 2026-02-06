import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import {
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  TextSymbol,
  Font,
} from "@arcgis/core/symbols";
import {
  centerlineProjectColor,
  completedConstruction_color,
  construction_lineWidth,
  construction_lineWidth_project,
  labelStation_fontSize,
  lineWidth,
  maxScale,
  maxScale_stNumber,
  minScale,
  minScale_stNumber,
  opacity,
  pointColor,
  pointOutlineWidth,
  pointSize,
  tobeConstructed_color,
  underConstruction_color,
} from "./UniqueValues";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import Basemap from "@arcgis/core/Basemap";

export const basemapUserDefined = new Basemap({
  baseLayers: [
    new VectorTileLayer({
      portalItem: {
        id: "824fe99ab989479f83b9a6d7f2da0bcb",
      },
    }),
  ],
});

/////// Universal Renderere
export const pointSymbol = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    style: "circle",
    color: [0, 0, 0, 0.2],
    size: "3px",
    outline: {
      color: [0, 0, 0, 0],
      width: 0.5,
    },
  }),
});

export const lineSymbol_construction = new UniqueValueRenderer({
  field: "construcStat",
  uniqueValueInfos: [
    {
      value: "To Be Constructed",
      label: "To be Constructed",
      symbol: new SimpleLineSymbol({
        color: tobeConstructed_color,
        width: construction_lineWidth,
        style: "solid",
      }),
    },
    {
      value: "On-going",
      label: "Under Construction",
      symbol: new SimpleLineSymbol({
        color: underConstruction_color,
        width: construction_lineWidth,
        style: "solid",
      }),
    },
    {
      value: "Completed",
      label: "Completed",
      symbol: new SimpleLineSymbol({
        color: completedConstruction_color,
        width: construction_lineWidth,
        style: "solid",
      }),
    },
  ],
});

export const lineSymbol_construction_project = new UniqueValueRenderer({
  field: "construcStat",
  uniqueValueInfos: [
    {
      value: "To Be Constructed",
      label: "To be Constructed",
      symbol: new SimpleLineSymbol({
        color: tobeConstructed_color,
        width: construction_lineWidth_project,
        style: "solid",
      }),
    },
    {
      value: "On-going",
      label: "Under Construction",
      symbol: new SimpleLineSymbol({
        color: underConstruction_color,
        width: construction_lineWidth_project,
        style: "solid",
      }),
    },
    {
      value: "Completed",
      label: "Completed",
      symbol: new SimpleLineSymbol({
        color: completedConstruction_color,
        width: construction_lineWidth_project,
        style: "solid",
      }),
    },
  ],
});

// ----------------- MMSP ----------------//
export const lineSymbol_mmsp = new SimpleRenderer({
  label: "MMSP",
  symbol: new SimpleLineSymbol({
    color: centerlineProjectColor.mmsp_hex,
    width: lineWidth,
    style: "solid",
  }),
});

export const stationPointSymbol_mmsp = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    style: "circle",
    color: pointColor,
    size: pointSize, // pixels
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: centerlineProjectColor.mmsp_hex,
      width: pointOutlineWidth, // points
    },
  }),
});

export const mmspLabelStation = new LabelClass({
  symbol: {
    type: "text",
    color: centerlineProjectColor.mmsp_hex,
    haloColor: "black",
    haloSize: 0.1,
    font: {
      size: labelStation_fontSize,
      //weight: "bold"
    },
  },
  deconflictionStrategy: "none", // show overlapping numbers
  labelPlacement: "center-left",
  labelExpressionInfo: {
    expression: "$feature.Station1",
  },
  minScale: minScale,
  maxScale: maxScale,
});

export const mmspStationLayer = new FeatureLayer({
  portalItem: {
    id: "0b656bc41e824da9a847101af4427f25",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "MMSP Station",
  definitionExpression: "Station1 <> 'FTI'" + " AND " + "Station1 <> 'Bicutan'",
  popupEnabled: false,
  labelingInfo: [mmspLabelStation],
  renderer: stationPointSymbol_mmsp,
  opacity: opacity,
});
mmspStationLayer.listMode = "hide";

export const stationPointRenderer_construction_mmsp = new UniqueValueRenderer({
  field: "construcStatus",
  // defaultSymbol: defaultStationPoint_nscr,
  uniqueValueInfos: [
    {
      value: "To Be Constructed",
      label: "To Be Constructed",
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        color: tobeConstructed_color,
        size: pointSize, // pixels
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: centerlineProjectColor.mmsp_hex,
          width: pointOutlineWidth, // points
        },
      }),
    },
    {
      value: "On-going",
      label: "Under Construction",
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        color: underConstruction_color,
        size: pointSize, // pixels
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: centerlineProjectColor.mmsp_hex,
          width: pointOutlineWidth, // points
        },
      }),
    },
    {
      value: "Completed",
      label: "Completed",
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        color: completedConstruction_color,
        size: pointSize, // pixels
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: centerlineProjectColor.mmsp_hex,
          width: pointOutlineWidth, // points
        },
      }),
    },
  ],
});

export const mmspCenterlineLayer = new FeatureLayer({
  portalItem: {
    id: "0b656bc41e824da9a847101af4427f25",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "MMSP Centerline",
  renderer: lineSymbol_mmsp,
  popupEnabled: false,
});

export const mmspCenterlineConstruction = new FeatureLayer({
  portalItem: {
    id: "0b656bc41e824da9a847101af4427f25",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "MMSP Centerline",
  renderer: lineSymbol_construction,
  popupEnabled: false,
});

export const mmspGraphicsLayer = new GraphicsLayer();
mmspGraphicsLayer.listMode = "hide";

export const mmspGraphicsLayer_cpLabel = new GraphicsLayer({
  maxScale: maxScale,
  minScale: minScale,
});
mmspGraphicsLayer_cpLabel.listMode = "hide";

const lineSymbolOverview_mmsp = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: centerlineProjectColor.mmsp_hex,
    width: "2.5px",
    style: "solid",
  }),
});

export const mmspCenterlineOverView = new FeatureLayer({
  portalItem: {
    id: "0b656bc41e824da9a847101af4427f25",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  renderer: lineSymbolOverview_mmsp,
  // labelingInfo: false,
  popupEnabled: false,
});

// ----------------- NSCR ----------------//
export const lineSymbol_nscr = new SimpleRenderer({
  label: "NSCR",
  symbol: new SimpleLineSymbol({
    color: centerlineProjectColor.nscr_hex,
    width: lineWidth,
    style: "solid",
  }),
});

export const n1CenterlineLayer = new FeatureLayer({
  portalItem: {
    id: "f82b7c9fc8744a99881ce2507f56675b",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "NSCR Centerline",
  renderer: lineSymbol_nscr,
  popupEnabled: false,
});

export const n1BreakPointsCP = new FeatureLayer({
  portalItem: {
    id: "3adf245151f94bddb2425dbef365e148",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  title: "N1 Break Points",
  // layerId: 2,
  definitionExpression: "Id >= 1",
  popupEnabled: false,
  renderer: pointSymbol,
});
n1BreakPointsCP.listMode = "hide";

export const stationPointSymbol_nscr = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol({
    style: "circle",
    color: pointColor,
    size: pointSize, // pixels
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: centerlineProjectColor.nscr_hex,
      width: pointOutlineWidth, // points
    },
  }),
});

export const n1_station_label: any = new TextSymbol({
  color: centerlineProjectColor.nscr_hex,
  haloColor: "black",
  haloSize: 0.1,
  font: new Font({
    size: labelStation_fontSize,
    //weight: "bold"
  }),
});

export const n1LabelStation = new LabelClass({
  symbol: n1_station_label,
  deconflictionStrategy: "none", // show overlapping numbers
  labelPlacement: "center-right",
  labelExpressionInfo: {
    expression: "$feature.Station",
  },
  minScale: minScale,
  maxScale: maxScale,
});

export const n1StationLayer = new FeatureLayer({
  portalItem: {
    id: "f82b7c9fc8744a99881ce2507f56675b",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "MMSP Station",
  popupEnabled: false,
  labelingInfo: [n1LabelStation], //[n1LabelStation],
  renderer: stationPointSymbol_nscr,
  opacity: opacity,
});
n1StationLayer.listMode = "hide";

export const n1_station_label_number: any = new TextSymbol({
  color: centerlineProjectColor.nscr_hex,
  haloColor: "black",
  haloSize: 0.1,
  font: new Font({
    size: labelStation_fontSize,
    //weight: "bold"
  }),
});

export const n1LabelStation_number = new LabelClass({
  symbol: n1_station_label_number,
  deconflictionStrategy: "none", // show overlapping numbers
  labelPlacement: "below-left",
  labelExpressionInfo: {
    expression: "$feature.station_number + TextFormatting.NewLine",
  },
  minScale: minScale_stNumber,
  maxScale: maxScale_stNumber, //288896
});

export const n1CenterlineConstruction = new FeatureLayer({
  portalItem: {
    id: "f82b7c9fc8744a99881ce2507f56675b",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  popupEnabled: false,
  renderer: lineSymbol_construction,
});
n1CenterlineConstruction.labelsVisible = false;

export const lineSymbol_nscrex = new SimpleRenderer({
  label: "NSCR-Ex",
  symbol: new SimpleLineSymbol({
    color: centerlineProjectColor.nscrex_hex,
    width: lineWidth,
    style: "solid",
  }),
});

export const stationPointRenderer_construction_nscr = new UniqueValueRenderer({
  field: "construcStatus",
  // defaultSymbol: defaultStationPoint_nscr,
  uniqueValueInfos: [
    {
      value: "To Be Constructed",
      label: "To Be Constructed",
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        color: tobeConstructed_color,
        size: pointSize, // pixels
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: centerlineProjectColor.nscr_hex,
          width: pointOutlineWidth, // points
        },
      }),
    },
    {
      value: "On-going",
      label: "Under Construction",
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        color: underConstruction_color,
        size: pointSize, // pixels
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: centerlineProjectColor.nscr_hex,
          width: pointOutlineWidth, // points
        },
      }),
    },
    {
      value: "Completed",
      label: "Completed",
      symbol: new SimpleMarkerSymbol({
        style: "circle",
        color: completedConstruction_color,
        size: pointSize, // pixels
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: centerlineProjectColor.nscr_hex,
          width: pointOutlineWidth, // points
        },
      }),
    },
  ],
});

export const n1GraphicsLayer = new GraphicsLayer();
n1GraphicsLayer.listMode = "hide";

export const n1GraphicsLayer_cpLabel = new GraphicsLayer({
  maxScale: maxScale,
  minScale: minScale,
});
n1GraphicsLayer_cpLabel.listMode = "hide";

// ----------------- NSCR-Ex ----------------//
//// N2

export const n2_station_label: any = new TextSymbol({
  color: centerlineProjectColor.nscrex_hex,
  haloColor: "black",
  haloSize: 0.1,
  font: new Font({
    size: labelStation_fontSize,
    //weight: "bold"
  }),
});

export const n2LabelStation = new LabelClass({
  symbol: n2_station_label,

  deconflictionStrategy: "none", // show overlapping numbers
  labelPlacement: "center-left",
  labelExpressionInfo: {
    expression: "$feature.Station",
  },
  minScale: minScale,
  maxScale: maxScale,
});

export const n2BreakPointsCP = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "N2 Break Points",
  definitionExpression: "Extension = 'N2'" + " AND " + "Id >= 1",
  popupEnabled: false,
  renderer: pointSymbol,
});
n2BreakPointsCP.listMode = "hide";

export const n2StationLayer = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 1,
  title: "Station",
  popupEnabled: false,
  definitionExpression: "Station <> 'NCC'",
  renderer: stationPointSymbol_nscr,
  labelingInfo: [n2LabelStation], //[n2LabelStation],
  opacity: opacity,
});
n2StationLayer.listMode = "hide";

export const n2_station_label_number: any = new TextSymbol({
  color: centerlineProjectColor.nscr_hex,
  haloColor: "black",
  haloSize: 0.1,
  font: new Font({
    size: labelStation_fontSize,
    //weight: "bold"
  }),
});

export const n2LabelStation_number = new LabelClass({
  symbol: n2_station_label_number,
  deconflictionStrategy: "none", // show overlapping numbers
  labelPlacement: "below-left",
  labelExpressionInfo: {
    expression: "$feature.station_number",
  },
  minScale: minScale_stNumber,
  maxScale: maxScale_stNumber, //288896
});

export const n2CenterlineConstruction = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  definitionExpression: "Extension = 'N2'",
  popupEnabled: false,
  renderer: lineSymbol_construction,
});

export const n2CenterlineLayer = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 2,
  title: "N2 Centerline",
  renderer: lineSymbol_nscrex,
  outFields: ["*"],
  popupEnabled: false,
});

export const n2GraphicsLayer = new GraphicsLayer();
n2GraphicsLayer.listMode = "hide";

export const n2GraphicsLayer_cpLabel = new GraphicsLayer({
  maxScale: maxScale,
  minScale: minScale,
});
n2GraphicsLayer_cpLabel.listMode = "hide";

//// SC
export const scCenterlineLayer = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 6,
  title: "SC Centerline",
  renderer: lineSymbol_nscrex,
  outFields: ["*"],
  popupEnabled: false,
});

export const scBreakPointsCP = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  title: "SC Break Points",
  definitionExpression: "Extension = 'SC'" + " AND " + "Id >= 1",
  popupEnabled: false,
  renderer: pointSymbol,
});
scBreakPointsCP.listMode = "hide";

export const sc_station_label: any = new TextSymbol({
  color: centerlineProjectColor.nscr_hex,
  haloColor: "black",
  haloSize: 0.1,
  font: new Font({
    size: labelStation_fontSize,
    //weight: "bold"
  }),
});

export const scLabelStation = new LabelClass({
  symbol: sc_station_label,
  deconflictionStrategy: "none", // show overlapping numbers
  labelPlacement: "center-right",
  labelExpressionInfo: {
    expression: "$feature.Station",
  },
  minScale: minScale,
  maxScale: maxScale,
});

export const scStationLayer = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 5,
  title: "SC Station",
  outFields: ["*"],
  popupEnabled: false,
  labelingInfo: [scLabelStation], //[scLabelStation],
  renderer: stationPointSymbol_nscr,
  opacity: opacity,
});
scStationLayer.listMode = "hide";

export const sc_station_label_number: any = new TextSymbol({
  color: centerlineProjectColor.nscr_hex,
  haloColor: "black",
  haloSize: 0.1,
  font: new Font({
    size: labelStation_fontSize,
    //weight: "bold"
  }),
});

export const scLabelStation_number = new LabelClass({
  symbol: sc_station_label_number,
  deconflictionStrategy: "none", // show overlapping numbers
  labelPlacement: "below-left",
  labelExpressionInfo: {
    expression: "\n$feature.station_number",
  },
  minScale: 25000000,
  maxScale: 0, //288896
});

export const scCenterlineConstruction = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 4,
  definitionExpression: "Extension = 'SC'",
  popupEnabled: false,
  renderer: lineSymbol_construction,
});

export const scGraphicsLayer = new GraphicsLayer();
scGraphicsLayer.listMode = "hide";

export const scGraphicsLayer_cpLabel = new GraphicsLayer({
  maxScale: maxScale,
  minScale: minScale,
});
scGraphicsLayer_cpLabel.listMode = "hide";

// ----------------- Overview Map ----------------//
export const lineSymbolOverview_nscr = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: centerlineProjectColor.nscr_hex,
    width: "2.5px",
    style: "solid",
  }),
});

export const n1CenterlineOverView = new FeatureLayer({
  portalItem: {
    id: "f82b7c9fc8744a99881ce2507f56675b",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  layerId: 3,
  renderer: lineSymbolOverview_nscr,
  popupEnabled: false,
});

export const lineSymbolOverview_nscrex = new SimpleRenderer({
  symbol: new SimpleLineSymbol({
    color: centerlineProjectColor.nscrex_hex,
    width: "2.5px",
    style: "solid",
  }),
});

export const n2CenterlineOverView = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  renderer: lineSymbolOverview_nscrex,
  layerId: 2,
  popupEnabled: false,
});

export const scCenterlineOverView = new FeatureLayer({
  portalItem: {
    id: "ace32f63bafc40f6bcfeecbee5fa6c69",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  renderer: lineSymbolOverview_nscrex,
  layerId: 6,
  popupEnabled: false,
});

// ----------------- Airport and Manila Pins ----------------//
// Clark International Airport Pins

export const clarkAirport_pin = new FeatureLayer({
  portalItem: {
    id: "158b39ce19c24015b0476c24af9f5264",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  definitionExpression: "TITLE = 'Clark International Airport'",
  popupEnabled: false,
  opacity: 0,
});
export const clarkAirport_pin_pointGraphicLayer = new GraphicsLayer();
clarkAirport_pin_pointGraphicLayer.listMode = "hide";

export const clarkAirport_pin_lineGraphicsLayer = new GraphicsLayer({
  // maxScale: maxScale,
  // minScale: minScale,
});
clarkAirport_pin_lineGraphicsLayer.listMode = "hide";

// Ninoy Internation Airport Pins
export const airport_pin = new FeatureLayer({
  portalItem: {
    id: "158b39ce19c24015b0476c24af9f5264",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  definitionExpression: "TITLE = 'Ninoy Aquino International Airport'",
  popupEnabled: false,
  opacity: 0,
});

// Label 'Manila' on the map
export const airport_pin_pointGraphicLayer = new GraphicsLayer();
airport_pin_pointGraphicLayer.listMode = "hide";

export const airport_pin_lineGraphicsLayer = new GraphicsLayer({
  //maxScale: maxScale,
  //minScale: minScale
});
airport_pin_lineGraphicsLayer.listMode = "hide";

export const manila_pin = new FeatureLayer({
  portalItem: {
    id: "158b39ce19c24015b0476c24af9f5264",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
  definitionExpression: "TITLE = 'Manila'",
  popupEnabled: false,
  opacity: 0,
});
// Label 'Manila' on the map
export const manila_pin_pointGraphicLayer = new GraphicsLayer();
manila_pin_pointGraphicLayer.listMode = "hide";

export const manila_pin_lineGraphicsLayer = new GraphicsLayer({
  //maxScale: maxScale,
  //minScale: minScale
});
manila_pin_lineGraphicsLayer.listMode = "hide";

// date table
export const dateTable = new FeatureLayer({
  portalItem: {
    id: "b2a118b088a44fa0a7a84acbe0844cb2",
    portal: {
      url: "https://gis.railway-sector.com/portal",
    },
  },
});
