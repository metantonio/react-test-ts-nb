import React, { useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import styles from "./index.module.css";
import Swal from 'sweetalert2';


const GroupTables = () => {
    const { store, actions } = useContext(Context)

    return (    
            <div>                
                    <div className={styles.group_tables}>
                         Tables GROUPS              
                    </div>                
            </div>        
    )
}

export default GroupTables;