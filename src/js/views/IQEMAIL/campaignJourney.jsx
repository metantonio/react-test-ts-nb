import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext.js';
//import { Graficos } from "../../components/graficos.jsx";
import { Bar, Pie } from 'react-chartjs-2';
//import 'chartjs-plugin-piechart-outlabels';
import WithAuth from "../../components/Auth/withAuth";
//import WidgetsDropdown from '../../components/WidgetsDropdown';
import MaterialTable from "material-table";
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
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CWidgetStatsA
} from '@coreui/react'
import {
    /* cibCcAmex,
    cibCcApplePay,
    cibCcMastercard,
    cibCcPaypal,
    cibCcStripe,
    cibCcVisa,
    cibGoogle,
    cibFacebook, */
    cibApple,
    /* cibLinkedin,
    cifBr,
    cifEs,
    cifFr,
    cifIn,
    cifPl,
    cifUs,
    cibTwitter,
    cilCloudDownload,
    cilPeople, */
    cilUser,
    cilUserFemale,
    cibAndroid,
    cibWindows,
    cilDevices
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CSVLink } from "react-csv";
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { Link, useParams } from "react-router-dom";

const ClientJourneyComponent = () => {
    const { store, actions } = useContext(Context)
    const [recarga, setRecarga] = useState(false)
    const [totalEmail, setTotalEmail] = useState(80)
    const [openedEmail, setOpenedEmail] = useState(67)
    const [clickedEmail, setClikedEmail] = useState(49)
    const [unsubscribedEmail, setUnsubscribedEmail] = useState(20)
    const [unseenEmail, setUnseenEmail] = useState(13)
    const [topCountries, setTopCountries] = useState({
        "countries": ['USA', 'Canada', 'Italy', 'Germany', 'France', 'Australia', 'Brasil', 'India', 'China', 'Japon'],
        "count": [30, 20, 10, 12, 10, 8, 5, 1, 1, 3]
    })
    const [links, setLinks] = useState([
        { url: "http://example1.com", clicks: 30, type: true },
        { url: "http://example2.com", clicks: 19, type: true },
        { url: "http://example3.com", clicks: 20, type: false },
    ])
    const [template, setTemplate] = useState({ path: './invoice-template.html', url: "example.com" })
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
        { title: 'Mobile', icon: cilArrowTop, value: 53 },
        { title: 'Other', icon: cilArrowTop, value: 43 }
    ])

    const [progressGroupExample3, setProgressExample3] = useState([
        { title: 'iPhone', icon: cilArrowTop, percent: 56, value: '191,235' },
        { title: 'Android', icon: cilArrowTop, percent: 15, value: '51,223' },
        { title: 'Windows', icon: cilArrowTop, percent: 11, value: '37,564' },
        { title: 'Other', icon: cilArrowTop, percent: 8, value: '27,319' }
    ])

    const [dayCounter, setDayCounter] = useState({});
    const [monthCounter, setMonthCounter] = useState({})
    const [yearCounter, setYearCounter] = useState({})
    const [campaignEmail, setCampaignEmail] = useState({ register_date: "2023-08-22", status: "Running" })
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

    const params = useParams(); //Hook de react que obtiene la variable dinámica 'id' de la url

    //Declaración de los endpoints de backend, algunos ejemplos: 
    const urlGet = "/all-email-customers/" + params.id; //endpoint del backend para obtener data
    const urlDelete = "/singleejemplo/delete"; //endpoint  del backend para borrar data
    const urlEdit = "/singleejemplo/update"; //endpoint del backend para actualizar data

    const state = {
        labels: ['Sent', 'Opened', 'Click', 'Unsubscribed', 'Unseen'],
        datasets: [
            {
                axis: 'y',
                label: 'Count',
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#8A2BE2',
                    '#00BFFF'],
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: [totalEmail, openedEmail, clickedEmail, unsubscribedEmail, unseenEmail]
            }
        ]
    }

    const pieData = {
        labels: topCountries.countries,
        datasets: [
            {
                data: topCountries.count,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#8A2BE2',
                    '#00BFFF',
                    '#32CD32',
                    '#FF4500',
                    '#FFD700',
                    '#FFA07A',
                    '#7B68EE',
                ],
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: "left",
                maxWidth: 300
            },
            outlabels: {
                text: '%l %p',
                color: 'black',
                stretch: 30,
                font: {
                    resizable: true,
                    minSize: 12,
                    maxSize: 18
                },
            },
            datalabels: {
                color: 'white', // Color del texto de la etiqueta
                anchor: 'end', // Ancla la etiqueta al final del pedazo de la torta
                align: 'start', // Alinea la etiqueta al inicio del pedazo de la torta
                offset: 5, // Espacio entre la etiqueta y el pedazo de la torta
                font: {
                    weight: 'bold',
                    size: 14,
                },
                formatter: (val, context) => {
                    const totalDatasetSum = context.chart.data.datasets[context.datasetIndex].data;
                    const percentage = val * 100 / totalDatasetSum;
                    const roundedPercentage = Math.round(percentage * 100) / 100
                    return `${roundedPercentage}%`
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label;
                        let value = context.formattedValue;

                        if (!label) {
                            label = 'Unknown'
                        }

                        let sum = 0;
                        let dataArr = context.chart.data.datasets[0].data;
                        dataArr.map(data => {

                            if (data && data != undefined) {
                                sum += parseFloat(data);
                            }

                        });
                        console.log(parseFloat(value.replace(/\./g, "").replace(/\,/g, ".")))
                        let percentage = (parseFloat(value.replace(/\./g, "").replace(/\,/g, ".")) * 100 / sum).toFixed(2) + '%';
                        return label + ": " + percentage;
                    }
                },
                enabled: true
            }
        },
    };


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
            title: "Unsubscribe",
            field: "uncounter",
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
                let sentUncount = 0
                let frustration = 0
                let clickThisMonth = 0
                let clickLastMonth = 0
                let mobileDevice = 0;
                let osCounter = {};
                let dayCounter1 = {};
                let daysInLastMonthCounter = {};
                let monthCounter1 = {};
                let yearCounter1 = {};
                let setUnseen = 0
                let countryCount = {};
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
                    if (response.customers[i]["uncounter"] > 0) {
                        sentUncount++
                    }
                    if (response.customers[i]["uncounter"] == 0 && response.customers[i]["counter"] == 0) {
                        setUnseen++
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

                    let country = response.customers[i]["country"];

                    // Si el país ya existe en el objeto countryCount, incrementa su contador.
                    if (countryCount[country]) {
                        countryCount[country]++;
                    } else {
                        // Si no existe, inicializa el contador en 1.
                        countryCount[country] = 1;
                    }
                }
                const countries = Object.keys(countryCount);
                const repeated = Object.values(countryCount);
                let objTempCountry = {
                    countries: countries,
                    count: repeated
                }
                setTopCountries(objTempCountry)
                setCustomersClicked(clickCount)
                setClikedEmail(clickCount)
                setSentCount(sentCount)
                setUnsubscribedEmail(sentUncount)
                setOpenedEmail(clickCount + sentUncount)
                setTotalEmail(response.customers.length)
                setCustomerFrustrated(frustration)
                setDayCounter(dayCounter1)
                setMonthCounter(monthCounter1)
                setYearCounter(yearCounter1)
                setUnseenEmail(setUnseen)
                setClicksThisMonth(clickThisMonth)
                setClicksLastMonth(clickLastMonth)
                setCampaignEmail({ ...campaignEmail, ...response.campaign })
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



    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-auto bg-light sticky-top">
                    <div className="d-flex flex-sm-column flex-row flex-nowrap bg-light align-items-center sticky-top">
                        <Link to="/main" className="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                            <i className="bi-bootstrap fs-1"></i>
                        </Link>
                        <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center align-items-center">
                            <li className="nav-item">
                                <Link to="/main" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Home">
                                    <i className="fas fa-home"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Dashboard">
                                    <i className="fas fa-tachometer-alt"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Orders">
                                    <i className="fas fa-clipboard-list"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Products">
                                    <i className="fas fa-heart"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="nav-link py-3 px-2" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Customers">
                                    <i className="fas fa-user-tag"></i>
                                </Link>
                            </li>
                        </ul>
                        <div className="dropdown">
                            <Link to="#" className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="far fa-envelope"></i>
                            </Link>
                            <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
                                <li><Link className="dropdown-item" to="#">New project...</Link></li>
                                <li><Link className="dropdown-item" to="#">Settings</Link></li>
                                <li><Link className="dropdown-item" to="#">Profile</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-sm p-3 min-vh-100" style={{overflowY:"scroll"}}>
                    {/* <!-- content --> */}
                    <div className='container'>
                        <h1>Campaign Journey</h1>
                        <br />
                        <div className='row d-flex justify-content-center align-items-center'>
                            <div className='col-sm-12 col-md-4 justify-content-center align-items-center'>
                                <h3 className='text-center'>Top 10 Countries</h3>
                                <Pie data={pieData} options={options} />
                            </div>

                            <div className='col-sm-12 col-md-8 justify-content-center align-items-center align-self-center'>
                                <h3 className='text-center'>Total emails</h3>
                                <Bar data={state} options={{
                                    indexAxis: 'y'
                                }} />
                            </div>
                        </div>
                        <CRow>
                            <CCol sm={6} lg={4}>
                                <CWidgetStatsA
                                    className="mb-4"
                                    color="primary"
                                    value={
                                        <>
                                            {totalEmail > 0 ? totalEmail : '0'}{' '}
                                            <span className="fs-6 fw-normal">
                                                (+0% <CIcon icon={cilArrowTop} />)
                                            </span>
                                        </>
                                    }
                                    title="Sent"
                                    action={
                                        <CDropdown alignment="end">
                                            <CDropdownToggle color="transparent" caret={false} className="p-0">
                                                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                                            </CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem>Action</CDropdownItem>
                                                <CDropdownItem>Another action</CDropdownItem>
                                                <CDropdownItem>Something else here...</CDropdownItem>
                                                <CDropdownItem disabled>Disabled action</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                    }
                                    chart={
                                        <CChartLine
                                            className="mt-3 mx-3"
                                            style={{ height: '70px' }}
                                            data={{
                                                labels: ['Total'],
                                                datasets: [
                                                    {
                                                        label: '',
                                                        backgroundColor: 'transparent',
                                                        borderColor: 'rgba(255,255,255,.55)',
                                                        pointBackgroundColor: getStyle('--cui-primary'),
                                                        data: [totalEmail],
                                                    },
                                                ],
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        display: false,
                                                    },
                                                },
                                                maintainAspectRatio: false,
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            display: false,
                                                            drawBorder: false,
                                                        },
                                                        ticks: {
                                                            display: false,
                                                        },
                                                    },
                                                    y: {
                                                        min: 30,
                                                        max: 89,
                                                        display: false,
                                                        grid: {
                                                            display: false,
                                                        },
                                                        ticks: {
                                                            display: false,
                                                        },
                                                    },
                                                },
                                                elements: {
                                                    line: {
                                                        borderWidth: 1,
                                                        tension: 0.4,
                                                    },
                                                    point: {
                                                        radius: 4,
                                                        hitRadius: 10,
                                                        hoverRadius: 4,
                                                    },
                                                },
                                            }}
                                        />
                                    }
                                />
                            </CCol>
                            <CCol sm={6} lg={4}>
                                <CWidgetStatsA
                                    className="mb-4"
                                    color="info"
                                    value={
                                        <>
                                            {clickedEmail > 0 ? clickedEmail : '0'}{' '}
                                            <span className="fs-6 fw-normal">
                                                ({100 * clickedEmail / totalEmail}% <CIcon icon={cilArrowTop} />)
                                            </span>
                                        </>
                                    }
                                    title="Clicked"
                                    action={
                                        <CDropdown alignment="end">
                                            <CDropdownToggle color="transparent" caret={false} className="p-0">
                                                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                                            </CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem>Action</CDropdownItem>
                                                <CDropdownItem>Another action</CDropdownItem>
                                                <CDropdownItem>Something else here...</CDropdownItem>
                                                <CDropdownItem disabled>Disabled action</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                    }
                                    chart={
                                        <CChartLine
                                            className="mt-3 mx-3"
                                            style={{ height: '70px' }}
                                            data={{
                                                labels: ['Total'],
                                                datasets: [
                                                    {
                                                        label: '',
                                                        backgroundColor: 'transparent',
                                                        borderColor: 'rgba(255,255,255,.55)',
                                                        pointBackgroundColor: getStyle('--cui-primary'),
                                                        data: [clickedEmail],
                                                    },
                                                ],
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        display: false,
                                                    },
                                                },
                                                maintainAspectRatio: false,
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            display: false,
                                                            drawBorder: false,
                                                        },
                                                        ticks: {
                                                            display: false,
                                                        },
                                                    },
                                                    y: {
                                                        min: 30,
                                                        max: 89,
                                                        display: false,
                                                        grid: {
                                                            display: false,
                                                        },
                                                        ticks: {
                                                            display: false,
                                                        },
                                                    },
                                                },
                                                elements: {
                                                    line: {
                                                        borderWidth: 1,
                                                        tension: 0.4,
                                                    },
                                                    point: {
                                                        radius: 4,
                                                        hitRadius: 10,
                                                        hoverRadius: 4,
                                                    },
                                                },
                                            }}
                                        />
                                    }
                                />
                            </CCol>
                            <CCol sm={6} lg={4}>
                                <CWidgetStatsA
                                    className="mb-4"
                                    color="danger"
                                    value={
                                        <>
                                            {unsubscribedEmail > 0 ? unsubscribedEmail : '0'}{' '}
                                            <span className="fs-6 fw-normal">
                                                ({100 * unsubscribedEmail / totalEmail}% <CIcon icon={cilArrowBottom} />)
                                            </span>
                                        </>
                                    }
                                    title="Unsubscribed"
                                    action={
                                        <CDropdown alignment="end">
                                            <CDropdownToggle color="transparent" caret={false} className="p-0">
                                                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                                            </CDropdownToggle>
                                            <CDropdownMenu>
                                                <CDropdownItem>Action</CDropdownItem>
                                                <CDropdownItem>Another action</CDropdownItem>
                                                <CDropdownItem>Something else here...</CDropdownItem>
                                                <CDropdownItem disabled>Disabled action</CDropdownItem>
                                            </CDropdownMenu>
                                        </CDropdown>
                                    }
                                    chart={
                                        <CChartLine
                                            className="mt-3 mx-3"
                                            style={{ height: '70px' }}
                                            data={{
                                                labels: ['Total'],
                                                datasets: [
                                                    {
                                                        label: '',
                                                        backgroundColor: 'transparent',
                                                        borderColor: 'rgba(255,255,255,.55)',
                                                        pointBackgroundColor: getStyle('--cui-primary'),
                                                        data: [unsubscribedEmail],
                                                    },
                                                ],
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        display: false,
                                                    },
                                                },
                                                maintainAspectRatio: false,
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            display: false,
                                                            drawBorder: false,
                                                        },
                                                        ticks: {
                                                            display: false,
                                                        },
                                                    },
                                                    y: {
                                                        min: 30,
                                                        max: 89,
                                                        display: false,
                                                        grid: {
                                                            display: false,
                                                        },
                                                        ticks: {
                                                            display: false,
                                                        },
                                                    },
                                                },
                                                elements: {
                                                    line: {
                                                        borderWidth: 1,
                                                        tension: 0.4,
                                                    },
                                                    point: {
                                                        radius: 4,
                                                        hitRadius: 10,
                                                        hoverRadius: 4,
                                                    },
                                                },
                                            }}
                                        />
                                    }
                                />
                            </CCol>
                        </CRow>
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
                        <CRow>
                            <CCol sm={12} lg={4}>
                                <ol className="list-group list-group-numbered">
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{"Marketing Link"}</div>
                                            {campaignEmail && campaignEmail.url ? campaignEmail.url : ""}
                                        </div>
                                        <span className="badge bg-primary rounded-pill">{clickedEmail}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{"Message"}</div>
                                            {campaignEmail && campaignEmail.message ? campaignEmail.message : ""}
                                        </div>
                                        {/* <span className="badge bg-primary rounded-pill">{clickedEmail}</span> */}
                                    </li>
                                </ol>
                            </CCol>
                            <CCol sm={12} lg={8}>
                                <ol className="list-group list-group-numbered">
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">Template</div>
                                            {campaignEmail && campaignEmail.template ? campaignEmail.template : ""}
                                        </div>
                                        <button className="badge bg-primary rounded-pill" onClick={() => { window.open(template.url, '_blank') }}>Show Template</button>
                                    </li>
                                </ol>
                            </CCol>
                        </CRow>
                        <br />
                        <h2>Campaign Properties</h2>
                        <br />
                        <CRow>
                            <CCol sm={12} lg={12}>
                                <ul className="list-group list-group-numbered">
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">Started</div>
                                            {campaignEmail.register_date ? campaignEmail.register_date : ""}
                                        </div>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-start">
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">Status</div>
                                            {campaignEmail.status ? "Running" : "Stopped"}
                                        </div>
                                    </li>
                                </ul>
                            </CCol>
                        </CRow>

                    </div>
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
                                /* {
                                    icon: "search",
                                    tooltip: "Mostrar",
                                    onClick: (event, rowData) => {
                                        if (2 == 2) {
                                            seleccionarArtista(rowData, "Mostrar")
                                        } else {
                                            alert("No tiene permisos suficientes");
                                        }
                                    },
                                }, */
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
                </div>
            </div>
        </div>

    );
};

export default ClientJourneyComponent;
