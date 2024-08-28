import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext.js';
//import SideMenu from "./sideMenu.jsx";
//import SideMenu2 from './sideMenu2.jsx';
import SideMenu3 from './sideMenu3.jsx';
import Swal from 'sweetalert2';
import ReactFlow, {
    addEdge, Controls,
    //deleteElements,
    //Background,
    MiniMap,
    applyNodeChanges, applyEdgeChanges,
    SelectionMode,
    /* Panel,
    BackgroundVariant,
    useStoreState,
    useStoreActions,
    Node, NodeProps */
} from 'reactflow';
/* import ReactFlow2, {
    removeElements
} from 'react-flow-renderer'; */
import 'reactflow/dist/style.css';
//import HandleNode from './handleNode';
import HandleNode from './handleNodeAnd2';
import HandleNodeSelect from './handleNodeSelect';
import HandleNodeNote from './handleNodeNote';
import HandleNodeOr from './handleNodeOr2.js'
import HandleNodePrioritize from './handleNodePrioritize.js';
import HandleNodeTablePrior from './handleNodeTablePrior.js';
import HandleNodePriorCamp from './handleNodePriorCamp.js'
import handleNodeOutput from './handleNodeOutput.js';
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge';
import handleNodeComm from './handleNodeComm.js';
import "./reactFlow.css";
const edgeTypes = {
    smart: SmartBezierEdge
}

let initialElements = [
    {
        id: '1',
        data: { label: 'Table Customers' },
        position: { x: -0, y: 20 },
        type: 'input',
        style: { border: '1px solid #777', padding: 10 },
    },
    {
        id: '2',
        data: { label: 'Filter 1' },
        position: { x: 100, y: 100 },
    },
    {
        id: '3',
        type: 'output',
        data: { label: 'ML: Cluster' },
        position: { x: 200, y: 200 },
    }
];

const initialEdges = [{ id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' }];

const Buttons = () => {
    const [zoom, setZoom] = useState(1);

    const onZoomIn = () => setZoom((prev) => prev + 0.1);
    const onZoomOut = () => setZoom((prev) => prev - 0.1);

    return (
        <div className="zoom-buttons">
            <button onClick={onZoomIn}>Plus</button>
            <button onClick={onZoomOut}>Minus</button>
        </div>
    );
};
const nodeTypes = {
    customNode: HandleNode,
    customSelect: HandleNodeSelect,
    customNote: HandleNodeNote,
    customOr: HandleNodeOr,
    customPrioritizeN: HandleNodePrioritize,
    customTablePrior: HandleNodeTablePrior,
    customPriorCamp: HandleNodePriorCamp,
    customNodeOutput: handleNodeOutput,
    customNodeComm: handleNodeComm
};

const minimapStyle = {
    height: 120,
    border: "2px solid black"
};

const Blueprint2 = (props) => {
    const { store, actions } = useContext(Context)
    const [elements, setElements] = useState(initialElements);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const urlTable = "/customers/preview"
    const urlCampaign = "/campaign/id"
    const urlRegister = "/campaignNode2V3"
    const [tableDB, setTableDB] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [hideMenu, setHideMenu] = useState(false)
    const [loadTime, setLoadTime] = useState(0)
   /*  const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els)); */

    const applyNodeChanges2 = (changes, nodes) => {
        let updatedNodes = [...nodes];

        changes.forEach(change => {
            let { id, ...rest } = change;
            let nodeIndex = updatedNodes.findIndex(node => node.id == id);

            if (nodeIndex != -1) {
                updatedNodes[nodeIndex] = { id, ...rest };
            } else {
                updatedNodes.push({ id, ...rest });
            }
        });

        return updatedNodes;
    };

    const onNodesChange = useCallback(
        async (changes) => {
            let updatedNodes = applyNodeChanges(changes, nodes);
            updatedNodes = applyNodeChanges2(store.nodes, updatedNodes);
            updatedNodes = applyNodeChanges(changes, updatedNodes); //this function eliminate extra data that is not inside of data key
            /* if (store.nodes !== nodes && store.nodes.length > 0) {
                updatedNodes = applyNodeChanges(store.nodes, nodes);
                updatedNodes = applyNodeChanges(changes, updatedNodes);
                console.log(updatedNodes)
            } */

            setNodes(updatedNodes);
            actions.setNodes(updatedNodes)

            if (loadTime != 0) {
                actions.setSavedWFFalse()
                setLoadTime(1)
                /*  let response = await actions.useFetch(urlRegister, {
                     Compania: store.user.JRCompaniaAut[0],
                     node: updatedNodes,
                     edge: edges
                 }, "PUT");
                 if (response.ok) {
                     Swal.fire({
                         position: 'top-end',
                         icon: 'success',
                         title: 'changes has been saved',
                         showConfirmButton: false,
                         timer: 500
                     })
                     actions.setSavedWFTrue()
                     return true
                 } else {
                     Swal.fire({
                         position: 'top-center',
                         icon: 'warning',
                         title: 'changes detected',
                         showConfirmButton: false,
                         timer: 500
                     })
                 } */
            }

        },
        [nodes, store.nodes]
    );
    const onEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds))
            //store.edges = edges
        },
        []
    );

    const handleCreateNode = (sourceNodeId, newNode) => {
        // Add the new node to the existing elements
        setNodes((prevElements) => [
            ...prevElements,
            newNode,
            { id: `${sourceNodeId}-${newNode.id}`, source: sourceNodeId, target: newNode.id, type: 'smoothstep' },
        ]);
    };

    const onConnect = useCallback((params) => {
        const { source, target, connection } = params;

        // Obtener los tipos de los nodos fuente y destino
        const sourceType = nodes.find((node) => node.id === source)?.type;
        const targetType = nodes.find((node) => node.id === target)?.type;
        const targetNode = nodes.find((node) => node.id === target)
        const MaxConnection = 1;
        let targetNodeConnections = []
        targetNodeConnections = edges.map((edge) => {
            if (edge.target === target && targetType == "customNode" && sourceType === 'customSelect') {
                return true
            }else{
                return false
            }
        }
        );
        if(targetType == "customNode" && sourceType === 'customSelect'){
            targetNodeConnections.push(true)
        }
        //console.log("edges: ", edges)
        let targetNodeConnections2 = targetNodeConnections.filter((item, index)=>{return item==true})
        console.log(targetNodeConnections, targetNodeConnections2)
        //console.log(sourceType)
        // Verificar si el nodo fuente es "customD" y el destino es "customC"
        /* if (sourceType === 'customNode' && targetType !== 'customPrioritizeN' || sourceType === 'customNode' && targetType !== 'customNode') {
            // Rechazar la conexión
            alert("Not possible")
            return;
        } */
        /* if (sourceType === 'customOr' && targetType === 'customOr') {
            // Rechazar la conexión
            alert("Not possible")
            return;
        } */
        if (sourceType === 'customPriorCamp' && targetType !== 'customTablePrior') {
            // Rechazar la conexión
            alert("Not possible")
            return;
        }
        if (sourceType === 'customOr' && targetType == 'customTablePrior') {
            // Rechazar la conexión
            alert("Not possible")
            return;
        }
        if (sourceType === 'customSelect' && targetType == 'customTablePrior') {
            // Rechazar la conexión
            alert("Not possible")
            return;
        }
        if (sourceType === 'customOr' && targetType == 'customPrioritizeN') {
            // Rechazar la conexión
            alert("Not possible")
            return;
        }
        if (sourceType === 'customSelect' && targetType == 'customNode' && targetNodeConnections2.length > MaxConnection) {
            // Rechazar la conexión
            alert("Not possible")
            return;
        }
        actions.setSavedWFFalse()
        // Permitir la conexión
        setEdges((eds) => addEdge(params, eds));
    }, [nodes, edges]); //to count connections, it's necessary change when edges changes

    const panOnDrag = [1, 2];

    useEffect(() => {
        const dataFetch = async () => {
            /* let response = await actions.useFetch(urlTable, {
                Compania: store.user.JRCompaniaAut[0],
                campaign_id: props.campaign
            }, "POST");
            if (response.ok) {
                response = await response.json()
                setTableDB(response)
                console.log(response)
                //setNodes(response.node_id)
            } */
            console.log("id: ", props.campaign)
            let response2 = await actions.useFetch(urlCampaign, {
                //Compania: store.user.JRCompaniaAut[0],
                campaign_id: props.campaign
            }, "POST");
            if (response2.ok) {
                response2 = await response2.json()
                console.log(response2)
                setNodes(response2.node_id)
                setEdges(response2.edge_id)
                store.nodes = response2.node_id
                store.edges = response2.edge_id
                //setNodes(response.node_id)
            }
        }

        dataFetch()
    }, [refresh])

    /* useEffect(() => {
        
        if (store.nodes !== nodes && store.nodes.length > 0) {
            updatedNodes = applyNodeChanges(store.nodes, updatedNodes);
            setNodes(updatedNodes);
        }

        
    }, [store.nodes]) */

    return (
        <>
            <div className='container-fluid p-0 border border-1 border-primary' style={{ padding: '2px' }}>
                <div className='row' style={{ maxHeight: '200px', overflow: 'auto' }}>
                    <div className='col-md-2'></div>
                    <div className='col-md-10'>
                        {/* {tableDB && tableDB.length > 0 ?
                            <div className="table-responsive">
                                <h4 style={{ color: "black" }}>Preview Customer Table with 10 Customers</h4>
                                <table className="table table-hover table-sm align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">id</th>
                                            <th scope="col">First Name</th>
                                            <th scope="col">Middle Name</th>
                                            <th scope="col">Last Name</th>
                                            <th scope="col">Gender</th>
                                            <th scope="col">Birth Date</th>
                                            <th scope="col">Register Date</th>
                                            <th scope="col">Anniversary Date</th>
                                            <th scope="col">New User</th>
                                            <th scope="col">Fader User</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableDB.map((customer, index) => {
                                            return <tr key={index}>
                                                <td>
                                                    {`${customer.id}`}
                                                </td>
                                                <td>
                                                    {`${customer.first_name}`}
                                                </td>
                                                <td>
                                                    {`${customer.middle_name}`}
                                                </td>
                                                <td>
                                                    {`${customer.last_name}`}
                                                </td>
                                                <td>
                                                    {`${customer.gender}`}
                                                </td>
                                                <td>
                                                    {`${customer.bithdate}`}
                                                </td>
                                                <td>
                                                    {`${customer.register_date}`}
                                                </td>
                                                <td>
                                                    {`${customer.anniversary_date}`}
                                                </td>
                                                <td>
                                                    {`${customer.new}`}
                                                </td>
                                                <td>
                                                    {`${customer.fader}`}
                                                </td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div> :
                            <></>} */}
                    </div>
                </div>
                <div className='row d-flex flex-row border border-1'>
                    <div className='row d-flex flex-row col lateral-menu2 justify-content-center'>
                        <button className="d-flex lateral-button justify-content-center" onClick={(e) => { setHideMenu(!hideMenu) }} title="Hide/Expand Menu">{!hideMenu ? <><i className="fas fa-bars"></i></> : <><i className="fas fa-bars"></i></>}</button>
                        <SideMenu3 nodes={nodes} edges={edges} setNodes={setNodes} table={tableDB} setTable={setTableDB} setEdges={setEdges} campaignid={props.campaign} refresh={refresh} setRefresh={setRefresh} hide={hideMenu} />

                    </div>
                    <div className={!hideMenu ? 'col-10' : 'col-11'}>
                        <div style={{ height: '100vh', overflowY: 'auto' }}>

                            <ReactFlow                               
                                nodes={nodes}
                                
                                onNodesChange={onNodesChange}
                                edges={edges}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                deleteKeyCode={["Backspace","Delete"]}                                
                                fitView
                                selectionOnDrag
                                panOnDrag={panOnDrag}
                                selectionMode={SelectionMode.Partial}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                data={{ createNodes: handleCreateNode, message: "test" }}
                            >
                                <Controls position='top-left' />                                
                                <MiniMap style={minimapStyle} position={"top-right"} zoomable pannable maskColor="rgb(200,6,6, 0.1)" />

                            </ReactFlow>
                        </div>
                    </div>
                </div>

            </div >
        </>

    );
};

export default Blueprint2
