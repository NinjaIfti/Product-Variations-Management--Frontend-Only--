const variations = JSON.parse(localStorage.getItem("variations")) || {};  
const products = JSON.parse(localStorage.getItem("products")) || [];    
const combinations = JSON.parse(localStorage.getItem("combinations")) || []; 

// Load data from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("variations")) {
        Object.assign(variations, JSON.parse(localStorage.getItem("variations")));
    }
    if (localStorage.getItem("products")) {
        products.push(...JSON.parse(localStorage.getItem("products")));
    }
    if (localStorage.getItem("combinations")) {
        combinations.push(...JSON.parse(localStorage.getItem("combinations")));
    }
    renderVariations();
    renderProducts();
    renderCombinations();
});

document.getElementById('create-variation').addEventListener('click', () => {
    const name = document.getElementById('variation-name').value.trim();
    if (name && !variations[name]) {
        variations[name] = [];
        renderVariations();
        document.getElementById('variation-name').value = '';
        saveData();
    }
});

document.getElementById('add-product').addEventListener('click', () => {
    const productName = document.getElementById('product-name').value.trim();
    if (productName && !products.includes(productName)) {
        products.push(productName);
        renderProducts();
        document.getElementById('product-name').value = '';
        saveData();
    }
});

document.getElementById('generate-combinations').addEventListener('click', () => {
    generateCombinations();
    renderCombinations();
    saveData();
});

document.getElementById('search-combinations').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    renderCombinations(query);
});

function renderVariations() {
    const container = document.getElementById('variations-container');
    container.innerHTML = '';
    for (const [name, values] of Object.entries(variations)) {
        const variationBox = document.createElement('div');
        variationBox.className = "p-4 border rounded bg-gray-100";
        variationBox.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-semibold">${name}</h3>
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteVariation('${name}')">&times;</button>
            </div>
            <div class="flex gap-2">
                <input type="text" placeholder="Add ${name}" class="border p-2 rounded w-full" id="${name}-input">
                <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="addVariationValue('${name}')">Add</button>
            </div>
            <ul class="mt-2" id="${name}-list">
                ${values.map(value => `
                    <li class="flex justify-between items-center mt-1">
                        <span>${value}</span>
                        <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="removeVariationValue('${name}', '${value}')">&times;</button>
                    </li>`).join('')}
            </ul>
        `;
        container.appendChild(variationBox);
    }
}

function renderProducts() {
    const list = document.getElementById('products-list');
    list.innerHTML = products.map(product => `
        <li class="flex justify-between items-center mt-1">
            ${product}
            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteProduct('${product}')">&times;</button>
        </li>
    `).join('');
}

function generateCombinations() {
    combinations.length = 0;
    for (const product of products) {
        const keys = Object.keys(variations);
        const values = Object.values(variations);
        if (keys.length > 0 && values.every(arr => arr.length)) {
            const allCombinations = cartesian(values);
            allCombinations.forEach(combo => {
                combinations.push({ product, combo });
            });
        }
    }
    saveData();
}

function renderCombinations(query = '') {
    const list = document.getElementById('combinations-list');
    const filteredCombinations = combinations.filter(({ product, combo }) => 
        product.toLowerCase().includes(query) ||
        combo.some(value => value.toLowerCase().includes(query))
    );
    list.innerHTML = filteredCombinations.map(({ product, combo }, index) => `
        <tr>
            <td class="p-2">${product} - ${combo.join(', ')}</td>
            <td class="p-2"><input type="number" class="border p-2 rounded w-full" value="0"></td>
            <td class="p-2"><input type="number" class="border p-2 rounded w-full" value="0"></td>
            <td class="p-2"><input type="number" class="border p-2 rounded w-full" value="0"></td>
            <td class="p-2">
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteCombination(${index})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function addVariationValue(name) {
    const input = document.getElementById(`${name}-input`);
    const value = input.value.trim();
    if (value && !variations[name].includes(value)) {
        variations[name].push(value);
        renderVariations();
        input.value = '';
        saveData();
    }
}

function removeVariationValue(name, value) {
    const index = variations[name].indexOf(value);
    if (index !== -1) {
        variations[name].splice(index, 1);
        renderVariations();
        saveData();
    }
}

function deleteProduct(productName) {
    const index = products.indexOf(productName);
    if (index !== -1) {
        products.splice(index, 1);
        renderProducts();
        saveData();
    }
}

function deleteVariation(name) {
    delete variations[name];
    renderVariations();
    saveData();
}

function deleteCombination(index) {
    combinations.splice(index, 1);
    renderCombinations();
    saveData();
}

function cartesian(arrays) {
    return arrays.reduce((a, b) => a.flatMap(d => b.map(e => d.concat([e]))), [[]]);
}

function saveData() {
    localStorage.setItem("variations", JSON.stringify(variations));
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("combinations", JSON.stringify(combinations));
}
