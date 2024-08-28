import React, { useState, useEffect, useContext } from 'react';
import styles from "./clean.module.css";
import { Context } from '../../store/appContext';
import Swal from 'sweetalert2';



const WidgetVector = () => {
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(false);
    const [listFiles, setListFiles] = useState([])
    const [number, setNumber] = useState(10)
    const [plotImage, setPlotImage] = useState(null)
    const [plotImage2, setPlotImage2] = useState(null)
    const { store, actions } = useContext(Context)
    const IA_URL = process.env.IA_URL;
    const URL_LIST = '/latest/prompts';
    const URL_CLUSTER = '/embedding/vector/rep'

    const getClusters = async () => {
        setLoading(true)
        let tempURL = IA_URL + URL_CLUSTER
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
                const plotImageData = data.plot;
                const plotImg = new Image();
                plotImg.src = `data:image/png;base64, ${plotImageData}`
                setPlotImage(plotImageData)

                const plotImageData2 = data.plot2;
                const plotImg2 = new Image();
                plotImg2.src = `data:image/png;base64, ${plotImageData2}`
                setPlotImage2(plotImageData2)
            }
        } catch (error) {
            setLoading(false)
            console.log("error fetch: ", error);
        }

    }

    useEffect(() => {
        const fetchList = async () => {
            setLoading(true)
            let tempURL = IA_URL + URL_LIST
            console.log("tempURL: ", tempURL)
            let tempObj = {
                number: number
            }
            try {
                let data = await fetch(tempURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(tempObj)
                })
                //console.log("data in promise: ", data)

                if (data.ok) {
                    data = await data.json()
                    setLoading(false)
                    //console.log(data)
                    setListFiles(data)
                }
            } catch (error) {
                setLoading(false)
                console.log("error fetch: ", error);
            }
        }
        fetchList();
    }, [reload])

    return (
        <div className={styles.window1}>
            {/* <button className={styles.button_approve} type="button" data-bs-toggle="offcanvas" data-bs-target="#widget1" aria-controls="widget1" style={{border:"none", background:"none"}}>Latest prompts</button> */}
            <button className={styles.button_approve} type="button" data-bs-toggle="offcanvas" data-bs-target="#widgetCluster" aria-controls="widgetCluster" style={{border:"none", background:"none"}}>Cluster prompts</button>
            <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="widget1" aria-labelledby="widget1Label" style={{width:"500px", overflowY:"scroll"}}>
                <div className="offcanvas-header">
                    <h2 className="offcanvas-title" id="widget1Label">Latest {number} prompts <button type='button' onClick={(e) => { setReload(!reload) }}>🔄️</button></h2>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <>
                        <div className='row d-flex justify-content-center align-items-center mb-2'>
                            <div className='col'>Limit</div>
                            <div className='col d-flex justify-content-center'><textarea placeholder='10' type='number' onChange={e => { setNumber(parseInt(e.target.value)) }} style={{ color: "blac", width: "100%%", padding: "5px", borderWidth: "1px", borderColor: "black", borderRadius: "5px", fontSize: "0.85em", minHeight: "20px", backgroundColor: "white", lineBreak: "anywhere", maxHeight: "30px" }} /></div>
                            <div className='col'><button type='button' className={styles.button_approve} onClick={(e) => { setReload(!reload) }}>Apply</button></div>
                        </div>

                        {loading ? <div className="spinner-border text-warning" role="status" aria-hidden="true">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                            : <div className="list-group">
                                <h5 class="h-9 pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all text-token-text-tertiary" style={{color: "#9d9d9d"}}>Today</h5>
                                {listFiles.length > 0 ? listFiles.filter(item => {
                                    const currentDate = new Date();
                                    const itemDate = new Date(item["prompt_id"]["registered"]);

                                    // Comparamos día, mes y año
                                    return currentDate.getDate() === itemDate.getDate() &&
                                        currentDate.getMonth() === itemDate.getMonth() &&
                                        currentDate.getFullYear() === itemDate.getFullYear();
                                }).map((item, index) => {
                                    return (
                                        <div href="#" className="list-group-item list-group-item-action active" aria-current="true" key={index} style={{ color: "black", lineHeight: "normal", backgroundColor:"white", borderColor:"#ececec" }}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="text-wrap" style={{ display: "flex", fontSize: "0.9em", justifyContent: "start", alignItems: "center" }}>id: {item["prompt_id"]["id"]}</h5>
                                                {!item["prompt_id"]["sensitive"] ? <div class="badge bg-primary text-wrap" style={{ width: "8em" }}>
                                                    OK
                                                </div> : <div class="badge bg-danger text-wrap" style={{ width: "8em" }}>
                                                    Sensitive
                                                </div>}

                                            </div>
                                            <p class="text-wrap" style={{ display: "flex", fontSize: "0.9em", justifyContent: "start", alignItems: "center" }}>
                                                Prompt: {item["prompt_id"]["prompt"]}
                                            </p>
                                            <p style={{ lineHeight: "normal" }}><small>{item["prompt_id"]["registered"]}</small></p>

                                            <small>User: {item["last_user"]["username"]} - Role: {item["last_user"]["role"]} </small>
                                        </div>
                                    )
                                }) : <></>}
                                <h5 class="h-9 pb-2 pt-3 px-2 text-xs font-medium text-ellipsis overflow-hidden break-all text-token-text-tertiary" style={{color: "#9d9d9d"}}>Previous</h5>
                                {listFiles.length > 0 ? listFiles.filter(item => {
                                    const currentDate = new Date();
                                    const itemDate = new Date(item["prompt_id"]["registered"]);

                                    // Comparamos día, mes y año
                                    return currentDate.getDate() !== itemDate.getDate();
                                }).map((item, index) => {
                                    return (
                                        <div href="#" className="list-group-item list-group-item-action active" aria-current="true" key={index} style={{ color: "black", lineHeight: "normal", backgroundColor:"white", borderColor:"#ececec" }}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="text-wrap" style={{ display: "flex", fontSize: "0.9em", justifyContent: "start", alignItems: "center" }}>id: {item["prompt_id"]["id"]}</h5>
                                                {!item["prompt_id"]["sensitive"] ? <div class="badge bg-primary text-wrap" style={{ width: "8em" }}>
                                                    OK
                                                </div> : <div class="badge bg-danger text-wrap" style={{ width: "8em" }}>
                                                    Sensitive
                                                </div>}

                                            </div>
                                            <p class="text-wrap" style={{ display: "flex", fontSize: "0.9em", justifyContent: "start", alignItems: "center" }}>
                                                Prompt: {item["prompt_id"]["prompt"]}
                                            </p>
                                            <p style={{ lineHeight: "normal" }}><small>{item["prompt_id"]["registered"]}</small></p>

                                            <small>User: {item["last_user"]["username"]} - Role: {item["last_user"]["role"]} </small>
                                        </div>
                                    )
                                }) : <></>}
                            </div>
                        }
                    </>
                </div>
            </div>
            <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="widgetCluster" aria-labelledby="widgetClusterLabel" style={{width:"670px", overflowY:"scroll"}}>
                <div className="offcanvas-header">
                    <h2 className="offcanvas-title" id="widgetClusterLabel">Prompt Clusters</h2>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body" style={{overflowY:"scroll !important"}}>
                    <div className='col'>
                        <div className='row d-flex justify-content-center align-items-center mb-2'>
                            <div className='col'><button type='button' className={styles.button_approve} onClick={(e) => { getClusters() }}>GET CLUSTER</button></div>
                        </div>
                        {loading ? <div className="spinner-border text-warning" role="status" aria-hidden="true">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                            : <>
                                {plotImage != null ?
                                    <>
                                        <img src={`data:image/png;base64, ${plotImage}`} style={{minHeight: "400px", maxWidth: "640px", height:"100%"}}
                                            loading="lazy" />
                                    </> :
                                    <></>
                                }
                                {plotImage2 != null ?
                                    <>
                                        <img src={`data:image/png;base64, ${plotImage2}`} style={{minHeight: "400px", maxWidth: "640px", height:"100%"}}
                                            loading="lazy" />
                                    </> :
                                    <></>
                                }
                            </>}

                    </div>

                </div>
            </div>
        </div>
    )

}

export default WidgetVector;