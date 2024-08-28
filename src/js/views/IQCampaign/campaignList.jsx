import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import { Link } from "react-router-dom";
import styles from "./campaignList.module.css"
import { DeleteButton } from "../../components/deleteButton.jsx";
import CampaignCalendar from "./campaignCalendar.jsx";
import Swal from "sweetalert2";

const CampaignList = (props) => {
    const { store, actions } = useContext(Context)
    const [campaigns, setCampaigns] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState(null)
    const [loading, setLoading] = useState(false)
    let urlGet = "/campaign"
    let urlDelete = "/campaign"
    let urlMessage = "/campaign/message"
    useEffect(() => {
        const dataFetch = async () => {
            console.log("datafetch")
            setLoading(true)
            let response = await actions.useFetch(urlGet, "", "GET");
            console.log("promise")
            if (response.ok) {
                console.log("good response")
                response = await response.json()
                setCampaigns(response)
                setLoading(false)
            } else {
                setLoading(false)
            }
        }
        dataFetch();
    }, [props.reload]);

    useEffect(() => { console.log("loaded: ", selectedCampaign) }, [selectedCampaign])

    const setupEmail = (e, campaign) => {
        e.preventDefault()
        //setSelectedCampaign(campaign)
        if (campaign.customer_id.length == 0) {
            alert("You must setup customers first")
            return
        }

        console.log("test campaign", campaign)
        /* if(selectedCampaign.length>0){
            console.log(selectedCampaign)
            
        } */
        setShowCalendar(!showCalendar)
        return
    }

    const setupMessage = async (e, campaignid, campaignMessage) => {
        e.preventDefault()
        console.log("write some message: ", campaignid, " ", campaignMessage)
        const { value: title, isConfirmed } = await Swal.fire({
            title: 'Input Campaign\'s Message',
            input: 'text',
            inputLabel: 'Campaign\'s Message',
            inputPlaceholder: campaignMessage,
            showDenyButton: true,
            confirmButtonText: 'Save'
        })
        if (isConfirmed) {
            if (title) {
                //Swal.fire(`Entered Title: ${title}`)
                //here goes some logic to fetch to API
                let response = await actions.useFetch(urlMessage, {
                    Compania: store.user.JRCompaniaAut[0],
                    campaign_id: campaignid,
                    message: title
                }, "PUT");
                if (response.ok) {
                    response = await response.json()
                    Swal.fire(`Entered Title: ${title} saved`)
                    setCampaigns(response)
                    //props.setReload(!props.reload)
                } else {
                    let response = await response.json()
                    Swal.fire(`Entered Title: ${response}`)
                }
            } else {
                Swal.fire({
                    title: 'You must enter a Message',
                    icon: "warning",
                    showDenyButton: true
                })
            }
        }
    }

    return (
        <div className="container">

            {campaigns.length > 0 && !loading ? (
                <table className="table table-hover table-sm align-middle">
                    <thead>
                        <tr>
                            <th>CAMPAIGN</th>
                            <th>STATUS</th>
                            {/* <th>MESSAGE</th> */}
                            <th>EDIT</th>
                            {/* <th>CAMPAIGN FOR CUSTOMERS</th> */}
                            <th>DELETE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map(campaign => {
                            return (
                                <tr key={campaign.id}>

                                    <td><h5>{campaign.title}</h5></td>
                                    {/* <h4 className="col-5">{campaign.message}</h4> */}
                                    <td><h4>{campaign.active ? "✅" : "⛔"}</h4></td>
                                    {/* <td><button className="btn btn-primary" type="button" onClick={async (e) => {
                                        setupMessage(e, campaign.id, campaign.message)
                                    }}>EDIT MESSAGE</button></td> */}
                                    <td className={styles.button_campaign}>
                                        <div className="d-flex justify-content-evenly align-items-center">
                                            <Link className={styles.button_primary} to={`iq-campaign/${campaign.id}`}>SETUP CAMPAIGN</Link><br /><span>Customers: {campaign.customer_id.length}</span>
                                        </div>
                                    </td>
                                    {/* <td><button className="btn btn-primary" type="button" onClick={(e) => {
                                        setSelectedCampaign(campaign)
                                        setupEmail(e, campaign)
                                    }}>{showCalendar ? "CLOSE CALENDAR" : "SETUP MAIL CAMPAIGN"}</button></td> */}
                                    <td className="justify-content-center align-self-center align-items-center">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <DeleteButton caso="campaign" icono={true} data={campaign} endpoint={urlDelete} reload={props.reload} setReload={props.setReload} />
                                        </div>
                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            ) :
                <>
                    {
                        loading == true ?
                            <>
                                < div className="d-flex justify-content-center align-items-center" id="loading">
                                    <div className="spinner-border text-warning" role="status" aria-hidden="true">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </>
                            : <p>There's not active campaigns</p>
                    }
                </>

            }
            {showCalendar && selectedCampaign != null && selectedCampaign.Calendar ? <CampaignCalendar campaignD={selectedCampaign} /> : <></>}
        </div >
    );
}

export default CampaignList;