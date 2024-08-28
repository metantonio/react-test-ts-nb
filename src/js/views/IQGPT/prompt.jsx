import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import styles from "./index.module.css";
import { Context } from '../../store/appContext';
import Swal from 'sweetalert2';
//import { encode, decodeGenerator } from "gpt-tokenizer";
import BookLoader from '../Loading/bookloader'

const Prompt = () => {
    const [loading, setLoading] = useState(false)
    const { store, actions } = useContext(Context)
    const [inputValue, setInputValue] = useState('');
    const [outputValue, setOutputValue] = useState([]);
    const [userQuestion, setUserQuestion] = useState(false)
    const [userChat, setUserChat] = useState('')
    const [modeChunk, setModeChunk] = useState(true)
    const chatRef = useRef(null);
    const limitTokens = 2048
    //let encodedTokens = encode(inputValue);
    const IA_URL = process.env.IA_URL;
    const URL_CHUNKS = IA_URL + '/chunks';
    const URL_DOWNLOAD = IA_URL + '/user/download/';

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

    const handleSendInput = async () => {
        setOutputValue('')
        setLoading(true)
        setUserQuestion(false)

        setUserChat(inputValue)

        if (modeChunk) {
            let data = {
                text: inputValue,
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
                let question = inputValue + "\n"
                response = await response.json()
                console.log(response.data)
                //let tempArr = response.data.map((item,index)=>{return {score:}})

                setOutputValue([...outputValue, { score: 0, text: inputValue, document: { doc_metadata: { doc_id: 0, file_name: "User", original_text: inputValue, page_level: "", window: "" } } }, ...response.data])
                setInputValue('');

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

    /* useEffect(() => {
        if (outputValue.length > 0) {
            document.querySelector('#scrolldown').scrollTop = document.querySelector('#scrolldown').scrollHeight
        }
    }, [outputValue]) */

    useEffect(() => {
        const chatElement = chatRef.current;
        if (chatElement) {
            // Asegúrate de que los mensajes estén cargados antes de realizar el desplazamiento
            const messages = chatElement.querySelectorAll('.question');
            if (messages.length > 0) {
                console.log("more than 0 messages")
                const lastMessage = messages[messages.length - 1];
                const isScrolledToBottom = chatElement.scrollHeight - chatElement.clientHeight <= chatElement.scrollTop + 1;
                console.log(lastMessage)
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
                                if (item.document.doc_metadata.file_name.includes("www.youtube.com")) {
                                    return (<div key={index}>
                                        <strong>
                                            <div
                                                style={{ color: "blue", border: "none" }}

                                            >
                                                <a href={item.document.doc_metadata.file_name} target='_blank'>{item.document.doc_metadata.file_name}</a></div> - score:{item.score.toFixed(3)}:</strong>
                                        <p className={styles.p_output}>{item.document.doc_metadata.window}</p>
                                        <br />
                                    </div>)
                                }
                                else {
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
                                        <p className={styles.p_output}>{item.document.doc_metadata.window}</p>
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
                        <button className={styles.button_danger} onClick={e => { setOutputValue([]) }}>Clear Screen</button>

                    </div>
                    <div className='col-sm-12 col-md-4 d-flex justify-content-center'>
                        <button type="button" className={styles.button_danger} onClick={actions.changePromptLLM}>LLM deactivated</button>
                        
                    </div>
                </div>



            </div>
        </div>
    )
}

export default Prompt;