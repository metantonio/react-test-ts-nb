import React, { useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import Swal from 'sweetalert2';
import WithAuth from '../../components/Auth/withAuth.js';
import GroupDB from './groupDatabases.jsx';
import Dashboard from "./dashboard.jsx"
import GroupTables from './groupTables.jsx';

const IQNinja = () => {
    const { store, actions } = useContext(Context)

    return (
        <div className={styles.container}>
            <div id="magen-l" className={styles.margenl}>
                <nav class="navbar">
                    <div class="container-fluid">
                        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" style={{backgroundColor:"#ffffffd6"}}>
                            <i class="fa fa-solid fa-bars" style={{color:"black"}}></i>
                        </button>
                        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                            <div class="offcanvas-header">
                                <h5 class="offcanvas-title text-dark" id="offcanvasNavbarLabel">Menu</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div class="offcanvas-body">
                                <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                                    <li class="nav-item">
                                        <Link className={styles.button_approve} style={{ width: "100%" }} to="/iq-gpt">IQ-GPT</Link>
                                    </li>
                                    {/* <li class="nav-item">
                                        <button className={styles.button_approve} onClick={e => { alert("test") }}>ADD DB</button>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            <h1 id="qlxgpt" className={styles.qlx_ninja}>
                IQ-NINJA
            </h1>
            <GroupDB />
            {/* <GroupTables /> */}
            <Dashboard />
            <div id="magen-r" className={styles.margenr} />
        </div>
    )
}

//export default IQNinja;
export default WithAuth(IQNinja);