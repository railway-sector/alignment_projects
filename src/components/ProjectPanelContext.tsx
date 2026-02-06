import { useState, use } from "react";
import "../index.css";
import "../App.css";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";
import "@esri/calcite-components/dist/components/calcite-label";
import {
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
  CalciteLabel,
} from "@esri/calcite-components-react";
import { projectNames } from "../UniqueValues";
import { MyContext } from "../contexts/MyContext";

export default function ProjectPanelSegmentedList() {
  const { updateProject } = use(MyContext);

  const [projectSelected, setProjectSelected] = useState<any>(projectNames[0]);

  return (
    <>
      <CalciteLabel>
        Project
        <CalciteSegmentedControl
          onCalciteSegmentedControlChange={(event: any) => {
            setProjectSelected(event.target.selectedItem.id);
            updateProject(event.target.selectedItem.id);
          }}
          scale="m"
          width="full"
        >
          {projectSelected &&
            projectNames.map((category: any, index: any) => {
              return (
                <CalciteSegmentedControlItem
                  {...(projectSelected === category ? { checked: true } : {})}
                  key={index}
                  value={category}
                  id={category}
                >
                  {category}
                </CalciteSegmentedControlItem>
              );
            })}
        </CalciteSegmentedControl>
      </CalciteLabel>
    </>
  );
}
