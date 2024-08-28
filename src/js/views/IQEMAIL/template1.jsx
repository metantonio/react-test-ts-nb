import React from "react";
import "./template1.css"

const Template1 = () => {

    return (<>
        <div className="preheader"
            style={{ display: "none", maxWidth: 0, maxHeight: 0, overflow: 'hidden', fontSize: "1px", lineHeight: "1px", color: "#fff", opacity: 0 }}>
            Hi {'first_name'}
        </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: "600px" }}>
                        <tr>
                            <td align="center" valign="top" style={{ padding: "36px 24px", visibility: "hidden" }}>
                                <a href="https://github.com/metantonio" target="_blank" style={{ display: "inline-block" }}>

                                </a>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef">

                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: "600px" }}>
                        <tr>
                            <td className="header" align="center" bgcolor="#ffffff"
                                style={{ fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', borderTop: "3px #d4dadf", backgroundImage: `url('https://descubrecomohacerlo.com/wp-content/uploads/mch/mensaje-persona-recibio_9575.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: "contain", backgroundPosition: "center" }}>
                                <h1
                                    style={{ textAlign: 'center', color: 'white', marginTop: '110px', fontSize: '25px', fontWeight: 700, letterSpacing: '-1px', lineHeight: '48px' }} >
                                    {'title_img'}</h1>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: "600px" }}>
                        <tr>
                            <td align="left" bgcolor="#ffffff"
                                style={{ padding: "24px 24px 0px 24px", fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: "18px" }}>

                                <p>Hi {'first_name'},</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: "600px" }}>
                        <tr>
                            <td align="left" bgcolor="#ffffff"
                                style={{ padding: "24px 24px 0px 24px", fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: "18px" }}>
                                <p>Title: {'title'}</p>
                                <p>Message:</p>
                                <p>{'message'}</p>
                                <p
                                    style={{ display: "flex", justifyContent: 'center', padding: '30px', background: 'whitesmoke', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    Start: {'start'}
                                </p>
                                <p
                                    style={{ display: "flex", justifyContent: 'center', padding: '30px', background: 'whitesmoke', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    End: {'end'}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" bgcolor="#ffffff"
                                style={{ padding: "24px", fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: '16px', lineHeight: '24px', borderBottom: '3px solid #d4dadf' }}>
                                <p style={{ margin: "0" }}>{"company_name"},<br /> Thanks.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" bgcolor="#e9ecef" style={{ padding: "24px" }}>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: "600px" }}>
                        <tr>
                            <td align="center" bgcolor="#e9ecef"
                                style={{ padding: '12px 24px', fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '20px', color: "#666" }}>
                                <p style={{ margin: "0" }}>You received this email because you have registered an appointment in 
                                    {"company_name"}. In case you have not requested the creation of an appointment with us, notify to {" "}  
                                    {"support_email"}</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" bgcolor="#e9ecef"
                                style={{ padding: '12px 24px', fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '20px', color: "#666" }}>
                                <p style={{ margin: "0" }}>Message sent by {"company_name"}, {"support_email"}
                                </p>
                                <p style={{ margin: "0" }}>{"company_address"}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </>)
}

export default Template1
