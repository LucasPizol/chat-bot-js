import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function Main({ users }) {
  const navigate = useNavigate();

  const saveCSV = () => {
    const rowsFormmatedToCSV = users.map(
      ({ nome, cnpj, cpf, correctWarrancy }) => [
        nome,
        cnpj,
        cpf,
        correctWarrancy,
      ]
    );

    let csvContent = "data:text/csv;charset=utf-8,";
    rowsFormmatedToCSV.forEach((rowArray, index) => {
      let row = rowArray.join(",");

      if (index === 0)
        csvContent += `NOME,CNPJ,CPF,CERTIFICADOS VALIDOS` + "\r\n";

      csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <div className="main-table">
      <button onClick={saveCSV}>Salvar CSV</button>
      <div className="main-table-row first-row">
        <p className="main-table-column">Nome</p>
        <p className="main-table-column">CNPJ</p>
        <p className="main-table-column">CPF</p>
        <p className="main-table-column">CERTIFICADOS TOTAIS</p>
        <p className="main-table-column">CERTIFICADOS VÁLIDOS</p>
      </div>

      {users
        ?.sort((a, b) => a.nome - b.nome)
        ?.map((user, key) => (
          <div
            className="main-table-row"
            key={key}
            onClick={() => navigate(`/${user.cpf}`)}
          >
            <p className="main-table-column">{user.nome}</p>
            <p className="main-table-column">{user.cnpj}</p>
            <p className="main-table-column">{user.cpf}</p>
            <p className="main-table-column">{user.warrancies?.length || 0}</p>
            <p className="main-table-column">{user.correctWarrancy || 0}</p>
          </div>
        ))}
    </div>
  );
}

export default Main;
