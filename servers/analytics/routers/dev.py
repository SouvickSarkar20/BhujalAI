from fastapi import APIRouter, HTTPException
from models.payloads import RawDataRequest
from services import ingres_api

router = APIRouter()

@router.post("/raw-data")
def get_raw_data(request: RawDataRequest):
    try:
        data = ingres_api.fetch_raw_data(
            location=request.location,
            year=request.year,
            view=request.view,
            locuuid=request.locuuid
        )
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
