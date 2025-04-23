# python-api/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

BACKEND_NODEJS_URL = "http://backend:3000"

class UserData(BaseModel):
    nome: str = None
    area_interesse: str
    localizacao: str

class AfinidadeResultado(BaseModel):
    nome: str
    descricao: str
    afinidade: str

def obter_outros_usuarios():
    try:
        response = requests.get(f"{BACKEND_NODEJS_URL}/users/conexao_data")
        response.raise_for_status()  # Lança uma exceção para erros HTTP
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Erro ao comunicar com o backend: {e}")
        raise HTTPException(status_code=500, detail="Erro ao obter dados de usuários do backend")
    except Exception as e:
        print(f"Erro inesperado ao obter dados de usuários: {e}")
        raise HTTPException(status_code=500, detail="Erro inesperado ao obter dados de usuários")

def calcular_afinidades(user_data: UserData, outros_usuarios: List[dict]):
    areas_interesse = [user_data.area_interesse] + [u.get('interestArea', '') for u in outros_usuarios]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(areas_interesse)

    user_vector = tfidf_matrix[0]
    resultados_afinidade: List[AfinidadeResultado] = []

    for i, outro_usuario in enumerate(outros_usuarios):
        outro_interesse = outro_usuario.get('interestArea', '')
        if outro_interesse:
            outro_vector = tfidf_matrix[i + 1]
            similarity_score = cosine_similarity(user_vector, outro_vector)[0][0]
            afinidade_percentual = f"{int(similarity_score * 100)}%"
            resultados_afinidade.append(AfinidadeResultado(
                nome=outro_usuario.get('name', 'Desconhecido'),
                descricao=f"Interesse em comum: {outro_interesse}",
                afinidade=afinidade_percentual
            ))

    resultados_afinidade.sort(key=lambda x: float(x.afinidade[:-1]), reverse=True)

    return resultados_afinidade[:3]

@app.post("/buscar_conexoes/", response_model=List[AfinidadeResultado])
async def buscar_conexoes(user_data: UserData):
    outros_usuarios = obter_outros_usuarios()
    resultados = calcular_afinidades(user_data, outros_usuarios)
    return resultados

@app.get("/health")
async def health_check():
    return {"status": "ok"}