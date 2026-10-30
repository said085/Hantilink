
const KEY = "hantilink-products";

function getProducts() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]")
            .filter(item => item && typeof item === "object");
    } catch (error) {
        return [];
    }
}

function saveProducts(products) {
    localStorage.setItem(KEY, JSON.stringify(products));
}

const productList = document.getElementById("product-list");
const savedList = document.getElementById("saved-list");
const productForm = document.getElementById("product-form");

function showProducts(products) {
    if (!productList) return;
    productList.replaceChildren();

    if (products.length === 0) {
        productList.textContent = "No products found.";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "card";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const category = document.createElement("p");
        category.textContent = product.category;

        const price = document.createElement("p");
        price.textContent = "KES " + Number(product.price).toLocaleString();

        const supplier = document.createElement("p");
        supplier.textContent = "Supplier: " + product.supplier;

        const description = document.createElement("p");
        description.textContent = product.description;

        card.append(name, category, price, supplier, description);
        productList.appendChild(card);
    });
}

function showSavedProducts() {
    if (!savedList) return;
    savedList.replaceChildren();

    const products = getProducts();

    if (products.length === 0) {
        savedList.textContent = "No saved products yet.";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "card";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "KES " + Number(product.price).toLocaleString();

        const remove = document.createElement("button");
        remove.className = "delete-button";
        remove.textContent = "Delete";
        remove.type = "button";

        remove.addEventListener("click", () => {
            const remaining = getProducts().filter(
                item => item.id !== product.id
            );

            try {
                saveProducts(remaining);
                refreshPages();
            } catch (error) {
                alert("Could not delete the product.");
            }
        });

        card.append(name, price, remove);
        savedList.appendChild(card);
    });
}

function refreshPages() {
    const products = getProducts();
    showProducts(products);
    showSavedProducts();

    const count = document.getElementById("about-count");
    if (count) count.textContent = products.length;
}

if (productForm) {
    productForm.addEventListener("submit", event => {
        event.preventDefault();

        const value = id => document.getElementById(id).value.trim();
        const price = Number(value("product-price"));

        if (price <= 0 || !Number.isFinite(price)) {
            document.getElementById("form-message").textContent =
                "Enter a price greater than zero.";
            return;
        }

        const product = {
            id: Date.now().toString(),
            name: value("product-name"),
            category: value("product-category"),
            price: price,
            supplier: value("supplier-name"),
            description: value("product-description")
        };

        try {
            const products = getProducts();
            products.push(product);
            saveProducts(products);
            productForm.reset();
            refreshPages();

            document.getElementById("form-message").textContent =
                "Product saved successfully!";
        } catch (error) {
            document.getElementById("form-message").textContent =
                "Could not save. Check your browser storage.";
        }
    });
}

const searchForm = document.getElementById("search-form");

if (searchForm) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        const term = document.getElementById("search-input")
            .value.trim().toLowerCase();

        const matches = getProducts().filter(product =>
            [product.name, product.category, product.supplier]
                .some(value => value.toLowerCase().includes(term))
        );

        showProducts(matches);

        document.getElementById("search-message").textContent =
            matches.length + " product(s) found.";
    });
}

refreshPages();
