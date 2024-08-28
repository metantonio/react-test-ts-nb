import React, { useEffect, useContext, useState } from 'react';
import styles from "./index.module.css";
import Swal from 'sweetalert2';
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
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';
import { Bar, Pie } from 'react-chartjs-2';

const Widget1 = (props) => {
    const [totalAmount, setTotalAmount] = useState(props.xValue ? props.xValue : 80)
    const [xlabel, setXLabel] = useState(props.xlabel ? props.xlabel : ["Test"])
    const [color, setColor] = useState(props.color ? props.color : "info")
    useEffect(() => { console.log(color) }, [color])

    function obtenerMayorYMenor(arreglo) {
        if (arreglo.length === 0) {
            return "El arreglo está vacío.";
        }

        let mayor = arreglo[0];
        let menor = arreglo[0];

        for (let i = 1; i < arreglo.length; i++) {
            if (arreglo[i] > mayor) {
                mayor = arreglo[i];
            }
            if (arreglo[i] < menor) {
                menor = arreglo[i];
            }
        }

        return { mayor: mayor, menor: menor };
    }

    function calcularPorcentaje(arr) {
        // Verificar que el arreglo tenga al menos dos elementos
        if (arr.length < 2) {
            return "El arreglo debe tener al menos dos elementos para calcular el porcentaje.";
        }

        // Obtener los dos últimos valores del arreglo
        const ultimoValor = arr[arr.length - 1];
        const penultimoValor = arr[arr.length - 2];

        // Calcular la diferencia entre los dos últimos valores
        const diferencia = ultimoValor - penultimoValor;

        // Calcular el porcentaje de aumento o reducción
        const porcentaje = (diferencia / penultimoValor) * 100;

        return porcentaje;
    }

    return (
        <CWidgetStatsA
            className="mb-4"
            color={color}
            value={
                <>
                    {totalAmount[totalAmount.length - 1]}{' '}
                    <span className="fs-6 fw-normal">
                        ({calcularPorcentaje(totalAmount)}% {calcularPorcentaje(totalAmount) > 0 ? <CIcon icon={cilArrowTop} /> : <CIcon icon={cilArrowBottom} />} from {totalAmount.length > 1 ? totalAmount[totalAmount.length - 2] : "0"})
                    </span>
                </>
            }
            title={props.title ? props.title : "Total"}
            action={
                <CDropdown alignment="end">
                    <CDropdownToggle color="transparent" caret={false} className="p-0" style={{ margin: "0px 15px 0px 5px" }}>
                        <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem><button onClick={e => { setColor("info") }}>Color 1</button></CDropdownItem>
                        <CDropdownItem><button onClick={e => { setColor("primary") }}>Color 2</button></CDropdownItem>
                        <CDropdownItem><button onClick={e => { setColor("danger") }}>Color 3</button></CDropdownItem>
                        <CDropdownItem><button onClick={e => { setColor("warning") }}>Color 4</button></CDropdownItem>
                        <CDropdownItem disabled>Disabled action</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
            }
            chart={
                <CChartLine
                    className="mt-3 mx-3"
                    style={{ height: '150px' }}
                    data={{
                        labels: xlabel,
                        datasets: [
                            {
                                label: '',
                                backgroundColor: 'transparent',
                                borderColor: 'rgba(255,255,255,.55)',
                                pointBackgroundColor: getStyle('--cui-primary'),
                                data: Array.isArray(totalAmount) ? totalAmount : [totalAmount],
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
                                display: true,
                                grid: {
                                    display: true,
                                    drawBorder: false,
                                },
                                ticks: {
                                    display: true,
                                },
                            },
                            y: {
                                min: obtenerMayorYMenor(props.xValue ? props.xValue : [80]).menor - 10,
                                max: obtenerMayorYMenor(props.xValue ? props.xValue : [80]).mayor + 10,
                                display: true,
                                grid: {
                                    display: true,
                                },
                                ticks: {
                                    display: true,
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
    )
}

const BarChart = (props) => {
    const [data, setData] = useState(props.data ? props.data : {
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
                data: [10, 3, 1, 1, 7]
            }
        ]
    })
    return (
        <Bar data={data} options={{
            indexAxis: 'y'
        }} />
    )
}

const PieChart = (props) => {
    const [data, setData] = useState(props.data ? props.data : {
        labels: ["USA", "CHINA"],
        datasets: [
            {
                data: [75, 25],
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
    })

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
    return (
        <Pie data={data} options={options} />
    )
}

const FirstSlide = (props) => {
    return (<div className='mx-4'>
        First Slide {props.index}
        {props.graph.type == "pie" ? <PieChart /> : <></>}
        {props.graph.type == "bar" ? <BarChart /> : <></>}
        {props.graph.type == "line" ? <Widget1 xValue={props.graph.xValue} xlabel={props.graph.xlabel} title={"Test"} /> : <></>}
    </div>)
}

export default FirstSlide;