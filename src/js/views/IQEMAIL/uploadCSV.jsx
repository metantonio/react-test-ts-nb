import React, { useState, useContext, useEffect } from 'react';
//import { Context } from "../../store/appContext";
//import CSVReader from 'react-csv-reader';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    /* Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox, */
    TextField,
} from '@mui/material';
import ScheduleEmail from './scheduleEmail.jsx';
import Swal from 'sweetalert2';
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";
//import { Link, useParams } from "react-router-dom";
import { lazy } from 'react';
import styles2 from "./clientList.module.css"
const Template1 = lazy(() => import('./template1.jsx'));
const Template2 = lazy(() => import('./template2.jsx'));
const Template3 = lazy(() => import('./template3.jsx'));

const CsvUploaderEmail = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false);
    const [selectedClients, setSelectedClients] = useState([]);
    const [twilioid, setTwilioId] = useState('');
    const [twilioToken, setTwilioToken] = useState('');
    const [twilioPhone, setTwilioPhone] = useState('');
    const [isSectionVisible, setSectionVisibility] = useState(false);
    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalTemplate, setModalTemplate] = useState(false);
    const [temporalCalendar, setTemporalCalendar] = useState({});
    const [loading, setLoading] = useState(false);
    const [customHTML, setCustomHTML] = useState(`<div class="container">Hi</div>`)
    const [customURL, setCustomURL] = useState("")
    const [customImg, setCustomImg] = useState("")
    const [customTitle, setCustomTitle] = useState("")
    const [customSupport, setCustomSupport] = useState("antonio.martinez@qlx.com")
    const [customCompany, setCustomCompany] = useState("QLX")
    const [customAddress, setCustomAddress] = useState("Bal Harbor, Florida")
    const [selectedTemplate, setSelectedTemplate] = useState({name:"Default",path:"./utils/templates/customBasic.handlebars"})
    const [customStart, setCustomStart] = useState("")
    const [customEnd, setCustomEnd] = useState("")
    const selectedTemplateList = [
        { name: "Basic", path: "./utils/templates/customBasic.handlebars", preview: "/template/3" , component:<Template3/>},
        { name: "Appointment", path: "./utils/templates/customCalendar.handlebars", preview: "/template/1" , component:<Template1/>},
        { name: "Confirmation Receipt", path: "./utils/templates/customReceipt.handlebars", preview: "/template/2" , component:<Template2/>},
    ]

    const toggleAccordion = () => {
        setSectionVisibility(!isSectionVisible);
    };

    const abrirCerrarModalMostrar = () => {
        setModalMostrar(!modalMostrar);
    };

    const abrirCerrarModalTemplate = () => {
        setModalTemplate(!modalTemplate);
    };

    const dropTemplate = (campo) => {
        return (
            <span className="d-flex flex-nowrap dropwdowncustom my-0 px-0 mx-0">
                <div className="dropdown justify-content-center align-items-center">
                    <button
                        id="cajitagris"
                        type="button"
                        className={styles2.button_primary}
                        data-bs-toggle="dropdown"
                    >
                        {selectedTemplate.name}
                    </button>
                    <ul className="dropdown-menu" style={{ height: "180px", overflow: "auto" }}>
                        {selectedTemplateList.map((item, index) => {
                            /* if (item != "" && item != "-" && item != "X" && item != "OF") { */
                            return (
                                <li
                                    className="dropdown-item"
                                    key={index}
                                    onClick={(e) => {
                                        setSelectedTemplate(item)
                                    }}
                                >
                                    {item.name}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </span>
        )
    }

    //Declaración de variables para estilos de los Modales, hay dos ejemplos de estilos de modales
    const useStyles = makeStyles((theme) => ({
        modal: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            height: 600,
            width: 600,
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "auto",
        },
        modal2: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            height: 700,
            width: 700,
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "auto",
        },
        iconos: {
            cursor: "pointer",
        },
        inputMaterial: {
            width: "100%",
        },
    }));
    const styles = useStyles();

    const BASE_URL2 = process.env.BASE_URL2;

    const handleFileChange = (data, fileInfo) => {
        setSelectedFile(data);
    };

    //Declaración de los cuerpos que tendrán los modales
    const bodyMostrar = (
        <>
            <div className={styles.modal}>
                Here should be a nice view to send this campaign again may be? or special offer to this customer.
                <div align="right">
                    <button className="btn btn-outline-danger" type="button" onClick={() => abrirCerrarModalMostrar()}>Cancel</button>
                </div>
                <ScheduleEmail campaignD={{ id: 1 }} setTemporalCalendar={setTemporalCalendar} />
                <div align="right">
                    <button className="btn btn-outline-danger" type="button" onClick={() => abrirCerrarModalMostrar()}>Cancel</button>
                </div>
            </div>
        </>
    )

    //Declaración de los cuerpos que tendrán los modales
    const bodyTemplate = (templateComponent) => {
        return (
            <>
                <div className={styles.modal}>                    
                    <div align="right">
                        <button className="btn btn-outline-danger" type="button" onClick={() => abrirCerrarModalTemplate()}>Cancel</button>
                    </div>
                    {templateComponent}
                    <div align="right">
                        <button className="btn btn-outline-danger" type="button" onClick={() => abrirCerrarModalTemplate()}>Cancel</button>
                    </div>
                </div>
            </>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedFile) {
                setLoading(true)
                let formData = new FormData(e.target);
                // Puedes ajustar la URL de la API según tus necesidades
                const apiUrl = BASE_URL2 + "/csv-email";

                // Aquí puedes agregar cualquier otra información adicional a enviar junto con el archivo
                //const formData = new FormData();
                //formData.append('file', selectedFile[0]);
                formData.append('file', selectedFile); //added file

                if (message == '') {
                    setLoading(false)
                    alert("write a message")
                    return
                }

                let obj = {
                    ...temporalCalendar,
                    message: message,
                    url: customURL,
                    html: customHTML,
                    template: selectedTemplate.path,
                    img: customImg,
                    support: customSupport,
                    companyname: customCompany,
                    companyaddress: customAddress,
                    title: customTitle,
                    start: customStart,
                    end: customEnd
                }
                console.log("valor de OBJ: ", obj)
                let jsontempObj = JSON.stringify(obj);
                formData.append('data', jsontempObj) //tempObj data as json

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
                    /* headers: {
                        'Content-Type': 'text/csv',
                    }, */
                    headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
                });

                if (response.ok) {
                    setLoading(false)
                    let data = await response.json();
                    console.log('Backend response:', data);
                    props.setRefresh(!props.refresh)
                    handleCloseDialog()
                    Swal.fire({
                        icon: 'success',
                        title: `${data['message']} \n -Total Customers: ${data["length"]} \n -Messages Sent:${data["count"]}`,
                        showConfirmButton: true,
                        timer: 2000
                    })
                } else {
                    setLoading(false)
                    console.error('Error sending:', response.statusText);
                    let data = await response.json();
                    console.log('Backend response:', data);
                    alert(`${data['message']}`)
                }
            } else {
                alert('Please, Select a .csv file first');
            }
        } catch (error) {
            setLoading(false)
            console.error('Error trying to sending:', error);
        }
    };

    const handleFileUploadCSV = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            alert('Please select a CSV file.');
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const addToMessage = (textToAdd) => {
        let tempText = `${message} ${textToAdd}`
        setMessage(tempText)
    }

    return (
        <div className='container'>

            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Setup Message</DialogTitle>
                <DialogContent>
                    <div className="row d-flex mt-1 pt-1">
                        <div className="col-4 justify-content-center align-items-center">
                            <span>Choose a Template:</span>
                        </div>
                        <div className="col justify-content-center align-items-center">
                            {dropTemplate()}
                        </div>
                        <div className="col-3 justify-content-center align-items-center">
                            {selectedTemplate && selectedTemplate.preview ? <>
                            {/* <Link to={selectedTemplate.preview} target={'_blank'} rel={"noopener noreferrer"}>Preview</Link> */} 
                            <button className='btn btn-primary' onClick={()=>{abrirCerrarModalTemplate(selectedTemplate.preview)}}>Preview</button>
                            </>: <></>}
                        </div>
                    </div>
                    <br />
                    <TextField
                        label="Title"
                        multiline
                        rows={1}
                        variant="outlined"
                        fullWidth
                        value={customTitle}
                        placeholder='Title'
                        onChange={(e) => setCustomTitle(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    <br />
                    <TextField
                        label="Message"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={message}
                        placeholder='You can use {first_name} {last_name} {url} in your message, or any other field in your .csv, to be changed by actual names in backend'
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    <div className='toggle-button'>
                        <br />
                        <button className="btn btn-light btn-sm mx-1" onClick={e => { addToMessage("{first_name}") }}>{`{first_name}`}</button>
                        <button className="btn btn-light btn-sm mx-1" onClick={e => { addToMessage("{last_name}") }}>{`{last_name}`}</button>
                        <button className="btn btn-light btn-sm mx-1" onClick={e => { addToMessage("{offer}") }}>{`{offer}`}</button>
                        <button className="btn btn-light btn-sm mx-1" onClick={e => { addToMessage("{url}") }}>{`{url}`}</button>
                    </div>
                    <br />
                    <TextField
                        label="Url to use in message"
                        multiline
                        rows={1}
                        variant="outlined"
                        fullWidth
                        value={customURL}
                        placeholder='https://www.youtube.com'
                        onChange={(e) => setCustomURL(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    <br />
                    <TextField
                        label="Url to change image header"
                        multiline
                        rows={1}
                        variant="outlined"
                        fullWidth
                        value={customImg}
                        placeholder='https://descubrecomohacerlo.com/wp-content/uploads/mch/mensaje-persona-recibio_9575.jpg'
                        onChange={(e) => setCustomImg(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    <br />
                    <TextField
                        label="Support Email"
                        multiline
                        rows={1}
                        variant="outlined"
                        fullWidth
                        value={customSupport}
                        placeholder='antonio.martinez@qlx.com'
                        onChange={(e) => setCustomSupport(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    <br />
                    <TextField
                        label="Company Name"
                        multiline
                        rows={1}
                        variant="outlined"
                        fullWidth
                        value={customCompany}
                        placeholder='QLX'
                        onChange={(e) => setCustomCompany(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    <TextField
                        label="Company Address"
                        multiline
                        rows={1}
                        variant="outlined"
                        fullWidth
                        value={customAddress}
                        placeholder='QLX'
                        onChange={(e) => setCustomAddress(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    {selectedTemplate && selectedTemplate.preview == "/template/1" ?
                        <TextField
                            label="Start"
                            multiline
                            rows={1}
                            variant="outlined"
                            fullWidth
                            value={customStart}
                            placeholder='08/15/2023'
                            onChange={(e) => setCustomStart(e.target.value)}
                            style={{ marginTop: 16 }}
                        /> : <></>}
                    {selectedTemplate && selectedTemplate.preview == "/template/1" ?
                        <TextField
                            label="Start"
                            multiline
                            rows={1}
                            variant="outlined"
                            fullWidth
                            value={customEnd}
                            placeholder='08/15/2023'
                            onChange={(e) => setCustomEnd(e.target.value)}
                            style={{ marginTop: 16 }}
                        /> : <></>}
                    <br />


                    <div className='toggle-button container-fluid'>
                        <br />
                        <button className="btn btn-primary mx-1" onClick={abrirCerrarModalMostrar}>{modalMostrar ? "Hide Schedule" : "Schedule"}</button>
                        <br />
                        <button className="btn btn-primary mx-1" onClick={toggleAccordion}>{isSectionVisible ? "Hide Advanced Options" : "Advanced Options"}</button>
                        {isSectionVisible && <div className='container-fluid'>

                            <textarea
                                className="container-fluid"
                                label="Custom HTML"
                                multiline
                                /* rows={1} */
                                variant="outlined"
                                fullWidth
                                value={customHTML}
                                onChange={(e) => setCustomHTML(e.target.value)}
                                style={{ marginTop: 16 }}
                            />
                        </div>
                        }
                    </div>

                </DialogContent>
                <form onSubmit={(e) => handleSubmit(e)} className="container">

                    {/*  <h2>Upload .csv file</h2> */}
                    {/* <div className='row d-flex'>
                        <CSVReader onFileLoaded={handleFileChange} />
                    </div> */}
                    <div className='row d-flex justify-content-start align-items-center'>
                        <div className='row d-flex justify-content-start align-items-center pb-1'>
                            <span className="text-dark" style={{ marginLeft: "5px" }}>Upload .csv</span>
                            <input className="upload-file" type="file" accept=".csv" title="upload .csv file" onChange={handleFileUploadCSV} style={{ height: "30px" }} />
                            <a href='https://docs.google.com/spreadsheets/d/1Ve425dbdUQHU95sJA8W05vwj_-FP8boJZAyEKfYbhFk/edit?usp=sharing' target='_blank'>Download the .csv template</a>
                        </div>
                    </div>
                    <br />

                    <DialogActions className='col d-flex justify-content-end align-items-center'>
                        <Button onClick={e => {
                            handleCloseDialog()
                            props.setRefresh(!props.refresh)
                        }} className='btn btn-danger' color="primary" type='button'>
                            Cancel
                        </Button>
                        <button type='submit' className='btn btn-primary' color="primary">
                            {!loading ? "Send Message" : <div className="spinner-border text-primary" />}
                        </button>
                    </DialogActions>
                </form>

            </Dialog>
            <Button onClick={handleOpenDialog} color="primary" className='btn btn-danger'>
                Use .csv file
            </Button>

            <Modal open={modalMostrar} onClose={abrirCerrarModalMostrar}>
                {bodyMostrar}
            </Modal>

            <Modal open={modalTemplate} onClose={abrirCerrarModalTemplate}>
                {bodyTemplate(selectedTemplate.component)}
            </Modal>
        </div>
    );
};

export default CsvUploaderEmail;
