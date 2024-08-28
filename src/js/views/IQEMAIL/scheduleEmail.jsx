import React, { Component, useState, useContext, useEffect, useCallback, useMemo } from "react";
import { Context } from "../../store/appContext";
import { Calendar, momentLocalizer, DateLocalizer, Views, dateFnsLocalizer } from 'react-big-calendar'
import Toolbar from 'react-big-calendar/lib/Toolbar';
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import PropTypes from 'prop-types'
import moment from "moment";
import { ContactlessTwoTone } from "@material-ui/icons";
import { Modal, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "/node_modules/react-big-calendar/lib/css/react-big-calendar.css";
//import '/node_modules/react-big-calendar/lib/sass/styles';
import styles from "./scheduleEmail.module.css";
require('moment/locale/es.js');
import WithAuth from "../../components/Auth/withAuth";
import Swal from 'sweetalert2';
import { OilBarrelTwoTone } from "@mui/icons-material";

const CustomToolbar = props => (
    <Toolbar {...props}>
        <div className="rbc-toolbar-label">{props.label}</div>
        <div className="rbc-btn-group">
            <button type="button" onClick={props.onNavigatePrev}>
                Prev
            </button>
            <button type="button" onClick={props.onNavigateNext}>
                Next
            </button>
        </div>
    </Toolbar>
);

const ScheduleEmail = ({ campaignD, setTemporalCalendar }) => {
    const urlUpdate = "/calendarnode/updateCalendar";
    const urlDelete = "/calendarnode/deleteCalendar";
    const urlCheck = "/campaign/checkCalendar";
    const { store, actions } = useContext(Context);
    const [modalMostrar, setModalMostrar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [addEvent, setAddEvent] = useState({ start: "", end: "", title: "", id: 0 });
    const [startTime, setStartTime] = useState({ name: "12:00am", hour: 0, minutes: 0 })
    const [endTime, setEndTime] = useState({ name: "11:59pm", hour: 23, minutes: 59 })
    const [elegibleTimes, setElegibleTimes] = useState([
        {
            name: "6:00am", hour: 6, minute: 0
        },
        {
            name: "6:30am", hour: 6, minute: 30
        },
        {
            name: "7:00am", hour: 7, minute: 0
        },
        {
            name: "7:30am", hour: 7, minute: 30
        },
        {
            name: "8:00am", hour: 8, minute: 0
        },
        {
            name: "8:30am", hour: 8, minute: 30
        },
        {
            name: "9:00am", hour: 9, minute: 0
        },
        {
            name: "9:30am", hour: 9, minute: 30
        },
        {
            name: "10:00am", hour: 10, minute: 0
        },
        {
            name: "10:30am", hour: 10, minute: 30
        },
        {
            name: "11:00am", hour: 11, minute: 0
        },
        {
            name: "11:30am", hour: 11, minute: 30
        },
        {
            name: "12:00pm", hour: 12, minute: 0
        },
        {
            name: "12:30pm", hour: 12, minute: 30
        },
        {
            name: "1:00pm", hour: 13, minute: 0
        },
        {
            name: "1:30pm", hour: 13, minute: 30
        },
        {
            name: "2:00pm", hour: 14, minute: 0
        },
        {
            name: "2:30pm", hour: 14, minute: 30
        },
        {
            name: "3:00pm", hour: 15, minute: 0
        },
        {
            name: "3:30pm", hour: 15, minute: 30
        },
        {
            name: "4:00pm", hour: 16, minute: 0
        },
        {
            name: "4:30pm", hour: 16, minute: 30
        },
        {
            name: "5:00pm", hour: 17, minute: 0
        },
        {
            name: "5:30pm", hour: 17, minute: 30
        },
        {
            name: "6:00pm", hour: 18, minute: 0
        },
        {
            name: "6:30pm", hour: 18, minute: 30
        },
        {
            name: "7:00pm", hour: 19, minute: 0
        },
        {
            name: "7:30pm", hour: 19, minute: 30
        },
        {
            name: "8:00pm", hour: 20, minute: 0
        },
        {
            name: "8:30pm", hour: 20, minute: 30
        },
        {
            name: "9:00pm", hour: 21, minute: 0
        },
        {
            name: "9:30pm", hour: 21, minute: 30
        },
        {
            name: "10:00pm", hour: 22, minute: 0
        },
        {
            name: "10:30pm", hour: 22, minute: 30
        },
        {
            name: "11:00pm", hour: 23, minute: 0
        },
        {
            name: "11:30pm", hour: 23, minute: 30
        },
        {
            name: "12:00am", hour: 0, minute: 0
        },

    ])
    const [title, setTitle] = useState("")
    const [assitant, setAssistant] = useState(false)
    const [message, setMessage] = useState("")
    const [emails, setEmails] = useState("")
    const [reminder, setReminder] = useState(false)
    const [daily, setDaily] = useState(false)
    const [weekly, setWeekly] = useState(false)
    const [monthly, setMonthly] = useState(false)
    const [trimestral, setTrimestral] = useState(false)
    const [halfAnual, setHalfAnual] = useState(false)
    const [anually, setAnually] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState({ name: "default", path: "" })
    const selectedTemplateList = [
        { name: "Appointment", path: "./utils/templates/calendarEmail.handlebars" },
        { name: "Confirmation Receipt", path: "./utils/templates/receipt.handlebars" },
        { name: "Verification Mail", path: "./utils/templates/verificationEmail.handlebars" },
    ]
    let localizer = momentLocalizer(moment) //spanish
    const locales = {
        'en-US': enUS,
    }
    localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales,
    })

    const useStyles = makeStyles((theme) => ({
        modal: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            minHeight: "640px",
            width: "100%", /* celular */
            //minWidth: "540px",
            maxWidth: "550px",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            /* padding: theme.spacing(2, 4, 3), */
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "auto",
            overflowX: "auto",
            zIndex: 9999,
            padding: "0px",
            color: "black"
            /*  zIndex: "9999 !important", */
        },
        modal2: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            height: "600px",
            width: "fit-content", /* celular */
            minWidth: "400px",
            maxWidth: "max-content",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            /* padding: theme.spacing(2, 4, 3), */
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "scroll",
            zIndex: 9999,
            padding: "10px",
            zIndex: "9999 !important",
        },
        iconos: { cursor: "pointer", },
        inputMaterial: { width: "100%", },
    }));
    const styles = useStyles();

    const abrirCerrarModalMostrar = (event) => {
        setModalMostrar(!modalMostrar);
        if (event) {
            setAddEvent(event)
            setStartTime({ name: "12:00am", hour: 0, minutes: 0 })
            setEndTime({ name: "11:59pm", hour: 23, minutes: 59 })
            setReminder(false)
        }
    };

    const abrirCerrarModalEditar = (event) => {
        setModalEditar(!modalEditar);
        if (event) {
            setAddEvent(event)
            /*  setStartTime({ name: "12:00am", hour: 0, minutes:0 })
             setEndTime({ name: "11:59pm", hour: 23, minutes:59 }) */
        }
    };

    const formatStringDate = (dateString) => {
        let newDateFormat = new Date(dateString)
        let year = newDateFormat.getFullYear();
        let months = newDateFormat.getMonth() + 1; // El mes se devuelve como un valor entre 0 y 11, así que debemos agregar 1 para obtener el valor correcto
        let day = newDateFormat.getDate();
        if (months < 10) {
            months = "0" + months
        }
        if (day < 10) {
            day = "0" + day
        }

        let newFormat = year + "-" + months + "-" + day;
        return newFormat
    }

    const formatStringDateEnd = (dateString) => {
        let newDateFormat = new Date(dateString)
        newDateFormat.setSeconds(newDateFormat.getSeconds() - 1);
        let year = newDateFormat.getFullYear();
        let months = newDateFormat.getMonth() + 1; // El mes se devuelve como un valor entre 0 y 11, así que debemos agregar 1 para obtener el valor correcto
        let day = newDateFormat.getDate();
        if (months < 10) {
            months = "0" + months
        }
        if (day < 10) {
            day = "0" + day
        }

        let newFormat = year + "-" + months + "-" + day + " 23:59";
        return newFormat
    }

    const formatStringDateParse = (dateString) => {
        console.log(dateString)
        let newDateFormat = new Date(dateString)
        let year = newDateFormat.getFullYear();
        let months = newDateFormat.getMonth() + 1; // El mes se devuelve como un valor entre 0 y 11, así que debemos agregar 1 para obtener el valor correcto
        let day = newDateFormat.getDate();
        let hours = newDateFormat.getHours();
        let minutes = newDateFormat.getMinutes()
        if (months < 10) {
            months = "0" + months
        }
        if (day < 10) {
            day = "0" + day
        }
        if (hours < 10) {
            hours = "0" + hours
        }
        if (minutes < 10) {
            minutes = "0" + minutes
        }

        let newFormat = year + "-" + months + "-" + day + " " + hours + ":" + minutes + ":00.0";
        console.log("newFormat: ", newDateFormat)
        return newFormat
    }

    //array de eventos
    const myEventsList = [
        {
            title: "Meetings",
            start: new Date('2023-05-05 10:22:00'),
            end: new Date('2023-05-05 10:42:00')
        }
    ]
    const [eventosCalendario, setEventosCalendarios] = useState(myEventsList)
    const [newEvent, setNewEvent] = useState(myEventsList)

    const dropTimeStart = (campo) => {
        return (
            <span className="d-flex flex-nowrap dropwdowncustom my-0 px-1 mx-0">
                <div className="dropdown justify-content-center align-items-center">
                    <button
                        id="cajitagris"
                        type="button"
                        className="btn btn-primary dropdown-toggle btn-sm h-76"
                        data-bs-toggle="dropdown"
                    >
                        {startTime.name}
                    </button>
                    <ul className="dropdown-menu" style={{ height: "180px", overflow: "auto" }}>
                        {elegibleTimes.map((item, index) => {
                            /* if (item != "" && item != "-" && item != "X" && item != "OF") { */
                            return (
                                <li
                                    className="dropdown-item"
                                    key={index}
                                    onClick={(e) => {
                                        setStartTime({ hour: item.hour, minutes: item.minute, name: item.name })
                                    }}
                                >
                                    {item.name}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </span>
        )
    }


    const dropTimeEnd = (campo) => {
        return (
            <span className="d-flex flex-nowrap dropwdowncustom my-0 px-1 mx-0">
                <div className="dropdown justify-content-center align-items-center">
                    <button
                        id="cajitagris"
                        type="button"
                        className="btn btn-primary dropdown-toggle btn-sm h-76"
                        data-bs-toggle="dropdown"
                    >
                        {endTime.name}
                    </button>
                    <ul className="dropdown-menu" style={{ height: "180px", overflow: "auto" }}>
                        {elegibleTimes.map((item, index) => {
                            /* if (item != "" && item != "-" && item != "X" && item != "OF") { */
                            return (
                                <li
                                    className="dropdown-item"
                                    key={index}
                                    onClick={(e) => {
                                        setEndTime({ hour: item.hour, minutes: item.minute, name: item.name })
                                    }}
                                >
                                    {item.name}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </span>
        )
    }

    const dropTemplate = (campo) => {
        return (
            <span className="d-flex flex-nowrap dropwdowncustom my-0 px-0 mx-0">
                <div className="dropdown justify-content-center align-items-center">
                    <button
                        id="cajitagris"
                        type="button"
                        className="btn btn-primary dropdown-toggle btn-sm h-76"
                        data-bs-toggle="dropdown"
                    >
                        {selectedTemplate.name}
                    </button>
                    <ul className="dropdown-menu" style={{ height: "180px", overflow: "auto" }}>
                        {selectedTemplateList.map((item, index) => {
                            /* if (item != "" && item != "-" && item != "X" && item != "OF") { */
                            return (
                                <li
                                    className="dropdown-item"
                                    key={index}
                                    onClick={(e) => {
                                        setSelectedTemplate(item)
                                    }}
                                >
                                    {item.name}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </span>
        )
    }

    const bodyMostrar = (event) => {
        return (
            <div className={styles.modal}>
                <div className="d-flex container-fluid" id=" visual-comprobante" style={{ justifyContent: "start", alignItems: "center", backgroundColor: "#efeeee" }}>
                    <div style={{ padding: "10px" }}>
                        <h3 style={{ fontSize: "1.2rem" }}>Schedule</h3>
                    </div>
                    <br />
                </div>
                <div style={{ justifyContent: "start", alignItems: "center" }}>
                    <div style={{ padding: "15px" }}>
                        {/* <div className="row">
                            <div className="col-12 d-flex justify-content-center align-items-center">
                                <input className="input-event"
                                    placeholder="Add title"
                                    style={{ width: "80%", borderWidth: "0px 0px 1px 0px", fontSize: "1.2rem" }}
                                    onChange={(e) => { setTitle(e.target.value) }}
                                />
                            </div>
                        </div> */}
                        <br />
                        <div className="row d-flex">
                            <div className="col-2 justify-content-center align-items-center">
                                <span>Start:</span>
                            </div>
                            <div className="col-5 justify-content-center align-items-center">
                                <input className="input-event"
                                    placeholder={formatStringDate(addEvent.start)}
                                    style={{ width: "100%", borderWidth: "0px 0px 1px 0px", fontSize: "1.0rem" }}
                                    //onChange={(e) => { setAddEvent(e.target.value) }}
                                    disabled
                                />
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <span>Add Time</span>
                            </div>
                            <div className="col-3 justify-content-center align-items-center">
                                {dropTimeStart()}
                            </div>
                        </div>
                        <br />
                        <div className="row d-flex">
                            <div className="col-2 justify-content-center align-items-center">
                                <span>End:</span>
                            </div>
                            <div className="col-5 justify-content-center align-items-center">
                                <input className="input-event"
                                    placeholder={formatStringDateEnd(addEvent.end)}
                                    style={{ width: "100%", borderWidth: "0px 0px 1px 0px", fontSize: "1.0rem" }}
                                    //onChange={(e) => { setAddEvent(e.target.value) }}
                                    disabled
                                />
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <span>Add Time</span>
                            </div>
                            <div className="col-3 justify-content-center align-items-center">
                                {dropTimeEnd()}
                            </div>
                        </div>
                        <br />
                        {/* <div className="row d-flex">
                            <div className="col-4 justify-content-center align-items-center">
                                <span>Choose a Template:</span>
                            </div>
                            <div className="col justify-content-center align-items-center">
                                {dropTemplate()}
                            </div>
                        </div> */}
                        <br />
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Remind 1 day before:</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                    onChange={(e) => { setReminder(!reminder) }}
                                />
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Repeat daily:</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                    onChange={(e) => { setDaily(!daily) }}
                                />
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Repeat weekly:</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                    onChange={(e) => { setWeekly(!weekly) }}
                                />
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Repeat monthly:</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                    onChange={(e) => { setMonthly(!monthly) }}
                                />
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Repeat every 3 months:</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                    onChange={(e) => { setTrimestral(!trimestral) }}
                                />
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Repeat every 6 months:</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                    onChange={(e) => { setHalfAnual(!halfAnual) }}
                                />
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Repeat anually:</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                    onChange={(e) => { setAnually(!anually) }}
                                />
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Repeat on customer's birthday: (not working a.t.m)</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                //onChange={(e) => { setReminder(!reminder) }}
                                />
                            </div>
                        </div>
                        <div className="row d-flex">
                            <div className="col-10 justify-content-center align-items-center">
                                <span>Repeat on customer's anniversary: (not working a.t.m)</span>
                            </div>
                            <div className="col-2 justify-content-center align-items-center">
                                <input className="input-event"
                                    type="checkbox"
                                //onChange={(e) => { setReminder(!reminder) }}
                                />
                            </div>
                        </div>
                    </div>
                    <div align="d-flex row px-2 mx-2">
                        <div className="col-1"></div>
                        <div className="col-11" style={{ display: "flex", flexDirection: "row-reverse" }}>
                            <button className="btn btn-outline-danger" onClick={() => abrirCerrarModalMostrar()}>Close</button>
                            <button className="btn btn-outline-success" onClick={() => {
                                let objTemp = JSON.parse(JSON.stringify(addEvent))
                                //console.log("evento: ", objTemp)                                
                                objTemp.start = formatStringDateParse(new Date(addEvent.start).setHours(startTime.hour, startTime.minutes))
                                //objTemp.start = new Date(addEvent.start).setMinutes(startTime.minutes)
                                objTemp.end = formatStringDateParse(new Date(formatStringDateEnd(addEvent.end)).setHours(endTime.hour, endTime.minutes))
                                //objTemp.end = new Date(formatStringDateEnd(addEvent.end)).setMinutes(endTime.minutes) 
                                objTemp.messages = message
                                objTemp.emails = emails
                                objTemp.title = title
                                objTemp["template_path"] = selectedTemplate.path
                                objTemp.reminder = reminder
                                objTemp.daily = daily
                                objTemp.weekly = weekly
                                objTemp.monthly = monthly
                                objTemp.weekly = weekly
                                objTemp.trimestral = trimestral
                                objTemp.halfAnual = halfAnual
                                objTemp.anually = anually

                                console.log("event modified: ", objTemp)
                                handleSelectSlot(objTemp)
                            }}>Create</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const bodyEdit = (event) => {
        return (
            <div className={styles.modal}>
                <div className="d-flex container-fluid" id=" visual-comprobante" style={{ justifyContent: "start", alignItems: "center", backgroundColor: "#efeeee" }}>
                    <div style={{ padding: "10px" }}>
                        <h3 style={{ fontSize: "1.2rem" }}>Info</h3>
                    </div>
                    <br />
                </div>
                <div style={{ justifyContent: "start", alignItems: "center" }}>
                    <div style={{ padding: "15px" }}>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center align-items-center">
                                <input className="input-event"
                                    placeholder={addEvent.title}
                                    style={{ width: "80%", borderWidth: "0px 0px 1px 0px", fontSize: "1.2rem" }}
                                    //onChange={(e) => { setTitle(e.target.value) }}
                                    disabled
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row d-flex">
                            <div className="col-2 justify-content-center align-items-center">
                                <span>Start:</span>
                            </div>
                            <div className="col-10 justify-content-center align-items-center">
                                <input className="input-event"
                                    placeholder={addEvent.start}
                                    style={{ width: "100%", borderWidth: "0px 0px 1px 0px", fontSize: "1.0rem" }}
                                    //onChange={(e) => { setAddEvent(e.target.value) }}
                                    disabled
                                />
                            </div>

                        </div>
                        <br />
                        <div className="row d-flex">
                            <div className="col-2 justify-content-center align-items-center">
                                <span>End:</span>
                            </div>
                            <div className="col-10 justify-content-center align-items-center">
                                <input className="input-event"
                                    placeholder={addEvent.end}
                                    style={{ width: "100%", borderWidth: "0px 0px 1px 0px", fontSize: "1.0rem" }}
                                    //onChange={(e) => { setAddEvent(e.target.value) }}
                                    disabled
                                />
                            </div>

                        </div>
                        <br />
                        <div className="row d-flex">
                            <div className="col-2 justify-content-center align-items-center">
                                <span>Template:</span>
                            </div>
                            <div className="col-10 justify-content-center align-items-center">
                                <input className="input-event"
                                    placeholder={addEvent.template_path ? addEvent.template_path : ""}
                                    style={{ width: "100%", borderWidth: "0px 0px 1px 0px", fontSize: "1.0rem"/* , minHeight: "100px"  */ }}
                                    //onChange={(e) => { setMessage(e.target.value) }}
                                    disabled
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row d-flex">
                            <div className="col-2 justify-content-center align-items-center">
                                <span>Send to:</span>
                            </div>
                            <div className="col-10 justify-content-center align-items-center">
                                <textarea className="input-event"
                                    placeholder={addEvent.emails ? addEvent.emails : ""}
                                    style={{ width: "100%", borderWidth: "0px 0px 1px 0px", fontSize: "1.0rem" }}
                                    //onChange={(e) => { setEmails(e.target.value) }}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <br />

                    <div align="d-flex row px-2 mx-2">
                        <div className="col-1"></div>
                        <div className="col-11" style={{ display: "flex", flexDirection: "row-reverse" }}>
                            <button className="btn btn-outline-danger" onClick={() => abrirCerrarModalEditar()}>Close</button>
                            <button className="btn btn-outline-success" onClick={() => {
                                /* let objTemp = JSON.parse(JSON.stringify(addEvent))                                                           
                                objTemp.start = formatStringDateParse(new Date(addEvent.start).setHours(startTime.hour, startTime.minutes))                           
                                objTemp.end = formatStringDateParse(new Date(formatStringDateEnd(addEvent.end)).setHours(endTime.hour, endTime.minutes))                            
                                objTemp.messages = message
                                objTemp.emails = emails
                                objTemp.title = title                               
                                console.log("event modified: ", objTemp) */
                                handleSelectEvent(addEvent)
                            }}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleSelectSlot =
        async ({ start, end, id, messages, title, emails, reminder, template_path, daily, weekly, trimestral, halfAnual, anually, monthly }) => {
            console.log(start, end)
            let partes = start.split(" "); // Divide el texto en fecha y hora
            let fechaPartes = partes[0].split("-"); // Divide la fecha en año, mes y día
            let horaPartes = partes[1].split(":");
            let fechaISO8601 = fechaPartes[0] + "-" + fechaPartes[1] + "-" + fechaPartes[2] + "T" +
                horaPartes[0] + ":" + horaPartes[1] + ":" + horaPartes[2] + "Z";
            let start2 = new Date(fechaISO8601
            );
            console.log("start2: ", start2)
            //start = new Date(start)
            let partes2 = end.split(" "); // Divide el texto en fecha y hora
            let fechaPartes2 = partes2[0].split("-"); // Divide la fecha en año, mes y día
            let horaPartes2 = partes2[1].split(":");
            fechaISO8601 = fechaPartes2[0] + "-" + fechaPartes2[1] + "-" + fechaPartes2[2] + "T" +
                horaPartes2[0] + ":" + horaPartes2[1] + ":" + horaPartes2[2] + "Z";
            let end2 = new Date(fechaISO8601); //Format DATE for python backend


            //end = new Date(end)
            id = new Date().getTime()
            //const title = window.prompt('Name of event')
            if (emails) {
                titleMain = title + "📧"
            }
            console.log("end2:", end2)
            let obj = {
                //Compania: store.user.JRCompaniaAut[0],
                Calendar: {start: start2, end: end2, title: title, messages, emails, reminder: reminder, sent: false, template_path: selectedTemplate.path, daily, weekly, trimestral, half_anual: halfAnual, anually, monthly }
            }
            //console.log("newCalendar: ", obj.Calendar)
            setEventosCalendarios([obj.Calendar])
            setNewEvent(obj.Calendar)
            setTemporalCalendar({ start: start2, end: end2, title: title, messages, emails, reminder: reminder, sent: false, template_path: selectedTemplate.path, daily, weekly, trimestral, half_anual: halfAnual, anually, monthly })
            console.log("en schedule:", obj)
            abrirCerrarModalMostrar()
            /* if (title) {
                console.log(selectedTemplate)
                let obj = {
                    Compania: store.user.JRCompaniaAut[0],
                    Calendar: { ...campaignD, start: start2, end: end2, title: title, messages, emails, reminder:reminder, sent: false, template_path: selectedTemplate.path, daily, weekly, trimestral, half_anual:halfAnual, anually, monthly }
                }
                //console.log("newCalendar: ", obj.Calendar)
                setTemporalCalendar({start: start2, end: end2, title: title, messages, emails, reminder:reminder, sent: false, template_path: selectedTemplate.path, daily, weekly, trimestral, half_anual:halfAnual, anually, monthly })
                console.log("en schedule,", obj)
                let response = await actions.useFetch(urlUpdate, obj, "PUT")
                if (response.ok) {
                    setEventosCalendarios([obj.Calendar])
                    setNewEvent(obj.Calendar)
                    response = await response.json()
                    alert(response.message)
                    //setRecarga(!recarga)
                    abrirCerrarModalMostrar()
                } else {
                    response = await response.json()
                    alert(response.message)
                }
            } else {
                Swal.fire({
                    title: 'You must enter a Title',
                    icon: "warning",
                    showDenyButton: true
                })
            } */

        }

    const handleSelectEvent =
        async (event) => {
            let desicion = window.prompt('Do you want delete this event [Y] ?');
            if (desicion == "Y") {
                //console.log(desicion)
                console.log(event)
                let temporalArray = eventosCalendario.slice() //this is a copy of Calendar
                setEventosCalendarios((prevState) => prevState.filter((item, index) => {
                    //console.log(item.title.toLowerCase().trim() != event.title.toLowerCase().trim())
                    // 
                    if (item.id) {
                        return item.id != event.id;
                    } else {
                        return item.title.toLowerCase().trim() != event.title.toLowerCase().trim();
                    }

                }))
                temporalArray = temporalArray.filter((item, index) => {
                    //console.log(item.title.toLowerCase().trim() != event.title.toLowerCase().trim())
                    // 
                    if (item.id) {
                        return item.id != event.id;
                    } else {
                        return item.title.toLowerCase().trim() != event.title.toLowerCase().trim();
                    }

                })
                //alert("Remember save the changes")
                let obj = {
                    Compania: store.user.JRCompaniaAut[0],
                    Calendar: eventosCalendario[0],
                    campaign_id: campaignD.id
                }
                setNewEvent(temporalArray)
                let response = await actions.useFetch(urlDelete, obj, "PUT")
                if (response.ok) {
                    response = await response.json()
                    alert(await response['message'])
                    //setRecarga(!recarga)
                    abrirCerrarModalEditar()
                } else {
                    response = await response.json()
                    alert(await response['message'])
                }
            }
        }


    const { defaultDate, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(2015, 3, 12),
            scrollToTime: new Date(1970, 1, 1, 6),
        }),
        [])



    useEffect(() => {
        const dataFetch = async () => {
            let calendarFetch = await actions.getGenerico2(urlCheck, {
                Compania: store.user.JRCompaniaAut[0],
            }, "POST");
            if (calendarFetch.ok) {
                calendarFetch = await calendarFetch.json()
                console.log(calendarFetch.Calendar)
                //store.user.Calendar = calendarFetch.Calendar

                if (calendarFetch.Calendar.length > 0 && calendarFetch.Calendar[0] != "") {
                    for (let i = 0; i < calendarFetch.Calendar.length; i++) {
                        //console.log(props.calendario[i]["start"])
                        calendarFetch.Calendar[i]["start"] = new Date(calendarFetch.Calendar[i]["start"])
                        calendarFetch.Calendar[i]["end"] = new Date(calendarFetch.Calendar[i]["end"])
                    }
                }
                setEventosCalendarios(calendarFetch.Calendar)
                setNewEvent(calendarFetch.Calendar)
            }

        }

        //dataFetch() //hay que usar esto mismo pero para traerse los emails?
        //console.log(campaignD.Calendar)
        let temporalCampaignCalendar = [campaignD]
        /* if (campaignD.Calendar.length > 0 && campaignD.Calendar[0] != "") {
            let obj = {}
            for (let i = 0; i < campaignD.Calendar.length; i++) {
                //console.log(props.calendario[i]["start"])
                obj = {
                    ...campaignD.Calendar[i],
                    campaign_id: campaignD.id,
                    messages: campaignD.message,
                    emails: "Will be send to: " + campaignD.customer_id.length + " customer(s)",
                    start: new Date(campaignD.Calendar[i]["start"]),
                    end: new Date(campaignD.Calendar[i]["end"])
                }
                temporalCampaignCalendar.push(obj)
                obj = {}
            }
        } */
        setEventosCalendarios(temporalCampaignCalendar)
        setNewEvent(temporalCampaignCalendar)

        let botones = document.querySelectorAll("button")
        if (botones.length > 0) {
            for (let i = 0; i < botones.length; i++) {
                if (botones[i].classList.toString() == "" || botones[i].classList.toString() == "rbc-active") {
                    botones[i].classList.add("btn")
                    botones[i].classList.add("btn-outline-primary")
                    botones[i].style = "min-height: 35px; min-width: 20px;"
                    console.log(botones[i].classList.toString())
                    switch (botones[i].innerHTML) {
                        case "Today":
                            botones[i].innerHTML = "Today"
                            break;
                        case "Back":
                            botones[i].innerHTML = "Back"
                            break;
                        case "Next":
                            botones[i].innerHTML = "Next"
                            break;
                        case "Month":
                            botones[i].innerHTML = "Month"
                            break;
                        case "Day":
                            botones[i].innerHTML = "Day"
                            break;
                        case "Week":
                            botones[i].innerHTML = "Week"
                            break;
                    }
                }
            }
        }
        let grupoBotones = document.querySelector(".rbc-btn-group")
        if (grupoBotones) {
            grupoBotones.style = "min-height: 35px;"
            document.querySelector(".rbc-toolbar").classList.add("d-flex")
            document.querySelector(".rbc-toolbar").classList.add("justify-content-between")
        }

    }, [])

    return (
        <>
            <Calendar
                localizer={localizer}
                events={eventosCalendario}
                startAccessor="start"
                defaultDate={new Date()}
                defaultView={"month"}
                endAccessor="end"
                onSelectEvent={abrirCerrarModalEditar}
                onSelectSlot={abrirCerrarModalMostrar}
                selectable
                scrollToTime={scrollToTime}
                style={{ height: "100%" }}
                toolbar={CustomToolbar}

            />
            <div className="row py-2 my-1">
                <div align="right">
                    {/* <button className="btn btn-outline-success"
                        onClick={async () => {
                            // setLayout(controlledBoard)
                            console.log(eventosCalendario) //controlled board es el correcto
                            let obj = {
                                Compania: store.user.JRCompaniaAut[0],
                                Calendar: eventosCalendario
                            }
                            let response = await actions.putGenerico(urlUpdate, obj)
                            if (response.ok) {
                                alert(await response.json())
                                //setRecarga(!recarga)
                            } else {
                                alert(await response.json())
                            }

                        }}>
                        Save Current Changes
                    </button> */}
                </div>
            </div>
            <Modal open={modalMostrar} onClose={abrirCerrarModalMostrar}>
                {bodyMostrar()}
            </Modal>
            <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
                {bodyEdit()}
            </Modal>
        </>
    )

}

//export default WithAuth(CampaignCalendar)
export default ScheduleEmail;
