document.addEventListener('DOMContentLoaded', () => {
    // 1. Element Selectors
    const form = document.getElementById('predictor-form');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    const landingPanel = document.getElementById('landing-panel');
    const resultsPanel = document.getElementById('results-panel');
    
    // Hidden inputs & Button groups
    const dependentsButtons = document.querySelectorAll('#dependents-group button');
    const dependentsInput = document.getElementById('no_of_dependents');
    
    // Sliders & Outputs
    const incomeSlider = document.getElementById('income_annum');
    const incomeDisplay = document.getElementById('income-display');
    
    const loanAmountSlider = document.getElementById('loan_amount');
    const loanAmountDisplay = document.getElementById('loan-amount-display');
    
    const loanTermSlider = document.getElementById('loan_term');
    const loanTermDisplay = document.getElementById('loan-term-display');
    
    const cibilSlider = document.getElementById('cibil_score');
    const cibilDisplay = document.getElementById('cibil-display');
    
    const residentialSlider = document.getElementById('residential_assets_value');
    const residentialDisplay = document.getElementById('residential-display');
    
    const commercialSlider = document.getElementById('commercial_assets_value');
    const commercialDisplay = document.getElementById('commercial-display');
    
    const luxurySlider = document.getElementById('luxury_assets_value');
    const luxuryDisplay = document.getElementById('luxury-display');
    
    const bankSlider = document.getElementById('bank_asset_value');
    const bankDisplay = document.getElementById('bank-display');

    // 2. Helper Functions
    
    // Format numeric values into Indian Rupees (Lakhs / Crores)
    function formatRupees(value) {
        if (value >= 10000000) {
            return '₹ ' + (value / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
        } else if (value >= 100000) {
            return '₹ ' + (value / 100000).toFixed(2).replace(/\.00$/, '') + ' L';
        } else if (value === 0) {
            return '₹ 0';
        } else {
            return '₹ ' + value.toLocaleString('en-IN');
        }
    }

    // Dynamic CIBIL classification colors
    function updateCibilDisplay(score) {
        cibilDisplay.classList.remove('cibil-poor', 'cibil-fair', 'cibil-good', 'cibil-excellent');
        cibilDisplay.textContent = score;

        if (score < 550) {
            cibilDisplay.classList.add('cibil-poor');
            cibilDisplay.textContent = `${score} (Poor)`;
        } else if (score < 650) {
            cibilDisplay.classList.add('cibil-fair');
            cibilDisplay.textContent = `${score} (Fair)`;
        } else if (score < 750) {
            cibilDisplay.classList.add('cibil-good');
            cibilDisplay.textContent = `${score} (Good)`;
        } else {
            cibilDisplay.classList.add('cibil-excellent');
            cibilDisplay.textContent = `${score} (Excellent)`;
        }
    }

    // 3. Event Listeners for Sliders & Custom Inputs
    
    // Dependents Button Group Selector
    dependentsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dependentsButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            dependentsInput.value = btn.getAttribute('data-value');
        });
    });

    // Slider inputs linking to displays
    incomeSlider.addEventListener('input', (e) => {
        incomeDisplay.textContent = formatRupees(Number(e.target.value));
    });

    loanAmountSlider.addEventListener('input', (e) => {
        loanAmountDisplay.textContent = formatRupees(Number(e.target.value));
    });

    loanTermSlider.addEventListener('input', (e) => {
        loanTermDisplay.textContent = `${e.target.value} Years`;
    });

    cibilSlider.addEventListener('input', (e) => {
        updateCibilDisplay(Number(e.target.value));
    });

    residentialSlider.addEventListener('input', (e) => {
        residentialDisplay.textContent = formatRupees(Number(e.target.value));
    });

    commercialSlider.addEventListener('input', (e) => {
        commercialDisplay.textContent = formatRupees(Number(e.target.value));
    });

    luxurySlider.addEventListener('input', (e) => {
        luxuryDisplay.textContent = formatRupees(Number(e.target.value));
    });

    bankSlider.addEventListener('input', (e) => {
        bankDisplay.textContent = formatRupees(Number(e.target.value));
    });

    // Initial load displays
    incomeDisplay.textContent = formatRupees(Number(incomeSlider.value));
    loanAmountDisplay.textContent = formatRupees(Number(loanAmountSlider.value));
    loanTermDisplay.textContent = `${loanTermSlider.value} Years`;
    updateCibilDisplay(Number(cibilSlider.value));
    residentialDisplay.textContent = formatRupees(Number(residentialSlider.value));
    commercialDisplay.textContent = formatRupees(Number(commercialSlider.value));
    luxuryDisplay.textContent = formatRupees(Number(luxurySlider.value));
    bankDisplay.textContent = formatRupees(Number(bankSlider.value));

    // 4. Form Submission and API Integration
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Gather values
        const dependents = parseInt(dependentsInput.value, 10);
        const education = document.querySelector('input[name="education"]:checked').value;
        const selfEmployed = document.querySelector('input[name="self_employed"]:checked').value;
        
        const income = parseFloat(incomeSlider.value);
        const loanAmount = parseFloat(loanAmountSlider.value);
        const loanTerm = parseInt(loanTermSlider.value, 10);
        const cibilScore = parseInt(cibilSlider.value, 10);
        
        const residentialAssets = parseFloat(residentialSlider.value);
        const commercialAssets = parseFloat(commercialSlider.value);
        const luxuryAssets = parseFloat(luxurySlider.value);
        const bankAssets = parseFloat(bankSlider.value);

        // UI Loading State
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Analyzing Credit Profile...';
        submitBtn.querySelector('.spinner').classList.remove('hidden');

        const requestBody = {
            no_of_dependents: dependents,
            education: education,
            self_employed: selfEmployed,
            income_annum: income,
            loan_amount: loanAmount,
            loan_term: loanTerm,
            cibil_score: cibilScore,
            residential_assets_value: residentialAssets,
            commercial_assets_value: commercialAssets,
            luxury_assets_value: luxuryAssets,
            bank_asset_value: bankAssets
        };

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Server returned error status: ${response.status}`);
            }

            const data = await response.json();
            renderResults(data, requestBody);
        } catch (error) {
            console.error('Prediction request failed:', error);
            alert('Risk assessment evaluation failed. Please verify your connection to the server.');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Evaluate Application';
            submitBtn.querySelector('.spinner').classList.add('hidden');
        }
    });

    // 5. Render Underwriting Results Dashboard
    function renderResults(result, inputs) {
        const isApproved = result.status === 'Approved';
        
        // Hide landing panel, Show results panel
        landingPanel.classList.add('hidden');
        resultsPanel.classList.remove('hidden');
        
        // Toggle Approved/Rejected state classes
        resultsPanel.classList.remove('approved-state', 'rejected-state');
        resultsPanel.classList.add(isApproved ? 'approved-state' : 'rejected-state');

        // Set Title text
        document.getElementById('result-status-title').textContent = isApproved ? 'Application Approved' : 'Application Rejected';

        // Set Icon SVG
        const iconBox = document.getElementById('result-icon');
        if (isApproved) {
            iconBox.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            iconBox.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }

        // CIBIL Score Diagnostic Display
        document.getElementById('res-cibil-score').textContent = inputs.cibil_score;
        const cibilFill = document.getElementById('res-cibil-fill');
        // Map 300-900 onto 0-100%
        const scorePercent = Math.max(0, Math.min(100, ((inputs.cibil_score - 300) / 600) * 100));
        cibilFill.style.width = `${scorePercent}%`;
        
        // LTI Ratio (Loan amount to annual income)
        const ltiRatio = (inputs.loan_amount / inputs.income_annum).toFixed(1);
        document.getElementById('res-lti-ratio').textContent = `${ltiRatio}x`;

        // Asset Coverage Ratio (Total assets to loan amount)
        const totalAssets = inputs.residential_assets_value + inputs.commercial_assets_value + inputs.luxury_assets_value + inputs.bank_asset_value;
        const assetCoverage = inputs.loan_amount > 0 ? (totalAssets / inputs.loan_amount).toFixed(1) : 0;
        document.getElementById('res-asset-coverage').textContent = `${assetCoverage}x`;

        // Breakdown Table Items
        // 1. Income to Loan Percent
        const incomeToLoanPercent = ((inputs.income_annum / inputs.loan_amount) * 100).toFixed(1);
        let incomeStatus = 'Low Coverage';
        if (incomeToLoanPercent >= 50) incomeStatus = 'Strong Coverage';
        else if (incomeToLoanPercent >= 25) incomeStatus = 'Adequate';
        document.getElementById('val-income-vs-loan').textContent = `${incomeStatus} (${incomeToLoanPercent}%)`;

        // 2. Liquidity Status
        const liquidToLoanPercent = ((inputs.bank_asset_value / inputs.loan_amount) * 100).toFixed(1);
        let liquidityStatus = 'Low Liquidity';
        if (liquidToLoanPercent >= 25) liquidityStatus = 'Highly Liquid';
        else if (liquidToLoanPercent >= 10) liquidityStatus = 'Adequate';
        document.getElementById('val-asset-liquidity').textContent = liquidityStatus;

        // 3. CIBIL risk rating
        let riskCategory = 'High Risk';
        if (inputs.cibil_score >= 750) riskCategory = 'Very Low Risk';
        else if (inputs.cibil_score >= 650) riskCategory = 'Moderate Risk';
        document.getElementById('val-credit-tier').textContent = riskCategory;

        // 4. Employment Profile
        document.getElementById('val-emp-profile').textContent = `${inputs.self_employed === 'Yes' ? 'Self-Employed' : 'Salaried'} ${inputs.education}`;

        // Recommendations generation
        const recText = document.getElementById('recommendation-text');
        const recTitle = document.getElementById('recommendation-title');

        if (isApproved) {
            recTitle.textContent = 'Approval Diagnostic Summary';
            if (inputs.cibil_score >= 750) {
                recText.textContent = `Excellent profile validation. High credit ranking (${inputs.cibil_score}) and robust asset backing of ${assetCoverage}x indicate a prime applicant. Standard approval with preferred prime interest rates recommended.`;
            } else if (ltiRatio < 2.5) {
                recText.textContent = `Approved based on healthy loan size relative to income. Low leverage requirements (${ltiRatio}x) counter balance the moderate credit score of ${inputs.cibil_score}. Clean underwriting clearance.`;
            } else {
                recText.textContent = `Underwriting approved. The total asset portfolio values (₹ ${formatRupees(totalAssets).replace('₹ ', '')}) show sufficient overall collateral coverage. Standard pricing models apply.`;
            }
        } else {
            recTitle.textContent = 'Rejection Critical Triggers';
            if (inputs.cibil_score < 550) {
                recText.textContent = `Critical credit alert. The applicant's CIBIL score (${inputs.cibil_score}) is below standard lending criteria thresholds. Underwriting rules reject profiles below 550 due to default risk.`;
            } else if (assetCoverage < 0.5) {
                recText.textContent = `High-leverage rejection. Total declared collateral and liquid asset value (₹ ${formatRupees(totalAssets).replace('₹ ', '')}) is insufficient to support the requested loan size of ₹ ${formatRupees(inputs.loan_amount).replace('₹ ', '')}. Recommend downscaling loan amount or adding co-guarantor assets.`;
            } else if (ltiRatio > 4) {
                recText.textContent = `Income strain alert. The requested loan amount is ${ltiRatio} times the applicant's annual income. High debt service ratio increases defaults risk. Approve contingent on downscaling loan requirements.`;
            } else {
                recText.textContent = `Risk metrics boundary exceeded. Random Forest classifier indicates default warning probability. Underwriting rejected due to weak credit score (${inputs.cibil_score}) combined with high debt requirements.`;
            }
        }

        // Smooth scroll to results panel (especially on mobile)
        resultsPanel.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset back to calculator state
    resetBtn.addEventListener('click', () => {
        resultsPanel.classList.add('hidden');
        landingPanel.classList.remove('hidden');
        form.reset();
        
        // Reset custom dependent buttons
        dependentsButtons.forEach(b => b.classList.remove('active'));
        dependentsButtons[0].classList.add('active');
        dependentsInput.value = '0';

        // Trigger manual update inputs to reset label readouts
        incomeSlider.dispatchEvent(new Event('input'));
        loanAmountSlider.dispatchEvent(new Event('input'));
        loanTermSlider.dispatchEvent(new Event('input'));
        cibilSlider.dispatchEvent(new Event('input'));
        residentialSlider.dispatchEvent(new Event('input'));
        commercialSlider.dispatchEvent(new Event('input'));
        luxurySlider.dispatchEvent(new Event('input'));
        bankSlider.dispatchEvent(new Event('input'));
    });
});
