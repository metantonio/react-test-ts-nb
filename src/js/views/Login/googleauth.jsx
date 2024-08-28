import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
/* import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton"; */
import { useGoogleLogin } from "@react-oauth/google";
import UserAvatar from "./userAvatar";
import { Redirect, useHistory } from "react-router-dom";
const BASE_URL2 = process.env.BASE_URL2
const URL_LOGIN_GOOGLE = "/google_login"
import styles from "./login.module.css";

async function getProtected() {
    let response = await fetch("/protected", {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((msg) => console.log(msg));
}
export default function Auth() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const { store, actions } = useContext(Context)
    const history = useHistory("");

    async function getUserInfo(codeResponse) {


        let temp_url = BASE_URL2 + URL_LOGIN_GOOGLE
        let response = await fetch(temp_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: codeResponse.code }),
        });

        return await response.json();
    }

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            var loginDetails = await getUserInfo(codeResponse);
            setLoggedIn(true);
            setUser(loginDetails.user);
            actions.changeUserStore(loginDetails)
            history.push("/main");
        },
    });

    const handleLogout = () => {
        getProtected();
        setLoggedIn(false);
    };

    return (
        <>
            {!loggedIn ?

                <button type="button" className={styles.google_sign_in_button} color="primary"
                    aria-label="add to shopping cart"
                    onClick={() => googleLogin()}>
                    Sign in with Google
                </button>

                :
                <UserAvatar userName={user.name} onClick={handleLogout}></UserAvatar>
            }
        </>
    );
}