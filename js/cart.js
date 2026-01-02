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

/* Toggle cart visibility */
(()=>{
    const cart = document.getElementById('shoppingCart');
    const cartButton = document.querySelector('nav .nav-right > button:first-of-type');

    if (cartButton && cart) {
        cartButton.addEventListener('click', () => cart.classList.toggle('open'));
    }
})();

/* Add to cart and sum */
(()=>{
    const cart = document.getElementById('shoppingCart');
    const placeholder = cart.querySelector('li.placeholder');
    const template = placeholder.cloneNode(true);
    placeholder.remove();

    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('button.addToCart');
        if (!btn) return;

        const productCard = btn.closest('article.productCard');
        if (!productCard) return;

        const productSearchId = productCard.dataset.productId;
        if (!productSearchId) return;

        const data = await getProducts(); // Get products from JSON.
        if (!data?.length) return; // If fetch faild, stop.

        const product = data.find(p => p.productId === productSearchId); // Get product with product id found in product card's data attribute.
        if (!product) return;

        const productAttr = [
            'productId',
            'productName',
            'productImage',
            'productCategory',
            'productBrand',
            'productPrice',
        ];

        const cart = document.getElementById('shoppingCart');
        const cartList = cart?.querySelector('ul');
        const sum = cart?.querySelector('.sum');

        if (!cartList || !sum) return;

        sum.innerText = '';

        const onEnd = (e) => {
            if (e.propertyName !== 'opacity') return; // Animation to wait for.
            
            const newLi = template.cloneNode(true);
            newLi.querySelector('span.productName').innerText = product.productName;
            newLi.querySelector('span.productPrice').innerText = `${product.productPrice['amount']} ${product.productPrice['currency']}`;
            cartList.append(newLi);

            updateSum();

        };

        if (!cart.classList.contains('open')) { // If shopping cart not akready open.
            cart.classList.add('open'); // Open the shopping cart.

            cart.addEventListener('transitionend', onEnd, { once: true }); // Wait for transition to finish, then run onEnd.

            setTimeout(() => {
                cart.classList.remove('open'); 
            }, 2000); // Close the shopping cart after 2 seconds.
        } else {
            onEnd({ propertyName: 'opacity' });
        }
    });
})();

/* Remove from cart */
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('button.remove');
    if (!btn) return;

    btn.closest('li').remove();
    updateSum();
});

/* Update sum */
function updateSum() {

    const cart = document.getElementById('shoppingCart');
    const sum = cart?.querySelector('.sum');

    if (!sum) return;
    
    if (cart.querySelectorAll('li').length === 0) {

        sum.innerText = 'Your shopping cart is empty.';

    } else {

        let calcSum = 0;

        cart.querySelectorAll('li span.productPrice').forEach(a => {
            calcSum = calcSum + Number(a.innerText.replace(/\D/g,''));
        });

        sum.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0, currencyDisplay: 'code' }).format(calcSum);
    }
}

updateSum();