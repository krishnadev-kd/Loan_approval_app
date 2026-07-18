import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle

def main():
    # 1. Load Dataset
    data_path = 'loan_approval_dataset.csv'
    print(f"Loading dataset from {data_path}...")
    df = pd.read_csv(data_path)
    
    # 2. Data Cleaning
    print("Performing data cleaning...")
    # Strip whitespaces from column names
    df.columns = df.columns.str.strip()
    
    # Strip whitespaces from string values in object columns
    for col in df.select_dtypes(include=['object', 'string']).columns:
        df[col] = df[col].str.strip()
        
    # Check for missing values
    missing_vals = df.isnull().sum().sum()
    if missing_vals > 0:
        print(f"Found {missing_vals} missing values. Dropping rows with missing values...")
        df = df.dropna()
    else:
        print("No missing values found.")

    # 3. Feature Engineering
    print("Performing feature engineering...")
    # Drop loan_id as it is a unique identifier
    if 'loan_id' in df.columns:
        df = df.drop(columns=['loan_id'])
        
    # Map categorical columns to numerical values
    # education: 'Graduate' -> 1, 'Not Graduate' -> 0
    if 'education' in df.columns:
        df['education'] = df['education'].map({'Graduate': 1, 'Not Graduate': 0})
        
    # self_employed: 'Yes' -> 1, 'No' -> 0
    if 'self_employed' in df.columns:
        df['self_employed'] = df['self_employed'].map({'Yes': 1, 'No': 0})
        
    # loan_status (target): 'Approved' -> 1, 'Rejected' -> 0
    if 'loan_status' in df.columns:
        df['loan_status'] = df['loan_status'].map({'Approved': 1, 'Rejected': 0})
        
    feature_names = list(df.drop(columns=['loan_status']).columns)
    print("\nDataset Shape after preprocessing:", df.shape)
    print("Features:", feature_names)
    
    # 4. Train/Test Split
    X = df.drop(columns=['loan_status'])
    y = df['loan_status']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train set shape: {X_train.shape}, Test set shape: {X_test.shape}")
    
    # 5. Train Random Forest Classifier
    print("\nTraining Random Forest Classifier...")
    rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_clf.fit(X_train, y_train)
    
    # 6. Evaluation
    print("\nEvaluating the model...")
    y_pred = rf_clf.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=['Rejected', 'Approved'])
    cm = confusion_matrix(y_test, y_pred)
    
    print(f"Accuracy: {accuracy:.4f}")
    print("\nClassification Report:\n", report)
    print("Confusion Matrix:\n", cm)
    
    # Print Feature Importances
    importances = rf_clf.feature_importances_
    indices = np.argsort(importances)[::-1]
    print("\nFeature Importances:")
    for f in range(X.shape[1]):
        print(f"{f + 1}. {feature_names[indices[f]]}: {importances[indices[f]]:.4f}")
    
    # 7. Save the Model
    model_dir = 'model'
    os.makedirs(model_dir, exist_ok=True)
    
    model_path1 = os.path.join(model_dir, 'model.pkl')
    model_path2 = os.path.join(model_dir, 'loan_model.pkl')
    
    # Save the model along with feature names to be self-contained
    model_data = {
        'model': rf_clf,
        'features': feature_names
    }
    
    print(f"\nSaving model objects to {model_path1} and {model_path2}...")
    with open(model_path1, 'wb') as f:
        pickle.dump(model_data, f)
        
    with open(model_path2, 'wb') as f:
        pickle.dump(model_data, f)
        
    print("Model training and saving completed successfully!")

if __name__ == '__main__':
    main()
