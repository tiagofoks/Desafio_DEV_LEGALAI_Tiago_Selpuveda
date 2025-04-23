import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ResultadoContainer = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;

  h3 {
    margin-top: 0;
    margin-bottom: 5px;
    color: #333;
  }

  p {
    margin-bottom: 8px;
    color: #666;
  }

  span {
    font-weight: bold;
    color: #007bff;
  }
`;

function ResultadoBusca({ nome, descricao, afinidade }) {
  return (
    <ResultadoContainer>
      <h3>{nome}</h3>
      <p>{descricao}</p>
      <p>Nível de Afinidade: <span>{afinidade}</span></p>
    </ResultadoContainer>
  );
}

ResultadoBusca.propTypes = {
  nome: PropTypes.string.isRequired,
  descricao: PropTypes.string.isRequired,
  afinidade: PropTypes.string.isRequired,
};

export default ResultadoBusca;