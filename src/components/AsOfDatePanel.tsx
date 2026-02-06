import { useEffect, useState } from "react";
import { dateUpdate } from "../Query";
import { updatedDateCategoryNames } from "../UniqueValues";

function AsOfDatePanel() {
  const [asOfDate, setAsOfDate] = useState<undefined | any | unknown>(null);

  useEffect(() => {
    dateUpdate(updatedDateCategoryNames).then((response: any) => {
      setAsOfDate(response[0][0]);
    });
  }, []);
  return (
    <>
      <div
        style={{
          color: "rgb(220, 220, 220)",
          fontSize: "0.8rem",
          float: "right",
          marginRight: "5px",
          marginTop: "5px",
          zIndex: "1",
          position: "fixed",
          bottom: 5,
          left: "20px",
        }}
      >
        As of {asOfDate}
      </div>
    </>
  );
}

export default AsOfDatePanel;
