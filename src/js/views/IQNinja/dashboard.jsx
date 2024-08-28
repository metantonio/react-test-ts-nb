import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../../store/appContext';
import styles from "./index.module.css";
import Swal from 'sweetalert2';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { Draggable } from './draggable.jsx';
import { Droppable } from './droppable.jsx';


const Dashboard = () => {
        const { store, actions } = useContext(Context)
        const [containers, setContainers] = useState(['0', '1', '2', '3', '4']);
        const [parent, setParent] = useState([
                { id: '0', item: "0", graph: { type: "pie", title: "test 0", xlabel: ["Jan", "Feb"], xValue: [30, 40] } },
                { id: '1', item: "1", graph: { type: "bar", title: "test 1", xlabel: ["Sent", "Opened", "Click", "Unsubscribed", "Unseen"], xValue: [10, 4, 3, 1, 6] } },
                { id: '2', item: "2", graph: { type: "pie", title: "test 2", xlabel: ["USA", "CHINA"], xValue: [75, 25] } },
                { id: '3', item: "3", graph: { type: "line", title: "test 3", xlabel: ["Jan", "Feb", "March"], xValue: [75, 25, 50] } },
                { id: '4', item: "4", graph: { type: "bar", title: "test 4", xlabel: ["SPAIN", "ITALY"], xValue: [75, 25] } }
        ]);
        const draggableMarkup = (id, new_data = null) => {
                return (
                        <Draggable id={`draggable-${id}`} style={{ width: "100%", height: "100%" }} tpdata={{ data: `hello ${id}` }} data={new_data}>
                                Drag me
                        </Draggable>
                )
        }



        const handleDragEnd = async (event) => {

                let { over, active } = await event;
                console.log("event:", event)
                console.log("draggableIDArr: ", active.id)
                let draggableIDArr = active.id.split("-")
                let draggableID = parseInt(draggableIDArr[draggableIDArr.length - 1])
                let overID = parseInt(over.id)
                console.log("from: ", draggableID, " to: ", overID)
                // If the item is dropped over a container, set it as the parent
                // otherwise reset the parent to `null`
                //setParent(over ? over.id : null);

                //no i should switch positions on the arrays
                let tempArrContainer = containers.slice()
                let tempArrParent = parent.slice()

                let oldContainer = tempArrContainer[draggableID]
                let newContainer = tempArrContainer[overID]
                tempArrContainer[draggableID] = newContainer
                tempArrContainer[overID] = oldContainer
                //setContainers(tempArrContainer)

                let oldParent = { ...tempArrParent[draggableID]/* , item: tempArrParent[draggableID]["item"], graph: tempArrParent[draggableID]["graph"]  */}
                let newParent = { ...tempArrParent[overID]/* , item: tempArrParent[overID]["item"], graph: tempArrParent[overID]["graph"]  */}
                console.log("TempArrContainer: ", tempArrContainer)
                console.log("tempArrParent: ", tempArrParent)
                console.log("newParent: ", newParent),
                console.log("oldParent: ", oldParent)
                tempArrParent[draggableID] = newParent
                tempArrParent[overID] = oldParent
                setParent(tempArrParent)
        }

        const addContainer = () => {
                let lastID = parseInt(containers[containers.length - 1]) + 1 //actually, should find the highest value of the array container
                let tempArr = containers.slice()
                tempArr.push(`${lastID}`)
                let tempArrParents = parent.slice()
                tempArrParents.push({ id: `${lastID}`, item: `${lastID}`, graph: { type: "bar", title: "test 4", xlabel: ["SPAIN", "ITALY"], xValue: [75, 25] } })
                setContainers(tempArr)
                setParent(tempArrParents)
        }

        useEffect(()=>{console.log("order/container have been modified")}, [parent])

        return (
                <div className={styles.dashboard}>
                        Dashboard
                        <button onClick={addContainer}>Add Container</button>
                        <div className='container-fluid d-flex justify-content-center align-items-center'>
                                <div className='row d-flex justify-content-center align-items-start' /* style={{ width: "100%" }} */>
                                        <DndContext onDragEnd={handleDragEnd}>
                                                {containers.map((id, index) => (
                                                        // We updated the Droppable component so it would accept an `id`
                                                        // prop and pass it to `useDroppable`
                                                        <Droppable key={id} id={id}>
                                                                {draggableMarkup(id, parent[index])}
                                                        </Droppable>
                                                ))}
                                                {/* <div className="col-sm-12 col-md-4 d-flex">
                                                        {parent === null ? draggableMarkup("-1") : null}
                                                </div> */}
                                        </DndContext>
                                </div>
                        </div>
                </div>

        )
}

export default Dashboard;