document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'https://parallelum.com.br/fipe/api/v1';

    const typeSelect = document.getElementById('type');
    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');
    const yearSelect = document.getElementById('year');
    const resultDiv = document.getElementById('result');
    const form = document.getElementById('fipe-form');
    const clearBtn = document.getElementById('clear-btn')

    let allModels = [];
    let vehicleType = typeSelect.value;

    function resetDropdown(dropdown, message = 'Select an option') {
        dropdown.innerHTML = `<option value="">${message}</option>`;
    }

    function loadBrands() {
        resultDiv.innerHTML = 'Loading brands...';
        fetch(`${baseUrl}/${vehicleType}/marcas`)
            .then(res => res.json())
            .then(brands => {
                resetDropdown(brandSelect, 'Select brand');
                resetDropdown(modelSelect, 'Select model');
                resetDropdown(yearSelect, 'Select year');
                brands.forEach(brand => {
                    const option = document.createElement('option');
                    option.value = brand.codigo;
                    option.textContent = brand.nome;
                    brandSelect.appendChild(option);
                });
            });
    }

    function loadModels(brandId) {
        resultDiv.innerHTML = 'Loading models...'
        fetch(`${baseUrl}/${vehicleType}/marcas/${brandId}/modelos`)
            .then(res => res.json())
            .then(data => {
                allModels = data.modelos;
                resetDropdown(modelSelect, 'Select model');
                resetDropdown(yearSelect, 'Select year');
                allModels.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.codigo;
                    option.textContent = model.nome;
                    modelSelect.appendChild(option);
                });
            });
    }

    function loadYears(brandId, modelId) {
        resultDiv.innerHTML = 'Loading years...'
        fetch(`${baseUrl}/${vehicleType}/marcas/${brandId}/modelos/${modelId}/anos`)
            .then(res => res.json())
            .then(years => {
                resetDropdown(yearSelect, 'Select year');
                years.forEach(year => {
                    const option = document.createElement('option');
                    option.value = year.codigo; // ✅ fixed typo
                    option.textContent = year.nome;
                    yearSelect.appendChild(option);
                });
            });
    }
    
    loadBrands();

    typeSelect.addEventListener('change', () => {
        vehicleType = typeSelect.value;
        loadBrands();
        resultDiv.innerHTML = '';
    });

    brandSelect.addEventListener('change', () => {
        const brandId = brandSelect.value;
        if (brandId) {
            loadModels(brandId);
        }
    });

    modelSelect.addEventListener('change', () => {
        const brandId = brandSelect.value;
        const modelId = modelSelect.value;
        if (brandId && modelId) {
            loadYears(brandId, modelId);
        }
    });

    function fetchPrice(brandId, modelId, yearId) {
        resultDiv.innerHTML = 'Fetching price...';
        fetch(`${baseUrl}/${vehicleType}/marcas/${brandId}/modelos/${modelId}/anos/${yearId}`)
            .then(res => res.json())
            .then(data => {
                displayPrice(data);
            })
    }

    function displayPrice(data) {
        resultDiv.innerHTML =
        `<h3>${data.Marca} - ${data.Modelo} (${data.AnoModelo})</h3>
        <p><strong>Value:</strong> ${data.Valor}</p>
        <p><strong>Fuel:</strong> ${data.Combustivel}</p>
        <p><strong>Reference Month:</strong> ${data.MesReferencia}</p>`;
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const brandId = brandSelect.value;
        const modelId = modelSelect.value;
        const yearId = yearSelect.value;

        if (brandId && modelId && yearId) {
            fetchPrice(brandId, modelId, yearId);
        } else {
            resultDiv.innerHTML = '<p style="color: red;">Please Select all fields.</p>';
        }
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
        typeSelect.value = 'carros';
        vehicleType = 'carros';
        loadBrands();
        resultDiv.innerHTML = '';
    });
});
