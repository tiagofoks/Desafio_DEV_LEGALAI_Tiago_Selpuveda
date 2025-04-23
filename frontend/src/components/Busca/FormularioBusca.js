import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;

  label {
    margin-bottom: 5px;
    color: #333;
    font-weight: bold;
  }

  input[type="text"],
  select {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 16px;
  }

  button {
    padding: 12px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

function FormularioBusca() {
  const [nome, setNome] = useState('');
  const [areaInteresse, setAreaInteresse] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/buscar_conexoes/', 
        {
          nome: nome,
          area_interesse: areaInteresse,
          localizacao: localizacao,
        }
      );

      if (response.data) {
        console.log('Resultados da API Python:', response.data);
        navigate('/resultados', { state: { resultados: response.data } });
      } else {
        console.error('Resposta da API Python vazia ou em formato inesperado');
      }

    } catch (error) {
      console.error('Erro ao buscar conexões:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor="nome">Nome:</label>
      <input
        type="text"
        id="nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Seu nome (opcional)"
      />

      <label htmlFor="areaInteresse">Área de Interesse:</label>
      <input
        type="text"
        id="areaInteresse"
        value={areaInteresse}
        onChange={(e) => setAreaInteresse(e.target.value)}
        placeholder="Ex: Tecnologia, Gastronomia, Música"
        required
      />

      <label htmlFor="localizacao">Localização:</label>
      <input
        type="text"
        id="localizacao"
        value={localizacao}
        onChange={(e) => setLocalizacao(e.target.value)}
        placeholder="Ex: São Paulo, Rio de Janeiro"
        required
      />

      <button type="submit">Buscar Conexões</button>
    </Form>
  );
}

export default FormularioBusca;