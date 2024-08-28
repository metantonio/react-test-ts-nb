import React, { useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import Swal from 'sweetalert2';
import ListFiles from './listFiles.jsx';
import Prompt from './prompt.jsx';
import PromptLLM from './promptLLM.jsx';
import WithAuth from '../../components/Auth/withAuth.js';
import GroupFiles from './groupFiles.jsx';
import WidgetTech1 from './widget1.jsx';
import WidgetTech5 from './widget5.jsx';
import WidgetLateral from './widget0.jsx';
import WidgetHistorial from './historial.jsx';

const IQgpt = () => {
    const { store, actions } = useContext(Context)
    const [techMode, setTechMode] = useState(false)

    return (
        <>
            <div className={techMode ? "" : ""}>
                <div className={techMode ? "" : ""}>
                    <div id="layout-tutorial" className={techMode ? styles.container : styles.container}>
                        <div id="magen-l" className={styles.margenl}>
                            <WidgetHistorial />
                            {localStorage.getItem("role") == "Tech" ? <button className={techMode ? styles.button_success : styles.button_danger} onClick={e => { setTechMode(!techMode) }} style={{ lineHeight: "20px" }}>{techMode ? "Tech Mode Activated" : "Tech Mode"}</button> : ""}
                            {localStorage.getItem("role") == "Tech" ? <Link className={styles.button_approve} style={{ width: "100%" }} to="/iq-campaign">IQ-CAMPAIGN</Link> : ""}
                            {localStorage.getItem("role") == "Tech" ? <Link className={styles.button_approve} style={{ width: "100%" }} to="/iq-sms">IQ-SMS</Link> : ""}
                            {localStorage.getItem("role") == "Tech" ? <Link className={styles.button_approve} style={{ width: "100%" }} to="/iq-email">IQ-EMAIL</Link> : ""}
                            {localStorage.getItem("role") == "Tech" ? <Link className={styles.button_approve} style={{ width: "100%" }} to="/iq-ninja">IQ-NINJA</Link> : ""}
                        </div>
                        <h1 id="qlxgpt" className={styles.qlxgpt}>
                            QLX GPT
                        </h1>
                        <ListFiles />
                        <GroupFiles />
                        {store.promptLLM ? <PromptLLM /> : <Prompt />}
                        {techMode && localStorage.getItem("role") == "Tech" ? <div id="magen-r" className={styles.margenr}>
                            <WidgetLateral />
                            {/* <WidgetTech5 /> */}
                        </div> : <div id="magen-r" className={styles.margenr}></div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default WithAuth(IQgpt);