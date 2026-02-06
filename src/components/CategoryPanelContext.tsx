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
import { categoryNames } from "../UniqueValues";
import { MyContext } from "../contexts/MyContext";

export default function CategoryPanelSegmentedList() {
  const { updateCategory } = use(MyContext);

  const [categorySelected, setCategorySelected] = useState<any>(
    categoryNames[0],
  );

  return (
    <>
      <CalciteLabel>
        Category
        <CalciteSegmentedControl
          onCalciteSegmentedControlChange={(event: any) => {
            setCategorySelected(event.target.selectedItem.id);
            updateCategory(event.target.selectedItem.id);
          }}
          scale="m"
          width="full"
        >
          {categorySelected &&
            categoryNames.map((category: any, index: any) => {
              return (
                <CalciteSegmentedControlItem
                  {...(categorySelected === category ? { checked: true } : {})}
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
