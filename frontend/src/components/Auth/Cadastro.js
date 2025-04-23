import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', age: '', interestArea: '', location: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/register', formData);
      console.log('Cadastro realizado com sucesso!', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="age">Idade:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="interestArea">Área de Interesse:</label>
        <input
          type="text"
          id="interestArea"
          name="interestArea"
          value={formData.interestArea}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="location">Localização:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default Cadastro;