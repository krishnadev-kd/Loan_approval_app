import pickle
import pandas as pd
import numpy as np

def main():
    model_path = 'model/model.pkl'
    print(f"Loading model from {model_path}...")
    with open(model_path, 'rb') as f:
        model_data = pickle.load(f)
        
    model = model_data['model']
    features = model_data['features']
    
    print("\nLoaded features:", features)
    print("Model details:", model)
    
    # Create a dummy sample matching features
    # features: ['no_of_dependents', 'education', 'self_employed', 'income_annum', 'loan_amount', 'loan_term', 'cibil_score', 'residential_assets_value', 'commercial_assets_value', 'luxury_assets_value', 'bank_asset_value']
    sample_data = {
        'no_of_dependents': [2],
        'education': [1],  # Graduate
        'self_employed': [0],  # No
        'income_annum': [9600000],
        'loan_amount': [29900000],
        'loan_term': [12],
        'cibil_score': [778],
        'residential_assets_value': [2400000],
        'commercial_assets_value': [17600000],
        'luxury_assets_value': [22700000],
        'bank_asset_value': [8000000]
    }
    
    sample_df = pd.DataFrame(sample_data)
    
    # Align columns
    sample_df = sample_df[features]
    
    prediction = model.predict(sample_df)
    proba = model.predict_proba(sample_df)
    
    status = 'Approved' if prediction[0] == 1 else 'Rejected'
    print(f"\nPrediction for sample: {status}")
    print(f"Prediction probabilities: Approved={proba[0][1]:.4f}, Rejected={proba[0][0]:.4f}")

if __name__ == '__main__':
    main()
