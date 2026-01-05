/*
* Gruppuppgift: E-shop
* Grupp 4 / FaceRoots
* Oscar Nilsson
* oscar.nilsson@medieinstitutet.se
*/

/* If function not already exists */
if (typeof(getProducts) !== 'function') {
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
}

/* Get products for the shopping cart */
(async ()=>{
    const numProducts = 4; // Number of products in shopping cart.
    const placeholder = document.querySelector('article.productCard');
    const container = placeholder?.closest('main');

    if (!container) return;

    const data = await getProducts(); // Get products from JSON.
    if (!data?.length) return; // If fetch faild, stop.

    const template = placeholder.cloneNode(true);
    placeholder.remove();
    const productAttr = [
        'productId',
        'productName',
        'productImage',
        'productCategory',
        'productBrand',
        'productPrice',
        
    ];

    const cartSummary = document.querySelector('ul.cartSummary');
    console.log(cartSummary);
    const placeholderItem = cartSummary?.querySelector('li.item');
    const tax = cartSummary?.querySelector('li.tax');
    const sum = cartSummary?.querySelector('li.sum');
    if (!placeholderItem || !tax || !sum) return;

    const templateItem = placeholderItem.cloneNode(true);
    placeholderItem.remove();

    for (let index = 0; index < numProducts; index++) {
        const newProductCard = template.cloneNode(true);
        const newLi = templateItem.cloneNode(true);

        productAttr.forEach(attr => {
            if (attr == 'productPrice') {
                newProductCard.querySelector(`.${attr}`).innerText = 
                    newLi.querySelector('span:last-child').innerText = `${data[index][attr]['amount']} ${data[index][attr]['currency']}`;
            } else if (attr == 'productImage') {
                newProductCard.querySelector(`.${attr}`).src = `img/products/${data[index][attr]}`;
            } else if (attr == 'productCategory') {
                newProductCard.querySelector(`.${attr}`).innerText = data[index][attr]['name'];
            } else if (attr == 'productName') {
                newProductCard.querySelector(`.${attr}`).innerText =
                    newLi.querySelector('span:first-child').innerText = data[index][attr];
            } else if (attr == 'productId') {
                const inputId = `input${data[index][attr]}`;
                newProductCard.querySelector('.form-group input').id = 
                    newProductCard.querySelector('.form-group label').htmlFor = inputId;
            } else {
                newProductCard.querySelector(`.${attr}`).innerText = data[index][attr];
            }
        });

        container.append(newProductCard);
        cartSummary.insertBefore(newLi, sum );
    
    }
    template.remove();
    templateItem.remove();

    updateCheckoutSum();
})();

/* Update sum */
function updateCheckoutSum() {

    const cartSummary = document.querySelector('.cartSummary');
    // const placeholder = cartSummary.querySelector('li:not(.tax):not(.sum)');
    const tax = cartSummary?.querySelector('.tax span:last-child');
    const sum = cartSummary?.querySelector('.sum span:last-child');

    if (!sum || !tax) return;
    // if (placeholder) placeholder.remove();

    let calcSum = 0;

    cartSummary.querySelectorAll('li:not(.sum):not(.tax)').forEach(a => {
        calcSum = calcSum + Number(a.innerText.replace(/\D/g,''));
    });

    tax.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0, currencyDisplay: 'code' }).format(calcSum * 0.25);
    sum.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0, currencyDisplay: 'code' }).format(calcSum);
}

updateCheckoutSum();