/* Get products from JSON */
let productsPromise;

function getProducts() {
    if (!productsPromise) { // If productPromise not already set.
        productsPromise = fetch("db/products.json").then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        });
    }
    return productsPromise;
}

/* List categories */
async function listCategories() {
    const data = await getProducts(); // Get products from JSON.
    if (!data?.length) return; // If fetch faild, stop.

    const byId = new Map();
    data.forEach(({ productCategory: cat }) => {
        if (cat?.id != null) byId.set(cat.id, cat);
    });

    const catList = [...byId.values()] // Make sorted list of categories with unique values.
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'sv'));

    const categoryLists = document.querySelectorAll('.categoryList'); // Get all elements with the categorylist-class.

    if (categoryLists.length === 0) return; // If no elements were found, stop.

    categoryLists.forEach(categoryList => { // Loop the list of lists.
        const firstEl = categoryList.firstElementChild; // Get first childelement of list.
        if (!firstEl) return; // If no chidelement was found, stop.

        const templateEl = firstEl.cloneNode(true); // Clone the first child element.
        categoryList.replaceChildren(); // Remove the original child elements.

        const templateLink = (templateEl.tagName.toLocaleLowerCase() == 'a') // If the child element is a link, set it as template element. If not, try to set child to template element.
            ? templateEl
            : templateEl.querySelector('a');

        const templateInput = templateEl.querySelector('input');
        const templateLabel = templateEl.querySelector('label');

        if (!templateLink && !(templateInput && templateLabel)) return; // If no template elements were found, stop.

        catList.forEach(cat => { // Loop through the sorted categories list.
            const el = templateEl.cloneNode(true); // Clone the template element.

            if (templateLink) { // If the content of the element == link.
                const a = (el.tagName.toLocaleLowerCase() == 'a') // Check if the cloned element is an anchor.
                    ? el
                    : el.querySelector('a');

                const newHref = templateLink.href.split('#')[0].split('?')[0];
                a.href = `${newHref}?catid=${cat.id}`; // Add href.

                a.textContent = cat.name ?? ''; // Add text content.

            } else {
                const input = el.querySelector('input');
                const label = el.querySelector('label');

                input.dataset.catid = cat.id;
                input.id = label.htmlFor = `catid_${cat.id}`; // Add id to input and for to label.
                label.textContent = cat.name ?? ''; // Add text content to label.
            }
            categoryList.append(el); // Append the newly created element to the category list.
        });
        templateEl.remove(); // Remove the template element.
    });
}

listCategories();