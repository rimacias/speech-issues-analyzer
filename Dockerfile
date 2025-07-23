# Imagen base con soporte para GPU (PyTorch con CUDA 12.1)
FROM pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime
LABEL authors="Moncho"

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY requirements.txt .

# Actualizar pip y sistemas base
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Descargar modelos de Spacy y NLTK
RUN python -m spacy download es_core_news_sm && \
    python -c "import nltk; nltk.download('punkt')"

# Copiar el resto del proyecto
COPY trainer .

# Comando por defecto (modificable según uso: app.py, API, etc.)
CMD ["python", "main.py"]

ENTRYPOINT ["top", "-b"]