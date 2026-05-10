import pandas as pd

def calculate_command_disparity(raw_data: dict) -> dict:
    """
    Compares groundwater extraction metrics between Command Areas (canal-linked)
    and Non-Command Areas to identify disparities.
    """
    soe = raw_data.get("stageOfExtraction", {})
    future_avail = raw_data.get("availabilityForFutureUse", {})
    
    if not soe or not future_avail:
        return {"error": "Missing SOE or future availability data in payload"}
    
    # We want to compare command vs non_command
    extraction = {
        "command": soe.get("command", 0.0),
        "non_command": soe.get("non_command", 0.0)
    }
    
    availability = {
        "command": future_avail.get("command", 0.0),
        "non_command": future_avail.get("non_command", 0.0)
    }
    
    # Create Comparison DataFrame
    df = pd.DataFrame([extraction, availability], 
                       index=["stage_of_extraction", "future_availability"]).T
    
    # Identify the Gap
    # If Command area extraction is significantly lower than Non-Command 
    # despite being canal-serviced, it indicates a disparity
    extraction_gap = extraction["non_command"] - extraction["command"]
    
    disparity_risk = "Low"
    if extraction_gap > 10.0:
        disparity_risk = "High"
    elif extraction_gap > 5.0:
        disparity_risk = "Moderate"
        
    insight = f"There is a {extraction_gap:.2f}% gap in extraction between Non-Command and Command areas, indicating a {disparity_risk} disparity risk."
    
    return {
        "extraction_levels": extraction,
        "future_availability": availability,
        "disparity_risk": disparity_risk,
        "extraction_gap": round(extraction_gap, 2),
        "insight": insight
    }
