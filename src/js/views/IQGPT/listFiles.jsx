import React, { useState, useRef, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';
import styles from "./index.module.css";
import Swal from 'sweetalert2';

const ListFiles = () => {
    const { store, actions } = useContext(Context)
    const [listFiles, setListFiles] = useState([]);
    const [loading, setLoading] = useState(false)
    const [uniqDoc, setUniqDoc] = useState([]);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [file, setFile] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [reload, setReload] = useState(false)
    const [deletePage, setDeletePage] = useState(false)
    const BASE_URL = process.env.BASE_URL2;
    const HOST = process.env.BASE_URL_PUBLIC
    const IA_URL = process.env.IA_URL;
    const URL_LIST = "/v1/ingest/list";
    const URL_LIST_USER = "/list-files-embeddings/user";
    const URL_DELETE_PAGE = "/v1/ingest/";
    const URL_run_predict = '/run/predict'
    const URL_UPLOAD_FILE = '/v1/ingest/file'
    const URL_YOUTUBE = '/v1/ingest/youtube-transcript';

    const getFileExtension = (fileName) => {
        return '.' + fileName.split('.').pop();
    };

    const handleFileFormat = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedExtensions = ['.csv', '.txt', '.doc', '.docx', '.pdf'];
            const fileExtension = getFileExtension(file.name);

            if (allowedExtensions.includes(fileExtension)) {
                setSelectedFile(file);
            } else {
                setSelectedFile(null);
                alert('Please select a valid format: [csv, pdf, txt, doc, docx]');
            }
        } else {
            setSelectedFile(null);
            alert('Please select a file.');
        }
    };


    const deleteIngested = async (indexFile, doc_id) => {
        setLoading(true)
        let tempURL = IA_URL + URL_DELETE_PAGE + doc_id
        try {
            let data = await fetch(tempURL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                }
            })
            //console.log("data in promise: ", data)

            if (data.ok) {
                data = await data.json()
                setLoading(false)
                Swal.fire({
                    icon: 'success',
                    title: `Message`,
                    showConfirmButton: false,
                    timer: 2000,
                    text: data.msg
                })
                setReload(!reload)
            } else {
                data = await data.json()
                setLoading(false)
                Swal.fire({
                    icon: 'error',
                    title: `Error`,
                    showConfirmButton: true,
                    text: data.msg
                })
            }
        } catch (error) {
            setLoading(false)
            Swal.fire({
                icon: 'error',
                title: `Error`,
                showConfirmButton: false,
                timer: 2000
            })
            console.log("error fetch: ", error);
        }

        /* setListFiles((prevState) => {
            return prevState.filter((item, index) => {
                return index !== indexFile;
            });
        }); */
        /* setReload(!reload) */

    };

    const uniqueDocuments = async (data) => {
        let uniqueFileNamesMap = new Map();
        if (data.length == 0) {
            return [{ doc_metadata: { file_name: "No documents found" }, doc_id: 0 }]
        }
        // Filtrar y mapear los elementos con claves "file_name" únicas
        let uniqueFileNamesData = await data.filter(item => {
            let fileName = item.name_file;

            // Verificar si la clave "file_name" ya está presente en el mapa
            if (!uniqueFileNamesMap.has(fileName)) {
                // Si no está presente, agregar la clave al mapa y devolver true para incluir el elemento
                uniqueFileNamesMap.set(fileName, true);
                return true;
            }

            // Si la clave ya está presente, devolver false para excluir el elemento
            return false;
        });

        // Hacer un mapeo de los elementos con claves "file_name" únicas
        /* let mappedData = uniqueFileNamesData.map(item => {
            // Aquí puedes realizar cualquier operación de mapeo específica que necesites
            return {
                doc_id: item.doc_id,
                file_name: item.doc_metadata.file_name
            };
        }); */
        return uniqueFileNamesData;
    }

    const handleSubmitFiles = async (e) => {
        e.preventDefault();
        const filesInput = e.target.querySelector('input[name="file"]');
        const files = filesInput.files;

        if (files.length === 0) {
            alert('Please select at least one file');
            return;
        }

        setLoading(true);

        let formData = new FormData();
        if (store["group_context_filter"].length > 0) {
            formData.append('group_context_filter', JSON.stringify(store["group_context_filter"]))
        }

        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }

        const BASE_URL2 = process.env.BASE_URL2;

        try {
            let response = await fetch(BASE_URL2 + URL_UPLOAD_FILE, {
                method: 'POST',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });

            if (!response.ok) {
                setLoading(false);
                const responseData = await response.json();
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: responseData.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setLoading(false);
            const message = data.message;

            // Log the message
            console.log(message);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "uploaded",
                showConfirmButton: false,
                timer: 1500
            });

            setReload(!reload);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };


    const getTranscription = async (e) => {
        e.preventDefault();
        const youtubeURL = youtubeLink;

        if (youtubeURL === "" || youtubeURL.includes("youtube") == false) {
            alert('Use a valid youtube link');
            return;
        }

        setLoading(true);

        let objTemp = {
            url: youtubeURL
        }

        console.log(objTemp)

        const BASE_URL2 = process.env.BASE_URL2;

        try {
            let response = await fetch(BASE_URL2 + URL_YOUTUBE, {
                method: 'POST',
                body: JSON.stringify(objTemp),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                setLoading(false);
                const responseData = await response.json();
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: responseData.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setLoading(false);
            const message = data.message;

            // Log the message
            console.log(message);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "uploaded",
                showConfirmButton: false,
                timer: 1500
            });

            setReload(!reload);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true)
            let tempURL = IA_URL + URL_LIST_USER
            console.log("tempURL: ", tempURL)
            try {
                let data = await fetch(tempURL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Accept": "application/json"
                    }
                })
                //console.log("data in promise: ", data)

                if (data.ok) {
                    data = await data.json()
                    setLoading(false)
                    //console.log(data)
                    setListFiles(data) //Changed data.data per data
                    let tempUnique = await uniqueDocuments(data)
                    //console.log(tempUnique)
                    setUniqDoc(tempUnique)

                }
            } catch (error) {
                setLoading(false)
                console.log("error fetch: ", error);
            }

        }
        fetchList()
    }, [reload])

    return (
        <div id="ingestedList" className={styles.ingestedList}>
            <div className='col d-flex py-2 mx-2 px-1 align-items-center' style={{ width: "100%" }}>
                <h2 className='text-dark'>My Ingested Documents</h2>
                <div className='col-sm-12 col-lg-5 d-flex justify-content-end align-items-center px-2 mx-1'>
                    <button
                        className={styles.button_approve}
                        type='button'
                        style={{ width: "100%", fontSize: "0.9em", padding:"8px 0px 8px 0px !important" }}
                        onClick={() => { setDeletePage(!deletePage) }}>
                        Change List View Mode
                    </button>
                </div>
            </div>


            <form className="row d-flex py-2 mx-2 px-1 align-items-center" onSubmit={(e) => handleSubmitFiles(e)} enctype="multipart/form-data" style={{ width: "100%" }}>
                {/* <span className="text-dark" style={{ marginLeft: "10px" }}>Upload .csv</span> */}
                <div className='col-sm-12 col-lg-6 d-flex justify-content-start align-items-center'>
                    <input className="upload-file py-1 my-1" type="file" title="upload file" name="file" onChange={handleFileFormat} multiple id="upload-files" />
                </div>
                <div className='col-sm-12 col-lg-6 d-flex justify-content-start align-items-center'>
                    <button className={styles.button_success}/*  onClick={handleSubmitCSV} */ type='submit'>
                        <>
                            Upload File(s)
                        </>
                    </button>
                </div>
            </form>

            <div className='row d-flex py-2 mx-2 px-1 align-items-center' style={{ width: "100%" }}>
                <div className='col-sm-12 col-lg-6 d-flex justify-content-start align-items-center'>
                    <textarea type="col-12 text-input" className='col' style={{ color: "#c30303", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", borderRadius: "5px", fontSize: "0.85em", minHeight: "5px", backgroundColor: "white", lineBreak: "anywhere" }} placeholder='ex: https://www.youtube.com/watch?v=idwKHQEw78g' onChange={e => { setYoutubeLink(e.target.value) }} />
                </div>
                <div className='col-sm-12 col-lg-6 d-flex justify-content-start align-items-center'>
                    <button className={styles.button_success} type='button' onClick={getTranscription}>Ingest Youtube Video</button>
                </div>
            </div>
            {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
            <div className='card' style={{ overflowY: "scroll", width: "100%" }}>
                {deletePage ?
                    <ul>
                        {listFiles.map((item, indice) => {
                            return (
                                <li
                                    className={styles.listitem}
                                    key={indice}
                                >
                                    <div className={styles.item}>
                                        {item.name_file} - {`Page ${item.page}`}
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.btn2}
                                        style={{ borderRadius: "5px" }}
                                        onClick={(e) => {
                                            deleteIngested(indice, item.doc_id);
                                        }}
                                    >
                                        Delete Page
                                    </button>
                                </li>
                            );
                        })}
                    </ul> :
                    <ul>
                        {uniqDoc.map((item, indice) => {
                            return (
                                <li
                                    className={styles.listitem}
                                    key={indice}
                                >
                                    <div className={styles.item}>
                                        {item.name_file}
                                    </div>
                                    {/* <button
                                        type="button"
                                        className={styles.btn2}
                                        style={{ borderRadius: "5px" }}
                                    
                                    >
                                        Delete Document (development)
                                    </button> */}
                                </li>
                            );
                        })}
                    </ul>}

            </div>
        </div>
    )
}

export default ListFiles;