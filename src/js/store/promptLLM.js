export const promptStore = {
    promptLLM: false,
    group_context_filter:[],
    group_context_filter_db:[],
    viewNumber: 0
}

export function promptActions(getStore, getActions, setStore) {
    const BASE_URL = process.env.BASE_URL;
    const BASE_URL2 = process.env.BASE_URL2;
    return { 
        changePromptLLM: ()=>{
            /* This function will set the state promptLLM to the opposite boolean value, the idea
            is to change the UI behavior when prompting from embeddings to LLM, and vice-versa */
            let actions = getActions();
            let store = getStore();
            setStore({ ...store, promptLLM: !store.promptLLM });
        },
        changeGroupFilter: (list)=>{
            let actions = getActions();
            let store = getStore();
            setStore({ ...store, group_context_filter: list });
            actions.setViewNumber(0); //change viewport to Library
        },
        changeGroupFilterDB: (list)=>{
            let actions = getActions();
            let store = getStore();
            setStore({ ...store, group_context_filter_db: list });
            console.log("group_context_filter_db:", store.group_context_filter_db)
            actions.setViewNumber(1); //change viewport to database
        },
        setViewNumber: (number)=>{
            let actions = getActions();
            let store = getStore();
            setStore({ ...store, viewNumber: number });
            console.log("viewNumber:", store.viewNumber)
        }
    }
}