import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams, useHistory } from "react-router-dom";
import { Context } from "../store/appContext.js";
import MaterialTable from "material-table";
import { Modal, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "@material-ui/icons";
import { forwardRef } from "react";
//import "../../styles/menu.css";
import Logo from "../../img/logobyn.png";
import Home from "./Landing/index.jsx";
import WithAuth from "../components/Auth/withAuth.js";

const HomeView = () => {
  const { store, actions } = useContext(Context);
  const history = useHistory("");

  return (
    <div className="container-fluid">
      <Home />
    </div>
  );
};

export default WithAuth(HomeView)