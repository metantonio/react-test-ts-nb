import React from "react";
import "./template1.css"

const Template2 = () => {

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

                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                            <td align="center" valign="top" width="600">

                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: "600px" }}>
                                    <tr>
                                        <td className="header" align="center" bgcolor="#ffffff"
                                            style={{ fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', borderTop: "3px #d4dadf", backgroundImage: `url('https://descubrecomohacerlo.com/wp-content/uploads/mch/mensaje-persona-recibio_9575.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: "contain", backgroundPosition: "center" }}>
                                            <h1
                                                style={{ textAlign: 'center', color: 'white', marginTop: '110px', fontSize: '25px', fontWeight: 700, letterSpacing: '-1px', lineHeight: '48px' }} >
                                                Type Transaction: {"type_transaction"} </h1>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                    </table>

                </td>
            </tr>

            <tr>
                <td align="center" bgcolor="#e9ecef">

                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                        <tr>
                            <td align="center" valign="top" width="600">

                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: "600px" }}>

                                    <tr>
                                        <td align="left" bgcolor="#ffffff"
                                            style={{ padding: "24px 24px 0px 24px", fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: "16px" }}>
                                            <p>{"type_transaction"}, Transaction made recently.</p>
                                        </td>
                                    </tr>


                                    <tr>
                                        <td cellpadding="0" cellspacing="0" bgcolor="#ffffff"
                                            style={{ padding: "0px 24px 0px 24px", fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: "11px", lineHeight: "24px", clear: "both" }}>
                                            <p style={{ fontSize: "16px" }}><strong>Invoice #:</strong> </p>
                                            <h3 style={{ float: "left" }}>{"invoice_id"}</h3>
                                            <h3 style={{ float: "right" }}>{"date"}</h3>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="5" align="left" bgcolor="#ffffff"
                                            style={{ padding: "24px", fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: "16px", lineHeight: "22px" }}>
                                            <table className="purchase_content" width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <th className="purchase_heading" align="left">
                                                        <p className="f-fallback">Description</p>
                                                    </th>
                                                    <th className="purchase_heading" align="right">
                                                        <p className="f-fallback">Amount</p>
                                                    </th>
                                                </tr>                                                
                                                <tr>
                                                    <td width="80%" className="purchase_item"><span
                                                        className="f-fallback">{"item_description"}</span></td>
                                                    <td align="right" width="20%" className="purchase_item"><span
                                                        className="f-fallback">{"item_amount"}</span></td>
                                                </tr>

                                                <tr>
                                                    <td width="80%" className="purchase_footer" valign="middle">
                                                        <p className="f-fallback purchase_total purchase_total--label">Total</p>
                                                    </td>
                                                    <td width="20%" className="purchase_footer" valign="middle">
                                                        <p align="right">{"total"}</p>
                                                    </td>
                                                </tr>
                                            </table>
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
                    </table>

                </td>
            </tr>

            <tr>
                <td align="center" bgcolor="#e9ecef" style={{ padding: "24px" }}>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: "600px" }}>
                        <tr>
                            <td align="center" bgcolor="#e9ecef"
                                style={{ padding: '12px 24px', fontFamily: 'Source Sans Pro, Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '20px', color: "#666" }}>
                                <p style={{ margin: "0" }}>You received this email because you have registered a transaction in
                                    {"company_name"}. In case you have not requested the creation of this transaction with us, notify to {" "}
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

export default Template2
