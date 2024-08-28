import React, { useState, useEffect, useContext } from "react";
import PropTypes, { number } from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Redirect, useHistory } from "react-router-dom";
import { Context } from "../store/appContext";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Button } from "@material-ui/core";
import Chart from 'chart.js/auto';
import { Pie, Bar } from "react-chartjs-2";
import { getRelativePosition } from 'chart.js/helpers';
/* import "../../styles/registrojuridico.css"; */

export const Graficos = (props) => {

    const { store, actions } = useContext(Context);
    const [grafica, setGrafica] = useState(undefined);
    const [recargaGrafica, setRecargaGrafica] = useState(false)


    //la data del gráfico la trato como un estado
    const [chartData, setChartData] = useState({
        labels: props.etiquetas ? props.etiquetas.map((label, index) => `${label}: ${props.dataY[index]}`) : [2020, 2021, 2022],
        datasets: [
            {
                label: props.mouseInfo ? props.mouseInfo : "Leyenda",
                data: props.dataY ? props.dataY : [55, 23, 96],
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
                borderColor: "black",
                borderWidth: 2
            }
        ]
    });

    const chart = () => {
        switch (props.tipo) {
            case "pie":
                return (
                    <div className="chart-container">
                        <h2 style={{ textAlign: "center" }}>{props.titulo ? props.titulo : "Gráfico tipo Pie"}</h2>
                        <Pie
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: props.subtitulo ? props.subtitulo : "Subtítulo"
                                    },
                                    legend: {
                                        position: "left",
                                        maxWidth: 300
                                    },
                                    datalabels: {
                                        color: 'white',
                                        display: true,
                                        backgroundColor: function (context) {
                                            return context.dataset.backgroundColor;
                                        },
                                        formatter: (val, context) => {
                                            const totalDatasetSum = context.chart.data.datasets[context.datasetIndex].data.reduce((a, b) => (a + b), 0);
                                            const percentage = val * 100 / totalDatasetSum;
                                            const roundedPercentage = Math.round(percentage * 100) / 100
                                            return `${roundedPercentage}%`
                                        }
                                    },
                                    /* labels: {
                                        render: 'percentage',
                                        precision: 2
                                    }, */
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
                                animation: {
                                    duration: 100
                                }
                            }
                            }
                        />
                    </div>
                );
                break;
            case "barra":
                return (
                    <div className="chart-container">
                        <h2 style={{ textAlign: "center" }}>{props.titulo ? props.titulo : "Gráfico de Barras"}</h2>
                        <Bar
                            data={chartData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: props.subtitulo ? props.subtitulo : "Subtítulo"
                                    },
                                    legend: {
                                        display: false
                                    }
                                }
                            }}
                        />
                    </div>
                )
                break;
            case "line":
                return (
                    <div className="chart-container">
                        <h2 style={{ textAlign: "center" }}>{props.titulo ? props.titulo : "Gráfico de Línea"}</h2>
                        <Line
                            data={chartData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: props.subtitulo ? props.subtitulo : "Subtítulo"
                                    },
                                    legend: {
                                        display: false
                                    }
                                }
                            }}
                        />
                    </div>
                )

                break;
            default:
                return (
                    <div className="chart-container">
                        <h2 style={{ textAlign: "center" }}>{props.titulo ? props.titulo : "Gráfico de Línea"}</h2>
                        <Line
                            data={chartData}
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: props.subtitulo ? props.subtitulo : "Subtítulo"
                                    },
                                    legend: {
                                        display: false
                                    }
                                }
                            }}
                        />
                    </div>
                )
                break;


        }
    };

    useEffect(() => {
        setChartData({
            labels: props.etiquetas ? props.etiquetas : [2020, 2021, 2022],
            datasets: [
                {
                    label: props.mouseInfo ? props.mouseInfo : "Leyenda",
                    data: props.dataY ? props.dataY : [55, 23, 96],
                    backgroundColor: [
                        "rgba(58,29,201,1)",
                        "rgba(255,255,0,1)",
                        "rgba(255,0,0,1)",
                        "#rgba(0,255,0,1)",
                        "rgba(0,255,255,1)",
                        "rgba(0,0,255,1)",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                    datalabels: {
                        color: '#FFCE56'
                    }
                }
            ]
        })
        chart()
        //console.log(chartData.datasets.data)
    }, [recargaGrafica, props.recarga])

    useEffect(() => {
        setChartData({
            labels: props.etiquetas ? props.etiquetas : [2020, 2021, 2022],
            datasets: [
                {
                    label: props.mouseInfo ? props.mouseInfo : "Leyenda",
                    data: props.dataY ? props.dataY : [55, 23, 96],
                    backgroundColor: [
                        "rgba(58,29,201,1)",
                        "rgba(255,255,0,1)",
                        "rgba(255,0,0,1)",
                        "#rgba(0,255,0,1)",
                        "rgba(0,255,255,1)",
                        "rgba(0,0,255,1)",
                    ],
                    borderColor: "black",
                    borderWidth: 2
                }
            ]
        }, () => console.log(chartData))        
        chart()
    }, [props.dataY])

    return (
        <div id="graficos-componente">
            {chart()}
        </div>
    )
}

