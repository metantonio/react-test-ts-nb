const BASE_URL = process.env.BASE_URL;
const BASE_URL2 = process.env.BASE_URL2;

import { auto } from "@popperjs/core";
import { userStore, userActions } from './users.js'
import { promptStore, promptActions } from "./promptLLM.js";
import { workflowStore, workflowActions } from "./iqWorkflow.js";
import { dashboardStore, dashboardActions } from "./dashboard.js";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			...userStore,
			...promptStore,
			...workflowStore,
			...dashboardStore,
			traders: [],
			expandwin: false,
			tasas: [],
			opciones: "",
			opciones2: "",
			opciones3: "",
			opcOrigen: "",
			OpcForPago: "",
			opcForCobro: "",
			opcDiviSol: "",
			opcDivInter: "",
			opcionesIndex: [""],
			bancos: [],
			divisas: [],
			operacion: [],
			estCuenta: [],
			ctlContabilidad: [],
			tablas: [],
			traspaso: [],
			registroTraspaso: {},
			dataExportadaOperaciones: {},
			perContable: [],
			comprobanteEstructura: {},
			estCuentaEstructura: {},
			movContable: [],
			movimientoCaja: [],
			registroMovContable: {},
			movimientoCaja: [],
			caja: [],
			grupoReportes: "",
			cajero: "",
			codigoTablas: {},
			scanedWebs: [],
			version: "v1.00"
		},
		actions: {
			...userActions(getStore, getActions, setStore),
			...promptActions(getStore, getActions, setStore),
			...workflowActions(getStore, getActions, setStore),
			...dashboardActions(getStore, getActions, setStore),

			useFetch: async (endpoint, data, metodo = "GET") => {
				let url = BASE_URL2 + endpoint;
				let actions = getActions();
				let store = getStore();
				try {
					let response;
					if (metodo != "GET") {
						response = await fetch(url, {
							method: metodo,
							headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
							body: JSON.stringify(data)
						});
					} else {
						response = await fetch(url, {
							method: metodo,
							headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` }
						});
					}
					//let respuesta = await response.json();
					console.log("response: ", endpoint);
					//console.log(respuesta);
					//setStore({variableKey: respuesta});
					if (response.status == 401) {
						alert("Session has expired")
					}
					return response;
				} catch (error) {
					console.log("error making the request: ", error);
				}

				return { message: "error" };
			},
			putGenerico: async (endpoint, data) => {
				let url = BASE_URL + endpoint;
				let actions = getActions();
				let store = getStore();
				try {
					let response = await fetch(url, {
						method: "PUT",
						headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
						body: JSON.stringify(data)
					});
					//let respuesta = await response.json();
					console.log("Información obtenida: ", endpoint);
					//console.log(respuesta);
					//setStore({variableKey: respuesta});
					return response;
				} catch (error) {
					console.log(error);
				}

				return true;
			},
			volverLogin: (historia) => {
				let actions = getActions();
				actions.logOut();
				return historia.push("/");
			},
			coinFormat: (value) => {
				let formatter = new Intl.NumberFormat('de-DE', {
					minimumFractionDigits: 2,
				})
				return formatter.format(value)
			},
			dolarFormat: (value) => {
				let formatter = new Intl.NumberFormat('en-US', {
					minimumFractionDigits: 2,
				})
				return formatter.format(value)
			},
			addThousand: (nStr) => { //Function to add (,) thousand separator in inputs boxes, while user write a number
				nStr += '';
				let mil = /,/g;
				nStr = nStr.replace(mil, '');
				let x = nStr.split('.');
				let x1 = x[0];
				//console.log("x1 version 1: ", x1)
				let x2 = x.length > 1 ? '.' + x[1] : '';
				let rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				}
				/* console.log("mil: ",mil)
				console.log("nStr: ", nStr)
				console.log("x: ", x)
				console.log("x1: ", x1)
				console.log("x2: ", x2)
				console.log("rgx: ", rgx) */
				return x1 + x2;
			},
			flattenObj: (ob) => {
				let actions = getActions();
				// The object which contains the
				// final result
				let result = {};

				// loop through the object "ob"
				for (const i in ob) {

					// We check the type of the i using
					// typeof() function and recursively
					// call the function again
					if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
						const temp = actions.flattenObj(ob[i]);
						for (const j in temp) {

							// Store temp in result
							result[i + '.' + j] = temp[j];
						}
					}

					// Else store ob[i] in result directly
					else {
						result[i] = ob[i];
					}
				}
				return result;
			},
			sort: (a, b) => { //válida si se comparan números, no string
				return a - b
			},
			sortKeys: (array, key) => { //ordena un arreglo de objetos, según el valor de la clave de los objetos
				return array.sort(function (a, b) {
					let x = a[key]; let y = b[key];
					return ((x < y) ? -1 : ((x > y) ? 1 : 0));
				});
			},
			// define a function that takes an array of objects and an array of properties
			removeDuplicates: (originalArray, props) => {
				// create a new array using filter method
				let newArray = originalArray.filter((obj, index) => {
					// join the values of the given properties using a separator
					let propValues = props.map(prop => obj[prop]).join('|');
					// find the index of the first object with the same propValues
					let firstIndex = originalArray.findIndex(o => props.map(prop => o[prop]).join('|') === propValues);
					// return true if the current index is equal to the first index
					return index === firstIndex;
				});
				return newArray;
			}
		}
	};
};

export default getState;
