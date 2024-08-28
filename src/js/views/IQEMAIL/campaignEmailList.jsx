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
import WithAuth from "../../components/Auth/withAuth";
import CsvUploaderEmail from './uploadCSV.jsx';
import { Link } from "react-router-dom";
//import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { CSVLink } from "react-csv";
import MaterialTable from "material-table";
//import { Redirect } from "react-router-dom";

const clientsData = [
    { id: 1, name: 'Antonio Martínez', phone: '+13057130261' }
    /* { id: 2, name: 'Clive Pearson', phone: '+13057762845' },
    { id: 3, name: 'Ankit Agrawal', phone: '+14054130718' }, */
    // Agrega más clientes aquí
];

const CampaignEmailList = () => {
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
    let tituloTabla = "CAMPAIGN EMAIL LIST"; //editar
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
        console.log('Clientes seleccionados Email:', tempArrPhone);
        let obj = {
            message: message,
            clients: tempArrPhone,
            TWILIO_ACCOUNT_SID: twilioid,
            TWILIO_AUTH_TOKEN: twilioToken,
            TWILIO_NUMBER: twilioPhone,
        }

        let response = await actions.useFetch("/email-check", obj, "POST");
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
            let response = await actions.useFetch("/all-email-campaign", {}, "GET")
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
            {/* <Navbar2 /> */}
            <h1>Email Campaign</h1>

            <div className={`container-fluid ${styles.campaigns_container}`}>
                <div className='row d-flex justify-content-center'>
                    <div className='col-sm-12 col-md-1'>
                        {/* <Link className={styles.button_primary} to="/main">QLX-GPT</Link> */}
                        <CsvUploaderEmail send={handleSendMessage} refresh={refresh} setRefresh={setRefresh} />
                        <button className="nodrag btn btn-outline-success justify-content-center align-items-center">
                            <CSVLink data={campaigns} style={{ textDecoration: "none", width: "100%", color: "black" }}>
                                Export to CSV
                            </CSVLink>
                        </button>
                    </div>
                    <div className='col-sm-12 col-md-11'>
                        <div className="mx-1">

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
                                                navigate.push({pathname:`/iq-email/${rowData.id}`})

                                            }
                                        },
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
                                <h2 className="text-center">You don't have any active email campaign</h2>
                            </>}
                        </div>
                    </div>
                    <br />
                </div>
            </div>

        </>
    );
};

export default WithAuth(CampaignEmailList);
