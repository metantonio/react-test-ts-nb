export const dashboardStore = {
    dbList: [],
    savedDashboard: false,
    specificDBList: []
}

export function dashboardActions(getStore, getActions, setStore) {
    const BASE_URL = process.env.BASE_URL;
    const BASE_URL2 = process.env.BASE_URL2;
    return {
        setListDB: (list) => {
            // add data to the global state of list of databases
            let actions = getActions();
            let store = getStore()
            console.log("loadListDB Function")          
            setStore({ ...store, dbList: [...list] })
        },
        setSpecificListDB: (list) => {
            // add data to the global state of list of databases
            let actions = getActions();
            let store = getStore()
            console.log("loadListDB Function")          
            setStore({ ...store, specificDBList: [...list] })
        }         
    }
}