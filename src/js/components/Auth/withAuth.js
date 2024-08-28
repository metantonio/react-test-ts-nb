import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import { Redirect } from "react-router-dom";


const WithAuth = (Component) => {
  const AuthRoute = () => {
    const { store, actions } = useContext(Context);
    
    const isAuth = store.logOutConfirmation;
    if (isAuth) {
      return <Component />;
    } else {
      return <Redirect to='/'/>;
    }
  };

  return AuthRoute;
};
export default WithAuth


