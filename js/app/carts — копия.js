jQuery(document).ready(function ($) {
    function formatPrice(amount) {
        let formatted = (Math.round(amount * 100) / 100).toFixed(wc_cart_params.decimals);
        formatted = formatted.replace('.', wc_cart_params.decimal_separator);
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, wc_cart_params.thousand_separator);
        return formatted + ' ' + wc_cart_params.currency_symbol;
    }
    let currentDiscountDisplay = '-20%'; // Значение по умолчанию
    function updateCart(cartItemKey, qty, $item) {
        if (!cartItemKey) {
            alert('Помилка: неможливо оновити корзину, ключ товару відсутній.');
            return;
        }
        const discountPercentElement = $('.color__cupon_proccent');
        if (discountPercentElement.length) {
            currentDiscountDisplay = discountPercentElement.text().trim();
        } else {
            currentDiscountDisplay = '-20%'; // Значение по умолчанию, если элемента нет
        }
        $item.find('.product-qty-minus, .product-qty-plus, .product-qty-value').prop('disabled', true).addClass('disabled');

        $.ajax({
            type: 'POST',
            url: wc_cart_params.ajax_url,
            data: {
                action: 'update_cart_qty',
                cart_item_key: cartItemKey,
                quantity: qty
            },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    $('.cart-subtotal').html(response.data.subtotal);
                    $('.cart-total').html(response.data.total);
                    $item.find('.count__products').html(qty + 'x');

                    let cartTotal = parseFloat(response.data.subtotal_raw);
                    let discountTotal = parseFloat(response.data.discount_total_raw || 0);
                    let shippingTotal = parseFloat(response.data.shipping_total_raw || 0);
                    let originalTotal = cartTotal + shippingTotal;
                    let finalTotal = parseFloat(response.data.total_raw);

                    // Обновляем строку "Персональна знижка"
                    let discountRow = $('.cart-summary-row.discount-row');
                    if (discountTotal > 0) {
                        if (discountRow.length) {
                           // discountRow.find('.cart-discount').html(formatPrice(discountTotal));
                           discountRow.html(`
                            <span class="text__cart discount">Персональна знижка:</span>
                            <span class="cart-discount">${formatPrice(discountTotal)}
                                <img src="${wc_cart_params.template_url}/assets/img/main-page/products/cart/sales_cupon_enter.png">
                                <span class="color__cupon_proccent">${currentDiscountDisplay}</span>
                            </span>
                        `);
                        } else {

                            $('.cart-discount').text(formatPrice(discountTotal));

                            // $('<div class="cart-summary-row discount-row"><span class="text__cart discount">Персональна знижка:</span><span class="cart-discount">' + formatPrice(discountTotal) + '</span></div>').insertAfter('.cart-summary-row:contains("Сума")');
                        }
                    } else {
                        discountRow.remove();
                    }

                    // Обновляем строку "Разом:" с перечеркнутой и новой ценой
                    let totalRow = $('.cart-summary-row.total');
                    totalRow.find('.cart-total-wrapper, .cart-final-total').remove(); // Очищаем старые элементы
                    if (discountTotal > 0) {
                        totalRow.append(`
                            <span class="cart-total-wrapper">
                                <span class="cart-original-total carts" style="text-decoration: line-through; margin-right: 10px;">${formatPrice(originalTotal)}</span>
                                <span class="cart-final-total">${formatPrice(finalTotal)}</span>
                            </span>
                        `);
                    } else {
                        totalRow.append('<span class="cart-final-total">' + formatPrice(finalTotal) + '</span>');
                    }

                    let freeShippingMin = 3000;
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

                    $(document.body).trigger('wc_fragment_refresh');
                } else {
                    alert('Помилка при оновленні корзини: ' + (response.data?.message || 'Невідома помилка'));
                }
            },
            error: function () {
                alert('Помилка при оновленні корзини. Спробуйте ще раз.');
            },
            complete: function () {
                $item.find('.product-qty-minus, .product-qty-plus, .product-qty-value').prop('disabled', false).removeClass('disabled');
            }
        });
    }

    $('.cart-products-list').on('click', '.product-qty-minus', function (e) {
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

    $('.cart-products-list').on('click', '.product-qty-plus', function (e) {
        e.preventDefault();
        let $item = $(this).closest('.cart-product-item');
        let cartItemKey = $item.data('cart-item-key');
        let $input = $item.find('.product-qty-value');
        let qty = parseInt($input.val()) || 1;

        qty++;
        $input.val(qty);
        updateCart(cartItemKey, qty, $item);
    });

    $('.cart-products-list').on('input', '.product-qty-value', function () {
        let $item = $(this).closest('.cart-product-item');
        let cartItemKey = $item.data('cart-item-key');
        let qty = parseInt($(this).val());

        if (isNaN(qty) || qty < 1) {
            qty = 1;
            $(this).val(qty);
        }
        updateCart(cartItemKey, qty, $item);
    });

    const couponForm = $('form.cart-coupon-form');
    if (couponForm.length) {
        const couponInput = couponForm.find('input#coupon_code');
        const messageContainer = couponForm.find('.coupon-message');
        let timeout;

        if (!messageContainer.length) {
            couponForm.append('<div class="coupon-message"></div>');
        }

        // Инициализация активного купона при загрузке страницы
        if (Object.keys(wc_cart_params.coupons).length > 0) {
            couponInput.hide();
            couponForm.find('.cart-coupon-active-block').remove(); // Удаляем существующий блок
            $.each(wc_cart_params.coupons, function (code, coupon) {
                couponForm.append(`
                    <div class="cart-coupon-active-block">
                        <div class="cart-coupon-active">
                            <img src="${wc_cart_params.template_url}/assets/img/main-page/products/cart/sales_cupon.png" alt="Купон" class="cart-coupon-icon">
                            <span class="cart-coupon-text">${coupon.display.replace('(щоб видалити натисніть тут)', '')}</span>
                            <a href="#" class="cart-coupon-remove" data-coupon-code="${coupon.code}"><img
                                        src="${wc_cart_params.template_url}/assets/img/main-page/products/cart/delete_cupon.png"></a>
                        </div>
                    </div>
                `);
            });
        }

        couponInput.on('input', function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                const couponValue = couponInput.val().trim();
                messageContainer.text('').removeClass('success error');

                if (couponValue) {
                    const validCoupons = ['20', 'богдан', 'fishmac', 'victoria', 'TOP99GEN', 'bogdan', 'top.partner', 'top.friend', 'top.coworker', 'antonina', 'likadance10', 'cnm10'];
                    if (validCoupons.includes(couponValue.toLowerCase())) {
                        $.ajax({
                            type: 'POST',
                            url: wc_cart_params.ajax_url,
                            data: {
                                action: 'apply_coupon',
                                coupon_code: couponValue
                            },
                            dataType: 'json',
                            beforeSend: function () {
                                couponForm.find('input#coupon_code, .cart-coupon-form').prop('disabled', true).addClass('disabled');
                            },
                            success: function (response) {
                                if (response.success) {
                                    $('.cart-subtotal').html(response.data.subtotal);
                                    $('.cart-total').html(response.data.total);
                                    messageContainer.text('').removeClass('success error');
                                    couponInput.hide();
                                    couponForm.find('.cart-coupon-active-block').remove(); // Удаляем существующий блок
                                    couponForm.append(`
                                        <div class="cart-coupon-active-block">
                                            <div class="cart-coupon-active">
                                                <img src="${wc_cart_params.template_url}/assets/img/main-page/products/cart/sales_cupon.png" alt="Купон" class="cart-coupon-icon">
                                                <span class="cart-coupon-text">${response.data.coupon_display.replace('(щоб видалити натисніть тут)', '')}</span>
                                                <a href="#" class="cart-coupon-remove" data-coupon-code="${couponValue}"><img
                                        src="${wc_cart_params.template_url}/assets/img/main-page/products/cart/delete_cupon.png"></a>
                                            </div>
                                        </div>
                                    `);

                                    let discountRow = $('.cart-summary-row.discount-row');
                                    if (discountRow.length) {
                                        discountRow.find('.cart-discount').html(response.data.discount_total);
                                    } else {
                                        const html = `
                                        <div class="cart-summary-row discount-row">
                                          <span class="text__cart discount">Персональна знижка:</span>
                                          <span class="cart-discount">${response.data.discount_total} 
                                           <img src="${wc_cart_params.template_url}/assets/img/main-page/products/cart/sales_cupon_enter.png">
                                          <span class="color__cupon_proccent">-${response.data.coupon_amount}%</span></span>
                                          
                                        </div>
                                      `;
                              
                                        $(html).insertAfter('.cart-summary-row:contains("Сума")');
                                    }

                                    let totalRow = $('.cart-summary-row.total');
                                    totalRow.find('.cart-total-wrapper, .cart-final-total').remove();
                                    if (parseFloat(response.data.discount_total_raw || 0) > 0) {
                                        totalRow.append(`
                                            <span class="cart-total-wrapper">
                                                <span class="cart-original-total carts" style="text-decoration: line-through; margin-right: 10px;">${response.data.original_subtotal}</span>
                                                <span class="cart-final-total  ">${response.data.total}</span>
                                            </span>
                                        `);
                                    } else {
                                        totalRow.append('<span class="cart-final-total">' + response.data.total + '</span>');
                                    }

                                    $(document.body).trigger('wc_fragment_refresh');
                                } else {
                                    messageContainer.text(response.data.message).addClass('error');
                                }
                            },
                            error: function () {
                                messageContainer.text('Помилка при застосуванні промокоду. Спробуйте ще раз.').addClass('error');
                            },
                            complete: function () {
                                couponForm.find('input#coupon_code, .cart-coupon-form').prop('disabled', false).removeClass('disabled');
                            }
                        });
                    } else {
                        messageContainer.text('Недійсний промокод.').addClass('error');
                    }
                } else {
                    messageContainer.text('Будь ласка, введіть промокод.').addClass('error');
                }
            }, 100);
        });

        // Обработчик удаления купона
        $(document).on('click', '.cart-coupon-remove', function (e) {
            e.preventDefault();
            const couponCode = $(this).data('coupon-code');
            $.ajax({
                type: 'POST',
                url: wc_cart_params.ajax_url,
                data: {
                    action: 'remove_coupon',
                    coupon_code: couponCode
                },
                dataType: 'json',
                beforeSend: function () {
                    couponForm.find('.cart-coupon-form').prop('disabled', true).addClass('disabled');
                },
                success: function (response) {
                    if (response.success) {
                        $('.cart-subtotal').html(response.data.subtotal);
                        $('.cart-total').html(response.data.total);
                        couponForm.find('.cart-coupon-active-block').remove();
                        couponInput.val('').show();
                        messageContainer.text('Купон видалено.').addClass('success');
                        $('.cart-summary-row.discount-row').remove(); // Удаляем строку скидки
                        let totalRow = $('.cart-summary-row.total');
                        totalRow.find('.cart-total-wrapper, .cart-final-total').remove();
                        totalRow.append('<span class="cart-final-total">' + response.data.total + '</span>');
                        $(document.body).trigger('wc_fragment_refresh');
                    } else {
                        messageContainer.text(response.data.message).addClass('error');
                    }
                },
                error: function () {
                    messageContainer.text('Помилка при видаленні купона. Спробуйте ще раз.').addClass('error');
                },
                complete: function () {
                    couponForm.find('.cart-coupon-form').prop('disabled', false).removeClass('disabled');
                }
            });
        });
    }
});