import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as firestore from "firebase/firestore";
import "./User.css";
import { db } from "../../firebase";

const User = ({ users }) => {
  const [active, setActive] = useState([]);
  const [ammountWarrancy, setAmmountWarrancy] = useState(0);

  const { cpf } = useParams();
  const user = users.find((user) => user.cpf === cpf);

  const handleSetActive = (e) => {
    if (!active.find((indexOf) => indexOf === e.currentTarget.value)) {
      setAmmountWarrancy(ammountWarrancy + 1);
      setActive([...active, e.currentTarget.value]);

      return;
    }

    const removeActive = active.filter(
      (itemId) => itemId != e.currentTarget.value
    );

    setActive(removeActive);
    setAmmountWarrancy(ammountWarrancy - 1);
  };

  const handleSendActiveCurrency = async (e) => {
    const userRef = firestore.doc(db, "Users", user.number);
    const getData = await firestore.getDoc(userRef);
    const response = getData.data();
    response.correctWarrancy = active.length;

    const warrancyNewData = response.warrancies.map((warrancy, index) => {
      warrancy.isValid = false;
      if (active.find((indexOf) => Number(indexOf) === index)) {
        warrancy.isValid = true;
      }

      return warrancy;
    });

    response.warrancies = warrancyNewData;
    await firestore.setDoc(userRef, response);
    window.location.href = `/${user.cpf}`;
  };

  return (
    <>
      <h1>{user?.nome}</h1>
      <div className="user-info">
        <p>CPF: {user?.cpf}</p>
        <p>CNPJ: {user?.cnpj}</p>
        <p>TELEFONE: {user?.number?.split("@").at(0)}</p>
      </div>

      <div className="user-table">
        <div className="user-table-row first-row">
          <p className="user-table-column">Informação</p>
          <p className="user-table-column">Foto 1</p>
          <p className="user-table-column">Foto 2</p>
          <p className="user-table-column">Checar</p>
        </div>
        {user?.warrancies?.map((warrancy, key) => (
          <div
            className={`user-table-row ${
              warrancy.isValid ? "valid" : "notValid"
            }`}
          >
            <p className="user-table-column">Garantia-{key + 1}</p>
            <img
              className="user-table-column"
              src={warrancy.imagem_1}
              alt="imagem garantia"
            />
            <img
              className="user-table-column"
              src={warrancy.imagem_2}
              alt="imagem garantia"
            />
            <input
              className="user-table-column checkbox"
              type="checkbox"
              value={key}
              onChange={handleSetActive}
            />
          </div>
        ))}
        <button onClick={handleSendActiveCurrency}>Apurar</button>
      </div>
    </>
  );
};

export default User;
