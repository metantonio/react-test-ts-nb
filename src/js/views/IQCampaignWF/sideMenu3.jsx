import React, { useState, useContext, useEffect, useRef } from 'react';
import { Context } from '../../store/appContext';
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Button } from "@material-ui/core";
import Board, { moveCard, addCard, addColumn } from "@asseinfo/react-kanban";
//import Board from '@lourenci/react-kanban'
import "@asseinfo/react-kanban/dist/styles.css";
import { Box, CardActions } from "@material-ui/core";
import { CSVLink } from "react-csv";
//import { Nav } from 'react-bootstrap';
import "./sideMenu2.css"
import Swal from 'sweetalert2';
import avatar2 from "../../../img/logo.png";
import "./kanban.css"
import XGBOOSTREGRESSOR from '../MachineLearning/xgboostregressor.jsx';
import SimpleLinear from '../MachineLearning/simpleLinear.jsx';
import PolinomialRegression from '../MachineLearning/polinomialRegression.jsx';

const SideMenu3 = (props) => {
    const { store, actions } = useContext(Context)
    const [showModal, setShowModal] = useState(false);
    const [showPrioritize, setShowPrioritize] = useState(false);
    const [showPrioritizeN, setShowPrioritizeN] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false)
    const [selectedColumns, setSelectedColumns] = useState(['id']);
    const [provitionalNode, setProvitionalNode] = useState({})
    const [allTablesDB, setAllTablesDB] = useState([])
    const [tableSpecific, setTableSpecific] = useState([])
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false)
    const [customersIdList, setCustomersIdList] = useState([])
    const [selectedFile, setSelectedFile] = useState(null);
    const [plotImage, setPlotImage] = useState(null)
    const [plotResidualImage, setResidualImage] = useState(null)
    const [loadignPlot, setLoadingPlot] = useState(false)
    const [showXGBOOST, setShowXGBOOST] = useState(false)
    const [showSimpleLinear, setShowSimpleLinear] = useState(false)
    const [showPolinomial, setShowPolinomial] = useState(false)
    const [xgBoostData, setXGBoostData] = useState({})

    let initialBoard = {
        counter: 3,
        columns: [
            {
                id: 1,
                title: "CAMPAIGNS",
                cards: [
                    {
                        id: 1,
                        title: "Hard Coded 1",
                        image: avatar2,
                        message: "campaign 1 description",
                        active: "OPEN",
                    },
                    {
                        id: 2,
                        title: "Hard Coded 2",
                        message: "campaign 2 description",
                        active: "OPEN",
                    },
                    {
                        id: 3,
                        title: "Hard Coded 3",
                        message: "campaign 3 description",
                        active: "OPEN",
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
    const urlGet = "/campaign"
    const urlRegister = "/campaignNode2V3"
    const urlQuery = "/campaignQuery2"
    const urlAllTables = "/allTables";
    const urlSpecificTable = "/specificTable";
    const urlPrioritize = "/campaignPrioritizeV3";
    const urlPrioritizeN = "/campaignPrioritizeNV3";
    const urlGetCampaign = "/campaign/";

    const editCampaign = async () => {
        const { value: title, isConfirmed } = await Swal.fire({
            title: 'Input Campaign\'s Title',
            input: 'text',
            inputLabel: 'Campaign\'s Title',
            inputPlaceholder: 'Enter the Title of Campaign here',
            showDenyButton: true,
            confirmButtonText: 'Create'
        })
        if (isConfirmed) {
            if (title) {
                //Swal.fire(`Entered Title: ${title}`)
                //here goes some logic to fetch to API
                let response = await actions.useFetch(urlRegister, {
                    //Compania: store.user.JRCompaniaAut[0],
                    title: title
                }, "POST");
                if (response.ok) {
                    response = await response.json()
                    Swal.fire(`Entered Title: ${response.message}`)
                    props.setReload(!props.reload)
                } else {
                    let response = await response.json()
                    Swal.fire(`Entered Title: ${response}`)
                }
            } else {
                Swal.fire({
                    title: 'You must enter a Name',
                    icon: "warning",
                    showDenyButton: true
                })
            }
        }
    }
    const openCloseShowModal = () => {
        setProvitionalNode({})
        setShowModal(!showModal);
    };
    const openClosePrioritizeModal = () => {
        setProvitionalNode({})
        /* setBoard({
            counter:campaigns.length, columns: {
                id: 1,
                title: "CAMPAIGNS",
                cards: campaigns
            }
        }) */
        setShowPrioritize(!showPrioritize);
    };

    const openClosePrioritizeNModal = () => {
        setProvitionalNode({})
        /* setBoard({
            counter:campaigns.length, columns: {
                id: 1,
                title: "CAMPAIGNS",
                cards: campaigns
            }
        }) */
        setShowPrioritizeN(!showPrioritizeN);
    };

    const openCloseCustomerModal = () => {
        console.log("\nprops: ", props)
        setShowCustomerModal(!showCustomerModal);
    }

    const openCloseXGBOOSTModal = () => {
        //console.log("\nprops: ", props)
        setShowXGBOOST(!showXGBOOST)
    }

    const openCloseSimpleLinearModal = () => {
        setShowSimpleLinear(!showSimpleLinear)
    }

    const openClosePolinomialModal = () => {
        setShowPolinomial(!showPolinomial)
    }

    const useStyles = makeStyles((theme) => ({
        modal: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            height: "600px",
            width: "100%", /* celular */
            minWidth: "900px",
            maxWidth: "max-content",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            /* padding: theme.spacing(2, 4, 3), */
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "scroll",
            overflowX: "scroll",
            zIndex: 9999,
            padding: "10px",
            /*  zIndex: "9999 !important", */
        },
        modal2: {
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
        iconos: { cursor: "pointer", },
        inputMaterial: { width: "100%", },
    }));
    const styles = useStyles();
    const bodyShow = (
        <div className={styles.modal} id="pdf-export">
            <div align="right">
                {/*                 <DocuPDF titulo={"Detalles de Gastos"} idDiv="pdf-export" orientacion="con que exista este campo la hoja estará horizontal" />
*/}                <button className="btn btn-outline-danger mx-2" onClick={() => openCloseShowModal()}>Close</button>
            </div>
            <div className='container-fluid'>
                <div className='row d-flex'>
                    <div className='col-3'>
                        <div className="step-label">Step 0</div>
                    </div>
                    <div className='col-3 justify-content-center align-self-center'>
                        <button
                            className='btn btn-primary'
                            onClick={async (e) => {
                                setProvitionalNode({})

                                let selectionOption = ''
                                let selectionValue = ''
                                let rowTable = allTablesDB;
                                console.log(rowTable)
                                let { value: selection } = await Swal.fire({
                                    title: 'Table selection',
                                    input: 'select',
                                    inputOptions: {
                                        'Tables': { ...rowTable },
                                        //'icecream': 'Ice cream'
                                    },
                                    inputPlaceholder: 'Select a Table',
                                    showCancelButton: true
                                })
                                if (selection) {
                                    selectionOption = rowTable[selection]
                                    selectionValue = rowTable[selection]
                                    let newObj = {
                                        //Compania: store.user.JRCompaniaAut[0],
                                        table: [selectionValue]
                                    }
                                    setLoading(true)
                                    let response = await actions.useFetch(urlSpecificTable, newObj, "POST");
                                    if (response.ok) {
                                        response = await response.json()
                                        setTableSpecific(response.table)
                                        Swal.fire(`You selected: ${rowTable[selection]}`)

                                        let newNode = {
                                            id: props.nodes.length > 0 ? props.nodes[props.nodes.length - 1].id + 1 : 1,
                                            data: { label: "Table: " + " " + selectionValue },
                                            position: props.nodes.length > 0 ? { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y } : { x: 0, y: 0 },
                                            type: 'input',
                                            campaign_id: props.campaignid,
                                            query_text: 'Where', //remember add this field in backend
                                            query_value: '', //remember add this field in backend
                                            query_table: selectionValue,
                                            front_new: true, //this field only works in front end to decide if show or not new options
                                        }

                                        setProvitionalNode(newNode)
                                        setLoading(false)
                                    } else {
                                        setLoading(false)
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'error',
                                            title: 'Error ocurred trying to save your work',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    }
                                }
                            }}>
                            Select Table
                        </button>
                    </div>
                </div>
            </div>
            <br />
            {tableSpecific && tableSpecific.length > 0 ? <>
                <h4 style={{ color: "black" }}>Preview Table with 10 rows</h4>
            </> : <>{loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                {/* <strong>Loading...</strong> */}
                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}</>
            }
            <div id="visual-comprobante" style={{ maxHeight: '200px', overflow: 'auto', margin: '10px' }}>
                {tableSpecific && tableSpecific.length > 0 ?
                    <div className="table-responsive" style={{ overflowX: 'unset' }}>
                        <table className="table table-hover table-sm align-middle">
                            <thead className="table-light">
                                <tr>
                                    {tableSpecific.map((customer, index) => {
                                        let columnTable = Object.keys(customer);
                                        let rowValues = [];

                                        for (let row in columnTable) {
                                            rowValues.push(<th scope="col">{`${columnTable[row]}`}</th>);
                                        }
                                        if (index == 0) {
                                            return rowValues
                                        }
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {tableSpecific.map((customer, index) => {
                                    let columnTable = Object.keys(customer);
                                    let rowValues = [];

                                    for (let row in columnTable) {
                                        rowValues.push(<td>{`${customer[`${columnTable[row]}`]}`}</td>);
                                    }
                                    return <tr key={index}>{rowValues}</tr>;
                                })}
                            </tbody>

                        </table>
                    </div> :
                    <></>}
            </div>
            <br />
            <div className='container-fluid'>
                {provitionalNode.id ? <>
                    <div className='row d-flex'>

                        <div className='col-3'>
                            <div className="step-label">Step 1</div>
                        </div>
                        <div className='col-3 justify-content-center align-self-center'>
                            <>

                                <button
                                    className='btn btn-primary'
                                    onClick={async (e) => {
                                        let selectionOption = ''
                                        let selectionValue = ''
                                        let rowTable = Object.keys(tableSpecific[0]);
                                        console.log(rowTable)
                                        let { value: selection } = await Swal.fire({
                                            title: 'Query: Where',
                                            input: 'select',
                                            inputOptions: {
                                                'Columns': { ...rowTable },
                                                //'icecream': 'Ice cream'
                                            },
                                            inputPlaceholder: 'Select a Column',
                                            showCancelButton: true
                                        })
                                        if (selection) {
                                            selectionOption = rowTable[selection]
                                            selectionValue = rowTable[selection]
                                            let newNode = {
                                                id: props.nodes.length > 0 ? props.nodes[props.nodes.length - 1].id + 1 : 1,
                                                data: { label: provitionalNode.data.label + " \n Column: " + " " + selectionOption },
                                                position: props.nodes.length > 0 ? { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y } : { x: 0, y: 0 },
                                                type: 'input',
                                                campaign_id: props.campaignid,
                                                query_text: 'Where', //remember add this field in backend
                                                query_value: selectionValue, //remember add this field in backend
                                                front_new: true, //this field only works in front end to decide if show or not new options
                                                query_option: ''
                                            }

                                            setProvitionalNode({ ...provitionalNode, ...newNode })
                                            Swal.fire(`You selected: ${rowTable[selection]}`)
                                        }
                                    }}>
                                    Select Column
                                </button></>
                        </div>
                        <div className='col-6 text-dark justify-content-center align-self-center'>{provitionalNode.query_value ? <>Selected Column: <strong>{provitionalNode.query_value}</strong> </> : ""}</div>
                    </div>
                </> : <></>}

                {provitionalNode.query_value ? <>
                    <div className='row d-flex'>
                        <div className='col-3'>
                            <div className="step-label">Step 2</div>
                        </div>
                        <div className='col-3 text-dark justify-content-center align-self-center'>{provitionalNode.front_new ? <>

                            <button
                                className='btn btn-primary'
                                onClick={async (e) => {
                                    let selectionOption = ''
                                    let selectionValue = ''
                                    let rowTable = ["=", "!=",  "like", "ilike", ">", ">=", "<", "<=" , "top", "bottom" /*, "desvstd" */];
                                    console.log(rowTable)
                                    let { value: selection } = await Swal.fire({
                                        title: 'Query: Type',
                                        input: 'select',
                                        inputOptions: {
                                            'Columns': { ...rowTable },
                                            //'icecream': 'Ice cream'
                                        },
                                        inputPlaceholder: 'Select a Column',
                                        showCancelButton: true
                                    })
                                    if (selection) {
                                        //console.log(selection)
                                        selectionOption = rowTable[selection]
                                        selectionValue = rowTable[selection]
                                        let newNode = {
                                            //id: props.nodes[provitionalNode.length - 1].id + 1,
                                            //data: { label: "Query" + " " + selectionOption },
                                            //position: { x: 60 + provitionalNode[provitionalNode.length - 1].position.x, y: 50 + provitionalNode[provitionalNode.length - 1].position.y },
                                            data: { label: provitionalNode.data.label + " " + selectionValue },
                                            type: 'customSelect',
                                            campaign_id: props.campaignid,
                                            query_option: selectionValue, //remember add this field in backend
                                            query_option_value: selectionValue, //remember add this field in backend
                                            front_new: false, //this field only works in front end to decide if show or not new options
                                        }

                                        setProvitionalNode({ ...provitionalNode, ...newNode })
                                        Swal.fire(`You selected: ${rowTable[selection]}`)
                                    }
                                }}>
                                Query Options
                            </button></> : <></>}</div>
                        <div className='col-6 text-dark justify-content-center align-self-center'>{provitionalNode.query_option ? <>Selected Option: <strong>{provitionalNode.query_option_value}</strong></> : ""}</div>

                    </div>
                </> : <></>}
                {provitionalNode.query_option ? <>
                    <div className='row d-flex'>
                        <div className='col-3'>
                            <div className="step-label">Step 3</div>
                        </div>
                        <div className='col-3 text-dark justify-content-center align-self-center'>

                        </div>
                        <div className='col-6 text-dark justify-content-center align-self-center'>
                            <textarea
                                className='textd-dark input-value'
                                placeholder='write text here, for dates format is: YYYY-MM-DD, number format: 3.14'
                                style={{ height: '60px' }}
                                onChange={(e) => {
                                    setProvitionalNode({ ...provitionalNode, text: e.target.value, data: { label: provitionalNode.data.label }, })
                                }}></textarea>
                        </div>
                    </div>
                </> : <></>}
            </div>
            <div align="right">
                <button className="btn btn-outline-success mx-2" onClick={async (e) => {
                    let arrNodes = [...props.nodes, { ...provitionalNode, data: { label: provitionalNode.data.label + " " + provitionalNode.text } }]
                    let response = await actions.useFetch(urlRegister, {
                        //Compania: store.user.JRCompaniaAut[0],
                        node: arrNodes,
                        edge: props.edges
                    }, "PUT");
                    if (response.ok) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Your work has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Error ocurred trying to save your work',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    props.setRefresh(!props.refresh)
                    openCloseShowModal()
                }}>Add</button>
                <button className="btn btn-outline-danger mx-2" onClick={() => openCloseShowModal()}>Close</button>
            </div>
        </div>
    )

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
                    title: "CAMPAIGNS",
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

        const kanbanFormA = useRef(null);
        const cardInputA = useRef(null);
        const kanbanFormB = useRef(null);
        const cardInputB = useRef(null);
        const kanbanFormC = useRef(null);
        const cardInputC = useRef(null);



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
                                                            ? "ACTIVE"
                                                            : active === "UPDATES"
                                                                ? "blue.400"
                                                                : "UPDATES"}
                                            </div>
                                        ) : null}
                                    </Box>
                                )}
                                renderColumnHeader={function ({ title, id }, { addCard }) {
                                    function kanbanFormOpenA() {
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
                                    }
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

                {/* <div className="row py-2 my-1">
                    <div align="right">
                        <button className="btn btn-outline-success"
                            onClick={async () => {
                                // setLayout(controlledBoard)
                                console.log(controlledBoard) //controlled board es el correcto
                                let obj = {
                                    Compania: store.user.JRCompaniaAut[0],
                                    Nombre: props.nombre,
                                    IDBaseDatos: props.id,
                                    Kanban: controlledBoard
                                }
                                let response = await actions.putGenerico(urlUpdate, obj)
                                if (response.ok) {
                                    alert(await response.json())
                                    //setRecarga(!recarga)
                                } else {
                                    alert(await response.json())
                                }

                            }}>
                            Save Changes
                        </button>
                    </div>
                </div> */}
            </>
        );
    }
    const bodyPrioritize = (
        <div className={styles.modal2} id="pdf-export">
            <div align="right">
                {/*                 <DocuPDF titulo={"Detalles de Gastos"} idDiv="pdf-export" orientacion="con que exista este campo la hoja estará horizontal" />
*/}                <button className="btn btn-outline-danger mx-2" onClick={() => openClosePrioritizeModal()}>Close</button>
            </div>
            <div className='container-fluid'>
                <div className='row d-flex'>
                    <div className='col-3'>
                        <div className="step-label">Prioritize</div>
                    </div>
                    <div className='row d-flex'>
                        {ControlledBoard()}
                    </div>
                </div>
            </div>

            <div align="right">
                <button className="btn btn-outline-success mx-2" onClick={async (e) => {
                    //console.log(controlledBoard)
                    if (controlledBoard["columns"][1]["cards"].length == 0) {
                        alert("Must select a Campaign")
                        return
                    }
                    let response = await actions.useFetch(urlPrioritize, {
                        //Compania: store.user.JRCompaniaAut[0],
                        order: controlledBoard
                    }, "POST");
                    if (response.ok) {
                        response = await response.json()
                        console.log(response["id_order"].toString())
                        let arrNodes = [
                            ...props.nodes,
                            {
                                id: props.nodes[props.nodes.length - 1].id + 1,
                                data: { label: "Prioritize campaign's id: " + response["id_order"].toString(), campaign_id: props.campaignid },
                                type: 'customPriorCamp',
                                position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
                                campaign_id: props.campaignid,
                                query_option: "=", //remember add this field in backend
                                query_value: response["id_order"].toString(), //remember add this field in backend
                                front_new: false, //this field only works in front end to decide if show or not new options
                                query_table: "none"
                            }
                        ]
                        props.setNodes(arrNodes)
                        /* let response2 = await actions.useFetch(urlRegister, {
                            Compania: store.user.JRCompaniaAut[0],
                            node: arrNodes,
                            edge: props.edges
                        }, "PUT"); */
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Added to Workflow',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        //props.setRefresh(!props.refresh)
                        openClosePrioritizeModal()
                        
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Error ocurred',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }

                }}>Save Order</button>
                <button className="btn btn-outline-danger mx-2" onClick={() => openClosePrioritizeModal()}>Close</button>
            </div>
        </div>
    )

    const bodyPrioritizeN = (
        <div className={styles.modal} id="pdf-export">
            <div align="right">
                {/*                 <DocuPDF titulo={"Detalles de Gastos"} idDiv="pdf-export" orientacion="con que exista este campo la hoja estará horizontal" />
*/}                <button className="btn btn-outline-danger mx-2" onClick={() => openClosePrioritizeNModal()}>Close</button>
            </div>
            <div className='container-fluid'>
                <div className='row d-flex'>
                    <div className='col-3'>
                        <div className="step-label">Prioritize Attributes</div>
                    </div>
                    <div className='row d-flex'>
                        {ControlledBoard()}
                    </div>
                </div>
            </div>

            <div align="right">
                <button className="btn btn-outline-success mx-2" onClick={async (e) => {
                    let arrNodes = [
                        ...props.nodes,
                        {
                            id: props.nodes[props.nodes.length - 1].id + 1,
                            data: { label: "Prioritize Attributes: " },
                            type: 'customPrioritizeN',
                            position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
                            campaign_id: props.campaignid,
                            query_option: "=", //remember add this field in backend
                            query_option_value: "", //remember add this field in backend
                            front_new: false, //this field only works in front end to decide if show or not new options
                            query_table: "none"
                        }
                    ]
                    props.setNodes(arrNodes)

                    Swal.fire({
                        position: 'top-end',
                        icon: 'Node Added, remember save changes',
                        title: 'Backend in development',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    openClosePrioritizeNModal()
                    //props.setRefresh(!props.refresh)


                }}>Add Node</button>
                <button className="btn btn-outline-danger mx-2" onClick={() => openClosePrioritizeNModal()}>Close</button>
            </div>
        </div>
    )

    const bodyCustomers = (
        <div className={styles.modal} id="pdf-export">
            <div align="right">
                {/*                 <DocuPDF titulo={"Detalles de Gastos"} idDiv="pdf-export" orientacion="con que exista este campo la hoja estará horizontal" />
*/}                <button className="btn btn-outline-danger mx-2" onClick={() => openCloseCustomerModal()}>Close</button>
            </div>
            <div className='container-fluid'>
                <div className='row d-flex'>
                    <div className='col-3'>
                        <div className="step-label">Campaign's Customer List</div>
                    </div>
                    <div className='row d-flex'>

                    </div>
                </div>
                <br />
                {customersIdList && customersIdList.length > 0 ?
                    <>
                        <div className='row d-flex'>
                            <div className='col-4'>
                                <div className="step-label">Total Customers: {customersIdList.length}</div>
                            </div>
                            <div className='col d-flex justify-content-center'> <button className="nodrag btn btn-primary text-dark"><CSVLink data={customersIdList.map((customer) => {
                                const data = {};
                                selectedColumns.forEach((col) => {
                                    data[col] = customer[col] || "";
                                });
                                return data;
                            })} headers={selectedColumns.map((col) => ({ label: col, key: col }))} style={{ textDecoration: "none", width: "100%", color: "black" }}>
                                Export to CSV
                            </CSVLink></button></div>
                        </div>
                        <div className="table-responsive" style={{ overflowX: 'unset', height: "300px", overflowY: 'auto', width: '90%', justifyContent: 'center', margin: '10px' }}>
                            <table className="table table-hover table-sm align-middle" id={`table-${props.id}`}>
                                <thead className="table-light">
                                    <tr>
                                        {customersIdList.map((customer, index) => {
                                            let columnTable = Object.keys(customer);
                                            let rowValues = [];

                                            for (let row in columnTable) {
                                                rowValues.push(<th scope="col" style={{ justifyContent: 'center', alignItems: 'center' }}>{`${columnTable[row]}`}<br /></th>);
                                            }
                                            if (index == 0) {
                                                return rowValues
                                            }
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {customersIdList.map((customer, index) => {
                                        let columnTable = Object.keys(customer);
                                        let rowValues = [];

                                        for (let row in columnTable) {
                                            rowValues.push(<td>{`${customer[`${columnTable[row]}`]}`}</td>);
                                        }
                                        return <tr key={index}>{rowValues}</tr>;
                                    })}
                                </tbody>

                            </table>
                        </div>
                        <br />
                    </> :
                    <></>
                }
            </div>

            <div align="right">
                <button className="btn btn-outline-danger mx-2" onClick={() => openCloseCustomerModal()}>Close</button>
            </div>
        </div>
    )

    const bodyXGBOOST = (
        <div className={styles.modal} id="pdf-export">
            <div align="right">
                {/*                 <DocuPDF titulo={"Detalles de Gastos"} idDiv="pdf-export" orientacion="con que exista este campo la hoja estará horizontal" />
*/}                <button className="btn btn-outline-danger mx-2" onClick={() => openCloseXGBOOSTModal()}>Close</button>
            </div>
            <br/>
            <XGBOOSTREGRESSOR />
            <br/>
            <div align="right">
                <button className="btn btn-outline-danger mx-2" onClick={() => openCloseXGBOOSTModal()}>Close</button>
            </div>
        </div>
    )

    const bodySimpleLinear = (
        <div className={styles.modal} id="pdf-export">
            <div align="right">
                {/*                 <DocuPDF titulo={"Detalles de Gastos"} idDiv="pdf-export" orientacion="con que exista este campo la hoja estará horizontal" />
*/}                <button className="btn btn-outline-danger mx-2" onClick={() => openCloseSimpleLinearModal()}>Close</button>
            </div>
            <br/>
            <SimpleLinear />
            <br/>
            <div align="right">
                <button className="btn btn-outline-danger mx-2" onClick={() => openCloseSimpleLinearModal()}>Close</button>
            </div>
        </div>
    )

    const bodyPolinomial = (
        <div className={styles.modal} id="pdf-export">
            <div align="right">
                {/*                 <DocuPDF titulo={"Detalles de Gastos"} idDiv="pdf-export" orientacion="con que exista este campo la hoja estará horizontal" />
*/}                <button className="btn btn-outline-danger mx-2" onClick={() => openClosePolinomialModal()}>Close</button>
            </div>
            <br/>
            <PolinomialRegression />
            <br/>
            <div align="right">
                <button className="btn btn-outline-danger mx-2" onClick={() => openClosePolinomialModal()}>Close</button>
            </div>
        </div>
    )

    const saveChanges = async (e = false) => {
        if (!e) {
            e.preventDefault()
        }
        console.log("Going to backend to save changes")
        console.log("Nodes: ", props.nodes)
        console.log("Edges: ", props.edges)
        let response = await actions.useFetch(urlRegister, {
            //Compania: store.user.JRCompaniaAut[0],
            node: props.nodes,
            edge: props.edges
        }, "PUT");
        if (response.ok) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500
            })
            actions.setSavedWFTrue()
            return true
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error ocurred trying to save your work',
                showConfirmButton: false,
                timer: 1500
            })
        }

    }

    const makeQuery = async (e) => {
        e.preventDefault()
        saveChanges(e)
        console.log("Going to backend to make")
        let response = await actions.useFetch(urlQuery, {
            //Compania: store.user.JRCompaniaAut[0],
            node: props.nodes,
            edge: props.edges
        }, "POST");
        if (response.ok) {
            response = await response.json()
            props.setTable(response.table)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Query made',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error ocurred ',
                showConfirmButton: false,
                timer: 1500
            })
        }

    }

    const addFilter = async (label) => {
        //let tempArr = props.nodes
        let selectionOption = ''
        let selectionValue = ''
        switch (label) {
            case "Query":
                openCloseShowModal()
                return
                let rowTable = Object.keys(props.table[0]);
                console.log(rowTable)
                let { value: selection } = await Swal.fire({
                    title: 'Query: Where',
                    input: 'select',
                    inputOptions: {
                        'Columns': { ...rowTable },
                        //'icecream': 'Ice cream'
                    },
                    inputPlaceholder: 'Select a Column',
                    showCancelButton: true
                })
                if (selection) {
                    selectionOption = rowTable[selection]
                    selectionValue = rowTable[selection]
                    Swal.fire(`You selected: ${rowTable[selection]}`)
                }
                break;
            case "Equal":
                let { value: title, isConfirmed } = await Swal.fire({
                    title: 'Equal to',
                    input: 'text',
                    inputLabel: 'Equal to',
                    inputPlaceholder: 'Write the string to compare',
                    showDenyButton: true,
                    confirmButtonText: 'Add'
                })
                if (isConfirmed) {
                    if (title) {
                        //Swal.fire(`Entered Title: ${title}`)
                        //here goes some logic to fetch to API
                        selectionOption = " = " + title
                        selectionValue = title
                    } else {
                        Swal.fire({
                            title: 'You must enter a value',
                            icon: "warning",
                            showDenyButton: true
                        })
                        return
                    }
                }
                break;
            case ">":
                let { value: title2, isConfirmed: isConfirmed2 } = await Swal.fire({
                    title: 'Greater than',
                    input: 'text',
                    inputLabel: 'Greater than',
                    inputPlaceholder: 'Write the string to compare',
                    showDenyButton: true,
                    confirmButtonText: 'Add'
                })
                if (isConfirmed2) {
                    if (title2) {
                        //Swal.fire(`Entered Title: ${title}`)
                        //here goes some logic to fetch to API
                        selectionOption = " " + title2
                        selectionValue = title2
                    } else {
                        Swal.fire({
                            title: 'You must enter a value',
                            icon: "warning",
                            showDenyButton: true
                        })
                        return
                    }
                }
                break;
            case ">=":
                let { value: title3, isConfirmed: isConfirmed3 } = await Swal.fire({
                    title: 'Greater or Equal than',
                    input: 'text',
                    inputLabel: 'Greater or Equal than',
                    inputPlaceholder: 'Write the string to compare',
                    showDenyButton: true,
                    confirmButtonText: 'Add'
                })
                if (isConfirmed3) {
                    if (title3) {
                        //Swal.fire(`Entered Title: ${title}`)
                        //here goes some logic to fetch to API
                        selectionOption = " " + title3
                        selectionValue = title3
                    } else {
                        Swal.fire({
                            title: 'You must enter a value',
                            icon: "warning",
                            showDenyButton: true
                        })
                        return
                    }
                }
                break;
            case "<":
                let { value: title4, isConfirmed: isConfirmed4 } = await Swal.fire({
                    title: 'Less than',
                    input: 'text',
                    inputLabel: 'Less than',
                    inputPlaceholder: 'Write the string to compare',
                    showDenyButton: true,
                    confirmButtonText: 'Add'
                })
                if (isConfirmed4) {
                    if (title4) {
                        //Swal.fire(`Entered Title: ${title}`)
                        //here goes some logic to fetch to API
                        selectionOption = " " + title4
                        selectionValue = title4
                    } else {
                        Swal.fire({
                            title: 'You must enter a value',
                            icon: "warning",
                            showDenyButton: true
                        })
                        return
                    }
                }
                break;
            case "<=":
                let { value: title5, isConfirmed: isConfirmed5 } = await Swal.fire({
                    title: 'Less or Equal than',
                    input: 'text',
                    inputLabel: 'Less or Equal than',
                    inputPlaceholder: 'Write the string to compare',
                    showDenyButton: true,
                    confirmButtonText: 'Add'
                })
                if (isConfirmed5) {
                    if (title5) {
                        //Swal.fire(`Entered Title: ${title}`)
                        //here goes some logic to fetch to API
                        selectionOption = " " + title5
                        selectionValue = title5
                    } else {
                        Swal.fire({
                            title: 'You must enter a value',
                            icon: "warning",
                            showDenyButton: true
                        })
                        return
                    }
                }
                break;
            case "AND":
                selectionOption = ""
                selectionValue = "AND"
                props.setNodes([...props.nodes, {
                    id: props.nodes[props.nodes.length - 1].id + 1,
                    /*  type: 'output', */
                    data: { label: label + " " + selectionOption, campaign_id: props.campaignid },
                    position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
                    type: 'customNode',
                    campaign_id: props.campaignid,
                    query_text: label, //remember add this field in backend
                    query_value: selectionValue, //remember add this field in backend
                    query_table: "none"
                }])
                return;
            case "OR":
                selectionOption = ""
                selectionValue = "OR"
                props.setNodes([...props.nodes, {
                    id: props.nodes[props.nodes.length - 1].id + 1,
                    /*  type: 'output', */
                    data: { label: label + " " + selectionOption, campaign_id: props.campaignid },
                    position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
                    type: 'customOr',
                    campaign_id: props.campaignid,
                    query_text: label, //remember add this field in backend
                    query_value: selectionValue, //remember add this field in backend
                    query_table: "none"
                }])
                return;
            case "NOTE":
                selectionOption = ""
                selectionValue = "NOTE"
                props.setNodes([...props.nodes, {
                    id: props.nodes[props.nodes.length - 1].id + 1,
                    /*  type: 'output', */
                    data: { label: "Note: " + selectionOption, campaign_id: props.campaignid },
                    position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
                    type: 'customNote',
                    campaign_id: props.campaignid,
                    query_text: label, //remember add this field in backend
                    query_value: selectionValue, //remember add this field in backend
                    query_table: "none"
                }])
                return;
            case "PRIORITIZE":
                openClosePrioritizeModal()
                return
                break;
            case "PRIORITIZEN":
                let arrNodes = [
                    ...props.nodes,
                    {
                        id: props.nodes[props.nodes.length - 1].id + 1,
                        data: { label: "Prioritize Attributes: ", campaign_id: props.campaignid },
                        type: 'customPrioritizeN',
                        position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
                        campaign_id: props.campaignid,
                        query_option: "=", //remember add this field in backend
                        query_option_value: "", //remember add this field in backend
                        front_new: false, //this field only works in front end to decide if show or not new options
                        query_table: "none"
                    }
                ]
                let responseP = await actions.useFetch(urlRegister, {
                    //Compania: store.user.JRCompaniaAut[0],
                    node: arrNodes,
                    edge: props.edges
                }, "PUT");
                if (responseP.ok) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Your work has been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error ocurred trying to save your work',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                props.setRefresh(!props.refresh)

                return
            case "CUSTOMERS":
                let response = await actions.useFetch(urlGetCampaign + props.campaignid, {
                    //Compania: store.user.JRCompaniaAut[0],
                    campaign_id: parseInt(props.campaignid)
                }, "GET");
                if (response.ok) {
                    response = await response.json()
                    console.log("\nCustomers id: ", response.table.customer_id)
                    let tempArrId = response.table.customer_id.map((item, index) => {
                        return { id: item }
                    })
                    setCustomersIdList(tempArrId)
                }
                openCloseCustomerModal()
                return
                break;
            case "OUTPUT":
                let arrNodesOuput = [
                    ...props.nodes,
                    {
                        id: props.nodes[props.nodes.length - 1].id + 1,
                        data: { label: "Output Node: ", campaign_id: props.campaignid },
                        type: 'customNodeOutput',
                        position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
                        campaign_id: props.campaignid,
                        query_text: label, //remember add this field in backend
                        query_value: "AND", //remember add this field in backend
                        query_table: "none",
                        front_new: false //this field only works in front end to decide if show or not new options
                        
                    }
                ]
                let responseOutput = await actions.useFetch(urlRegister, {
                    //Compania: store.user.JRCompaniaAut[0],
                    node: arrNodesOuput,
                    edge: props.edges
                }, "PUT");
                if (responseOutput.ok) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Your work has been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error ocurred trying to save your work',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                props.setRefresh(!props.refresh)

                return
            case "COMMUNICATION":
                let arrNodesCom = [
                    ...props.nodes,
                    {
                        id: props.nodes[props.nodes.length - 1].id + 1,
                        data: { label: "Communication Node: ", campaign_id: props.campaignid },
                        type: 'customNodeComm',
                        position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
                        campaign_id: props.campaignid,
                        query_text: label, //remember add this field in backend
                        query_value: "AND", //remember add this field in backend
                        query_table: "none",
                        front_new: false //this field only works in front end to decide if show or not new options
                        
                    }
                ]
                let responseCom = await actions.useFetch(urlRegister, {
                    //Compania: store.user.JRCompaniaAut[0],
                    node: arrNodesCom,
                    edge: props.edges
                }, "PUT");
                if (responseCom.ok) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Your work has been saved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error ocurred trying to save your work',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                props.setRefresh(!props.refresh)

                return
                
            default:
                break;
        }

        let newNode = {
            id: props.nodes[props.nodes.length - 1].id + 1,
            /*  type: 'output', */
            data: { label: label + " " + selectionOption },
            position: { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y },
            type: '',
            campaign_id: props.campaignid,
            query_text: label, //remember add this field in backend
            query_value: selectionValue, //remember add this field in backend
        }
        //tempArr.push(newNode)
        props.setNodes([...props.nodes, newNode])
    }

    useEffect(() => {
        props.setRefresh(!props.refresh)
        const data = async () => {
            let response = await actions.useFetch(urlAllTables, "", "GET")
            if (response.ok) {
                response = await response.json()
                setAllTablesDB(response.tables)
            } else {
                Swal.fire({
                    title: 'Error loading tables names',
                    icon: "error",
                    showDenyButton: true
                })
            }
        }
        const dataFetch = async () => {
            let response = await actions.useFetch(urlGet, "", "GET");
            if (response.ok) {
                response = await response.json()
                setCampaigns(response)
                setBoard({
                    counter: response.length,
                    columns: [{
                        id: 1,
                        title: "CAMPAIGNS",
                        cards: response
                    },
                    {
                        id: 2,
                        title: "PRIORITIZE ORDER",
                        cards: []
                    }]
                })
            }
        }

        data()
        dataFetch();
    }, [])

    const handleFileUploadCSV = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            alert('Please select a CSV file.');
        }
    };

    const handleSubmitCSV = async () => {
        if (selectedFile) {
            setLoadingPlot(true)
            const formData = new FormData();
            formData.append('file', selectedFile);
            const BASE_URL2 = process.env.BASE_URL2;
            let response = await fetch(BASE_URL2 + '/upload-csv-xgboostregressor', {
                method: 'POST',
                body: formData,
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
                setLoadingPlot(false)
            }

            const data = await response.json();

            // Handle the response data
            const plotImageData = data.data.plot;
            const residualsImageData = data.data.residuals;
            const message = data.message;

            // Log the message
            console.log(message);

            // Crear elementos <img> para las imágenes
            const plotImg = new Image();
            //plotImg.src = plotImageUrl;
            plotImg.src = `data:image/png;base64, ${plotImageData}`

            const residualsImg = new Image();
            //residualsImg.src = residualsImageUrl;
            residualsImg.src = `data:image/png;base64, ${residualsImageData}`

            // Agregar las imágenes al DOM
            //document.body.appendChild(plotImg);
            //document.body.appendChild(residualsImg);

            setPlotImage(plotImageData)
            setResidualImage(residualsImageData)
            setLoadingPlot(false)
            setXGBoostData({
                acurracy: data.acurracy,
                standarDeviation: data.stdDeviation
            })
            openCloseXGBOOSTModal()
        } else {
            alert('Please select a CSV file.');
        }
    };


    useEffect(() => {
        console.log(provitionalNode)
        console.log("props.nodes: ", props.nodes)
    }, [provitionalNode])

    useEffect(() => { console.log("nodes changed") }, [props.nodes])

    return (<>
        <nav className="row flex-column side-menu2">
            {!props.hide ? <>
                <Link to={"/iq-campaign"} className="d-flex lateral-button2" style={{ justifyContent: "center", alignItems: "center" }} type="button" href="#">↩️ RETURN TO CAMPAIGN LIST</Link>
                <button className={store.savedWF?"lateral-button2":"lateral-button2 btn btn-danger danger-color"} onClick={(e) => { saveChanges(e) }} type="button" href="#" title="Save Changes!">Save Changes</button>
            </> : <>
                <Link to={"/iq-campaign"} className="d-flex lateral-button2" style={{ justifyContent: "center", alignItems: "center" }} type="button" href="#">↩️</Link>
                <button className={store.savedWF?"lateral-button2":"lateral-button2 btn btn-danger danger-color"} onClick={(e) => { saveChanges(e) }} type="button" href="#" title="Save Changes!">💾</button>
            </>}

            {/* <button className="lateral-button" onClick={(e) => { makeQuery(e) }} type="button" href="#">Make Query</button> */}
            <br />
            {!props.hide ? <h4>NODE MENU</h4> : <h4>-</h4>}

            <br />
            <button className="lateral-button2" onClick={(e) => { addFilter("Query") }} type="button" href="#" title="SELECT node">{!props.hide ? <>Select</> : <>◉</>}</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("AND") }} type="button" href="#" title="AND node">{!props.hide ? <>And</> : <>&</>}</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("OR") }} type="button" href="#" title="OR node">{!props.hide ? <>Or</> : <>|</>}</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("NOTE") }} type="button" href="#" title="add a Note">{!props.hide ? <>Note</> : <>📝</>}</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("PRIORITIZEN") }} type="button" href="#" title="PRIORITIZE node">{!props.hide ? <>Prioritize</> : <>❗</>}</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("PRIORITIZE") }} type="button" href="#" title="PRIORITIZE campaign node">{!props.hide ? <>Link Campaign</> : <>❗🔔</>}</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("CUSTOMERS") }} type="button" href="#" title="Watch campaign's customer list">{!props.hide ? <>Campaign's customers</> : <>👁️‍🗨️</>}</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("OUTPUT") }} type="button" href="#" title="Output Node">{!props.hide ? <>Output Node</> : <>📤</>}</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("COMMUNICATION") }} type="button" href="#" title="Communication Node">{!props.hide ? <>Communitacion Node</> : <>📧</>}</button>
            <br />
            {!props.hide ? <h4>ANALYTICS MENU</h4> : <h4>-</h4>}
            <br />

            <button className="lateral-button2" onClick={openCloseSimpleLinearModal}>{!props.hide ? <>Simple Linear Regression</> : <>⁄</>}</button>
            <button className="lateral-button2" onClick={openClosePolinomialModal}>{!props.hide ? <>Polinomial Regression</> : <>📉</>}</button>
            <button className="lateral-button2" onClick={openCloseXGBOOSTModal}>{!props.hide ? <>XG Boost Regressor</> : <>📈</>}</button>


        </nav>
        <Modal open={showModal} onClose={openCloseShowModal}>
            {bodyShow}
        </Modal>
        <Modal open={showPrioritize} onClose={openClosePrioritizeModal}>
            {bodyPrioritize}
        </Modal>
        <Modal open={showPrioritizeN} onClose={openClosePrioritizeNModal}>
            {bodyPrioritizeN}
        </Modal>
        <Modal open={showCustomerModal} onClose={openCloseCustomerModal}>
            {bodyCustomers}
        </Modal>
        <Modal open={showXGBOOST} onClose={openCloseXGBOOSTModal}>
            {bodyXGBOOST}
        </Modal>
        <Modal open={showSimpleLinear} onClose={openCloseSimpleLinearModal}>
            {bodySimpleLinear}
        </Modal>
        <Modal open={showPolinomial} onClose={openClosePolinomialModal}>
            {bodyPolinomial}
        </Modal>
    </>
    );
}

export default SideMenu3