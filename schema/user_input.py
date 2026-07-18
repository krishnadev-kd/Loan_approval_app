
from pydantic import BaseModel, Field,field_validator
from typing import Annotated, Literal


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

    @field_validator('education', 'self_employed', mode='before')
    @classmethod
    def normalize_strings(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().title()
            return v
