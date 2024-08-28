import React, { useState, useEffect, useContext } from 'react';
import styles from "./index.module.css";
import { Context } from '../../store/appContext';
import Swal from 'sweetalert2';



const WidgetTech4 = () => {
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(false);
    const [listFiles, setListFiles] = useState([])
    const [number, setNumber] = useState(10)
    const { store, actions } = useContext(Context)
    const IA_URL = process.env.IA_URL;
    const URL_LIST = '/top/prompts/users';

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
        <div className={styles.window4}>
            <button className={styles.button_approve} type="button" data-bs-toggle="offcanvas" data-bs-target="#widget4" aria-controls="widget4">Top Users</button>

            <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="widget4" aria-labelledby="widget4Label" style={{width:"500px", overflowY:"scroll"}}>
                <div className="offcanvas-header">
                    <h2 className="offcanvas-title" id="widget4Label">Top {number} Users <button type='button' onClick={(e) => { setReload(!reload) }}>🔄️</button></h2>
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
                                {listFiles.length > 0 ? listFiles.map((item, index) => {
                                    return (
                                        <div href="#" className="list-group-item list-group-item-action active" aria-current="true" key={index} style={{ color: "black", lineHeight: "normal", backgroundColor:"white", borderColor:"#ececec" }}>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="text-wrap" style={{ display: "flex", fontSize: "0.9em", justifyContent: "start", alignItems: "center" }}>User: {item["user"]}</h5>
                                                {item["prompt_count"]? <div class="badge bg-primary text-wrap d-flex column justify-content-center align-items-center" style={{ width: "12em" }}>
                                                    Prompts: {item["prompt_count"]}
                                                </div> : <div class="badge bg-danger text-wrap" style={{ width: "8em" }}>
                                                    No Data
                                                </div>}

                                            </div>
                                        </div>
                                    )
                                }) : <></>}
                            </div>
                        }
                    </>
                </div>
            </div>
        </div>
    )

}

export default WidgetTech4;