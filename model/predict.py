import os
import pickle
import pandas as pd

from schema.user_input import UserInput

MODEL_VERSION = '1.0.0'

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'model.pkl')

with open(MODEL_PATH, 'rb') as f:
    saved_data = pickle.load(f)

_model = saved_data['model']
_model_features = saved_data['features']


def _normalize_user_input(user_input):
    if isinstance(user_input, UserInput):
        return {
            'no_of_dependents': user_input.no_of_dependents,
            'education': 1 if user_input.education == 'Graduate' else 0,
            'self_employed': 1 if user_input.self_employed == 'Yes' else 0,
            'income_annum': user_input.income_annum,
            'loan_amount': user_input.loan_amount,
            'loan_term': user_input.loan_term,
            'cibil_score': user_input.cibil_score,
            'residential_assets_value': user_input.residential_assets_value,
            'commercial_assets_value': user_input.commercial_assets_value,
            'luxury_assets_value': user_input.luxury_assets_value,
            'bank_asset_value': user_input.bank_asset_value,
        }

    if isinstance(user_input, dict):
        return dict(user_input)

    raise TypeError('user_input must be a UserInput model or a dictionary')


def predict_output(user_input):
    normalized_input = _normalize_user_input(user_input)
    input_df = pd.DataFrame([normalized_input])
    input_df = input_df.reindex(columns=_model_features, fill_value=0)
    output = _model.predict(input_df)[0]
    return int(output)