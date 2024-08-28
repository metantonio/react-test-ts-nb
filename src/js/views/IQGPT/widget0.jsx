import React, { useState, useEffect, useContext } from 'react';
import styles from "./index.module.css";
import { Context } from '../../store/appContext';
import Swal from 'sweetalert2';
import WidgetTech1 from './widget1.jsx';
import WidgetTech2 from './widget2.jsx';
import WidgetTech3 from './widget3.jsx';
import WidgetTech4 from './widget4.jsx';


const WidgetLateral = () => {
    const [loading, setLoading] = useState(false)
    const { store, actions } = useContext(Context)

    return (
        <div className={styles.windowlateral}>
            <WidgetTech1 />
            <WidgetTech2 />
            <WidgetTech3 />
            <WidgetTech4 />
            
        </div>
    )

}

export default WidgetLateral;