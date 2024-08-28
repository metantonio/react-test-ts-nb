import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";
import ImgLog from "../../../img/logo.png"
//import "./navbar.css"
import styles from "./navbar.module.css";

export const Navbar = () => {
    const { store, actions } = useContext(Context)
    const [collapse, setCollapse] = useState(false)

    //At the moment MENU is not multi-level so i can resolve in this way
    //thinking that it could be an API where menu options are cuztomizables and could change depending of user permissions
    const [menuOptions, setMenuOptions] = useState([        
        {
            name: "ABOUT US",
            url: "/menu#Footer1_0",
            permission: true,
        },
    ])

    const [products, setProducts] = useState([
        {
            name: "I-Q GPT",
            url: "/iq-gpt",
            permission: true,
        },        
        {
            name: "I-Q Example",
            url: "/iq-example",
            permission: true,
            sub1: [
                {
                    name: "Sub-level 1",
                    url: "/iq-example-sub-1",
                    permission: store.visualizacion,
                },
                {
                    name: "Sub-level 2",
                    url: "/iq-example-sub-2",
                    permission: store.visualizacion,
                }                
            ]
        },        
        
        
        
    ])

    const [admin, setAdmin] = useState([
        {
            name: "USERS",
            url: "/menu",
            permission: store.visualizacionSIS,
            sub1: [
                {
                    name: "User Profiles",
                    url: "/perfiles/usuarios",
                    permission: store.visualizacionSIS,
                },
                {
                    name: "List of Users",
                    url: "/tabla-usuarios",
                    permission: store.visualizacionSIS,
                },
                {
                    name: "Register users",
                    url: "/usuarios/registro",
                    permission: store.crearUSR,
                },
                {
                    name: "Log Admin",
                    url: "/logAdmin",
                    permission: store.visualizacionSIS,
                }
            ]
        },
        {
            name: "SYSTEM TABLES",
            url: "/menu",
            permission: store.visualizacionSIS,
            sub1: [
                {
                    name: "System's Tables",
                    url: "/tablas",
                    permission: store.visualizacionSIS,
                },
                {
                    name: "Permission Table",
                    url: "/roles",
                    permission: store.visualizacionSIS,
                },
                {
                    name: "General System Parameters",
                    url: "/ctlSistema",
                    permission: store.visualizacionSIS,
                }
            ]
        }
    ])

    const [userOptions, setUserOptions] = useState([
        {
            name: "ACCOUNT",
            url: "/account",
            permission: true,
            /* sub1: [
                {
                    name: "Change Password",
                    url: "/update-password",
                    permission: true,
                }
            ] */
        }        
    ])

    const nestedNavbarLinks = (arrayMenu) => {
        return (arrayMenu && arrayMenu.length > 0 ?
            <>
                {arrayMenu.map((item, index) => {
                    /* return (
                        <li key={index}>
                            <Link className="dropdown-item" to={item.url}>
                                <div className="nav-link" aria-current="page">{item.name}</div>
                            </Link>
                        </li>) */
                    if (!item.sub1) {
                        return (
                            <li key={`${index}-${item.name}`}>
                                {/* {item.permission ? */}
                                    <Link className="dropdown-item" to={item.url}>
                                        <div className={styles.nav_link} aria-current="page">{item.name}</div>
                                    </Link>
                                    {/* :
                                    <></>} */}
                            </li>)
                    } else {
                        return (
                            <div key={`${index}-${item.name}`}>
                                <a className="dropdown-item d-flex justify-content-center fw-bolder" href="#" id="offcanvasNavbarDropdown2" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" role="button">
                                    {item.name} &raquo;
                                </a>
                                <ul className="dropdown-menu dropdown-submenu dropdown-sub1" style={{ zIndex: "9999" }} aria-labelledby="offcanvasNavbarDropdown2">
                                    {item.sub1 && item.sub1.length > 0 ?
                                        <>{item.sub1.map((element, index2) => {
                                            return (
                                                /* element.permission ? */
                                                    <li className="d-flex justify-content-center" key={`${element.name}-${index2}`}>
                                                        <Link className="dropdown-item d-flex justify-content-center fw-bolder text-wrap text-center item-menu-name" to={element.url}>
                                                            {element.name}
                                                        </Link>
                                                    </li> 
                                                   /*  : <></> */
                                            )


                                        })}</>
                                        : <></>}
                                </ul>
                            </div>)
                    }
                })}
            </>
            :
            <></>)

    }

    useEffect(() => { }, [collapse, menuOptions, store])

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light align-items-center">
            <div className={styles.container_fluid}>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#navbarTogglerDemo01" aria-controls="offcanvasNavbar" aria-expanded="false" aria-label="Toggle navigation" onClick={() => { setCollapse(true) }}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="justify-content-center align-self-center m-auto">
                    <Link to="/landing">
                        <div className="navbar-brand"><img src={ImgLog} width="150px"></img></div>
                    </Link>
                </div>
                <div className={`offcanvas offcanvas-start scroller-nav`} id="navbarTogglerDemo01" tabIndex="-1" aria-labelledby="offcanvasNavbarLabel">
                    <div className={`container-fluid d-flex ${!collapse ? "flex-row" : "flex-column"} justify-content-between`}>
                        <div className="offcanvas-header border-bottom border-dark cabeza">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">MENU</h5>
                            <button type="button" className="navbar-toggler-icon text-center" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { setCollapse(false) }}></button>
                        </div>
                        <div className={`offcanvas-body nav-link d-flex align-items-center ${!collapse ? "flex-row" : "flex-column"}`}>
                            {nestedNavbarLinks(menuOptions)}
                            <li className="nav-item dropdown">
                                <div className="nav-link dropdown-toggle fw-bold" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    PRODUCT SOLUTIONS
                                </div>
                                <ul className="dropdown-menu dropdown-menu-lg-end" style={{ zIndex: "9999" }} aria-labelledby="navbarDropdownMenuLink">
                                    {nestedNavbarLinks(products)}
                                </ul>
                            </li>
                        </div>
                        <div className={`offcanvas-body d-flex align-items-center justify-content-center ${!collapse ? "flex-row" : "flex-column"}`}>
                            {store.visualizacionSIS ? <>
                                <li className="nav-item dropdown">
                                    <div className="nav-link dropdown-toggle fw-bold" href="#" id="navbarDropdownMenuLink1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        ADMIN
                                    </div>
                                    <ul className="dropdown-menu dropdown-menu-lg-end" style={{ zIndex: "9999" }} aria-labelledby="navbarDropdownMenuLink1">
                                        {nestedNavbarLinks(admin)}
                                    </ul>
                                </li>
                            </> : <></>
                            }

                            {store.logOutConfirmation ?
                                <>
                                    <li className="nav-item dropdown">
                                        <div className="nav-link dropdown-toggle fw-bold" href="#" id="navbarDropdownMenuLink2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            ACCOUNT
                                        </div>
                                        <ul className="dropdown-menu dropdown-menu-lg-end" style={{ zIndex: "9999" }} aria-labelledby="navbarDropdownMenuLink2">
                                            {nestedNavbarLinks(userOptions)}
                                        </ul>
                                    </li>
                                    <div className="nav-item align-items-center" data-bs-dismiss="offcanvas" aria-label="Close">

                                        <a
                                            className={styles.nav_link}
                                            type="button"
                                            aria-current="page"
                                            onClick={() => actions.logOut()}
                                        >
                                            LOG OUT
                                        </a>

                                    </div>
                                </>
                                :
                                <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
