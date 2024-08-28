import React, { useState, useContext } from 'react';
import { Context } from '../../store/appContext';
//import { Nav } from 'react-bootstrap';
import styles from "./sideMenu.module.css"
import Swal from 'sweetalert2';

const SideMenu = (props) => {
    const { store, actions } = useContext(Context)
    const urlRegister = "/campaign"

    const newCampaign = async () => {
        const { value: title, isConfirmed } = await Swal.fire({
            title: 'Input Campaign\'s Title',
            input: 'text',
            inputLabel: 'Campaign\'s Title',
            /* html:'<labe>Message: </label>'
            +'<input id="swal-input1" class="swal2-input">', */
            inputPlaceholder: 'Enter the Title of Campaign here',
            showDenyButton: true,
            confirmButtonText: 'Create'
        })
        if (isConfirmed) {
            if (title) {
                //Swal.fire(`Entered Title: ${title}`)
                //here goes some logic to fetch to API
                let response = await actions.useFetch(urlRegister, {
                    Compania: store.user.JRCompaniaAut[0],
                    title: title
                }, "POST");
                if (response.ok) {
                    response = await response.json()
                    Swal.fire(`Entered Title: ${response.message}`)
                    props.setReload(!props.reload)
                }else{
                    let response = await response.json()
                    Swal.fire(`Entered Title: ${response}`)
                }
            } else {
                Swal.fire({
                    title: 'You must enter a Name',
                    icon: "warning",
                    showDenyButton: true
                })
            }
        }



    }

    return (
        <nav className={`flex-column ${styles.side_menu}`}>
            {/* <h4>Side Menu</h4>
            <br /> */}
            <button className={styles.button_primary} onClick={newCampaign} type="button" href="#">New Campaign</button>
            <Link className={styles.button_primary} to="/iq-gpt">QLX-GPT</Link>
        </nav>
    );
}

export default SideMenu