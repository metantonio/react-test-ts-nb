import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../store/appContext.js";
import logo from "../../../img/logo.png"
import 'tailwindcss/tailwind.css';
import styles from "./clean.module.css";
import io from 'socket.io-client';
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import { Modal } from "@material-ui/core";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import Swal from 'sweetalert2';

import WithAuth from '../../components/Auth/withAuth.js';
import UserMenu from "./user_menu.jsx";
import Folder from "./folder.jsx";
import ImportFiles from "./import_files.jsx";
import BookLoader from '../Loading/bookloader';
import WidgetHistorial from "./widgetHistorial.jsx";
const ClientList = React.lazy(() => import('../IQSMS/customerList.jsx'));
const CampaignEmailList = React.lazy(() => import('../IQEMAIL/campaignEmailList.jsx'));
import WidgetVector from "./widgetVector.jsx";

const ImageWrapper = ({ src, alt, className }) => (
    <img loading="lazy" src={src} alt={alt} className={className} />
);

const IconWrapper = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} />
);

const LoadingComponent2 = () => {
    return (
        <div className="spinner-border text-warning" role="status" aria-hidden="true">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}

const themes = [
    {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/0fe6fec31da750776d4a272e76a6e745845b85e8371d0f164fabdc911a5c95fc?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
        image: "https://cdn.builder.io/api/v1/image/assets/TEMP/2424d849c8fa2cd3270de0adf0ab984cd9a6ea19f1fb7374746a9e76a6edf385?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
        logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/5a27d3a0bb2df6275a41b7f53817484e473384ed1a0da4c0175a470ccdfc9ea0?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
    },
    {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1a70df36917996e4d5ea8261a968118afe4096e5b34002d5667fcbd7c52b3dbd?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
        image: "https://cdn.builder.io/api/v1/image/assets/TEMP/4580278734df2e8c92c43f3909036ec75c97afe30217aa55bbfa5040ebb9d8c8?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
        logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/fbb24143104dff1b868f7baabd20e2e4372cebce22fabb39737a6e4a4474e467?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
    },
    {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/db07f10e5c2833dd0148b2d5cfa84f5b81d1d776be3359c3827d7d64d8341f25?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
        image: "https://cdn.builder.io/api/v1/image/assets/TEMP/a65205fefa3113291a34c35f03a16c1f28c7eb084527690091170d5e2d39188a?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
        logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/a2629bc07c36563e7d270bfc506d53251317d47322a67d3d741e325a50506a31?apiKey=0bc53d04746e448b89d04dabbe0c1025&",
    },
];

const ThemeColumn = ({ theme }) => (
    <div className="theme-column">
        <div className="theme-content">
            <IconWrapper src={theme.icon} alt="" className={`${styles.icon}`} />
            <ImageWrapper src={theme.image} alt="" className={`${styles.image}`} />
            <IconWrapper src={theme.logo} alt="" className={`${styles.logo}`} />
        </div>
    </div>
);

const RenderText = ({ texto, setOutputValue2, outputValue2, loading, setLoading, inputValue3, selectedDB }) => {
    const { store, actions } = useContext(Context);
    const [newText, setNewText] = useState("")
    const [modalAIAn, setModalAIAn] = useState(false)
    const [aiAnalysis, setAiAnalysis] = useState({ code: null, firstRow: null, left: null })
    const [promptAI, setPromptAI] = useState(null)
    const [newTableLoaded, setNewTableLoaded] = useState(false)

    const openCloseModalAIAn = () => {
        setNewTableLoaded(!newTableLoaded)
        setModalAIAn(!modalAIAn)
    }
    // Expresión regular para dividir la cadena de texto
    let fragments = texto.split(/(<code[^>]*>[\s\S]*?<\/code>)/g);
    const IA_URL = process.env.IA_URL;
    const handleSendInput4 = async (value = inputValue3) => {
        console.log("executed handleSendInput4")
        const URL_QUERY_SQL = IA_URL + '/completions/sql-query';
        if (store.group_context_filter_db[0] == null) {
            alert("Please select a database")
            return
        }
        //console.log("value: ", value)
        let data2 = {
            prompt: value,
            database_id: store.group_context_filter_db[0]
        }
        setLoading(true)
        try {
            let response = await fetch(URL_QUERY_SQL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(data2)

            });
            //console.log(response)
            if (response.ok) {
                setLoading(false)

                response = await response.json()
                //console.log(response)

                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " \n" + response["choices"][0]["message"]["content"]
                    setOutputValue2(tempText)
                } else {
                    setOutputValue2(response["choices"][0]["message"]["content"])
                }

            } else {
                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " \n" + "ERROR"
                    setOutputValue2(tempText)
                } else {
                    setOutputValue2("ERROR")
                }
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log("error")
        }
    }
    const textToTableHTML = (textValue, tableIndex) => {
        if (textValue.includes('<code')) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = textValue;
            let codigo = tempDiv.querySelector('code');
            let textoDentroDeCode = codigo.textContent;
            textValue = textoDentroDeCode
        }

        let filas = textValue.trim().split('|row| ');
        let tablaHTML = `<table class="table table-bordered table-striped" id="table-no-${tableIndex}"><thead><tr>`;
        let tablaHTML2 = `<table class="table table-bordered table-striped" id="table-no-${tableIndex}"><thead><tr>`;

        // Encabezados
        let encabezados = filas[0].split('|col| ');
        encabezados.forEach(function (encabezado) {
            tablaHTML += '<th>' + encabezado + '</th>';
            tablaHTML2 += '<th>' + encabezado + '</th>';
        });

        tablaHTML += '</tr></thead><tbody>';
        tablaHTML2 += '</tr></thead><tbody>';
        let id = `tableindex-${tableIndex}`
        // Filas de datos
        let datos = []
        for (let i = 1; i < filas.length; i++) {
            datos = filas[i].replace("\n", "").split('|col| ');
            if (i < 4) {
                tablaHTML += '<tr>';
                datos.forEach(function (dato) {
                    if (dato != "") {
                        tablaHTML += '<td>' + dato + '</td>';
                        //id = dato.toString()
                        //console.log('<td>' + dato + '</td>')
                    }
                });
                tablaHTML += '</tr>';
            }
            tablaHTML2 += '<tr>';
            datos.forEach(function (dato) {
                if (dato != "") {
                    tablaHTML2 += '<td>' + dato + '</td>';
                    //console.log('<td>' + dato + '</td>')
                }
            });
            tablaHTML2 += '</tr>';
            datos = []
        }
        const miniFunc = (contentHTML) => {
            let botonAbrirVentana = document.getElementById(id);
            if (botonAbrirVentana) {
                botonAbrirVentana.addEventListener("click", () => {
                    let ventanaNueva = window.open("", "_blank");
                    ventanaNueva.document.open();
                    ventanaNueva.document.write(contentHTML);
                    ventanaNueva.document.close();
                });
            }
        }

        /* document.getElementById(id).addEventListener('click', function () {
                // Contenido HTML que quieres mostrar en la nueva ventana                      
                // Crear una nueva ventana
                var nuevaVentana = window.open('', '_blank');

                // Escribir el contenido HTML en la nueva ventana
                nuevaVentana.document.open();
                nuevaVentana.document.write(tablaHTML2);
                nuevaVentana.document.close();
        }); */

        //tablaHTML2 += `</tbody></table><button id="${id}">Open in a new window</button>`;
        tablaHTML2 += `</tbody></table>`;
        tablaHTML += `</tbody></table><button id="${id}">Load More...</button>`;
        //console.log(tablaHTML)
        return tablaHTML2;
    }

    const textToCSV = (textValue) => {
        if (textValue.includes('<code')) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = textValue;
            let codigo = tempDiv.querySelector('code');
            let textoDentroDeCode = codigo.textContent;
            textValue = textoDentroDeCode
        }
        let lineas = textValue.trim().split('|row| ');
        let csv = '';

        // Procesar encabezados
        let encabezados = lineas[0].split('|col| ');
        csv += encabezados.join(',') + '\n';

        // Procesar filas de datos
        for (let i = 1; i < lineas.length; i++) {
            let datos = lineas[i].split('|col| ');
            csv += datos.join(',') + '\n';
        }
        return csv;
    }

    const descargarCSV = (textValue, nombreArchivo = "table.csv") => {
        let contenido = textToCSV(textValue)
        let blob = new Blob([contenido], { type: 'text/csv;charset=utf-8' });
        let url = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', nombreArchivo);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleIAanalysis = async (dictionary) => {
        console.log("executed handleSendInput4")
        const URL_QUERY_SQL = IA_URL + '/completions/sql-query/analysis';
        if (store.group_context_filter_db[0] == null) {
            alert("Please select a database")
            return
        }
        openCloseModalAIAn()
        setModalAIAn(false)
        //console.log("table: ", dictionary)
        let data2 = {
            table: dictionary.code,
            database_id: store.group_context_filter_db[0],
            row_head: dictionary.firstRow,
            row_one: dictionary.left,
            prompt: promptAI
        }
        let endFunction = false
        /* Swal.fire({
            input: "text",
            position: 'top-end',
            inputLabel: "Message",
            inputPlaceholder: "Type what kind of analysis you requiere, or cancel to let AI decide.",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                
            } else {
                // If the user clicks the cancel button, you can handle it here.
                console.log("cancel button pressed")
                setLoading(false)
                endFunction = true
                return;
            }
        }) */

        /* if (endFunction) {
            return
        } */

        //console.log(result.value)
        //Swal.fire(result.value);
        //data2["prompt"] = result.value
        setLoading(true)
        try {
            let response = await fetch(URL_QUERY_SQL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(data2)

            });
            //console.log(response)

            if (response.ok) {
                setLoading(false)

                response = await response.json()
                //console.log(response)

                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " \n" + response["choices"][0]["message"]["content"]
                    if (response["choices"][0]["plot"]) {
                        let plotImg = new Image();
                        plotImg.src = `data:image/png;base64, ${response["choices"][0]["plot"]}`
                        tempText = `<img src='data:image/png;base64, ${response["choices"][0]["plot"]}' loading="lazy"/>`
                    }
                    setOutputValue2(outputValue2 + " \n" + promptAI + "\n" + response["choices"][0]["message"]["content"] + "<br/>" + " \n" + tempText + "\n" + "<br/>")
                } else {
                    setOutputValue2(outputValue2 + " \n" + promptAI + "\n" + response["choices"][0]["message"]["content"] + "\n" + "<br/>")
                }

            } else {
                response = await response.json()
                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " \n" + response["mensaje"] + "<br/>"
                    setOutputValue2(" \n" + tempText)
                } else {
                    setOutputValue2("\n" + outputValue2 + " \n" + response["mensaje"] + "<br/>")
                }
            }
            setLoading(false)

        } catch (err) {
            setLoading(false)
            console.log("error")
        }
    }

    const handleIAanalysisError = async (dictionary) => {
        console.log("executed handleSendInput4")
        const URL_QUERY_SQL = IA_URL + '/completions/sql-query/analysis/error';
        if (store.group_context_filter_db[0] == null) {
            alert("Please select a database")
            return
        }
        openCloseModalAIAn()
        setModalAIAn(false)
        //console.log("table: ", dictionary)
        let data2 = {
            table: dictionary.code,
            database_id: store.group_context_filter_db[0],
            row_head: dictionary.firstRow,
            row_one: dictionary.left,
            prompt: promptAI
        }
        let endFunction = false
        /* Swal.fire({
            input: "text",
            position: 'top-end',
            inputLabel: "Message",
            inputPlaceholder: "Type what kind of analysis you requiere, or cancel to let AI decide.",
            showCancelButton: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                
            } else {
                // If the user clicks the cancel button, you can handle it here.
                console.log("cancel button pressed")
                setLoading(false)
                endFunction = true
                return;
            }
        }) */

        /* if (endFunction) {
            return
        } */

        //console.log(result.value)
        //Swal.fire(result.value);
        //data2["prompt"] = result.value
        setLoading(true)
        try {
            let response = await fetch(URL_QUERY_SQL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(data2)

            });
            //console.log(response)

            if (response.ok) {
                setLoading(false)

                response = await response.json()
                //console.log(response)

                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " \n" + response["choices"][0]["message"]["content"]
                    if (response["choices"][0]["plot"]) {
                        let plotImg = new Image();
                        plotImg.src = `data:image/png;base64, ${response["choices"][0]["plot"]}`
                        tempText = `<img src='data:image/png;base64, ${response["choices"][0]["plot"]}' loading="lazy"/>`
                    }
                    setOutputValue2(outputValue2 + " \n" + promptAI + "\n" + response["choices"][0]["message"]["content"] + "<br/>" + " \n" + tempText + "\n" + "<br/>")
                } else {
                    setOutputValue2(outputValue2 + " \n" + promptAI + "\n" + response["choices"][0]["message"]["content"] + "\n" + "<br/>")
                }

            } else {
                response = await response.json()
                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " \n" + response["mensaje"] + "<br/>"
                    setOutputValue2(" \n" + tempText)
                } else {
                    setOutputValue2("\n" + outputValue2 + " \n" + response["mensaje"] + "<br/>")
                }
            }
            setLoading(false)

        } catch (err) {
            setLoading(false)
            console.log("error")
        }
    }

    useEffect(() => {
        let elementosTables = document.querySelectorAll('[id^="table-no-"]');
        let buttonsTables = document.querySelectorAll('[id^="tableindex-"]');
        // Iterar sobre los elementos seleccionados
        for (let i = 0; i < buttonsTables.length; i++) {
            /* buttonsTables[i].addEventListener("click", () => {
                    let ventanaNueva = window.open("", "_blank");
                    ventanaNueva.document.open();
                    console.log("ventana nueva:",elementosTables[i])
                    ventanaNueva.document.write(JSON.stringify(elementosTables[i]));
                    ventanaNueva.document.close();
            }); */
            let generarFuncion = function (elemento) {
                return function () {
                    let ventanaNueva = window.open("", "_blank");
                    ventanaNueva.document.open();
                    ventanaNueva.document.write(elemento.outerHTML);
                    //ventanaNueva.document.close();
                };
            };
            buttonsTables[i].addEventListener("click", generarFuncion(elementosTables[i]));
        }
    }, [newTableLoaded])

    const bodyModalAIAn = (
        <div className={styles.modalaigraph} id="modal" style={{ width: "100%" }}>
            <h3>AI Graph Creator</h3>
            <br />
            <div className='row d-flex justify-content-center'>
                <div className='col-12'>
                    <textarea
                        className='col-12 text-input'
                        type="col-12 text-input"
                        placeholder='Write what kind of graph or analysis do you want from selected table'
                        onChange={(e) => { setPromptAI(e.target.value) }}
                        style={{ color: "black", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", maxHeight: "200px", borderRadius: "5px" }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                //console.log("test")
                                handleIAanalysis(aiAnalysis)

                            }
                        }}
                        value={promptAI}
                    />
                </div>
                <br />
                <div className='col-12 d-flex justify-content-end'>
                    <button
                        type="button"
                        className={`${styles.nav_button} ${styles.import_button}`}
                        style={{ borderRadius: "5px" }}
                        onClick={() => {
                            handleIAanalysis(aiAnalysis)
                            //setAiAnalysis({ code: textoDentroDeCode, firstRow: rowTitles[0], left: rowTitles[1] })
                        }}
                    >
                        Start AI
                    </button>
                    <button
                        type="button"
                        className={`${styles.nav_button} ${styles.import_button}`}
                        style={{ borderRadius: "5px" }}
                        onClick={() => {
                            openCloseModalAIAn()
                        }}
                    >
                        Close
                    </button>
                </div>
                <br />
                <div className={`${styles.nav_item}`}>
                <div className={`${styles.nav_label}`}>Columns</div>
            </div>
                <div className='card'>                    
                    {aiAnalysis.firstRow && aiAnalysis.firstRow.length > 0 ? <ul className="list-group">
                        {aiAnalysis.firstRow.split('|col| ').map((item, index) => {
                            return <li key={`col-index-${index}`}
                                className={`list-group-item ${styles.nav_item} ${styles.nav_text}`}
                                style={{ display: "flex", justifyContent: "space-between", margin: "5px 0px 5px 5px" }}>
                                {item}<button onClick={(e)=>{
                                    setPromptAI(prev=>prev+` ${item}`)
                                }}>add</button>
                            </li>
                        })}
                    </ul> : <></>}
                </div>

            </div>
        </div>
    )

    return (<>
        {fragments.map((fragment, index) => {
            // Verificar si el fragmento es un fragmento de código o texto normal
            //console.log("fragment ", index, ": ", fragment)
            if (fragment.startsWith('<code')) {
                // Si es un fragmento de código, renderizarlo como un componente preformatted
                return <div key={index} className='row d-flex justify-content-center align-items-start'>
                    <div className='col-sm-9'>
                        {fragment.includes("SELECT") ?
                            <div dangerouslySetInnerHTML={{ __html: fragment }} /> :
                            <div dangerouslySetInnerHTML={{ __html: textToTableHTML(fragment, index) }} className='table-responsive' />
                        }
                    </div>
                    <div className='col-sm-2'>
                        <div className='row d-flex justify-content-center align-items-start'>
                            <button className={`${styles.nav_button} ${styles.import_button}`} onClick={() => {
                                let tempDiv = document.createElement('div');
                                tempDiv.innerHTML = fragment;
                                let codigo = tempDiv.querySelectorAll('code');
                                if (codigo.length > 0) {
                                    let textoDentroDeCode = codigo[codigo.length - 1].textContent;
                                    if (textoDentroDeCode.includes("SELECT")) {
                                        handleSendInput4(textoDentroDeCode)
                                    } else {
                                        let rowTitles = textoDentroDeCode.trim().split('|row| ')
                                        //console.log("row title", rowTitles[0])
                                        if (rowTitles.length >= 2) {
                                            //console.log("row register", rowTitles[1])
                                            //handleIAanalysis(textoDentroDeCode, rowTitles[0], rowTitles[1])
                                            let contentText = textToCSV(textoDentroDeCode)
                                            setAiAnalysis({ code: textoDentroDeCode, firstRow: rowTitles[0], left: rowTitles[1], prompt: null })
                                            openCloseModalAIAn()
                                        } else {
                                            alert("The SQL query has no results to be analyzed.")
                                        }
                                    }
                                }
                            }}>
                                {fragment.includes("SELECT") ? "▶️Run query" : "AI Graph"}
                            </button>
                            <br />
                            {/* {!fragment.includes("SELECT") ? <button
                                className={`${styles.nav_button} ${styles.import_button}`}
                                onClick={() => {
                                    let tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = fragment;
                                    let codigo = tempDiv.querySelectorAll('code');
                                    let textoDentroDeCode = codigo[codigo.length - 1].textContent;
                                    //console.log("you must divide this text: ", textoDentroDeCode)
                                    let rowTitles = textoDentroDeCode.trim().split('|row| ')
                                    //console.log("row title", rowTitles[0])
                                    if (rowTitles.length >= 2) {
                                        //console.log("row register", rowTitles[1])
                                        //handleIAanalysis(textoDentroDeCode, rowTitles[0], rowTitles[1])
                                        let contentText = textToCSV(textoDentroDeCode)
                                        setAiAnalysis({ code: textoDentroDeCode, firstRow: rowTitles[0], left: rowTitles[1], prompt: null })
                                        openCloseModalAIAn()
                                    } else {
                                        alert("The SQL query has no results to be analyzed.")
                                    }
                                }}>
                                AI Analysis
                            </button> :
                                <></>
                            } 
                            <br />*/}
                            {!fragment.includes("SELECT") ? <button
                                className={`${styles.nav_button} ${styles.import_button}`}
                                onClick={() => {
                                    let tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = fragment;
                                    let codigo = tempDiv.querySelectorAll('code');
                                    let textoDentroDeCode = codigo[codigo.length - 1].textContent;
                                    //console.log("you must export this data: ", textoDentroDeCode)
                                    descargarCSV(textoDentroDeCode)
                                }}>
                                Export .csv
                            </button> :
                                <></>
                            }
                        </div>
                    </div>
                </div>;
            } else if (fragment.includes("ERROR 501")) {
                return <div key={index} className='row d-flex justify-content-center align-items-start'>
                    <div className='col-sm-9'>
                        <div dangerouslySetInnerHTML={{ __html: fragment }} />
                    </div>
                    <div className='col-sm-2'>
                        <div className='row d-flex justify-content-center align-items-start'>
                            <button className={`${styles.nav_button} ${styles.import_button}`} onClick={() => {
                                //let tempDiv = document.createElement('div');
                                //tempDiv.innerHTML = fragment;
                                //let codigo = tempDiv.querySelectorAll('code');
                                let temporalMsg = promptAI + " " + fragment
                                setPromptAI(temporalMsg)
                                handleIAanalysisError(aiAnalysis)
                            }}>
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            }
            else {
                // Si es texto normal, simplemente renderizarlo
                return <div key={index}><span><div dangerouslySetInnerHTML={{ __html: fragment }} style={{ whiteSpace: "break-spaces" }} /> </span><br /></div>;
            }
        })}
        <Modal open={modalAIAn} onClose={openCloseModalAIAn}>
            {bodyModalAIAn}
        </Modal>
    </>
    )
}

const MyTestComponent = () => {
    const { store, actions } = useContext(Context)
    const [modalImport, setModalImport] = useState(false);
    const [loading, setLoading] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [inputValueSearch, setInputValueSearch] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue3, setInputValue3] = useState('');
    const [outputValue, setOutputValue] = useState([]);
    const [outputValue2, setOutputValue2] = useState(null);
    const [userQuestion, setUserQuestion] = useState(false)
    const [userChat, setUserChat] = useState('')
    const [modeStreaming, setModeStreaming] = useState(true)
    const [startingStreamingAnswer, setStartingStreamingAnswer] = useState(false)
    const [socket, setSocket] = useState(null);
    const [receivedDataCount, setReceivedDataCount] = useState(0);
    const [startSocket, setStartSocket] = useState(false);
    const [closeMessage, setCloseMessage] = useState(false);
    const [viewNumber, setViewNumber] = useState(0);
    const [windows1Parameters, setWindows1Parameters] = useState({ height: "450px" })
    const [windows1, setWindows1] = useState(false)
    const [windows2Parameters, setWindows2Parameters] = useState({ height: "450px" })
    const [windows2, setWindows2] = useState(false)
    const [modalPricing, setModalPricing] = useState(false);
    const chatRef = useRef(null);
    const IA_URL = process.env.IA_URL;
    const URL_COMPLETIONS = IA_URL + '/completions';
    const URL_COMPLETIONS_STREAMING = IA_URL + '/completions/streaming';
    const URL_LIST_DB = '/list-db-dashboard/user';
    const URL_LIST_DB_specific = '/list-db-dashboard/user/specific';
    const URL_COMPLETIONS_SQL = IA_URL + '/completions/sql';
    const URL_QUERY_SQL = IA_URL + '/completions/sql-query';
    const customHeaders = {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        //CustomHeader: 'CustomValue',
    }
    const URL_CHUNKS = IA_URL + '/chunks';
    const URL_DOWNLOAD = IA_URL + '/user/download/';

    const openCloseModalImport = () => {
        setModalImport(!modalImport)
    }

    const openCloseModalPricing = () => {
        setModalPricing(!modalPricing)
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${Math.min(event.target.scrollHeight, 300)}px`;
    };

    const handleInputChangeSearch = (event) => {
        setInputValueSearch(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${Math.min(event.target.scrollHeight, 300)}px`;
    };

    const handleInputChange2 = (event) => {
        setInputValue2(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${Math.min(event.target.scrollHeight, 300)}px`;
    };

    const handleInputChange3 = (event) => {
        setInputValue3(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${Math.min(event.target.scrollHeight, 300)}px`;
    };

    const handleSendInput = async () => {
        //setOutputValue('')
        setLoading(true)
        setUserQuestion(false)

        setUserChat(inputValue)

        let data = {
            prompt: inputValue,
            group_context_filter: null
        }
        if (store["group_context_filter"].length > 0) {
            data["group_context_filter"] = store["group_context_filter"]
        }

        let url_for_LLM = URL_COMPLETIONS
        try {
            if (modeStreaming) {
                setStartSocket(!startSocket)
                url_for_LLM = URL_COMPLETIONS_STREAMING
                socket.emit('streaming', data)

                return;
            }
            console.log("on streaming mode this should not be printed on console")
            let response = await fetch(url_for_LLM, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)

            });
            //console.log(response)
            if (response.ok) {
                setLoading(false)
                setUserQuestion(true)
                let question = inputValue + "\n"
                response = await response.json()
                console.log(response.choices)
                //let tempArr = response.data.map((item,index)=>{return {score:}})

                setOutputValue([...outputValue, { score: 0, text: inputValue, document: { doc_metadata: { doc_id: 0, file_name: "User", original_text: inputValue, page_level: "", window: "" } } }, { score: 0, text: response.choices[0]["message"]["content"], document: { doc_metadata: { doc_id: 0, file_name: "assistant", original_text: response.choices[0]["message"]["content"], page_level: "", window: response.choices[0]["message"]["content"] } } }, ...response.choices[0]["sources"]])

                if (modeStreaming) {
                    setLoading(true)
                    setStartingStreamingAnswer(!startingStreamingAnswer)
                } else {
                    setInputValue('');
                }

            } else if (response.status == 401) {
                setLoading(false)
                //response = await response.json()
                setOutputValue([...outputValue, { score: 0, text: "Error", document: { doc_metadata: { doc_id: 0, file_name: "N/A", original_text: "", page_level: "0", window: "" } } }])
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "Forbidden",
                    text: "Session has expired, please login again",
                    showConfirmButton: false,
                    timer: 2500
                })

            }
            else {
                setLoading(false)
                response = await response.json()
                setOutputValue([...outputValue, { score: 0, text: "Error", document: { doc_metadata: { doc_id: 0, file_name: "N/A", original_text: "", page_level: "0", window: "" } } }])
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "Failed Connection",
                    showConfirmButton: false,
                    timer: 1500
                })
            }

        } catch (errorWebsocket) {
            setLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Failed Connection",
                showConfirmButton: false,
                text: errorWebsocket.toString(),
                timer: 1500
            })
        }



        return
    }

    const handleSendInputSearch = async () => {
        //setOutputValue('')
        setLoading(true)
        setUserQuestion(false)

        setUserChat(inputValueSearch)

        let data = {
            text: inputValueSearch,
            group_context_filter: null
        }
        if (store["group_context_filter"].length > 0) {
            data["group_context_filter"] = store["group_context_filter"]
        }

        let response = await fetch(URL_CHUNKS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Accept": "application/json"
            },
            body: JSON.stringify(data)

        });
        //console.log(response)
        if (response.ok) {
            setLoading(false)
            setUserQuestion(true)
            let question = inputValueSearch + "\n"
            response = await response.json()
            console.log(response.data)
            //let tempArr = response.data.map((item,index)=>{return {score:}})

            setOutputValue([...outputValue, { score: 0, text: inputValueSearch, document: { doc_metadata: { doc_id: 0, file_name: "User", original_text: inputValueSearch, page_level: "", window: "" } } }, ...response.data])
            setInputValueSearch('');

        } else if (response.status == 401) {
            setLoading(false)
            //response = await response.json()
            setOutputValue([...outputValue, { score: 0, text: "Error", document: { doc_metadata: { doc_id: 0, file_name: "N/A", original_text: "", page_level: "0", window: "" } } }])
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Forbidden",
                text: "Session has expired, please login again",
                showConfirmButton: false,
                timer: 2500
            })

        }
        else {
            setLoading(false)
            response = await response.json()
            setOutputValue([...outputValue, { score: 0, text: "Error", document: { doc_metadata: { doc_id: 0, file_name: "N/A", original_text: "", page_level: "0", window: "" } } }])
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Failed Connection",
                showConfirmButton: false,
                timer: 1500
            })
        }
        return
    }

    const handleSendInput2 = async () => {
        if (store.group_context_filter_db[0] == null) {
            alert("Please select a database")
            return
        }
        let data2 = {
            prompt: inputValue2,
            database_id: store.group_context_filter_db[0]
        }
        setLoading(true)
        try {
            let response = await fetch(URL_COMPLETIONS_SQL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(data2)

            });
            //console.log(response)
            if (response.ok) {
                setLoading(false)
                //let question = inputValue + "\n"
                response = await response.json()
                console.log(response)
                let regex = /```sql\n([\s\S]+?)\n```/g;
                let changed = response["choices"][0]["message"]["content"].replace(regex, `<code style="white-space:pre-line; display:flow; margin:10px; color: white; background-color:black; padding:5px">$1</code>`);


                //setOutputValue2(changed)
                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " \n" + changed
                    setOutputValue2(tempText)
                } else {
                    setOutputValue2(changed)
                }
            }
        } catch (err) {
            setLoading(false)
            console.log("error")
        }

    }

    const handleSendInput3 = async (value = inputValue3, tableName = "") => {
        if (store.group_context_filter_db[0] == null) {
            alert("Please select a database")
            return
        }
        console.log("value: ", value)
        let data2 = {
            prompt: value,
            database_id: store.group_context_filter_db[0],
            table_name: tableName
        }
        setLoading(true)
        try {
            let response = await fetch(URL_QUERY_SQL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(data2)

            });
            //console.log(response)
            if (response.ok) {
                setLoading(false)
                //let question = inputValue + "\n"
                response = await response.json()
                console.log(response)
                //let regex = /```sql\n([\s\S]+?)\n```/g;
                //let changed = response["choices"][0]["message"]["content"].replace(regex, '<code style="white-space:pre-line; display:flow; margin:10px; color: white; background-color:black; padding:5px">$1</code>');
                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " \n" + response["choices"][0]["message"]["content"]
                    setOutputValue2(tempText)
                } else {
                    setOutputValue2(response["choices"][0]["message"]["content"])
                }

            } else {
                response = await response.json()
                console.log(response)
                if (typeof outputValue2 === "string") {
                    let tempText = outputValue2 + " <br/>" + response["mensaje"]
                    setOutputValue2(tempText)
                } else {
                    setOutputValue2(response["mensaje"])
                }
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
            alert(err)
            console.log("error")
        }

    }

    const loadListDB = async () => {
        setLoading(true)
        if (store.group_context_filter_db[0] == null) {
            alert("Please select a database")
            return
        }
        let tempURL = IA_URL + URL_LIST_DB_specific
        let data2 = {
            database_id: store.group_context_filter_db[0]
        }

        try {
            let dataSQL = await fetch(tempURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify(data2)
            })
            if (dataSQL.ok) {
                dataSQL = await dataSQL.json()
                //actions.setListDB(dataSQL)
                actions.setSpecificListDB(dataSQL)
            }
            setLoading(false)
        }
        catch (error) {
            setLoading(false)
        }
    }

    const changeWindows1 = () => {
        if (windows1) {
            setWindows1Parameters({ ...windows1Parameters, height: "400px" })
        } else {
            setWindows1Parameters({ ...windows1Parameters, height: "100px" })
        }
        setWindows1(!windows1)
    }

    const changeWindows2 = () => {
        if (windows2) {
            setWindows2Parameters({ ...windows2Parameters, height: "400px" })
        } else {
            setWindows2Parameters({ ...windows2Parameters, height: "170px" })
        }
        setWindows2(!windows2)
    }

    const bodyPricing = (
        <div className={styles.modalPricing}>
            <div className={styles['pricingContainer']}>
                <div className={styles['container04']}>
                    <span className={styles['overline']}>
                        <span>Pricing</span>
                        <br></br>
                    </span>
                    <h2 className={styles['heading2']}>Choose Your Plan</h2>
                    <span
                        className={` ${styles['pricing-sub-heading']} ${styles['bodyLarge']} `}
                    >
                        <span>
                            <span>
                                Select the plan that best fits your budget tracking needs
                            </span>
                        </span>
                    </span>
                </div>
                <div className={styles['container05']}>
                    <div
                        className={` ${styles['freePricingCard']} ${styles['pricing-card']} `}
                    >
                        <div className={styles['container06']}>
                            <span
                                className={` ${styles['text36']} ${styles['heading3']} `}
                            >
                                Free
                            </span>
                            <span className={styles['bodySmall']}>
                                QLX-GPT for free with basic features
                            </span>
                        </div>
                        <div className={styles['container07']}>
                            <span className={styles['text37']}>
                                <span>$</span>
                                <span></span>
                            </span>
                            <span className={styles['free-plan-price']}>0</span>
                        </div>
                        <div className={styles['container08']}>
                            <div className={styles['container09']}>
                                <span className={styles['text40']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    5 daily AI credits
                                </span>
                            </div>
                            <div className={styles['container10']}>
                                <span className={styles['text41']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Upload up to 5 documents
                                </span>
                            </div>
                            <div className={styles['container11']}>
                                <span className={styles['text42']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Connect up to 1 database
                                </span>
                            </div>
                            <div className={styles['container12']}>
                                <span className={styles['text43']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Share your Folders
                                </span>
                            </div>
                            <div className={styles['container12']}>
                                <span className={styles['text43']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    With Ads
                                </span>
                            </div>
                        </div>
                        <button
                            className={` ${styles['button1']} ${styles['buttonFilledSecondary']} `}
                        >
                            Continue with Free
                        </button>
                    </div>
                    <div
                        className={` ${styles['basicPricingCard']} ${styles['pricing-card1']} `}
                    >
                        <div className={styles['container13']}>
                            <span
                                className={` ${styles['text44']} ${styles['heading3']} `}
                            >
                                BASIC
                            </span>
                            <span className={styles['bodySmall']}>
                                Upgrade to access more features
                            </span>
                        </div>
                        <div className={styles['container14']}>
                            <span className={styles['text45']}>
                                <span>$</span>
                                <span></span>
                            </span>
                            <span className={styles['basic-plan-pricing']}>5</span>
                            <span className={styles['text48']}>/ month</span>
                        </div>
                        <div className={styles['container15']}>
                            <div className={styles['container16']}>
                                <span className={styles['text49']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    All features of FREE plan
                                </span>
                            </div>
                            <div className={styles['container17']}>
                                <span className={styles['text51']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Ad-free experience
                                </span>
                            </div>
                            <div className={styles['container18']}>
                                <span className={styles['text52']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    100 daily credits
                                </span>
                            </div>
                            <div className={styles['container19']}>
                                <span className={styles['text53']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Un-limit folders and database connections
                                </span>
                            </div>
                            <div className={styles['container20']}>
                                <span className={styles['text54']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Export data to CSV
                                </span>
                            </div>
                        </div>
                        <button
                            className={` ${styles['button1']} ${styles['buttonFilledSecondary']} `}
                        >
                            Try the Basic plan
                        </button>
                    </div>
                    <div
                        className={` ${styles['proPricingCard']} ${styles['pricing-card2']} `}
                    >
                        <div className={styles['container21']}>
                            <span
                                className={` ${styles['text55']} ${styles['heading3']} `}
                            >
                                <span>PRO</span>
                                <br></br>
                            </span>
                            <span className={styles['bodySmall']}>
                                Unlock premium features for comprehensive budget tracking
                            </span>
                        </div>
                        <div className={styles['container22']}>
                            <span className={styles['text58']}>
                                <span>$</span>
                                <span></span>
                            </span>
                            <span className={styles['pro-plan-pricing']}>10</span>
                            <span className={styles['text61']}>/ month</span>
                        </div>
                        <div className={styles['container23']}>
                            <div className={styles['container24']}>
                                <span className={styles['text62']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    All features of BASIC plan
                                </span>
                            </div>
                            <div className={styles['container25']}>
                                <span className={styles['text64']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Un-limit AI credits
                                </span>
                            </div>
                            <div className={styles['container26']}>
                                <span className={styles['text65']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Priority customer support
                                </span>
                            </div>
                            <div className={styles['container27']}>
                                <span className={styles['text66']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Goal setting and tracking
                                </span>
                            </div>
                            <div className={styles['container28']}>
                                <span className={styles['text67']}>✔</span>
                                <span className={styles['bodySmall']}>
                                    Customizable dashboard
                                </span>
                            </div>
                        </div>
                        <button
                            className={` ${styles['button2']} ${styles['buttonFilledSecondary']} `}
                        >
                            Try the PRO plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    let viewWindows = [
        <div className={`${styles.library_heading}`} onClick={(e) => { actions.setViewNumber(0) }}>
            <span className={store.viewNumber == 0 ? `${styles.library_text_selected}` : `${styles.library_text}`}>Library</span>
        </div>,
        <div className={`${styles.library_heading}`} onClick={(e) => { actions.setViewNumber(1) }}>
            <span className={store.viewNumber == 1 ? `${styles.library_text_selected}` : `${styles.library_text}`}>Database</span>
        </div>,
        <div className={`${styles.library_heading}`} onClick={(e) => { actions.setViewNumber(2) }}>
            <span className={store.viewNumber == 2 ? `${styles.library_text_selected}` : `${styles.library_text}`}>SMS Campaign</span>
        </div>,
        <div className={`${styles.library_heading}`} onClick={(e) => { actions.setViewNumber(3) }}>
            <span className={store.viewNumber == 3 ? `${styles.library_text_selected}` : `${styles.library_text}`}>Email Campaign</span>
        </div>
    ]

    let selectedWindows = [
        <>
            {outputValue.length < 1 && loading == false ? <>
                <section className={`${styles.upload_section}`} onClick={() => { openCloseModalImport() }}>
                    <svg className={`${styles.upload_icon}`} xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 32 33" fill="none" fill-opacity="0.48"><path d="M26.7075 10.7925L19.7075 3.7925C19.6146 3.69967 19.5042 3.62605 19.3829 3.57586C19.2615 3.52568 19.1314 3.4999 19 3.5H7C6.46957 3.5 5.96086 3.71071 5.58579 4.08579C5.21071 4.46086 5 4.96957 5 5.5V27.5C5 28.0304 5.21071 28.5391 5.58579 28.9142C5.96086 29.2893 6.46957 29.5 7 29.5H25C25.5304 29.5 26.0391 29.2893 26.4142 28.9142C26.7893 28.5391 27 28.0304 27 27.5V11.5C27.0001 11.3686 26.9743 11.2385 26.9241 11.1172C26.8739 10.9958 26.8003 10.8854 26.7075 10.7925ZM19 20.5H17V22.5C17 22.7652 16.8946 23.0196 16.7071 23.2071C16.5196 23.3946 16.2652 23.5 16 23.5C15.7348 23.5 15.4804 23.3946 15.2929 23.2071C15.1054 23.0196 15 22.7652 15 22.5V20.5H13C12.7348 20.5 12.4804 20.3946 12.2929 20.2071C12.1054 20.0196 12 19.7652 12 19.5C12 19.2348 12.1054 18.9804 12.2929 18.7929C12.4804 18.6054 12.7348 18.5 13 18.5H15V16.5C15 16.2348 15.1054 15.9804 15.2929 15.7929C15.4804 15.6054 15.7348 15.5 16 15.5C16.2652 15.5 16.5196 15.6054 16.7071 15.7929C16.8946 15.9804 17 16.2348 17 16.5V18.5H19C19.2652 18.5 19.5196 18.6054 19.7071 18.7929C19.8946 18.9804 20 19.2348 20 19.5C20 19.7652 19.8946 20.0196 19.7071 20.2071C19.5196 20.3946 19.2652 20.5 19 20.5ZM19 11.5V5.91375L24.5863 11.5H19Z" fill="#1A1A1A"></path></svg>
                    <p className={`${styles.upload_text}`}>
                        Click here to upload a file or paste a link to get started
                    </p>
                </section>
                <section className={`${styles.image_grid}`}>
                    <div className={`${styles.image_columns}`}>
                        <div className={`${styles.image_wrapper}`}>
                            {themes.map((theme, index) => (
                                <ThemeColumn key={index} theme={theme} />
                            ))}
                        </div>

                    </div>
                </section>
            </> : <>
                <div className={'w-100'}>
                    <h1 className="title-ia">
                        {loading && <div className="d-flex justify-content-center align-items-center" id="loading" style={{ maxHeight: "100px" }}>
                            <BookLoader
                                background={"linear-gradient(135deg, #6066FA, #4645F6)"}
                                desktopSize={"100px"}
                                mobileSize={"80px"}
                                textColor={"#4645F6"}
                            />
                        </div>}
                    </h1>
                    <div style={{ minHeight: "400px" }}>
                        {/* {userQuestion && <div className="output user-chat" style={{ whiteSpace: "pre-wrap", color: "black" }}>{userChat}</div>} */}
                        {outputValue.length > 0 && <div className={styles.output} style={{ color: "black", maxHeight: "750px", overflowY: "scroll" }} id='scrolldown' ref={chatRef}>{
                            outputValue.map((item, index) => {

                                if (item.document.doc_metadata.file_name != "User") {
                                    if (item.document.doc_metadata.file_name == "assistant") {
                                        return (<div key={index}>
                                            <strong>
                                                <button
                                                    style={{ color: "blue", border: "none" }}
                                                    onClick={async (e) => {
                                                        const response = await fetch(`${URL_DOWNLOAD}${item.document.doc_metadata.file_name}`, {
                                                            method: "GET",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                                                                "Accept": "application/json"
                                                            }
                                                        })
                                                        if (!response.ok) {
                                                            console.error(`Error al descargar el archivo. Código de estado: ${response.status}`);
                                                            if (response.status == 401) {
                                                                Swal.fire({
                                                                    position: 'top-end',
                                                                    icon: 'error',
                                                                    title: "Your session has expired. Login again",
                                                                    showConfirmButton: false,
                                                                    timer: 1500
                                                                })
                                                            } else {
                                                                Swal.fire({
                                                                    position: 'top-end',
                                                                    icon: 'error',
                                                                    title: "Error trying to download the file",
                                                                    showConfirmButton: false,
                                                                    timer: 1500
                                                                })
                                                            }
                                                            return;
                                                        }
                                                        const blob = await response.blob();
                                                        const urln = URL.createObjectURL(blob);

                                                        // Abre el archivo en una nueva ventana
                                                        window.open(urln, "_blank");
                                                    }}
                                                >
                                                    {item.document.doc_metadata.file_name}</button>:</strong>
                                            <p className={styles.llm_output}>{item.document.doc_metadata.window}</p>
                                            <br />
                                        </div>)
                                    } else {
                                        return (<div key={index}>
                                            <strong>
                                                <button
                                                    style={{ color: "blue", border: "none" }}
                                                    onClick={async (e) => {
                                                        const response = await fetch(`${URL_DOWNLOAD}${item.document.doc_metadata.file_name}`, {
                                                            method: "GET",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                                                                "Accept": "application/json"
                                                            }
                                                        })
                                                        if (!response.ok) {
                                                            console.error(`Error al descargar el archivo. Código de estado: ${response.status}`);
                                                            if (response.status == 401) {
                                                                Swal.fire({
                                                                    position: 'top-end',
                                                                    icon: 'error',
                                                                    title: "Your session has expired. Login again",
                                                                    showConfirmButton: false,
                                                                    timer: 1500
                                                                })
                                                            } else {
                                                                Swal.fire({
                                                                    position: 'top-end',
                                                                    icon: 'error',
                                                                    title: "Error trying to download the file",
                                                                    showConfirmButton: false,
                                                                    timer: 1500
                                                                })
                                                            }
                                                            return;
                                                        }
                                                        const blob = await response.blob();
                                                        const urln = URL.createObjectURL(blob);

                                                        // Abre el archivo en una nueva ventana
                                                        window.open(urln, "_blank");
                                                    }}
                                                >
                                                    {item.document.doc_metadata.file_name}</button> (page {item.document.doc_metadata.page_label})- score:{item.score.toFixed(3)}:</strong>
                                            {/* Accordion setcion for sources */}
                                            <div class="accordion" id={`accordion${index}`}>
                                                <div class="accordion-item">
                                                    <h2 class="accordion-header" id={`heading${index}`}>
                                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`}>
                                                            Source's content
                                                        </button>
                                                    </h2>
                                                    <div id={`collapse${index}`} class="accordion-collapse collapse show" aria-labelledby={`heading${index}`} data-bs-parent={`accordion${index}`}>
                                                        <div class="accordion-body">
                                                            <strong>Semantic search:</strong> {item.document.doc_metadata.window}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                        </div>)
                                    }
                                } else {
                                    return (
                                        <div className='question' key={index}>
                                            <div className={styles.userchat} style={{ color: "black" }}>
                                                <strong>{item.document.doc_metadata.file_name}:</strong>
                                                <p className={styles.p_output}>{item.text}</p>
                                                <br />
                                            </div></div>)
                                }
                            })
                        }</div>}
                    </div>
                </div>
            </>}
            <div className='row d-flex' style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "end" }}>
                <div className='col-sm-12 col-md-10'>
                    <div className="text-input">
                        <textarea type="col-12 text-input"
                            value={inputValue}
                            onChange={handleInputChange}
                            style={{ color: "black", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", maxHeight: "200px", borderRadius: "5px", width: "100%" }}
                            placeholder='Write description here'
                            className={`${styles.nav_text}`}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSendInput()
                                }
                            }} />
                    </div>
                </div>
                <div className='col-sm-12 col-md-2 d-flex justify-content-between'>
                    {loading ?
                        <button className={`${styles.nav_button} ${styles.home_button}`} onClick={handleSendInput} disabled>{loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                            <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>}</button> :
                        <button className={`${styles.nav_button} ${styles.import_button}`} onClick={handleSendInput}>Send</button>
                    }
                    <button className={`${styles.nav_button} ${styles.import_button}`} onClick={e => { setOutputValue([]) }}>Clear Screen</button>
                </div>
            </div>
        </>,
        <>
            <div align="center" className={`${styles.nav_group}`} style={{ width: "100%" }}>
                {store.group_context_filter_db[0] != null && store.group_context_filter_db.length > 0 ? <button type="button" className={`${styles.nav_button} ${styles.import_button}`} onClick={(e) => { loadListDB() }} style={{ maxHeight: "60px", width: "125px" }}>Load Tables</button> : <h4>Select a Database</h4>}
                {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                    <div className="spinner-border text-warning" role="status" aria-hidden="true">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>}
                <div className='card' style={{ overflowY: "scroll", width: "100%", minHeight: "90%", maxHeight: "180px" }}>
                    <ul>
                        {store.specificDBList.length > 0 ? store.specificDBList.map((item, indice) => {
                            if (item.id == store.group_context_filter_db[0]) {
                                return <li
                                    className={`card`}
                                    key={`query-table-${indice}`}
                                    style={{ display: "flex", justifyContent: "space-between", margin: "5px 0px 5px 5px" }}
                                >
                                    {item.tables != null && item.tables.length > 0 ?
                                        item.tables.map((table, table_index) => {
                                            return (
                                                <div className={`accordion ${styles.nav_item} ${styles.nav_text}`} id={`accordion-table${table_index}`} key={table_index}>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header col d-flex" id={`heading-table${table_index}`}>
                                                            <button className={`${styles.item} accordion-button`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-table${table_index}`} aria-expanded="false" aria-controls={`collapse-table${table_index}`}>
                                                                {table.name}
                                                            </button>
                                                            <button type="button" className={`${styles.nav_button} ${styles.import_button}`} style={{ width: "100%" }} onClick={() => {
                                                                if (item.dialect == "mssql") {
                                                                    setInputValue3(`SELECT TOP 50 * FROM ${table.name};`)
                                                                    handleSendInput3(`SELECT TOP 50 * FROM ${table.name};`)
                                                                } else {
                                                                    setInputValue3(`SELECT * FROM ${table.name} LIMIT 50;`)
                                                                    handleSendInput3(`SELECT * FROM ${table.name} LIMIT 50;`)
                                                                }
                                                            }}>
                                                                Run query (limit 50)
                                                            </button>
                                                            <button type="button" className={`${styles.nav_button} ${styles.import_button}`} style={{ width: "100%" }} onClick={() => {
                                                                if (item.dialect == "mssql") {
                                                                    /* setInputValue3(`SELECT TOP 50 * FROM ${table.name};`)
                                                                    handleSendInput3(`SELECT TOP 50 * FROM ${table.name};`) */
                                                                    setInputValue3(`SELECT * FROM ${table.name};`)
                                                                    handleSendInput3(`SELECT * FROM ${table.name};`)
                                                                } else {
                                                                    /* setInputValue3(`SELECT * FROM ${table.name} LIMIT 50;`)
                                                                    handleSendInput3(`SELECT * FROM ${table.name} LIMIT 50;`) */
                                                                    setInputValue3(`SELECT * FROM ${table.name};`)
                                                                    handleSendInput3(`SELECT * FROM ${table.name};`)
                                                                }
                                                            }}>
                                                                Run query (all)
                                                            </button>
                                                        </h2>
                                                        <div id={`collapse-table${table_index}`} class="accordion-collapse collapse" aria-labelledby={`heading-table${table_index}`} data-bs-parent={`accordion-table${table_index}`}>
                                                            <div class="accordion-body">
                                                                <strong>Columns: </strong> {JSON.stringify(table.columns)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : <></>}
                                </li>
                            } else {
                                return <></>
                            }
                        }) : <>You don't have databases registered</>}
                    </ul>
                </div>
            </div>
            <div className='col-12'>
                <div className='row d-flex justify-content-center'>
                    <div className={styles.output2} style={{ maxHeight: windows2Parameters.height, /* border: "1px solid black", */ margin: "10px", width: "98%", maxWidth: "1400px" }}>
                        {/* <button className={`${styles.nav_button} ${styles.import_button}`} style={{ width: "20px", position: 'relative', top: '5px', left: '96%' }} onClick={() => { changeWindows2() }}>⏹</button> */}
                        {outputValue2 != null ?
                            <RenderText texto={outputValue2} setOutputValue2={setOutputValue2} outputValue2={outputValue2} loading={loading} setLoading={setLoading} inputValue3={inputValue3} selectedDB={store.group_context_filter_db[0]} />
                            : <></>
                        }
                    </div>
                </div>
                <div className='row d-flex justify-content-center' style={{ margin: "0px 10px 0px 10px" }}>
                    <div className='col-sm-12 col-md-8 '>
                        <div className="text-input">
                            <textarea type="col-12 text-input"
                                value={inputValue2}
                                onChange={handleInputChange2}
                                style={{ color: "black", width: "100%", padding: "5px", borderWidth: "1px", borderColor: "black", maxHeight: "200px", borderRadius: "5px" }}
                                placeholder='Write in natural language your query to the selected database'
                                className={`${styles.nav_text}`}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                        console.log("test")
                                        handleSendInput2()
                                    }
                                }} />
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-4 d-flex justify-content-between align-items-center'>
                        {loading ?
                            <button className={`${styles.nav_button} ${styles.import_button}`} onClick={handleSendInput2} disabled>Send</button> :
                            <button className={`${styles.nav_button} ${styles.import_button}`} onClick={handleSendInput2}>Send</button>
                        }
                        <button className={`${styles.nav_button} ${styles.import_button}`} onClick={e => { setOutputValue2(null) }}>Clear Screen</button>
                    </div>
                </div>
                <div className='row d-flex justify-content-center' style={{ margin: "0px 10px 0px 10px" }}>
                    <div className="accordion" id={`accordion-table-advance`} >
                        <div className="accordion-item">
                            <h2 className="accordion-header col d-flex" id={`heading-table-advance`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-table-advance`} aria-expanded="false" aria-controls={`collapse-table-advance`}>
                                    Advanced SQL Query
                                </button>
                            </h2>
                            <div id={`collapse-table-advance`} class="accordion-collapse collapse" aria-labelledby={`heading-table-advance`} data-bs-parent={`accordion-table-advance`}>
                                <div className='row d-flex justify-content-center' style={{ height: "80px" }}>
                                    <div className='col-sm-12 col-md-8 d-flex justify-content-center align-items-center'>
                                        <div className="text-input" style={{ width: "100%" }}>
                                            <textarea type="col-12 text-input"
                                                value={inputValue3}
                                                onChange={handleInputChange3}
                                                style={{ color: "black", width: "100%", padding: "5px", borderWidth: "1px", borderColor: "black", maxHeight: "200px", borderRadius: "5px" }}
                                                placeholder='Write a SQL QUERY HERE'
                                                className={`${styles.nav_text}`}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" && !event.shiftKey) {
                                                        console.log("test")
                                                        handleSendInput3()
                                                    }
                                                }} />
                                        </div>
                                    </div>
                                    <div className='col-sm-12 col-md-4 d-flex justify-content-center align-items-center'>
                                        {loading ?
                                            <button className={`${styles.nav_button} ${styles.import_button}`} onClick={handleSendInput3} disabled>Send SQL Query</button> :
                                            <button className={`${styles.nav_button} ${styles.import_button}`} onClick={handleSendInput3}>Send SQL Query</button>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* <div className='row d-flex justify-content-center'>
                    <div className='col-sm-2 col-md-8'>
                        <div className='col d-flex'>
                            <button className={styles.button_danger} onClick={() => setSelectedDB(null)}>Un-Select All</button>
                        </div>
                    </div>
                    <div className='col-sm-5 col-md-4'></div>
                </div> */}
            </div>
        </>,
        <>
            {localStorage.getItem("sms_campaign_active") === "true" ? <React.Suspense fallback={<LoadingComponent2 />}>
                <ClientList />
            </React.Suspense> : <button className={`${styles.upgrade_button}`} style={{ width: "95%" }} onClick={() => { openCloseModalPricing() }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 16" fill="none" fill-opacity="1"><path d="M17.6876 9.875C17.6876 10.1236 17.5888 10.3621 17.413 10.5379C17.2372 10.7137 16.9987 10.8125 16.7501 10.8125H15.8126V11.75C15.8126 11.9986 15.7138 12.2371 15.538 12.4129C15.3622 12.5887 15.1237 12.6875 14.8751 12.6875C14.6265 12.6875 14.388 12.5887 14.2122 12.4129C14.0364 12.2371 13.9376 11.9986 13.9376 11.75V10.8125H13.0001C12.7515 10.8125 12.513 10.7137 12.3372 10.5379C12.1614 10.3621 12.0626 10.1236 12.0626 9.875C12.0626 9.62636 12.1614 9.3879 12.3372 9.21209C12.513 9.03627 12.7515 8.9375 13.0001 8.9375H13.9376V8C13.9376 7.75136 14.0364 7.5129 14.2122 7.33709C14.388 7.16127 14.6265 7.0625 14.8751 7.0625C15.1237 7.0625 15.3622 7.16127 15.538 7.33709C15.7138 7.5129 15.8126 7.75136 15.8126 8V8.9375H16.7501C16.9987 8.9375 17.2372 9.03627 17.413 9.21209C17.5888 9.3879 17.6876 9.62636 17.6876 9.875ZM2.37511 3.9375H3.31261V4.875C3.31261 5.12364 3.41138 5.3621 3.58719 5.53791C3.76301 5.71373 4.00147 5.8125 4.25011 5.8125C4.49875 5.8125 4.7372 5.71373 4.91302 5.53791C5.08883 5.3621 5.18761 5.12364 5.18761 4.875V3.9375H6.12511C6.37375 3.9375 6.6122 3.83873 6.78802 3.66291C6.96383 3.4871 7.06261 3.24864 7.06261 3C7.06261 2.75136 6.96383 2.5129 6.78802 2.33709C6.6122 2.16127 6.37375 2.0625 6.12511 2.0625H5.18761V1.125C5.18761 0.87636 5.08883 0.637903 4.91302 0.462087C4.7372 0.286272 4.49875 0.1875 4.25011 0.1875C4.00147 0.1875 3.76301 0.286272 3.58719 0.462087C3.41138 0.637903 3.31261 0.87636 3.31261 1.125V2.0625H2.37511C2.12647 2.0625 1.88801 2.16127 1.71219 2.33709C1.53638 2.5129 1.43761 2.75136 1.43761 3C1.43761 3.24864 1.53638 3.4871 1.71219 3.66291C1.88801 3.83873 2.12647 3.9375 2.37511 3.9375ZM12.3751 12.6875H12.0626V12.375C12.0626 12.1264 11.9638 11.8879 11.788 11.7121C11.6122 11.5363 11.3737 11.4375 11.1251 11.4375C10.8765 11.4375 10.638 11.5363 10.4622 11.7121C10.2864 11.8879 10.1876 12.1264 10.1876 12.375V12.6875H9.87511C9.62646 12.6875 9.38801 12.7863 9.21219 12.9621C9.03638 13.1379 8.93761 13.3764 8.93761 13.625C8.93761 13.8736 9.03638 14.1121 9.21219 14.2879C9.38801 14.4637 9.62646 14.5625 9.87511 14.5625H10.1876V14.875C10.1876 15.1236 10.2864 15.3621 10.4622 15.5379C10.638 15.7137 10.8765 15.8125 11.1251 15.8125C11.3737 15.8125 11.6122 15.7137 11.788 15.5379C11.9638 15.3621 12.0626 15.1236 12.0626 14.875V14.5625H12.3751C12.6237 14.5625 12.8622 14.4637 13.038 14.2879C13.2138 14.1121 13.3126 13.8736 13.3126 13.625C13.3126 13.3764 13.2138 13.1379 13.038 12.9621C12.8622 12.7863 12.6237 12.6875 12.3751 12.6875ZM15.3548 4.47109L4.47042 15.3547C4.17741 15.6476 3.78005 15.8122 3.36573 15.8122C2.95141 15.8122 2.55406 15.6476 2.26104 15.3547L0.644637 13.7391C0.499478 13.594 0.384329 13.4217 0.305766 13.2321C0.227204 13.0425 0.186768 12.8392 0.186768 12.634C0.186768 12.4287 0.227204 12.2255 0.305766 12.0359C0.384329 11.8463 0.499478 11.674 0.644637 11.5289L11.529 0.645313C11.822 0.352389 12.2194 0.187834 12.6337 0.187834C13.048 0.187834 13.4454 0.352389 13.7384 0.645313L15.3548 2.26094C15.5 2.40604 15.6151 2.57831 15.6937 2.76793C15.7722 2.95754 15.8127 3.16077 15.8127 3.36602C15.8127 3.57126 15.7722 3.77449 15.6937 3.9641C15.6151 4.15372 15.5 4.32599 15.3548 4.47109ZM10.422 6.75L9.25011 5.57812L2.19151 12.6336L3.36339 13.8055L10.422 6.75ZM13.8056 3.36641L12.6337 2.19453L10.5782 4.25L11.7501 5.42188L13.8056 3.36641Z" fill="#FFFFFF"></path></svg>
                <span className={`${styles.upgrade_text}`}>Upgrade</span>
            </button>}
        </>,
        <>
            {localStorage.getItem("email_campaign_active") === "true" ? <React.Suspense fallback={<LoadingComponent2 />}>
                <CampaignEmailList />
            </React.Suspense> : <button className={`${styles.upgrade_button}`} style={{ width: "95%" }} onClick={() => { openCloseModalPricing() }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 16" fill="none" fill-opacity="1"><path d="M17.6876 9.875C17.6876 10.1236 17.5888 10.3621 17.413 10.5379C17.2372 10.7137 16.9987 10.8125 16.7501 10.8125H15.8126V11.75C15.8126 11.9986 15.7138 12.2371 15.538 12.4129C15.3622 12.5887 15.1237 12.6875 14.8751 12.6875C14.6265 12.6875 14.388 12.5887 14.2122 12.4129C14.0364 12.2371 13.9376 11.9986 13.9376 11.75V10.8125H13.0001C12.7515 10.8125 12.513 10.7137 12.3372 10.5379C12.1614 10.3621 12.0626 10.1236 12.0626 9.875C12.0626 9.62636 12.1614 9.3879 12.3372 9.21209C12.513 9.03627 12.7515 8.9375 13.0001 8.9375H13.9376V8C13.9376 7.75136 14.0364 7.5129 14.2122 7.33709C14.388 7.16127 14.6265 7.0625 14.8751 7.0625C15.1237 7.0625 15.3622 7.16127 15.538 7.33709C15.7138 7.5129 15.8126 7.75136 15.8126 8V8.9375H16.7501C16.9987 8.9375 17.2372 9.03627 17.413 9.21209C17.5888 9.3879 17.6876 9.62636 17.6876 9.875ZM2.37511 3.9375H3.31261V4.875C3.31261 5.12364 3.41138 5.3621 3.58719 5.53791C3.76301 5.71373 4.00147 5.8125 4.25011 5.8125C4.49875 5.8125 4.7372 5.71373 4.91302 5.53791C5.08883 5.3621 5.18761 5.12364 5.18761 4.875V3.9375H6.12511C6.37375 3.9375 6.6122 3.83873 6.78802 3.66291C6.96383 3.4871 7.06261 3.24864 7.06261 3C7.06261 2.75136 6.96383 2.5129 6.78802 2.33709C6.6122 2.16127 6.37375 2.0625 6.12511 2.0625H5.18761V1.125C5.18761 0.87636 5.08883 0.637903 4.91302 0.462087C4.7372 0.286272 4.49875 0.1875 4.25011 0.1875C4.00147 0.1875 3.76301 0.286272 3.58719 0.462087C3.41138 0.637903 3.31261 0.87636 3.31261 1.125V2.0625H2.37511C2.12647 2.0625 1.88801 2.16127 1.71219 2.33709C1.53638 2.5129 1.43761 2.75136 1.43761 3C1.43761 3.24864 1.53638 3.4871 1.71219 3.66291C1.88801 3.83873 2.12647 3.9375 2.37511 3.9375ZM12.3751 12.6875H12.0626V12.375C12.0626 12.1264 11.9638 11.8879 11.788 11.7121C11.6122 11.5363 11.3737 11.4375 11.1251 11.4375C10.8765 11.4375 10.638 11.5363 10.4622 11.7121C10.2864 11.8879 10.1876 12.1264 10.1876 12.375V12.6875H9.87511C9.62646 12.6875 9.38801 12.7863 9.21219 12.9621C9.03638 13.1379 8.93761 13.3764 8.93761 13.625C8.93761 13.8736 9.03638 14.1121 9.21219 14.2879C9.38801 14.4637 9.62646 14.5625 9.87511 14.5625H10.1876V14.875C10.1876 15.1236 10.2864 15.3621 10.4622 15.5379C10.638 15.7137 10.8765 15.8125 11.1251 15.8125C11.3737 15.8125 11.6122 15.7137 11.788 15.5379C11.9638 15.3621 12.0626 15.1236 12.0626 14.875V14.5625H12.3751C12.6237 14.5625 12.8622 14.4637 13.038 14.2879C13.2138 14.1121 13.3126 13.8736 13.3126 13.625C13.3126 13.3764 13.2138 13.1379 13.038 12.9621C12.8622 12.7863 12.6237 12.6875 12.3751 12.6875ZM15.3548 4.47109L4.47042 15.3547C4.17741 15.6476 3.78005 15.8122 3.36573 15.8122C2.95141 15.8122 2.55406 15.6476 2.26104 15.3547L0.644637 13.7391C0.499478 13.594 0.384329 13.4217 0.305766 13.2321C0.227204 13.0425 0.186768 12.8392 0.186768 12.634C0.186768 12.4287 0.227204 12.2255 0.305766 12.0359C0.384329 11.8463 0.499478 11.674 0.644637 11.5289L11.529 0.645313C11.822 0.352389 12.2194 0.187834 12.6337 0.187834C13.048 0.187834 13.4454 0.352389 13.7384 0.645313L15.3548 2.26094C15.5 2.40604 15.6151 2.57831 15.6937 2.76793C15.7722 2.95754 15.8127 3.16077 15.8127 3.36602C15.8127 3.57126 15.7722 3.77449 15.6937 3.9641C15.6151 4.15372 15.5 4.32599 15.3548 4.47109ZM10.422 6.75L9.25011 5.57812L2.19151 12.6336L3.36339 13.8055L10.422 6.75ZM13.8056 3.36641L12.6337 2.19453L10.5782 4.25L11.7501 5.42188L13.8056 3.36641Z" fill="#FFFFFF"></path></svg>
                <span className={`${styles.upgrade_text}`}>Upgrade</span>
            </button>}
        </>
    ]

    useEffect(() => {
        const newSocket = io(process.env.IA_URL, {
            extraHeaders: customHeaders,
        });
        setSocket(newSocket);

        // Limpia el socket cuando el componente se desmonta
        return () => {
            newSocket.disconnect();
        };
    }, [startSocket]);

    useEffect(() => {
        if (!socket) return;

        socket.on('streaming', (data) => {
            console.log("streaming")
            if (data.choices[0]["finish_reason"] == "stop") {
                console.log("cancelado el streaming")
                setLoading(false)
                socket.disconnect();
                setStartSocket(!startSocket)

                // Agregar finish_reason a cada elemento en outputValue
                setOutputValue(prevOutput =>
                    prevOutput.map(item => ({
                        ...item,
                        document: {
                            ...item.document,
                            doc_metadata: {
                                ...item.document.doc_metadata,
                                finish_reason: "stop"
                            }
                        }
                    }))
                );

                return
            }
            else if (data.choices[0]["sources"] != null) {
                setLoading(true)
                //console.log(data)
                setOutputValue(prevOutput => [
                    ...prevOutput.filter(item => item.document.doc_metadata.finish_reason === "stop"),
                    { score: 0, text: inputValue, document: { doc_metadata: { doc_id: 0, file_name: "User", original_text: inputValue, page_level: "", window: "", finish_reason: data.choices[0]["finish_reason"] } } },
                    { score: 0, text: data.choices[0]["delta"]["content"], document: { doc_metadata: { doc_id: 0, file_name: "assistant", original_text: data.choices[0]["delta"]["content"], page_level: "", window: data.choices[0]["delta"]["content"], finish_reason: data.choices[0]["finish_reason"] } } },
                    ...data.choices[0]["sources"]
                ]);
                setReceivedDataCount(prevCount => prevCount + 1);

            }

        });
        console.log(outputValue)
        // Limpia el evento cuando el componente se desmonta
        return () => {
            //setLoading(false)
            socket.off('streaming', {});
            socket.disconnect(); // Cierra la conexión
        };
    }, [socket])

    useEffect(() => {
        const chatElement = chatRef.current;
        if (chatElement) {
            // Asegúrate de que los mensajes estén cargados antes de realizar el desplazamiento
            const messages = chatElement.querySelectorAll('.question');
            if (messages.length > 0) {
                //console.log("more than 0 messages")
                const lastMessage = messages[messages.length - 1];
                const isScrolledToBottom = chatElement.scrollHeight - chatElement.clientHeight <= chatElement.scrollTop + 1;
                //console.log(lastMessage)
                // Realiza el desplazamiento solo si ya estás en la parte inferior
                if (isScrolledToBottom) {
                    lastMessage.scrollIntoView({ behavior: 'smooth' });
                } else {
                    lastMessage.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }, [outputValue]);

    return (
        <>
            <div className={`${styles.main_container}`}>
                <aside className={`${styles.sidebar}`}>
                    <header className={`${styles.sidebar_header}`}>
                        <ImageWrapper
                            src={logo}
                            alt="Company logo"
                            className={`${styles.company_logo}`}
                        />
                        {/* Next is the button for  */}
                        <ImageWrapper
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/624db2257d94463f89ef309b9b8ab4b8f6a97f8918f95a25985278d520683ba6?apiKey=0bc53d04746e448b89d04dabbe0c1025&"
                            alt="Menu icon"
                            className={`${styles.menu_icon}`}
                        />
                    </header>
                    <nav className={`${styles.sidebar_nav}`}>
                        <button className={`${styles.nav_button} ${styles.home_button}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" fill-opacity="1">
                                <path d="M17.3547 8.26949L11.1047 2.01949C10.8117 1.72657 10.4143 1.56201 10 1.56201C9.58569 1.56201 9.18833 1.72657 8.89532 2.01949L2.64532 8.26949C2.49964 8.41428 2.38415 8.58655 2.30557 8.77632C2.22698 8.96608 2.18685 9.16957 2.18751 9.37496V16.875C2.18751 17.1236 2.28628 17.3621 2.4621 17.5379C2.63791 17.7137 2.87637 17.8125 3.12501 17.8125H8.12501C8.37365 17.8125 8.6121 17.7137 8.78792 17.5379C8.96374 17.3621 9.06251 17.1236 9.06251 16.875V12.8125H10.9375V16.875C10.9375 17.1236 11.0363 17.3621 11.2121 17.5379C11.3879 17.7137 11.6264 17.8125 11.875 17.8125H16.875C17.1236 17.8125 17.3621 17.7137 17.5379 17.5379C17.7137 17.3621 17.8125 17.1236 17.8125 16.875V9.37496C17.8132 9.16957 17.773 8.96608 17.6945 8.77632C17.6159 8.58655 17.5004 8.41428 17.3547 8.26949ZM15.9375 15.9375H12.8125V11.875C12.8125 11.6263 12.7137 11.3879 12.5379 11.212C12.3621 11.0362 12.1236 10.9375 11.875 10.9375H8.12501C7.87637 10.9375 7.63791 11.0362 7.4621 11.212C7.28628 11.3879 7.18751 11.6263 7.18751 11.875V15.9375H4.06251V9.50387L10 3.56637L15.9375 9.50387V15.9375Z" fill="#1A1A1A"></path>
                            </svg>
                            <span className={`${styles.nav_text}`}>Home</span>
                        </button>
                        <div className={`${styles.nav_button} ${styles.search_button}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" fill-opacity="0.48">
                                <path d="M17.9422 17.0578L14.0305 13.1469C15.1643 11.7857 15.7297 10.0398 15.609 8.27244C15.4883 6.50506 14.6909 4.85223 13.3827 3.65779C12.0744 2.46334 10.356 1.81926 8.58498 1.85951C6.81394 1.89976 5.12659 2.62125 3.87395 3.87389C2.62131 5.12653 1.89982 6.81388 1.85957 8.58492C1.81932 10.356 2.46341 12.0744 3.65785 13.3826C4.85229 14.6909 6.50512 15.4883 8.2725 15.6089C10.0399 15.7296 11.7858 15.1642 13.1469 14.0305L17.0579 17.9422C17.1159 18.0003 17.1849 18.0463 17.2607 18.0777C17.3366 18.1092 17.4179 18.1253 17.5001 18.1253C17.5822 18.1253 17.6635 18.1092 17.7394 18.0777C17.8152 18.0463 17.8842 18.0003 17.9422 17.9422C18.0003 17.8841 18.0464 17.8152 18.0778 17.7393C18.1092 17.6634 18.1254 17.5821 18.1254 17.5C18.1254 17.4179 18.1092 17.3366 18.0778 17.2607C18.0464 17.1848 18.0003 17.1159 17.9422 17.0578ZM3.12506 8.75C3.12506 7.63748 3.45496 6.54994 4.07304 5.62491C4.69112 4.69989 5.56963 3.97892 6.59746 3.55317C7.6253 3.12743 8.7563 3.01604 9.84744 3.23308C10.9386 3.45012 11.9409 3.98585 12.7275 4.77252C13.5142 5.55919 14.0499 6.56147 14.267 7.65261C14.484 8.74376 14.3726 9.87475 13.9469 10.9026C13.5211 11.9304 12.8002 12.8089 11.8751 13.427C10.9501 14.0451 9.86258 14.375 8.75006 14.375C7.25872 14.3733 5.82894 13.7802 4.77441 12.7256C3.71987 11.6711 3.12671 10.2413 3.12506 8.75Z" fill="#1A1A1A"></path>
                            </svg>
                            <input className={`${styles.nav_text}`} onChange={handleInputChangeSearch} placeholder="Search"
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSendInputSearch()
                                    }
                                }} />
                        </div>
                        <Folder modelImport={modalImport} openCloseModalImport={openCloseModalImport} setModalImport={setModalImport} cardHeight={closeMessage ? "100px" : "100px"} />
                    </nav>
                    <div className={`${styles.sidebar_footer}`}>
                        {/* {closeMessage ? <></> : <div className={`${styles.theme_picker}`} onClick={()=>{setCloseMessage(true)}}>
                            <div className={`${styles.theme_info}`}>
                                <h3 className={`${styles.theme_title}`}>Server Alert</h3>
                                <IconWrapper
                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf23ee2c620a77a59846846be1a66678baf96edf4d48256dcf8a76518043928b?apiKey=0bc53d04746e448b89d04dabbe0c1025&"
                                    alt="Theme icon"
                                    className={`${styles.theme_icon}`}                                    
                                />
                            </div>
                            <p className={`${styles.ttheme_description}`}>
                                Due to high demand, <br /> your answer will be on queue. <br />
                            </p>
                        </div>} */}

                        <button className={`${styles.refer_button}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="none"><path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z" fill="#1A1A1A" fill-opacity="0.48"></path></svg>
                            <span className={`${styles.refer_text}`}>Refer & earn</span>
                        </button>
                        {localStorage.getItem("role") == "Tech" ? <button className={`${styles.how_to_button}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M7 0.5C5.71442 0.5 4.45772 0.881218 3.3888 1.59545C2.31988 2.30968 1.48676 3.32484 0.994786 4.51256C0.502816 5.70028 0.374095 7.00721 0.624899 8.26809C0.875703 9.52896 1.49477 10.6872 2.40381 11.5962C3.31285 12.5052 4.47104 13.1243 5.73192 13.3751C6.99279 13.6259 8.29973 13.4972 9.48744 13.0052C10.6752 12.5132 11.6903 11.6801 12.4046 10.6112C13.1188 9.54229 13.5 8.28558 13.5 7C13.4982 5.27665 12.8128 3.62441 11.5942 2.40582C10.3756 1.18722 8.72335 0.50182 7 0.5ZM7 12.5C5.91221 12.5 4.84884 12.1774 3.94437 11.5731C3.0399 10.9687 2.33495 10.1098 1.91867 9.10476C1.50238 8.09977 1.39347 6.9939 1.60568 5.927C1.8179 4.86011 2.34173 3.8801 3.11092 3.11091C3.8801 2.34172 4.86011 1.8179 5.92701 1.60568C6.9939 1.39346 8.09977 1.50238 9.10476 1.91866C10.1098 2.33494 10.9687 3.03989 11.5731 3.94436C12.1774 4.84883 12.5 5.9122 12.5 7C12.4983 8.45818 11.9184 9.85617 10.8873 10.8873C9.85617 11.9184 8.45819 12.4983 7 12.5ZM8 10C8 10.1326 7.94732 10.2598 7.85356 10.3536C7.75979 10.4473 7.63261 10.5 7.5 10.5C7.23479 10.5 6.98043 10.3946 6.7929 10.2071C6.60536 10.0196 6.5 9.76522 6.5 9.5V7C6.36739 7 6.24022 6.94732 6.14645 6.85355C6.05268 6.75979 6 6.63261 6 6.5C6 6.36739 6.05268 6.24021 6.14645 6.14645C6.24022 6.05268 6.36739 6 6.5 6C6.76522 6 7.01957 6.10536 7.20711 6.29289C7.39465 6.48043 7.5 6.73478 7.5 7V9.5C7.63261 9.5 7.75979 9.55268 7.85356 9.64645C7.94732 9.74021 8 9.86739 8 10ZM6 4.25C6 4.10166 6.04399 3.95666 6.1264 3.83332C6.20881 3.70999 6.32595 3.61386 6.46299 3.55709C6.60003 3.50032 6.75083 3.48547 6.89632 3.51441C7.04181 3.54335 7.17544 3.61478 7.28033 3.71967C7.38522 3.82456 7.45665 3.9582 7.48559 4.10368C7.51453 4.24917 7.49968 4.39997 7.44291 4.53701C7.38615 4.67406 7.29002 4.79119 7.16668 4.8736C7.04334 4.95601 6.89834 5 6.75 5C6.55109 5 6.36032 4.92098 6.21967 4.78033C6.07902 4.63968 6 4.44891 6 4.25Z" fill="#1A1A1A" fill-opacity="0.48"></path></svg>
                            <span className={`${styles.how_to_text}`}><WidgetVector /></span>
                        </button> : <></>}

                        <button className={`${styles.ai_settings_button}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 20" fill="none" fill-opacity="0.48"><path d="M15.936 10.0828L11.904 8.59844L10.4196 4.56328C10.3317 4.32448 10.1726 4.11838 9.96393 3.9728C9.75521 3.82722 9.50687 3.74917 9.25239 3.74917C8.99792 3.74917 8.74958 3.82722 8.54086 3.9728C8.33215 4.11838 8.17311 4.32448 8.08521 4.56328L6.59927 8.59375L2.56411 10.0781C2.32531 10.166 2.11921 10.3251 1.97363 10.5338C1.82806 10.7425 1.75 10.9908 1.75 11.2453C1.75 11.4998 1.82806 11.7481 1.97363 11.9568C2.11921 12.1656 2.32531 12.3246 2.56411 12.4125L6.5938 13.9062L8.07818 17.9391C8.16608 18.1779 8.32512 18.384 8.53383 18.5295C8.74255 18.6751 8.99089 18.7532 9.24536 18.7532C9.49983 18.7532 9.74818 18.6751 9.95689 18.5295C10.1656 18.384 10.3246 18.1779 10.4126 17.9391L11.8969 13.907L15.9321 12.4227C16.1709 12.3348 16.377 12.1757 16.5226 11.967C16.6681 11.7583 16.7462 11.5099 16.7462 11.2555C16.7462 11.001 16.6681 10.7527 16.5226 10.5439C16.377 10.3352 16.1709 10.1762 15.9321 10.0883L15.936 10.0828ZM11.468 12.7344C11.2991 12.7964 11.1457 12.8944 11.0185 13.0216C10.8913 13.1488 10.7933 13.3022 10.7313 13.4711L9.24693 17.4914L7.76568 13.468C7.70364 13.3 7.60594 13.1474 7.4793 13.0208C7.35266 12.8941 7.20009 12.7964 7.03208 12.7344L3.01177 11.25L7.03208 9.76562C7.20009 9.70359 7.35266 9.60589 7.4793 9.47925C7.60594 9.35261 7.70364 9.20004 7.76568 9.03203L9.25005 5.01172L10.7344 9.03203C10.7964 9.20093 10.8944 9.35431 11.0216 9.48153C11.1489 9.60875 11.3022 9.70676 11.4711 9.76875L15.4915 11.2531L11.468 12.7344ZM11.7501 3.125C11.7501 2.95924 11.8159 2.80027 11.9331 2.68306C12.0503 2.56585 12.2093 2.5 12.3751 2.5H13.6251V1.25C13.6251 1.08424 13.6909 0.925268 13.8081 0.808058C13.9253 0.690848 14.0843 0.625 14.2501 0.625C14.4158 0.625 14.5748 0.690848 14.692 0.808058C14.8092 0.925268 14.8751 1.08424 14.8751 1.25V2.5H16.1251C16.2908 2.5 16.4498 2.56585 16.567 2.68306C16.6842 2.80027 16.7501 2.95924 16.7501 3.125C16.7501 3.29076 16.6842 3.44973 16.567 3.56694C16.4498 3.68415 16.2908 3.75 16.1251 3.75H14.8751V5C14.8751 5.16576 14.8092 5.32473 14.692 5.44194C14.5748 5.55915 14.4158 5.625 14.2501 5.625C14.0843 5.625 13.9253 5.55915 13.8081 5.44194C13.6909 5.32473 13.6251 5.16576 13.6251 5V3.75H12.3751C12.2093 3.75 12.0503 3.68415 11.9331 3.56694C11.8159 3.44973 11.7501 3.29076 11.7501 3.125ZM19.8751 6.875C19.8751 7.04076 19.8092 7.19973 19.692 7.31694C19.5748 7.43415 19.4158 7.5 19.2501 7.5H18.6251V8.125C18.6251 8.29076 18.5592 8.44973 18.442 8.56694C18.3248 8.68415 18.1658 8.75 18.0001 8.75C17.8343 8.75 17.6753 8.68415 17.5581 8.56694C17.4409 8.44973 17.3751 8.29076 17.3751 8.125V7.5H16.7501C16.5843 7.5 16.4253 7.43415 16.3081 7.31694C16.1909 7.19973 16.1251 7.04076 16.1251 6.875C16.1251 6.70924 16.1909 6.55027 16.3081 6.43306C16.4253 6.31585 16.5843 6.25 16.7501 6.25H17.3751V5.625C17.3751 5.45924 17.4409 5.30027 17.5581 5.18306C17.6753 5.06585 17.8343 5 18.0001 5C18.1658 5 18.3248 5.06585 18.442 5.18306C18.5592 5.30027 18.6251 5.45924 18.6251 5.625V6.25H19.2501C19.4158 6.25 19.5748 6.31585 19.692 6.43306C19.8092 6.55027 19.8751 6.70924 19.8751 6.875Z" fill="#1A1A1A"></path></svg>
                            <span className={`${styles.ai_settings_text}`}><WidgetHistorial /></span>
                        </button>
                        <div className={`${styles.ai_credits}`}>

                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0.5C5.71442 0.5 4.45772 0.881218 3.3888 1.59545C2.31988 2.30968 1.48676 3.32484 0.994786 4.51256C0.502816 5.70028 0.374095 7.00721 0.624899 8.26809C0.875703 9.52896 1.49477 10.6872 2.40381 11.5962C3.31285 12.5052 4.47104 13.1243 5.73192 13.3751C6.99279 13.6259 8.29973 13.4972 9.48744 13.0052C10.6752 12.5132 11.6903 11.6801 12.4046 10.6112C13.1188 9.54229 13.5 8.28558 13.5 7C13.4982 5.27665 12.8128 3.62441 11.5942 2.40582C10.3756 1.18722 8.72335 0.50182 7 0.5ZM7 12.5C5.91221 12.5 4.84884 12.1774 3.94437 11.5731C3.0399 10.9687 2.33495 10.1098 1.91867 9.10476C1.50238 8.09977 1.39347 6.9939 1.60568 5.927C1.8179 4.86011 2.34173 3.8801 3.11092 3.11091C3.8801 2.34172 4.86011 1.8179 5.92701 1.60568C6.9939 1.39346 8.09977 1.50238 9.10476 1.91866C10.1098 2.33494 10.9687 3.03989 11.5731 3.94436C12.1774 4.84883 12.5 5.9122 12.5 7C12.4983 8.45818 11.9184 9.85617 10.8873 10.8873C9.85617 11.9184 8.45819 12.4983 7 12.5ZM8 10C8 10.1326 7.94732 10.2598 7.85356 10.3536C7.75979 10.4473 7.63261 10.5 7.5 10.5C7.23479 10.5 6.98043 10.3946 6.7929 10.2071C6.60536 10.0196 6.5 9.76522 6.5 9.5V7C6.36739 7 6.24022 6.94732 6.14645 6.85355C6.05268 6.75979 6 6.63261 6 6.5C6 6.36739 6.05268 6.24021 6.14645 6.14645C6.24022 6.05268 6.36739 6 6.5 6C6.76522 6 7.01957 6.10536 7.20711 6.29289C7.39465 6.48043 7.5 6.73478 7.5 7V9.5C7.63261 9.5 7.75979 9.55268 7.85356 9.64645C7.94732 9.74021 8 9.86739 8 10ZM6 4.25C6 4.10166 6.04399 3.95666 6.1264 3.83332C6.20881 3.70999 6.32595 3.61386 6.46299 3.55709C6.60003 3.50032 6.75083 3.48547 6.89632 3.51441C7.04181 3.54335 7.17544 3.61478 7.28033 3.71967C7.38522 3.82456 7.45665 3.9582 7.48559 4.10368C7.51453 4.24917 7.49968 4.39997 7.44291 4.53701C7.38615 4.67406 7.29002 4.79119 7.16668 4.8736C7.04334 4.95601 6.89834 5 6.75 5C6.55109 5 6.36032 4.92098 6.21967 4.78033C6.07902 4.63968 6 4.44891 6 4.25Z" fill="#1A1A1A" fill-opacity="0.48"></path></svg>
                            <span className={`${styles.ai_credits_text}`}>0/5 daily AI credits</span>
                        </div>
                        <div className={`${styles.ai_credits_bar}`} />
                        <button className={`${styles.upgrade_button}`} style={{ width: "95%" }} onClick={() => { openCloseModalPricing() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 16" fill="none" fill-opacity="1"><path d="M17.6876 9.875C17.6876 10.1236 17.5888 10.3621 17.413 10.5379C17.2372 10.7137 16.9987 10.8125 16.7501 10.8125H15.8126V11.75C15.8126 11.9986 15.7138 12.2371 15.538 12.4129C15.3622 12.5887 15.1237 12.6875 14.8751 12.6875C14.6265 12.6875 14.388 12.5887 14.2122 12.4129C14.0364 12.2371 13.9376 11.9986 13.9376 11.75V10.8125H13.0001C12.7515 10.8125 12.513 10.7137 12.3372 10.5379C12.1614 10.3621 12.0626 10.1236 12.0626 9.875C12.0626 9.62636 12.1614 9.3879 12.3372 9.21209C12.513 9.03627 12.7515 8.9375 13.0001 8.9375H13.9376V8C13.9376 7.75136 14.0364 7.5129 14.2122 7.33709C14.388 7.16127 14.6265 7.0625 14.8751 7.0625C15.1237 7.0625 15.3622 7.16127 15.538 7.33709C15.7138 7.5129 15.8126 7.75136 15.8126 8V8.9375H16.7501C16.9987 8.9375 17.2372 9.03627 17.413 9.21209C17.5888 9.3879 17.6876 9.62636 17.6876 9.875ZM2.37511 3.9375H3.31261V4.875C3.31261 5.12364 3.41138 5.3621 3.58719 5.53791C3.76301 5.71373 4.00147 5.8125 4.25011 5.8125C4.49875 5.8125 4.7372 5.71373 4.91302 5.53791C5.08883 5.3621 5.18761 5.12364 5.18761 4.875V3.9375H6.12511C6.37375 3.9375 6.6122 3.83873 6.78802 3.66291C6.96383 3.4871 7.06261 3.24864 7.06261 3C7.06261 2.75136 6.96383 2.5129 6.78802 2.33709C6.6122 2.16127 6.37375 2.0625 6.12511 2.0625H5.18761V1.125C5.18761 0.87636 5.08883 0.637903 4.91302 0.462087C4.7372 0.286272 4.49875 0.1875 4.25011 0.1875C4.00147 0.1875 3.76301 0.286272 3.58719 0.462087C3.41138 0.637903 3.31261 0.87636 3.31261 1.125V2.0625H2.37511C2.12647 2.0625 1.88801 2.16127 1.71219 2.33709C1.53638 2.5129 1.43761 2.75136 1.43761 3C1.43761 3.24864 1.53638 3.4871 1.71219 3.66291C1.88801 3.83873 2.12647 3.9375 2.37511 3.9375ZM12.3751 12.6875H12.0626V12.375C12.0626 12.1264 11.9638 11.8879 11.788 11.7121C11.6122 11.5363 11.3737 11.4375 11.1251 11.4375C10.8765 11.4375 10.638 11.5363 10.4622 11.7121C10.2864 11.8879 10.1876 12.1264 10.1876 12.375V12.6875H9.87511C9.62646 12.6875 9.38801 12.7863 9.21219 12.9621C9.03638 13.1379 8.93761 13.3764 8.93761 13.625C8.93761 13.8736 9.03638 14.1121 9.21219 14.2879C9.38801 14.4637 9.62646 14.5625 9.87511 14.5625H10.1876V14.875C10.1876 15.1236 10.2864 15.3621 10.4622 15.5379C10.638 15.7137 10.8765 15.8125 11.1251 15.8125C11.3737 15.8125 11.6122 15.7137 11.788 15.5379C11.9638 15.3621 12.0626 15.1236 12.0626 14.875V14.5625H12.3751C12.6237 14.5625 12.8622 14.4637 13.038 14.2879C13.2138 14.1121 13.3126 13.8736 13.3126 13.625C13.3126 13.3764 13.2138 13.1379 13.038 12.9621C12.8622 12.7863 12.6237 12.6875 12.3751 12.6875ZM15.3548 4.47109L4.47042 15.3547C4.17741 15.6476 3.78005 15.8122 3.36573 15.8122C2.95141 15.8122 2.55406 15.6476 2.26104 15.3547L0.644637 13.7391C0.499478 13.594 0.384329 13.4217 0.305766 13.2321C0.227204 13.0425 0.186768 12.8392 0.186768 12.634C0.186768 12.4287 0.227204 12.2255 0.305766 12.0359C0.384329 11.8463 0.499478 11.674 0.644637 11.5289L11.529 0.645313C11.822 0.352389 12.2194 0.187834 12.6337 0.187834C13.048 0.187834 13.4454 0.352389 13.7384 0.645313L15.3548 2.26094C15.5 2.40604 15.6151 2.57831 15.6937 2.76793C15.7722 2.95754 15.8127 3.16077 15.8127 3.36602C15.8127 3.57126 15.7722 3.77449 15.6937 3.9641C15.6151 4.15372 15.5 4.32599 15.3548 4.47109ZM10.422 6.75L9.25011 5.57812L2.19151 12.6336L3.36339 13.8055L10.422 6.75ZM13.8056 3.36641L12.6337 2.19453L10.5782 4.25L11.7501 5.42188L13.8056 3.36641Z" fill="#FFFFFF"></path></svg>
                            <span className={`${styles.upgrade_text}`}>Upgrade</span>
                        </button>
                        <UserMenu />
                    </div>
                </aside>
                <main className={`${styles.main_content}`}>
                    <header className={`${styles.main_header}`}>
                        {viewWindows.map((item, index) => {
                            return item
                        })}
                        <svg className={`${styles.header_icon}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" fill-opacity="0.48"><path d="M14.25 8C14.25 8.19891 14.171 8.38968 14.0303 8.53033C13.8897 8.67098 13.6989 8.75 13.5 8.75H8.75V13.5C8.75 13.6989 8.67098 13.8897 8.53033 14.0303C8.38968 14.171 8.19891 14.25 8 14.25C7.80109 14.25 7.61032 14.171 7.46967 14.0303C7.32902 13.8897 7.25 13.6989 7.25 13.5V8.75H2.5C2.30109 8.75 2.11032 8.67098 1.96967 8.53033C1.82902 8.38968 1.75 8.19891 1.75 8C1.75 7.80109 1.82902 7.61032 1.96967 7.46967C2.11032 7.32902 2.30109 7.25 2.5 7.25H7.25V2.5C7.25 2.30109 7.32902 2.11032 7.46967 1.96967C7.61032 1.82902 7.80109 1.75 8 1.75C8.19891 1.75 8.38968 1.82902 8.53033 1.96967C8.67098 2.11032 8.75 2.30109 8.75 2.5V7.25H13.5C13.6989 7.25 13.8897 7.32902 14.0303 7.46967C14.171 7.61032 14.25 7.80109 14.25 8Z" fill="#1A1A1A"></path></svg>
                    </header>
                    {selectedWindows[store.viewNumber]}
                </main>
            </div>
            <Modal open={modalImport} onClose={openCloseModalImport}>
                <ImportFiles modalImport={modalImport} setModalImport={setModalImport} />
            </Modal>
            <Modal open={modalPricing} onClose={openCloseModalPricing}>
                {bodyPricing}
            </Modal>
        </>
    )
}

export default WithAuth(MyTestComponent);