import { createContext } from "react";


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const apiUrl= "http:localhost:8000";

  return (
    <AppContext.Provider value={{ apiUrl }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;