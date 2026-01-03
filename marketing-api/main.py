from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import sqlalchemy
from sqlalchemy.orm import sessionmaker, declarative_base

# Database Setup
DATABASE_URL = "sqlite:///./marketing.db"
engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model
class Campaign(Base):
    __tablename__ = "campaigns"
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, index=True)
    name = sqlalchemy.Column(sqlalchemy.String)
    spend = sqlalchemy.Column(sqlalchemy.Float, default=0.0)
    clicks = sqlalchemy.Column(sqlalchemy.Integer, default=0)
    impressions = sqlalchemy.Column(sqlalchemy.Integer, default=0)
    conversions = sqlalchemy.Column(sqlalchemy.Integer, default=0)

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class CampaignBase(BaseModel):
    name: str
    spend: float
    clicks: int
    impressions: int
    conversions: int

class CampaignResponse(CampaignBase):
    id: int
    ctr: float
    cpc: float
    cpa: float

    class Config:
        from_attributes = True

# App Initialization
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# KPI Calculation Helper
def calculate_metrics(c):
    # Formulas: 
    # CTR = (Clicks / Impressions) * 100
    # CPC = Spend / Clicks
    # CPA = Spend / Conversions
    ctr = (c.clicks / c.impressions * 100) if c.impressions > 0 else 0
    cpc = (c.spend / c.clicks) if c.clicks > 0 else 0
    cpa = (c.spend / c.conversions) if c.conversions > 0 else 0
    return {
        "id": c.id, "name": c.name, "spend": c.spend, "clicks": c.clicks,
        "impressions": c.impressions, "conversions": c.conversions,
        "ctr": round(ctr, 2), "cpc": round(cpc, 2), "cpa": round(cpa, 2)
    }

@app.post("/campaigns/", response_model=CampaignResponse)
def create_campaign(campaign: CampaignBase):
    db = SessionLocal()
    db_campaign = Campaign(**campaign.model_dump())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return calculate_metrics(db_campaign)

@app.get("/campaigns/", response_model=List[CampaignResponse])
def get_campaigns():
    db = SessionLocal()
    campaigns = db.query(Campaign).all()
    return [calculate_metrics(c) for c in campaigns]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)