import React, { useEffect, useState } from "react";
import axios from "axios";


const ListeVentes = () => {
    const [ventes, setVentes] = useState([]);


    useEffect(()=> {
        axios.get("http://localhost:5000/ventes/getventes").then((res) => setVentes(res.data));
    }, []);

    return (
        <div className="contrainer mt-4">
            <h2>Historique des ventes</h2>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Medicaments</th>
                        <th>Total</th>
                        <th>reduction</th>
                    </tr>
                </thead>
                <tbody>
                    {ventes.map((v) => (
                        <tr key={v._id}>
                            <td>{new Date(v.dateVente).toLocaleDateString()}</td>
                            <td>{v.client?.nom }</td>
                            <td>
                                {v.medicaments.map((m,idx)=> (
                                    <div key={idx}>
                                        {m.medicament?.nom} 

                                    </div>
                                ))}
                            </td>
                            <td>{v.total} CFA</td>
                            <td>{v.reduction || 0} CFA</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListeVentes;