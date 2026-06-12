/*------ localStorage ------*/
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []//if there nothing in cart
} //read cart for the local storage, Json: store cart data into array

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}//upadate the cart after users add items or change quantity

function cartTotal() {
    return getCart().reduce(function (sum, item) {
        return sum + item.price * item.qty;
    }, 0); //calculate the total price of all product 
}
/*--------put cart items into different pages, avoid repeated html-------*/
function renderItemsInto(box) {
    box.innerHTML = getCart().map(function (item) {
        return `
            <div class="cart_item">
                <img class="cart_item_img" src="${item.image}" alt="${item.name}">
                <div class="cart_item_info">
                    <div class="cart_item_head">
                        <h3 class="cart_item_name">${item.name}</h3>
                        <p class="cart_item_price">$${item.price}</p>
                    </div>
                    <p class="cart_item_size">Size: ${item.size}</p>
                    <div class="cart_item_control">
                        <div class="quantity_box">
                            <button class="qty_minus">-</button>
                            <input type="text" value="${item.qty}">
                            <button class="qty_plus">+</button>
                        </div>
                        <button class="cart_item_delete">
                            <img src="../Image/product1/delete.png" alt="delete">
                        </button>
                    </div>
                </div>
            </div>`;
    }).join('');
}

/*--------- add .cart_items to related pages ---------*/
var itemsBox = document.querySelector('.cart_items');
if (itemsBox) {
    renderItemsInto(itemsBox);
    document.querySelectorAll('.summary_row span:last-child').forEach(function(el) {
        el.textContent = '$' + cartTotal();
    });
}

/*-------- red dot on cart icon --------------------*/
function updateCartDot () {
    var dot = document.querySelector('.cart_badge');
    if (!dot) return;
    if (getCart().length > 0) {
        dot.classList.add('is_visible');
    } else {
        dot.classList.remove('is_visible');
    }
}
updateCartDot();


/*--------- add to cart + cart pop up page ----------*/
var addBtn = document.querySelector(' .add_to_cart');
if (addBtn) {
    addBtn.addEventListener('click', function() {
        var qtyInput = document.querySelector(' .product_size .quantity_box input');
        var cart = getCart();
        cart.push({
            name: addBtn.dataset.name,
            price: Number(addBtn.dataset.price),
            size: addBtn.dataset.size,
            image: addBtn.dataset.image,
            qty: Number(qtyInput.value) || 1
        });
        saveCart(cart);
        updateCartDot();

        if (itemsBox) renderItemsInto(itemsBox);
        document.querySelector(' .cart_popup').classList.add('is_open');
        document.body.style.overflow = 'hidden'; //lock the background
    });
}

/*-------- keep shopping + close pop up page ------*/
var keepBtn = document.querySelector(' .keep_shopping');
if(keepBtn) {
    keepBtn.addEventListener('click', function () {
        document.querySelector('.cart_popup').classList.remove('is_open');
        document.body.style.overflow = ''; //remove the lock
    });
}

/*--- checkoutpage/successpage: Pay now ------*/
var payBtn = document.querySelector(' .pay_now');
if (payBtn) {
    payBtn.addEventListener('click', function() {
        location.href = "success.html";
    });
}

/*----- sucess: clear cart ------*/
var successText = document.querySelector('.success_text');
if (successText) {
    successText.textContent = 'Successfully paid $' + cartTotal();
    localStorage.removeItem('cart');
    updateCartDot();
}

/*--- close in mobile, open in laptop------*/
function syncOrderSummary() {
    const d = document.querySelector('.checkout_summary');
    if (!d) return;
    d.open = !window.matchMedia('(max-width: 480px)').matches;
}
syncOrderSummary();
window.addEventListener('resize', syncOrderSummary);