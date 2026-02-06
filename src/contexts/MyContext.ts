import { createContext } from "react";

type MyDropdownContextType = {
  categorynames: any;
  updateCategory: any;
  projectnames: any;
  updateProject: any;
};

const initialState = {
  categorynames: undefined,
  updateCategory: undefined,
  projectnames: undefined,
  updateProject: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
