import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from "./index.module.css";
import Swal from 'sweetalert2';
import { Context } from '../../store/appContext';
import { Modal, TextField, Button } from "@material-ui/core";

const GroupFiles = () => {
    const { store, actions } = useContext(Context)
    const [listFiles, setListFiles] = useState([]);
    const [loading, setLoading] = useState(false)
    const [uniqDoc, setUniqDoc] = useState([]);
    const [file, setFile] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [reload, setReload] = useState(false)
    const [deletePage, setDeletePage] = useState(false)
    const [indexList, setIndexList] = useState(null)
    const [indexID, setIndexID] = useState(null)
    const [modal1, setModal1] = useState(false)
    const [modalLink, setModalLink] = useState(false)
    const [modalLinkSQL, setModalLinkSQL] = useState(false)
    const [inputText, setInputText] = useState("")
    const [useFileList, setUserFileList] = useState([])
    const [groupLinkedFiles, setGroupLinkedFiles] = useState([])
    const [groupLinkedDB, setGroupLinkedDB] = useState([])
    const [groupContextFilter, setGroupContextFilter] = useState([])

    const BASE_URL = process.env.BASE_URL2;
    const HOST = process.env.BASE_URL_PUBLIC
    const IA_URL = process.env.IA_URL;
    const URL_LIST = "/list-groups/user";
    const URL_DELETE_PAGE = "/v1/ingest/";
    const URL_run_predict = '/run/predict'
    const URL_UPLOAD_FILE = '/v1/ingest/file';
    const URL_EDIT_MEMBER = '/list-groups/edit-user';
    const URL_EDIT_GROUP = '/list-groups/edit-group';
    const URL_USER_FILES = '/list-files-embeddings/user';
    const URL_USER_FILES_LINK = '/list-files-embeddings/user/group/edit';
    const URL_GROUP_INFO = '/groups/' //this works adding groups id: /groups/<id>
    const URL_ADD_DB = '/relational/sql';
    const URL_LIST_DB = '/list-db/user';
    const URL_DELETE_DB = "/list-db/user";
    let uniqueMyFiles = new Set();
    let uniqueGroupsFiles = new Set();

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
        if (data.data.length == 0) {
            return [{ doc_metadata: { file_name: "No documents found" }, doc_id: 0 }]
        }
        // Filtrar y mapear los elementos con claves "file_name" únicas
        let uniqueFileNamesData = await data.filter(item => {
            let loop_arr = item.list_files.map(loop2 => {
                let fileName = loop2.name_file
                // Verificar si la clave "file_name" ya está presente en el mapa
                if (!uniqueFileNamesMap.has(fileName)) {
                    // Si no está presente, agregar la clave al mapa y devolver true para incluir el elemento
                    uniqueFileNamesMap.set(fileName, true);
                    return true;
                }
                // Si la clave ya está presente, devolver false para excluir el elemento
                return false;
            });


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
        if (selectedFile) {
            setLoading(true)
            let formData = new FormData(e.target);
            let dependent = formData.get("name")

            //let folds = formData.get("folds")

            let tempObj = {
                name: "File",
                //folds: folds
            }
            let jsontempObj = JSON.stringify(tempObj);

            formData.append('file', selectedFile); //added file
            //formData.append('data', jsontempObj) //tempObj data as json
            const BASE_URL2 = process.env.BASE_URL2;
            let response = await fetch(BASE_URL2 + URL_UPLOAD_FILE, {
                method: 'POST',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    //"Content-Type": "multipart/form-data"
                }
            })
            if (!response.ok) {
                setLoading(false)
                response = await response.json()
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: response.message,
                    showConfirmButton: false,
                    timer: 1500
                })
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setLoading(false)
            const message = data.message;

            // Log the message
            console.log(message);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: "uploaded",
                showConfirmButton: false,
                timer: 1500
            })
            setReload(!reload)
        } else {
            alert('Please select a File');
            setLoading(false)
        }
    };

    const deleteMember = async (email, id) => {
        const tempObj = {
            "username": email,
            "group_id": id
        }
        setLoading(true)
        let response = await actions.useFetch(URL_EDIT_MEMBER, tempObj, "DELETE")
        if (!response.ok) {
            response = await response.json()
            setLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.msg,
                showConfirmButton: false,
                timer: 1500
            })
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setLoading(false)
        const message = data.msg;

        // Log the message
        console.log(message);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Ok",
            text: message,
            showConfirmButton: false,
            timer: 1500
        })
        setReload(!reload)
    }

    const openCloseModal = () => {
        setModal1(!modal1);
    };

    const openCloseModalLink = () => {
        setModalLink(!modalLink);
        uniqueMyFiles = new Set();
        uniqueGroupsFiles = new Set();
    };

    const openCloseModalLinkSQL = () => {
        setModalLinkSQL(!modalLinkSQL);
    };

    const addMember = async (email, id) => {
        const tempObj = {
            "username": email,
            "group_id": id
        }
        setLoading(true)
        let response = await actions.useFetch(URL_EDIT_MEMBER, tempObj, "POST")
        if (!response.ok) {
            response = await response.json()
            setLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.msg,
                showConfirmButton: false,
                timer: 1500
            })
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setLoading(false)
        const message = data.msg;

        // Log the message
        console.log(message);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Ok",
            text: message,
            showConfirmButton: false,
            timer: 1500
        })
        setReload(!reload)
    }

    const newGroup = async (name) => {
        const tempObj = {
            "name": name
        }
        if (name == null || name == "") {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Invalid Name",
                text: "Please, write a valid name for the group",
                showConfirmButton: false,
                timer: 1500
            })
            return
        }
        setLoading(true)
        let response = await actions.useFetch(URL_EDIT_GROUP, tempObj, "POST")
        if (!response.ok) {
            response = await response.json()
            setLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: response.msg,
                showConfirmButton: false,
                timer: 1500
            })
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setLoading(false)
        const message = data.msg;

        // Log the message
        console.log(message);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Ok",
            text: message,
            showConfirmButton: false,
            timer: 1500
        })
        setReload(!reload)
    }

    const deleteGroup = async (id) => {
        const tempObj = {
            "group_id": id
        }
        Swal.fire({
            title: 'Are you sure do you want to delete this group? this action cannot be undoned.',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true)
                let response = await actions.useFetch(URL_EDIT_GROUP, tempObj, "DELETE")
                if (!response.ok) {
                    response = await response.json()
                    setLoading(false)
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: response.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setLoading(false)
                const message = data.msg;

                // Log the message
                console.log(message);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: "Ok",
                    text: message,
                    showConfirmButton: false,
                    timer: 1500
                })
                setIndexList(null)
                setReload(!reload)
            } else if (result.isDenied) {
                Swal.fire('Group will be not deleted', '', 'info')
            }
        })

    }

    const getGroupLinkedFiles = async () => {
        setLoading(true)
        let tempURL = IA_URL + URL_GROUP_INFO + indexID
        let tempURL2 = IA_URL + URL_LIST_DB
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
            let dataSQL = await fetch(tempURL2, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ group_id: indexID })
            })

            if (data.ok) {
                data = await data.json()
                //setLoading(false)
                //console.log(data)
                setGroupLinkedFiles(data.list_files)
            }
            if (dataSQL.ok) {
                dataSQL = await dataSQL.json()
                //setLoading(false)
                //console.log(data)
                setGroupLinkedDB(dataSQL)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("error fetch: ", error);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Ok",
                text: "error fetching data",
                showConfirmButton: false,
                timer: 1500
            })
        }

    }

    const linkFiles = async (name, id) => {
        setLoading(true)
        const tempObj = {
            "group_id": id,
            "file_name": name
        }
        let tempURL = URL_USER_FILES_LINK
        console.log("tempURL: ", tempURL)
        let data = await actions.useFetch(tempURL, tempObj, "POST")
        try {
            //console.log("data in promise: ", data)
            //data = await data.json()
            if (data.ok) {
                data = await data.json()
                setLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: "Ok",
                    text: data.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
                setGroupLinkedFiles(data.group.list_files)
            } else {
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
            }
        } catch (error) {
            //data = await data.json()
            setLoading(false)
            console.log("error fetch: ", error);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Ok",
                text: data.msg,
                showConfirmButton: false,
                timer: 1500
            })
        }

    }

    const unlinkFiles = async (name, id) => {
        setLoading(true)
        const tempObj = {
            "group_id": id,
            "file_name": name
        }
        let tempURL = URL_USER_FILES_LINK
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
                    text: data.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
                setGroupLinkedFiles(data.group.list_files)
                return
            }
            data = await data.json()
            setLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: "Error",
                text: "Some minor error",
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

    const unlinkDB = async (dbId, id) => {
        setLoading(true)
        const tempObj = {
            "group_id": id,
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
                    text: data.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
                setGroupLinkedDB(data)
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

    const addNewDB = async (e, id_group) => {
        e.preventDefault()
        let data = new FormData(e.target)
        let database = data.get("database")
        let driver = data.get("driver")
        let dialect = data.get("dialect")
        let user = data.get("user")
        let password = data.get("password")
        let host = data.get("host")
        let port = data.get("port")

        if(port==null || typeof(port)==="string"){
            port = 0
        }

        let tempobj = {
            group_id: id_group,
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

    //En bodyModal modal cambiar el nombre a mostrar
    const bodyModal = (
        <div className={styles.modal} id="modal">
            <h3>Members registered</h3>
            <div className='row d-flex justify-content-center'>
                <div className='col-7 d-flex justify-content-center align-items-center mx-1 my-2'>
                    <input className='input--style-4 bg-white' placeholder='Write username or email to add' onChange={(e) => { setInputText(e.target.value) }}></input>
                </div>
                <div className='col d-flex justify-content-center align-items-center mx-1 my-2'>
                    <button className={styles.button_approve}
                        onClick={() => addMember(inputText, listFiles[indexList].id)}>
                        Add Member
                    </button>
                </div>

            </div>
            <br />
            <div align="right" className='card p-2' style={{ overflowY: "scroll", width: "100%" }}>
                <ul>
                    {listFiles.length > 0 && indexList != null ? listFiles[indexList].list_users.map((item, indice) => {
                        return (
                            <li
                                className={styles.listitemgroupfile}
                                key={indice}
                            >
                                <div className={styles.item}>
                                    {item.name} - {item.email}
                                </div>

                                <button
                                    type="button text-dark"
                                    className={styles.button_danger}
                                    style={{ borderRadius: "5px" }}
                                    onClick={(e) => {
                                        deleteMember(item.email, listFiles[indexList].id);
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        )
                    }) : <></>}
                </ul>
            </div>
            <br />
            <button className={styles.button_danger} onClick={() => openCloseModal()}>Close</button>
        </div>
    );

    //bodyModalLink to show popup of files linked to a group

    const bodyModalLink = (
        <div className={styles.modal} id="modal">
            <h3>Group: {listFiles.length > 0 && indexList != null ? listFiles[indexList].name : ""}</h3>

            <br />
            <button
                type="button text-dark"
                className={styles.button_approve}
                style={{ borderRadius: "5px" }}
                onClick={(e) => {
                    //id of group listFiles[indexList].id
                    console.log("id of group: ", listFiles[indexList].id);
                    openCloseModalLinkSQL()
                }}
            >
                Add SQL Database
            </button>
            <br />
            <div className='row d-flex' style={{ overflowY: "hidden", maxHeight: "300px" }}>
                <div className='col-6 d-flex'>
                    <div align="center" className='card p-2' style={{ width: "100%", maxHeight: "300px" }}>
                        <h4>My Files</h4>
                        <ul style={{ overflowY: "scroll", width: "100%", minHeight: "90%" }}>
                            {useFileList.length > 0 && indexList != null ? useFileList.map((item, indice) => {
                                // Verificar si el 'name_file' ya está en el conjunto
                                if (!uniqueMyFiles.has(item.name_file)) {
                                    // Agregar el 'name_file' al conjunto para evitar duplicados
                                    uniqueMyFiles.add(item.name_file);

                                    // Renderizar el elemento solo si es único
                                    return (
                                        <li
                                            className={styles.listitemgroupfile}
                                            key={indice}
                                        >
                                            <div className={styles.item}>
                                                {item.name_file}
                                            </div>

                                            <button
                                                type="button text-dark"
                                                className={styles.button_approve}
                                                style={{ borderRadius: "5px" }}
                                                onClick={(e) => {
                                                    linkFiles(item.name_file, listFiles[indexList].id);
                                                }}
                                            >
                                                Link File
                                            </button>
                                        </li>
                                    );
                                } else {
                                    return null; // No renderizar elementos duplicados
                                }
                            }) : <></>}
                        </ul>
                    </div>
                </div>
                <div className='col-6 d-flex'>
                    <div align="center" className='card p-2' style={{ width: "100%", maxHeight: "300px" }}>
                        <h4>Group Files</h4>
                        {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                            <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>}
                        <ul style={{ overflowY: "scroll", width: "100%", minHeight: "90%" }}>
                            {groupLinkedFiles.length > 0 && indexList != null ? groupLinkedFiles.map((item, indice) => {
                                // Verificar si el 'name_file' ya está en el conjunto
                                if (!uniqueGroupsFiles.has(item.name_file)) {
                                    // Agregar el 'name_file' al conjunto para evitar duplicados
                                    uniqueGroupsFiles.add(item.name_file);

                                    // Renderizar el elemento solo si es único
                                    return (
                                        <li
                                            className={styles.listitemgroupfile}
                                            key={indice}
                                        >
                                            <div className={styles.item}>
                                                {item.name_file}
                                            </div>

                                            <button
                                                type="button text-dark"
                                                className={styles.button_danger}
                                                style={{ borderRadius: "5px" }}
                                                onClick={(e) => {
                                                    unlinkFiles(item.name_file, listFiles[indexList].id);
                                                }}
                                            >
                                                Un-link File
                                            </button>
                                        </li>
                                    );
                                } else {
                                    return null; // No renderizar elementos duplicados
                                }
                            }) : <></>}
                        </ul>
                    </div>
                </div>

            </div>
            <br />
            <div className='col-12 d-flex'>
                <div align="center" className='card p-2' style={{ width: "100%", maxHeight: "200px" }}>
                    <h4>Databases</h4>
                    {loading && <div className="d-flex justify-content-center align-items-center" id="loading2">
                        <div className="spinner-border text-warning" role="status" aria-hidden="true">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                    <div className="list-group" style={{ overflowY: "scroll", width: "100%", minHeight: "90%" }}>
                        {groupLinkedDB.length > 0 && indexList != null ? groupLinkedDB.map((item, indice) => {
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
                                    <button
                                        type="button text-dark"
                                        className={styles.button_danger}
                                        style={{ borderRadius: "5px" }}
                                        onClick={(e) => {
                                            unlinkDB(item.id, listFiles[indexList].id);
                                        }}
                                    >
                                        Delete database
                                    </button>
                                </li>)
                        }) : <>No database has been added</>}
                    </div>
                </div>
            </div>
            <br />
            <div className='row d-flex justify-content-end'>
                <div className='col-sm-2 col-md-8'></div>
                <div className='col-sm-5 col-md-2'><button className={styles.button_danger} onClick={() => openCloseModalLink()}>Close</button></div>
                <div className='col-sm-5 col-md-2'><button className={styles.button_approve} onClick={() => reloadList()}>Reload List</button></div>
            </div>


        </div>
    );

    const bodyModaAddSQL = (
        <div className={styles.modal} id="modal"><h3>Add Database to the Group: {listFiles.length > 0 && indexList != null ? listFiles[indexList].name : ""}</h3>

            <br />
            <button
                type="button text-dark"
                className={styles.button_danger}
                style={{ borderRadius: "5px" }}
                onClick={(e) => {
                    //id of group listFiles[indexList].id
                    console.log("id of group: ", listFiles[indexList].id);
                    openCloseModalLinkSQL()
                }}
            >
                Close
            </button>
            <br />
            <form className="row g-3" style={{ padding: "20px" }} onSubmit={(e) => { addNewDB(e, listFiles[indexList].id) }}>
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
                    <input type="number" className="form-control" id="inputAddress3" placeholder="port, ex: 3346" name="port"/>
                </div>
                <div className="col-12">
                    <button type="submit" className={styles.button_approve}>Register Database</button>
                </div>
            </form>

        </div>
    )

    const reloadList = async () => {
        setLoading(true)
        let tempURL = IA_URL + URL_USER_FILES
        let tempURL2 = IA_URL + URL_LIST_DB
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
            let dataSQL = await fetch(tempURL2, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ group_id: indexID })
            })

            if (data.ok) {
                data = await data.json()
                setLoading(false)
                //console.log(data)
                setUserFileList(data)
            } else if (data.status == 401) {
                setLoading(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "Error",
                    text: "Session has ended, please login again",
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            if (dataSQL.ok) {
                dataSQL = await dataSQL.json()
                //setLoading(false)
                //console.log(data)
                setGroupLinkedDB(dataSQL)
            }
        } catch (error) {
            setLoading(false)
            console.log("error fetch: ", error);
        }
    }

    const addContextGroup = (id) => {
        let tempList = groupContextFilter.slice()
        tempList.push(id)
        setGroupContextFilter(tempList)
        actions.changeGroupFilter(tempList)
        return
    }

    const deleteContextGroup = (id) => {
        let tempList = groupContextFilter.splice()
        let tempList2 = tempList.filter((item, index) => {
            return item != id
        })
        setGroupContextFilter(tempList2)
        actions.changeGroupFilter(tempList2)
    }

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true)
            let tempURL = IA_URL + URL_LIST
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
                    setListFiles(data)
                    let tempUnique = await uniqueDocuments(data)
                    //console.log(tempUnique)
                    setUniqDoc(tempUnique)

                }
            } catch (error) {
                setLoading(false)
                console.log("error fetch: ", error);
            }

        }

        const fetchUserList = async () => {
            setLoading(true)
            let tempURL = IA_URL + URL_USER_FILES
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
                    setUserFileList(data)
                }
            } catch (error) {
                setLoading(false)
                console.log("error fetch: ", error);
            }

        }
        fetchList()
        fetchUserList()
    }, [reload])

    useEffect(() => {
        if (indexID != null) {
            getGroupLinkedFiles()
        }
    }, [indexID])

    return (
        <div id="ingestedList" className={styles.groupList}>
            <div className='col d-flex py-2 mx-2 px-1 align-items-center' style={{ width: "100%" }}>
                <h2 className='text-dark'>My Groups</h2>
                <div className='col-6 d-flex justify-content-center align-items-center mx-1 my-2'>
                    <input className='input--style-4 bg-white' placeholder='Write name of the new group' onChange={(e) => { setInputText(e.target.value) }} style={{ color: "#c30303", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", borderRadius: "5px", fontSize: "0.85em", minHeight: "5px", backgroundColor: "white", lineBreak: "anywhere" }}></input>
                </div>
                <div className='col d-flex justify-content-center align-items-center mx-1 my-2'>
                    <button className={styles.button_approve}
                        onClick={() => newGroup(inputText)}>
                        New Group
                    </button>
                </div>
            </div>

            {/* <div className='row d-flex py-2'>
                <div className='col d-flex justify-content-start align-items-center'>
                    <button
                        className="btn btn-small btn-outline-warning text-dark my-2"
                        type='button'
                        onClick={() => { setDeletePage(!deletePage) }}>
                        Change List View Mode
                    </button>
                </div>
                <div className='col d-flex justify-content-start align-items-center'>
                    <form className="col-sm-12 d-flex align-items-center justitfy-content-center" onSubmit={(e) => handleSubmitFiles(e)} enctype="multipart/form-data">
                        
                        <input className="upload-file" type="file" title="upload file" name="file" onChange={handleFileFormat} />
                        <button className="btn btn-outline-success text-dark" type='submit'>
                            <>Upload

                            </>
                        </button>
                    </form>
                </div>
            </div> */}

            {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
            <div className='card' style={{ overflowY: "scroll", width: "100%" }}>
                <ul>
                    {listFiles.map((item, indice) => {
                        return (
                            <li
                                className={styles.listitemgroup}
                                key={item.id}
                            >
                                <div className={styles.item}>
                                    Group: {item.name}
                                    {!groupContextFilter.includes(item.id) ?
                                        <button className={styles.button_approve} onClick={(e) => { addContextGroup(item.id) }}>Use for Filter</button> : <button className={styles.button_danger} onClick={(e) => { deleteContextGroup(item.id) }}>Deselect</button>
                                    }
                                </div>

                                <button
                                    type="button"
                                    className={styles.btn3}
                                    style={{ borderRadius: "5px" }}
                                    onClick={(e) => {
                                        setIndexList(indice)
                                        openCloseModal();
                                    }}
                                >
                                    Edit Members
                                </button>
                                <button
                                    type="button"
                                    className={styles.btn4}
                                    style={{ borderRadius: "5px" }}
                                    onClick={(e) => {
                                        setIndexList(indice)
                                        setIndexID(item.id)
                                        openCloseModalLink();
                                    }}
                                >
                                    Link File
                                </button>
                                <button
                                    type="button"
                                    className={styles.btn5}
                                    style={{ borderRadius: "5px" }}
                                    onClick={(e) => {
                                        deleteGroup(item.id);
                                    }}
                                >
                                    Delete Group
                                </button>
                            </li>
                        );
                    })}
                </ul>

            </div>
            <Modal open={modal1} onClose={openCloseModal}>
                {bodyModal}
            </Modal>
            <Modal open={modalLink} onClose={openCloseModalLink}>
                {bodyModalLink}
            </Modal>
            <Modal open={modalLinkSQL} onClose={openCloseModalLinkSQL}>
                {bodyModaAddSQL}
            </Modal>
        </div>
    )
}

export default GroupFiles;