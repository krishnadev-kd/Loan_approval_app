# Loan Approval Prediction App

A FastAPI-based loan approval prediction application that combines a trained machine learning model with a simple web frontend. Users can enter borrower details, submit the form, and receive a loan decision along with a confidence score.

## Features

- Predict loan approval/rejection using a trained machine learning model
- Return a human-readable status and confidence score from the API
- Serve a lightweight frontend built with HTML, CSS, and JavaScript
- Expose health and prediction endpoints for easy integration

## Tech Stack

- Python
- FastAPI
- Pydantic
- Pandas
- Scikit-learn
- Uvicorn

## Project Structure

```text
app.py                 # FastAPI application entrypoint
frontend/              # HTML, CSS, and JavaScript frontend
model/                 # Trained model and prediction logic
schema/                # Pydantic request/response models
ml_script/             # Model training script
data/                  # Dataset used for training
```

## Installation

1. Clone the repository
2. Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install dependencies

```bash
pip install -r requirements.txt
```

## Running the Application

Start the FastAPI server:

```bash
uvicorn app:app --reload
```

Then open:

```text
http://127.0.0.1:8000
```

## API Endpoints

### POST /predict

Accepts loan application data and returns the prediction result.

Example request body:

```json
{
  "no_of_dependents": 1,
  "education": "Graduate",
  "self_employed": "No",
  "income_annum": 5000000,
  "loan_amount": 1200000,
  "loan_term": 10,
  "cibil_score": 720,
  "residential_assets_value": 5000000,
  "commercial_assets_value": 1000000,
  "luxury_assets_value": 500000,
  "bank_asset_value": 800000
}
```

Example response:

```json
{
  "prediction": 1,
  "status": "Approved",
  "confidence_score": 0.87
}
```

### GET /health

Returns the health status of the API.

## Re-training the Model

If you want to retrain the model, run:

```bash
python ml_script/train.py
```

This will generate or update the model file in the model directory.

## Notes

The model used by this project is a Random Forest classifier trained from the dataset in the data folder.
