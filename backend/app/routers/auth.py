from fastapi import APIRouter, Header

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.get("/me")
def get_current_user_role(x_user_role: str = Header(default="ADMIN")):
    return {"role": x_user_role}
