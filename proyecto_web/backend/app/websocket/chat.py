from fastapi import WebSocket, WebSocketDisconnect, Depends
from typing import List
import json
from app.database import SessionLocal
from app.utils.auth import verify_token
from app.models.user import User

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove disconnected clients
                self.active_connections.remove(connection)

manager = ConnectionManager()

async def get_user_from_token(token: str) -> User:
    """Get user from JWT token"""
    email = verify_token(token)
    if not email:
        return None
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        return user
    finally:
        db.close()

async def websocket_endpoint(websocket: WebSocket, token: str = None):
    await manager.connect(websocket)
    
    # Authenticate user if token provided
    user = None
    if token:
        user = await get_user_from_token(token)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # If user is authenticated, include user info
            if user:
                message_data["user_id"] = user.id
                message_data["user_name"] = user.name
            
            # Broadcast message to all connected clients
            await manager.broadcast(json.dumps(message_data))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket) 