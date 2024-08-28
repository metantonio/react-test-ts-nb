import React, { useState, useEffect, useContext, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "reactstrap";
import { useHistory } from "react-router-dom";
import { Context } from "../../store/appContext";
import MaterialTable from "material-table";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "@material-ui/icons";
import Swal from 'sweetalert2';
import WithAuth from '../../components/Auth/withAuth.js';
import { Graficos } from "../../components/graficos.jsx";
import WidgetsDropdown from '../../components/WidgetsDropdown'
import {
    cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook,
    cibApple,
    cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople,
    cilUser,
    cilUserFemale,
    cibAndroid,
    cibWindows,
    cilDevices
} from '@coreui/icons'
import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { CChartLine } from '@coreui/react-chartjs'
import { CSVLink } from "react-csv";

//Declaración del componente en React, a diferencia de las funciones debe empezar en MAYÚSCULA
const SingleCampaign = () => {

    const { store, actions } = useContext(Context); //importación del store y actions del flux
    const params = useParams(); //Hook de react que obtiene la variable dinámica 'id' de la url

    //Declaración de los endpoints de backend, algunos ejemplos: 
    const urlGet = "/all-sms-customers/" + params.id; //endpoint del backend para obtener data
    const urlDelete = "/singleejemplo/delete"; //endpoint  del backend para borrar data
    const urlEdit = "/singleejemplo/update"; //endpoint del backend para actualizar data

    //Declaración de Estados con el Hook useState() (cuando hay cambios en los estados, las pantallas pueden renderizar de nuevo)
    const [customerList, setCustomerList] = useState([{
        name: "",
        lastname: "",
        status: "",
        counter: ""
    }]);
    const [customersClicked, setCustomersClicked] = useState(0)
    const [sentCount, setSentCount] = useState(0);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalMostrar, setModalMostrar] = useState(false);
    const [variableEstado, setVariableEstado] = useState({});
    const [vistaCarta, setVistaCarta] = useState(false)
    const [customersFrustrated, setCustomerFrustrated] = useState(0)
    const history = useHistory("");
    const [recarga, setRecarga] = useState(false);
    const [clicksThisMonth, setClicksThisMonth] = useState(0);
    const [clicksLastMonth, setClicksLastMonth] = useState(0);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [progressExample, setProgressExample] = useState([
        { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
        { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
        { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
        { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
        { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' }
    ])

    const [progressGroupExample1, setProgressExample1] = useState([
        { title: 'Monday', value1: 34, value2: 78 },
        { title: 'Tuesday', value1: 56, value2: 94 },
        { title: 'Wednesday', value1: 12, value2: 67 },
        { title: 'Thursday', value1: 43, value2: 91 },
        { title: 'Friday', value1: 22, value2: 73 },
        { title: 'Saturday', value1: 53, value2: 82 },
        { title: 'Sunday', value1: 9, value2: 69 }
    ])

    const [progressGroupExample2, setProgressExample2] = useState([
        { title: 'Mobile', icon: cilUser, value: 53 },
        { title: 'Other', icon: cilUserFemale, value: 43 }
    ])

    const [progressGroupExample3, setProgressExample3] = useState([
        { title: 'iPhone', icon: cibApple, percent: 56, value: '191,235' },
        { title: 'Android', icon: cibAndroid, percent: 15, value: '51,223' },
        { title: 'Windows', icon: cibWindows, percent: 11, value: '37,564' },
        { title: 'Other', icon: cilDevices, percent: 8, value: '27,319' }
    ])

    const [dayCounter, setDayCounter] = useState({});
    const [monthCounter, setMonthCounter] = useState({})
    const [yearCounter, setYearCounter] = useState({})

    //const csvHeaders = customerList.map((col, index) => {return{ label: col, key: col }});

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


    //Declaración de variables necesarias para MaterialTable
    let tituloTabla = "Customers in this campaign"; //editar
    const columns = [
        {
            title: "Name", //Este sería el título a mostrar de la columna
            field: "name", //este sería el nombre del campo del objeto del cual se extrae la información
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "Last Name",
            field: "lastname",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "Clicks",
            field: "counter",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "SMS Status",
            field: "status",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "Device",
            field: "device",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "OS",
            field: "os",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
        {
            title: "Registered",
            field: "registered",
            cellStyle: {
                whiteSpace: 'wrap',
            },
            width: "4%",

        },
    ];


    //Declaración de funciones que usará la tabla MaterialTable
    const seleccionarArtista = (artista, caso) => {
        setVariableEstado(artista);
        caso === "Editar" ? abrirCerrarModalEditar() : (
            caso === "Mostrar" ? abrirCerrarModalMostrar() : abrirCerrarModalEliminar());
    };

    const abrirCerrarModalInsertar = () => {
        setModalInsertar(!modalInsertar);
    };

    const abrirCerrarModalEditar = () => {
        setModalEditar(!modalEditar);
    };

    const abrirCerrarModalEliminar = () => {
        setModalEliminar(!modalEliminar);
    };

    const abrirCerrarModalMostrar = () => {
        setModalMostrar(!modalMostrar);
    };


    //Declaración de los cuerpos que tendrán los modales
    const bodyMostrar = (
        <>
            <div className={styles.modal}>
                Here should be a nice view to send this campaign again may be? or special offer to this customer.
                <div align="right">
                    <button className="btn btn-outline-success" type="button" onClick={() => abrirCerrarModalMostrar()}>Cancelar</button>
                </div>
            </div>
        </>
    )

    const bodyEditar = (
        <>
            <div className={styles.modal}>
                Aquí va el cuerpo de bodyEditar
                <div align="right">
                    <button className="btn btn-outline-success" type="button" onClick={() => abrirCerrarModalEditar()}>Cancelar</button>
                </div>
            </div>
        </>
    )

    const bodyEliminar = (
        <>
            <div className={styles.modal2}>
                Aquí va el cuerpo de bodyEliminar
                <div align="right">
                    <button className="btn btn-outline-success" type="button" onClick={() => abrirCerrarModalEliminar()}>Cancelar</button>
                </div>
            </div>
        </>
    )

    //useEffect es un Hook de React que funciona en 3 etapas de renderización y su estructura es: useEffect(()=>{},[])
    //Ejemplo de un useEffect que carga una lógica al renderizar el componente la primera vez:
    useEffect(() => {
        window.scrollTo(0, 0); //al cargar el componente, lleva al inicio de la ventana. Sin importar si el componente carga al final

        //declaración más correcta de ejecutar una función asíncrona dentro del useEffect, ya que el useEffect asíncrono puede dar problemas
        const primera = async () => {
            //getGenerico devuelve el objeto como promesa de Javascript
            let lista = await actions.useFetch(urlGet)
            console.log('lista dentro de función primera: ', lista)
            //validamos que el resultado de la petición (la promesa) NO haya tenido un status entre 200 y 299, con el método .ok de las promesas:
            if (!lista.ok) {
                console.log("No hubo conexión exitósa, código de la petción: ", lista.status)
                //lista = await lista.json()
                //console.log("lista error: ", lista)
                //retorno el valor lista2 con la misma estructura que necesite
                let lista2 = [{
                    Nombre: "Error",
                    Descripcion: "Error al traer la lista o el endpoint no existe"
                }]

                //setCustomerList(lista2); //actualizo el valor del Estado customerList con la lista2 en caso de error. Colocar el estado que corresponda
                return lista2; //en este punto terminaría la función
            } else {
                //si el status estuvo entre 200 y 299 validamos la promesa y la transformamos en un objeto Javascript con .json()
                console.log("Hubo conexión exitósa, código de la petción: ", lista.status)
                let response = await lista.json(); //transformación de la promesa en un objeto de javascript
                setCustomerList(response.customers); //actualizo el valor del Estado customerList con la lista que viene del backend. Colocar el estado que corresponda
                let clickCount = 0
                let sentCount = 0
                let frustration = 0
                let clickThisMonth = 0
                let clickLastMonth = 0
                let mobileDevice = 0;
                let osCounter = {};
                let dayCounter1 = {};
                let daysInLastMonthCounter = {};
                let monthCounter1 = {};
                let yearCounter1 = {};
                const currentDate = new Date();
                const currentMonth = currentDate.getUTCMonth();
                const currentYear = currentDate.getUTCFullYear();
                const lastMonth = (currentMonth === 0) ? 11 : currentMonth - 1; // Calculate the index of the last month

                for (let i = 0; i < response.customers.length; i++) {
                    let registeredDate = new Date(response.customers[i]["registered"]);
                    let dayOfWeek = registeredDate.getUTCDay();
                    let month = registeredDate.getUTCMonth();
                    let year = registeredDate.getUTCFullYear();

                    if (response.customers[i]["counter"] > 0) {
                        clickCount++
                    }
                    if (response.customers[i]["status"] == "sent") {
                        sentCount++
                    }
                    if (response.customers[i]["counter"] > 1) {
                        frustration++
                    }
                    if (response.customers[i]["device"] == "Mobile Device") {
                        mobileDevice++
                    }
                    if (response.customers[i]["os"] != "") {
                        if (!osCounter[response.customers[i]["os"]]) {
                            osCounter[response.customers[i]["os"]] = 1
                        } else {
                            osCounter[response.customers[i]["os"]]++
                        }
                    }

                    // Contador de días de la semana en el mes actual
                    if (month === currentMonth && year === currentYear && response.customers[i]["counter"] > 0) {
                        if (!dayCounter1[dayNames[dayOfWeek]]) {
                            dayCounter1[dayNames[dayOfWeek]] = 1;
                        } else {
                            dayCounter1[dayNames[dayOfWeek]]++;
                        }
                        clickThisMonth++
                    }

                    // Count days in last month
                    if (month === lastMonth && year === currentYear && response.customers[i]["counter"] > 0) {
                        if (!daysInLastMonthCounter[dayNames[dayOfWeek]]) {
                            daysInLastMonthCounter[dayNames[dayOfWeek]] = 1;
                        } else {
                            daysInLastMonthCounter[dayNames[dayOfWeek]]++;
                        }
                        clickLastMonth++
                    }
                    // Contador de meses
                    if (!monthCounter1[month]) {
                        monthCounter1[month] = 1;
                    } else {
                        monthCounter1[month]++;
                    }

                    // Contador de años
                    if (!yearCounter1[year]) {
                        yearCounter1[year] = 1;
                    } else {
                        yearCounter1[year]++;
                    }
                }
                setCustomersClicked(clickCount)
                setSentCount(sentCount)
                setCustomerFrustrated(frustration)
                setDayCounter(dayCounter1)
                setMonthCounter(monthCounter1)
                setYearCounter(yearCounter1)
                setClicksThisMonth(clickThisMonth)
                setClicksLastMonth(clickLastMonth)
                let maxClicks = Math.max(
                    clickLastMonth,
                    clickThisMonth,
                    1
                )

                console.log("maxClicks: ", maxClicks)
                setProgressExample1([
                    { title: 'Monday', value1: dayCounter1["Monday"] ? 100 * dayCounter1["Monday"] / maxClicks : 0, value2: daysInLastMonthCounter["Monday"] ? 100 * daysInLastMonthCounter["Monday"] / maxClicks : 0 },
                    { title: 'Tuesday', value1: dayCounter1["Tuesday"] ? 100 * dayCounter1["Tuesday"] / maxClicks : 0, value2: daysInLastMonthCounter["Tuesday"] ? 100 * daysInLastMonthCounter["Tuesday"] / maxClicks : 0 },
                    { title: 'Wednesday', value1: dayCounter1["Wednesday"] ? 100 * dayCounter1["Wednesday"] / maxClicks : 0, value2: daysInLastMonthCounter["Wednesday"] ? 100 * daysInLastMonthCounter["Wednesday"] / maxClicks : 0 },
                    { title: 'Thursday', value1: dayCounter1["Thursday"] ? 100 * dayCounter1["Thursday"] / maxClicks : 0, value2: daysInLastMonthCounter["Thursday"] ? 100 * daysInLastMonthCounter["Thursday"] / maxClicks : 0 },
                    { title: 'Friday', value1: dayCounter1["Friday"] ? 100 * dayCounter1["Friday"] / maxClicks : 0, value2: daysInLastMonthCounter["Friday"] ? 100 * daysInLastMonthCounter["Friday"] / maxClicks : 0 },
                    { title: 'Saturday', value1: dayCounter1["Saturday"] ? 100 * dayCounter1["Saturday"] / maxClicks : 0, value2: daysInLastMonthCounter["Saturday"] ? 100 * daysInLastMonthCounter["Saturday"] / maxClicks : 0 },
                    { title: 'Sunday', value1: dayCounter1["Sunday"] ? 100 * dayCounter1["Sunday"] / maxClicks : 0, value2: daysInLastMonthCounter["Sunday"] ? 100 * daysInLastMonthCounter["Sunday"] / maxClicks : 0 },
                ])
                setProgressExample2([
                    { title: 'Mobile', icon: cilUser, value: 100 * mobileDevice / clickCount },
                    { title: 'Other', icon: cilUserFemale, value: Math.abs(100 * (mobileDevice - clickCount) / clickCount) },
                ])
                setProgressExample3([
                    { title: 'iPhone', icon: cibApple, percent: osCounter["iPhone"] ? 100 * osCounter["iPhone"] / clickCount : 0, value: osCounter["iPhone"] ? osCounter["iPhone"].toString() : '0' },
                    { title: 'Android', icon: cibAndroid, percent: osCounter["Android"] ? 100 * osCounter["Android"] / clickCount : 0, value: osCounter["Android"] ? osCounter["Android"].toString() : '0' },
                    { title: 'Windows', icon: cibWindows, percent: osCounter["Windows"] ? 100 * osCounter["Windows"] / clickCount : 0, value: osCounter["Windows"] ? osCounter["Windows"].toString() : '0' },
                    { title: 'Mac', icon: cibApple, percent: osCounter["Mac"] ? 100 * osCounter["Mac"] / clickCount : 0, value: osCounter["Mac"] ? osCounter["Mac"].toString() : '0' },
                    { title: 'Other', icon: cilDevices, percent: osCounter["Other"] ? 100 * osCounter["Other"] / clickCount : 0, value: osCounter["Other"] ? osCounter["Other"].toString() : '0' },
                ])

                return response.customers;

            }


        }

        //ahora ejecuto la función primera
        primera();

        console.log("estado customerList después de ejecutar primera(): ", customerList) //imprime en la consola del navegador (Chrome, Edge, Firefox, etc...)
    }, [])

    //Ejemplo de un useEffect que recarga el componente cada vez que cambia cualquiera de los Estados especificados (en este caso los estados customerList o recarga):
    useEffect(() => { //este useEffect también se ejecuta al iniciar el componente la primera vez
        //aquí puede ir cualquier tipo de lógica, incluida funciones asíncronas.

        console.log('Estado customerList: ', customerList) //imprime en consola del navegador los valores de los estados
        console.log('Estado recarga: ', recarga)

        //OJO, como este useEffect depende de los Estados customerList y recarga, NO SE DEBE HACER setCustomerList ni setRecarga
        //en ninguna parte dentro de este useEffect, porque eso crearía un bucle infinito. En el caso de peticiones al 
        //backend se traduciría en $$$ en gastos para un servidor en producción.

    }, [customerList, recarga])


    return (
        <div
            className="container-fluid"
            id={store.expandwin ? "contenedor-expandido3" : "contenedor-principal2"}
            style={{overflowY:"scroll"}}
        >
            <>
                <div className="d-flex flex-row-reverse py-1">
                    <button
                        className="btn btn-outline-success justify-content-center align-items-center"
                        type="button"
                        onClick={() => {
                            //store.dataExportadaProyecto = {}
                            //store.opcionesIndex = []
                            history.push("/iq-sms")
                        }}
                    >
                        Go back to campaigns
                    </button>
                </div>
                <h1>
                    Campaign: {params.id}
                </h1>
                <br />
                <>
                    <WidgetsDropdown customers={customerList.length} clicks={customersClicked} conversion={actions.monedaFormato(100 * customersClicked / customerList.length)} frustrated={customersFrustrated} clicksThisMonth={clicksThisMonth} clicksLastMonth={clicksLastMonth} />
                    <br />
                    {customerList && customerList.length > 0 ?
                        <div className="container-fluid">
                            <div className="row d-flex justify-content-center">
                                <div className="col-sm-12 col-md-4 border border-light justify-content-center align-items-center">
                                    <Graficos
                                        tipo="pie"
                                        titulo="Customers who clicked"
                                        subtitulo="Legend"
                                        etiquetas={
                                            [
                                                "Clicked " + actions.monedaFormato(100 * customersClicked / customerList.length) + "%",
                                                'Not Clicked ' + actions.monedaFormato(100 - 100 * customersClicked / customerList.length) + "%",
                                            ]}
                                        dataY={[
                                            100 * customersClicked / customerList.length,
                                            100 - 100 * customersClicked / customerList.length
                                        ]}
                                        recarga={recarga}
                                        setRecarga={setRecarga}
                                        mouseInfo="Count (%)"
                                    />
                                </div>
                                <div className="col-sm-12 col-md-4 border border-light justify-content-center align-items-center">
                                    <Graficos
                                        tipo="pie"
                                        titulo="SMS sent correctly"
                                        subtitulo="Legend"
                                        etiquetas={
                                            [
                                                "Status: sent " + actions.monedaFormato(100 * sentCount / customerList.length) + "%",
                                                'Other Status ' + actions.monedaFormato(100 - 100 * sentCount / customerList.length) + "%",
                                            ]}
                                        dataY={[
                                            100 * sentCount / customerList.length,
                                            100 - 100 * sentCount / customerList.length
                                        ]}
                                        recarga={recarga}
                                        setRecarga={setRecarga}
                                        mouseInfo="Percentage (%)"
                                    />
                                </div>
                                <div className="col-sm-12 col-md-4 d-flex border border-light justify-content-center align-items-center">
                                    <Graficos
                                        tipo="barra"
                                        titulo="SMS sent correctly vs Clicks"
                                        subtitulo="Legend"
                                        etiquetas={
                                            [
                                                "Status sent: " + sentCount,
                                                'Customers that clicked: ' + customersClicked,
                                            ]}
                                        dataY={[
                                            sentCount,
                                            customersClicked
                                        ]}
                                        recarga={recarga}
                                        setRecarga={setRecarga}
                                        mouseInfo="Counts"
                                    />
                                </div>
                            </div>


                        </div>
                        :
                        <></>}
                    <br />
                    <CRow>
                        <CCol xs>
                            <CCard className="mb-4">
                                <CCardHeader>Traffic</CCardHeader>
                                <CCardBody>
                                    <CRow>
                                        <CCol xs={12} md={6} xl={6}>
                                            <CRow>
                                                <CCol sm={6}>
                                                    <div className="border-start border-start-4 border-start-info py-1 px-3">
                                                        <div className="text-medium-emphasis small">Clicks this month</div>
                                                        <div className="fs-5 fw-semibold">{clicksThisMonth}</div>
                                                    </div>
                                                </CCol>
                                                <CCol sm={6}>
                                                    <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                                                        <div className="text-medium-emphasis small">Clicks last month</div>
                                                        <div className="fs-5 fw-semibold">{clicksLastMonth}</div>
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            <hr className="mt-0" />
                                            {progressGroupExample1.map((item, index) => (
                                                <div className="progress-group mb-4" key={index}>
                                                    <div className="progress-group-header">
                                                        <span className="text-medium-emphasis small">{item.title}</span>
                                                        <span className="ms-auto"><span className="fw-semibold text-primary">{item.value1}% </span><span className="fw-semibold text-danger"> {item.value2}%</span> </span>
                                                    </div>
                                                    <div className="progress-group-bars">
                                                        <CProgress thin color="info" value={item.value1} />
                                                        <CProgress thin color="danger" value={item.value2} />
                                                    </div>
                                                </div>
                                            ))}
                                        </CCol>

                                        <CCol xs={12} md={6} xl={6}>
                                            <CRow>
                                                <CCol sm={6}>
                                                    <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                                                        <div className="text-medium-emphasis small">Devices detected</div>
                                                        <div className="fs-5 fw-semibold">{customersClicked}</div>
                                                    </div>
                                                </CCol>
                                                <CCol sm={6}>
                                                    <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                                                        <div className="text-medium-emphasis small">OS</div>
                                                        <div className="fs-5 fw-semibold">{customersClicked}</div>
                                                    </div>
                                                </CCol>
                                            </CRow>

                                            <hr className="mt-0" />

                                            {progressGroupExample2.map((item, index) => (
                                                <div className="progress-group mb-4" key={index}>
                                                    <div className="progress-group-header">
                                                        <CIcon className="me-2" icon={item.icon} size="lg" />
                                                        <span>{item.title}</span>
                                                        <span className="ms-auto fw-semibold">{item.value}%</span>
                                                    </div>
                                                    <div className="progress-group-bars">
                                                        <CProgress thin color="warning" value={item.value} />
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="mb-5"></div>

                                            {progressGroupExample3.map((item, index) => (
                                                <div className="progress-group" key={index}>
                                                    <div className="progress-group-header">
                                                        <CIcon className="me-2" icon={item.icon} size="lg" />
                                                        <span>{item.title}</span>
                                                        <span className="ms-auto fw-semibold">
                                                            {item.value}{' '}
                                                            <span className="text-medium-emphasis small">({item.percent}%)</span>
                                                        </span>
                                                    </div>
                                                    <div className="progress-group-bars">
                                                        <CProgress thin color="success" value={item.percent} />
                                                    </div>
                                                </div>
                                            ))}
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>

                    <div className="mx-4">
                        <button className="nodrag btn btn-outline-success justify-content-center align-items-center">
                            <CSVLink data={customerList} /* headers={csvHeaders} */ style={{ textDecoration: "none", width: "100%", color: "black" }}>
                                Export to CSV
                            </CSVLink>
                        </button>

                        <MaterialTable
                            columns={columns}
                            data={customerList} //este sería el campo que hay que cambiar
                            title={tituloTabla}
                            actions={[
                                {
                                    icon: "search",
                                    tooltip: "Mostrar",
                                    onClick: (event, rowData) => {
                                        if (2 == 2) {
                                            seleccionarArtista(rowData, "Mostrar")
                                        } else {
                                            alert("No tiene permisos suficientes");
                                        }
                                    },
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
                    </div>
                    <br />
                    <br />                    

                    <Modal open={modalMostrar} onClose={abrirCerrarModalMostrar}>
                        {bodyMostrar}
                    </Modal>

                    <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
                        {bodyEditar}
                    </Modal>

                    <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
                        {bodyEliminar}
                    </Modal>
                </>
            </>


        </div>
    )
}

export default WithAuth(SingleCampaign)
