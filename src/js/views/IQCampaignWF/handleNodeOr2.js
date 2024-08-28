import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../store/appContext';
import { Handle } from 'reactflow';
import Swal from 'sweetalert2';
//import Excel from '../../component/excelExport.jsx';
import { CSVLink } from "react-csv";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MyPlot from '../../components/plotlyReact.jsx';

export default (props) => {
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
    //const urlQuery = "/campaignQuery4V3"
    const urlQuery = "/campaignQueryFactV3"
    const urlElbow = "/elbowMethod"
    const urlTrainCluster = "/trainCluster"
    const urlSaveCustomer = "/saveCustomersV3"

    useEffect(() => {
        setTableNode([])
    }, [])

    useEffect(() => {
        if (props.selected) console.log("I've been selected!");
    }, [props.selected]);

    const handleClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('id: ', props.id, " campaign_id: ", props.data.campaign_id, props);
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
        setTableid(props.id)
        let obj = {
            //Compania: store.user.JRCompaniaAut[0],
            node_id: props.id,
            campaign_id: props.data.campaign_id
        }

        console.log("Going to backend to make")
        let response = await actions.useFetch(urlQuery, obj, "POST");
        if (response.ok) {
            setLoading(false)
            response = await response.json()
            //props.setTable(response.table)
            console.log(response)
            setTableNode(response.table)
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
        //console.log(selectedColumns)
        if (selectedColumns.length == 0) {
            alert("You must select columns first in order to make a K-Mean Cluster Algorithm")
            return
        }
        reducedTable(selectedColumns, tableNode)
        setShowModalBody(!showModalBody)
    }

    const useStyles = makeStyles((theme) => ({
        modal: {
            position: "relative",
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
            transform: "translate(-50%, -50%)",
            overflowY: "auto",
            overflowX: "auto",
            zIndex: 9999,
            padding: "0px",
            color: "black"
            /*  zIndex: "9999 !important", */
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

    const elbowMethod = async () => {
        setLoading(true)
        console.log("elbow method")
        let response = await actions.useFetch(urlElbow, {
            //Compania: store.user.JRCompaniaAut[0],
            table: tableML,
        }, "POST");

        if (response.ok) {
            response = await response.json()
            console.log("response: ", response)
            setLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.message,
                showConfirmButton: false,
                timer: 1500
            })
            setElbow(response)

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
    }

    const clusterSelection = async () => {
        console.log("to the backend k-mean")
        let selectionOption = ''
        let selectionValue = ''
        //let rowTable = Object.keys(props.table[0]);
        let rowTable = elbow.wcss['x_axis'];
        //console.log(rowTable)
        let { value: selection } = await Swal.fire({
            title: 'Number of Clusters',
            input: 'select',
            inputOptions: {
                'Columns': { ...rowTable },
                //'icecream': 'Ice cream'
            },
            inputPlaceholder: 'Select a Number of Clusters',
            showCancelButton: true
        })
        if (selection) {
            selectionOption = rowTable[selection]
            selectionValue = rowTable[selection]
            console.log('selectionvalue:', selectionValue)
            let newObj = {
                n_cluster: selectionValue
            }
            setNumberCluster(selectionValue)
            Swal.fire(`You selected: ${rowTable[selection]}`)
        }

    }

    const trainModel = async () => {
        console.log("to backend to train model clustering")
        setLoading2(true)
        console.log("elbow method")
        let response = await actions.useFetch(urlTrainCluster, {
            //Compania: store.user.JRCompaniaAut[0],
            table: tableML,
            n_cluster: numberCluster,
            tableNode: tableNode
        }, "POST");

        if (response.ok) {
            response = await response.json()
            console.log("response: ", response)
            setLoading2(false)
            setTableCluster(response.table)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.message,
                showConfirmButton: false,
                timer: 1500
            })

        } else {
            setLoading2(false)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error ocurred ',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

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
                <div>In Development</div>
                {tableML && tableML.length > 0 ?
                    <>
                        {/* <div>
                        {Object.keys(tableNode[0]).map((column) => (
                            <label key={column}>
                                <input
                                    type="checkbox"
                                    checked={selectedColumns.includes(column)}
                                    onChange={() => handleColumnToggle(column)}
                                />
                                {column}
                            </label>
                        ))}
                    </div> */}
                        <div className="table-responsive" style={{ overflowX: 'unset', height: "300px", overflowY: 'auto', width: '90%', justifyContent: 'center', margin: '10px' }}>
                            <table className="table table-hover table-sm align-middle" id={`node-${props.id}`}>
                                <thead className="table-light">
                                    <tr>
                                        {tableML.map((customer, index) => {
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
                                    {tableML.map((customer, index) => {
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
                        <div className='container-fluid' style={{ overflowX: 'unset', overflowY: 'auto', width: '90%', justifyContent: 'center', margin: '10px' }}>
                            <div className='row d-flex'>
                                <div className='col-3'>
                                    <button type='button' className="btn btn-outline-success" onClick={(e) => { elbowMethod() }}>Elbow Method</button>
                                </div>
                                <div className='col-9'>
                                    {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                                        {/* <strong>Loading...</strong> */}
                                        <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        {elbow && elbow.x_axis != false ? <MyPlot data={elbow.wcss} xAxis="x_axis" yAxis="y_axis" text="WCSS vs. Number of Clusters" easymode={true} xAxisText="Number of Clusters" yAxisText="WCSS" /> : <></>}
                        {elbow && elbow.x_axis != false ? <>
                            <div className='container-fluid'>
                                <div className='row d-flex'>
                                    <div className='col-3'>
                                        <button type="button" className="btn btn-outline-success" onClick={(e) => { clusterSelection() }}>Select Number of Clusters</button>
                                    </div>
                                    <div className='col-9 d-flex justify-content-center align-self-center'>Number of Cluster Selected: {numberCluster}</div>
                                </div>
                            </div>
                            <br />
                            {numberCluster > 0 ? <>
                                <div className='container-fluid'>
                                    <div className='row d-flex'>
                                        <div className='col-3'>
                                            <button type="button" className="btn btn-outline-success" onClick={(e) => { trainModel() }}>Train model for selected clusters</button>
                                        </div>
                                        <div className='col-9 d-flex justify-content-center align-self-center'></div>
                                    </div>
                                </div>
                                <br></br>
                                <div className='col-9'>
                                    {loading2 && <div className="d-flex justify-content-center align-items-center" id="loading">
                                        {/* <strong>Loading...</strong> */}
                                        <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>}
                                </div>
                                <br></br>
                                {tableCluster && tableCluster.length > 0 ? <>
                                    <button className="nodrag btn btn-primary text-dark"><CSVLink data={exportData2} headers={csvHeaders} style={{ textDecoration: "none", width: "100%", color: "black" }}>
                                        Export to CSV
                                    </CSVLink></button>
                                    <div className="table-responsive" style={{ overflowX: 'unset', height: "300px", overflowY: 'auto', width: '90%', justifyContent: 'center', margin: '10px' }}>
                                        <table className="table table-hover table-sm align-middle" id={`node-${props.id}`}>
                                            <thead className="table-light">
                                                <tr>
                                                    {tableCluster.map((customer, index) => {
                                                        let columnTable = Object.keys(customer);
                                                        let rowValues = [];

                                                        for (let row in columnTable) {
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
                                                {tableCluster.map((customer, index) => {
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
                                </> : <></>}
                            </>
                                :
                                <></>}
                        </> : <></>}

                    </> :
                    <></>
                }
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
                borderColor: props.selected ? 'green' : 'blue',
                backgroundColor: props.selected ? '#E8E8E8' : 'white',
                color: 'black',
                maxHeight: !showQuerySQL ? '400px' : '100%',
                overflowY: 'auto'
            }}
        >
            <Handle type="target" position="top" />
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
                    Make Query
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
                </button> {/* <Excel idDiv={`node-${props.id}`} />  */}
                    <button className="nodrag btn btn-primary text-dark" onClick={saveCustomers}>Save Customers</button>
                    {
                        loading ?
                            <div className="d-flex justify-content-center align-items-center" id="loading">
                                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            : <></>
                    }
{/*                     <button className="nodrag btn btn-primary text-dark" style={{ margin: '5px' }} onClick={(e) => { setShowQuerySQL(!showQuerySQL) }} type='button'>{!showQuerySQL ? "Show SQL Query" : "Hide SQL Query"}</button>
 */}                     Rows: {tableNode.length}</>}

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
                        Hide Table
                    </button><button className="nodrag btn btn-primary text-dark" onClick={(e) => { openCloseModalBody() }} type='button'>
                            Clustering
                        </button><button className="nodrag btn btn-primary text-dark"><CSVLink data={exportData} headers={csvHeaders} style={{ textDecoration: "none", width: "100%", color: "black" }}>
                            Export to CSV
                        </CSVLink></button> </> : <button className="nodrag btn btn-primary text-dark" onClick={(e) => { setShowTable(!showTable) }} type='button'>
                        Show Table
                    </button>}
                </>}

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
            {showQuerySQL ?
                <>
                    {querySQL}
                </> :
                <></>
            }
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
            <Handle type="source" position="bottom" />
        </div>
        <Modal open={showModalBody} onClose={openCloseModalBody}>
            {showModal()}
        </Modal>
    </>
    );
};
