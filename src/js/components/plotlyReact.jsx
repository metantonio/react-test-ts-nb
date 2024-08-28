import React from 'react';
import Plot from 'react-plotly.js';

const MyPlot = (props) => {
    const data = [ //example of an array where i want group products with similar name, and compare price vs date
        {
            "date": "2023-03-21T15:36:22.404Z",
            "id": 1,
            "name": "Club Corona (5.5\"x44)",
            "price": 64.99,
            "quantity": "Box of 20",
            "stock": "In Stock",
            "web": "https://www.cigarsinternational.com/p/cuba-libre-cigars/1466937/",
            "website": "CigarsInternational.com"
        },
        // more objects here
    ];

    function getRandomColor() {
        let letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    if (props.filtered) {
        const filteredData = props.data.filter((obj) => {
            const similarity = obj[`${props.property}`].localeCompare(props.text, undefined, { sensitivity: 'base' }) / obj[`${props.property}`].length;
            return similarity >= 0.1;
        });
        props.data = filteredData
    }

    let result;
    if (props.reduce) {
        result = props.data.reduce((acc, curr) => { //reduce a un objeto cuyas keys coinciden con una propiedad de objeto del arreglo pasado, y los valores resultantes son arreglos
            const website = curr[props.reduce];
            if (!acc[website]) {
                acc[website] = [];
            }
            acc[website].push(curr);
            return acc;
        }, {});
        console.log("reducido: ", result)
    }
    let xAxis;
    let yAxis;
    let chartData;
    let chartLayout;

    if (props.easymode) {
        //console.log("xAxis = ", props.data.x_axis)
        xAxis = props.data.x_axis
        //console.log("xAxis = ", xAxis)
        yAxis = props.data.y_axis
        chartData = [ //example of chart data
            {
                x: xAxis,
                y: yAxis,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'red' },
                name: props.text,
                hovertemplate: `${props.text} %{y}<extra></extra>`
            },
        ];
        chartLayout = { //example
            title: props.text ? props.text : 'Price vs Date',
            xaxis: {
                title: props.xAxisText ? props.xAxisText : 'Date',
                //tickmode: 'linear',
                //tickformat: '%Y-%m-%d Hour: %H',
                //dtick: 12 * 60 * 60 * 1000 // steps of 12 hours in milliseconds
            },
            yaxis: { title: props.yAxisText ? props.yAxisText : 'Price' },
        };

    } else {
        xAxis = props.data.map((obj) => {
            if (props.xAxis != "date") {
                return obj[`${props.xAxis}`]
            }
            else {
                let toDate = new Date(Date.parse(obj[`${props.xAxis}`]))
                const formattedDate = toDate.toISOString().split('T')[0];
                //obj[`${props.xAxis}`] = formattedDate
                return formattedDate
            }
        })
        yAxis = props.data.map((obj) => obj[`${props.yAxis}`]);
        chartData = [ //example of chart data
            {
                x: xAxis,
                y: yAxis,
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'red' },
                name: props.text,
                hovertemplate: `${props.text} %{y}<extra></extra>`
            },
        ];
        chartLayout = { //example
            title: props.text ? props.text : 'Price vs Date',
            xaxis: {
                title: props.xAxisText ? props.xAxisText : 'Date',
                tickmode: 'linear',
                tickformat: '%Y-%m-%d Hour: %H',
                dtick: 12 * 60 * 60 * 1000 // steps of 12 hours in milliseconds
            },
            yaxis: { title: props.yAxisText ? props.yAxisText : 'Price' },
        };
    }


    if (props.reduce) { //props.reduce debería ser el nombre de la key que quiero reducir
        chartData = []
        for (let item in result) {
            chartData.push({
                x: result[item].map((obj) => {
                    if (props.xAxis != "date") {
                        return obj[props.xAxis]
                    }
                    else {
                        let toDate = new Date(Date.parse(obj[props.xAxis]))
                        const formattedDate = toDate.toISOString().split('T')[0];
                        //obj[`${props.xAxis}`] = formattedDate
                        return formattedDate
                    }
                }),
                y: result[item].map((obj) => obj[props.yAxis]),
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: `${getRandomColor()}` },
                name: `${item} + ${props.text ? props.text : ""}`,
                hovertemplate: `${item} %{y}<extra></extra>`
            })
        }
        //console.log(chartData)
    }

    
    return (
        <Plot
            data={chartData}
            layout={chartLayout}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler
            config={{ displayModeBar: true }}
            onUpdate={(figure) => this.setState(figure)}
        />
    );
}

export default MyPlot;