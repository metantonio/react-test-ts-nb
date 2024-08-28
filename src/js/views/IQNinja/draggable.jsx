import React, { useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import styles from "./index.module.css";
import FirstSlide from './slideFirst.jsx';
import SecondSlide from './slideSecond.jsx';
import ThirdSlide from './slideThird.jsx';

export function Draggable(props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        /* width: "100%",
        height: "90%", */
        maxWidth: "250px",
        maxHeight: "250px"
    } : undefined;

    useEffect(() => {
        console.log("draggable props: ", props)
    }, [])

    return (
        <div ref={setNodeRef} style={style} >
            {/* {props.children} */}
            <div {...listeners} {...attributes}>🖱️move</div>
            <div id={`carouselExampleCaptions-${props.id}`} className="carousel slide carousel-fade" data-bs-ride="false" style={{ minHeight: "220px", minWidth: "220px", backgroundColor: "#00000059" }} data-bs-interval="false">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target={`#carouselExampleCaptions-${props.id}`} data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target={`#carouselExampleCaptions-${props.id}`} data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target={`#carouselExampleCaptions-${props.id}`} data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active" data-bs-interval="">
                        {/* <img src="https://picsum.photos/200/200" className="d-block w-100" alt="..." lazy/> */}
                        <div className="d-md-block">
                            <FirstSlide index={props.data.item} graph={props.data.graph}/>
                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="">
                        {/* <img src="https://picsum.photos/200/200" className="d-block w-100" alt="..." lazy/> */}
                        <div className="d-md-block">
                            <SecondSlide index={props.data.item} />

                        </div>
                    </div>
                    <div className="carousel-item" data-bs-interval="">
                        {/* <img src="https://picsum.photos/200/200" className="d-block w-100" alt="..." lazy/> */}
                        <div className="d-md-block">
                            <ThirdSlide index={props.data.item} />
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target={`#carouselExampleCaptions-${props.id}`} data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target={`#carouselExampleCaptions-${props.id}`} data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
}