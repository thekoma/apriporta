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

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd apriporta
    ```

2.  **Install the dependencies:**

    ```bash
    poetry install
    ```

3.  **Create a `.env` file** in the root of the project and add the following environment variables:

    ```
    HOME_ASSISTANT_URL=http://your-home-assistant-url
    HOME_ASSISTANT_API_KEY=your-home-assistant-api-key
    ```

4.  **Run the application:**

    ```bash
    poetry run uvicorn app.main:app --reload
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


## Deployment to Google Cloud Run

### Prerequisites

-   Google Cloud SDK installed and configured.
-   A project created on Google Cloud Platform.

### Steps

1.  **Enable required services:**

    ```bash
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    ```

2.  **Build the container image:**

    ```bash
    gcloud builds submit --tag gcr.io/[PROJECT-ID]/apriporta
    ```
    Replace `[PROJECT-ID]` with your Google Cloud project ID.

3.  **Deploy to Cloud Run:**

    ```bash
    gcloud run deploy apriporta --image gcr.io/[PROJECT-ID]/apriporta --platform managed --region [REGION] --allow-unauthenticated
    ```
    Replace `[PROJECT-ID]` and `[REGION]` with your project ID and desired region.

    **Note:** The `--allow-unauthenticated` flag is used here for simplicity. For a production environment, you should configure authentication as described in the project context. You would set up IAP (Identity-Aware Proxy) and configure the Cloud Run service to only accept requests from authenticated users. The backend would then need to be updated to validate the JWT token provided by IAP.
