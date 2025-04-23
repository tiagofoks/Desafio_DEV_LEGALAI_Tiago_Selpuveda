import React from 'react';
import FormularioBusca from '../components/Busca/FormularioBusca';
import styled from 'styled-components';

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

function FormularioScreen() {
  return (
    <Container>
      <Titulo>Buscar Conexões</Titulo>
      <FormularioBusca />
    </Container>
  );
}

export default FormularioScreen;