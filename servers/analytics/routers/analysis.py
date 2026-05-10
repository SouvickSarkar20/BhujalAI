from fastapi import APIRouter, HTTPException
from models.payloads import RawDataRequest
from services import ingres_api
from processors.core import consumption, stress, recharge, disparity

router = APIRouter(prefix="/analyze", tags=["Analytics"])

@router.post("/stress")
def analyze_stress(request: RawDataRequest):
    try:
        raw_data = ingres_api.fetch_raw_data(
            location=request.location,
            year=request.year,
            view=request.view,
            locuuid=request.locuuid
        )
        
        actual_data = raw_data.get("sample", {})
        result = stress.calculate_groundwater_stress(actual_data)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
            
        return {"status": "success", "location": request.location, "analysis": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/consumption")
def analyze_consumption(request: RawDataRequest):
    try:
        raw_data = ingres_api.fetch_raw_data(
            location=request.location,
            year=request.year,
            view=request.view,
            locuuid=request.locuuid
        )
        
        actual_data = raw_data.get("sample", {})
        result = consumption.calculate_draft_profiling(actual_data)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
            
        return {"status": "success", "location": request.location, "analysis": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recharge")
def analyze_recharge(request: RawDataRequest):
    try:
        raw_data = ingres_api.fetch_raw_data(
            location=request.location,
            year=request.year,
            view=request.view,
            locuuid=request.locuuid
        )
        
        actual_data = raw_data.get("sample", {})
        result = recharge.calculate_recharge_efficiency(actual_data)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
            
        return {"status": "success", "location": request.location, "analysis": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/disparity")
def analyze_disparity(request: RawDataRequest):
    try:
        raw_data = ingres_api.fetch_raw_data(
            location=request.location,
            year=request.year,
            view=request.view,
            locuuid=request.locuuid
        )
        
        actual_data = raw_data.get("sample", {})
        result = disparity.calculate_command_disparity(actual_data)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
            
        return {"status": "success", "location": request.location, "analysis": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/locations")
def get_locations():
    try:
        data = ingres_api.fetch_locations()
        return {"status": "success", "locations": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
