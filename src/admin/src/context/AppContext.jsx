import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = () => {

    const value = {

    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider