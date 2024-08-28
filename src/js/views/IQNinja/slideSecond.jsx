import React, { useEffect, useContext, useState } from 'react';
import styles from "./index.module.css";
import Swal from 'sweetalert2';



const SecondSlide = (props) => {
    return(<div>
        Second Slide {props.index}
    </div>)
}

export default SecondSlide;