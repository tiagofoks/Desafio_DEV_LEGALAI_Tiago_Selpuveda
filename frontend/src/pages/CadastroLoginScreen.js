import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh; /* Garante que o container ocupe pelo menos 80% da altura da viewport */
  padding: 20px;
  background-color: #f4f4f4;
`;

const Card = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Button = styled(Link)`
  display: block;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Text = styled.p`
  color: #666;
  margin-top: 20px;
`;

function CadastroLoginScreen() {
  return (
    <Container>
      <Card>
        <Title>Bem-vindo!</Title>
        <Button to="/cadastro">Criar uma Conta</Button>
        <Button to="/login">Já possui uma conta? Entrar</Button>
        <Text>Explore novas conexões e compartilhe seus interesses.</Text>
      </Card>
    </Container>
  );
}

export default CadastroLoginScreen;