import React, { useEffect, useContext, useState } from 'react';
import styles from "./index.module.css";
import Swal from 'sweetalert2';

const ThirdSlide = (props) => {
    return(<div>
        Third Slide {props.index}
    </div>)
}

export default ThirdSlide;