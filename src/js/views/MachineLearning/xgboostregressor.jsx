import React, { useState, useContext, useEffect, useRef } from 'react';
import { Context } from '../../store/appContext';
import { Link } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Button } from "@material-ui/core";
import { CSVLink } from "react-csv";
import Swal from 'sweetalert2';
import { InfoTooltip } from './infoTooltip.jsx';

const XGBOOSTREGRESSOR = () => {
    const { store, actions } = useContext(Context)
    const [selectedFile, setSelectedFile] = useState(null);
    const [plotImage, setPlotImage] = useState(null)
    const [plotResidualImage, setResidualImage] = useState(null)
    const [loadignPlot, setLoadingPlot] = useState(false)
    const [showXGBOOST, setShowXGBOOST] = useState(false)
    const [xgBoostData, setXGBoostData] = useState({})
    const urlML = '/upload-csv-xgboostregressor'

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

    const handleSubmitCSV = async (e) => {
        e.preventDefault();
        if (selectedFile) {
            setLoadingPlot(true)
            let formData = new FormData(e.target);
            let dependent = formData.get("dependent")
            let testset = formData.get("testset")
            let folds = formData.get("folds")

            let tempObj = {
                dColumns: dependent,
                testset: testset,
                folds: folds
            }
            let jsontempObj = JSON.stringify(tempObj);

            formData.append('file', selectedFile); //added file
            formData.append('data', jsontempObj) //tempObj data as json

            const BASE_URL2 = process.env.BASE_URL2;
            let response = await fetch(BASE_URL2 + urlML, {
                method: 'POST',
                body: formData,
            })
            if (!response.ok) {
                setLoadingPlot(false)
                throw new Error('Network response was not ok');                
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

    return (
        <>
            <div className="container-fluid" id="pdf-export">
                <div align="right">
                </div>
                <div className='container-fluid'>
                    <form onSubmit={(e) => handleSubmitCSV(e)}>
                        <div className='row d-flex'>
                            <div className='col'>
                                <div className="step-label">XG BOOST REGRESSOR</div>
                            </div>
                            <div className='row d-flex'>

                            </div>
                        </div>
                        <br />
                        <div className='row d-flex justify-content-start align-items-center'>
                            <div className='col d-flex justify-content-start align-items-center'>
                                <span className="text-dark" style={{ marginLeft: "10px" }}>Upload .csv</span>
                                <input className="upload-file" type="file" accept=".csv" title="upload .csv file" onChange={handleFileUploadCSV} />
                            </div>
                            <div className='col d-flex justify-content-start align-items-center'><InfoTooltip/></div>
                        </div>
                        <div className='row d-flex flex-row'>
                            <div className="col-sm-12 col-md-6 col-xl-4">
                                <div className="row d-flex flex-row">
                                    <div className="col-sm-12 flex-colunm text-dark">
                                        <h5>
                                            Number of dependent columns
                                        </h5>
                                        <div className="col-sm-10 colum3 flex-row">
                                            <input
                                                className="registro-input align-items-center my-0"
                                                type="number"
                                                placeholder="1"
                                                name="dependent"
                                                //onChange={(e) => setDescripcionPulsado(e.target.value)}
                                                required
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xl-4">
                                <div className="row d-flex flex-row">
                                    <div className="col-sm-12 flex-colunm text-dark">
                                        <h5>
                                            Percentage of test dataset size
                                        </h5>
                                        <div className="col-sm-10 colum3 flex-row">
                                            <input
                                                className="registro-input align-items-center my-0"
                                                type="number"
                                                placeholder="20"
                                                name="testset"
                                                //onChange={(e) => setDescripcionPulsado(e.target.value)}
                                                required
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xl-4">
                                <div className="row d-flex flex-row">
                                    <div className="col-sm-12 flex-colunm text-dark">
                                        <h5>
                                            Number of folds of test dataset
                                        </h5>
                                        <div className="col-sm-10 colum3 flex-row">
                                            <input
                                                className="registro-input align-items-center my-0"
                                                type="number"
                                                placeholder="10"
                                                name="folds"
                                                //onChange={(e) => setDescripcionPulsado(e.target.value)}
                                                required
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className='row d-flex justify-content-center align-items-center'>
                            <div className='col d-flex justify-content-end align-items-center'>
                                <button className="lateral-button2"/*  onClick={handleSubmitCSV} */ type='submit'>
                                    <>Apply XG Boost Regressor
                                        {
                                            loadignPlot &&
                                            <div className="d-flex justify-content-center align-items-center" id="loading">
                                                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        }
                                    </>
                                </button>
                            </div>
                        </div>
                    </form>
                    <br />
                    <div className='row d-flex flex-row'>
                        <div className='col text-dark'>
                            {xgBoostData.acurracy ? <> Acurracy after 10 folds:  {xgBoostData.acurracy.toFixed(3)} %</> : <></>}
                        </div>
                        <div className='col text-dark'>
                            {xgBoostData.standarDeviation ? <> Standard Deviation after 10 folds:  {xgBoostData.standarDeviation.toFixed(2)} %</> : <></>}
                        </div>
                    </div>
                    <div className='row d-flex flex-row'>
                        <div className='col'>
                            {plotImage != null ?
                                <>
                                    <img src={`data:image/png;base64, ${plotImage}`} style={{ height: "100%", maxHeight: "400px", minHeight: "200px", maxWidth: "400px" }}
                                        loading="lazy" />
                                </> :
                                <></>
                            }
                        </div>
                        <div className='col'>
                            {plotResidualImage != null ?
                                <>
                                    <img src={`data:image/png;base64, ${plotResidualImage}`} style={{ height: "100%", maxHeight: "400px", minHeight: "200px", maxWidth: "400px" }}
                                        loading="lazy" />
                                </> :
                                <></>
                            }
                        </div>
                    </div>
                </div>
                <div align="right">
                </div>
            </div>
        </>
    )

}

export default XGBOOSTREGRESSOR