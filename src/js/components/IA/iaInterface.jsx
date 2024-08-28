import React, { useState, useContext, useMemo } from 'react';
import { Context } from '../../store/appContext';
//import { encode, decodeGenerator } from "gpt-tokenizer";
import './iaInterface.css';

const IAInput = () => {
    const { store, actions } = useContext(Context)
    const [inputValue, setInputValue] = useState('');
    const [outputValue, setOutputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [assistant, setAssistant] = useState(false);
    const [streaming, setStreaming] = useState(true);
    const [userQuestion, setUserQuestion] = useState(false)
    const [userChat, setUserChat] = useState('')
    const [widthW, setWidthW] = useState(false)
    const [displayTokens, setDisplayTokens] = useState(false);
    const limitTokens = 2048
    //let encodedTokens = encode(inputValue);
    let endpoint = '/iaAssistant/stream'

/*     const decodedTokens = useMemo(() => {
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

    const toggleChatbot = () => {
        setAssistant(!assistant);
    };

    const handleSendInput = async () => {
        setOutputValue('')
        setLoading(true)
        setUserQuestion(false)
        let data = {
            input: inputValue
        }
        setUserChat(inputValue)
        if (streaming) {
            endpoint = '/iaAssistant/stream'
            let text = ""
            let text2 = ""
            while (!text2.includes("Human:")) {
                data = {
                    input: inputValue,
                    output: text
                }
                let response = await actions.useFetch(endpoint, data, "POST");
                //console.log(response)
                setUserQuestion(true)
                if (response.ok) {


                    let question = inputValue + "\n"

                    response = await response.text()
                    text2 = response
                    if (!response.includes("Human:") && !response.includes("Input: <nothing>")) {
                        text = text + response
                        console.log(response)
                        setOutputValue(text)
                    }
                    setInputValue('');

                } else {
                    setLoading(false)
                    response = await response.json()
                    setOutputValue(response.message)
                }
            }
            setLoading(false)
        } else {
            endpoint = '/iaAssistant'
            let response = await actions.useFetch(endpoint, data, "POST");
            //console.log(response)
            if (response.ok) {
                setLoading(false)
                setUserQuestion(true)
                let question = inputValue + "\n"
                if (endpoint == '/iaAssistant/stream') {
                    response = await response.text()
                    console.log(response)
                    setOutputValue(response)
                } else {
                    response = await response.json()
                    //console.log(response)
                    setOutputValue(response.message)
                }

                setInputValue('');

            } else {
                setLoading(false)
                response = await response.json()
                setOutputValue(response.message)
            }
        }




    };

    return (
        <div className="text-input-container chatbot-button-container">
            <button className="chatbot-button" onClick={toggleChatbot}>
                <span className="chatbot-button-text">Assistant</span>
            </button>
            {assistant ? <div className={!widthW ? "chatbot-section" : "chatbot-section-wide"}>
                <h1 className="title-ia">
                    <div className='row d-flex'>
                        <div className='col-11'>QLX Assistant</div>
                        <div className='col-1'>
                            <i className="fa fa-arrows-h" style={{ position: "right" }} onClick={() => { setWidthW(!widthW) }} />
                            {/* <input placeholder='Streaming' type='checkbox' onChange={(e) => {
                        console.log(e.target.checked)
                        setStreaming(e.target.checked)
                    }} checked /> */}
                        </div>
                    </div>
                    {loading && <div className="d-flex justify-content-center align-items-center" id="loading">
                        {/* <strong>Loading...</strong> */}
                        <div className="spinner-border text-warning" role="status" aria-hidden="true">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                </h1>
                <div className="text-input">
                    <textarea type="col-12 text-input"
                        value={inputValue}
                        onChange={handleInputChange}
                        style={{ color: "black", width: "85%", padding: "5px" }}
                        placeholder='How can i help you?'
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSendInput()
                            }
                        }} />
                    {loading ?
                        <button onClick={handleSendInput} disabled>Send</button> :
                        <button onClick={handleSendInput}>Send</button>}
                </div>
                {inputValue.length > 0 ?
                    <div className="row d-flex statistics">
                        <h5>Characters: {inputValue.length}</h5>
                        {/* <h5 className={encodedTokens.length <= limitTokens ? "limit-ok" : "limit-error"}>Tokens (limit {limitTokens}): {encodedTokens.length}</h5> */}
                    </div> : <></>}
                {userQuestion && <div className="output user-chat" style={{ whiteSpace: "pre-wrap", color: "black" }}>{userChat}</div>}
                {outputValue && <div className="output" style={{ whiteSpace: "pre-wrap", color: "black" }}>{outputValue}</div>}
            </div> : <></>}

        </div>
    );
};

export default IAInput;