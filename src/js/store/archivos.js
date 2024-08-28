export const archivosStore = {
	imagenCargada:false,
}

export function archivosActions(getStore, getActions, setStore) {
    const BASE_URL = process.env.BASE_URL;
    const BASE_URL2 = process.env.BASE_URL2;
    return {
        downloadBase64File: async (base64Data, contentType, fileName)=> {
            const linkSource = `data:${contentType};base64,${base64Data}`;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          },
        getArchivos: async (endpoint, data) => {
            let url = BASE_URL + endpoint;
            let actions = getActions();
            let store = getStore();

            let respuesta = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "responseType": "blob",
                    "Authorization":localStorage.getItem("token")
                },
                body: JSON.stringify(data),
                responseType: "blob"
            })
            let respuestaServer
            if (!respuesta.ok) {
                respuestaServer = await respuesta.json()
                alert(respuestaServer)
                return
            }
            //let respuestaServer = await respuesta.json()
            //alert(respuestaServer)
            /* if(respuestaServer=="png"){
                actions.downloadBase64File('base64-image-string', 'image/png', 'test.png');
                return
            } */
            let archivoBlob = await respuesta.blob()
            console.log(archivoBlob)
            
            // Create blob link to download
            const url2 = window.URL.createObjectURL(
                new Blob([archivoBlob]), //{ type: "application/octet-stream" }
            );
            const link = document.createElement('a');
            link.href = url2;
            link.setAttribute(
                'download',
                `${data.archivo}`,
            );

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);

            URL.revokeObjectURL(url2);
            
            
            return
        },
    }
}