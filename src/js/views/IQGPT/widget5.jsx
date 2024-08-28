import React, { useState, useEffect, useContext } from 'react';
import styles from "./index.module.css";
import { Context } from '../../store/appContext';
import Swal from 'sweetalert2';

const WidgetTech5 = () => {
    const [loading, setLoading] = useState(false)
    const { store, actions } = useContext(Context)

    return (
        <div className={styles.window5}>
            <button className={styles.button_approve} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Toggle bottom offcanvas</button>

            <div className="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasBottomLabel">Offcanvas bottom</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">
                    ...
                </div>
            </div>
        </div>
    )

}

export default WidgetTech5;