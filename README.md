# Apriporta Web Application

This application provides a simple web interface to control Home Assistant locks.

## Project Structure

```
/
├── app/
│   ├── __init__.py
│   ├── main.py
│   └── static/
│       ├── index.html
│       ├── script.js
│       └── style.css
├── .dockerignore
├── Dockerfile
├── pyproject.toml
├── poetry.lock
└── README.md
```

## Local Development

### Prerequisites

- Python 3.9+
- Docker
- Poetry

### Setup


1.  **Run the application:**

    ```bash
    skaffold dev --default-repo ghcr.io/thekoma/apriporta --profile dev
    ```

    The application will be available at `http://127.0.0.1:8000`.

### Running with Docker

1.  **Build the Docker image:**

    ```bash
    docker build -t apriporta .
    ```

2.  **Run the Docker container:**

    ```bash
    docker run -d -p 80:80 --env-file .env apriporta
    ```
    The application will be available at `http://localhost`.


