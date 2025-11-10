# Stage 1: Build the virtual environment
FROM docker.io/library/python:3.13-slim
ENV PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.7.1 \
    PIP_PREFER_BINARY=1 \
    TZ='Europe/Rome'
# Install poetry
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir poetry && \
    poetry config virtualenvs.create false

# Set the working directory
WORKDIR /code

# Copy the dependency files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install --only main --no-interaction --no-ansi


# Copy the app directory
COPY ./app /code/app

EXPOSE 8080

# Command to run the application
# Uvicorn will be running on http://0.0.0.0:8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
