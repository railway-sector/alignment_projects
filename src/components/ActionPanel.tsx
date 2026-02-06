import "@esri/calcite-components/dist/components/calcite-card";
import { CalciteCard } from "@esri/calcite-components-react";
import ProjectPanelSegmentedList from "./ProjectPanelContext";
const ActionPanel = (props: any) => {
  return (
    <>
      <div style={{ display: props.id === true ? "block" : "none" }}>
        <CalciteCard style={{ fontSize: "0.5rem" }}>
          {/* <CategoryPanelSegmentedList /> */}
          <ProjectPanelSegmentedList />
        </CalciteCard>
      </div>
    </>
  );
};

export default ActionPanel;
