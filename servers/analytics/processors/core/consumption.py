import pandas as pd

def calculate_draft_profiling(raw_data: dict) -> dict:
    """
    Analyzes the Sectoral Consumption (draftData) from the raw JSON payload
    using Pandas and returns the proportional usage in percentages.
    """
    draft_data = raw_data.get("draftData", {})
    if not draft_data:
        return {"error": "No draftData found in payload"}
    
    # We want the 'total' usage for each sector
    sectors = {
        "agriculture": draft_data.get("agriculture", {}).get("total", 0.0),
        "domestic": draft_data.get("domestic", {}).get("total", 0.0),
        "industry": draft_data.get("industry", {}).get("total", 0.0),
    }
    
    # Load into Pandas Series for easy mathematical operations
    s = pd.Series(sectors)
    total_consumption = s.sum()
    
    if total_consumption == 0:
        return {"total_consumption": 0, "percentages": {}}
        
    s_percentage = (s / total_consumption) * 100
    s_percentage = s_percentage.round(2)
    
    # Add an insight
    highest_consumer = s_percentage.idxmax()
    insight = f"The largest consumer is {highest_consumer.capitalize()}, accounting for {s_percentage.max()}% of total groundwater drafts."
    
    return {
        "total_consumption": float(total_consumption),
        "percentages": s_percentage.to_dict(),
        "primary_consumer": highest_consumer,
        "insight": insight
    }
