import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../store/appContext';
import { Handle } from 'reactflow';
import Swal from 'sweetalert2';
//import Excel from '../../component/excelExport.jsx';
import { CSVLink } from "react-csv";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MyPlot from '../../components/plotlyReact.jsx';
import NodeCalendar from './nodeCalendar.jsx';

export default (props) => {
    const { store, actions } = useContext(Context)
    const [tableNode, setTableNode] = useState([])
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [querySQL, setQuerySQL] = useState("")
    const [showQuerySQL, setShowQuerySQL] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [tableid, setTableid] = useState("")
    const [calendarState, setCalendarState] = useState({})
    const [showModalBody, setShowModalBody] = useState(false)
    const [tableML, setTableML] = useState([])
    const [tableCluster, setTableCluster] = useState([])
    const [elbow, setElbow] = useState({ x_axis: false })
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [numberCluster, setNumberCluster] = useState(0)
    const urlQuery = "/campaignQueryFactV3"
    const urlQuery2 = "/customersIDS"
    const urlQuery3 = "/customersIDS_save"
    const urlNodeCalendar = "/campaignNodeCalendar"
    const urlElbow = "/elbowMethod"
    const urlTrainCluster = "/trainCluster"
    const urlSaveCustomer = "/saveCustomersV3"

    useEffect(() => {
        setTableNode([])
    }, [])

    useEffect(() => {
        if (props.selected) {
            console.log("I've been selected!")
            //setTableNode(props.table)
        };
    }, [props.selected]);

    const handleClick = async (event) => {

        event.preventDefault();
        event.stopPropagation();
        console.log('id: ', props.id, " campaign_id: ", props.data.campaign_id, props);
        setTableid(props.id)
        let obj = {
            //Compania: store.user.JRCompaniaAut[0],
            node_id: props.id,
            campaign_id: props.data.campaign_id
        }
        if (!store.savedWF) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Need save changes first',
                showConfirmButton: false,
            })
            return
        }
        setLoading(true)
        console.log("Going to backend to make")
        let response = await actions.useFetch(urlQuery, obj, "POST");
        if (response.ok) {
            setLoading(false)
            response = await response.json()
            //props.setTable(response.table)
            console.log(response)
            setTableNode(response.table)
            let tempArr = []
            response.table.map((item, index) => {
                if (index == 0) {
                    let columnTable = Object.keys(item);
                    let rowValues = [];
                    for (let row in columnTable) {
                        rowValues.push(columnTable[row]);
                    }

                    console.log(rowValues)
                    tempArr = rowValues.slice()
                }
            })
            console.log(tempArr)
            setSelectedColumns(tempArr)
            setQuerySQL(response.query)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Query made',
                showConfirmButton: false,
                timer: 3500
            })
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

    const handleClick2 = async (event) => {

        event.preventDefault();
        event.stopPropagation();
        console.log('id: ', props.id, " campaign_id: ", props.data.campaign_id, props);
        setTableid(props.id)
        let obj = {
            //Compania: store.user.JRCompaniaAut[0],
            node_id: props.id,
            campaign_id: props.data.campaign_id,
            id: tableNode
        }
        if (!store.savedWF) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Need save changes first',
                showConfirmButton: false,
            })
            return
        }
        setLoading(true)
        console.log("Going to backend to make")
        let response = await actions.useFetch(urlQuery3, obj, "POST");
        if (response.ok) {
            setLoading(false)
            response = await response.json()
            //props.setTable(response.table)
            console.log(response)
            //setTableNode(response.table)
            let tempArr = []
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Customers Saved',
                showConfirmButton: false,
                timer: 3500
            })
        } else {
            setLoading(false)
            response = await response.json()
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Setup calendar first',
                showConfirmButton: false,
                timer: 1500
            })
        }


    };

    const handleCalendar = async (event) => {

        event.preventDefault();
        event.stopPropagation();
        console.log('id: ', props.id, " campaign_id: ", props.data.campaign_id, props);
        setTableid(props.id)
        let obj = {
            //Compania: store.user.JRCompaniaAut[0],
            node_id: props.id,
            campaign_id: props.data.campaign_id
        }
        if (!store.savedWF) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Need save changes first',
                showConfirmButton: false,
            })
            return
        }
        setLoading(true)
        console.log("Going to backend to make")
        let response = await actions.useFetch(urlNodeCalendar, obj, "PUT");
        if (response.ok) {
            setLoading(false)
            response = await response.json()
            //props.setTable(response.table)
            console.log(response)
            //setTableNode(response.table)
            setCalendarState(response.calendar)
            let tempArr = []
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Query made',
                showConfirmButton: false,
                timer: 3500
            })
            setShowModalBody(!showModalBody)
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

    const saveCustomers = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('id: ', props.id, " campaign_id: ", props.data.campaign_id, props);
        setTableid(props.id)
        let obj = {
            //Compania: store.user.JRCompaniaAut[0],
            node_id: props.id,
            campaign_id: props.data.campaign_id,
            customers_id: tableNode.map((item, index) => { return item.id })
        }
        console.log("customers_id list : ", obj.customers_id)
        console.log("Going to backend to make")
        setLoading(true)
        let response = await actions.useFetch(urlSaveCustomer, obj, "PUT");
        //console.log("table: ", props.data.table)
        if (response.ok) {
            setLoading(false)
            response = await response.json()
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Customers Saved in Campaign',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            setLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error saving customers id',
                showConfirmButton: false,
                timer: 1500
            })
        }
    };

    const handleMouseDown = (event) => {
        console.log('Stop propagation.');
        event.stopPropagation();
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

    const handleColumnToggle = (columnName) => {
        if (selectedColumns.includes(columnName)) {
            setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
        } else {
            setSelectedColumns([...selectedColumns, columnName]);
        }
    };
    /* 
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
    
        const csvHeaders = selectedColumns.map((col) => ({ label: col, key: col })); */

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
        //console.log(selectedColumns)
        /* if (selectedColumns.length == 0) {
            alert("You must select columns first in order to make a K-Mean Cluster Algorithm")
            return
        }
        reducedTable(selectedColumns, tableNode) */
        setShowModalBody(!showModalBody)
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
                <NodeCalendar campaignD={calendarState} />

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
                borderColor: props.selected ? 'green' : 'red',
                borderWidth: '4px',
                backgroundColor: props.selected ? '#E8E8E8' : 'white',
                color: 'black',
                maxHeight: !showQuerySQL ? '400px' : '100%',
                overflowY: showTable ? 'auto' : 'unset',
                borderImage: "linear-gradient(to right, grey 25%, blue 25%, blue 50%,red 50%, red 75%, teal 75%) 5"
                //maxWidth: showTable ? '100px' : '100%'
            }}
        >
            <Handle type="target" position="left" style={{ fontSize: "30px" }}></Handle>
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
                {!tableNode || tableNode.length == 0 ? <button className="nodrag btn btn-primary text-dark" onClick={handleClick} type='button'>
                    Load ids
                </button> :
                    <>
                        <button className="nodrag btn btn-primary text-dark" onClick={handleClick} type='button'>
                            Reload ids
                        </button>


                    </>
                }

                {showModalBody ? <> <button className="nodrag btn btn-primary text-dark" onClick={(e) => { setShowModalBody(!showModalBody) }} type='button'>
                    Hide Calendar
                </button></> : <button className="nodrag btn btn-primary text-dark" onClick={(e) => { handleCalendar(e) }} type='button'>
                    Show Calendar
                </button>
                }
                {!tableNode || tableNode.length == 0 ? <></> : <>
                    {<button className="nodrag btn btn-primary text-dark" onClick={handleClick2} type='button'>
                        Link Customers to this Node
                    </button>} Rows: {tableNode.length}</>
                }
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
            {tableNode && tableNode.length > 0 && showTable ?
                <>

                    Preview (max Preview: 10 customers)
                    <div className="table-responsive" style={{ overflowX: 'unset' }}>
                        <table className="table table-hover table-sm align-middle" id={`node-${props.id}`}>
                            <thead className="table-light">
                                <tr>
                                    {tableNode.map((customer, index) => {
                                        let columnTable = Object.keys(customer);
                                        let rowValues = [];

                                        for (let row in columnTable) {
                                            //handleColumnToggle(columnTable[row])
                                            rowValues.push(<th scope="col" style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}>{`${columnTable[row]}`}<br /><input
                                                type="checkbox"
                                                checked={selectedColumns.includes(columnTable[row])}
                                                onChange={() => handleColumnToggle(columnTable[row])}
                                            /></th>);
                                        }
                                        if (index == 0) {
                                            return rowValues
                                        }
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {tableNode.map((customer, index) => {
                                    let columnTable = Object.keys(customer);
                                    let rowValues = [];
                                    if (index < 10) {
                                        for (let row in columnTable) {
                                            rowValues.push(<td>{`${customer[`${columnTable[row]}`]}`}</td>);
                                        }
                                        return <tr key={index}>{rowValues}</tr>;
                                    }
                                })}
                            </tbody>

                        </table>
                    </div>
                    <br />

                </> :
                <></>
            }
            {/* <Handle type="source" position="right" /> */}
        </div>
        <Modal open={showModalBody} onClose={openCloseModalBody}>
            {showModal()}
        </Modal>
    </>
    );
};
