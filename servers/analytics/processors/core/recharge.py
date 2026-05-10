import pandas as pd

def calculate_recharge_efficiency(raw_data: dict) -> dict:
    """
    Calculates Rainfall-to-Recharge Efficiency and Natural vs Artificial 
    recharge composition.
    """
    recharge_data = raw_data.get("rechargeData", {})
    rainfall_data = raw_data.get("rainfall", {})
    
    if not recharge_data or not rainfall_data:
        return {"error": "Missing recharge or rainfall data in payload"}
    
    # Measured rainfall total
    total_rainfall_measured = rainfall_data.get("total", 0.0)
    
    # Recharge contributed by rainfall
    recharge_from_rainfall = recharge_data.get("rainfall", {}).get("total", 0.0)
    
    # Entire recharge from all sources
    total_recharge_all = recharge_data.get("total", {}).get("total", 0.0)
    
    # Rainfall Efficiency: How much of the actual rainfall enters the aquifer
    efficiency = 0.0
    if total_rainfall_measured > 0:
        efficiency = (recharge_from_rainfall / total_rainfall_measured) * 10 
        # (This is a simplified index for demonstration, scaled similarly to 
        # natural ground water recharge norms)
        efficiency = round(efficiency, 2)
        
    # Natural vs Artificial
    natural = recharge_from_rainfall
    artificial = total_recharge_all - natural
    
    recharge_mix = {
        "natural": round(natural, 2),
        "artificial": round(max(0, artificial), 2)
    }
    
    # Percentage mix
    mix_pct = {}
    if total_recharge_all > 0:
        mix_pct["natural"] = round((natural / total_recharge_all) * 100, 2)
        mix_pct["artificial"] = round((max(0, artificial) / total_recharge_all) * 100, 2)
        
    insight = f"Groundwater is recharged primarily through { 'Natural' if natural > artificial else 'Artificial' } sources ({mix_pct.get('natural', 0)}% natural)."
    
    return {
        "efficiency_index": efficiency,
        "recharge_mix": recharge_mix,
        "recharge_percentages": mix_pct,
        "total_recharge": round(total_recharge_all, 2),
        "insight": insight
    }
