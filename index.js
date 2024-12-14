let combinations = JSON.parse(localStorage.getItem("combinations")) || [];

document.getElementById("productCategory").addEventListener("change", (e) => {
    const category = e.target.value;
    const dynamicFields = document.getElementById("dynamicFields");

    dynamicFields.innerHTML = "";

    switch (category) {
        case "food":
            dynamicFields.innerHTML = `
                <div>
                    <label class="block text-gray-600 font-medium mb-1">Product Name</label>
                    <input id="productName" type="text" required class="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" placeholder="Enter product name" />
                </div>
                <div>
                    <label class="block text-gray-600 font-medium mb-1">Weight Range</label>
                    <select id="weightRange" required class="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring focus:ring-blue-200 focus:outline-none">
                        <option value="" disabled selected>Select weight range</option>
                        <option value="50-500">50g to 500g</option>
                        <option value="500-1000">500g to 1kg</option>
                    </select>
                </div>
            `;
            break;

        case "clothes":
            dynamicFields.innerHTML = `
                <div>
                    <label class="block text-gray-600 font-medium mb-1">Product Name</label>
                    <input id="productName" type="text" required class="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" placeholder="Enter product name" />
                </div>
             
            `;
            break;

        case "medicine":
            dynamicFields.innerHTML = `
                <div>
                    <label class="block text-gray-600 font-medium mb-1">Product Name</label>
                    <input id="productName" type="text" required class="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring focus:ring-blue-200 focus:outline-none" placeholder="Enter product name" />
                </div>
            
            `;
            break;

        default:
            dynamicFields.innerHTML = "";
    }
});

document.getElementById("generateButton").addEventListener("click", () => {
    const productCategory = document.getElementById("productCategory").value;
    if (!productCategory) {
        alert("Please select a product category!");
        return;
    }

    const productName = document.getElementById("productName").value;
    if (!productName) {
        alert("Please enter the product name!");
        return;
    }

    if (productCategory === "food") {
        const weightRange = document.getElementById("weightRange").value;
        if (!weightRange) {
            alert("Please select a weight range!");
            return;
        }
        const [min, max] = weightRange.split("-").map(Number);
        for (let weight = min; weight <= max; weight += 100) {
            addCombination(productCategory, { productName, weight: `${weight}g` });
        }
    }

    if (productCategory === "clothes") {
        const sizes = ["S", "M", "L", "XL", "XXL"];
        const colors = ["Yellow", "Red", "White", "Blue", "Green"];
        for (const size of sizes) {
            for (const color of colors) {
                addCombination(productCategory, { productName, size, color });
            }
        }
    }

    if (productCategory === "medicine") {
        const doses = ["5mg", "10mg", "50mg", "100mg"];
        const colors = ["Yellow", "Red", "White", "Blue", "Green"];
        for (const dose of doses) {
            for (const color of colors) {
                addCombination(productCategory, { productName, dose, });
            }
        }
    }

    updateTable();
});

function addCombination(category, details) {
    const combination = {
        category,
        ...details,
        stock: 0,
        price: 0,
        discountedPrice: 0,
    };
    combinations.push(combination);
    localStorage.setItem("combinations", JSON.stringify(combinations));
}

function updateTable() {
    const tableBody = document.getElementById("combinationsTable");
    tableBody.innerHTML = combinations
        .map(
            (combo, index) => `
            <tr>
                <td class="border border-gray-300 px-4 py-2">${combo.category} - ${combo.productName || "Unnamed"}</td>
                <td class="border border-gray-300 px-4 py-2">${combo.weight || combo.size || combo.dose || ""}</td>
                <td class="border border-gray-300 px-4 py-2">${combo.color || ""}</td>
                <td class="border border-gray-300 px-4 py-2"><input type="number" min="0" value="${combo.stock}" data-index="${index}" class="stockInput border border-gray-300 p-1 w-full"></td>
                <td class="border border-gray-300 px-4 py-2"><input type="number" min="0" value="${combo.price}" data-index="${index}" class="priceInput border border-gray-300 p-1 w-full"></td>
                <td class="border border-gray-300 px-4 py-2"><input type="number" min="0" value="${combo.price}" data-index="${index}" class="priceInput border border-gray-300 p-1 w-full"></td>
                <td class="border border-gray-300 px-4 py-2"><button data-index="${index}" class="deleteButton text-red-500">Delete</button>
                </td>
            </tr>
        `
        )
        .join("");

    attachTableListeners();
}

function attachTableListeners() {
    document.querySelectorAll(".stockInput").forEach((input) => {
        input.addEventListener("input", (e) => {
            const index = e.target.dataset.index;
            combinations[index].stock = parseInt(e.target.value, 10) || 0;
            localStorage.setItem("combinations", JSON.stringify(combinations));
        });
    });

    document.querySelectorAll(".priceInput").forEach((input) => {
        input.addEventListener("input", (e) => {
            const index = e.target.dataset.index;
            combinations[index].price = parseFloat(e.target.value) || 0;
            combinations[index].discountedPrice = combinations[index].price * 0.9; 
            localStorage.setItem("combinations", JSON.stringify(combinations));
            updateTable();
        });
    });

    document.querySelectorAll(".deleteButton").forEach((button) => {
        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            combinations.splice(index, 1);
            localStorage.setItem("combinations", JSON.stringify(combinations));
            updateTable();
        });
    });
}

// Initialize table on page load
updateTable();
