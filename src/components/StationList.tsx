import "@esri/calcite-components/dist/components/calcite-card";
import { CalciteCard } from "@esri/calcite-components-react";
import { stationArray1, stationArray2 } from "../UniqueValues";

const StationList = (props: any) => {
  return (
    <>
      <div style={{ display: props.id === true ? "block" : "none" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "5px",
          }}
        >
          <CalciteCard>
            {stationArray1 &&
              stationArray1.map((station: any, index: any) => {
                return (
                  <dl
                    style={{
                      width: "8vw",
                      height: "auto",
                      alignItems: "center",
                      color: "rgba(194, 194, 194, 0.884)",
                      fontSize: "1.2em",
                      lineHeight: "5px",
                    }}
                    key={index}
                  >
                    <dt>
                      {index + 1}. {station}
                    </dt>
                  </dl>
                );
              })}
          </CalciteCard>
          <CalciteCard>
            {stationArray2 &&
              stationArray2.map((station: any, index: any) => {
                return (
                  <dl
                    style={{
                      width: "8vw",
                      height: "auto",
                      alignItems: "center",
                      color: "rgba(194, 194, 194, 0.884)",
                      fontSize: "1.2em",
                      lineHeight: "5px",
                    }}
                    key={index}
                  >
                    <dt>
                      {index + 19}. {station}
                    </dt>
                  </dl>
                );
              })}
          </CalciteCard>
        </div>
      </div>
    </>
  );
};

export default StationList;
