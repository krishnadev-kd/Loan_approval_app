from typing import Annotated, Literal
import pickle
import os
from unittest import result
import pandas as pd
from fastapi import FastAPI, Response
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse, HTMLResponse

with open("model.pkl", "rb") as f:
    saved_data = pickle.load(f)

model = saved_data["model"]
model_features = saved_data["features"]




app = FastAPI()
class UserInput(BaseModel):
    no_of_dependents:Annotated[int, Field(...,description="Number of dependents")]
    education: Annotated[Literal["Graduate", "Not Graduate"], Field(..., description="Education level (e.g., Graduate / Not Graduate)")]
    self_employed: Annotated[Literal["Yes", "No"], Field(..., description="Employment type (Yes / No for self-employed status)")]
    income_annum: Annotated[float, Field(..., description="Annual income")]
    loan_amount: Annotated[float, Field(..., description="Requested loan amount")]
    loan_term: Annotated[int, Field(..., description="Term of the loan")]
    cibil_score: Annotated[int, Field(..., description="Credit (CIBIL) score")]
    residential_assets_value: Annotated[float, Field(..., description="Value of residential assets")]
    commercial_assets_value: Annotated[float, Field(..., description="Value of commercial assets")]
    luxury_assets_value: Annotated[float, Field(..., description="Value of luxury assets")]
    bank_asset_value: Annotated[float, Field(..., description="Value of bank assets/savings")]


@app.post("/predict")
def predict_loan(user_input: UserInput):
    input_df = pd.DataFrame([{
        "no_of_dependents": user_input.no_of_dependents,
        "education": 1 if user_input.education == "Graduate" else 0,
        "self_employed": 1 if user_input.self_employed == "Yes" else 0,
        "income_annum": user_input.income_annum,
        "loan_amount": user_input.loan_amount,
        "loan_term": user_input.loan_term,
        "cibil_score": user_input.cibil_score,
        "residential_assets_value": user_input.residential_assets_value,
        "commercial_assets_value": user_input.commercial_assets_value,
        "luxury_assets_value": user_input.luxury_assets_value,
        "bank_asset_value": user_input.bank_asset_value,
    }])

    input_df = input_df[model_features]
    prediction = model.predict(input_df)[0]
    result = "Approved" if prediction == 1 else "Rejected"
    return JSONResponse(status_code=200, content={"prediction": int(prediction), "status": result})


# Serve Frontend Assets
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend")

@app.get("/", response_class=HTMLResponse)
def read_index():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read(), status_code=200)

@app.get("/style.css")
def read_css():
    css_path = os.path.join(FRONTEND_DIR, "style.css")
    with open(css_path, "r", encoding="utf-8") as f:
        return Response(content=f.read(), media_type="text/css")

@app.get("/app.js")
def read_js():
    js_path = os.path.join(FRONTEND_DIR, "app.js")
    with open(js_path, "r", encoding="utf-8") as f:
        return Response(content=f.read(), media_type="application/javascript")
