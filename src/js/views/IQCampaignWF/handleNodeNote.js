import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../store/appContext';
import { Handle } from 'reactflow';
import Swal from 'sweetalert2';
//import Excel from '../../component/excelExport.jsx';
import { CSVLink } from "react-csv";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MyPlot from '../../components/plotlyReact.jsx';

export default (props) => {
    const { store, actions } = useContext(Context)
    const [tableNode, setTableNode] = useState([])
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [querySQL, setQuerySQL] = useState("")
    const [showQuerySQL, setShowQuerySQL] = useState(false)
    const [showTable, setShowTable] = useState(false)
    const [tableid, setTableid] = useState("")
    const [showModalBody, setShowModalBody] = useState(false)
    const [tableML, setTableML] = useState([])
    const [tableCluster, setTableCluster] = useState([])
    const [elbow, setElbow] = useState({ x_axis: false })
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [numberCluster, setNumberCluster] = useState(0)
    const [inputText, setInputText] = useState('')
    const [inputText2, setInputText2] = useState('')
    const urlQuery = "/campaignQuery3V3"
    const urlElbow = "/elbowMethod"
    const urlTrainCluster = "/trainCluster"
    const urlText = "/campaignTextV3"
    const limitCharacters = 120

    useEffect(() => {
        setTableNode([])
        setInputText(props.data.label)
        setInputText2(props.data.label)
    }, [])

    useEffect(() => {
        if (props.selected) console.log("I've been selected!");
    }, [props.selected]);

    const handleClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('id: ', props.id, " campaign_id: ", props.data.campaign_id, props);
        setTableid(props.id)
        let obj = {
            //Compania: store.user.JRCompaniaAut[0],
            node_id: props.id,
            campaign_id: props.data.campaign_id
        }

        console.log("Going to backend to make")
        let response = await actions.useFetch(urlQuery, obj, "POST");
        if (response.ok) {
            response = await response.json()
            //props.setTable(response.table)
            console.log(response)
            setTableNode(response.table)
            setQuerySQL(response.query)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'These customers will be used for Campaign\'s mail',
                showConfirmButton: false,
                timer: 3500
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error ocurred ',
                showConfirmButton: false,
                timer: 1500
            })
        }

    };

    const handleMouseDown = (event) => {
        console.log('Stop propagation.');
        event.stopPropagation();
    };

    const handleColumnToggle = (columnName) => {
        if (selectedColumns.includes(columnName)) {
            setSelectedColumns(selectedColumns.filter((col) => col !== columnName));
        } else {
            setSelectedColumns([...selectedColumns, columnName]);
        }
    };

    const exportData = tableNode.map((customer) => {
        const data = {};
        selectedColumns.forEach((col) => {
            data[col] = customer[col] || "";
        });
        return data;
    });

    let exportData2 = tableCluster.map((customer) => {
        const data = {};
        selectedColumns.forEach((col) => {
            data[col] = customer[col] || "";
        });
        return data;
    });

    const csvHeaders = selectedColumns.map((col) => ({ label: col, key: col }));

    const reducedTable = (columns, originalTable) => {
        const tablaFinal = originalTable.map(objeto => {
            return columns.reduce((resultado, indice) => {
                resultado[indice] = objeto[indice];
                return resultado;
            }, {});
        });
        //print(tablaFinal)
        setTableML(tablaFinal)
        return
    }

    const useStyles = makeStyles((theme) => ({
        modal: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            minHeight: "300px",
            width: "100%", /* celular */
            //minWidth: "540px",
            maxWidth: "700px",
            maxHeight: "640px",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            /* padding: theme.spacing(2, 4, 3), */
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "auto",
            overflowX: "auto",
            zIndex: 9999,
            padding: "0px",
            color: "black"
            /*  zIndex: "9999 !important", */
        },
        modal2: {
            position: "relative",
            display: "inline-block",
            justifyContent: "center",
            height: "600px",
            width: "fit-content", /* celular */
            minWidth: "400px",
            maxWidth: "max-content",
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #000",
            boxShadow: theme.shadows[5],
            /* padding: theme.spacing(2, 4, 3), */
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "scroll",
            zIndex: 9999,
            padding: "10px",
            zIndex: "9999 !important",
        },
        iconos: { cursor: "pointer", },
        inputMaterial: { width: "100%", },
    }));
    const styles = useStyles();

    const elbowMethod = async () => {
        setLoading(true)
        console.log("elbow method")
        let response = await actions.useFetch(urlElbow, {
            //Compania: store.user.JRCompaniaAut[0],
            table: tableML,
        }, "POST");

        if (response.ok) {
            response = await response.json()
            console.log("response: ", response)
            setLoading(false)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: response.message,
                showConfirmButton: false,
                timer: 1500
            })
            setElbow(response)

        } else {
            setLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error ocurred ',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }


    const onChange = async (event) => {
        console.log("changed")
        event.preventDefault();
        event.stopPropagation();
        console.log('id: ', props.id, " campaign_id: ", props.data.campaign_id, props);

        let obj = {
            //Compania: store.user.JRCompaniaAut[0],
            node_id: props.id,
            campaign_id: props.data.campaign_id,
            text: inputText
        }

        console.log("Going to backend to make")
        let response = await actions.useFetch(urlText, obj, "POST");
        if (response.ok) {
            response = await response.json()
            //props.setTable(response.table)
            console.log(response)
            setInputText(response.node.data.label)
            setInputText2(response.node.data.label)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Text saved correctly',
                showConfirmButton: false,
                timer: 3500
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error ocurred ',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    return (<>
        <div
            style={{
                border: '2px solid blue',
                textAlign: 'center',
                padding: 10,
                fontSize: '0.8rem',
                borderColor: props.selected ? 'green' : 'black',
                backgroundColor: props.selected ? '#E8E8E8' : 'yellow',
                color: 'black',
                maxHeight: !showQuerySQL ? '400px' : '100%',
                maxWidth: '350px',
                overflowY: 'auto'
            }}
        >
            {/* <Handle type="target" position="top" /> */}
            <div style={{ fontSize: 'x-large' }}>{inputText2}</div>
            <br />
            <textarea
                id="text"
                name="text" onChange={(e) => {
                    setInputText(e.target.value)
                }}
                className="nodrag"
                style={{ color: "black", width: "85%", padding: "5px" }}
                placeholder='Write a comment'
                onKeyDown={(event) => {
                    if (event.key === "Enter") { onChange(event) }}} />
            <br />
            <button className="nodrag btn btn-primary text-dark" onClick={onChange}>Save</button>
            {inputText.length > 0 ?
                <div className="row d-flex statistics">
                    <h5 className={inputText.length <= limitCharacters ? "limit-ok" : "limit-error"}>Characters (limit {limitCharacters}): {inputText.length}</h5>
                </div> :
                <></>
            }
            {/* <Handle type="source" position="bottom" /> */}
        </div>

    </>
    );
};
