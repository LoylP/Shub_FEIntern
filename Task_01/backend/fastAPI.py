from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
import pandas as pd
from pydantic import BaseModel
from fastapi import HTTPException
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_df = None

class TimeQuery(BaseModel):
    start_time: str
    end_time: str

@app.post("/upload")
async def endpoint(file: UploadFile):
    global latest_df
    content = await file.read()

    df = pd.read_excel(content, skiprows=7)  #Theo định dạng file excel của công ty thì 7 dòng đầu dùng để chú thích nên bỏ qua

    if 'Giờ' not in df.columns or 'Thành tiền (VNĐ)' not in df.columns:
        raise HTTPException(status_code=400, detail="Lỗi định dạng: Thiếu cột 'Giờ' hoặc 'Thành tiền (VNĐ)'")
    
    df = df[['Giờ', 'Thành tiền (VNĐ)']]  # Chỉ giữ lại cột Giờ và cột Thành tiền (VNĐ)
    latest_df = df
    return JSONResponse(content={"message": "File uploaded successfully"})

@app.post("/query")
async def query(query: TimeQuery):
    global latest_df
    if latest_df is None:
        raise HTTPException(status_code=400, detail="Không có dữ liệu để truy vấn")
    
    latest_df['Giờ'] = pd.to_datetime(latest_df['Giờ'], format="%H:%M:%S").dt.time

    start_time = datetime.strptime(query.start_time, "%H:%M:%S").time()
    end_time = datetime.strptime(query.end_time, "%H:%M:%S").time()
    
    filtered_df = latest_df[(latest_df['Giờ'] >= start_time) & (latest_df['Giờ'] <= end_time)]
    total = filtered_df['Thành tiền (VNĐ)'].sum()
    print(total)
    return JSONResponse(content={"total": float(total)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)