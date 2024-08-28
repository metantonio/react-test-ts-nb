import React, { useState, useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { Redirect, useHistory } from "react-router-dom";
import logo from "../../../img/logo.png";
import imgbg from "../../../img/bg.jpg";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import styles from "./login.module.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Auth from "./googleauth.jsx";

const Login = () => {
    const { store, actions } = useContext(Context);
    const history = useHistory("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [qrCode, setQrCode] = useState(false)
    const login = async e => {
        e.preventDefault();
        const succes = await actions.login(userName, password);
        if (succes) {
            setQrCode(store.userpoker.qr_image)
            Swal.fire({
                icon: 'success',
                title: `Welcome: ${store.userpoker.email}`,
                showConfirmButton: false,
                timer: 2000
            })
            history.push("/main");
        }
    };
    const signup = async e => {
        e.preventDefault();
        //const succes = await actions.login_qr_user(userName, password);
        history.push("/signup-iq");
    };
    const reset = async (e) => {
        e.preventDefault();
        if (userName.includes("@") == false) {
            alert("Invalid email");
            return
        }
        let data = {
            JREmail: userName
        }
        if (userName == "") {
            alert("Write your email");
            return
        }
        console.log("validating")
        const response = await fetch(process.env.BASE_URL2 + "/new_password_poker_user", {
            method: "PUT",
            //mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ email: userName })
        });

        let respuesta = await response.json();
        Swal.fire({
            icon: 'danger',
            title: `Error: ${respuesta.message}`,
            showConfirmButton: true,
            timer: 2000
        })
        return respuesta;
    };
    const [showPass, setShowPassword] = useState(true);

    const togglePasswordVisiblity = () => {
        const { isPasswordShown } = showPass;
        setShowPassword({ isPasswordShown: !isPasswordShown });
    };
    const { isPasswordShown } = showPass;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    return (
        <div className={styles.login} style={{ backgroundImage: `url(${imgbg})` }}>
            {!qrCode ? <div className={styles.login__container} >
                <section className={styles.ftco_section} >
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="d-flex text-center mb-5">
                                <h2 className={styles.heading_section} style={{ border: "none" }}><Link to="/">
                                    <img src={logo} className="login__img" alt="" />
                                </Link></h2>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-12 col-lg-12">
                                <div className={`${styles.login_wrap} p-0`}>
                                    <a className={`${styles.login_title} mb-4 text-center`} onClick={signup}>Have an account?</a>
                                    <form action="#" className="signin-form">
                                        <div className={styles.form_group}>
                                            <input type="text" className={styles.form_control} placeholder="Email/Username"
                                                id="email"
                                                name="email"
                                                onChange={e => setUserName(e.target.value)} required />
                                        </div>
                                        <div className={`${styles.form_group} mt-2`}>
                                            <input
                                                className={styles.form_control}
                                                placeholder="Password"
                                                type={isPasswordShown ? "text" : "password"}
                                                id="passlogin"
                                                onKeyPress={(event) => {
                                                    if (event.key === "Enter") {
                                                        login(event)
                                                    }
                                                }}
                                                onChange={e => {
                                                    setPassword(e.target.value)
                                                }} required />
                                            {/* <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password"></span> */}
                                            <span toggle="#password-field" className={`fa fa-fw fa-eye ${styles.field_icon} toggle-password`} onClick={togglePasswordVisiblity}></span>
                                        </div>
                                        <div className={`${styles.form_group} mt-2`}>
                                            {/* <button type="button" className="form-control btn btn-primary submit px-3" onClick={login}>Sign In</button> */}
                                            <button type="button" className={`${styles.btn} ${styles.btn_primary} submit px-3 ${styles.form_control}`} onClick={login}>Sign In</button>
                                        </div>
                                        <div className={`${styles.form_group} ${styles.d_md_flex}`}>
                                            <div className={`${styles.w_50}`}>
                                                <label className={`${styles.checkbox_wrap} ${styles.checkbox_primary} mt-2`}>Remember Me
                                                    <input type="checkbox" checked />
                                                    <span className={`${styles.checkmark}`}></span>
                                                </label>
                                            </div>
                                            <div className={`${styles.w_50} ${styles.text_md_right}`}>
                                                <Link to="/forgot-password" onClick={reset}>Forgot Password</Link>
                                            </div>
                                        </div>
                                    </form>
                                    <p className={`${styles.w_100} text-center`}>&mdash; Or Sign In With &mdash;</p>
                                    <div className="row d-flex text-center">
                                        <div className={styles.sign_in_buttons}>
                                            <div className={styles.google_div}>
                                                <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
                                                    <Auth></Auth>
                                                </GoogleOAuthProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
                :
                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />}
        </div>
    );
}
export default Login;
