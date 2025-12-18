(() => {
    const buyBtns = document.querySelectorAll('button.buy'); // Declare array with all buyBtns on page.
    const cartItems = document.querySelector('span.cartItems'); // Declare constant cartItems.

    if (buyBtns.length == 0 || !cartItems) return; // If there aren't any buyBtns or cartItems on page, stop.

    let i = cartItems.innerHTML; // Take current value from span.cartItems.

    buyBtns.forEach(btn => { // Make each button.btn on page listen for click events.
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default behavior of button.
            i++; // Increment items.
            cartItems.innerHTML = i; // Replace .cartItems' current html with incremented value.
        });
    });
})();

(() => {

    const input = document.querySelector('input#mockupProducts');
    const minVal = input.getAttribute('min');
    const maxVal = input.getAttribute('max');
    if (!input) return;

    const events = ['change', 'keyup'];

    events.forEach(ev => {
        input.addEventListener(ev, () => {
            let mockupProducts = Math.min(Math.max(input.value, minVal), maxVal);
            input.value = mockupProducts;
            updateMockups(mockupProducts);
        });
    });


    function updateMockups (mockupProducts) {
        const main = document.querySelector('main');
        const productCards = main?.querySelectorAll('article.productCard');

        if (!productCards || productCards.length === 0) return;

        if (productCards.length < mockupProducts) {
            for (let index = productCards.length; index < mockupProducts; index++) {
                article = document.createElement('article');
                article.className = 'productCard';
                article.innerHTML = productCards[0].innerHTML.split('1').join(index + 1);
                main.append(article);
            }
        }

        if (productCards.length > mockupProducts) {
            console.log('pC.length', productCards.length);
            console.log('mockupProducts', mockupProducts);
            for (let index = productCards.length; index > mockupProducts; index--) {
                productCards[index-1].remove();
            }
        }
    }

})();