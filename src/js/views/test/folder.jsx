import React, { useEffect, useContext, useState, useRef } from "react";
import { Context } from "../../store/appContext";
import 'tailwindcss/tailwind.css';
import styles from "./clean.module.css";
import { Menu, MenuItem, MenuButton, SubMenu, FocusableItem, useMenuState, ControlledMenu, useClick } from '@szhsin/react-menu';
import { Modal } from "@material-ui/core";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import Swal from "sweetalert2";



const Folder = (props) => {
    const { store, actions } = useContext(Context)
    const boundingBoxRef = useRef(null);
    const leftAnchor = useRef(null);
    const rightAnchor = useRef(null);
    const [{ state }, toggleMenu] = useMenuState();
    const [listFiles, setListFiles] = useState([]);
    const [listFilesDB, setListFilesDB] = useState([]);
    const [loading, setLoading] = useState(false)
    const [uniqDoc, setUniqDoc] = useState([]);
    const [file, setFile] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [reload, setReload] = useState(false)
    const [reloadDB, setReloadDB] = useState(false)
    const [deletePage, setDeletePage] = useState(false)
    const [indexList, setIndexList] = useState(null)
    const [indexListDB, setIndexListDB] = useState(null)
    const [indexID, setIndexID] = useState(null)
    const [modal1, setModal1] = useState(false)
    const [modalLink, setModalLink] = useState(false)
    const [modalLinkSQL, setModalLinkSQL] = useState(false)
    const [inputText, setInputText] = useState("")
    const [useFileList, setUserFileList] = useState([])
    const [groupLinkedFiles, setGroupLinkedFiles] = useState([])
    const [groupLinkedDB, setGroupLinkedDB] = useState([])
    const [groupContextFilter, setGroupContextFilter] = useState([])
    const [groupContextFilterDB, setGroupContextFilterDB] = useState([])
    const [isOpen, setOpen] = useState(false);
    const anchorProps = useClick(isOpen, setOpen);

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
    //const URL_ADD_DB = '/relational/sql';
    //const URL_LIST_DB = '/list-db/user';
    //const URL_DELETE_DB = "/list-db/user";
    const URL_LIST_DB = '/list-db-dashboard/user';
    const URL_COMPLETIONS_SQL = IA_URL + '/completions/sql';
    const URL_QUERY_SQL = IA_URL + '/completions/sql-query';
    const URL_ADD_DB = '/relational-dashboard/sql';
    const URL_DELETE_DB = "/list-db-dashboard/user";
    let uniqueMyFiles = new Set();
    let uniqueGroupsFiles = new Set();

    const tooltipProps = {
        state,
        captureFocus: false,
        arrow: true,
        /* role: 'tooltip', */
        align: 'center',
        viewScroll: 'initial',
        direction: 'left',
        position: 'auto',
        boundingBoxPadding: '1 8 1 1',
        portal: true
    };

    const getFileExtension = (fileName) => {
        return '.' + fileName.split('.').pop();
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
            title: 'Are you sure do you want to delete this folder? this action cannot be undoned.',
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
            /* let dataSQL = await fetch(tempURL2, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ group_id: indexID })
            }) */

            if (data.ok) {
                data = await data.json()
                //setLoading(false)
                //console.log(data)
                setGroupLinkedFiles(data.list_files)
            }
            /* if (dataSQL.ok) {
                dataSQL = await dataSQL.json()
                //setLoading(false)
                //console.log(data)
                setGroupLinkedDB(dataSQL)
            } */
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
                setReloadDB(!reloadDB)
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
        //setLoading(true)
        const tempObj = {
            "database_id": dbId
        }
        let tempURL = URL_DELETE_DB
        console.log("tempURL: ", tempURL)
        Swal.fire({
            title: 'Are you sure do you want to delete this database? this action cannot be undoned.',
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
                let response = await actions.useFetch(tempURL, tempObj, "DELETE")
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

                if (response.ok) {
                    let data = await response.json()
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
                    return
                }                
            } else if (result.isDenied) {
                Swal.fire('Database will be not deleted', '', 'info')
            }
        })       
    }

    //En bodyModal modal cambiar el nombre a mostrar
    const bodyModal = (
        <div className={styles.modal} id="modal">
            <h3>Members registered</h3>
            <div className='row d-flex justify-content-center'>
                <div className={`col-7 d-flex justify-content-center align-items-center mx-2 my-1 ${styles.nav_button} ${styles.search_button}`}>
                    <input className={`${styles.nav_text}`} placeholder='Write username or email to add' onChange={(e) => { setInputText(e.target.value) }}></input>
                </div>
                <div className='col d-flex justify-content-center align-items-center mx-1 my-2'>
                    <button className={`${styles.nav_button} ${styles.import_button}`}
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
                                className={styles.nav_item}
                                style={{ display: "flex", justifyContent: "space-between", margin: "5px 0px 5px 0px", alignItems: "center" }}
                                key={indice}
                            >
                                <div className={styles.item}>
                                    {item.name} - {item.email}
                                </div>

                                <button
                                    type="button text-dark"
                                    className={`${styles.nav_button} ${styles.import_button}`}
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
            <button className={`${styles.nav_button} ${styles.import_button}`} onClick={() => openCloseModal()}>Close</button>
        </div>
    );

    //bodyModalLink to show popup of files linked to a group

    const bodyModalLink = (
        <div className={styles.modal} id="modal">
            <h3>Folder: {listFiles.length > 0 && indexList != null ? listFiles[indexList].name : ""}</h3>

            <br />
            {/* <button
                type="button text-dark"
                className={`${styles.nav_button} ${styles.import_button}`}
                style={{ borderRadius: "5px" }}
                onClick={(e) => {                    
                    console.log("id of group: ", listFiles[indexList].id);
                    openCloseModalLinkSQL()
                }}
            >
                Add SQL Database
            </button> */}
            <br />
            <div className='row d-flex' style={{ overflowY: "hidden", maxHeight: "300px" }}>
                <div className='col-6 d-flex'>
                    <div align="center" className='card p-2' style={{ width: "100%", maxHeight: "300px", minWidth: "300px" }}>
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
                                            className={styles.nav_item}
                                            style={{ display: "flex", justifyContent: "space-between", margin: "5px 0px 5px 0px", alignItems: "center" }}
                                            key={indice}
                                        >
                                            <div className={styles.item}>
                                                {item.name_file}
                                            </div>

                                            <button
                                                type="button text-dark"
                                                className={`${styles.nav_button} ${styles.import_button}`}
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
                    <div align="center" className='card p-2' style={{ width: "100%", maxHeight: "300px", minWidth: "300px" }}>
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
                                            className={styles.nav_item}
                                            style={{ display: "flex", justifyContent: "space-between", margin: "5px 0px 5px 0px", alignItems: "center" }}
                                            key={indice}
                                        >
                                            <div className={styles.item}>
                                                {item.name_file}
                                            </div>

                                            <button
                                                type="button text-dark"
                                                className={`${styles.nav_button} ${styles.import_button}`}
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
            {/* <div className='col-12 d-flex'>
                <div align="center" className='card p-2' style={{ width: "100%", maxHeight: "200px" }}>
                    <h4>Databases</h4>
                    {loading && <div className="d-flex justify-content-center align-items-center" id="loading2">
                        <div className="spinner-border text-warning" role="status" aria-hidden="true">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                    <div className="list-group" style={{ overflowY: "scroll", width: "100%", minHeight: "90%" }}>
                        {groupLinkedDB.length > 0 && indexList != null ? groupLinkedDB.map((item, indice) => {                            
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
                                        className={`${styles.nav_button} ${styles.import_button}`}
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
            </div> */}
            <br />
            <div className='row d-flex justify-content-end'>
                <div className='col-sm-2 col-md-8'></div>
                <div className='col-sm-5 col-md-2'><button className={`${styles.nav_button} ${styles.import_button}`} onClick={() => openCloseModalLink()}>Close</button></div>
                <div className='col-sm-5 col-md-2'><button className={`${styles.nav_button} ${styles.import_button}`} onClick={() => reloadList()}>Reload List</button></div>
            </div>


        </div>
    );

    const bodyModaAddSQL = (
        <div className={styles.modal} id="modal"><h3>Add Database</h3>

            <br />
            <button
                type="button text-dark"
                className={`${styles.nav_button} ${styles.import_button}`}
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
                    <button type="submit" className={`${styles.nav_button} ${styles.import_button}`}>Register Database</button>
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
            let dataPromise = fetch(tempURL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                }
            })
            //console.log("data in promise: ", data)
            let dataSQLPromise = fetch(tempURL2, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Accept": "application/json"
                },
                /* body: JSON.stringify({ group_id: indexID }) */
            })

            let [data, dataSQL] = await Promise.all([dataPromise, dataSQLPromise])

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

    const addContextGroupDB = (id) => {
        let tempList = groupContextFilterDB.slice()
        tempList.push(id)
        setGroupContextFilterDB(tempList)
        actions.changeGroupFilterDB(tempList)
        return
    }

    const deleteContextGroupDB = (id) => {
        let tempList = groupContextFilterDB.splice()
        let tempList2 = tempList.filter((item, index) => {
            return item != id
        })
        setGroupContextFilterDB(tempList2)
        actions.changeGroupFilterDB(tempList2)
    }

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
                    /* body: JSON.stringify({ group_id: indexID }) */
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
    }, [reloadDB])

    useEffect(() => {
        toggleMenu(true);
    }, [toggleMenu]);

    return (<>
        <div className={`${styles.nav_group}`}>
            <div className={`${styles.nav_item}`}>
                <button className={`${styles.nav_button} ${styles.import_button}`} style={{ width: "100%" }} onClick={(e) => { props.setModalImport(!props.modalImport) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36" fill="none" fill-opacity="0.48"><path d="M30.0459 11.5791L22.1709 3.70406C22.0664 3.59962 21.9423 3.51681 21.8057 3.46035C21.6691 3.40389 21.5228 3.37488 21.375 3.375H7.875C7.27826 3.375 6.70597 3.61205 6.28401 4.03401C5.86205 4.45597 5.625 5.02826 5.625 5.625V30.375C5.625 30.9717 5.86205 31.544 6.28401 31.966C6.70597 32.3879 7.27826 32.625 7.875 32.625H28.125C28.7217 32.625 29.294 32.3879 29.716 31.966C30.1379 31.544 30.375 30.9717 30.375 30.375V12.375C30.3751 12.2272 30.3461 12.0809 30.2897 11.9443C30.2332 11.8077 30.1504 11.6836 30.0459 11.5791ZM22.5 7.21547L26.5345 11.25H22.5V7.21547ZM28.125 30.375H7.875V5.625H20.25V12.375C20.25 12.6734 20.3685 12.9595 20.5795 13.1705C20.7905 13.3815 21.0766 13.5 21.375 13.5H28.125V30.375ZM22.5 21.375C22.5 21.6734 22.3815 21.9595 22.1705 22.1705C21.9595 22.3815 21.6734 22.5 21.375 22.5H19.125V24.75C19.125 25.0484 19.0065 25.3345 18.7955 25.5455C18.5845 25.7565 18.2984 25.875 18 25.875C17.7016 25.875 17.4155 25.7565 17.2045 25.5455C16.9935 25.3345 16.875 25.0484 16.875 24.75V22.5H14.625C14.3266 22.5 14.0405 22.3815 13.8295 22.1705C13.6185 21.9595 13.5 21.6734 13.5 21.375C13.5 21.0766 13.6185 20.7905 13.8295 20.5795C14.0405 20.3685 14.3266 20.25 14.625 20.25H16.875V18C16.875 17.7016 16.9935 17.4155 17.2045 17.2045C17.4155 16.9935 17.7016 16.875 18 16.875C18.2984 16.875 18.5845 16.9935 18.7955 17.2045C19.0065 17.4155 19.125 17.7016 19.125 18V20.25H21.375C21.6734 20.25 21.9595 20.3685 22.1705 20.5795C22.3815 20.7905 22.5 21.0766 22.5 21.375Z" fill="#1A1A1A"></path></svg>
                    <span className={`${styles.nav_text}`}>Import</span>
                </button>
                <div className={`${styles.nav_label}`}>Folders</div>
            </div>
            <div className={`${styles.nav_item}`}>
                <button className={`${styles.nav_button} ${styles.note_button}`} style={{ width: "100%" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" fill-opacity="0.48"><path d="M15.7594 4.73203L12.268 1.2414C12.1519 1.1253 12.0141 1.0332 11.8624 0.970361C11.7107 0.907525 11.5482 0.875183 11.384 0.875183C11.2198 0.875183 11.0572 0.907525 10.9056 0.970361C10.7539 1.0332 10.6161 1.1253 10.5 1.2414L0.866412 10.875C0.749834 10.9906 0.657407 11.1283 0.594506 11.28C0.531604 11.4317 0.499482 11.5944 0.500006 11.7586V15.25C0.500006 15.5815 0.631702 15.8995 0.866123 16.1339C1.10054 16.3683 1.41849 16.5 1.75001 16.5H14.875C15.0408 16.5 15.1997 16.4341 15.3169 16.3169C15.4342 16.1997 15.5 16.0408 15.5 15.875C15.5 15.7092 15.4342 15.5503 15.3169 15.4331C15.1997 15.3158 15.0408 15.25 14.875 15.25H7.00938L15.7594 6.49999C15.8755 6.38392 15.9676 6.24611 16.0304 6.09443C16.0933 5.94275 16.1256 5.78019 16.1256 5.61601C16.1256 5.45183 16.0933 5.28927 16.0304 5.13759C15.9676 4.98591 15.8755 4.8481 15.7594 4.73203ZM4.19688 13.6875L11.2547 6.62968L12.5586 7.93281L5.50001 14.9914L4.19688 13.6875ZM10.3688 5.74531L3.31251 12.8039L2.0086 11.5L9.06719 4.44218L10.3688 5.74531ZM1.75001 13.0086L3.99141 15.25H1.75001V13.0086Z" fill="#1A1A1A"></path></svg>
                    <span className={`${styles.nav_text}`}>Note</span>
                </button>
                <div className={`${styles.nav_label} ${styles.folder_icon}`} style={{ width: "fit-content" }}>
                    <Menu className={`${styles.background_button}`} menuButton={<MenuButton className={`${styles.background_button}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" fill-opacity="0.48"><path d="M16.875 5.625H10.2086L8.04141 4C7.82472 3.83832 7.56176 3.75067 7.29141 3.75H3.125C2.79348 3.75 2.47554 3.8817 2.24112 4.11612C2.0067 4.35054 1.875 4.66848 1.875 5V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.9445C17.2575 16.8746 17.5575 16.7501 17.7788 16.5288C18.0001 16.3075 18.1246 16.0075 18.125 15.6945V6.875C18.125 6.54348 17.9933 6.22554 17.7589 5.99112C17.5245 5.7567 17.2065 5.625 16.875 5.625ZM16.875 15.625H3.125V5H7.29141L9.625 6.75C9.73318 6.83114 9.86477 6.875 10 6.875H16.875V15.625ZM12.5 11.25C12.5 11.4158 12.4342 11.5747 12.3169 11.6919C12.1997 11.8092 12.0408 11.875 11.875 11.875H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V11.875H8.125C7.95924 11.875 7.80027 11.8092 7.68306 11.6919C7.56585 11.5747 7.5 11.4158 7.5 11.25C7.5 11.0842 7.56585 10.9253 7.68306 10.8081C7.80027 10.6908 7.95924 10.625 8.125 10.625H9.375V9.375C9.375 9.20924 9.44085 9.05027 9.55806 8.93306C9.67527 8.81585 9.83424 8.75 10 8.75C10.1658 8.75 10.3247 8.81585 10.4419 8.93306C10.5592 9.05027 10.625 9.20924 10.625 9.375V10.625H11.875C12.0408 10.625 12.1997 10.6908 12.3169 10.8081C12.4342 10.9253 12.5 11.0842 12.5 11.25Z" fill="#1A1A1A"></path></svg>
                    </MenuButton>}>
                        <MenuItem><div className='col-6 d-flex justify-content-center align-items-center mx-1 my-2'>
                            <FocusableItem>
                                {({ ref }) => (
                                    <input
                                        ref={ref}
                                        type="text"
                                        className={`${styles.nav_text}`}
                                        placeholder="New Folder Name"
                                        onChange={(e) => { setInputText(e.target.value) }}
                                        style={{ color: "#c30303", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", borderRadius: "5px", fontSize: "0.85em", minHeight: "5px", backgroundColor: "white", lineBreak: "anywhere" }}
                                    />
                                )}
                            </FocusableItem>
                        </div>
                            <div className='col d-flex justify-content-center align-items-center mx-1 my-2'>
                                <button className={`${styles.nav_button} ${styles.import_button}`}
                                    onClick={() => newGroup(inputText)}>
                                    New Folder
                                </button>
                            </div></MenuItem>
                        {/* <SubMenu label="Edit">
                                        <MenuItem>Cut</MenuItem>
                                        <MenuItem>Copy</MenuItem>
                                        <MenuItem>Paste</MenuItem>
                                        <SubMenu label="Find">
                                            <MenuItem>Find...</MenuItem>
                                            <MenuItem>Find Next</MenuItem>
                                            <MenuItem>Find Previous</MenuItem>
                                        </SubMenu>
                                    </SubMenu>
                                    <MenuItem>Print...</MenuItem> */}
                    </Menu></div>

            </div>
        </div>
        <div className={`${styles.nav_group}`}>

            {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
            <div className='card' style={{ overflowY: "scroll", width: "100%", minHeight: props.cardHeight, maxHeight: "200px" }}>
                <ul>
                    {listFiles.map((item, indice) => {
                        return (
                            <li
                                className={`${styles.nav_item} ${styles.nav_text}`}
                                key={item.id}
                                style={{ display: "flex", justifyContent: "space-between", margin: "5px 0px 5px 5px" }}
                            >
                                <div className={styles.item} style={groupContextFilter.includes(item.id) ? { backgroundColor: "#0000001a" } : { backgroundColor: "white" }}>
                                    {item.name}

                                </div>
                                <Menu className={`${styles.background_button}`} menuButton={<MenuButton className={`${styles.background_button}`}>
                                    <svg fill-opacity="0.48" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="CaretUpDown"><path id="Vector" d="M11.5306 10.4694C11.6005 10.5391 11.656 10.6219 11.6938 10.713C11.7317 10.8042 11.7512 10.9019 11.7512 11.0006C11.7512 11.0993 11.7317 11.1971 11.6938 11.2882C11.656 11.3794 11.6005 11.4622 11.5306 11.5319L8.5306 14.5319C8.46092 14.6018 8.37813 14.6573 8.28696 14.6951C8.1958 14.733 8.09806 14.7525 7.99935 14.7525C7.90064 14.7525 7.8029 14.733 7.71173 14.6951C7.62057 14.6573 7.53778 14.6018 7.4681 14.5319L4.4681 11.5319C4.3272 11.391 4.24805 11.1999 4.24805 11.0006C4.24805 10.8014 4.3272 10.6103 4.4681 10.4694C4.60899 10.3285 4.80009 10.2493 4.99935 10.2493C5.19861 10.2493 5.3897 10.3285 5.5306 10.4694L7.99997 12.9375L10.4693 10.4675C10.5391 10.3979 10.6219 10.3427 10.7131 10.3051C10.8042 10.2676 10.9018 10.2483 11.0004 10.2485C11.0989 10.2487 11.1965 10.2683 11.2875 10.3062C11.3784 10.3441 11.4611 10.3995 11.5306 10.4694ZM5.5306 5.53189L7.99997 3.06251L10.4693 5.53251C10.6102 5.67341 10.8013 5.75256 11.0006 5.75256C11.1999 5.75256 11.391 5.67341 11.5318 5.53251C11.6727 5.39161 11.7519 5.20052 11.7519 5.00126C11.7519 4.802 11.6727 4.61091 11.5318 4.47001L8.53185 1.47001C8.46217 1.40009 8.37937 1.34461 8.28821 1.30676C8.19705 1.26891 8.09931 1.24942 8.0006 1.24942C7.90189 1.24942 7.80415 1.26891 7.71298 1.30676C7.62182 1.34461 7.53903 1.40009 7.46935 1.47001L4.46935 4.47001C4.32845 4.61091 4.2493 4.802 4.2493 5.00126C4.2493 5.20052 4.32845 5.39161 4.46935 5.53251C4.61024 5.67341 4.80134 5.75256 5.0006 5.75256C5.19986 5.75256 5.39095 5.67341 5.53185 5.53251L5.5306 5.53189Z" fill="#1A1A1A"></path></g></svg>
                                </MenuButton>}>
                                    <MenuItem>
                                        {!groupContextFilter.includes(item.id) ?
                                            <button className={`${styles.background_button} ${styles.nav_text}`} onClick={(e) => { addContextGroup(item.id) }}>Select</button> : <button className={`${styles.background_button} ${styles.nav_text}`} onClick={(e) => { deleteContextGroup(item.id) }}>Deselect All</button>
                                        }
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            type="button"
                                            className={`${styles.background_button} ${styles.nav_text}`}
                                            style={{ borderRadius: "5px" }}
                                            onClick={(e) => {
                                                setIndexList(indice)
                                                openCloseModal();
                                            }}
                                        >
                                            Share
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            type="button"
                                            className={`${styles.background_button} ${styles.nav_text}`}
                                            style={{ borderRadius: "5px" }}
                                            onClick={(e) => {
                                                setIndexList(indice)
                                                setIndexID(item.id)
                                                openCloseModalLink();
                                            }}
                                        >
                                            Add File
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button
                                            type="button"
                                            className={`${styles.background_button} ${styles.nav_text}`}
                                            style={{ borderRadius: "5px" }}
                                            onClick={(e) => {
                                                deleteGroup(item.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </MenuItem>
                                </Menu>
                            </li>
                        );
                    })}
                </ul>

            </div>

        </div>
        <div className={`${styles.nav_group}`}>
            <div className={`${styles.nav_item}`}>
                <div className={`${styles.nav_label}`}>Databases</div>
            </div>
            <div className={`${styles.nav_item}`}>
                <div className={`${styles.nav_label} ${styles.folder_icon}`} style={{ width: "fit-content" }}>
                    <Menu className={`${styles.background_button}`} menuButton={<MenuButton className={`${styles.background_button}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" fill-opacity="0.48"><path d="M16.875 5.625H10.2086L8.04141 4C7.82472 3.83832 7.56176 3.75067 7.29141 3.75H3.125C2.79348 3.75 2.47554 3.8817 2.24112 4.11612C2.0067 4.35054 1.875 4.66848 1.875 5V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.9445C17.2575 16.8746 17.5575 16.7501 17.7788 16.5288C18.0001 16.3075 18.1246 16.0075 18.125 15.6945V6.875C18.125 6.54348 17.9933 6.22554 17.7589 5.99112C17.5245 5.7567 17.2065 5.625 16.875 5.625ZM16.875 15.625H3.125V5H7.29141L9.625 6.75C9.73318 6.83114 9.86477 6.875 10 6.875H16.875V15.625ZM12.5 11.25C12.5 11.4158 12.4342 11.5747 12.3169 11.6919C12.1997 11.8092 12.0408 11.875 11.875 11.875H10.625V13.125C10.625 13.2908 10.5592 13.4497 10.4419 13.5669C10.3247 13.6842 10.1658 13.75 10 13.75C9.83424 13.75 9.67527 13.6842 9.55806 13.5669C9.44085 13.4497 9.375 13.2908 9.375 13.125V11.875H8.125C7.95924 11.875 7.80027 11.8092 7.68306 11.6919C7.56585 11.5747 7.5 11.4158 7.5 11.25C7.5 11.0842 7.56585 10.9253 7.68306 10.8081C7.80027 10.6908 7.95924 10.625 8.125 10.625H9.375V9.375C9.375 9.20924 9.44085 9.05027 9.55806 8.93306C9.67527 8.81585 9.83424 8.75 10 8.75C10.1658 8.75 10.3247 8.81585 10.4419 8.93306C10.5592 9.05027 10.625 9.20924 10.625 9.375V10.625H11.875C12.0408 10.625 12.1997 10.6908 12.3169 10.8081C12.4342 10.9253 12.5 11.0842 12.5 11.25Z" fill="#1A1A1A"></path></svg>
                    </MenuButton>}>
                        <MenuItem><div className='col d-flex justify-content-start align-items-center mx-1 my-2'>
                            <FocusableItem>
                                {({ ref }) => (
                                    <button className={`${styles.nav_button} ${styles.import_button}`}
                                        onClick={() => openCloseModalLinkSQL()}
                                        ref={ref}>
                                        New Database
                                    </button>
                                )}
                            </FocusableItem>
                        </div>
                        </MenuItem>
                        {/* <SubMenu label="Edit">
                                        <MenuItem>Cut</MenuItem>
                                        <MenuItem>Copy</MenuItem>
                                        <MenuItem>Paste</MenuItem>
                                        <SubMenu label="Find">
                                            <MenuItem>Find...</MenuItem>
                                            <MenuItem>Find Next</MenuItem>
                                            <MenuItem>Find Previous</MenuItem>
                                        </SubMenu>
                                    </SubMenu>
                                    <MenuItem>Print...</MenuItem> */}
                    </Menu>
                </div>
            </div>
        </div>
        <div className={`${styles.nav_group_database}`} ref={boundingBoxRef}>

            {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                <div className="spinner-border text-warning" role="status" aria-hidden="true">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
            <div className='card' style={{ overflowY: "scroll", width: "100%", minHeight: "100px", maxHeight: "200px" }} >
                <ul>
                    {store.dbList.length > 0 ? store.dbList.map((item, indice) => {
                        return (
                            <li
                                className={`${styles.nav_item} ${styles.nav_text}`}
                                key={item.id}
                                style={{ display: "flex", justifyContent: "space-between", margin: "5px 0px 5px 5px" }}
                            >
                                <div className={styles.item} style={groupContextFilterDB.includes(item.id) ? { backgroundColor: "#0000001a" } : { backgroundColor: "white" }}>
                                    {item.database}

                                </div>
                                {/* <button type="button" ref={leftAnchor} {...anchorProps} className={`${styles.background_button}`}>
                                    <svg fill-opacity="0.48" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="CaretUpDown"><path id="Vector" d="M11.5306 10.4694C11.6005 10.5391 11.656 10.6219 11.6938 10.713C11.7317 10.8042 11.7512 10.9019 11.7512 11.0006C11.7512 11.0993 11.7317 11.1971 11.6938 11.2882C11.656 11.3794 11.6005 11.4622 11.5306 11.5319L8.5306 14.5319C8.46092 14.6018 8.37813 14.6573 8.28696 14.6951C8.1958 14.733 8.09806 14.7525 7.99935 14.7525C7.90064 14.7525 7.8029 14.733 7.71173 14.6951C7.62057 14.6573 7.53778 14.6018 7.4681 14.5319L4.4681 11.5319C4.3272 11.391 4.24805 11.1999 4.24805 11.0006C4.24805 10.8014 4.3272 10.6103 4.4681 10.4694C4.60899 10.3285 4.80009 10.2493 4.99935 10.2493C5.19861 10.2493 5.3897 10.3285 5.5306 10.4694L7.99997 12.9375L10.4693 10.4675C10.5391 10.3979 10.6219 10.3427 10.7131 10.3051C10.8042 10.2676 10.9018 10.2483 11.0004 10.2485C11.0989 10.2487 11.1965 10.2683 11.2875 10.3062C11.3784 10.3441 11.4611 10.3995 11.5306 10.4694ZM5.5306 5.53189L7.99997 3.06251L10.4693 5.53251C10.6102 5.67341 10.8013 5.75256 11.0006 5.75256C11.1999 5.75256 11.391 5.67341 11.5318 5.53251C11.6727 5.39161 11.7519 5.20052 11.7519 5.00126C11.7519 4.802 11.6727 4.61091 11.5318 4.47001L8.53185 1.47001C8.46217 1.40009 8.37937 1.34461 8.28821 1.30676C8.19705 1.26891 8.09931 1.24942 8.0006 1.24942C7.90189 1.24942 7.80415 1.26891 7.71298 1.30676C7.62182 1.34461 7.53903 1.40009 7.46935 1.47001L4.46935 4.47001C4.32845 4.61091 4.2493 4.802 4.2493 5.00126C4.2493 5.20052 4.32845 5.39161 4.46935 5.53251C4.61024 5.67341 4.80134 5.75256 5.0006 5.75256C5.19986 5.75256 5.39095 5.67341 5.53185 5.53251L5.5306 5.53189Z" fill="#1A1A1A"></path></g></svg>
                                </button> */}
                                <Menu className={`${styles.background_button}`} ref={leftAnchor} {...anchorProps} menuButton={<MenuButton className={`${styles.background_button}`} >
                                    <svg fill-opacity="0.48" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="CaretUpDown"><path id="Vector" d="M11.5306 10.4694C11.6005 10.5391 11.656 10.6219 11.6938 10.713C11.7317 10.8042 11.7512 10.9019 11.7512 11.0006C11.7512 11.0993 11.7317 11.1971 11.6938 11.2882C11.656 11.3794 11.6005 11.4622 11.5306 11.5319L8.5306 14.5319C8.46092 14.6018 8.37813 14.6573 8.28696 14.6951C8.1958 14.733 8.09806 14.7525 7.99935 14.7525C7.90064 14.7525 7.8029 14.733 7.71173 14.6951C7.62057 14.6573 7.53778 14.6018 7.4681 14.5319L4.4681 11.5319C4.3272 11.391 4.24805 11.1999 4.24805 11.0006C4.24805 10.8014 4.3272 10.6103 4.4681 10.4694C4.60899 10.3285 4.80009 10.2493 4.99935 10.2493C5.19861 10.2493 5.3897 10.3285 5.5306 10.4694L7.99997 12.9375L10.4693 10.4675C10.5391 10.3979 10.6219 10.3427 10.7131 10.3051C10.8042 10.2676 10.9018 10.2483 11.0004 10.2485C11.0989 10.2487 11.1965 10.2683 11.2875 10.3062C11.3784 10.3441 11.4611 10.3995 11.5306 10.4694ZM5.5306 5.53189L7.99997 3.06251L10.4693 5.53251C10.6102 5.67341 10.8013 5.75256 11.0006 5.75256C11.1999 5.75256 11.391 5.67341 11.5318 5.53251C11.6727 5.39161 11.7519 5.20052 11.7519 5.00126C11.7519 4.802 11.6727 4.61091 11.5318 4.47001L8.53185 1.47001C8.46217 1.40009 8.37937 1.34461 8.28821 1.30676C8.19705 1.26891 8.09931 1.24942 8.0006 1.24942C7.90189 1.24942 7.80415 1.26891 7.71298 1.30676C7.62182 1.34461 7.53903 1.40009 7.46935 1.47001L4.46935 4.47001C4.32845 4.61091 4.2493 4.802 4.2493 5.00126C4.2493 5.20052 4.32845 5.39161 4.46935 5.53251C4.61024 5.67341 4.80134 5.75256 5.0006 5.75256C5.19986 5.75256 5.39095 5.67341 5.53185 5.53251L5.5306 5.53189Z" fill="#1A1A1A"></path></g></svg>
                                </MenuButton>}>
                                    <MenuItem>
                                        {!groupContextFilterDB.includes(item.id) ?
                                            <button className={`${styles.background_button} ${styles.nav_text}`} onClick={(e) => { addContextGroupDB(item.id) }}>Select</button> : <button className={`${styles.background_button} ${styles.nav_text}`} onClick={(e) => { deleteContextGroupDB(item.id) }}>Deselect All</button>
                                        }
                                    </MenuItem>
                                    {/* <MenuItem>
                                        <button
                                            type="button"
                                            className={`${styles.background_button} ${styles.nav_text}`}
                                            style={{ borderRadius: "5px" }}
                                            onClick={(e) => {
                                                setIndexListDB(indice)
                                                openCloseModal();
                                            }}
                                        >
                                            Share
                                        </button>
                                    </MenuItem> */}
                                    <MenuItem>
                                        <button
                                            type="button"
                                            className={`${styles.background_button} ${styles.nav_text}`}
                                            style={{ borderRadius: "5px" }}
                                            onClick={(e) => {
                                                unlinkDB(item.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </MenuItem>
                                </Menu>
                                {/* <ControlledMenu {...tooltipProps}
                                    state={isOpen ? 'open' : 'closed'}
                                    onClose={() => setOpen(false)}
                                    anchorRef={leftAnchor}>

                                </ControlledMenu> */}

                            </li>
                        );
                    }) : <></>}
                </ul>

            </div>

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
    </>
    )
}

export default Folder;
