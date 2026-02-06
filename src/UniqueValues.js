// Action Panel
export const categoryNames = ["Alignment", "Progress"];
export const projectNames = ["All", "NSCR", "MMSP", "MCRP", "SCRP"];

// Updated Dates
export const updatedDateCategoryNames = "Alignment Map";

// Date Picker
export const monthList = [
  {
    value: 1,
    month: "Jan.",
  },
  {
    value: 2,
    month: "Feb.",
  },
  {
    value: 3,
    month: "Mar.",
  },
  {
    value: 4,
    month: "Apr.",
  },
  {
    value: 5,
    month: "May",
  },
  {
    value: 6,
    month: "Jun.",
  },
  {
    value: 7,
    month: "Jul.",
  },
  {
    value: 8,
    month: "Aug.",
  },
  {
    value: 9,
    month: "Sep.",
  },
  {
    value: 10,
    month: "Oct.",
  },
  {
    value: 11,
    month: "Nov.",
  },
  {
    value: 12,
    month: "Dec.",
  },
];

// Main Map:------------------------------------
export const home_rotation = 330;
export const home_center = "120.9, 14.7832299";
export const home_scale = 292400;

//// Alignment (Line)
export const lineWidth = "6px";
export const centerlineProjectColor = {
  nscr_hex: "#ff5f22",
  mmsp_hex: "#00b7ff", //"#0000ff"
  nscrex_hex: "#ff5f22", //"#00b3ff","#00B0F0", "#15C2FF"
};

//// Alignment (Point)
export const minScale = 577790;
export const minScale_stNumber = minScale + 1000;
export const maxScale = 0;
export const maxScale_stNumber = 288896; //288896
export const opacity = 1;

// Station point color
export const pointSize = "12px"; // original: 10px
export const pointColor = "white";
export const pointOutlineWidth = 2.5; // original: 1.5
export const labelStation_fontSize = 11;
export const labelStation_fontSize_default = 11.5;

//// Construction Progress (Line)
export const colors = ["#dc4b00", "#ffff00", "#b0c4d8"];
//const colors = ["#3d5439", "#fcffd9", "#c0a878"];

export const tobeConstructed_color = colors[2]; // original: "#b0c4d8";
export const underConstruction_color = colors[1]; //original: #ffff00
export const completedConstruction_color = colors[0]; // original: #dc4b00

// Default line width for costruction progress in "all"
export const construction_lineWidth = "6px";

// Line width for construction progress in individual projects
export const construction_lineWidth_project = "8px";

//// Construction Progress (Point)

// Overview Map: ----------------------------------
export const overViewCenter = [120.9411264, 14.735462];
export const zoom = 5;

/// Airport
export const fontSizeAirport = 12;

// Graphics
export const projectLabelColor = "#000000";
export const projectBackgroundColor = "#0062a8"; //"#007fd9"
export const projectLabelFontSize = 12;

// Point and Line feature
export const cpLineColor = "#f0f4f7";
export const cpLabelColor = "#f0f4f7";

export const cpLineWidth = 0.3;
export const cpFontSize = 10;

// Graphics properties: MMSP
export const xoffset_mmsp = 0;
export const yoffset_mmsp = 0.05;
export const xoffset_mmsp_reset = 0;
export const yoffset_mmsp_reset = 0;

// Graphics properties: N1
export const xoffset_n1 = 0.08;
export const yoffset_n1 = 0.2;
export const xoffset_n1_reset = 0.05;
export const yoffset_n1_reset = 0.03;

// Graphics properties: N2
export const xoffset_n2 = 0.04;
export const yoffset_n2 = 0.55;
export const xoffset_n2_reset = 0.08;
export const yoffset_n2_reset = 0.6;

// Graphics properties: SC
export const xoffset_sc = 0.4;
export const yoffset_sc = -0.35;
export const xoffset_sc_reset = 0.3;
export const yoffset_sc_reset = 0.3;

// NSCR Station Names
// Station list
export const stationArray1 = [
  "CIA",
  "Clark",
  "Angeles",
  "San Fernando",
  "Apalit",
  "Calumpit",
  "Malolos",
  "Guiguinto",
  "Balagtas",
  "Bocaue",
  "Marilao",
  "Meycauayan",
  "Valenzuela",
  "Caloocan",
  "Solis",
  "Tutuban",
  "Blumentritt",
  "España",
];

export const stationArray2 = [
  "Sta. Mesa",
  "Paco",
  "Buendia",
  "EDSA",
  "Nichols",
  "FTI",
  "Bicutan",
  "Sucat",
  "Alabang",
  "Muntinlupa",
  "San Pedro",
  "Pacita",
  "Biñan",
  "Sta. Rosa",
  "Cabuyao",
  "Banlic",
  "Calamba",
];
