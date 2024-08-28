import React, { useState, useContext, useEffect, useRef } from 'react';
import { Context } from '../../store/appContext';
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Button } from "@material-ui/core";
import { CSVLink } from "react-csv";
import Swal from 'sweetalert2';
import "./createTable.css";

const CreateTable = () => {
    const { store, actions } = useContext(Context)
    const [selectedFile, setSelectedFile] = useState(null);
    const [plotImage, setPlotImage] = useState(null)
    const [plotResidualImage, setResidualImage] = useState(null)
    const [loadignPlot, setLoadingPlot] = useState(false)
    const [showXGBOOST, setShowXGBOOST] = useState(false)
    const [uri, setUri] = useState("")
    const [dbName, setDbName] = useState("")
    const [dbUser, setDbUser] = useState("")
    const [password, setPassword] = useState("");
    const [xgBoostData, setXGBoostData] = useState({})
    const [showPass, setShowPassword] = useState(true);
    const { isPasswordShown } = showPass;
    const urlML = '/temporal_table'
    const urlMLDB = '/temporal_table_db'
    const urlAddDB = '/add_db_mysql'
    const [srcDB, setSrcDB] = useState({ name: ".csv file", code: "csv" }) //if false it will upload a .csv
    const listSRC = [
        { name: ".csv file", code: "csv" },
        { name: "database", code: "db" }
    ]

    const openCloseXGBOOSTModal = () => {
        //console.log("\nprops: ", props)
        setShowXGBOOST(!showXGBOOST)
    }

    const handleFileUploadCSV = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            alert('Please select a CSV file.');
        }
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

    const handleAddDB = async (e) => {
        e.preventDefault();
        setLoadingPlot(true);

        let tempObj = {
            name: dbName,
            uri: uri,
            user: dbUser,
            password: password
        }

        let response = await actions.useFetch(urlAddDB, tempObj, "POST");

        if (response.ok) {
            response = await response.json()
            console.log("response: ", response)
            setLoadingPlot(false)            
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.message,
                showConfirmButton: false,
                timer: 2000
            })

        } else {
            response = await response.json()
            setLoadingPlot(false)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: response.message,
                showConfirmButton: false,
                timer: 1500
            })
        }


    }

    const handleSubmitCSV = async (e) => {
        e.preventDefault();
        if (selectedFile) {
            setLoadingPlot(true)
            let formData = new FormData(e.target);
            let dependent = formData.get("name")

            //let folds = formData.get("folds")

            let tempObj = {
                name: dependent,
                //folds: folds
            }
            let jsontempObj = JSON.stringify(tempObj);

            formData.append('file', selectedFile); //added file
            formData.append('data', jsontempObj) //tempObj data as json
            const BASE_URL2 = process.env.BASE_URL2;
            let urlRequest = srcDB.code === "csv" ? urlML : urlMLDB
            let response = await fetch(BASE_URL2 + urlRequest, {
                method: 'POST',
                body: formData,
            })
            if (!response.ok) {
                setLoadingPlot(false)
                response = await response.json()
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: response.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                throw new Error('Network response was not ok');
            }

            const data = await response.json();


            const message = data.message;

            // Log the message
            console.log(message);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: message,
                showConfirmButton: false,
                timer: 1500
            })
            openCloseXGBOOSTModal()
        } else {
            alert('Please select a CSV file.');
        }
    };

    const togglePasswordVisiblity = () => {
        const { isPasswordShown } = showPass;
        setShowPassword({ isPasswordShown: !isPasswordShown });
    };

    const dropSRCOption = (campo) => {
        return (
            <span className="d-flex flex-nowrap dropwdowncustom my-0 px-0 mx-0">
                <div className="dropdown justify-content-center align-items-center">
                    <button
                        id="cajitagris"
                        type="button"
                        className="btn btn-primary dropdown-toggle btn-sm h-76"
                        data-bs-toggle="dropdown"
                    >
                        {srcDB.name}
                        {/* {clienteEstado[`${campo}`]} */}
                    </button>
                    <ul className="dropdown-menu" style={{ height: "180px", overflow: "auto" }}>
                        {listSRC.map((opcion, index) => {
                            return (
                                <li
                                    className="dropdown-item"
                                    key={index}
                                    onClick={(e) => {
                                        setSrcDB(opcion)
                                    }}
                                >
                                    {opcion.name}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </span>
        )
    }


    return (
        <>
            <div className="container-fluid" id="pdf-export">
                <div align="right">
                </div>
                <div className='container-fluid'>
                    <form onSubmit={(e) => handleSubmitCSV(e)}>
                        <div className='row d-flex'>
                            <div className='col'>
                                <div className="step-label"> {srcDB.code === "csv" ? "Create Dynamic Table" : "Link a MySQL Database"}</div>
                            </div>
                            <div className='row d-flex'>

                            </div>
                        </div>
                        <br />

                        <div className="row d-flex justify-content-between" role="group" aria-label="Basic checkbox toggle button group">
                            <div className='col'>
                                <label className='text-dark'>Select a source</label>
                                {dropSRCOption()}
                            </div>

                        </div>
                        <br />
                        {srcDB.code === "csv" ? <> <div className='col'>
                            <div className='row d-flex justify-content-start align-items-center'>
                                <div className='col d-flex justify-content-start align-items-center'>
                                    <span className="text-dark" style={{ marginLeft: "10px" }}>Upload .csv</span>
                                    <input className="upload-file" type="file" accept=".csv" title="upload .csv file" onChange={handleFileUploadCSV} />

                                </div>
                            </div>
                        </div>
                            <br />


                            <div className='row d-flex flex-row'>
                                <div className="col-sm-12 col-md-6 col-xl-4">
                                    <div className="row d-flex flex-row">
                                        <div className="col-sm-12 flex-colunm text-dark">
                                            <h5>
                                                Table's Name
                                            </h5>
                                            <div className="col-sm-10 colum3 flex-row">
                                                <input
                                                    className="registro-input align-items-center my-0"
                                                    type="string"
                                                    placeholder="write name here without spaces"
                                                    name="name"
                                                    //onChange={(e) => setDescripcionPulsado(e.target.value)}
                                                    required
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className='row d-flex justify-content-center align-items-center'>
                                <div className='col d-flex justify-content-end align-items-center'>
                                    <button className="btn btn-outline-success"/*  onClick={handleSubmitCSV} */ type='submit'>
                                        <>Create Table
                                            {
                                                loadignPlot ?
                                                    <div className="d-flex justify-content-center align-items-center" id="loading">
                                                        <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div> : <></>
                                            }
                                        </>
                                    </button>
                                </div>
                            </div>
                        </>
                            :
                            srcDB.code === "db" ? <>
                                <div className='col'>
                                    <div className="row d-flex justify-content-between" role="group" aria-label="Basic checkbox toggle button group">
                                        <div className='col'>
                                            <div className="wrap-input100 validate-input">
                                                <label className='text-dark'>Database URL</label>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <input
                                                className="sign-input text-dark"
                                                placeholder="URL"
                                                type="text"
                                                id="uridb"
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        //login(event)
                                                        console.log("db uri")
                                                    }
                                                }}
                                                onChange={e => {
                                                    setUri(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row d-flex justify-content-between" role="group" aria-label="Basic checkbox toggle button group">
                                        <div className='col'>
                                            <div className="wrap-input100 validate-input">
                                                <label className='text-dark'>Database Name</label>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <input
                                                className="sign-input text-dark"
                                                placeholder="Database Name"
                                                type="text"
                                                id="dbname"
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        //login(event)
                                                        console.log("db name")
                                                    }
                                                }}
                                                onChange={e => {
                                                    setDbName(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row d-flex justify-content-between" role="group" aria-label="Basic checkbox toggle button group">
                                        <div className='col'>
                                            <div className="wrap-input100 validate-input">
                                                <label className='text-dark'>Database User</label>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <input
                                                className="sign-input text-dark"
                                                placeholder="Database User"
                                                type="text"
                                                id="dbuser"
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        //login(event)
                                                        console.log("user")
                                                    }
                                                }}
                                                onChange={e => {
                                                    setDbUser(e.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row d-flex justify-content-between" role="group" aria-label="Basic checkbox toggle button group">
                                        <div className='col'>
                                            <div className="wrap-input100 validate-input">
                                                <label className='text-dark'>Database Password</label>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <input
                                                className="sign-input text-dark"
                                                placeholder="Password"
                                                type={isPasswordShown ? "text" : "password"}
                                                id="passdb"
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        //login(event)
                                                        console.log("password")
                                                    }
                                                }}
                                                onChange={e => {
                                                    setPassword(e.target.value)
                                                }}
                                            />
                                            <i
                                                className="fa fa-eye password-icon"
                                                onClick={togglePasswordVisiblity}
                                            />
                                        </div>
                                    </div>
                                    <br/>
                                    <div className='row d-flex justify-content-center align-items-center'>
                                        <div className='col d-flex justify-content-end align-items-center'>
                                            <button className="btn btn-outline-success"
                                                onClick={handleAddDB}
                                                type='button'>
                                                <>Add Database
                                                    {
                                                        loadignPlot ?
                                                            <div className="d-flex justify-content-center align-items-center" id="loading">
                                                                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div> : <></>
                                                    }
                                                </>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                                :
                                <></>
                        }
                        <br />


                    </form>
                    <br />
                </div>
                <div align="right">
                </div>
            </div>
        </>
    )

}

export default CreateTable