import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../store/appContext';
import styles from "./index.module.css";
import Swal from 'sweetalert2';
import { Modal, TextField, Button } from "@material-ui/core";


const RenderText = ({ texto, setOutputValue2, outputValue2, loading, setLoading, inputValue3, selectedDB }) => {
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
                if (selectedDB == null) {
                        alert("Please select a database")
                        return
                }
                //console.log("value: ", value)
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

                let filas = textValue.trim().split(/\n(?!\s*;)/);
                let tablaHTML = `<table class="table table-bordered table-striped" id="table-no-${tableIndex}"><thead><tr>`;
                let tablaHTML2 = `<table class="table table-bordered table-striped" id="table-no-${tableIndex}"><thead><tr>`;

                // Encabezados
                let encabezados = filas[0].split('; ');
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
                        datos = filas[i].replace("\n", "").split('; ');
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

                tablaHTML2 += `</tbody></table><button id="${id}">Open in a new window</button>`;
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
                //console.log("table: ", dictionary)
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
                                                        <button className={styles.button_success} onClick={() => {
                                                                let tempDiv = document.createElement('div');
                                                                tempDiv.innerHTML = fragment;
                                                                let codigo = tempDiv.querySelectorAll('code');
                                                                if (codigo.length > 0) {
                                                                        let textoDentroDeCode = codigo[codigo.length - 1].textContent;
                                                                        if (textoDentroDeCode.includes("SELECT")) {
                                                                                handleSendInput4(textoDentroDeCode)
                                                                        } else {
                                                                                alert("here should be logic to Create Graph")
                                                                        }
                                                                }
                                                        }}>
                                                                {fragment.includes("SELECT") ? "▶️Run query" : "Create Graph"}
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

const GroupDB = () => {
        const { store, actions } = useContext(Context)
        const [loading, setLoading] = useState(false)
        const [reload, setReload] = useState(false);
        const [selectedDB, setSelectedDB] = useState(null)
        const [inputValue2, setInputValue2] = useState('');
        const [inputValue3, setInputValue3] = useState('');
        const [outputValue, setOutputValue] = useState([]);
        const [outputValue2, setOutputValue2] = useState(null);
        const [modalLinkSQL, setModalLinkSQL] = useState(false)
        const [windows1Parameters, setWindows1Parameters] = useState({ height: "450px" })
        const [windows1, setWindows1] = useState(false)
        const [windows2Parameters, setWindows2Parameters] = useState({ height: "450px" })
        const [windows2, setWindows2] = useState(false)

        const IA_URL = process.env.IA_URL;
        const URL_LIST_DB = '/list-db-dashboard/user';
        const URL_COMPLETIONS_SQL = IA_URL + '/completions/sql';
        const URL_QUERY_SQL = IA_URL + '/completions/sql-query';
        const URL_ADD_DB = '/relational-dashboard/sql';
        const URL_DELETE_DB = "/list-db-dashboard/user";
        const customHeaders = {
                "Authorization": "Bearer " + localStorage.getItem("token"),
                //CustomHeader: 'CustomValue',
        }

        const openCloseModalLinkSQL = () => {
                setModalLinkSQL(!modalLinkSQL);
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

        const addNewDB = async (e) => {
                e.preventDefault()
                let data = new FormData(e.target)
                let database = data.get("database")
                let driver = data.get("driver")
                let dialect = data.get("dialect")
                let user = data.get("user")
                let password = data.get("password")
                let host = data.get("host")
                let port = data.get("port")

                if (port == null || typeof (port) === "string") {
                        port = 0
                }

                let tempobj = {
                        database: database,
                        driver: driver,
                        dialect: dialect,
                        user: user,
                        password: password,
                        host: host,
                        port: port
                }

                let tempURL = URL_ADD_DB
                console.log("tempobj: ", tempobj)
                try {
                        let data2 = await actions.useFetch(tempURL, tempobj, "POST")
                        //console.log("data in promise: ", data2.status)

                        if (data2.status == 200) {
                                data2 = await data2.json()
                                setLoading(false)
                                Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: "Success",
                                        text: "Database added correctly",
                                        showConfirmButton: false,
                                        timer: 1500
                                })
                                //setGroupLinkedFiles(data2.group.list_files)
                                setReload(!reload)
                                return
                        }
                        data2 = await data2.json()
                        setLoading(false)
                        Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: "Error",
                                text: data2.msg,
                                showConfirmButton: false,
                                timer: 1500
                        })
                } catch (error) {
                        setLoading(false)
                        console.log("error fetch: ", error);
                        Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: "Ok",
                                text: "error",
                                showConfirmButton: false,
                                timer: 1500
                        })
                }
        }

        const unlinkDB = async (dbId) => {
                setLoading(true)
                const tempObj = {
                        "database_id": dbId
                }
                let tempURL = URL_DELETE_DB
                console.log("tempURL: ", tempURL)
                try {
                        let data = await actions.useFetch(tempURL, tempObj, "DELETE")
                        //console.log("data in promise: ", data)

                        if (data.ok) {
                                data = await data.json()
                                setLoading(false)
                                Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: "Success",
                                        text: "database deleted",
                                        showConfirmButton: false,
                                        timer: 1500
                                })
                                actions.setListDB(data)
                                return
                        }
                        data = await data.json()
                        setLoading(false)
                        Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: "Error",
                                text: data.msg,
                                showConfirmButton: false,
                                timer: 1500
                        })
                        return
                } catch (error) {
                        setLoading(false)
                        console.log("error fetch: ", error);
                        Swal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: "Ok",
                                text: "error",
                                showConfirmButton: false,
                                timer: 1500
                        })
                }

        }


        const bodyModaAddSQL = (
                <div className={styles.modal} id="modal"><h3>Add Database</h3>

                        <br />
                        <button
                                type="button text-dark"
                                className={styles.button_danger}
                                style={{ borderRadius: "5px" }}
                                onClick={(e) => {
                                        //id of group listFiles[indexList].id
                                        openCloseModalLinkSQL()
                                }}
                        >
                                Close
                        </button>
                        <br />
                        <form className="row g-3" style={{ padding: "20px" }} onSubmit={(e) => { addNewDB(e) }}>
                                <div className="col-md-6">
                                        <label for="inputState" className="form-label">Dialect</label>
                                        <select id="inputState" className="form-select" name="dialect">
                                                <option selected>Choose Dialect</option>
                                                <option>mysql</option>
                                                <option>postgresql</option>
                                                <option >mssql</option>
                                                <option disabled>mariadb</option>
                                                <option disabled>sqlite</option>
                                                <option disabled>oracle</option>

                                        </select>
                                </div>
                                <div className="col-md-6">
                                        <label for="inputState" className="form-label">Driver</label>
                                        <select id="inputState" className="form-select" name="driver">
                                                <option selected>Choose Driver</option>
                                                <option>mysqlconnector</option>
                                                <option >pyodbc</option>
                                                <option disabled>pymysql</option>
                                                <option disabled>pysqlite</option>
                                                <option disabled>python-oracledb</option>
                                        </select>
                                </div>
                                <div className="col-md-6">
                                        <label for="inputEmail4" className="form-label">Database User</label>
                                        <input type="text" className="form-control" id="inputEmail4" placeholder='root' name="user" required />
                                </div>
                                <div className="col-md-6">
                                        <label for="inputPassword4" className="form-label">Database Password</label>
                                        <input type="password" className="form-control" id="inputPassword4" name="password" required />
                                </div>
                                <div className="col-12">
                                        <label for="inputAddress" className="form-label">Database Name</label>
                                        <input type="text" className="form-control" id="inputDatabaseName" placeholder="Name of the database" name="database" required />
                                </div>
                                <div className="col-6">
                                        <label for="inputAddress2" className="form-label">Host</label>
                                        <input type="text" className="form-control" id="inputAddress2" placeholder="localhost, URL or IP, ex: 192.168.1.110" name="host" required />
                                </div>
                                <div className="col-6">
                                        <label for="inputAddress3" className="form-label">PORT</label>
                                        <input type="number" className="form-control" id="inputAddress3" placeholder="port, ex: 3346" name="port" />
                                </div>
                                <div className="col-12">
                                        <button type="submit" className={styles.button_approve}>Register Database</button>
                                </div>
                        </form>

                </div>
        )

        useEffect(() => {
                const loadList = async () => {
                        setLoading(true)
                        let tempURL = IA_URL + URL_LIST_DB
                        try {
                                let dataSQL = await fetch(tempURL, {
                                        method: "GET",
                                        headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                                                "Accept": "application/json"
                                        },
                                })
                                if (dataSQL.ok) {
                                        dataSQL = await dataSQL.json()
                                        actions.setListDB(dataSQL)
                                }
                                setLoading(false)
                        }
                        catch (error) {
                                setLoading(false)
                        }
                }
                loadList()
        }, [reload])

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

        return (
                <div className={styles.group_db}>
                        <div id="modal" style={{ width: "100%" }}>
                                <h3>Databases</h3>
                                <br />
                                <div className='row d-flex'>
                                        <div className='col-sm-12 d-flex' style={{ overflowY: "hidden", maxHeight: windows1Parameters.height }}>
                                                <div align="center" className='card p-2' style={{ width: "100%" }}>
                                                        <div className='col d-flex justify-content-between align-items-center'>
                                                                <h4>Select one database </h4>
                                                                <button className={styles.button_success} style={{ width: "20px" }} onClick={() => { openCloseModalLinkSQL() }}>➕</button>
                                                                <button className={styles.button_success} style={{ width: "20px" }} onClick={() => { changeWindows1() }}>⏹</button>
                                                                {loading && <div className="d-flex justify-content-center align-items-center" id="loading2">
                                                                        <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                                                                <span className="visually-hidden">Loading...</span>
                                                                        </div>
                                                                </div>}
                                                        </div>
                                                        <div className="list-group" style={{ overflowY: "scroll", width: "100%", minHeight: "90%", maxHeight: "350px" }}>
                                                                {store.dbList.length > 0 ? store.dbList.map((item, indice) => {
                                                                        // Verificar si el 'name_file' ya está en el conjunto
                                                                        return (
                                                                                <li
                                                                                        className={styles.listitemgroupfile}
                                                                                        key={indice}
                                                                                        style={{ color: "black", lineHeight: "normal", backgroundColor: "white", borderColor: "#ececec" }}
                                                                                >
                                                                                        <div className={styles.item} style={{ display: "flex", fontSize: "0.9em", justifyContent: "start", alignItems: "center" }}>
                                                                                                {/* <strong>Dialect: </strong> {item.dialect} -  */}<strong>Name: </strong>{item.database}
                                                                                        </div>
                                                                                        <button
                                                                                                type="button text-dark"
                                                                                                className={`${styles.button_danger} btn4`}
                                                                                                style={{ borderRadius: "5px" }}
                                                                                                onClick={(e) => {
                                                                                                        unlinkDB(item.id)
                                                                                                }}
                                                                                        >
                                                                                                Delete Database
                                                                                        </button>
                                                                                        {item.id == selectedDB ? <button
                                                                                                type="button text-dark"
                                                                                                className={`${styles.button_success} btn5`}
                                                                                                style={{ borderRadius: "5px" }}
                                                                                                onClick={(e) => {
                                                                                                        setSelectedDB(null)
                                                                                                }}
                                                                                        >
                                                                                                Selected Database
                                                                                        </button> : <button
                                                                                                type="button text-dark"
                                                                                                className={`${styles.button_danger} btn5`}
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
                                                <div align="center" className='card p-2' style={{ width: "100%" }}>
                                                        <h4>Tables</h4>
                                                        <div className="list-group" style={{ overflowY: "scroll", width: "100%", minHeight: "90%", maxHeight: "350px" }}>
                                                                {store.dbList.length > 0 ? store.dbList.map((item, indice) => {
                                                                        if (item.id == selectedDB) {
                                                                                return <li
                                                                                        className="list-group"
                                                                                        key={`query-table-${indice}`}
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
                                        <div className='col'>
                                                <div className='row d-flex justify-content-center'>
                                                        <div className={styles.output} style={{ maxHeight: windows2Parameters.height, border: "1px solid black", margin: "10px", width: "98%" }}>
                                                                <button className={styles.button_success} style={{ width: "20px", position: 'relative', top: '5px', left: '96%' }} onClick={() => { changeWindows2() }}>⏹</button>
                                                                {outputValue2 != null ?
                                                                        <RenderText texto={outputValue2} setOutputValue2={setOutputValue2} outputValue2={outputValue2} loading={loading} setLoading={setLoading} inputValue3={inputValue3} selectedDB={selectedDB} />
                                                                        : <></>
                                                                }
                                                        </div>
                                                </div>
                                                <div className='row d-flex justify-content-center'>
                                                        <div className='col-sm-12 col-md-8 '>
                                                                <div className="text-input">
                                                                        <textarea type="col-12 text-input"
                                                                                value={inputValue2}
                                                                                onChange={handleInputChange2}
                                                                                style={{ color: "black", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", maxHeight: "200px", borderRadius: "5px" }}
                                                                                placeholder='Write in natural language your query to the selected database'
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
                                                        <div className='col-sm-2 col-md-8'>
                                                                <div className='col d-flex'>
                                                                        <button className={styles.button_danger} onClick={() => setSelectedDB(null)}>Un-Select All</button>
                                                                </div>
                                                        </div>
                                                        <div className='col-sm-5 col-md-4'></div>
                                                </div>
                                        </div>
                                </div>


                        </div>
                        <Modal open={modalLinkSQL} onClose={openCloseModalLinkSQL}>
                                {bodyModaAddSQL}
                        </Modal>
                </div>

        )
}

export default GroupDB;