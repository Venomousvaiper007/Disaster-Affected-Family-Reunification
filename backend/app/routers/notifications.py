from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.database.models import Notification

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("")
def list_notifications(db: Session = Depends(get_db)):
    notes = db.query(Notification).order_by(Notification.created_at.desc()).all()
    res = []
    for n in notes:
        res.append({
            "id": str(n.id),
            "recipientRole": n.recipient_role,
            "title": n.title,
            "message": n.message,
            "notificationType": n.notification_type,
            "isRead": n.is_read,
            "createdAt": n.created_at.isoformat() if n.created_at else ""
        })
    return res
