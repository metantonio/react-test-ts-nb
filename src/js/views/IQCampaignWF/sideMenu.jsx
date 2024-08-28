import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../store/appContext';
import { Link } from 'react-router-dom';
//import { Nav } from 'react-bootstrap';
import "./sideMenu.css"
import Swal from 'sweetalert2';

const SideMenu = (props) => {
    const { store, actions } = useContext(Context)
    const urlRegister = "/campaignNode"
    const urlQuery = "/campaignQuery"

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

    const saveChanges = async (e) => {
        e.preventDefault()
        console.log("Going to backend to save changes")
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
            case "Where":
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
                let { value: title2, isConfirmed:isConfirmed2 } = await Swal.fire({
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
                let { value: title3, isConfirmed:isConfirmed3 } = await Swal.fire({
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
                let { value: title4, isConfirmed:isConfirmed4 } = await Swal.fire({
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
                let { value: title5, isConfirmed:isConfirmed5 } = await Swal.fire({
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

    useEffect(()=>{
        props.setRefresh(!props.refresh)
    }, [])

    return (
        <nav className="row flex-column side-menu">
            <Link to={"/iq-campaign"} className="d-flex lateral-button" style={{ justifyContent: "center", alignItems: "center" }} type="button" href="#">Go Back</Link>
            <button className="lateral-button" onClick={(e) => { saveChanges(e) }} type="button" href="#">Save Changes</button>
            <button className="lateral-button" onClick={(e) => { makeQuery(e) }} type="button" href="#">Make Query</button>
            <br />
            <h4>Side Menu Filters</h4>
            <br />
            <button className="lateral-button" onClick={(e) => { addFilter("Where") }} type="button" href="#">Where</button>
            <button className="lateral-button" onClick={(e) => { addFilter("Equal") }} type="button" href="#">Equal</button>
            <button className="lateral-button" onClick={(e) => { addFilter(">") }} type="button" href="#">Greater than</button>
            <button className="lateral-button" onClick={(e) => { addFilter(">=") }} type="button" href="#">Greater or Equal than</button>
            <button className="lateral-button" onClick={(e) => { addFilter("<") }} type="button" href="#">Less than</button>
            <button className="lateral-button" onClick={(e) => { addFilter("<=") }} type="button" href="#">Less or Equal than</button>
            {/* <button className="lateral-button" onClick={(e) => { addFilter("Or") }} type="button" href="#">Or</button> */}
        </nav>
    );
}

export default SideMenu