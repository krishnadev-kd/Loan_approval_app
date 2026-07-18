import os
from fastapi import FastAPI, Response
from fastapi.responses import HTMLResponse, JSONResponse
from model.predict import MODEL_VERSION, predict_output
from schema.user_input import UserInput

app = FastAPI()

# Serve Frontend Assets
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), 'frontend')


@app.post('/predict')
def predict_loan(user_input: UserInput):
    prediction = predict_output(user_input)
    status = 'Approved' if prediction == 1 else 'Rejected'
    return JSONResponse(status_code=200, content={'prediction': int(prediction), 'status': status})


@app.get('/', response_class=HTMLResponse)
def read_index():
    index_path = os.path.join(FRONTEND_DIR, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        return HTMLResponse(content=f.read(), status_code=200)


@app.get('/style.css')
def read_css():
    css_path = os.path.join(FRONTEND_DIR, 'style.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        return Response(content=f.read(), media_type='text/css')


@app.get('/app.js')
def read_js():
    js_path = os.path.join(FRONTEND_DIR, 'app.js')
    with open(js_path, 'r', encoding='utf-8') as f:
        return Response(content=f.read(), media_type='application/javascript')


@app.get('/health')
def health_check():
    return {'message': 'status OK', 'version': MODEL_VERSION}
