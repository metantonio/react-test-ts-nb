import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../store/appContext';
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Button } from "@material-ui/core";
//import { Nav } from 'react-bootstrap';
import "./sideMenu2.css"
import Swal from 'sweetalert2';

const SideMenu2 = (props) => {
    const { store, actions } = useContext(Context)
    const [showModal, setShowModal] = useState(false);
    const [provitionalNode, setProvitionalNode] = useState({})
    const urlRegister = "/campaignNode2"
    const urlQuery = "/campaignQuery2"
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
    const bodyShow = (
        <div className={styles.modal} id="pdf-export">
            <div align="right">
                {/*                 <DocuPDF titulo={"Detalles de Gastos"} idDiv="pdf-export" orientacion="con que exista este campo la hoja estará horizontal" />
*/}                <button className="btn btn-outline-success mx-2" onClick={() => openCloseShowModal()}>Close</button>
            </div>
            <h4 style={{ color: "black" }}>Preview Customer Table with 10 Customers</h4>
            <div id="visual-comprobante" style={{ maxHeight: '200px', overflow: 'auto', margin: '10px'}}>
                {props.table && props.table.length > 0 ?
                    <div className="table-responsive" style={{overflowX: 'unset'}}>
                        <table className="table table-hover table-sm align-middle">
                        <thead className="table-light">
                            <tr>
                                {props.table.map((customer, index) => {
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
                            {props.table.map((customer, index) => {
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
            <div className='container-fluid'>
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
                                        let newNode = {
                                            id: props.nodes.length > 0 ? props.nodes[props.nodes.length - 1].id + 1 : 1,
                                            data: { label: "Column: " + " " + selectionOption },
                                            position: props.nodes.length > 0 ? { x: 60 + props.nodes[props.nodes.length - 1].position.x, y: 50 + props.nodes[props.nodes.length - 1].position.y } : { x: 0, y: 0 },
                                            type: 'input',
                                            campaign_id: props.campaignid,
                                            query_text: 'Where', //remember add this field in backend
                                            query_value: selectionValue, //remember add this field in backend
                                            front_new: true, //this field only works in front end to decide if show or not new options
                                        }

                                        setProvitionalNode(newNode)
                                        Swal.fire(`You selected: ${rowTable[selection]}`)
                                    }
                                }}>
                                Select Column
                            </button></>
                    </div>
                    <div className='col-6 text-dark justify-content-center align-self-center'>{provitionalNode.query_value ? <>Selected Column: {provitionalNode.query_value}</> : ""}</div>
                </div>
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
                                    let rowTable = ["=","like","ilike", ">", ">=", "<", "<="];
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
                                            type: 'input',
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
                        <div className='col-6 text-dark justify-content-center align-self-center'>{provitionalNode.query_option ? <>Selected Option: {provitionalNode.query_option_value}</> : ""}</div>

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
                            <input
                                className='textd-dark'
                                placeholder='write text here, for dates format is: YYYY-MM-DD'
                                onChange={(e) => {
                                    setProvitionalNode({ ...provitionalNode, text: e.target.value, data: { label: provitionalNode.data.label }, })
                                }}></input>
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

    const saveChanges = async (e) => {
        e.preventDefault()
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
                }])
                return;
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
    }, [])

    useEffect(() => {
        console.log(provitionalNode)
        console.log("props.nodes: ", props.nodes)
    }, [provitionalNode])

    useEffect(() => { console.log("nodes changed") }, [props.nodes])

    return (<>
        <nav className="row flex-column side-menu2">
            <Link to={"/iq-campaign"} className="d-flex lateral-button" style={{ justifyContent: "center", alignItems: "center" }} type="button" href="#">⬅️ RETURN TO CAMPAIGN LIST</Link>
            <button className="lateral-button2" onClick={(e) => { saveChanges(e) }} type="button" href="#">Save Changes</button>
            {/* <button className="lateral-button" onClick={(e) => { makeQuery(e) }} type="button" href="#">Make Query</button> */}
            <br />
            <h4>QUERY MENU</h4>
            <br />
            <button className="lateral-button2" onClick={(e) => { addFilter("Query") }} type="button" href="#">Select</button>
            <button className="lateral-button2" onClick={(e) => { addFilter("AND") }} type="button" href="#">And</button>
            {/* <button className="lateral-button" onClick={(e) => { addFilter("Equal") }} type="button" href="#">Equal</button>
            <button className="lateral-button" onClick={(e) => { addFilter(">") }} type="button" href="#">Greater than</button>
            <button className="lateral-button" onClick={(e) => { addFilter(">=") }} type="button" href="#">Greater or Equal than</button>
            <button className="lateral-button" onClick={(e) => { addFilter("<") }} type="button" href="#">Less than</button>
            <button className="lateral-button" onClick={(e) => { addFilter("<=") }} type="button" href="#">Less or Equal than</button> */}
            {/* <button className="lateral-button" onClick={(e) => { addFilter("Or") }} type="button" href="#">Or</button> */}
        </nav>
        <Modal open={showModal} onClose={openCloseShowModal}>
            {bodyShow}
        </Modal>
    </>
    );
}

export default SideMenu2