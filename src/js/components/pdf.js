import React, { useState, useEffect, useRef, createElement } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { saveAs } from 'file-saver';
//import { pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Modal, TextField, Button } from "@material-ui/core";
import html2pdf from 'html2pdf.js';
import Logo from "../../img/logo.png";


const DocuPDF = (props) => {
  const [visible, setVisible] = useState(false)
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [divTemp, setDivTemp] = useState(null);
  const [divTabla, setDivTabla] = useState(null);
  const ref = useRef();
  let container = document.querySelector("#pdf-data-div");
  let tagHTML;
  let containerTabla = document.querySelector("#pdf-tabla-div");
  if (props.idDiv) {
    tagHTML = document.querySelector(props.idDiv)
  }
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const downloadPdfDocument = (rootElementId) => {
    const inputDiv = document.querySelector(rootElementId);
    console.log("Div: ", inputDiv)
    let altura = 720;
    if (altura < inputDiv.clientHeight) {
      altura = inputDiv.clientHeight + 100;
      console.log("altura: ", altura)
    }

    let originalContents = document.querySelector("#pdf-root").innerHTML;
    let orientacion = props.orientacion ? "landscape" : "portrait"
    let element = inputDiv.innerHTML;
    let opt = {
      margin: 1,
      filename: 'Report.pdf',
      image: { type: 'png', quality: 1 },
      html2canvas: {
        dpi: 300,
        letterRendering: true,
        /* width: `${(inputDiv.clientWidth) / 1}`, */
        /* height: `${(inputDiv.clientHeight) / 1}`, */
        scale: 0.9
      },
      jsPDF: { unit: 'mm', format: 'letter', orientation: orientacion },
      pagebreak: { mode: ['avoid-all', 'css'] },

    };
    html2pdf().from(element).set(opt).save();
  }

  const toDom = (str) => {
    var tmp = document.createElement("div");
    tmp.innerHTML = str;
    return tmp.childNodes;
  };

  const bodyPDF = (
    <div id="pdf-root" target="_blank"
      style={{
        position: "center",
        display: "inline-block",
        justifyContent: "center",
        border: "2px solid #000",
        height: "100%",
        width: "100%",
        background: "white",
        justifyContent: "center",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        overflow: "auto",
      }}
    >
      <div style={{
        position: "right",
        display: "flex",
        width: "100%",
        paddingTop: "10px",
        justifyContent: "center",
        background: "white",
        zIndex: 9999,
      }}
        align="right"
        className="row">
        <div className='col-sm-2'></div>
        <div className='col-sm-3 mx-2'>
          <button type="button" className="btn btn-outline-success btn-sm" onClick={async () => {
            let tagInput = document.querySelectorAll("input")
            let newElement;
            if (tagInput.length > 0) {
              for (let i = 0; i < tagInput.length; i++) {
                newElement = document.createElement('span')
                tagInput[i].style = " height: 12px; text-align: center; vertical-align: center; line-height: 1.5; display: flex; justify-content:start; align-self:center; align-content:center; align-items:center; ";
                newElement.style = " height: 12px; text-align: center; vertical-align: middle; line-height: 1.5; display: flex; justify-content:start; align-self:center; align-content:center; align-items:center; ";
                for (const attr of tagInput[i].attributes) {
                  newElement.setAttribute(attr.name, attr.value)
                }
                newElement.innerHTML = tagInput[i].value;
                tagInput[i].replaceWith(newElement)
              }
            }
            let canvasSize = document.querySelector("#pdf-print")
            let tagTD = document.querySelectorAll("td")
            if (tagTD.length > 0) {
              for (let i = 0; i < tagTD.length; i++) {
                tagTD[i].style = " font-size: 12px; text-align: center; vertical-align: center; line-height: 1.5; justify-content:start; align-self:center; align-content:center; align-items:center; width: auto;";
              }
            }
            let tagh3 = document.querySelectorAll("h3")
            if (tagh3.length > 0) {
              for (let i = 0; i < tagh3.length; i++) {
                tagh3[i].style = " font-size: 14px; text-align: center; vertical-align: center; line-height: 1.5; justify-content:start; align-self:center; align-content:center; align-items:center; ";
              }
            }
            let tagh = document.querySelectorAll("th")
            if (tagh.length > 0) {
              for (let i = 0; i < tagh.length; i++) {
                tagh[i].style = " font-size: 12px; text-align: center; vertical-align: center; line-height: 1.5; justify-content:start; align-self:center; align-content:center; align-items:center; border: 1px solid black; padding: 2px; max-width: 100px;";
              }
            }
            /* canvasSize.style="height: 100vh;" */
            /* canvasSize.style="width: 100vw;" */
            downloadPdfDocument(`#pdf-print`)
          }}>Descargar PDF</button>
        </div>
        <div className='col-sm-3 mx-2'>
          <button type="button" className="btn btn-outline-success btn-sm" onClick={() => {
            setVisible(false)
          }}>Cerrar Ventana</button>
        </div>
      </div>

      <div id="pdf-print" style={{
        position: "relative",
        display: "inline-block",
        justifyContent: "center",
        height: "auto",
        width: "100%",
        minWidth: "800px",
        paddingLeft: "15px",
        paddingBottom: "15px",
        background: "white",
        justifyContent: "center",
        overflowY: "scroll",
        alignItems: "center",
        alignContent: "center"
      }}>
        <div className="navbar-brand">
          {/* <img className="logo1" src={Logo} /> */}
        </div>
        {props.file ? <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document> : <></>}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* En caso de haber título */}
          <h1 style={{ color: "#3388af", fontSize: "25px" }}>
            {props.titulo ? props.titulo : "Sin título"}
          </h1>
          <p>{props.subtitulo ? props.subtitulo : ""}</p>

          {/*  En caso de haber Imagenes */}
          {props.imagen ? <><img
            src={props.imagen}
            alt="random image"
            style={{ maxWidth: "600px", maxHeight: "400" }}
          /></> : <></>}

          {/* En caso de haber contenido como texto */}
          <p style={{ maxWidth: "70ch" }}>{props.contenido ? props.contenido : null}</p>
          {/* En caso de haber un div que se quiera imprimir tal y como es */}
          <div id="pdf-data-div" style={{ maxWidth: "100%", width: "98%" }}>
            <>
            </>
          </div>
          {/* En caso de haber tabla */}
          <br />
          <div id="pdf-tabla-div">
            <></>
          </div>
          {/* divTemp.map((item,index)=>{return(item)}) */}
          <br />
          {/* Página {pageNumber} of {numPages == null ? "1" : numPages} */}
        </div>

      </div>
    </div>)

  const abrirCerrarModal = () => {
    setVisible(!visible)
  }

  useEffect(() => {
    if (props.idDiv) {
      tagHTML = document.getElementById(props.idDiv);
      let child = tagHTML.childNodes
      let newArray = [...child];
      if (newArray != null) {
        setDivTemp(newArray);
      }
    }
    if (props.tabla) {
      containerTabla = document.querySelector("#pdf-tabla-div");
      setDivTabla(containerTabla);
    }
    return () => {
    }

  }, [visible])

  useEffect(() => {
    return () => {
      props.idDiv && divTemp != null && visible == true ? divTemp.map((item, index) => {
        if (document.querySelector("#pdf-data-div")) {
          return (document.querySelector("#pdf-data-div").innerHTML += item.outerHTML)
        }
      }) :
        <></>
    }
  }, [divTemp])

  useEffect(() => {
    return () => {
      let tableHead = ""
      let rowTabla = [];
      let tableBody = "";
      let longitud = props.tabla.length;
      let arrayTemp = props.tabla.slice()
      let colWidth = null;
      let colAlign = null;
      let negrilla = null;
      let backgroundColor = "#59c9b0";
      if (props.estiloTabla) {
        if (props.estiloTabla.anchoColumna) {
          colWidth = props.estiloTabla.anchoColumna;
        }
        if (props.estiloTabla.estilo["negrilla"]) {
          negrilla = props.estiloTabla.estilo["negrilla"];
        }
        if (props.estiloTabla.estilo["alineacion"]) {
          colAlign = props.estiloTabla.estilo["alineacion"];
        }else{
          colAlign = "center"
        }
      }

      props.tabla && visible == true ? props.tabla.map((item, index) => {
        {
          if (index == 0) {
            rowTabla = Object.keys(item); //lee la cantidad de claves que tiene un objeto y las devuelve en un array
            tableHead = "<table ><thead><tr >"; //inicia lectura de la tabla y de columnas
            for (let i = 0; i < rowTabla.length; i++) {
              tableHead += "<th style='width:" + `${colWidth != null ? colWidth[i] : 200}` + "px; " +
                "text-align:" + `${colAlign != null ? "center" : "center"}` + "; " +
                "font-size:" + `15px` + "; " +
                "background-color:" + `${backgroundColor}; ` +
                "'>" + item[`${rowTabla[i]}`] + "</th>";
            }
            tableHead += "</tr></thead>"; //cierra encabezado de columnas
          } else if (index == 1) {
            /*Se salta el índice 0 ahora*/
            for (let m = 1; m < longitud; m++) {
              tableBody += "<tr style='border-bottom: 1px solid #ddd; " +
                "font-weight:" + `${negrilla != null && negrilla.filter((x) => { return x == m }).length > 0 ? "bold" : "lighter"}` + "; " +
                "'>";
              for (let j = 0; j < rowTabla.length; j++) {
                tableBody += "<td style='width:" + `${colWidth != null ? colWidth[j] : 200}` + "px; " +
                  "text-align:" + `${colAlign != null ? colAlign[j] : "center"}` + "; " +
                  "font-size:" + `12px` + "; " +
                  "'>" + arrayTemp[m][`${rowTabla[j]}`] + "</td>";
              }
              tableBody += "</tr>";
            }
            /*Final de la tabla */
            tableHead += tableBody + "</table>";
          }
          //return (tableHead)
          if (document.querySelector("#pdf-data-div")) {
            return (document.querySelector("#pdf-tabla-div").innerHTML = tableHead)
          }
          return (tableHead)
        }
      }) :
        <></>
    }
  }, [divTabla])

  return (
    <>
      <button type="button" className="btn btn-outline-success btn-sm mx-1" onClick={() => {
        setVisible(!visible);
        container = document.querySelector("#pdf-data-div") ? document.querySelector("#pdf-data-div") : "No hay idDiv"
        containerTabla = document.querySelector("#pdf-tabla-div") ? document.querySelector("#pdf-tabla-div") : "No hay Tabla-div"
        if (props.idDiv) {
          tagHTML = document.getElementById(props.idDiv)
          let child = tagHTML.childNodes
          let newArray = [...child]
          setDivTemp(newArray)
        }
        if (props.tabla) {
          setDivTabla(props.tabla);
        }
      }}><i class="fa fa-file-pdf-o " aria-hidden="true"> </i>{props.textoBoton ? props.textoBoton : "PDF"} </button>
      <Modal open={visible} onClose={abrirCerrarModal} /* target="_blank" */>
        {bodyPDF}
      </Modal>
    </>
  );
};

export default DocuPDF; 