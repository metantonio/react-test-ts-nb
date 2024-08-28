import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function Droppable(props) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
        backgroundColor: "#ffffffbf",
        /* width: "90%",
        height: "90%", */
        minHeight: "220px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "5px 12px 5px 12px"
    };


    return (
        <div className="col-sm-12 col-md-3 d-flex" ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}