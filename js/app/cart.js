 jQuery(document).ready(function($) {
    // Функция для обновления корзины через AJAX
    function updateCart(cartItemKey, qty, $item) {
        $.ajax({
            type: 'POST',
            url: wc_cart_params.ajax_url,
            data: {
                action: 'update_cart_qty',
                cart_item_key: cartItemKey,
                quantity: qty
            },
            success: function(response) {
                if (response.success) {
                    // Обновляем сумму корзины
                    $('.cart-subtotal').html(response.data.subtotal);
                    $('.cart-total').html(response.data.total);

                    // Обновляем количество в элементе
                    $item.find('.count__products').html(qty + 'x');

                    // Обновляем прогресс-бар доставки
                    let freeShippingMin = 3000;
                    let cartTotal = parseFloat(response.data.subtotal_raw);
                    let progress = Math.min(100, Math.round((cartTotal / freeShippingMin) * 100));
                    let remaining = freeShippingMin - cartTotal;

                    if (cartTotal < freeShippingMin) {
                        $('.cart-free-shipping-block').html(`
                            <div class="cart-free-shipping-title">Отримай безкоштовну доставку</div>
                            <div class="cart-free-shipping-desc">Додай ${remaining.toFixed(2)} грн до кошика</div>
                            <div class="cart-free-shipping-progress">
                                <div class="progress-bar-bg">
                                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                                    <img src="${wc_cart_params.template_url}/assets/img/main-page/products/cart/car_delivery.svg" class="progress-car" style="left: calc(${progress}% - 24px);" alt="car">
                                </div>
                            </div>
                            <div class="cart-free-shipping-add">
                                <a href="${wc_cart_params.shop_url}">ДОДАТИ ТОВАР +</a>
                            </div>
                        `);
                    } else {
                        $('.cart-free-shipping-block').html(`
                            <div class="cart-free-shipping-title">Безкоштовна доставка!</div>
                            <div class="cart-free-shipping-desc">Ви досягли суми для безкоштовної доставки!</div>
                        `);
                    }

                    // Триггерим событие обновления корзины WooCommerce
                    $(document.body).trigger('wc_fragment_refresh');
                }
            },
            error: function() {
                alert('Помилка при оновленні корзини. Спробуйте ще раз.');
            }
        });
    }

    // Обработчики для кнопок изменения количества
    $('.cart-products-list').on('click', '.product-qty-minus', function(e) {
        e.preventDefault();
        let $item = $(this).closest('.cart-product-item');
        let cartItemKey = $item.data('cart-item-key');
        let $input = $item.find('.product-qty-value');
        let qty = parseInt($input.val()) || 1;

        if (qty > 1) {
            qty--;
            $input.val(qty);
            updateCart(cartItemKey, qty, $item);
        }
    });

    $('.cart-products-list').on('click', '.product-qty-plus', function(e) {
        e.preventDefault();
        let $item = $(this).closest('.cart-product-item');
        let cartItemKey = $item.data('cart-item-key');
        let $input = $item.find('.product-qty-value');
        let qty = parseInt($input.val()) || 1;

        qty++;
        $input.val(qty);
        updateCart(cartItemKey, qty, $item);
    });

    $('.cart-products-list').on('input', '.product-qty-value', function() {
        let $item = $(this).closest('.cart-product-item');
        let cartItemKey = $item.data('cart-item-key');
        let qty = parseInt($(this).val());

        if (isNaN(qty) || qty < 1) {
            qty = 1;
            $(this).val(qty);
        }
        updateCart(cartItemKey, qty, $item);
    });
});