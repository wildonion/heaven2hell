from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, MetaData, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
import json 

DATABASE_URL = "postgresql://postgres:geDteDd0Ltg2135FJYQ6rjNYHYkGQa70@postgres:5432/heaven2hell"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 

Base = declarative_base()

class Entry(Base):
    __tablename__ = "heavennfts"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String, index=True)
    points = Column(Integer)
    heavennfts = Column(ARRAY(String))
    sent_tx_hashes = Column(ARRAY(String))
    hell = Column(ARRAY(String))
    converted_at = Column(Integer)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

app = FastAPI()

# Model for request body
class EntryCreate(BaseModel):
    owner: str
    points: int
    heaven: list[str]
    hell: list[str]
    sent_tx_hashes: list[str]
    converted_at: int

@app.get("/get-rarities")
async def get_json():
    with open("bejoe.json", "r") as f:
        content = json.load(f)
    return content

@app.get("/get-rarity/{nft_mint_addr}")
async def get_json_of_nft(nft_mint_addr: str):
    with open("bejoe.json", "r") as f:
        content = json.load(f)
    
    nfts = content["result"]["data"]["items"]
    for nft in nfts:
        if nft_mint_addr == nft["mint"]:
            return {"attributes": nft["attributes"], "rank": nft["rank"]}


@app.get("/items/")
def read_items(from_idx: int, to_idx: int, db: Session = Depends(get_db)):
    items = db.query(Entry).offset(from_idx).limit(to_idx - from_idx + 1).all()
    return items



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=6547)