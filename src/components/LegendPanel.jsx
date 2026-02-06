import "@arcgis/map-components/components/arcgis-legend";
import { useEffect, useState } from "react";
import { mmspCenterlineConstruction } from "../layers";

const LegendPanel = () => {
  const arcgisMap = document.querySelector("#arcgis-map");
  const legend_construction_mmsp = document.querySelector(
    "#mmsp-centerline-construction"
  );

  useEffect(() => {
    if (arcgisMap) {
      legend_construction_mmsp.layerInfos = [
        {
          layer: mmspCenterlineConstruction,
          title: "Civil Construction Progress",
        },
      ];
    }
  }, []);

  return (
    <>
      <arcgis-legend
        slot="bottom-left"
        legend-style="classic"
        id="mmsp-centerline-construction"
        referenceElement="#arcgis-map"
      ></arcgis-legend>
    </>
  );
};

export default LegendPanel;
