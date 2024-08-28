export const workflowStore = {
    nodes: [],
    edges: [],
    savedWF: true
}

export function workflowActions(getStore, getActions, setStore) {
    const BASE_URL = process.env.BASE_URL;
    const BASE_URL2 = process.env.BASE_URL2;
    return {
        addNode: (sourceNodeId, newNode) => {
            // Add the new node to the existing elements
            let actions = getActions();
            let store = getStore()
            console.log("addNode Function")
            let nodos = [
                ...store.nodes,
                {
                    ...newNode,
                    id: `${sourceNodeId}-${newNode.id}`,
                    source: sourceNodeId,
                    target: newNode.id,
                    //type: 'output',
                    positionX: newNode.position.x,
                    positionY: newNode.position.y,
                    campaign_id: newNode.campaign_id,
                    data: {
                        campaign_id: newNode.campaign_id,
                        label: newNode.data.label,
                        ...newNode
                    }
                },
            ];
            setStore({ ...store, nodes: [...nodos] })
        },
        setNodes: (value) => {
            // Add the new node to the existing elements
            let actions = getActions();
            let store = getStore()

            setStore({ ...store, nodes: value })
        },
        setSavedWFFalse: () => {
            let actions = getActions();
            let store = getStore()

            setStore({ ...store, savedWF: false })
        },
        setSavedWFTrue: () => {
            let actions = getActions();
            let store = getStore()

            setStore({ ...store, savedWF: true })
        }
    }
}