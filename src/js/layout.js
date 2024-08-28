import React, { useState, useContext } from "react";
import { Context } from "./store/appContext";
import { BrowserRouter, Route, Router, Switch, Suspense, lazy } from "react-router-dom";
import ScrollToTop from "./components/scrollToTop";
import { Spinner } from "reactstrap";

import HomeView from "./views/homeView.js";
import injectContext from "./store/appContext";

//import { Navbar } from "./components/Navbar2/navbar.jsx";

import Error404 from "./views/404/404.jsx";

import Login from "./views/Login/login.jsx";
import { Signup } from "./views/Login/signup.jsx";
import BookLoader from "./views/Loading/bookloader";

const IQgpt = React.lazy(() => import("./views/IQGPT/index.jsx"))
const Campaign = React.lazy(() => import("./views/IQCampaign/campaign.jsx"))
const CampaignWF = React.lazy(() => import("./views/IQCampaignWF/campaignWF.jsx"))

const ClientList = React.lazy(() => import('./views/IQSMS/customerList.jsx'));
const SingleCampaign = React.lazy(() => import('./views/IQSMS/singleCampaign.jsx'));

const ClientJourneyComponent = React.lazy(() => import('./views/IQEMAIL/campaignJourney.jsx'));
const CampaignEmailList = React.lazy(() => import('./views/IQEMAIL/campaignEmailList.jsx'));

const IQNinja = React.lazy(() => import("./views/IQNinja/index.jsx"))
const MyTestComponent = React.lazy(() => import("./views/test/main.jsx"))


const Template1 = React.lazy(() => import('./views/IQEMAIL/template1.jsx'));
const Template2 = React.lazy(() => import('./views/IQEMAIL/template2.jsx'));
const Template3 = React.lazy(() => import('./views/IQEMAIL/template3.jsx'));

const Twitter = React.lazy(() => import('./views/iQTwitter/main.jsx'));

const LoadingComponent = () => {
  return <BookLoader
    background={"linear-gradient(135deg, #6066FA, #4645F6)"}
    desktopSize={"100px"}
    mobileSize={"80px"}
    textColor={"#4645F6"}
  />
}

const LoadingComponent2 = () => {
  return (
    <div className="spinner-border text-warning" role="status" aria-hidden="true">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}
//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";
  const { store, actions } = useContext(Context)

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          {/* {store.logOutConfirmation ? <Navbar /> : <></>} */}
          <Switch>
            <Route exact path="/landing">
              <HomeView />
            </Route>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/signup-iq">
              <Signup />
            </Route>
            {/* <Route exact path="/iq-gpt">
              <IQgpt />
            </Route> */}
            <Route exact path="/iq-gpt">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <IQgpt />
              </React.Suspense>
            </Route>
            <Route exact path="/iq-campaign">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <Campaign />
              </React.Suspense>
            </Route>
            <Route exact path="/iq-campaign/:theid">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <CampaignWF />
              </React.Suspense>
            </Route>
            <Route exact path="/iq-sms">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <ClientList />
              </React.Suspense>
            </Route>
            <Route exact path="/iq-sms/:id">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <SingleCampaign />
              </React.Suspense>
            </Route>
            <Route exact path="/iq-email">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <CampaignEmailList />
              </React.Suspense>
            </Route>
            <Route exact path="/iq-ninja">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <IQNinja />
              </React.Suspense>
            </Route>
            <Route exact path="/iq-email/:id">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <ClientJourneyComponent />
              </React.Suspense>
            </Route>
            <Route exact path="/main">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <MyTestComponent />
              </React.Suspense>
            </Route>
            <Route exact path="/iq-twitter-test">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <Twitter />
              </React.Suspense>
            </Route>
            <Route exact path="/template/1">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <Template1 />
              </React.Suspense>
            </Route>

            <Route exact path="/template/2">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <Template2 />
              </React.Suspense>
            </Route>

            <Route exact path="/template/3">
              <React.Suspense fallback={<LoadingComponent2 />}>
                <Template3 />
              </React.Suspense>
            </Route>

            <Route exact path="*">
              <Error404 />
            </Route>
          </Switch>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
