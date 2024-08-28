import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import styles from "./index.module.css";
import { Context } from '../../store/appContext';
import Swal from 'sweetalert2';
//import { encode, decodeGenerator } from "gpt-tokenizer";
import io from 'socket.io-client';
import { Modal, TextField, Button } from "@material-ui/core";
import BookLoader from '../Loading/bookloader';

const RenderText = ({ texto, setOutputValue2, outputValue2, loading, setLoading, inputValue3, selectedDB }) => {
    const [newText, setNewText] = useState("")
    const [modalAIAn, setModalAIAn] = useState(false)
    const [aiAnalysis, setAiAnalysis] = useState({ code: null, firstRow: null, left: null })
    const [promptAI, setPromptAI] = useState(null)

    const openCloseModalAIAn = () => {
        setModalAIAn(!modalAIAn)
    }
    // Expresión regular para dividir la cadena de texto
    let fragments = texto.split(/(<code[^>]*>[\s\S]*?<\/code>)/g);
    const IA_URL = process.env.IA_URL;
    const handleSendInput4 = async (value = inputValue3) => {
        console.log("executed handleSendInput4")
        const URL_QUERY_SQL = IA_URL + '/completions/sql-query';
        if (selectedDB == null) {
            alert("Please select a database")
            return
        }
        console.log("value: ", value)
        let data2 = {
            prompt: value,
            database_id: selectedDB
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
                console.log(response)

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
    const textToTableHTML = (textValue) => {
        if (textValue.includes('<code')) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = textValue;
            let codigo = tempDiv.querySelector('code');
            let textoDentroDeCode = codigo.textContent;
            textValue = textoDentroDeCode
        }

        let filas = textValue.trim().split(/\n(?!\s*;)/);
        let tablaHTML = '<table class="table table-bordered table-striped"><thead><tr>';

        // Encabezados
        let encabezados = filas[0].split('; ');
        encabezados.forEach(function (encabezado) {
            tablaHTML += '<th>' + encabezado + '</th>';
        });

        tablaHTML += '</tr></thead><tbody>';

        // Filas de datos
        let datos = []
        for (let i = 1; i < filas.length; i++) {
            datos = filas[i].replace("\n", "").split('; ');
            tablaHTML += '<tr>';
            datos.forEach(function (dato) {
                if (dato != "") {
                    tablaHTML += '<td>' + dato + '</td>';
                    //console.log('<td>' + dato + '</td>')
                }
            });
            tablaHTML += '</tr>';
            datos = []
        }

        tablaHTML += '</tbody></table>';
        //console.log(tablaHTML)
        return tablaHTML;
    }

    const textToCSV = (textValue) => {
        if (textValue.includes('<code')) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = textValue;
            let codigo = tempDiv.querySelector('code');
            let textoDentroDeCode = codigo.textContent;
            textValue = textoDentroDeCode
        }
        let lineas = textValue.trim().split(/\n(?!\s*;)/);
        let csv = '';

        // Procesar encabezados
        let encabezados = lineas[0].split(';');
        csv += encabezados.join(',') + '\n';

        // Procesar filas de datos
        for (let i = 1; i < lineas.length; i++) {
            let datos = lineas[i].split(';');
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
        if (selectedDB == null) {
            alert("Please select a database")
            return
        }
        openCloseModalAIAn()
        console.log("table: ", dictionary)
        let data2 = {
            table: dictionary.code,
            database_id: selectedDB,
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
                console.log(response)

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

    const bodyModalAIAn = (
        <div className={styles.modalauto} id="modal" style={{ width: "100%" }}>
            <h3>AI analysis helper</h3>
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
                    />
                </div>
                <br />
                <div className='col-12 d-flex justify-content-end'>
                    <button
                        type="button"
                        className={styles.button_primary}
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
                        className={styles.button_danger}
                        style={{ borderRadius: "5px" }}
                        onClick={() => {
                            openCloseModalAIAn()
                        }}
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    )

    return (<>
        {fragments.map((fragment, index) => {
            // Verificar si el fragmento es un fragmento de código o texto normal
            console.log("fragment ", index, ": ", fragment)
            if (fragment.startsWith('<code')) {
                // Si es un fragmento de código, renderizarlo como un componente preformatted
                return <div key={index} className='row d-flex justify-content-center align-items-start'>
                    <div className='col-sm-9'>
                        {fragment.includes("SELECT") ?
                            <div dangerouslySetInnerHTML={{ __html: fragment }} /> :
                            <div dangerouslySetInnerHTML={{ __html: textToTableHTML(fragment) }} className='table-responsive' />
                        }
                    </div>
                    <div className='col-sm-2'>
                        <div className='row d-flex justify-content-center align-items-start'>
                            <button className={styles.button_success} onClick={() => {
                                let tempDiv = document.createElement('div');
                                tempDiv.innerHTML = fragment;
                                let codigo = tempDiv.querySelectorAll('code');
                                if (codigo.length > 0) {
                                    let textoDentroDeCode = codigo[codigo.length - 1].textContent;
                                    if (textoDentroDeCode.includes("SELECT")) {
                                        handleSendInput4(textoDentroDeCode)
                                    } else {
                                        alert("here should be logic to ingest")
                                    }
                                }
                            }}>
                                {fragment.includes("SELECT") ? "▶️Run query" : "Ingest"}
                            </button>
                            <br />
                            {!fragment.includes("SELECT") ? <button
                                className={styles.button_primary}
                                onClick={() => {
                                    let tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = fragment;
                                    let codigo = tempDiv.querySelectorAll('code');
                                    let textoDentroDeCode = codigo[codigo.length - 1].textContent;
                                    //console.log("you must divide this text: ", textoDentroDeCode)
                                    let rowTitles = textoDentroDeCode.trim().split(/\n(?!\s*;)/)
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
                            <br />
                            {!fragment.includes("SELECT") ? <button
                                className={styles.button_success}
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
            } else {
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

const PromptLLM = () => {
    const [loading, setLoading] = useState(false)
    const { store, actions } = useContext(Context)
    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue3, setInputValue3] = useState('');
    const [outputValue, setOutputValue] = useState([]);
    const [outputValue2, setOutputValue2] = useState(null);
    const [userQuestion, setUserQuestion] = useState(false)
    const [userChat, setUserChat] = useState('')
    const [modeChunk, setModeChunk] = useState(true)
    const [modeStreaming, setModeStreaming] = useState(true)
    const [startingStreamingAnswer, setStartingStreamingAnswer] = useState(false)
    const [groupLinkedDB, setGroupLinkedDB] = useState([])
    const [modalLink, setModalLink] = useState(false)
    const chatRef = useRef(null);
    const accordionRef = useRef(null);
    const limitTokens = 2048
    //let encodedTokens = encode(inputValue);
    const IA_URL = process.env.IA_URL;
    const URL_COMPLETIONS = IA_URL + '/completions';
    const URL_COMPLETIONS_STREAMING = IA_URL + '/completions/streaming';
    const URL_DOWNLOAD = IA_URL + '/user/download/';
    const URL_LIST_DB = '/list-db/user';
    const URL_COMPLETIONS_SQL = IA_URL + '/completions/sql';
    const URL_QUERY_SQL = IA_URL + '/completions/sql-query';
    const customHeaders = {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        //CustomHeader: 'CustomValue',
    }
    const [socket, setSocket] = useState(null);
    const [receivedDataCount, setReceivedDataCount] = useState(0);
    const [startSocket, setStartSocket] = useState(false);
    const [selectedDB, setSelectedDB] = useState(null)
    //const expectedDataCount = /* Número total esperado de datos */;

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

    /* const socket = io(process.env.IA_URL, {
        extraHeaders: customHeaders,
    }); */

    /* const decodedTokens = useMemo(() => {
        const tokens = [];
        for (const token of decodeGenerator(encodedTokens)) {
            tokens.push(token);
        }
        return tokens;
    }, [encodedTokens]); */

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
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
        setOutputValue('')
        setLoading(true)
        setUserQuestion(false)

        setUserChat(inputValue)

        if (modeChunk) {
            let data = {
                prompt: inputValue,
                group_context_filter: null
            }
            if (store["group_context_filter"].length > 0) {
                data["group_context_filter"] = store["group_context_filter"]
            }

            let url_for_LLM = URL_COMPLETIONS
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
        }


        return
    }

    const handleSendInput2 = async () => {
        if (selectedDB == null) {
            alert("Please select a database")
            return
        }
        let data2 = {
            prompt: inputValue2,
            database_id: selectedDB
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

    const handleSendInput3 = async (value = inputValue3) => {
        if (selectedDB == null) {
            alert("Please select a database")
            return
        }
        console.log("value: ", value)
        let data2 = {
            prompt: value,
            database_id: selectedDB
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

    const openCloseModalLink = async () => {
        if (!modalLink) {
            setLoading(true)
            let tempURL = IA_URL + URL_LIST_DB
            console.log("tempURL: ", tempURL)
            try {
                let dataSQL = await fetch(tempURL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Accept": "application/json"
                    },
                    //body: JSON.stringify({ group_id: indexID })
                })
                if (dataSQL.ok) {
                    dataSQL = await dataSQL.json()
                    //setLoading(false)
                    //console.log(data)

                    setGroupLinkedDB(dataSQL)
                }
                setLoading(false)
            }
            catch (error) {
                setLoading(false)
            }
        }

        setModalLink(!modalLink);
    };

    const bodyModalLink = (
        <div className={styles.modal} id="modal" style={{ width: "100%" }}>
            <h3>Databases</h3>
            <br />
            <div className='col d-flex' style={{ overflowY: "hidden" }}>
                <div align="center" className='card p-2' style={{ width: "100%", maxHeight: "170px" }}>
                    <h4>Select one database</h4>
                    {loading && <div className="d-flex justify-content-center align-items-center" id="loading2">
                        <div className="spinner-border text-warning" role="status" aria-hidden="true">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                    <div className="list-group" style={{ overflowY: "scroll", width: "100%", minHeight: "90%" }}>
                        {groupLinkedDB.length > 0 ? groupLinkedDB.map((item, indice) => {
                            // Verificar si el 'name_file' ya está en el conjunto
                            return (
                                <li
                                    className={styles.listitemgroupfile}
                                    key={indice}
                                    style={{ color: "black", lineHeight: "normal", backgroundColor: "white", borderColor: "#ececec" }}
                                >
                                    <div className={styles.item} style={{ display: "flex", fontSize: "0.9em", justifyContent: "start", alignItems: "center" }}>
                                        <strong>Dialect: </strong> {item.dialect} - <strong>Name: </strong>{item.database}
                                    </div>
                                    {item.id == selectedDB ? <button
                                        type="button text-dark"
                                        className={styles.button_success}
                                        style={{ borderRadius: "5px" }}
                                        onClick={(e) => {
                                            setSelectedDB(null)
                                        }}
                                    >
                                        Selected Database
                                    </button> : <button
                                        type="button text-dark"
                                        className={styles.button_danger}
                                        style={{ borderRadius: "5px" }}
                                        onClick={(e) => {
                                            setSelectedDB(item.id)
                                        }}
                                    >
                                        Select Database
                                    </button>}

                                </li>)
                        }) : <>You don't have databases registered</>}
                    </div>
                </div>
                <div align="center" className='card p-2' style={{ width: "100%", maxHeight: "170px" }}>
                    <h4>Tables</h4>
                    <div className="list-group" style={{ overflowY: "scroll", width: "100%", minHeight: "90%" }}>
                        {groupLinkedDB.length > 0 ? groupLinkedDB.map((item, indice) => {
                            if (item.id == selectedDB) {
                                return <li
                                    className="list-group"
                                    key={indice}
                                    style={{ color: "black", lineHeight: "normal", backgroundColor: "white", borderColor: "#ececec" }}
                                >
                                    {item.tables.length > 0 ?
                                        item.tables.map((table, table_index) => {
                                            return (
                                                <div class="accordion" id={`accordion-table${table_index}`} key={table_index}>
                                                    <div class="accordion-item">
                                                        <h2 class="accordion-header col d-flex" id={`heading-table${table_index}`}>
                                                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-table${table_index}`} aria-expanded="false" aria-controls={`collapse-table${table_index}`}>
                                                                {table.name}
                                                            </button>
                                                            <button type="button" className={styles.button_success} onClick={() => {
                                                                if (item.dialect == "mssql") {
                                                                    setInputValue3(`SELECT TOP 50 * FROM ${table.name};`)
                                                                    handleSendInput3(`SELECT TOP 50 * FROM ${table.name};`)
                                                                } else {
                                                                    setInputValue3(`SELECT * FROM ${table.name} LIMIT 50;`)
                                                                    handleSendInput3(`SELECT * FROM ${table.name} LIMIT 50;`)
                                                                }
                                                            }} style={{ width: "150px" }}>
                                                                Run query (limit 50)
                                                            </button>
                                                            <button type="button" className={styles.button_success} onClick={() => {
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
                                                            }} style={{ width: "150px" }}>
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
                    </div>
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className={styles.output} style={{ height: "450px", border: "1px solid black", margin: "10px", width: "98%" }}>
                    {/* {outputValue2 != null? RenderText(outputValue2, handleSendInput3) : <></>} */}
                    {outputValue2 != null ? <RenderText texto={outputValue2} setOutputValue2={setOutputValue2} outputValue2={outputValue2} loading={loading} setLoading={setLoading} inputValue3={inputValue3} selectedDB={selectedDB} /> : <></>}
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-sm-12 col-md-8 '>
                    <div className="text-input">
                        <textarea type="col-12 text-input"
                            value={inputValue2}
                            onChange={handleInputChange2}
                            style={{ color: "black", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", maxHeight: "200px", borderRadius: "5px" }}
                            placeholder='Write in natural language your query to the database selected'
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    console.log("test")
                                    handleSendInput2()
                                }
                            }} />
                    </div>
                </div>
                <div className='col-sm-12 col-md-4 d-flex justify-content-center align-items-center'>
                    {loading ?
                        <button className={styles.button_success} onClick={handleSendInput2} disabled>Send</button> :
                        <button className={styles.button_success} onClick={handleSendInput2}>Send</button>
                    }
                </div>
            </div>
            <div className='row d-flex justify-content-center'>

                <div class="accordion" id={`accordion-table-advance`} >
                    <div class="accordion-item">
                        <h2 class="accordion-header col d-flex" id={`heading-table-advance`}>
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-table-advance`} aria-expanded="false" aria-controls={`collapse-table-advance`}>
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
                                            style={{ color: "black", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", maxHeight: "200px", borderRadius: "5px" }}
                                            placeholder='Write a SQL QUERY HERE'
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
                                        <button className={styles.button_success} onClick={handleSendInput3} disabled>Send SQL Query</button> :
                                        <button className={styles.button_success} onClick={handleSendInput3}>Send SQL Query</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-sm-2 col-md-8'></div>
                <div className='col-sm-5 col-md-4'>
                    <div className='col d-flex'>
                        <div className='col'><button className={styles.button_danger} onClick={() => setSelectedDB(null)}>Un-Select</button></div>
                        <div className='col'><button className={styles.button_danger} onClick={() => openCloseModalLink()}>Close</button></div>
                    </div>
                </div>
            </div>
        </div>
    );

    /* useEffect(() => {
        if (outputValue.length > 0) {
            document.querySelector('#scrolldown').scrollTop = document.querySelector('#scrolldown').scrollHeight
        }
    }, [outputValue]) */

    useEffect(() => {
        if (!socket) return;

        socket.on('streaming', (data) => {
            console.log("streaming")
            if (data.choices[0]["finish_reason"] == "stop") {
                console.log("cancelado el streaming")
                setLoading(false)
                socket.disconnect();
                setStartSocket(!startSocket)
                return
            }
            else if (data.choices[0]["sources"] != null) {
                setLoading(true)
                //console.log(data)
                setOutputValue(prevOutput => [
                    { score: 0, text: inputValue, document: { doc_metadata: { doc_id: 0, file_name: "User", original_text: inputValue, page_level: "", window: "" } } },
                    { score: 0, text: data.choices[0]["delta"]["content"], document: { doc_metadata: { doc_id: 0, file_name: "assistant", original_text: data.choices[0]["delta"]["content"], page_level: "", window: data.choices[0]["delta"]["content"] } } },
                    ...data.choices[0]["sources"]
                ]);
                setReceivedDataCount(prevCount => prevCount + 1);

            }

        });
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

    /*     useEffect(() => {
            let eventSource;
            if (store.promptLLM && modeStreaming) {
                let objTemp = {
                    prompt: inputValue,
                    group_context_filter: null
                }
                if (store["group_context_filter"].length > 0) {
                    objTemp["group_context_filter"] = store["group_context_filter"]
                }
                eventSource = fetch(`${URL_COMPLETIONS_STREAMING}`, {
                    method:"POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(objTemp)
                }).then((event) => {
                    let data = JSON.parse(event.data);
                    console.log(data);
                    // Process the streaming data here and update the state accordingly
                    // For example, you can append the streaming data to the outputValue state
                    setOutputValue(prevOutput => [...prevOutput, , { score: 0, text: inputValue, document: { doc_metadata: { doc_id: 0, file_name: "User", original_text: inputValue, page_level: "", window: "" } } }, { score: 0, text: data.choices[0]["message"]["content"], document: { doc_metadata: { doc_id: 0, file_name: "assistant", original_text: data.choices[0]["message"]["content"], page_level: "", window: data.choices[0]["message"]["content"] } } }, ...data.choices[0]["sources"]]);
                }).catch((error) => {
                    console.error("EventSource failed:", error);
                    setLoading(false)
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: "Failed Connection",
                        showConfirmButton: false,
                        text: error,
                        timer: 1500
                    })
                    // Handle error here
                })
                setLoading(false)
                setInputValue('');
            }
     
        
        }, [startingStreamingAnswer]); */


    return (
        <div className={styles.prompt}>

            <div className={'w-100'}>
                <h1 className="title-ia">
                    {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
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
                    {outputValue.length > 0 && <div className={styles.output} style={{ color: "black", maxHeight: "500px !important" }} id='scrolldown' ref={chatRef}>{
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

                <div className='row d-flex'>
                    <div className='col-sm-12 col-md-8'>
                        <div className="text-input">
                            <textarea type="col-12 text-input"
                                value={inputValue}
                                onChange={handleInputChange}
                                style={{ color: "black", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", maxHeight: "200px", borderRadius: "5px" }}
                                placeholder='Write description here'
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSendInput()
                                    }
                                }} />

                        </div>
                    </div>
                    <div className='col-sm-12 col-md-4 d-flex justify-content-center'>
                        {loading?
                            <button className={styles.button_success} onClick={handleSendInput} disabled>Send</button> :
                            <button className={styles.button_success} onClick={handleSendInput}>Send</button>
                        }
                    </div>
                </div>
                <div className='row d-flex'>
                    <div className='col-sm-12 col-md-8'>
                        <div className='row d-flex'>
                            <div className='col'><button className={styles.button_danger} onClick={e => { setOutputValue([]) }}>Clear Screen</button></div>
                            <div className='col'><button className={styles.button_danger} onClick={e => { openCloseModalLink() }}>Select Database</button></div>
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-4 d-flex justify-content-center'>
                        <button type="button" className={styles.button_success} onClick={actions.changePromptLLM}>LLM activated</button>
                        {/* {store.promptLLM ? <button type="button" className={modeStreaming ? styles.button_success : styles.button_danger} onClick={e => { setModeStreaming(!modeStreaming) }}>Streaming</button> : <></>} */}
                        {/* {inputValue.length > 0 ?
                            <div className="row d-flex statistics">
                                <h5>Characters: {inputValue.length}</h5>
                                <h5 className={encodedTokens.length <= limitTokens ? "limit-ok" : "limit-error"}>Tokens (limit {limitTokens}): {encodedTokens.length}</h5>
                            </div> : <></>} */}
                    </div>
                </div>



            </div>

            <Modal open={modalLink} onClose={openCloseModalLink}>
                {bodyModalLink}
            </Modal>
        </div>
    )
}

export default PromptLLM;