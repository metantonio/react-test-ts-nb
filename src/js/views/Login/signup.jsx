import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Redirect, useHistory } from "react-router-dom";
import { Context } from "../../store/appContext";
import { makeStyles } from "@material-ui/core/styles";
import { Modal} from "@material-ui/core";
//import "./signup.css";
import stylesSignUp from "./signup.module.css";

export const Signup = () => { //Recordar cambiar nombre del componente aquí
  const { store, actions } = useContext(Context);
  const history = useHistory("");
  const layoutURLTabla = "/tabla-usuarios"; //url del front-end a la tabla a la cual regresar
  const urlRegister = "/signup"; //url del backend
  const [jRUsuario, setJRUsuario] = useState("Username"); //la primera letra del estado debe estar en minúscula
  const [jRClave, setJRClave] = useState("Password");
  const [jRNumEmpleado, setJRNumEmpleado] = useState(99999);
  const [jRCedula, setJRCedula] = useState("Cédula");
  const [jRNombre, setJRNombre] = useState("Name");
  const [jREmail, setJREmail] = useState("Email");
  const [lastname, setLastName] = useState("Lastname")
  const [jRNacionalidad, setJRNacionalidad] = useState("Nacionalidad");
  const [jREjecutivo, setJREjecutivo] = useState(0);
  const [jRMontoAut, setJRMontoAut] = useState(0);
  const [jRIdioma, setJRIdioma] = useState("espanol");
  const [jRDirIp, setJRDirIp] = useState("aquí iría la IP");
  const [recarga, setRecarga] = useState(false)
  const [tradersCod2, setTradersCod2] = useState([]);
  const [sociosCod2, setSociosCod2] = useState([]);
  const [birthdate, setBirthdate] = useState(new Date())
  const [phone, setPhone] = useState("")
  const opciones = [{ nombre: "Venezolano" },]; //opciones del dropdown
  const [opcionDropdown1, setOpcionDropdown1] = useState("Masculino"); //estado de los cambios del dropdown
  const [modalVentana, setModalVentana] = useState(false);
  const abrirCerrarModal = () => {
    setModalVentana(!modalVentana);
  };
  const [variableEstado, setVariableEstado] = useState({ JRUsuario: "" });
  const [eleccionDrop, setEleccionDrop] = useState("Select")
  const [permisosDrop, setPermisosDrop] = useState([]);
  const [perfilDrop, setPerfilDrop] = useState([]);
  const [showPass, setShowPassword] = useState(true);  //estado para mostrar y ocultar password
  const togglePasswordVisiblity = () => {
    const { isPasswordShown } = showPass;
    setShowPassword({ isPasswordShown: !isPasswordShown });
  };
  const { isPasswordShown } = showPass;
  const genderList = ["Male", "Female"]

  useEffect(() => {
    //await actions.getCtl();
    const cargaDatos = async () => {
      let listaPromise = actions.getGenerico("/tablas/alldata", {
        RTCompania: store.user.JRCompaniaAut[0],
      }); //editar esta Linea

      let listaPerfilesPromise = actions.getGenerico("/perfiles/alldata", {
        Compania: store.user.JRCompaniaAut[0],
      }); //editar esta Linea
      //console.log(listaPerfiles)

      let listaStatusPromise = actions.getGenerico("/tablas/allespecifico2", {
        RTCompania: store.user.JRCompaniaAut[0],
        RTCodigo: "STATUS",
      }); //editar esta Linea

      let [lista, listaPerfiles, listaStatus] = await Promise.all([listaPromise, listaPerfilesPromise, listaStatusPromise])
      store.tablas = lista; //editar esta línea
      setPerfilDrop(listaPerfiles);
    }
    //cargaDatos()
  }, [])

  const volverLogin = () => {
    actions.logOut();
    return history.push("/");
  };

  /* PERFILES SELECCION*/
  const dropPerfiles = (campo) => {
    return (
      <span className="d-flex flex-nowrap dropwdowncustom my-0 mx-0 px-0">
        <div className="dropdown justify-content-center align-items-center">
          <button
            type="button"
            className="btn btn-primary dropdown-toggle btn-sm h-76"
            data-bs-toggle="dropdown"
          >
            {eleccionDrop}
          </button>
          <ul className="dropdown-menu" style={{ height: "180px", overflow: "auto" }}>
            {perfilDrop.map((opcion, index) => {
              //console.log(opcion.nombre);
              return (
                <li
                  className="dropdown-item"
                  key={index}
                  onClick={(e) => {
                    setEleccionDrop(opcion.Identificacion)
                    setPermisosDrop(opcion.Permisos)
                    setVariableEstado((prevState) => ({
                      ...prevState,
                      ["JRPrograma"]: opcion.Permisos,
                      ["JRUsuModelo"]: opcion.Identificacion,
                    }));
                    console.log(opcion.Permisos);
                  }}
                >
                  {opcion.Identificacion}
                </li>
              );
            })}
          </ul>
        </div>
      </span>
    )
  }

  const dropGender = (campo) => {
    return (
      <span className="d-flex flex-nowrap dropwdowncustom my-0 mx-0 px-0">
        <div className="dropdown justify-content-center align-items-center">
          <button
            type="button"
            className="btn btn-primary dropdown-toggle btn-sm h-76"
            data-bs-toggle="dropdown"
          >
            {eleccionDrop}
          </button>
          <ul className="dropdown-menu" style={{ overflow: "auto", inset: "30px auto auto 0px" }}>
            {genderList.map((opcion, index) => {
              //console.log(opcion.nombre);
              return (
                <li
                  className="dropdown-item"
                  key={index}
                  onClick={(e) => {
                    setEleccionDrop(opcion)
                  }}
                >
                  {opcion}
                </li>
              );
            })}
          </ul>
        </div>
      </span>
    )
  }


  const useStyles = makeStyles((theme) => ({
    modal2: {
      position: "relative",
      display: "inline-block",
      justifyContent: "center",
      width: 600,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflow: "auto",
    },
  }));
  const styles = useStyles();

  //En bodyModal modal cambiar el nombre a mostrar
  const bodyModal = (
    <div className={styles.modal2} id="modal2">
      <p>Successfuly registered: {jRUsuario}</p>
      <div align="right">
        <button className="btn btn-outline-success mx-2">
          <Link className="subrayado" to={layoutURLTabla}>Go back to the users list</Link>
        </button>
        <button className="btn btn-outline-success" onClick={() => abrirCerrarModal()}>Register another user</button>
      </div>
    </div>
  );

  const completarRegistro = async (e) => {
    //Validación de data
    e.preventDefault();
    alert("Accept to Register")

    let data = new FormData(e.target)

    if (
      jRUsuario == "" ||
      jRClave == "" ||
      jRCedula == "" ||
      jRNombre == "" ||
      /* jRNacionalidad == "" || */
      (jREmail.includes("@") == false)
    ) {
      return alert("There are field needed to fill");
    }

    //mejor enviar el objeto directamente:
    let response = await actions.useFetch(urlRegister, {
      username: jRUsuario,
      password: jRClave,
      name: jRNombre,
      email: jREmail.toLowerCase(),
      gender: eleccionDrop,
      lastname: lastname,
      birthday: birthdate,
      phone: phone
    }, "POST");
    //console.log(response.status);
    //typeof(response.status);
    if (response.ok) {
      //console.log(response.status);
      alert("Registered successfully");
      setJRCedula("Cédula")
      setJRClave("Password")
      setJRDirIp("")
      setJREmail("email")
      setJRIdioma("")
      setJRUsuario("Nombre de Usuario")
      setJRNacionalidad("Nacionalidad")
      setJRNombre("Nombre Completo")
      setJRNumEmpleado("Número de Empleado")
      store.opcionesIndex[7] = "Seleccionar"
      document.getElementById("form-register").reset(); //forma correcta de resetear FormData
      history.push("/")
      //abrirCerrarModal();
      //setRecarga(!recarga)
    } else {
      alert("Error, try again");
      actions.getCtl();
    }
    console.log(response);
  };

  return (
    <div>
      <>
        <form onSubmit={(e) => completarRegistro(e)} id="form-register">
          {/*Título*/}


          <div className={`${stylesSignUp.page_wrapper} ${stylesSignUp.bg_gra_02} ${stylesSignUp.p_t_130} ${stylesSignUp.p_b_100} ${stylesSignUp.font_poppins}`}>
            <div className={`${stylesSignUp.wrapper} ${stylesSignUp.wrapper__w680}`}>
              <div className={`${stylesSignUp.card} ${stylesSignUp.card_4}`}>
                <div className={`${stylesSignUp.card_body}`}>
                  <h2 className={`${stylesSignUp.title}`}>User Registration Form</h2>

                  <div className={`row ${stylesSignUp.row_space}`}>
                    <div className="col-sm-12 col-md-6">
                      <div className={`${stylesSignUp.input_group}`}>
                        <label className={`${stylesSignUp.label}`}>First Name</label>
                        <input className={`${stylesSignUp.input__style_4}`} type="string"
                          placeholder={jRNombre}
                          //required="required"
                          onChange={(e) => setJRNombre(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className={`${stylesSignUp.input_group}`}>
                        <label className={`${stylesSignUp.label}`}>Last Name</label>
                        <input className={`${stylesSignUp.input__style_4}`} type="string"
                          placeholder={lastname}
                          //required="required"
                          onChange={(e) => setLastName(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className={`row ${stylesSignUp.row_space}`}>
                    <div className="col-sm-12 col-md-6">
                      <div className={`${stylesSignUp.input_group}`}>
                        <label className={`${stylesSignUp.label}`}>Username</label>
                        <input className={`${stylesSignUp.input__style_4}`}
                          type="string"
                          name="usuario"
                          placeholder={jRUsuario}
                          //required="required"
                          onChange={(e) => setJRUsuario(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className={`${stylesSignUp.input_group} row d-flex`}>
                        <label className={`${stylesSignUp.label}`}>Password</label>
                        <div className="col d-flex align-items-center">
                          <input className={`${stylesSignUp.input__style_4}`} 
                            type={isPasswordShown ? "text" : "password"}
                            placeholder={jRClave}
                            required="required"
                            onChange={(e) => setJRClave(e.target.value)} />
                          <i
                            className="fa fa-eye password-icon"
                            onClick={togglePasswordVisiblity}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`row ${stylesSignUp.row_space}`}>
                    <div className="col-sm-12 col-md-6">
                      <div className={`${stylesSignUp.input_group} row d-flex`}>
                        <label className={`${stylesSignUp.label}`}>Birthday</label>
                        <div className={`${stylesSignUp.input_group_icon}`}>
                          <input className={`${stylesSignUp.input__style_4} js-datepicker`}  type="date"
                            placeholder={birthdate}
                            //required="required"
                            onChange={(e) => setBirthdate(e.target.value)} />
                          <i className="zmdi zmdi-calendar-note input-icon js-btn-calendar"></i>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className={`${stylesSignUp.input_group} row d-flex`}>
                        <label className={`${stylesSignUp.label}`}>Gender (Optional)</label>
                        <div className="p-t-10">
                          {dropGender("JRPrograma")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`row ${stylesSignUp.row_space}`}>
                    <div className="col-sm-12 col-md-6">
                      <div className={`${stylesSignUp.input_group} row`}>
                        <label className={`${stylesSignUp.label}`}>Email</label>
                        <input
                          className={`${stylesSignUp.input__style_4}`} 
                          type="email"
                          placeholder={jREmail}
                          required="required"
                          onChange={(e) => setJREmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className={`${stylesSignUp.input_group} row`}>
                        <label className={`${stylesSignUp.label}`}>Phone Number (Optional)</label>
                        <input className={`${stylesSignUp.input__style_4}`}  type="string"
                          placeholder={phone}
                          //required="required"
                          onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${stylesSignUp.p_t_15}`} >
                    <button
                      className={`${stylesSignUp.btn__radius_2} ${stylesSignUp.btn__blue} btn btn-primary`}
                      name="Completar Registro"
                      label="Completrar Registro"
                      type="submit">Submit</button>
                  </div>

                </div>
              </div>
            </div>
            <Link
              className={`${stylesSignUp.btn__radius_2} btn btn-danger`}
              to="/"
            >Go back</Link>
          </div>
        </form>

        <Modal open={modalVentana} onClose={abrirCerrarModal}>
          {bodyModal}
        </Modal>
      </>
    </div>
  );
};
