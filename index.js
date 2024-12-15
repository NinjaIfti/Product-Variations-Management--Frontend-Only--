// Declare the variables that will store the data
const variations = {};  
const products = [];    
const combinations = []; 

// Load data from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Get data from localStorage or initialize as empty
    const storedVariations = JSON.parse(localStorage.getItem("variations")) || {};
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const storedCombinations = JSON.parse(localStorage.getItem("combinations")) || [];

    // Correctly set loaded data
    Object.assign(variations, storedVariations);
    products.push(...storedProducts);
    combinations.push(...storedCombinations);

    // Render the loaded data
    renderVariations();
    renderProducts();
    renderCombinations();
});

// Event listener for creating a new variation
document.getElementById('create-variation').addEventListener('click', () => {
    const name = document.getElementById('variation-name').value.trim();
    if (name && !variations[name]) {
        variations[name] = [];
        renderVariations();
        document.getElementById('variation-name').value = '';
        saveData();
    }
});

// Event listener for adding a new product
document.getElementById('add-product').addEventListener('click', () => {
    const productName = document.getElementById('product-name').value.trim();
    if (productName && !products.includes(productName)) {
        products.push(productName);
        renderProducts();
        document.getElementById('product-name').value = '';
        saveData();
    }
});

// Event listener for generating combinations
document.getElementById('generate-combinations').addEventListener('click', () => {
    generateCombinations();
    renderCombinations();
    saveData();
});

// Event listener for searching combinations
document.getElementById('search-combinations').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    renderCombinations(query);
});

// Function to render variations
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

// Function to render products
function renderProducts() {
    const list = document.getElementById('products-list');
    list.innerHTML = products.map(product => `
        <li class="flex justify-between items-center mt-1">
            ${product}
            <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="deleteProduct('${product}')">&times;</button>
        </li>
    `).join('');
}

// Function to generate combinations
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

// Function to render combinations
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

// Function to add a value to a variation
function addVariationValue(name) {
    const input = document.getElementById(`${name}-input`);
    const value = input.value.trim();
    if (value && !variations[name].includes(value)) {
        variations[name].push(value);
        renderVariations();
        saveData();
        input.value = '';
    }
}

// Function to remove a value from a variation
function removeVariationValue(name, value) {
    const index = variations[name].indexOf(value);
    if (index !== -1) {
        variations[name].splice(index, 1);
        renderVariations();
        saveData();
    }
}

// Function to delete a product
function deleteProduct(productName) {
    const index = products.indexOf(productName);
    if (index !== -1) {
        products.splice(index, 1);
        renderProducts();
        saveData();
    }
}

// Function to delete a variation
function deleteVariation(name) {
    delete variations[name];
    renderVariations();
    saveData();
}

// Function to delete a combination
function deleteCombination(index) {
    combinations.splice(index, 1);
    renderCombinations();
    saveData();
}

// Cartesian product function for generating combinations
function cartesian(arrays) {
    return arrays.reduce((a, b) => a.flatMap(d => b.map(e => d.concat([e]))), [[]]);
}

// Save the data to localStorage
function saveData() {
    localStorage.setItem("variations", JSON.stringify(variations));
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("combinations", JSON.stringify(combinations));

}
