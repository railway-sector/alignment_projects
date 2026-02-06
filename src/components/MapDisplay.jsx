/* eslint-disable jsx-a11y/alt-text */
import { use, useEffect, useState } from "react";
import "../index.css";
import "../App.css";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-print";
import "@arcgis/map-components/components/arcgis-home";
import {
  airport_pin_lineGraphicsLayer,
  airport_pin_pointGraphicLayer,
  clarkAirport_pin_lineGraphicsLayer,
  clarkAirport_pin_pointGraphicLayer,
  manila_pin_lineGraphicsLayer,
  manila_pin_pointGraphicLayer,
  mmspCenterlineConstruction,
  mmspCenterlineLayer,
  mmspGraphicsLayer,
  mmspGraphicsLayer_cpLabel,
  mmspStationLayer,
  n1BreakPointsCP,
  n1CenterlineConstruction,
  n1CenterlineLayer,
  n1GraphicsLayer,
  n1GraphicsLayer_cpLabel,
  n1StationLayer,
  n2BreakPointsCP,
  n2CenterlineConstruction,
  n2CenterlineLayer,
  n2GraphicsLayer,
  n2GraphicsLayer_cpLabel,
  n2StationLayer,
  scBreakPointsCP,
  scCenterlineConstruction,
  scCenterlineLayer,
  scGraphicsLayer,
  scGraphicsLayer_cpLabel,
  scStationLayer,
  mmspCenterlineOverView,
  n1CenterlineOverView,
  n2CenterlineOverView,
  scCenterlineOverView,
  basemapUserDefined,
} from "../layers";

import "@esri/calcite-components/dist/components/calcite-button";
import ActionPanel from "./ActionPanel";
import {
  categoryNames,
  home_center,
  home_rotation,
  home_scale,
  overViewCenter,
  projectNames,
} from "../UniqueValues";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import {
  clarkAirportLabel,
  disableZooming,
  homeExtentRenderer,
  mmspAlignmentRenderer,
  mmspNoneRenderer,
  mmspProgressRenderer,
  n1AlignmentRenderer,
  n1NoneRenderer,
  n1ProgressRenderer,
  n2AlignmentRenderer,
  n2NoneRenderer,
  n2ProgressRenderer,
  originalConstructionLineWidth,
  OverviewExtentsetup,
  projectConstructionLineWidth,
  scAlignmentRenderer,
  scNoneRenderer,
  scProgressRenderer,
  stationLabelFontSizeDefault,
  stationPointSymbolToConstruction,
  stationPointSymbolToOriginal,
  zoomToLayer,
} from "../Query";
import { MyContext } from "../contexts/MyContext";

function MapDisplay() {
  const { categorynames, projectnames } = use(MyContext);

  // Main Map
  const [mapView, setMapView] = useState();
  const arcgisMap = document.querySelector("#arcgis-map");
  const arcgisOverviewMap = document.querySelector("#arcgis-overview-map");

  // Launuch
  const arcgisLaunch = document.querySelector("#launch-button");

  // Legend
  const arcgisLegend = document.querySelector("#mmsp-centerline-construction");

  // Expand (Action Panel)
  const arcgisExpand = document.querySelector("#actionpanel-expand");
  const [actionPanelExpanded, setActionPanelExpanded] = useState(true);

  // overview extent
  const [overViewExtent, setOverViewExtent] = useState(null);

  reactiveUtils.when(
    () => arcgisExpand?.expanded === false,
    () => setActionPanelExpanded(false),
  );

  reactiveUtils.when(
    () => arcgisExpand?.expanded === true,
    () => setActionPanelExpanded(true),
  );

  useEffect(() => {
    if (mapView) {
      // Add layers and widgets
      arcgisMap.view.ui.add(arcgisExpand, "top-right");
      // arcgisMap.view.ui.add(stationListExpand, "bottom-right");
      arcgisMap.view.ui.add(arcgisLaunch, "top-left");
      arcgisMap.view.ui.components = [];

      arcgisMap.map.add(n1CenterlineLayer);
      arcgisMap.map.add(n1CenterlineConstruction);
      arcgisMap.map.add(n1StationLayer);
      arcgisMap.map.add(n1BreakPointsCP);
      arcgisMap.map.add(n1GraphicsLayer);
      arcgisMap.map.add(n1GraphicsLayer_cpLabel);

      arcgisMap.map.add(mmspCenterlineLayer);
      arcgisMap.map.add(mmspCenterlineConstruction);
      arcgisMap.map.add(mmspStationLayer);
      arcgisMap.map.add(mmspGraphicsLayer);
      arcgisMap.map.add(mmspGraphicsLayer_cpLabel);

      arcgisMap.map.add(n2CenterlineLayer);
      arcgisMap.map.add(n2CenterlineConstruction);
      arcgisMap.map.add(n2StationLayer);
      arcgisMap.map.add(n2BreakPointsCP);
      arcgisMap.map.add(n2GraphicsLayer);
      arcgisMap.map.add(n2GraphicsLayer_cpLabel);

      arcgisMap.map.add(scCenterlineLayer);
      arcgisMap.map.add(scCenterlineConstruction);
      arcgisMap.map.add(scStationLayer);
      arcgisMap.map.add(scBreakPointsCP);
      arcgisMap.map.add(scGraphicsLayer);
      arcgisMap.map.add(scGraphicsLayer_cpLabel);

      arcgisMap.map.add(clarkAirport_pin_pointGraphicLayer);
      arcgisMap.map.add(clarkAirport_pin_lineGraphicsLayer);
      arcgisMap.map.add(airport_pin_pointGraphicLayer);
      arcgisMap.map.add(airport_pin_lineGraphicsLayer);
      arcgisMap.map.add(manila_pin_pointGraphicLayer);
      arcgisMap.map.add(manila_pin_lineGraphicsLayer);

      arcgisOverviewMap.map.add(n2CenterlineOverView);
      arcgisOverviewMap.map.add(n1CenterlineOverView);
      arcgisOverviewMap.map.add(scCenterlineOverView);
      arcgisOverviewMap.map.add(mmspCenterlineOverView);

      // Disable all user navagating actions
      disableZooming(arcgisOverviewMap.view);

      // Ensure to add 'arcgisMap' as callback. If not, you will get 'Abort' error
      OverviewExtentsetup(arcgisMap, arcgisOverviewMap);

      // Default Rendering
      mmspAlignmentRenderer(projectnames);
      n1AlignmentRenderer(projectnames);
      n2AlignmentRenderer(projectnames);
      scAlignmentRenderer(projectnames);
      homeExtentRenderer(arcgisMap);
      stationLabelFontSizeDefault();
      stationPointSymbolToOriginal();
      clarkAirportLabel();

      // layer legend
      // arcgisLegend.layerInfos = [
      //   {
      //     layer: mmspCenterlineConstruction,
      //     title: "Civil Construction Progress",
      //   },
      // ];
    }
  }, [mapView]); // you need to define this; otherwise, the extent boundary will not be updated when the Project is changed.

  useEffect(() => {
    if (mapView) {
      // Category: 'Alingment'
      if (categorynames === categoryNames[0]) {
        // All
        if (projectnames === projectNames[0]) {
          mmspAlignmentRenderer(projectnames);
          n1AlignmentRenderer(projectnames);
          n2AlignmentRenderer(projectnames);
          scAlignmentRenderer(projectnames);
          homeExtentRenderer(arcgisMap);
          stationLabelFontSizeDefault();
          stationPointSymbolToOriginal();

          // NSCR
        } else if (projectnames === projectNames[1]) {
          n1AlignmentRenderer(projectnames);
          zoomToLayer(n1StationLayer, arcgisMap);
          mmspNoneRenderer();
          n2NoneRenderer();
          scNoneRenderer();
          arcgisMap.view.rotation = 360;
          // MMSP
        } else if (projectnames === projectNames[2]) {
          mmspAlignmentRenderer(projectnames);
          zoomToLayer(mmspStationLayer, arcgisMap);
          n1NoneRenderer();
          n2NoneRenderer();
          scNoneRenderer();
          arcgisMap.view.rotation = 360;
          // MCRP
        } else if (projectnames === projectNames[3]) {
          n2AlignmentRenderer(projectnames);
          zoomToLayer(n2StationLayer, arcgisMap);
          n1NoneRenderer();
          mmspNoneRenderer();
          scNoneRenderer();
          arcgisMap.view.rotation = 360;
          // SCRP
        } else if (projectnames === projectNames[4]) {
          scAlignmentRenderer(projectnames);
          zoomToLayer(scStationLayer, arcgisMap);
          mmspNoneRenderer();
          n1NoneRenderer();
          n2NoneRenderer();
          arcgisMap.view.rotation = 360;
        }

        // Category: 'Progress'
      } else if (categorynames === categoryNames[1]) {
        originalConstructionLineWidth();
        projectConstructionLineWidth();

        if (projectnames === projectNames[0]) {
          mmspProgressRenderer(projectnames);
          n1ProgressRenderer(projectnames);
          n2ProgressRenderer(projectnames);
          scProgressRenderer(projectnames);
          homeExtentRenderer(arcgisMap);
          // ProgressAllLegendOn();
          stationPointSymbolToConstruction();
          arcgisLegend.layerInfos = [
            {
              layer: n1CenterlineConstruction,
              title: "Civil Construction Progress",
            },
          ];

          // NSCR
        } else if (projectnames === projectNames[1]) {
          n1ProgressRenderer(projectnames);
          zoomToLayer(n1StationLayer, arcgisMap);
          mmspNoneRenderer();
          n2NoneRenderer();
          scNoneRenderer();
          arcgisMap.view.rotation = 360;
          arcgisLegend.layerInfos = [
            {
              layer: n1CenterlineConstruction,
              title: "Civil Construction Progress",
            },
          ];

          // MMSP
        } else if (projectnames === projectNames[2]) {
          mmspProgressRenderer(projectnames);
          zoomToLayer(mmspStationLayer, arcgisMap);
          n1NoneRenderer();
          n2NoneRenderer();
          scNoneRenderer();
          arcgisMap.view.rotation = 360;
          arcgisLegend.layerInfos = [
            {
              layer: mmspCenterlineConstruction,
              title: "Civil Construction Progress",
            },
          ];

          // MCRP
        } else if (projectnames === projectNames[3]) {
          n2ProgressRenderer(projectnames);
          zoomToLayer(n2StationLayer, arcgisMap);
          n1NoneRenderer();
          mmspNoneRenderer();
          scNoneRenderer();
          arcgisMap.view.rotation = 360;
          arcgisLegend.layerInfos = [
            {
              layer: n2CenterlineConstruction,
              title: "Civil Construction Progress",
            },
          ];

          // SCRP //////
        } else if (projectnames === projectNames[4]) {
          scProgressRenderer(projectnames);
          zoomToLayer(scStationLayer, arcgisMap);
          n1NoneRenderer();
          n2NoneRenderer();
          mmspNoneRenderer();
          arcgisMap.view.rotation = 360;
          arcgisLegend.layerInfos = [
            {
              layer: scCenterlineConstruction,
              title: "Civil Construction Progress",
            },
          ];
        }
      }
    }
  }, [categorynames, projectnames]);

  return (
    <arcgis-map
      id="arcgis-map"
      basemap={basemapUserDefined}
      ground="world-elevation"
      zoom="12"
      center={home_center}
      rotation={home_rotation}
      scale={home_scale}
      onarcgisViewReadyChange={(event) => {
        setMapView(event.target);
      }}
    >
      <arcgis-compass slot="top-left"></arcgis-compass>
      <arcgis-home slot="top-left"></arcgis-home>

      {/* Printer widget */}
      <arcgis-expand slot="top-left" expandedIcon="print" id="print-expand">
        <arcgis-print></arcgis-print>
      </arcgis-expand>

      {/* Launch button*/}
      {/*<CalciteButton
        id="launch-button"
        href="https://gis.railway-sector.com/portal/apps/experiencebuilder/experience/?id=8d2c547125db4c11ab1e1f3ce085dcd7"
        icon-end="launch"
        scale="s"
        label="Open in a new tab"
        target="_blank"
      ></CalciteButton> */}

      {/* Station List */}
      {/* <arcgis-expand
        position="bottom-right"
        expandedIcon="list-number"
        id="stationlist-expand"
      >
        <StationList id={stationListPanelExpanded} />
      </arcgis-expand> */}

      {/* Action Panel */}
      <arcgis-expand
        slot="top-right"
        mode="floating"
        id="actionpanel-expand"
        expanded
        close-on-sec
      >
        <div style={{ maxHeight: "200px" }}>
          <ActionPanel id={actionPanelExpanded} />
        </div>
      </arcgis-expand>

      {/* Legend widget */}
      {/* <arcgis-legend
        slot="bottom-left"
        legend-style="classic"
        id="mmsp-centerline-construction"
      ></arcgis-legend> */}

      {/* Train Operation Schedule*/}
      <img
        style={{
          display: "none", // trainOperationScheduleForAll === true ? 'block' : 'none',
          opacity: actionPanelExpanded === true ? "0%" : "100%",
        }}
        src="https://EijiGorilla.github.io/Symbols/Gallery/Train_Operation_20240711.jpg"
      />

      {/* Overview Map */}
      <arcgis-map
        style={{
          position: "fixed",
          zIndex: "1",
          width: "135px",
          height: "160px",
          borderStyle: "solid",
          borderColor: "grey",
          borderWidth: "0.5px",
          overflow: "hidden",
          top: actionPanelExpanded === false ? "60px" : "140px",
          right: "40px",
        }}
        id="arcgis-overview-map"
        // item-id="5ba14f5a7db34710897da0ce2d46d55f"
        basemap="streets-night-vector"
        ground="world-elevation"
        zoom="5"
        center={overViewCenter}
      ></arcgis-map>
    </arcgis-map>
  );
}

export default MapDisplay;
