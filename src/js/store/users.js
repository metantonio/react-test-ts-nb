import Swal from "sweetalert2";

export const userStore = {
    user: {JRCompaniaAut:["QLX"]},
    userqr: {},
    users: [],
    logOutConfirmation: false,
    visualizacion: false,
    visualizacionTOCLI: false,
    visualizacionTRA: false,
    visualizacionTAS: false,
    visualizacionTRN: false,
    visualizacionORD: false,
    visualizacionBNC: false,
    visualizacionDIV: false,
    visualizacionUSR: false,
    visualizacionOPE: false,
    visualizacionCON: false,
    visualizacionREP: false,
    visualizacionSIS: false,
    visualizacionCaja: false,
    crearCLI: false,
    editarCLI: false,
    editarStatusCLI: false,
    deleteCLI: false,
    crearUSR: false,
    editarUSR: false,
    deleteUSR: false,
    crearTRA: false,
    editarTRA: false,
    editarCaja: false,
    deleteTRA: false,
    crearTAS: false,
    editarTAS: false,
    deleteTAS: false,
    crearBNC: false,
    editarBNC: false,
    deleteBNC: false,
    crearDIV: false,
    editarDIV: false,
    deleteDIV: false,
    deleteCaja: false,
    crearOPE: false,
    editarOPE: false,
    deleteOPE: false,
    crearCON: false,
    editarCON: false,
    deleteCON: false,
    tesoroNAC: false,
    tesoroDIV: false,
    editarCUM: false,
    auth: "",
    notificaciones: {},
    notificacionesPush: [],
}

export function userActions(getStore, getActions, setStore) {
    const BASE_URL = process.env.BASE_URL;
    const BASE_URL2 = process.env.BASE_URL2;
    return {
        saveUserData: (user, google = null) => {
            setStore({ ...store, user: user, logOutConfirmation: true });
            //localStorage.setItem("token", user.jwt);
            //localStorage.setItem("id", user.id);
            localStorage.setItem("username", user.username);
            localStorage.setItem("logOutConfirmation", true);
            //localStorage.setItem("picture", user.picture);
            if (google) {
                localStorage.setItem("name", user.name);
            } else {
                localStorage.setItem(
                    "name",
                    user.name.charAt(0).toUpperCase() +
                    user.name.slice(1) +
                    " " +
                    user.last_name.charAt(0).toUpperCase() +
                    user.last_name.slice(1)
                );
            }
        },
        getUsers: async () => {
            let url = BASE_URL + "/usuarios/alldata";
            let actions = getActions();
            let store = getStore();
            let token = localStorage.getItem("token");
            let data = {
                JRCompania: store.user.JRCompania,
            }
            try {
                let response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": token },
                    body: JSON.stringify(data)
                });
                let respuesta = await response.json();
                //console.log("Información obtenida");
                //console.log("getUsers: ", respuesta);
                setStore({ ...store, users: respuesta });
                //console.log("check users: ",store.users)
                return respuesta;
            } catch (error) {
                console.log(error);
            }

            return true;
        },
        checkUser: async () => {
            let url = BASE_URL + "/usuarios/check";

            let actions = getActions();
            let store = getStore();
            let login_data = {};
            let atCounter = false;
            let user_name = localStorage.getItem("username");
            let password = localStorage.getItem("password");
            let token = localStorage.getItem("token");

            for (let i = 0; i < user_name.length; i++) {
                if (atCounter) {
                    break;
                }
                if (user_name.charAt(i) == "@") {
                    atCounter = true;
                }
            }

            if (!atCounter) {
                login_data = {
                    username: user_name,
                    password: password
                };
            } else if (atCounter) {
                login_data = {
                    username: user_name,
                    password: password
                };
            }
            let response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": token },
                body: JSON.stringify(login_data)
            });
            let userdata = await response.json();



            //actions.saveUserData(user);
            if (response.ok) {
                //let response2 = actions.checkUser();
                if (userdata.authorization == "Autorización validada QLX") {
                    setStore({ ...store, auth: userdata });
                    store.user.JRPrograma = userdata.JRPrograma;
                    actions.permisos("CLI001", "visualizacion");
                    actions.permisos("CLI005", "visualizacionTOCLI");
                    actions.permisos("TRA001", "visualizacionTRA");
                    actions.permisos("TAS001", "visualizacionTAS");
                    actions.permisos("TRN001", "visualizacionTRN");
                    actions.permisos("ORD001", "visualizacionORD");
                    actions.permisos("BNC001", "visualizacionBNC");
                    actions.permisos("DIV001", "visualizacionDIV");
                    actions.permisos("USR001", "visualizacionUSR");
                    actions.permisos("SIS001", "visualizacionSIS");
                    actions.permisos("REP001", "visualizacionREP");
                    actions.permisos("OPE001", "visualizacionOPE");
                    actions.permisos("CON001", "visualizacionCON");
                    actions.permisos("CAJA001", "visualizacionCaja");

                    actions.permisos("CLI002", "crearCLI");
                    actions.permisos("USR002", "crearUSR");
                    actions.permisos("TRA002", "crearTRA");
                    actions.permisos("OPE002", "crearOPE");
                    actions.permisos("DIV002", "crearDIV");
                    actions.permisos("BNC002", "crearBNC");
                    actions.permisos("TRN002", "crearTRN");
                    actions.permisos("ORD002", "crearORD");
                    actions.permisos("TAS002", "crearTAS");
                    actions.permisos("CON002", "crearCON");
                    actions.permisos("REP002", "crearREP");

                    actions.permisos("CLI003", "editarCLI");
                    actions.permisos("CLI006", "editarStatusCLI");
                    actions.permisos("USR003", "editarUSR");
                    actions.permisos("TRA003", "editarTRA");
                    actions.permisos("OPE003", "editarOPE");
                    actions.permisos("DIV003", "editarDIV");
                    actions.permisos("BNC003", "editarBNC");
                    actions.permisos("TRN003", "editarTRN");
                    actions.permisos("ORD003", "editarORD");
                    actions.permisos("TAS003", "editarTAS");
                    actions.permisos("CON003", "editarCON");
                    actions.permisos("REP003", "editarREP");
                    actions.permisos("CUM001", "editarCUM");
                    actions.permisos("CAJA003", "editarCaja");

                    actions.permisos("CLI004", "deleteCLI");
                    actions.permisos("USR004", "deleteUSR");
                    actions.permisos("TRA004", "deleteTRA");
                    actions.permisos("OPE004", "deleteOPE");
                    actions.permisos("DIV004", "deleteDIV");
                    actions.permisos("BNC004", "deleteBNC");
                    actions.permisos("TRN004", "deleteTRN");
                    actions.permisos("ORD004", "deleteORD");
                    actions.permisos("TAS004", "deleteTAS");
                    actions.permisos("CON004", "deleteCON");
                    actions.permisos("REP004", "deleteREP");
                    actions.permisos("CAJA004", "deleteCaja");

                    actions.permisos("TES001", "tesoroNAC");
                    actions.permisos("TES002", "tesoroDIV");
                    return true;
                } else {
                    //actions.logOut();
                    return false;
                }
            } else {
                //actions.logOut();
                if (localStorage.getItem('token') != "" && localStorage.getItem('token') != undefined && localStorage.getItem('token')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ended Session',
                        text: 'Session has expired',
                        footer: '<a href="">Why do I have this issue?</a>'
                    })
                }

                return false;
            }
        },
        permisos: async (permiso, variableEntidad) => {
            let store = getStore();
            let usuario = await store.user;

            let autorizacion = false

            for (let program of usuario.JRPrograma) {
                if (program.JRProgAut == permiso && program.JRTipoAut) {
                    //console.log(program.JRProgAut);
                    autorizacion = true;
                    setStore({ ...store, [variableEntidad]: autorizacion });
                    return autorizacion;
                }
            }
            setStore({ ...store, [variableEntidad]: false });
            return autorizacion;
        },
        verificarPermiso: async (permiso) => {
            let store = getStore();
            for (let program of store.user.JRPrograma) {
                if (program.JRProgAut == permiso && program.JRTipoAut) {
                    //console.log(program.JRProgAut);
                    return true;
                }
            }
            return false;
        },
        changePassword: async (endpoint, data) => {
            let url = BASE_URL + endpoint;
            let actions = getActions();
            let store = getStore();
            try {
                let response = await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("token") },
                    body: JSON.stringify(data)
                });
                let respuesta = await response.json();

                return respuesta;
            } catch (error) {
                console.log(error);
            }

            return true;
        },
        refresh: async () => {
            let actions = getActions();
            let store = getStore();
            setStore({
                user: {},
                users: [],
                logOutConfirmation: false,
                logOutConfirmationpoker: false,
                visualizacion: false,
                visualizacionTOCLI: false,
                visualizacionTRA: false,
                visualizacionTAS: false,
                visualizacionTRN: false,
                visualizacionORD: false,
                visualizacionBNC: false,
                visualizacionDIV: false,
                visualizacionUSR: false,
                visualizacionOPE: false,
                visualizacionCON: false,
                visualizacionREP: false,
                visualizacionSIS: false,
                visualizacionCaja: false,
                crearCLI: false,
                editarCLI: false,
                editarStatusCLI: false,
                deleteCLI: false,
                crearUSR: false,
                editarUSR: false,
                deleteUSR: false,
                crearTRA: false,
                editarTRA: false,
                editarCaja: false,
                deleteTRA: false,
                crearTAS: false,
                editarTAS: false,
                deleteTAS: false,
                crearBNC: false,
                editarBNC: false,
                deleteBNC: false,
                crearDIV: false,
                editarDIV: false,
                deleteDIV: false,
                deleteCaja: false,
                crearOPE: false,
                editarOPE: false,
                deleteOPE: false,
                crearCON: false,
                editarCON: false,
                deleteCON: false,
                tesoroNAC: false,
                tesoroDIV: false,
                editarCUM: false,
                auth: "",
                notificaciones: {},
                notificacionesPush: [],
            });
            localStorage.setItem("password", "");
            localStorage.setItem("id", "");
            localStorage.setItem("username", "");
            localStorage.setItem("logOutConfirmation", "");
            localStorage.setItem("picture", "");
        },
        login_qr_user: async (user_name, password) => {
            let url = BASE_URL2 + "/login-qr-user";
            let actions = getActions();
            let store = getStore();
            let login_data = {};
            let atCounter = false;

            for (let i = 0; i < user_name.length; i++) {
                if (atCounter) {
                    break;
                }
                if (user_name.charAt(i) == "@") {
                    atCounter = true;
                }
            }

            if (!atCounter) {
                login_data = {
                    username: user_name,
                    password: password
                };
            } else if (atCounter) {
                login_data = {
                    username: user_name,
                    password: password
                };
            }
            let response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login_data)
            });
            let userdata = await response.json();

            //actions.saveUserData(user);
            if (response.ok) {
                //let response2 = actions.checkUser();
                if (response.ok) {
                    setStore({ ...store, userqr: userdata });
                    setStore({ ...store, logOutConfirmation: true });
                    localStorage.setItem("usernameqr", userdata.username); //revisar
                    //localStorage.setItem("password", userdata.JRClave);
                    localStorage.setItem("tokenqruser", userdata.token);
                    localStorage.setItem("logOutConfirmationqruser", true);
                    //actions.getUsers();
                    /* actions.getTablas();
                    actions.getCtl();
                    actions.checkUser(); */
                    return true;
                } else {
                    //actions.logOut();
                    alert("username or password incorrect");
                    return false;
                }
            } else {
                //actions.logOut();
                alert("username or password invalid");
                return false;
            }
        },
        login: async (user_name, password) => {
            let url = BASE_URL2 + "/login";
            let actions = getActions();
            let store = getStore();
            let login_data = {};
            let atCounter = false;

            for (let i = 0; i < user_name.length; i++) {
                if (atCounter) {
                    break;
                }
                if (user_name.charAt(i) == "@") {
                    atCounter = true;
                }
            }

            if (!atCounter) {
                login_data = {
                    username: user_name,
                    password: password
                };
            } else if (atCounter) {
                login_data = {
                    username: user_name,
                    password: password
                };
            }
            let response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login_data)
            });
            let userdata = await response.json();

            //actions.saveUserData(user);
            if (response.ok) {
                //let response2 = actions.checkUser();
                if (response.ok) {
                    setStore({ ...store, userpoker: userdata });
                    setStore({ ...store, logOutConfirmationpoker: true });
                    setStore({ ...store, logOutConfirmation: true });
                    localStorage.setItem("user", userdata.email); //revisar
                    localStorage.setItem("role", userdata.role); //revisar
                    localStorage.setItem("sms_campaign_active", userdata.sms_campaign_active); //revisar
                    localStorage.setItem("email_campaign_active", userdata.email_campaign_active);
                    //localStorage.setItem("password", userdata.JRClave);
                    localStorage.setItem("tokenpokeruser", userdata.token);
                    localStorage.setItem("token", userdata.token);
                    localStorage.setItem("namepokeruser", userdata.name);
                    localStorage.setItem("tableID", userdata["table_id"]);
                    localStorage.setItem("logOutConfirmation", true);
                    if (userdata.role != "Admin") {
                        console.log(userdata.role)
                    }
                    //actions.getUsers();
                    /* actions.getTablas();
                    actions.getCtl();
                    actions.checkUser(); */
                    return true;
                } else {
                    //actions.logOut();
                    alert("username or password incorrect");
                    return false;
                }
            } else {
                //actions.logOut();
                alert("username or password invalid");
                return false;
            }
        },
        logOut: async () => {
            let token = localStorage.getItem("token");
            let url = BASE_URL2 + "/logout";
            let response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": token },
                //body: JSON.stringify({test:"test"})
            });
            let userdata = await response.json();
            if (response.ok) {
                //alert(userdata.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Session closed successfully',
                    text: `${userdata.message}`,
                    timer: 3000,
                    showCloseButton: true,
                    position: 'center'
                })
            }
            console.log("cerrando sesión");
            setStore({
                user: {JRCompaniaAut:["QLX"]},
                users: [],
                logOutConfirmation: false,
                visualizacion: false,
                visualizacionTOCLI: false,
                visualizacionTRA: false,
                visualizacionTAS: false,
                visualizacionTRN: false,
                visualizacionORD: false,
                visualizacionBNC: false,
                visualizacionDIV: false,
                visualizacionUSR: false,
                visualizacionOPE: false,
                visualizacionCON: false,
                visualizacionREP: false,
                visualizacionSIS: false,
                visualizacionCaja: false,
                crearCLI: false,
                editarCLI: false,
                editarStatusCLI: false,
                deleteCLI: false,
                crearUSR: false,
                editarUSR: false,
                deleteUSR: false,
                crearTRA: false,
                editarTRA: false,
                editarCaja: false,
                deleteTRA: false,
                crearTAS: false,
                editarTAS: false,
                deleteTAS: false,
                crearBNC: false,
                editarBNC: false,
                deleteBNC: false,
                crearDIV: false,
                editarDIV: false,
                deleteDIV: false,
                deleteCaja: false,
                crearOPE: false,
                editarOPE: false,
                deleteOPE: false,
                crearCON: false,
                editarCON: false,
                deleteCON: false,
                tesoroNAC: false,
                tesoroDIV: false,
                editarCUM: false,
                auth: "",
                notificaciones: {},
                notificacionesPush: [],
            });
            localStorage.setItem("password", "");
            localStorage.setItem("id", "");
            localStorage.setItem("username", "");
            localStorage.setItem("role", "");
            localStorage.setItem("logOutConfirmation", "");
            localStorage.setItem("picture", "");
            localStorage.setItem("token", "");
            localStorage.setItem("tokenpokeruser", "");
            localStorage.setItem("logOutConfirmation", false);
            localStorage.setItem("sms_campaign_active", false); //revisar
            localStorage.setItem("email_campaign_active", false);

        },
        changeUserStore: async (promiseObj) => {
            let actions = getActions();
            let store = getStore();
            let response = promiseObj
            //let response = await promiseObj.json()
            console.log(response)
            setStore({ ...store, userpoker: response });
            setStore({ ...store, logOutConfirmationpoker: true });
            setStore({ ...store, logOutConfirmation: true });
            localStorage.setItem("user", response.email); //revisar
            localStorage.setItem("role", response.role); //revisar
            //localStorage.setItem("password", userdata.JRClave);
            localStorage.setItem("tokenpokeruser", response.token);
            localStorage.setItem("token", response.token);
        }
    }
}