import React, { useEffect, useContext, useState, useRef } from 'react';
import { Context } from '../../store/appContext';
import { Handle } from 'reactflow';
import Swal from 'sweetalert2';
//import Excel from '../../component/excelExport.jsx';
import { CSVLink } from "react-csv";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MyPlot from '../../components/plotlyReact.jsx';
import Board, { moveCard, addCard, addColumn } from "@asseinfo/react-kanban";
//import Board from '@lourenci/react-kanban'
import "@asseinfo/react-kanban/dist/styles.css";
import { Box, CardActions } from "@material-ui/core";
import "./kanban.css"
import avatar2 from "../../../img/logo.png";


export default (props, { data }) => {
    const { store, actions } = useContext(Context)
    const [tableNode, setTableNode] = useState([])
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [querySQL, setQuerySQL] = useState("")
    const [showQuerySQL, setShowQuerySQL] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [tableid, setTableid] = useState("")
    const [showModalBody, setShowModalBody] = useState(false)
    const [tableML, setTableML] = useState([])
    const [tableCluster, setTableCluster] = useState([])
    const [elbow, setElbow] = useState({ x_axis: false })
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [numberCluster, setNumberCluster] = useState(0)
    const [campaigns, setCampaigns] = useState([]);
    const urlQuery = "/campaignQuery5V3"
    const urlElbow = "/elbowMethod"
    const urlTrainCluster = "/trainCluster"
    const urlUpdate = "/campaignPrioritizeUpdate";
    let initialBoard = {
        counter: 3,
        columns: [
            {
                id: 1,
                title: "Filters",
                cards: [
                    {
                        id: 1,
                        title: "Hard Coded 1",
                        image: avatar2,
                        message: "campaign 1 description",
                        active: "OPEN",
                        dicc: {},
                        col: "",
                        type: ""
                    },
                    {
                        id: 2,
                        title: "Hard Coded 2",
                        message: "campaign 2 description",
                        active: "OPEN",
                        dicc: {},
                        col: "",
                        type: ""
                    },
                    {
                        id: 3,
                        title: "Hard Coded 3",
                        message: "campaign 3 description",
                        active: "OPEN",
                        dicc: {},
                        col: "",
                        type: ""
                    },
                ]
            },
            {
                id: 2,
                title: "PRIORITIZE ORDER",
                cards: []
            }
        ]
    }
    const [layout, setLayout] = useState(initialBoard)
    const [controlledBoard, setBoard] = useState(initialBoard); //tablero para el estadoControlado

    useEffect(() => {
        setTableNode([])
    }, [])

    useEffect(() => {
        if (props.selected) console.log("I've been selected!");
    }, [props.selected]);

    const handleClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!store.savedWF) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Need save changes first',
                showConfirmButton: true,
            })
            return
        }
        //console.log('id: ', props.id, " campaign_id: ", props.data.campaign_id, props);
        setTableid(props.id)
        let obj = {
            //Compania: store.user.JRCompaniaAut[0],
            node_id: props.id,
            campaign_id: props.data.campaign_id
        }

        console.log("Going to backend to make")
        setLoading(true)
        let response = await actions.useFetch(urlQuery, obj, "POST");
        if (response.ok) {
            setLoading(false)
            response = await response.json()
            //props.setTable(response.table)
            console.log(response)
            setTableNode(response.table)
            setQuerySQL(response.query)
            let obj_res = {
                counter: response.attributes.length,
                columns: [{
                    id: 1,
                    title: "FILTERS",
                    cards: response.attributes.map((item, index) => {
                        let key_item = Object.keys(item.dicc)
                        let key_text = Object.keys(item.dicc)
                        //console.log("key_item: ", key_item)
                        let value_item = item.dicc[key_item]
                        if (key_item == "e") {
                            key_text = "="
                        }
                        if (key_item == "gt") {
                            key_text = ">"
                        }
                        if (key_item == "gte") {
                            key_text = ">="
                        }
                        if (key_item == "lt") {
                            key_text = "<"
                        }
                        if (key_item == "lte") {
                            key_text = "<="
                        }
                        let tempObj = {
                            id: index + 1,
                            title: item.model,
                            message: item.col + " " + key_text + " " + value_item,
                            dicc: item.dicc,
                            col: item.col,
                            type: item.type,
                            active: true
                        }
                        return tempObj
                    })
                },
                {
                    id: 2,
                    title: "PRIORITIZE ORDER",
                    cards: []
                }
                ]

            }
            console.log(obj_res)
            setCampaigns(obj_res.columns.cards)
            setBoard(obj_res)
            /* Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'These customers will be used for Campaign\'s mail',
                showConfirmButton: false,
                timer: 3500
            }) */
        } else {
            setLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error ocurred ',
                showConfirmButton: false,
                timer: 1500
            })
        }

    };

    const handleMouseDown = (event) => {
        console.log('Stop propagation.');
        event.stopPropagation();
    };

    const handleColumnToggle = (columnName) => {
        if (selectedColumns.includes(columnName)) {
            setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
        } else {
            setSelectedColumns([...selectedColumns, columnName]);
        }
    };

    const exportData = tableNode.map((customer) => {
        const data = {};
        selectedColumns.forEach((col) => {
            data[col] = customer[col] || "";
        });
        return data;
    });

    let exportData2 = tableCluster.map((customer) => {
        const data = {};
        selectedColumns.forEach((col) => {
            data[col] = customer[col] || "";
        });
        return data;
    });

    const csvHeaders = selectedColumns.map((col) => ({ label: col, key: col }));

    const reducedTable = (columns, originalTable) => {
        const tablaFinal = originalTable.map(objeto => {
            return columns.reduce((resultado, indice) => {
                resultado[indice] = objeto[indice];
                return resultado;
            }, {});
        });
        //print(tablaFinal)
        setTableML(tablaFinal)
        return
    }

    const openCloseModalBody = () => {
        setShowModalBody(!showModalBody)
    }

    function ControlledBoard() {
        // You need to control the state yourself.


        function handleCardMove(_card, source, destination) {
            console.log("--handleCardMove--")
            console.log("source:", source)
            console.log("destination:", destination)
            const updatedBoard = moveCard(controlledBoard, source, destination);

            setBoard(updatedBoard);
            console.log(controlledBoard)
        }

        function onCardNew(newCard) {
            //const newCardLocal = { id: initialBoard.counter + 1, ...newCard };
            newCard = { id: new Date().getTime(), status: "PENDING", ...newCard }; //el id generado por fecha
            campaigns.counter = campaigns.counter + 1;
            //console.log(newCardLocal)  
            console.log(newCard)
            setBoard({
                counter: campaigns.length,
                columns: [{
                    id: 1,
                    title: "FILTERS",
                    cards: campaigns
                },
                {
                    id: 2,
                    title: "PRIORITIZE ORDER",
                    cards: []
                }]
            });
            console.log("verificación de cambio en initalBoard, func onCardNew:", controlledBoard)//en este punto el tablero no cambia, sólo se crea nueva carta
            return newCard;
        }

        // Note: To enable user to create a new column all the following are needed as a minimum

        /** This is called by onColumnNew on the board when a new column has been requested and 
        the form on the ColumnAdder component has been filled in by the user. We update our state
        to get the board to render with the new data */

        const handleColumnAdded = (newBoard, newColumn) => {
            console.info("column added!");
            setBoard(newBoard);
        };

        /** This is called when a new column has been requested, its main job is 
         to give you a chance to save it and return a new id for the column */
        const handleColumnConfirmed = (newColumnName) => {
            console.info("Column id requested");
            // You will need to generate a new id for you column here - id from a database insert or similar?
            const newColumn = {
                id: "testing-but-this-should-be-unique",
                ...newColumnName
            };
            return newColumn;
        };

        /* const kanbanFormA = useRef(null);
        const cardInputA = useRef(null);
        const kanbanFormB = useRef(null);
        const cardInputB = useRef(null);
        const kanbanFormC = useRef(null);
        const cardInputC = useRef(null); */



        return (
            <>
                <div className="container d-flex flex-column " style={{ "width": "100%", "overflow-x": "hidden", "max-width": "100vw", "height": "100%" }}>
                    <div className="row d-flex justify-content-evenly align-self-center" >
                        <div className="col-12 justify-content-around align-self-center" >
                            <Board
                                onCardDragEnd={setBoard} //esta línea me daba problemas
                                disableColumnDrag
                                allowAddColumn={false}
                                onNewColumnConfirm={handleColumnConfirmed}
                                onColumnNew={handleColumnAdded}
                                allowRenameColumn
                                allowRemoveCard
                                onLaneRemove={setBoard}
                                onCardRemove={setBoard}
                                //onCardNew={setBoard}
                                onLaneRename={setBoard}
                                initialBoard={controlledBoard}
                                allowAddCard
                                //onNewCardConfirm={onCardNew}
                                renderCard={(
                                    { content, image, title, message, active, members, id },
                                    { removeCard, dragging, moveCard }
                                ) => (
                                    <Box
                                        key={id}
                                        className="card d-flex flex-column pb-1"
                                        //className={`react-kanban-card ${dragging ? 'react-kanban-card--dragging' : ''}`}
                                        style={{ width: "275px", borderRadius: "5%" }}
                                        /* draggable="true"
                                        onDragCapture={dragging}
                                        onDragStartCapture={dragging}
                                        onDragEndCapture={dragging} */
                                        //onDragEnd={moveCard}
                                        dragging={dragging}
                                        flexDirection="column"
                                    >
                                        <div className="card-header d-flex flex-row justify-content-center align-self-center text-justify mb-3 w-100 align-middle" style={{ fontSize: "auto" }}>
                                            <h5 className="col-sm-10 text-start font-weight-bold text-uppercase mh-100 align-middle text-wrap" style={{ fontSize: "auto" }}>
                                                {title}
                                            </h5>
                                            {/* <div
                                                className="col-sm-2"
                                                align="right"
                                                cursor="pointer"
                                                h="max-content"
                                                w="max-content"
                                            >
                                                <i
                                                    className="fa fa-trash"
                                                    onClick={removeCard} //eliminate button
                                                />
                                            </div> */}
                                        </div>
                                        {/* {image ? (
                                            <img
                                                style={{ borderRadius: "15px" }}
                                                w="50px"
                                                h="50px"
                                                className="justify-content-center align-self-center py-1"
                                                src={image}
                                                width="100px"
                                                height="100px"
                                                mb="20px"
                                            />
                                        ) : null} */}
                                        <p className="text-start mh-100 align-middle text-wrap mx-4 text-wrap" >
                                            {message ? message : ""}
                                        </p>
                                        <div w="100%" mt="20px" align="right" >
                                            {members ? (
                                                <ul size="sm">
                                                    {members.map((item, index) => {
                                                        return (
                                                            <img key={index} src={item} width="35px" height="35px" style={{ borderRadius: "50%" }} />
                                                        )
                                                    })}


                                                </ul>
                                            ) : null}

                                        </div>
                                        {active || active != "" ? (
                                            <div
                                                fontSize="10px"
                                                fontWeight="bold"
                                                variant="solid"
                                                h="28px"
                                                w="94px"
                                                ms="auto"
                                                display="flex"
                                                borderRadius="8px"
                                                alignItems="center"
                                                justifyContent="center"
                                                className="text-center mw-100 justify-content-center fw-bolder"
                                                bg={
                                                    active === false
                                                        ? "red.500"
                                                        : active === "PENDING"
                                                            ? "orange.300"
                                                            : active === true
                                                                ? "green.500"
                                                                : active === "UPDATES"
                                                                    ? "blue.400"
                                                                    : "teal"
                                                }
                                                style={{
                                                    background:
                                                        active === false
                                                            ? "red"
                                                            : active === "PENDING"
                                                                ? "orange"
                                                                : active === true
                                                                    ? "green"
                                                                    : active === "UPDATES"
                                                                        ? "blue"
                                                                        : "teal"
                                                }}
                                            >
                                                {active === false
                                                    ? "INACTIVE"
                                                    : active === "PENDING"
                                                        ? "PENDING"
                                                        : active === true
                                                            ? 'ACTIVE'// `${id}`
                                                            : active === "UPDATES"
                                                                ? "blue.400"
                                                                : "UPDATES"}
                                            </div>
                                        ) : null}
                                    </Box>
                                )}
                                renderColumnHeader={function ({ title, id }, { addCard }) {
                                    /* function kanbanFormOpenA() {
                                        kanbanFormA.current.style.display = "flex";
                                        console.log(id);
                                    }
                                    function kanbanFormCloseA() {
                                        kanbanFormA.current.style.display = "none";
                                    }
                                    function formSubmitA() {
                                        addCard({ title: cardInputA.current.value });
                                        cardInputA.current.value = "";
                                    }
                                    function kanbanFormOpenB() {
                                        kanbanFormB.current.style.display = "flex";
                                    }
                                    function kanbanFormCloseB() {
                                        kanbanFormB.current.style.display = "none";
                                    }
                                    function formSubmitB() {
                                        addCard({ title: cardInputB.current.value });
                                        cardInputB.current.value = "";
                                    }
                                    function kanbanFormOpenC() {
                                        kanbanFormC.current.style.display = "flex";
                                    }
                                    function kanbanFormCloseC() {
                                        kanbanFormC.current.style.display = "none";
                                    }
                                    function formSubmitC() {
                                        addCard({ title: cardInputC.current.value });
                                        cardInputC.current.value = "";
                                    } */
                                    return (
                                        <div
                                            key={id}
                                            flexDirection="column"
                                            className="card d-flex flex-column"
                                            mb="5px"
                                            fontWeight="bold"
                                            w="100%"
                                            style={{ backgroundColor: "#EEEEEE" }}
                                        >
                                            <div className="text-center align-middle fs-1 justify-content-between align-self-center mb-2 pb-1" style={{ backgroundColor: "#EEEEEE" }}>
                                                <h5 className="text-center align-middle fs-4" style={{ backgroundColor: "#EEEEEE" }}>
                                                    {title ? title : ""}
                                                </h5>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                        </div></div></div>

                <div className="row py-2 my-1">
                    <div align="right">
                        <button className="btn btn-outline-success"
                            onClick={async () => {
                                // setLayout(controlledBoard)
                                console.log(controlledBoard) //controlled board es el correcto
                                let obj = {
                                    //Compania: store.user.JRCompaniaAut[0],
                                    //Nombre: props.nombre,
                                    node_id: props.id,
                                    campaign_id: props.data.campaign_id,
                                    Kanban: controlledBoard
                                }
                                setLoading(true)
                                let response = await actions.useFetch(urlUpdate, obj, "PUT")
                                if (response.ok) {
                                    setLoading(false)
                                    response = await response.json()
                                    //console.log(response)
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: "Drag and Move Prioritize Node to reveal tables",
                                        showConfirmButton: true,
                                        //timer: 3500
                                    })
                                    let list_nodes = []
                                    if (response.list_queries && response.list_queries.length > 0) {
                                        for (let i = 0; i < response.list_queries.length; i++) {
                                            let name = "Remanent";
                                            ///console.log(response["list_filters"])

                                            if (response["list_filters"][i]["col"]) {
                                                name = response["list_filters"][i]["col"] + " " + Object.keys(response["list_filters"][i]["dicc"])[0] + " " + response["list_filters"][i]["dicc"][Object.keys(response["list_filters"][i]["dicc"])[0]]
                                            }
                                            let node = createNode(`${i + 1} Prioritize Table: ${name}`, response.list_queries[i], i)
                                            list_nodes.push(node)
                                        }
                                        //console.log("list_nodes: ",list_nodes)
                                    } else {
                                        let node = createNode(`Prioritize Table: ${0}`, response.table)
                                        list_nodes.push(node)
                                        //console.log("list_nodes: ",list_nodes)
                                    }
                                    openCloseModalBody()
                                } else {
                                    setLoading(false)
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'error',
                                        title: "error",
                                        showConfirmButton: false,
                                        timer: 3500
                                    })
                                }

                            }}>
                            Create Nodes
                        </button>
                        {
                            loading ?
                                <div className="d-flex justify-content-center align-items-center" id="loading">
                                    <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                : <></>
                        }
                    </div>
                </div>
            </>
        );
    }

    const useStyles = makeStyles((theme) => ({
        modal: {
            position: "fixed",
            display: "inline-block",
            justifyContent: "center",
            minHeight: "300px",
            width: "100%", /* celular */
            //minWidth: "540px",
            maxWidth: "700px",
            maxHeight: "640px",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            /* padding: theme.spacing(2, 4, 3), */
            top: "50%",
            left: "50%",
            margin: "-320px 0 0 -350px", /* Ajusta los valores según sea necesario */
            overflowY: "auto",
            overflowX: "auto",
            zIndex: 9999,
            padding: "0px",
            color: "black"
        },
        modal2: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            height: "600px",
            width: "fit-content", /* celular */
            minWidth: "400px",
            maxWidth: "max-content",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            /* padding: theme.spacing(2, 4, 3), */
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "scroll",
            zIndex: 9999,
            padding: "10px",
            zIndex: "9999 !important",
        },
        iconos: { cursor: "pointer", },
        inputMaterial: { width: "100%", },
    }));
    const styles = useStyles();

    const createNode = (name, table, loop = 0) => {
        let { id, handleCreateNode } = props;
        //console.log("propsnode:", props, data.message)
        // Lógica para crear un nuevo nodo
        let yPosLoop = loop * 180
        let newNode = {
            id: Math.random().toString(),
            type: 'customTablePrior',
            position: { x: props.xPos + 220, y: props.yPos + yPosLoop },
            data: {
                label: name,
            },
            table: table,
            campaign_id: props.data.campaign_id
        };

        //let newNode2 = Node(newNode);
        //data.createNodes(props.id, newNode)
        actions.addNode(props.id, newNode)
        return newNode

    };

    const showModal = (event) => {
        return (
            <div className={styles.modal}>
                <div align="d-flex row px-2 mx-2">
                    <div className="col-1"></div>
                    <div className="col-11" style={{ display: "flex", flexDirection: "row-reverse" }}>
                        <button className="btn btn-outline-danger" onClick={() => openCloseModalBody()}>Close</button>
                    </div>
                </div>
                <br />
                <div className='container-fluid'>
                    <div className="step-label">Prioritize Attributes Order</div>
                </div>
                <div className='container-fluid'>
                    <div className='row d-flex'>
                        {ControlledBoard()}
                    </div>
                </div>
                <br />
                <br />
                <div align="d-flex row px-2 mx-2">
                    <div className="col-1"></div>
                    <div className="col-11" style={{ display: "flex", flexDirection: "row-reverse" }}>
                        <button className="btn btn-outline-danger" onClick={() => openCloseModalBody()}>Close</button>
                    </div>
                </div>
            </div>
        )
    }


    return (<>
        <div
            style={{
                border: '2px solid blue',
                textAlign: 'center',
                padding: 10,
                fontSize: '0.8rem',
                borderColor: props.selected ? 'green' : 'black',
                borderWidth: '4px',
                backgroundColor: props.selected ? '#E8E8E8' : 'white',
                color: 'black',
                maxHeight: !showQuerySQL ? '400px' : '100%',
                overflowY: showTable ? 'auto' : 'unset'
            }}
        >
            <Handle type="target" position="left" />
            <div style={{ fontSize: 'x-large' }}>{props.data.label}</div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '5px'
                }}
            >

                <br />
                {!tableNode || tableNode.length == 0 ? <> <button className="nodrag btn btn-primary text-dark" onClick={handleClick} type='button'>
                    Order Attributes
                </button>
                    {
                        loading ?
                            <div className="d-flex justify-content-center align-items-center" id="loading">
                                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            : <></>
                    }
                </> : <><button className="nodrag btn btn-primary text-dark" onClick={handleClick} type='button'>
                    Repeat Query
                </button> {/* <Excel idDiv={`node-${props.id}`} />  */} Rows: {tableNode.length}
                {
                        loading ?
                            <div className="d-flex justify-content-center align-items-center" id="loading">
                                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            : <></>
                    }
                </>}

            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: showTable ? 'space-between' : 'center'
                }}
            >
                {!tableNode || tableNode.length == 0 && !showTable ? <></> : <>
                    {showTable ? <> <button className="nodrag btn btn-primary text-dark" onClick={(e) => { setShowTable(!showTable) }} type='button'>
                        Hide Prioritize Order
                    </button>

                        <button className="nodrag btn btn-primary text-dark"></button> </> : <button className="nodrag btn btn-primary text-dark" onClick={(e) => { openCloseModalBody() }} type='button'>
                        Show Prioritize Order
                    </button>}
                </>}

            </div>

            {tableNode && tableNode.length > 0 ?
                <>
                    <div className='row d-flex'>
                        <div className='col d-flex justify-content-end'>
                            ✅
                        </div>
                    </div>
                </> :
                <>
                    <div className='row d-flex'>
                        <div className='col d-flex justify-content-end'>
                            ⚠️
                        </div>
                    </div>
                </>}
            {/* <Handle type="source" position="right" /> */}
        </div>
        <Modal open={showModalBody} onClose={openCloseModalBody}>
            {showModal()}
        </Modal>
    </>
    );
};
