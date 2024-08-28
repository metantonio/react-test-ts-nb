import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../../store/appContext";
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
import styles from './clientList.module.css';
import WithAuth from '../../components/Auth/withAuth.js';
import CsvUploader from './uploadCSV.jsx';
import { Link } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { CSVLink } from "react-csv";
import MaterialTable from "material-table";
import { Redirect } from "react-router-dom";


const clientsData = [
    { id: 1, name: 'Antonio Martínez', phone: '+13057130261' }
    /* { id: 2, name: 'Clive Pearson', phone: '+13057762845' },
    { id: 3, name: 'Ankit Agrawal', phone: '+14054130718' }, */
    // Agrega más clientes aquí
];

const ClientList = () => {
    const { store, actions } = useContext(Context)
    const [open, setOpen] = useState(false);
    const [selectedClients, setSelectedClients] = useState([]);
    const [message, setMessage] = useState('');
    const [twilioid, setTwilioId] = useState('');
    const [twilioToken, setTwilioToken] = useState('');
    const [twilioPhone, setTwilioPhone] = useState('');
    const [campaigns, setCampaigns] = useState([])
    const [refresh, setRefresh] = useState(false)
    const navigate = useHistory()

    //Declaración de variables necesarias para MaterialTable
    let tituloTabla = "CAMPAIGN LIST"; //editar
    const columns = [
        {
            title: "ID", //Este sería el título a mostrar de la columna
            field: "id", //este sería el nombre del campo del objeto del cual se extrae la información
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "MESSAGE",
            field: "message",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "URL",
            field: "url",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "REGISTER DATE",
            field: "register_date",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "CUSTOMERS",
            field: "counter_clicks",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "UNIQUE CLICKS",
            field: "counter_real_clicks",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "TOTAL CLIKS",
            field: "counter_total_clicks",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "STATUS",
            field: "status",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",
            render: (rowData) => { return rowData.status == false ? "Stopped" : "Running" },

        },
    ];

    const handleToggle = (clientId) => {
        const currentIndex = selectedClients.indexOf(clientId);
        const newSelectedClients = [...selectedClients];

        if (currentIndex === -1) {
            newSelectedClients.push(clientId);
        } else {
            newSelectedClients.splice(currentIndex, 1);
        }

        setSelectedClients(newSelectedClients);
    };

    const handleSelectAll = () => {
        const allClientIds = campaigns.map((campaigns) => campaigns.id);
        setSelectedClients(selectedClients.length === allClientIds.length ? [] : allClientIds);
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleSendMessage = async () => {
        // Lógica para enviar el mensaje a los clientes seleccionados
        console.log('Clientes seleccionados ID:', selectedClients);
        console.log('Mensaje:', message);
        let tempArrPhone = selectedClients.map((clientId) => {
            const client = clientsData.find((c) => c.id === clientId);
            return client.phone
        })
        console.log('Clientes seleccionados Phone:', tempArrPhone);
        let obj = {
            message: message,
            clients: tempArrPhone,
            TWILIO_ACCOUNT_SID: twilioid,
            TWILIO_AUTH_TOKEN: twilioToken,
            TWILIO_NUMBER: twilioPhone,
        }

        let response = await actions.useFetch("/sms-check", obj, "POST");
        if (response.ok) {
            setRefresh(!refresh)
            alert("message sent")
        } else {
            alert("error")
        }

        handleCloseDialog();
    };

    useEffect(() => {
        let dataLoad = async () => {
            let response = await actions.useFetch("/all-sms-campaign", {}, "GET")
            if (response.ok) {
                response = await response.json()
                //console.log(response)
                setCampaigns(response.campaign)
            }
            return
        }
        dataLoad()
    }, [refresh])

    return (
        <>
           {/*  <Navbar2 /> */}
            <h1>SMS/MMS Campaign</h1>
            <Link className={styles.button_primary} to="/main">QLX-GPT</Link>
            <div className="container-fluid pt-2">
                <div className='row d-flex justify-content-center'>
                    <CsvUploader send={handleSendMessage} refresh={refresh} setRefresh={setRefresh} />

                    <div className="mx-1">
                        <button className="nodrag btn btn-outline-success justify-content-center align-items-center">
                            <CSVLink data={campaigns} /* headers={csvHeaders} */ style={{ textDecoration: "none", width: "100%", color: "black" }}>
                                Export to CSV
                            </CSVLink>
                        </button>
                        {campaigns && campaigns.length > 0 ? <>
                            <MaterialTable
                                columns={columns}
                                data={campaigns} //este sería el campo que hay que cambiar
                                title={tituloTabla}
                                actions={[
                                    {
                                        icon: "search",
                                        /* icon: (event, rowData) => {
                                            <Link to={`/iq-sms/${rowData.id}`} >Detail</Link>
                                        }, */
                                        tooltip: "Details",
                                        onClick: (event, rowData) => {
                                            console.log(event, rowData)
                                            //return <NavLink to={`/iq-sms/${rowData.id}`} >Detail</NavLink>
                                            //return <Redirect to={`/iq-sms/${rowData.id}`} />
                                            navigate.push(`/iq-sms/${rowData.id}`)

                                        }
                                    },
                                    /* {
                                        icon: "edit",
                                        tooltip: "Editar",
                                        onClick: (event, rowData) => {
                                            if (store.editarBNC) {
                                                seleccionarArtista(rowData, "Editar")
                                            } else {
                                                alert("No tiene permisos suficientes");
                                            }
                                        },
                                    },
                                    {
                                        icon: "delete",
                                        tooltip: "Eliminar",
                                        onClick: (event, rowData) => {
                                            if (store.deleteBNC) {
                                                seleccionarArtista(rowData, "Eliminar")
                                            } else {
                                                alert("No tiene permisos suficientes");
                                            }
                                        },
                                    }, */
                                ]}
                                options={{
                                    pageSize: 10,
                                    actionsColumnIndex: -1,
                                    emptyRowsWhenPaging: false,

                                    pageSizeOptions: [5, 10, 20, 40],
                                }}
                                localization={{
                                    header: {
                                        actions: "Actions",
                                    },
                                }}
                            />
                        </> : <>
                            <br />
                            <br />
                            <h2 className="text-center">You don't have any active campaign</h2>
                        </>}

                    </div>
                    <br />

                    {/* <TableContainer className="client-list-table">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="input-all">
                                        <Checkbox
                                            checked={selectedClients.length === campaigns.length}
                                            onChange={handleSelectAll}
                                            indeterminate={selectedClients.length > 0 && selectedClients.length < campaigns.length}
                                            className="input-all"
                                        />
                                    </TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>MESSAGE</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell>REGISTER DATE</TableCell>
                                    <TableCell>CUSTOMERS</TableCell>
                                    <TableCell>CUSTOMERS CLICKED</TableCell>
                                    <TableCell>TOTAL CLICKS</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {campaigns.map((items) => (
                                    <TableRow key={items.id} onClick={() => handleToggle(items.id)} className="client-list-item">
                                        <TableCell>
                                            <Checkbox checked={selectedClients.indexOf(items.id) !== -1} />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {items.id}
                                        </TableCell>
                                        <TableCell>{items.message}</TableCell>
                                        <TableCell>{items.url}</TableCell>
                                        <TableCell>{items.register_date}</TableCell>
                                        <TableCell>{items.counter_clicks}</TableCell>
                                        <TableCell>{items.counter_real_clicks}</TableCell>
                                        <TableCell>{items.counter_total_clicks}</TableCell>
                                        <TableCell><Link to={`/iq-sms/${items.id}`} className="text-dark btn btn-success">Details</Link></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer> */}
                    {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    disabled={selectedClients.length === 0}
                >
                    Send Message
                </Button> */}
                </div>
            </div>

        </>
    );
};

export default WithAuth(ClientList);
