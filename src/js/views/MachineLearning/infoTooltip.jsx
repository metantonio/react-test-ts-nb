import React, { useState, useEffect, useContext } from "react";
import PropTypes, { number } from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Redirect, useHistory } from "react-router-dom";
import { Context } from "../../store/appContext";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, TextField, Button } from "@material-ui/core";
import { render } from "react-dom";
import csvformat from "./csvformat.png";
import './infoTooltip.css';

export const InfoTooltip = (props) => {
    const { store, actions } = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const useStyles = makeStyles((theme) => ({
        modal1: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            minHeight: "300px",
            width: "100%", /* celular */
            //minWidth: "540px",
            maxWidth: "700px",
            maxHeight: "640px",
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
        },
    }));

    const styles = useStyles();

    const abrirModal = () => {
        setShowModal(!showModal);
    };
    const bodyModal1 = (
        <div className={styles.modal1}>
            <button className="btn btn-danger" onClick={() => abrirModal()} id="info-close">
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>

            <p>
                Example of .csv format:
            </p>
            <div className="row">
                <img src={csvformat} lazy/>
            </div>
        </div>
    );

    return (
        <>
            <div className="row d-flex justify-content-start align-items-center align-self-center" id="question" onClick={abrirModal}>
                <i className="fa fa-info-circle fa-2x"></i>
            </div>
            <Modal open={showModal}>{bodyModal1}</Modal>
        </>
    );
};
