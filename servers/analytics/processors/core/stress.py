import pandas as pd

def calculate_groundwater_stress(raw_data: dict) -> dict:
    """
    Extracts the block total categories from reportSummary
    to compute the groundwater stress score across the scanned area.
    """
    report_summary = raw_data.get("reportSummary", {})
    if not report_summary:
        return {"error": "No reportSummary found in payload"}
        
    totals = report_summary.get("total", {}).get("BLOCK", {})
    if not totals:
        return {"error": "No BLOCK totals found in reportSummary"}
        
    # We load it into Pandas to calculate the distributions
    s = pd.Series(totals)
    total_blocks = s.sum()
    
    if total_blocks == 0:
        return {"total_blocks": 0, "distributions": {}}
        
    s_percentage = (s / total_blocks) * 100
    s_percentage = s_percentage.round(2)
    
    # Determine the risk level
    # Formula: Over Exploited + Critical blocks out of total
    high_risk_blocks = s.get("over_exploited", 0) + s.get("critical", 0)
    risk_percentage = (high_risk_blocks / total_blocks) * 100
    
    severity = "Low Risk"
    if risk_percentage > 50:
        severity = "Extremely High Risk"
    elif risk_percentage > 25:
        severity = "High Risk"
    elif risk_percentage > 10:
        severity = "Moderate Risk"
    
    insight = f"{risk_percentage:.1f}% of blocks are in Critical or Over Exploited state. The overall region is designated as {severity}."
    
    return {
        "total_blocks": int(total_blocks),
        "raw_counts": s.to_dict(),
        "distributions": s_percentage.to_dict(),
        "severity": severity,
        "insight": insight
    }
