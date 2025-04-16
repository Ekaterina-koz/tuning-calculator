document.addEventListener('DOMContentLoaded', () => {
    const markSelect = document.getElementById('mark');
    const modelSelect = document.getElementById('model');
    const yearSelect = document.getElementById('year');
    const engineSelect = document.getElementById('engine');

    const stageSelectionDiv = document.getElementById('stage-selection');
    const stageOptionsDiv = document.getElementById('stage-options');
    const comparisonTableDiv = document.getElementById('comparison-table');
    const comparisonTableBody = comparisonTableDiv.querySelector('tbody');
    const additionalOptionsDiv = document.getElementById('additional-options');
    const optionsListDiv = document.getElementById('options-list');
    const resultContainerDiv = document.getElementById('result-container');
    const resultDiv = document.getElementById('result');

    let currentEngineData = null;
    let currentStageData = null;
    let selectedOptionsCost = 0;

    // --- Helper Functions ---
    const formatCost = (cost) => cost.toLocaleString('ru-RU');

    const resetSelect = (select, defaultTextKey) => {
        const defaultTexts = {
            mark: '--Выберите марку--',
            model: '--Сначала выберите марку--',
            year: '--Сначала выберите модель--',
            engine: '--Сначала выберите год--',
        };
        select.innerHTML = `<option value="">${defaultTexts[defaultTextKey]}</option>`;
        select.disabled = true;
    };

    const hideElement = (el) => el.style.display = 'none';
    const showElement = (el) => el.style.display = 'block';

    const clearResults = () => {
        hideElement(stageSelectionDiv);
        stageOptionsDiv.innerHTML = '';
        hideElement(comparisonTableDiv);
        comparisonTableBody.innerHTML = '';
        hideElement(additionalOptionsDiv);
        optionsListDiv.innerHTML = '';
        hideElement(resultContainerDiv);
        resultDiv.innerHTML = '';
        currentEngineData = null;
        currentStageData = null;
        selectedOptionsCost = 0;
    };

    // --- Data Population Functions ---
    const populateSelect = (select, options, placeholderKey) => {
         const defaultTexts = {
            mark: '--Выберите марку--',
            model: '--Выберите модель--',
            year: '--Выберите год--',
            engine: '--Выберите мотор--',
        };
        select.innerHTML = `<option value="">${defaultTexts[placeholderKey]}</option>`;
        options.forEach(option => {
            const optionEl = document.createElement('option');
            const value = typeof option === 'object' ? option.name : option;
            const text = typeof option === 'object' ? option.name : option;
            // Store the original data object if it's an object (for engines)
            if (typeof option === 'object') {
                 optionEl.dataset.engineData = JSON.stringify(option); // Might not be needed if we look up by name
            }
            optionEl.value = value;
            optionEl.textContent = text;
            select.appendChild(optionEl);
        });
        select.disabled = false;
    };

    const populateStages = (stages) => {
        stageOptionsDiv.innerHTML = ''; // Clear previous stages
        if (!stages || stages.length === 0) {
            hideElement(stageSelectionDiv);
            return; // No stages to show
        }
        stages.forEach((stageInfo, index) => {
            const radioId = `stage-${index}`;
            const label = document.createElement('label');
            label.htmlFor = radioId;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'stage';
            radio.id = radioId;
            radio.value = index; // Store index to easily retrieve stage data

            label.appendChild(radio);
            label.appendChild(document.createTextNode(stageInfo.stage));
            stageOptionsDiv.appendChild(label);

            radio.addEventListener('change', handleStageChange);
        });
         // Select first stage by default and trigger change
        const firstRadio = stageOptionsDiv.querySelector('input[type="radio"]');
        if(firstRadio) {
            firstRadio.checked = true;
            showElement(stageSelectionDiv);
            handleStageChange({ target: firstRadio });
        }
    };

    // --- Calculation & Display Functions ---
    const calculateDiff = (stock, tuned, paramType) => {
        if (stock === undefined || stock === null || tuned === undefined || tuned === null || stock === '-' || tuned === '-') return '-';

        const stockVal = parseFloat(String(stock).replace(/[^0-9.,]/g, '').replace(',', '.'));
        const tunedVal = parseFloat(String(tuned).replace(/[^0-9.,]/g, '').replace(',', '.'));

        if (isNaN(stockVal) || isNaN(tunedVal)) return '-';

        let diff = tunedVal - stockVal;
        let sign = diff > 0 ? '+' : '';
        let cssClass = diff > 0 ? 'positive-diff' : (diff < 0 ? 'negative-diff' : '');
        let unit = String(stock).replace(/[0-9.,\s+-]/g, ''); // Extract unit more robustly

        // Invert logic for acceleration (lower is better)
        if (paramType === 'accel') {
            diff = stockVal - tunedVal; // Calculate improvement (positive if faster)
            sign = diff > 0 ? '-' : (diff < 0 ? '+' : ''); // Sign shows change direction on original scale
            cssClass = diff > 0 ? 'positive-diff' : (diff < 0 ? 'negative-diff' : '');
            diff = Math.abs(tunedVal-stockVal); // Display absolute difference
        }

        let diffStr = diff.toFixed(paramType === 'accel' ? 1 : 0); // 1 decimal for accel

        // Avoid showing +0
        if (parseFloat(diffStr) === 0) {
            sign = '';
            cssClass = '';
            diffStr = '0'; // Or maybe '-' or leave empty?
            return `±${diffStr} ${unit}`; // Indicate no change
        }

        return `<span class="${cssClass}">${sign}${diffStr} ${unit}</span>`;
    };

    const populateComparisonTable = (stockParams = {}, tunedParams = {}) => {
        comparisonTableBody.innerHTML = ''; // Clear previous data
        const paramMap = {
            volume: 'Объем двигателя',
            power: 'Мощность',
            torque: 'Крутящий момент',
            accel: '0-100 км/ч'
        };

        for (const key in paramMap) {
            const stockValue = stockParams[key] ?? '-';
            const tunedValue = tunedParams[key] ?? stockValue; // Use stock if no tuned value for this stage
            const diffValue = calculateDiff(stockValue, tunedValue, key);

            const row = `<tr>
                <td>${paramMap[key]}</td>
                <td>${stockValue}</td>
                <td>${tunedValue}</td>
                <td>${diffValue}</td>
            </tr>`;
            comparisonTableBody.innerHTML += row;
        }
        showElement(comparisonTableDiv);
    };

    const populateOptions = (options) => {
        optionsListDiv.innerHTML = ''; // Clear previous options
        if (!options || options.length === 0) {
            hideElement(additionalOptionsDiv);
            return;
        }

        options.forEach(opt => {
            const optionId = `opt-${opt.id}`;
            const div = document.createElement('div');

            const label = document.createElement('label');
            label.htmlFor = optionId;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = optionId;
            checkbox.value = opt.cost;
            checkbox.dataset.optionId = opt.id; // Store id for potential future use

            const nameSpan = document.createElement('span');
            nameSpan.textContent = opt.name;

            const costSpan = document.createElement('span');
            costSpan.classList.add('option-cost');
            costSpan.textContent = `+ ${formatCost(opt.cost)} руб.`;

            label.appendChild(checkbox);
            label.appendChild(nameSpan);
            label.appendChild(costSpan);
            div.appendChild(label);
            optionsListDiv.appendChild(div);

            checkbox.addEventListener('change', handleOptionChange);
        });
        showElement(additionalOptionsDiv);
    };

    const updateTotalCost = () => {
        if (!currentStageData) {
            hideElement(resultContainerDiv);
            resultDiv.innerHTML = '';
            return;
        }
        const baseCost = currentStageData.cost || 0;
        const totalCost = baseCost + selectedOptionsCost;
        resultDiv.innerHTML = `Итоговая стоимость: <strong>${formatCost(totalCost)} руб.</strong>`;
        showElement(resultContainerDiv);
    };


    // --- Event Handlers ---
    const handleMarkChange = () => {
        const selectedMark = markSelect.value;
        resetSelect(modelSelect, 'model');
        resetSelect(yearSelect, 'year');
        resetSelect(engineSelect, 'engine');
        clearResults();

        if (selectedMark && carData[selectedMark]) {
            const models = Object.keys(carData[selectedMark]);
            populateSelect(modelSelect, models, 'model');
        }
    };

    const handleModelChange = () => {
        const selectedMark = markSelect.value;
        const selectedModel = modelSelect.value;
        resetSelect(yearSelect, 'year');
        resetSelect(engineSelect, 'engine');
        clearResults();

        if (selectedModel && carData[selectedMark]?.[selectedModel]) {
            const years = Object.keys(carData[selectedMark][selectedModel]);
            populateSelect(yearSelect, years, 'year');
        }
    };

    const handleYearChange = () => {
        const selectedMark = markSelect.value;
        const selectedModel = modelSelect.value;
        const selectedYear = yearSelect.value;
        resetSelect(engineSelect, 'engine');
        clearResults();

        if (selectedYear && carData[selectedMark]?.[selectedModel]?.[selectedYear]) {
            const enginesData = carData[selectedMark][selectedModel][selectedYear] || [];
             // Filter out potential null/undefined entries if data structure is inconsistent
            const validEnginesData = enginesData.filter(engine => engine && engine.name);
            populateSelect(engineSelect, validEnginesData, 'engine');
        }
    };

    const handleEngineChange = () => {
        const selectedMark = markSelect.value;
        const selectedModel = modelSelect.value;
        const selectedYear = yearSelect.value;
        const selectedEngineName = engineSelect.value;
        clearResults();

        if (selectedEngineName) {
            const enginesData = carData[selectedMark]?.[selectedModel]?.[selectedYear];
            currentEngineData = enginesData?.find(engine => engine.name === selectedEngineName);

            if (currentEngineData) {
                 // Pass only the stages array to populateStages
                 populateStages(currentEngineData.stages);
            } else {
                 console.warn('Engine data not found for:', selectedEngineName);
                 // Ensure results are cleared if no valid engine is selected
                 clearResults();
            }
        } else {
            currentEngineData = null;
             clearResults(); // Clear results if engine is de-selected
        }
    };

    const handleStageChange = (event) => {
        if (!currentEngineData || !event?.target) {
             console.warn("handleStageChange called without currentEngineData or event target");
             return;
        }

        const selectedStageIndex = parseInt(event.target.value, 10);

        // Check if the index is valid for the stages array
        if (currentEngineData.stages && selectedStageIndex >= 0 && selectedStageIndex < currentEngineData.stages.length) {
            currentStageData = currentEngineData.stages[selectedStageIndex];

            if (currentStageData) {
                populateComparisonTable(currentEngineData.stockParams, currentStageData.tunedParams);
                populateOptions(currentStageData.availableOptions);
                selectedOptionsCost = 0; // Reset options cost when stage changes
                updateTotalCost();
            } else {
                // This case should ideally not happen if the index is valid, but good to handle
                console.error('Selected stage data is null or undefined for index:', selectedStageIndex);
                hideElement(comparisonTableDiv);
                hideElement(additionalOptionsDiv);
                hideElement(resultContainerDiv);
            }
        } else {
             console.error('Invalid stage index or stages array missing:', selectedStageIndex, currentEngineData.stages);
             // Clear the stage-dependent sections if stage data is invalid
             hideElement(comparisonTableDiv);
             hideElement(additionalOptionsDiv);
             hideElement(resultContainerDiv);
             currentStageData = null; // Ensure currentStageData is nullified
        }
    };

    const handleOptionChange = (event) => {
        const checkbox = event.target;
        const cost = parseInt(checkbox.value, 10);

        if (isNaN(cost)) {
            console.warn("Invalid cost value on checkbox:", checkbox.value);
            return;
        }

        if (checkbox.checked) {
            selectedOptionsCost += cost;
        } else {
            selectedOptionsCost -= cost;
        }
        // Ensure cost doesn't go below zero if multiple events fire quickly
        selectedOptionsCost = Math.max(0, selectedOptionsCost);
        updateTotalCost();
    };

    // --- Initialization ---
    const initialize = () => {
        // Populate initial mark select
        const marks = Object.keys(carData);
        populateSelect(markSelect, marks, 'mark');

        // Add event listeners
        markSelect.addEventListener('change', handleMarkChange);
        modelSelect.addEventListener('change', handleModelChange);
        yearSelect.addEventListener('change', handleYearChange);
        engineSelect.addEventListener('change', handleEngineChange);

        // Reset dependent selects initially
        resetSelect(modelSelect, 'model');
        resetSelect(yearSelect, 'year');
        resetSelect(engineSelect, 'engine');
    };

    initialize();
}); 