let combinations = JSON.parse(localStorage.getItem("combinations")) || [];

document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const productName = document.getElementById("productName").value.trim();
    const productSize = document.getElementById("productSize").value;
    const productColor = document.getElementById("productColor").value.trim();
    const productModel = document.getElementById("productModel").value.trim();

    if (!productName || !productSize || !productColor || !productModel) {
        alert("Please fill all fields.");
        return;
    }

    const combination = {
        id: `${productName}-${productSize}-${productColor}-${productModel}`,
        productName,
        productSize,
        productColor,
        productModel,
        stock: 0,
        price: 0,
        discountedPrice: 0,
    };

    combinations.push(combination);
    saveCombinations();
    renderCombinations();

    // Reset form
    e.target.reset();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    renderCombinations(query);
});

function saveCombinations() {
    localStorage.setItem("combinations", JSON.stringify(combinations));
}

function renderCombinations(filter = "") {
    const tbody = document.getElementById("combinationsTable");
    const filteredCombinations = combinations.filter(
        (combo) =>
            combo.productName.toLowerCase().includes(filter) ||
            combo.productSize.toLowerCase().includes(filter) ||
            combo.productColor.toLowerCase().includes(filter) ||
            combo.productModel.toLowerCase().includes(filter)
    );

    tbody.innerHTML = filteredCombinations.length
        ? filteredCombinations
              .map(
                  (combo) => `
            <tr id="${combo.id}">
                <td class="border border-gray-300 px-4 py-2">${combo.productName} - ${combo.productSize} - ${combo.productColor} - ${combo.productModel}</td>
                <td class="border border-gray-300 px-4 py-2">
                    <input type="number" class="border p-1 rounded w-full" placeholder="Stock" value="${combo.stock}" 
                        oninput="updateCombo('${combo.id}', 'stock', this.value)" />
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <input type="number" class="border p-1 rounded w-full" placeholder="Price" value="${combo.price}" 
                        oninput="updateCombo('${combo.id}', 'price', this.value)" />
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <input type="number" class="border p-1 rounded w-full" placeholder="Discounted Price" value="${combo.discountedPrice}" 
                        oninput="updateCombo('${combo.id}', 'discountedPrice', this.value)" />
                </td>
                <td class="border border-gray-300 px-4 py-2">
                    <button class="bg-red-500 text-white px-4 py-2 rounded" onclick="deleteCombo('${combo.id}')">Delete</button>
                </td>
            </tr>
        `
              )
              .join("")
        : `<tr><td colspan="5" class="text-center p-4">No combinations found</td></tr>`;
}

function updateCombo(id, field, value) {
    const combo = combinations.find((c) => c.id === id);
    if (combo) {
        combo[field] = value;
        saveCombinations();
    }
}

function deleteCombo(id) {
    combinations = combinations.filter((combo) => combo.id !== id);
    saveCombinations();
    renderCombinations();
}


renderCombinations();
