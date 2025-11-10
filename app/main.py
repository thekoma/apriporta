from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import httpx
import toml
import os
import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Load configuration from config.toml
try:
    config = toml.load("config.toml")
    logger.info("Configuration loaded successfully.")
except FileNotFoundError:
    logger.error("config.toml not found.")
    config = {"buttons": []}
except toml.TomlDecodeError:
    logger.error("Error decoding config.toml.")
    config = {"buttons": []}


# Mount the static directory to serve frontend files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# In a real-world scenario, use environment variables and a more secure way to handle secrets
HOME_ASSISTANT_URL = os.getenv("HOME_ASSISTANT_URL", config.get("ha-endpoint", "homeassistant.local"))
HOME_ASSISTANT_API_KEY = os.getenv("HOME_ASSISTANT_API_KEY", config.get("ha-key"))


@app.get("/")
async def read_root():
    return FileResponse('app/static/index.html')

@app.get("/debug")
async def debug_page():
    return FileResponse('app/static/debug.html')

@app.get("/api/headers")
async def get_headers(request: Request):
    return JSONResponse(content=dict(request.headers))

@app.get("/api/buttons")
async def get_buttons():
    return config.get("buttons", [])

@app.post("/api/unlock/{entity_id}")
async def unlock_entity(
    entity_id: str,
    request: Request,
    x_authentik_username: Optional[str] = Header(None),
    x_authentik_email: Optional[str] = Header(None),
):
    real_ip = request.headers.get("x-real-ip") or request.headers.get("x-forwarded-for") or request.client.host
    username = x_authentik_username or "anonymous"
    email = x_authentik_email or "anonymous"

    logger.info(
        f"Unlock attempt: user='{username}' email='{email}' ip='{real_ip}' lock='{entity_id}'"
    )

    valid_entity_ids = [button["entity_id"] for button in config.get("buttons", [])]
    if entity_id not in valid_entity_ids:
        logger.warning(f"Invalid entity_id: {entity_id}")
        raise HTTPException(status_code=404, detail="Entity not found")

    headers = {
        "Authorization": f"Bearer {HOME_ASSISTANT_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {"entity_id": f"lock.{entity_id}"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{HOME_ASSISTANT_URL}/api/services/lock/unlock",
                headers=headers,
                json=data,
                timeout=5.0,
            )
            response.raise_for_status()
        logger.info(
            f"Successfully unlocked: user='{username}' email='{email}' ip='{real_ip}' lock='{entity_id}'"
        )
        return {"status": "success", "entity_id": entity_id}
    except httpx.RequestError as exc:
        logger.error(f"An error occurred while requesting {exc.request.url!r}.")
        raise HTTPException(status_code=500, detail="Error communicating with Home Assistant")
    except httpx.HTTPStatusError as exc:
        logger.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}.")
        raise HTTPException(status_code=500, detail="Error from Home Assistant")

