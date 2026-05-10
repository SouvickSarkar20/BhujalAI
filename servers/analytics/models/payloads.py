from pydantic import BaseModel, Field
from typing import Optional

class RawDataRequest(BaseModel):
    location: str
    year: Optional[str] = "2023-2024"
    view: Optional[str] = "admin"
    locuuid: Optional[str] = "ffce954d-24e1-494b-ba7e-0931d8ad6085"
