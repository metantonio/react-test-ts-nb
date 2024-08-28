import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../../store/appContext.js";
import styles from "./main.module.css";
import Swal from 'sweetalert2';

//import puppeteer from 'puppeteer-extra';
//import fs from 'fs';


import WithAuth from '../../components/Auth/withAuth.js';

const Twitter = () => {

    function timeout(miliseconds) {
        return new Promise((resolve) => {
            setTimeout(() => { resolve() }, miliseconds)
        })
    }

    return (<>
        <div className={`${styles.main_container}`}>
            Twitter
            <button>Initiate</button>
        </div>
    </>)
}

export default Twitter;
//export default WithAuth(MyTestComponent);