import React, { useState, useContext, useEffect } from 'react';
//import { Context } from "../../store/appContext";
//import CSVReader from 'react-csv-reader';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
} from '@mui/material';
import ScheduleSMS from './scheduleSMS.jsx';
import Swal from 'sweetalert2';
import { makeStyles } from "@material-ui/core/styles";
import { Modal } from "@material-ui/core";

const CsvUploader = (props) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false);
    const [selectedClients, setSelectedClients] = useState([]);
    const [twilioid, setTwilioId] = useState('');
    const [twilioToken, setTwilioToken] = useState('');
    const [twilioPhone, setTwilioPhone] = useState('');
    const [isSectionVisible, setSectionVisibility] = useState(false);
    const [modalMostrar, setModalMostrar] = useState(false);
    const [temporalCalendar, setTemporalCalendar] = useState({});
    const [loading, setLoading] = useState(false);

    const toggleAccordion = () => {
        setSectionVisibility(!isSectionVisible);
    };

    const abrirCerrarModalMostrar = () => {
        setModalMostrar(!modalMostrar);
    };

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
                <ScheduleSMS campaignD={{ id: 1 }} setTemporalCalendar={setTemporalCalendar}/>
                <div align="right">
                    <button className="btn btn-outline-danger" type="button" onClick={() => abrirCerrarModalMostrar()}>Cancel</button>
                </div>
            </div>
        </>
    )

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedFile) {
                setLoading(true)
                let formData = new FormData(e.target);
                // Puedes ajustar la URL de la API según tus necesidades
                const apiUrl = BASE_URL2 + "/csv-sms";

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
                    TWILIO_ACCOUNT_SID: twilioid,
                    TWILIO_AUTH_TOKEN: twilioToken,
                    TWILIO_NUMBER: twilioPhone,
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
                    <div>
                        {selectedClients.map((clientId) => {
                            const client = clientsData.find((c) => c.id === clientId);
                            return (
                                <div key={client.id}>
                                    <strong>{client.name}</strong> - Phone: {client.phone}
                                </div>
                            );
                        })}
                    </div>
                    <TextField
                        label="Message"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={message}
                        placeholder='You can use {first_name} {last_name} in your message, to be changed by actual names in backend'
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                    <div className='toggle-button'>
                        <br />
                        <button className="btn btn-light btn-sm mx-1" onClick={e => { addToMessage("{first_name}") }}>{`{first_name}`}</button>
                        <button className="btn btn-light btn-sm mx-1" onClick={e => { addToMessage("{last_name}") }}>{`{last_name}`}</button>
                        <button className="btn btn-light btn-sm mx-1" onClick={e => { addToMessage("{url}") }}>{`{url}`}</button>
                    </div>
                    <br />
                    <div className='toggle-button'>
                        <br />
                        <button className="btn btn-primary mx-1" onClick={abrirCerrarModalMostrar}>{modalMostrar ? "Hide Schedule" : "Schedule"}</button>
                        <br />
                        <button className="btn btn-primary mx-1" onClick={toggleAccordion}>{isSectionVisible ? "Hide Advanced Options" : "Advanced Options"}</button>
                        {isSectionVisible && <div>

                            <TextField
                                label="Twilio Account UID (optional)"
                                multiline
                                rows={1}
                                variant="outlined"
                                fullWidth
                                value={twilioid}
                                onChange={(e) => setTwilioId(e.target.value)}
                                style={{ marginTop: 16 }}
                            />
                            <TextField
                                label="Twilio Token (optional)"
                                multiline
                                rows={1}
                                variant="outlined"
                                fullWidth
                                value={twilioToken}
                                onChange={(e) => setTwilioToken(e.target.value)}
                                style={{ marginTop: 16 }}
                            />
                            <TextField
                                label="Twilio Phone (optional)"
                                multiline
                                rows={1}
                                variant="outlined"
                                fullWidth
                                value={twilioPhone}
                                onChange={(e) => setTwilioPhone(e.target.value)}
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
                            <a href='https://docs.google.com/spreadsheets/d/14KFeMz1mbjmjWZJQ2_JH3jxhME8UvlhpD-GO8gcghAA/edit?usp=sharing' target='_blank'>Download the .csv template</a>
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
                            {!loading?"Send Message":<div className="spinner-border text-primary" />}
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
        </div>
    );
};

export default CsvUploader;
