import { SimpleFillSymbol } from "@arcgis/core/symbols";
import {
  airport_pin,
  airport_pin_lineGraphicsLayer,
  airport_pin_pointGraphicLayer,
  clarkAirport_pin,
  clarkAirport_pin_lineGraphicsLayer,
  clarkAirport_pin_pointGraphicLayer,
  dateTable,
  lineSymbol_construction,
  lineSymbol_construction_project,
  manila_pin,
  manila_pin_lineGraphicsLayer,
  manila_pin_pointGraphicLayer,
  mmspCenterlineConstruction,
  mmspCenterlineLayer,
  mmspGraphicsLayer,
  mmspGraphicsLayer_cpLabel,
  mmspStationLayer,
  n1_station_label,
  n1BreakPointsCP,
  n1CenterlineConstruction,
  n1CenterlineLayer,
  n1GraphicsLayer,
  n1GraphicsLayer_cpLabel,
  n1StationLayer,
  n2_station_label,
  n2BreakPointsCP,
  n2CenterlineConstruction,
  n2CenterlineLayer,
  n2GraphicsLayer,
  n2GraphicsLayer_cpLabel,
  n2LabelStation,
  n2LabelStation_number,
  n2StationLayer,
  sc_station_label,
  scBreakPointsCP,
  scCenterlineConstruction,
  scCenterlineLayer,
  scGraphicsLayer,
  scGraphicsLayer_cpLabel,
  scLabelStation,
  scLabelStation_number,
  scStationLayer,
  stationPointRenderer_construction_mmsp,
  stationPointRenderer_construction_nscr,
  stationPointSymbol_mmsp,
  stationPointSymbol_nscr,
} from "./layers";
import {
  centerlineProjectColor,
  cpFontSize,
  cpLabelColor,
  cpLineColor,
  cpLineWidth,
  fontSizeAirport,
  home_rotation,
  labelStation_fontSize_default,
  projectLabelFontSize,
  xoffset_mmsp,
  xoffset_mmsp_reset,
  xoffset_n1,
  xoffset_n1_reset,
  xoffset_n2,
  xoffset_n2_reset,
  xoffset_sc,
  xoffset_sc_reset,
  yoffset_mmsp,
  yoffset_mmsp_reset,
  yoffset_n1,
  yoffset_n1_reset,
  yoffset_n2,
  yoffset_n2_reset,
  yoffset_sc,
  yoffset_sc_reset,
} from "./UniqueValues";
import Graphic from "@arcgis/core/Graphic";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import * as promiseUtils from "@arcgis/core/core/promiseUtils";

export function lastDateOfMonth(date: any) {
  const old_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const year = old_date.getFullYear();
  const month = old_date.getMonth() + 1;

  const final_date = `${month} ${year}`;

  return final_date;
}

// Updat date
export async function dateUpdate(category: any) {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const query = dateTable.createQuery();
  const queryExpression =
    "project = 'N2SC'" + " AND " + "category = '" + category + "'";
  query.where = queryExpression; // "project = 'N2'" + ' AND ' + "category = 'Land Acquisition'";

  return dateTable.queryFeatures(query).then((response) => {
    const stats = response.features;
    const dates = stats.map((result) => {
      // get today and date recorded in the table
      const today = new Date();
      const date = new Date(result.attributes.date);

      // Calculate the number of days passed since the last update
      const time_passed = today.getTime() - date.getTime();
      const days_passed = Math.round(time_passed / (1000 * 3600 * 24));

      const year = date.getFullYear();
      const month = monthList[date.getMonth()];
      const day = date.getDate();
      const final = year < 1990 ? "" : `${month} ${day}, ${year}`;
      return [final, days_passed];
    });
    return dates;
  });
}

//// --------------------- MMSP ------------------------------- ////
export function mmspAlignmentRenderer(projectSelected: any) {
  mmspStationLayer.renderer = stationPointSymbol_mmsp;
  mmspStationLayer.visible = true;
  mmspGraphicsLayer.visible = true;
  mmspGraphicsLayer_cpLabel.visible = true;
  mmspCenterlineLayer.visible = true;
  mmspCenterlineConstruction.visible = false;
  mmspGraphicsLayerMove(projectSelected);
}

export function mmspProgressRenderer(projectSelected: any) {
  mmspStationLayer.renderer = stationPointRenderer_construction_mmsp;
  mmspStationLayer.visible = true;
  mmspGraphicsLayer.visible = true;
  mmspGraphicsLayer_cpLabel.visible = true;
  mmspCenterlineLayer.visible = false;
  mmspCenterlineConstruction.visible = true;
  mmspGraphicsLayerMove(projectSelected);
}

export function mmspNoneRenderer() {
  mmspStationLayer.visible = false;
  mmspGraphicsLayer.visible = false;
  mmspGraphicsLayer_cpLabel.visible = false;
  mmspCenterlineLayer.visible = false;
  mmspCenterlineConstruction.visible = false;
}

function mmspGraphics(xoffset: any, yoffset: any) {
  const query = mmspStationLayer.createQuery();
  query.orderByFields = ["Id"];
  query.where = "Id >= 1";
  const mmsp_cps = [
    "CP101",
    "CP102",
    "CP103",
    "CP104",
    "CP105",
    "CP108",
    "CP109",
  ];

  mmspStationLayer.queryFeatures(query).then((response) => {
    const stats = response.features;
    const paths: any = [];
    const points: any = [];

    stats.forEach((result: any) => {
      // Collect geometry of each break point
      const pointX0 = result.geometry.longitude;
      const pointY0 = result.geometry.latitude;

      // Calculate end poins and store it in a path for line generation
      const pointX1 = pointX0 + 0.04;
      const path = [
        [pointX0, pointY0],
        [pointX1, pointY0],
      ];

      // Append each path to paths
      paths.push(path);

      // Calculate a point for text symbol
      const point = [pointX1, pointY0];
      points.push(point);
    });

    // 1. Draw a horizontal line at break points of individual CPs
    // Define polyline paths and type
    const polyline: any = {
      type: "polyline",
      paths: paths,
    };

    // Set line properties
    const simpleLineSymbol: any = {
      type: "simple-line",
      color: cpLineColor,
      width: cpLineWidth,
    };

    // Add to Graphic
    const mmspPolylineGraphic = new Graphic({
      geometry: polyline,
      symbol: simpleLineSymbol,
    });

    mmspGraphicsLayer_cpLabel.add(mmspPolylineGraphic);

    // 2. Add text symbol
    for (let i = 0; i < points.length; i++) {
      if (i <= points.length - 2) {
        const pointTextX = points[i][0] + 0.01;
        const pointTextY0 = points[i][1];
        const pointTextY1 = points[i + 1][1];
        const pointTextY = (pointTextY0 + pointTextY1) / 2;

        const point: any = {
          type: "point",
          longitude: pointTextX,
          latitude: pointTextY,
        };

        const textSymbol: any = {
          type: "text", // autocasts as new TextSymbol()
          color: cpLabelColor,
          //haloColor: "black",
          //haloSize: "1px",
          text: mmsp_cps[i],
          //xoffset: 3,
          //yoffset: -5,
          font: {
            // autocasts as new Font()
            size: cpFontSize,
            //family: "Josefin Slab",
            weight: "bold",
          },
        };

        const mmspPointGraphic = new Graphic({
          geometry: point,
          symbol: textSymbol,
        });
        mmspGraphicsLayer_cpLabel.add(mmspPointGraphic);
      }
    }
    // Add Project label
    const mmspProjectLableSymbol: any = {
      type: "text", // autocasts as new TextSymbol()
      color: centerlineProjectColor.mmsp_hex,
      //backgroundColor: projectBackgroundColor,
      //haloColor: "black",
      //haloSize: "0.3px",
      text: "Metro Manila Subway Project\n28km",
      horizontalAlignment: "left",
      //xoffset: 3,
      //yoffset: -5,
      font: {
        // autocasts as new Font()
        size: projectLabelFontSize,
        //family: "Merriweather",
        //style: "italic",
        weight: "bold",
      },
    };
    const j = 0;
    const pointTextX_pLabel = points[j][0] + 0.038 + xoffset;
    const pointTextY0_pLabel = points[j][1];
    const pointTextY1_pLabel = points[j + 1][1] - 0.01 + yoffset;
    const pointTextY_pLabel = (pointTextY0_pLabel + pointTextY1_pLabel) / 2;

    const projectPoint: any = {
      type: "point",
      longitude: pointTextX_pLabel,
      latitude: pointTextY_pLabel,
    };

    const mmspProjectLabelGraphic = new Graphic({
      geometry: projectPoint,
      symbol: mmspProjectLableSymbol,
    });
    mmspGraphicsLayer.add(mmspProjectLabelGraphic);
  });
}

export function mmspGraphicsLayerMove(projectSelected: any) {
  mmspGraphicsLayer_cpLabel.removeAll();
  mmspGraphicsLayer.removeAll();

  let xoffset;
  let yoffset;
  if (projectSelected === "All") {
    xoffset = xoffset_mmsp;
    yoffset = yoffset_mmsp;
  } else {
    xoffset = xoffset_mmsp_reset;
    yoffset = yoffset_mmsp_reset;
  }
  mmspGraphics(xoffset, yoffset);
}

//// --------------------- N1 ------------------------------- ////
export function n1AlignmentRenderer(projectSelected: any) {
  n1StationLayer.renderer = stationPointSymbol_nscr;
  n1StationLayer.visible = true;
  n1GraphicsLayer.visible = true;
  n1GraphicsLayer_cpLabel.visible = true;
  n1CenterlineLayer.visible = true;
  n1CenterlineConstruction.visible = false;
  n1GraphicsLayerMove(projectSelected);
}

export function n1ProgressRenderer(projectSelected: any) {
  n1StationLayer.renderer = stationPointRenderer_construction_nscr;
  n1StationLayer.visible = true;
  n1GraphicsLayer.visible = true;
  n1GraphicsLayer_cpLabel.visible = true;
  n1CenterlineLayer.visible = false;
  n1CenterlineConstruction.visible = true;
  n1GraphicsLayerMove(projectSelected);
}

export function n1NoneRenderer() {
  n1StationLayer.visible = false;
  n1GraphicsLayer.visible = false;
  n1GraphicsLayer_cpLabel.visible = false;
  n1CenterlineLayer.visible = false;
  n1CenterlineConstruction.visible = false;
}

function n1Graphics(xoffset: any, yoffset: any) {
  const query = n1BreakPointsCP.createQuery();
  query.orderByFields = ["Id"];
  query.where = "Id >= 1";

  n1BreakPointsCP.queryFeatures(query).then((response) => {
    const stats = response.features;
    const paths: any = [];
    const points: any = [];
    const CPs: any = [];

    stats.forEach((result: any) => {
      const attributes = result.attributes;
      const cp = attributes.CP;
      CPs.push(cp);

      // Collect geometry of each break point
      const pointX0 = result.geometry.longitude;
      const pointY0 = result.geometry.latitude;

      // Calculate end poins and store it in a path for line generation
      const pointX1 = pointX0 - 0.04;
      const path = [
        [pointX0, pointY0],
        [pointX1, pointY0],
      ];

      // Append each path to paths
      paths.push(path);

      // Calculate a point for text symbol
      const point = [pointX1, pointY0];
      points.push(point);
    });
    // 1. Draw a horizontal line at break points of individual CPs
    // Define polyline paths and type
    const polyline: any = {
      type: "polyline",
      paths: paths,
    };

    // Set line properties
    const simpleLineSymbol: any = {
      type: "simple-line",
      color: cpLineColor,
      width: cpLineWidth,
    };

    // Add to Graphic
    const n1PolylineGraphic = new Graphic({
      geometry: polyline,
      symbol: simpleLineSymbol,
    });
    n1GraphicsLayer_cpLabel.add(n1PolylineGraphic);
    // 2. Add text symbol
    for (let i = 0; i < points.length; i++) {
      if (i <= points.length - 1) {
        let pointTextX: any;
        let pointTextY: any;

        if (CPs[i] === "CP02") {
          pointTextX = points[i][0] - 0.075;
          pointTextY = points[i][1] + 0.015;
        } else if (CPs[i] === "CP01") {
          pointTextX = points[i][0] - 0.01;
          pointTextY = points[i][1] + 0.06;
        } else if (CPs[i] === "CP06") {
          pointTextX = points[i][0];
          pointTextY = points[i][1] + 0.035;
        } else if (CPs[i] === "CP05") {
          pointTextX = points[i][0] - 0.003;
          pointTextY = points[i][1] + 0.0045;
        } else {
          pointTextX = points[i][0];
          pointTextY = points[i][1];
        }

        // console.log(pointTextX);
        // console.log(pointTextY);

        const point: any = {
          type: "point",
          longitude: pointTextX,
          latitude: pointTextY,
        };

        const textSymbol: any = {
          type: "text", // autocasts as new TextSymbol()
          color: cpLabelColor,
          //haloColor: "black",
          //haloSize: "1px",
          text: CPs[i],
          //xoffset: 3,
          //yoffset: -5,
          font: {
            // autocasts as new Font()
            size: cpFontSize,
            //family: "Josefin Slab",
            weight: "bold",
          },
        };

        const n1PointGraphic = new Graphic({
          geometry: point,
          symbol: textSymbol,
        });
        n1GraphicsLayer_cpLabel.add(n1PointGraphic);
      }
    }
    // Add Project label
    const n1ProjectLableSymbol: any = {
      type: "text", // autocasts as new TextSymbol()
      color: centerlineProjectColor.nscr_hex,
      //backgroundColor: projectBackgroundColor,
      text: "North-South Commuter Railway\n(Malolos-Tutuban)\n38km",
      horizontalAlignment: "left",
      //yoffset: -5,
      font: {
        // autocasts as new Font()
        size: projectLabelFontSize,
        //family: "Merriweather",
        //style: "italic",
        weight: "bold",
      },
    };
    const j = 2;
    const pointTextX_pLabel = points[j][0] + xoffset; // points[j][0] + 0.15 + xoffset;
    const pointTextY0_pLabel = points[j][1];
    const pointTextY1_pLabel = points[j + 1][1] + yoffset; // points[j + 1][1] + 0.05 + yoffset;
    const pointTextY_pLabel = (pointTextY0_pLabel + pointTextY1_pLabel) / 2;

    const projectPoint: any = {
      type: "point",
      longitude: pointTextX_pLabel,
      latitude: pointTextY_pLabel,
    };

    const n1ProjectLabelGraphic = new Graphic({
      geometry: projectPoint,
      symbol: n1ProjectLableSymbol,
    });

    n1GraphicsLayer.add(n1ProjectLabelGraphic);
  });
}

export function n1GraphicsLayerMove(projectSelected: any) {
  n1GraphicsLayer_cpLabel.removeAll();
  n1GraphicsLayer.removeAll();

  let xoffset: any;
  let yoffset: any;
  if (projectSelected === "All") {
    xoffset = xoffset_n1;
    yoffset = yoffset_n1;
  } else {
    xoffset = xoffset_n1_reset;
    yoffset = yoffset_n1_reset;
  }
  n1Graphics(xoffset, yoffset);
}

//// --------------------- N2 ------------------------------- ////
export function n2AlignmentRenderer(projectSelected: any) {
  n2StationLayer.renderer = stationPointSymbol_nscr;
  n2StationLayer.visible = true;
  n2GraphicsLayer.visible = true;
  n2GraphicsLayer_cpLabel.visible = true;
  n2CenterlineLayer.visible = true;
  n2CenterlineConstruction.visible = false;
  n2GraphicsLayerMove(projectSelected);
}

export function n2ProgressRenderer(projectSelected: any) {
  n2StationLayer.renderer = stationPointRenderer_construction_nscr;
  n2StationLayer.visible = true;
  n2GraphicsLayer.visible = true;
  n2GraphicsLayer_cpLabel.visible = true;
  n2CenterlineLayer.visible = false;
  n2CenterlineConstruction.visible = true;
  n2GraphicsLayerMove(projectSelected);
}

export function n2NoneRenderer() {
  n2StationLayer.visible = false;
  n2GraphicsLayer.visible = false;
  n2GraphicsLayer_cpLabel.visible = false;
  n2CenterlineLayer.visible = false;
  n2CenterlineConstruction.visible = false;
}

function n2Graphics(xoffset: any, yoffset: any) {
  const query = n2BreakPointsCP.createQuery();
  query.orderByFields = ["Id"];
  n2BreakPointsCP.queryFeatures(query).then((response: any) => {
    const stats = response.features;
    const paths: any = [];
    const points: any = [];
    const CPs: any = [];

    stats.forEach((result: any) => {
      const attributes = result.attributes;
      const cp = attributes.CP;
      CPs.push(cp);

      // Collect geometry of each break point
      const pointX0 = result.geometry.longitude;
      const pointY0 = result.geometry.latitude;

      // Calculate end poins and store it in a path for line generation
      const pointX1 = pointX0 + 0.05;
      const path = [
        [pointX0, pointY0],
        [pointX1, pointY0],
      ];

      // Append each path to paths
      paths.push(path);

      // Calculate a point for text symbol
      const point = [pointX1, pointY0];
      points.push(point);
    });

    // 1. Draw a horizontal line at break points of individual CPs
    // Define polyline paths and type
    const polyline: any = {
      type: "polyline",
      paths: paths,
    };

    // Set line properties
    const simpleLineSymbol: any = {
      type: "simple-line",
      color: cpLineColor,
      width: cpLineWidth,
    };

    // Add to Graphic
    const n2PolylineGraphic = new Graphic({
      geometry: polyline,
      symbol: simpleLineSymbol,
    });
    n2GraphicsLayer_cpLabel.add(n2PolylineGraphic);

    // 2. Add text symbol
    for (let i = 0; i < points.length; i++) {
      if (i <= points.length - 2) {
        const pointTextX = points[i][0] + 0.03;
        const pointTextY0 = points[i][1];
        const pointTextY1 = points[i + 1][1];
        const pointTextY = (pointTextY0 + pointTextY1) / 2;

        const point: any = {
          type: "point",
          longitude: pointTextX,
          latitude: pointTextY,
        };

        const textSymbol: any = {
          type: "text", // autocasts as new TextSymbol()
          color: cpLabelColor,
          //haloColor: "black",
          //haloSize: "1px",
          text: CPs[i],
          //xoffset: 3,
          //yoffset: -5,
          font: {
            // autocasts as new Font()
            size: cpFontSize,
            //family: "Josefin Slab",
            weight: "bold",
          },
        };

        const n2PointGraphic = new Graphic({
          geometry: point,
          symbol: textSymbol,
        });

        n2GraphicsLayer_cpLabel.add(n2PointGraphic);
      }
    }

    // Project Label
    // Add Project label (N2)
    const n2ProjectLableSymbol: any = {
      type: "text", // autocasts as new TextSymbol()
      color: centerlineProjectColor.nscrex_hex,
      //backgroundColor: projectBackgroundColor,
      //haloColor: "black",
      //haloSize: "1px",
      text: "North-South Commuter Railway Ext.\n(Malolos-Clark)\n51km",
      horizontalAlignment: "right",
      //xoffset: 3,
      //yoffset: -5,
      font: {
        // autocasts as new Font()
        size: projectLabelFontSize,
        //family: "Calibri",
        //style: "italic",
        weight: "bold",
      },
    };

    const j = 4;
    const pointTextX_pLabel = points[j][0] + xoffset; //points[j][0] + 0.2 + xoffset; //- 0.17 + xoffset
    const pointTextY0_pLabel = points[j][1];
    const pointTextY1_pLabel = points[j + 1][1] + yoffset; //0.25 + yoffset
    const pointTextY_pLabel = (pointTextY0_pLabel + pointTextY1_pLabel) / 2;

    const projectPoint: any = {
      type: "point",
      longitude: pointTextX_pLabel,
      latitude: pointTextY_pLabel,
    };

    const n2ProjectLabelGraphic = new Graphic({
      geometry: projectPoint,
      symbol: n2ProjectLableSymbol,
    });

    n2GraphicsLayer.add(n2ProjectLabelGraphic);
  });
}

export function n2GraphicsLayerMove(projectSelected: any) {
  n2GraphicsLayer_cpLabel.removeAll();
  n2GraphicsLayer.removeAll();

  let xoffset;
  let yoffset;
  if (projectSelected === "All") {
    xoffset = xoffset_n2;
    yoffset = yoffset_n2;
  } else {
    xoffset = xoffset_n2_reset;
    yoffset = yoffset_n2_reset;
  }
  n2Graphics(xoffset, yoffset);
}

//// --------------------- SC ------------------------------- ////
export function scAlignmentRenderer(projectSelected: any) {
  scStationLayer.renderer = stationPointSymbol_nscr;
  scStationLayer.visible = true;
  scGraphicsLayer.visible = true;
  scGraphicsLayer_cpLabel.visible = true;
  scCenterlineLayer.visible = true;
  scCenterlineConstruction.visible = false;
  scGraphicsLayerMove(projectSelected);
}

export function scProgressRenderer(projectSelected: any) {
  scStationLayer.renderer = stationPointRenderer_construction_nscr;
  scStationLayer.visible = true;
  scGraphicsLayer.visible = true;
  scGraphicsLayer_cpLabel.visible = true;
  scCenterlineLayer.visible = false;
  scCenterlineConstruction.visible = true;
  n2LabelStation.labelPlacement = "below-left";
  scGraphicsLayerMove(projectSelected);
}

export function scNoneRenderer() {
  scStationLayer.visible = false;
  scGraphicsLayer.visible = false;
  scGraphicsLayer_cpLabel.visible = false;
  scCenterlineLayer.visible = false;
  scCenterlineConstruction.visible = false;
}

function scGraphics(xoffset: any, yoffset: any) {
  const query = scBreakPointsCP.createQuery();
  query.orderByFields = ["Id"];
  scBreakPointsCP.queryFeatures(query).then((response) => {
    const stats = response.features;
    const paths: any = [];
    const points: any = [];
    const CPs: any = [];

    stats.forEach((result: any) => {
      const attributes = result.attributes;
      const cp = attributes.CP;
      CPs.push(cp);

      // Collect geometry of each break point
      const pointX0 = result.geometry.longitude;
      const pointY0 = result.geometry.latitude;

      // Calculate end poins and store it in a path for line generation
      const pointX1 = pointX0 - 0.05;
      const path = [
        [pointX0, pointY0],
        [pointX1, pointY0],
      ];

      // Append each path to paths
      paths.push(path);

      // Calculate a point for text symbol
      const point = [pointX1, pointY0];
      points.push(point);
    });

    // 1. Draw a horizontal line at break points of individual CPs
    // Define polyline paths and type
    const polyline: any = {
      type: "polyline",
      paths: paths,
    };

    // Set line properties
    const simpleLineSymbol: any = {
      type: "simple-line",
      color: cpLineColor,
      width: cpLineWidth,
    };

    // Add to Graphic
    const scPolylineGraphic = new Graphic({
      geometry: polyline,
      symbol: simpleLineSymbol,
    });
    scGraphicsLayer_cpLabel.add(scPolylineGraphic);

    // 2. Add text symbol
    for (let i = 0; i < points.length; i++) {
      if (i <= points.length - 2 && i !== 8) {
        const pointTextX = points[i][0] - 0.01;
        const pointTextY0 =
          CPs[i] === "S-01" ? points[i][1] + 0.01 : points[i][1];
        const pointTextY1 = points[i + 1][1];
        const pointTextY = (pointTextY0 + pointTextY1) / 2;

        const point: any = {
          type: "point",
          longitude: pointTextX,
          latitude: pointTextY,
        };

        const textSymbol: any = {
          type: "text", // autocasts as new TextSymbol()
          color: cpLabelColor,
          //haloColor: "black",
          //haloSize: "1px",
          text: CPs[i],
          //xoffset: 3,
          //yoffset: -5,
          font: {
            // autocasts as new Font()
            size: cpFontSize,
            //family: "Josefin Slab",
            weight: "bold",
          },
        };

        const scPointGraphic = new Graphic({
          geometry: point,
          symbol: textSymbol,
        });

        scGraphicsLayer_cpLabel.add(scPointGraphic);
      }
    }

    // Project Label
    // Add Project label (N2)
    const scProjectLableSymbol: any = {
      type: "text", // autocasts as new TextSymbol()
      color: centerlineProjectColor.nscrex_hex,
      //backgroundColor: projectBackgroundColor,
      //haloColor: "black",
      //haloSize: "1px",
      text: "North-South Commuter Railway Ext.\n(Solis-Calamba)\n56km",
      horizontalAlignment: "right",
      //xoffset: 3,
      //yoffset: -5,
      font: {
        // autocasts as new Font()
        size: projectLabelFontSize,
        //family: "Calibri",
        //style: "italic",
        weight: "bold",
      },
    };

    const j = 5;
    const pointTextX_pLabel = points[j][0] + xoffset;
    const pointTextY0_pLabel = points[j][1] + yoffset;
    const pointTextY1_pLabel = points[j + 1][1];
    const pointTextY_pLabel = (pointTextY0_pLabel + pointTextY1_pLabel) / 2;

    const projectPoint: any = {
      type: "point",
      longitude: pointTextX_pLabel,
      latitude: pointTextY_pLabel,
    };

    const scProjectLabelGraphic = new Graphic({
      geometry: projectPoint,
      symbol: scProjectLableSymbol,
    });

    scGraphicsLayer.add(scProjectLabelGraphic);
  });
}

export function scGraphicsLayerMove(projectSelected: any) {
  scGraphicsLayer_cpLabel.removeAll();
  scGraphicsLayer.removeAll();

  let xoffset;
  let yoffset;
  if (projectSelected === "All") {
    xoffset = xoffset_sc;
    yoffset = yoffset_sc;
  } else {
    xoffset = xoffset_sc_reset;
    yoffset = yoffset_sc_reset;
  }
  scGraphics(xoffset, yoffset);
}

export function clarkAirportLabel() {
  // Clark International Airport
  const query = clarkAirport_pin.createQuery();
  clarkAirport_pin.queryFeatures(query).then(function (response) {
    const stats: any = response.features[0];

    // Create label point and label for 'Manila'
    const x0 = stats.geometry.longitude;
    const y0 = stats.geometry.latitude;
    const x1 = x0 - 0.1; // Offset
    // const y1 = y0 - 0.15;

    const point: any = {
      type: "point",
      longitude: x1,
      latitude: y0,
    };

    const clarkAirport_textSymbol: any = {
      type: "text", // autocasts as new TextSymbol()
      color: "white",
      //backgroundColor: projectBackgroundColor,
      text: "Clark Int. Airport",
      horizontalAlignment: "right",
      //yoffset: -5,
      font: {
        size: fontSizeAirport,
        //family: "Merriweather",
        //style: "italic",
        // weight: "bold",
      },
    };

    const clarkAirport_PointGraphic = new Graphic({
      geometry: point,
      symbol: clarkAirport_textSymbol,
    });
    clarkAirport_pin_pointGraphicLayer.add(clarkAirport_PointGraphic);

    // Crate label line for 'Manila'
    // Create lin path and polyline
    const path = [
      [x0, y0],
      [x1, y0],
    ];

    const clarkAirport_pin_polyline: any = {
      type: "polyline",
      paths: path,
    };

    // Set line properties
    const clarkAirport_pin_LineSymbol: any = {
      type: "simple-line",
      color: cpLineColor,
      width: cpLineWidth,
    };

    // Add to Graphic
    const clarkAirport_pin_LineGraphic = new Graphic({
      geometry: clarkAirport_pin_polyline,
      symbol: clarkAirport_pin_LineSymbol,
    });
    clarkAirport_pin_lineGraphicsLayer.add(clarkAirport_pin_LineGraphic);
  });

  // Ninoy Internation Airport Pins
  const query1 = airport_pin.createQuery();
  airport_pin.queryFeatures(query1).then(function (response) {
    const stats: any = response.features[0];

    // Create label point and label for 'Manila'
    const x0 = stats.geometry.longitude;
    const y0 = stats.geometry.latitude;
    const x1 = x0 - 0.1; // Offset

    const point: any = {
      type: "point",
      longitude: x1,
      latitude: y0,
    };

    const airport_textSymbol: any = {
      type: "text", // autocasts as new TextSymbol()
      color: "white",
      //backgroundColor: projectBackgroundColor,
      text: "Ninoy Aquino Int. Airport",
      horizontalAlignment: "right",
      //yoffset: -5,
      font: {
        // autocasts as new Font()
        size: fontSizeAirport,
        //family: "Merriweather",
        //style: "italic",
        // weight: "bold",
      },
    };

    const airport_PointGraphic = new Graphic({
      geometry: point,
      symbol: airport_textSymbol,
    });
    airport_pin_pointGraphicLayer.add(airport_PointGraphic);

    // Crate label line for 'NAIA'
    // Create lin path and polyline
    const path = [
      [x0, y0],
      [x1, y0],
    ];

    const airport_pin_polyline: any = {
      type: "polyline",
      paths: path,
    };

    // Set line properties
    const airport_pin_LineSymbol: any = {
      type: "simple-line",
      color: cpLineColor,
      width: cpLineWidth,
    };

    // Add to Graphic
    const airport_pin_LineGraphic = new Graphic({
      geometry: airport_pin_polyline,
      symbol: airport_pin_LineSymbol,
    });
    airport_pin_lineGraphicsLayer.add(airport_pin_LineGraphic);
  });

  // Manila pin
  const query2 = manila_pin.createQuery();
  manila_pin.queryFeatures(query2).then(function (response) {
    const stats: any = response.features[0];

    // Create label point and label for 'Manila'
    const x0 = stats.geometry.longitude;
    const y0 = stats.geometry.latitude;
    const x1 = x0 - 0.15; // Offset

    const point: any = {
      type: "point",
      longitude: x1,
      latitude: y0,
    };

    const manila_textSymbol: any = {
      type: "text", // autocasts as new TextSymbol()
      color: "white",
      //backgroundColor: projectBackgroundColor,
      text: "Manila",
      horizontalAlignment: "right",
      //yoffset: -5,
      font: {
        // autocasts as new Font()
        size: 15,
        //family: "Merriweather",
        //style: "italic",
        weight: "bold",
      },
    };

    const manila_PointGraphic = new Graphic({
      geometry: point,
      symbol: manila_textSymbol,
    });
    manila_pin_pointGraphicLayer.add(manila_PointGraphic);

    // Crate label line for 'Manila'
    // Create lin path and polyline
    const path = [
      [x0, y0],
      [x1, y0],
    ];

    const manila_pin_polyline: any = {
      type: "polyline",
      paths: path,
    };

    // Set line properties
    const manila_pin_LineSymbol: any = {
      type: "simple-line",
      color: cpLineColor,
      width: cpLineWidth,
    };

    // Add to Graphic
    const manila_pin_LineGraphic = new Graphic({
      geometry: manila_pin_polyline,
      symbol: manila_pin_LineSymbol,
    });
    manila_pin_lineGraphicsLayer.add(manila_pin_LineGraphic);
  });
}

///////////////////////////////////////////////////////////
export function stationLabelFontSizeDefault() {
  n2_station_label.font.size = labelStation_fontSize_default;
  sc_station_label.font.size = labelStation_fontSize_default;
  n1_station_label.font.size = labelStation_fontSize_default;
}

export function stationPointSymbolToOriginal() {
  n1StationLayer.renderer = stationPointSymbol_nscr;
  n2StationLayer.renderer = stationPointSymbol_nscr;
  scStationLayer.renderer = stationPointSymbol_nscr;
  mmspStationLayer.renderer = stationPointSymbol_mmsp;
}

export function stationPointSymbolToConstruction() {
  n1StationLayer.renderer = stationPointRenderer_construction_nscr;
  n2StationLayer.renderer = stationPointRenderer_construction_nscr;
  scStationLayer.renderer = stationPointRenderer_construction_nscr;
  mmspStationLayer.renderer = stationPointRenderer_construction_mmsp;
}

export function originalConstructionLineWidth() {
  mmspCenterlineConstruction.renderer = lineSymbol_construction;
  n1CenterlineConstruction.renderer = lineSymbol_construction;
  n2CenterlineConstruction.renderer = lineSymbol_construction;
  scCenterlineConstruction.renderer = lineSymbol_construction;
}

/// 2. Individual Projects
export function projectConstructionLineWidth() {
  mmspCenterlineConstruction.renderer = lineSymbol_construction_project;
  n1CenterlineConstruction.renderer = lineSymbol_construction_project;
  n2CenterlineConstruction.renderer = lineSymbol_construction_project;
  scCenterlineConstruction.renderer = lineSymbol_construction_project;
}

///////////////////////////////////////////////////////
// Overview Map constraint
export function disableZooming(view: any) {
  view.popup.dockEnabled = true;

  // Removes the zoom action on the popup
  view.popup.actions = [];

  // stops propagation of default behavior when an event fires
  function stopEvtPropagation(event: any) {
    event.stopPropagation();
  }

  // exlude the zoom widget from the default UI
  // view.ui.components = [];
  view.ui.components = [];

  // disable mouse wheel scroll zooming on the overView
  view?.on("mouse-wheel", stopEvtPropagation);

  // disable zooming via double-click on the overView
  view.on("double-click", stopEvtPropagation);

  // disable zooming out via double-click + Control on the overView
  view.on("double-click", ["Control"], stopEvtPropagation);

  // disables pinch-zoom and panning on the overView
  view.on("drag", stopEvtPropagation);

  // disable the overView's zoom box to prevent the Shift + drag
  // and Shift + Control + drag zoom gestures.
  view.on("drag", ["Shift"], stopEvtPropagation);
  view.on("drag", ["Shift", "Control"], stopEvtPropagation);

  // prevents zooming with the + and - keys
  view.on("key-down", (event: any) => {
    const prohibitedKeys = [
      "+",
      "-",
      "Shift",
      "_",
      "=",
      "ArrowUp",
      "ArrowDown",
      "ArrowRight",
      "ArrowLeft",
    ];
    const keyPressed = event.key;
    if (prohibitedKeys.indexOf(keyPressed) !== -1) {
      event.stopPropagation();
    }
  });

  return view;
}

const extentDebouncer = promiseUtils.debounce(
  async (extent3Dgraphic: any, extent: any) => {
    extent3Dgraphic.geometry = extent;
  },
);

export function OverviewExtentsetup(view: any, overview: any) {
  const initialGeometry: any = null;
  const extent3Dgraphic: any = new Graphic({
    geometry: initialGeometry, // default: null
    symbol: new SimpleFillSymbol({
      color: [0, 0, 0, 0],
      outline: {
        width: 2,
        color: "#ff1947", //[178,34,34]
      },
    }),
  });
  overview?.graphics?.add(extent3Dgraphic);

  reactiveUtils.watch(
    () => view?.extent, //view?.visibleArea,
    (extent: any) => {
      // Sync the overview map location
      // whenever the 3d view is stationary
      extentDebouncer(extent3Dgraphic, extent);
    },
    {
      initial: true,
    },
  );
}

// Zoom to layer
export function zoomToLayer(layer: any, view: any) {
  return layer.queryExtent().then((response: any) => {
    view
      ?.goTo(response.extent, {
        //response.extent
        speedFactor: 2,
      })
      .catch((error: any) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
  });
}

// export function zoomToLayer2(layer: any, view: any, overview: any) {
//   reactiveUtils.when(
//     () => zoomToLayer(layer, view),
//     () => {
//       // Sync the overview map location
//       // whenever the 3d view is stationary
//       OverviewExtentsetup(view, overview);
//     }
//   );
// }

// Return to home extent
const home_center = [120.9, 14.7832299];
export function homeExtentRenderer(view: any) {
  view.rotation = home_rotation;
  view.scale = 577790.5542885;
  view.center = home_center;
}

// Station List

export function openStationList() {
  n1StationLayer.labelingInfo = [scLabelStation_number, scLabelStation];
  n2StationLayer.labelingInfo = [n2LabelStation_number, n2LabelStation];
  scStationLayer.labelingInfo = [scLabelStation_number, scLabelStation];
}

export function closeStationList() {
  n1StationLayer.labelingInfo = [scLabelStation];
  n2StationLayer.labelingInfo = [n2LabelStation];
  scStationLayer.labelingInfo = [scLabelStation];
}
