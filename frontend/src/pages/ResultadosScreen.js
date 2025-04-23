import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ResultadoBusca from '../components/Busca/ResultadoBusca';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Titulo = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const ListaResultados = styled.div`
  width: 100%;
  max-width: 600px;
`;

const MensagemVazio = styled.p`
  color: #777;
  font-style: italic;
`;

function ResultadosScreen() {
  const location = useLocation();
  const resultados = location.state?.resultados || [];

  return (
    <Container>
      <Titulo>Resultados da Busca</Titulo>
      <ListaResultados>
        {resultados.length > 0 ? (
          resultados.map((resultado, index) => (
            <ResultadoBusca key={index} {...resultado} />
          ))
        ) : (
          <MensagemVazio>Nenhum resultado encontrado para sua busca.</MensagemVazio>
        )}
      </ListaResultados>
    </Container>
  );
}

export default ResultadosScreen;