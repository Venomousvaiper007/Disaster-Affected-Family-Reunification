from datetime import datetime, timezone

def calculate_data_freshness_hours(updated_at_dt: datetime) -> float:
    if not updated_at_dt:
        return 999.0
    now = datetime.now(timezone.utc)
    if updated_at_dt.tzinfo is None:
        updated_at_dt = updated_at_dt.replace(tzinfo=timezone.utc)
    return max(0.0, (now - updated_at_dt).total_seconds() / 3600.0)

def evaluate_freshness_label(hours_elapsed: float) -> str:
    if hours_elapsed <= 2.0:
        return "REAL_TIME"
    elif hours_elapsed <= 12.0:
        return "RECENT"
    elif hours_elapsed <= 48.0:
        return "STALE_WARNING"
    else:
        return "STALE"
