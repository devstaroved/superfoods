jQuery(document).ready(function ($) {
    $('.product__box').each(function () {
        const $box = $(this);
        const productType = $box.data('product-type');
        const productId = $box.data('product-id');
        const variations = productData.variations[productType] || {};
        let currentWeight = null; // Изначально вес не выбран

        console.log(`Инициализация блока для ${productType}. Данные вариаций:`, variations);
        console.log(`Доступные ключи вариаций:`, Object.keys(variations));
        console.log(`Тип продукта: ${productType}`);

        // Функция для формирования ключа веса для variations
        function getWeightKey(weight) {
            // Всегда добавляем " г" к весу для поиска в variations
            return `${weight} г`;
        }

        // Функция для формирования attribute_weight (обратное преобразование slug)
        function getAttributeWeight(weight) {
            // Преобразуем вес в slug формат: 100+100 -> 100-g-100-g, 250 -> 250-g
            return weight.replace(/\+/g, '-g-') + '-g';
        }

        // Функция для пересчета и отображения цены
        function updatePrice() {
            const quantity = parseInt($box.find('.product-qty-value').val()) || 1;
            let basePrice = 0;
            let weightKey;

            if (currentWeight) {
                weightKey = getWeightKey(currentWeight);
                const variation = variations[weightKey] || {};
                basePrice = variation.price ? parseFloat(variation.price.replace(/[^0-9.]/g, '')) || 0 : 0;
                console.log(`Поиск вариации: weightKey="${weightKey}", найдена вариация:`, variation);
            } else {
                // Изначальная цена за минимальный вес
                const defaultWeight = ['combo_tabletki', 'combo_poroshok'].includes(productType) ? '100+100' : '100';
                weightKey = getWeightKey(defaultWeight);
                const variation = variations[weightKey] || {};
                basePrice = variation.price ? parseFloat(variation.price.replace(/[^0-9.]/g, '')) || 0 : 0;
                console.log(`Поиск дефолтной вариации: defaultWeight="${defaultWeight}", weightKey="${weightKey}", найдена вариация:`, variation);
            }
            const totalPrice = Math.round(basePrice * quantity);
            $box.find('.product-card__price').html(`${totalPrice} грн`);
            console.log(`Обновление цены для ${productType}, вес=${currentWeight || 'default'}, weightKey=${weightKey}, basePrice=${basePrice}, quantity=${quantity}, totalPrice=${totalPrice}`);
        }

        // Инициализация вариаций
        function initializeVariations() {
            if (!variations) {
                console.error(`Нет данных для ${productType}`);
                $box.find('.weight-card').each(function () {
                    $(this).attr('data-price-single', '0');
                    $(this).attr('data-variation-id', '');
                });
                $box.find('.product-card__price').html('0 грн');
                return;
            }

            $box.find('.weight-card').each(function () {
                const weight = $(this).data('weight');
                const weightKey = getWeightKey(weight);
                const variation = variations[weightKey] || {};
                const price = variation.price ? parseFloat(variation.price.replace(/[^0-9.]/g, '')) || 0 : 0;
                const variationId = variation.variation_id || '';
                $(this).attr('data-price-single', price);
                $(this).attr('data-variation-id', variationId);

                console.log(`Инициализация веса ${weight}, weightKey: ${weightKey}, price: ${price}, variationId: ${variationId}`);
            });

            // Изначально показываем цену за минимальный вес
            updatePrice();
            updateVariationId();
            updateBuyButton();
        }

        // Обновление variation_id, product_id и attribute_weight
        function updateVariationId() {
            if (currentWeight) {
                const weightKey = getWeightKey(currentWeight);
                const variationId = variations[weightKey] ? variations[weightKey].variation_id || '' : '';
                const attributeWeight = currentWeight;

                //   $box.find('.productid').val(variationId);
                $box.find('.variation-id').val(variationId);
                $box.find('.attribute-weight').val(attributeWeight);
                console.log(`Обновлена форма для ${productType}: productId=${productId}, variationId=${variationId}, attributeWeight=${attributeWeight}`);
            } else {
                $box.find('.variation-id').val('');
                $box.find('.attribute-weight').val('');
                console.log(`Форма для ${productType} сброшена: variationId и attributeWeight пусты`);
            }
            $box.find('.product-id').val(productId);
            updateBuyButton();
        }
        // Функция для формирования attribute_weight (обратное преобразование slug)
        function getAttributeWeight(weight) {
            // "500+500" -> "500-500-g", "250" -> "250-g"
            return weight.replace(/\+/g, '-') + '-g';
        }
        // Обновление шорткода [viewBuyButton]
        function updateBuyButton() {
            const variationId = $box.find('.variation-id').val() || '';

            // Кнопка "Купить"
            const $mainButton = $box.find('.product-card__cart');
            if ($mainButton.length) {
                $mainButton.attr('data-variation_id', variationId);
                $mainButton.attr('data-productid', variationId);
                console.log(`Обновлена КНОПКА КУПИТЬ: data-variation_id и data-productid = ${variationId}`);
            }

            // Кнопка "Купить в 1 клик"
            const $quickButton = $box.find('.product-card__one-click .single_add_to_cart_button');
            if ($quickButton.length) {
                $quickButton.attr('data-variation_id', variationId);
                $quickButton.attr('data-productid', variationId);
                console.log(`Обновлена КНОПКА В 1 КЛИК: data-variation_id и data-productid = ${variationId}`);
            }
        }

        // Выбор веса
        $box.find('.weight-card').on('click', function () {
            $box.find('.weight-card').removeClass('selected');
            $(this).addClass('selected');
            currentWeight = $(this).data('weight');
            console.log(`Выбран вес для ${productType}: ${currentWeight}`);

            // Показываем блок с количеством и кнопкой "Купить в 1 клик"
            $box.find('.products__action__but').show();
            $box.find('.product-card__choose').hide();

            updateVariationId();
            updatePrice();
        });

        // Клик на кнопку "Обрати вагу"
        $box.find('.product-card__choose').on('click', function () {
            //  alert('Будь ласка, оберіть вагу продукту.');
        });

        // Управление количеством
        $box.find('.product-qty-minus').on('click', function (e) {
            e.preventDefault();
            let qty = parseInt($box.find('.product-qty-value').val()) || 1;
            if (qty > 1) {
                qty--;
                $box.find('.product-qty-value').val(qty);
                updatePrice();
            }
        });

        $box.find('.product-qty-plus').on('click', function (e) {
            e.preventDefault();
            let qty = parseInt($box.find('.product-qty-value').val()) || 1;
            qty++;
            $box.find('.product-qty-value').val(qty);
            updatePrice();
        });

        $box.find('.product-qty-value').on('input', function () {
            let qty = parseInt($(this).val());
            if (isNaN(qty) || qty < 1) {
                $(this).val(1);
            }
            updatePrice();
        });

        // Обработка добавления в корзину

        $box.find('.product-card__cart').on('click', function (e) {
            e.preventDefault();
            console.log('Кнопка нажата');
            function formatWeight(weight) {

                weight = weight.replace('-g', '');

                if (weight.match(/(\d+)[-+](\d+)/)) {
                    return weight.replace(/(\d+)[-+](\d+)/, '$1 г + $2 г');
                }
                // Для одиночного веса добавляем " г"
                return weight + ' г';
            }
            const $localBox = $(this).closest('.product__box'); // <-- Актуальный блок продукта!
            const productId = $localBox.find('.product-id').val();
            const variationId = $localBox.find('.variation-id').val();
            const quantity = $localBox.find('.product-qty-value').val();
            const attributeWeights = $localBox.find('.attribute-weight').val();
            const attributeWeight = getAttributeWeight(attributeWeights);
            console.log('variationId перед отправкой:', variationId);

            console.log('productId:', productId);
            console.log('variationId:', variationId);
            console.log('quantity:', quantity);
            console.log('attributeWeight:', attributeWeight);
            if (!variationId) {
                // Показываем кастомное уведомление об ошибке
                $('.cart-error-text').text('Будь ласка, оберіть вагу продукту.');
                $('.cart-error-message').addClass('show').fadeIn();

                // Автоматическое скрытие через 4 секунды
                setTimeout(() => {
                    $('.cart-error-message').fadeOut(() => {
                        $(this).removeClass('show');
                    });
                }, 4000);

                return;
            }

            $.ajax({
                url: '/?wc-ajax=add_to_cart',
                type: 'POST',
                data: {
                    'add-to-cart': productId,

                    variation_id: variationId,
                    quantity: quantity,
                    attribute_pa_weight: attributeWeight
                },
                success: function (response) {
                    console.log('Добавление прошло успешно:', response);

                    console.log('Полный ответ AJAX:', response);
                    console.log('Fragments:', response.fragments);
                    console.log('Cart contents count:', response.cart_contents_count);
                    // Получаем данные о товаре из DOM
                    const productTitle = $localBox.find('.product-cards__title').text().trim(); // заменишь на свой селектор
                    const attributeWeightLabel = $localBox.find('.attribute-weight').val();

                    // Показываем сообщение
                    const formattedWeight = formatWeight(attributeWeight);
                    const message = `${productTitle} (${formattedWeight}) додано до кошика.`;
                    $('.cart-added-text').text(message);
                    $('.cart-add-success-message').fadeIn();

                    // Автоматическое скрытие через 6 секунд (если нужно)
                    setTimeout(() => {
                        $('.cart-add-success-message').fadeOut();
                    }, 6000);

                    if (window.location.pathname === '/cart/') {
                        location.reload();
                    }

                    // Обновляем количество товаров в корзине
                    if (response.fragments) {
                        // Заменяем фрагменты, возвращенные WooCommerce
                        $.each(response.fragments, function (key, value) {
                            $(key).replaceWith(value);
                        });
                    } else if (response.cart_contents_count !== undefined) {
                        // Если фрагментов нет, обновляем .cart-count вручную
                        const cartCount = response.cart_contents_count || 0;
                        if (cartCount > 0) {
                            $('.cart-count').text(cartCount).show();
                        } else {
                            $('.cart-count').hide();
                        }
                    }

                    // Триггер события для обновления других элементов корзины
                    $(document.body).trigger('wc_fragment_refresh');
                },
                error: function () {
                    alert('Произошла ошибка. Попробуйте еще раз.');
                }
            });

        });


        // Инициализация блока
        initializeVariations();
    });
    // 
    new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        loop: true,
        spaceBetween: 13,

        // Параметры для iOS
        touchEventsTarget: 'container',
        simulateTouch: true,
        touchRatio: 1,
        touchAngle: 45,
        grabCursor: true,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        lazy: false, // полностью отключено
        preloadImages: true, // загружать сраз
        // Предотвращение конфликтов
        touchStartPreventDefault: false,
        touchMoveStopPropagation: false,
        preventClicks: false,
        preventClicksPropagation: false,

        // Специфичные настройки для iOS
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: true,

        navigation: {
            nextEl: '.reviews-swiper-next',
            prevEl: '.reviews-swiper-prev'
        },

        breakpoints: {
            900: { slidesPerView: 4 },
            768: { slidesPerView: 1.5 },
            0: { slidesPerView: 1.5 }
        },

        // Обработчики событий
        on: {
            init: function () {
                // Принудительное обновление после инициализации
                this.update();
            },
            touchStart: function () {
                this.allowTouchMove = true;
            }
        }
    });

    // галерея в товаре 





    $('.product-layout').each(function () {
        const $box = $(this);
        const productType = $box.data('product-type') || 'unknown';
        const productId = $box.data('product-id');
        const variations = productData.variations[productType] || {};
        //  let currentWeight = '100'; // Начальный вес 100 г
        let currentWeight = ['combo_tabletki', 'combo_poroshok'].includes(productType) ? '100+100' : '100';
        console.log(currentWeight);
        let isRecommendedAdded = false; // Флаг для отслеживания добавления рекомендованного товара

        console.log(`Инициализация блока: productId=${productId}, productType=${productType}`);
        console.log('productData:', productData);
        console.log('Variations для текущего productType:', variations);

        // Функция для пересчета цены основного товара
        function updatePrice() {
            const quantity = parseInt($box.find('.product-qty-value').val()) || 1;
            let basePrice = 0;
            const weightKey = currentWeight ? (currentWeight.includes('+') ? currentWeight + ' г' : currentWeight + ' г') : '100 г';
            const variation = variations[weightKey] || variations['100 г'] || {};
            basePrice = variation.price
                ? parseFloat(variation.price.replace(/[^0-9.]/g, '')) || 0
                : parseFloat($box.find(`.weight-card[data-weight="${currentWeight || '100'}"]`).data('price-single') || 0);
            const totalPrice = Math.round(basePrice * quantity);

            // Обновляем цену основного товара
            $box.find('.product-card__price').html(`${totalPrice} грн`);

            // Обновляем общую цену
            updateTotalPrice();

            console.log(`Обновление цены: productType=${productType}, weightKey=${weightKey}, basePrice=${basePrice}, quantity=${quantity}, totalPrice=${totalPrice}, variation=`, variation);
        }

        // Функция для обновления общей цены
        // Исправленная функция для обновления общей цены
        function updateTotalPrice() {
            // Получаем базовую цену основного товара
            const quantity = parseInt($box.find('.product-qty-value').val()) || 1;
            const weightKey = currentWeight ? (currentWeight.includes('+') ? currentWeight + ' г' : currentWeight + ' г') : '100 г';
            const variation = variations[weightKey] || variations['100 г'] || {};
            const basePrice = variation.price
                ? parseFloat(variation.price.replace(/[^0-9.]/g, '')) || 0
                : parseFloat($box.find(`.weight-card[data-weight="${currentWeight || '100'}"]`).data('price-single') || 0);
            const mainPrice = Math.round(basePrice * quantity);

            let totalPrice = mainPrice;

            if (isRecommendedAdded) {
                // Получаем данные рекомендованного товара
                const $reklammaCard = $box.find('.products__reklamma-card');
                const relatedProductId = parseInt($reklammaCard.data('related-product-id'));

                // Определяем правильный тип связанного товара на основе ID
                let relatedProductType;
                if (relatedProductId === 10001) {
                    relatedProductType = 'tabletki';
                } else if (relatedProductId === 10063) {
                    relatedProductType = 'poroshok';
                } else if (relatedProductId === 10075) {
                    relatedProductType = 'chlorella_tabletki';
                } else if (relatedProductId === 10070) {
                    relatedProductType = 'chlorella_poroshok';
                } else if (relatedProductId === 10088) {
                    relatedProductType = 'combo_tabletki';
                } else if (relatedProductId === 10098) {
                    relatedProductType = 'combo_poroshok';
                } else {
                    relatedProductType = 'unknown';
                }

                // ИСПРАВЛЕНИЕ: Берем данные из productData.variations[relatedProductType]
                const relatedVariations = productData.variations[relatedProductType] || {};
                const relatedVariation = relatedVariations[weightKey] || relatedVariations['100 г'] || {};

                console.log('=== DEBUG РЕКОМЕНДОВАННОГО ТОВАРА ===');
                console.log('relatedProductId:', relatedProductId);
                console.log('relatedProductType:', relatedProductType);
                console.log('weightKey:', weightKey);
                console.log('relatedVariations:', relatedVariations);
                console.log('variation:', variation);

                console.log('variation_id:', variation.variation_id);

                if (relatedVariation && relatedVariation.price) {
                    const relatedBasePrice = parseFloat(relatedVariation.price.replace(/[^0-9.]/g, '')) || 0;
                    let recommendedPrice = 0;
                    const osnov_id = variation.variation_id;

                    if (weightKey === '500 г') {


                        if (relatedProductId == 10070) { // Основной товар Cпіруліна в порошку  скидка на Хлорела в порошку 
                            recommendedPrice = Math.round(relatedBasePrice * 0.81795); // 18.33% скидка
                        } else if (relatedProductId === 10063) {// Основной товар Хлорела в порошку скидка на спирулину в порошке
                            recommendedPrice = Math.round(relatedBasePrice * 0.778125); // 18.33% скидка
                        } else if (relatedProductId === 10075) {// Основной товар Спирулина в таблетках скидка на  Хлорелла в таблетках
                            recommendedPrice = Math.round(relatedBasePrice * 0.8167); // 18.33% скидка
                        }
                        else if (relatedProductId === 10001) {// Основной товарХлорелла в таблетках скидка на  Спирулина в таблетках 
                            recommendedPrice = Math.round(relatedBasePrice * 0.78); // 18.33% скидка
                        }



                    } else if (weightKey === '250 г') {

                        if (relatedProductId == 10070) { // Основной товар Cпіруліна в порошку  скидка на Хлорела в порошку 
                            recommendedPrice = Math.round(relatedBasePrice * 0.87333); // 18.33% скидка
                        } else if (relatedProductId === 10063) {// Основной товар Хлорела в порошку скидка на спирулину в порошке
                            recommendedPrice = Math.round(relatedBasePrice * 0.8435); // 18.33% скидка
                        } else if (relatedProductId === 10075) {// Основной товар Спирулина в таблетках скидка на  Хлорелла в таблетках
                            recommendedPrice = Math.round(relatedBasePrice * 0.8709); // 18.33% скидка
                        }
                        else if (relatedProductId === 10001) {// Основной товарХлорелла в таблетках скидка на  Спирулина в таблетках 
                            recommendedPrice = Math.round(relatedBasePrice * 0.8465); // 18.33% скидка
                        }



                        // recommendedPrice = Math.round(relatedBasePrice * 0.871); // 13% скидка
                    } else if (weightKey === '100 г') {


                        if (relatedProductId == 10070) { // Основной товар Cпіруліна в порошку  скидка на Хлорела в порошку 
                            recommendedPrice = Math.round(relatedBasePrice * 0.9096); // 18.33% скидка
                        } else if (relatedProductId === 10063) {// Основной товар Хлорела в порошку скидка на спирулину в порошке
                            recommendedPrice = Math.round(relatedBasePrice * 0.8881); // 18.33% скидка
                        } else if (relatedProductId === 10075) {// Основной товар Спирулина в таблетках скидка на  Хлорелла в таблетках
                            recommendedPrice = Math.round(relatedBasePrice * 0.9073); // 18.33% скидка
                        }
                        else if (relatedProductId === 10001) {// Основной товарХлорелла в таблетках скидка на  Спирулина в таблетках 
                            recommendedPrice = Math.round(relatedBasePrice * 0.8915); // 18.33% скидка
                        }


                    }

                    totalPrice = mainPrice + recommendedPrice;

                    console.log(`Цена рекомендованного товара: базовая=${relatedBasePrice}, со скидкой=${recommendedPrice}`);
                } else {
                    console.log('Рекомендованный товар: variation не найден или нет цены');
                    console.log('Доступные ключи в relatedVariations:', Object.keys(relatedVariations));
                    // Если вариация не найдена, оставляем только основную цену
                    totalPrice = mainPrice;
                }
            }

            // Обновляем основную цену
            $box.find('.product-card__price').html(`${totalPrice} грн`);

            console.log(`Обновлена общая цена: основная=${mainPrice}, рекомендованная=${isRecommendedAdded ? (totalPrice - mainPrice) : 0}, общая=${totalPrice}`);
        }

        // Функция для обновления блока .products__reklamma-card
        function updateRelatedProduct() {
            const $reklammaCard = $box.find('.products__reklamma-card');
            if (!$reklammaCard.length) {
                console.log(`Блок .products__reklamma-card отсутствует для productId=${productId}`);
                return;
            }

            const relatedProductId = $reklammaCard.data('related-product-id');

            // Определяем правильный тип связанного товара
            let relatedProductType;
            if (relatedProductId == 10001) {
                relatedProductType = 'tabletki';
            } else if (relatedProductId == 10075) {
                relatedProductType = 'chlorella_tabletki';
            } else if (relatedProductId == 10063) {
                relatedProductType = 'poroshok';
            } else if (relatedProductId == 10070) {
                relatedProductType = 'chlorella_poroshok';
            } else {
                relatedProductType = 'unknown';
            }

            // ИСПРАВЛЕНИЕ: Используем window.productData вместо productData
            const relatedVariations = window.productData.variations[relatedProductType] || {};

            console.log("=== ОБНОВЛЕНИЕ РЕКОМЕНДАЦИИ ===");
            console.log("Current Weight:", currentWeight);
            console.log("Related Product ID:", relatedProductId);
            console.log("Related Product Type:", relatedProductType);
            console.log("All window.productData.variations:", window.productData.variations);
            console.log("Related Variations for type '" + relatedProductType + "':", relatedVariations);

            // Формируем weightKey для связанного товара
            const weightKey = currentWeight
                ? (currentWeight.includes('+') ? currentWeight + ' г' : currentWeight + ' г')
                : '100 г';
            const displayWeight = weightKey;
            const variation = relatedVariations[weightKey] || relatedVariations['100 г'] || {};

            console.log("Weight Key для поиска:", weightKey);
            console.log("Display Weight:", displayWeight);
            console.log("Found Variation:", variation);

            if (!variation || !variation.variation_id) {
                console.error("Вариация не найдена для веса:", weightKey);
                console.log("Доступные веса в relatedVariations:", Object.keys(relatedVariations));
            }

            // Обновляем элементы карточки рекомендации
            $reklammaCard.find('.products__reklamma-weight').text(displayWeight);

            if (variation.price) {
                const basePrice = parseFloat(variation.price.replace(/[^0-9.]/g, '')) || 0;

                // Учитываем скидку по весу
                let discountMultiplier = 0.85; // По умолчанию 15% скидка
                if (weightKey === '500 г') {


                    if (relatedProductId == 10070) { // Основной товар Cпіруліна в порошку  скидка на Хлорела в порошку 
                        discountMultiplier = 0.81795;// 18.33% скидка
                    } else if (relatedProductId === 10063) {// Основной товар Хлорела в порошку скидка на спирулину в порошке
                        discountMultiplier = 0.778125;

                    } else if (relatedProductId === 10075) {// Основной товар Спирулина в таблетках скидка на  Хлорелла в таблетках
                        discountMultiplier = 0.8167;

                    }
                    else if (relatedProductId === 10001) {// Основной товарХлорелла в таблетках скидка на  Спирулина в таблетках 
                        discountMultiplier = 0.78;

                    }


                } else if (weightKey === '250 г') {




                    if (relatedProductId == 10070) { // Основной товар Cпіруліна в порошку  скидка на Хлорела в порошку 
                        discountMultiplier = 0.87333;

                    } else if (relatedProductId === 10063) {// Основной товар Хлорела в порошку скидка на спирулину в порошке
                        discountMultiplier = 0.8435;

                    } else if (relatedProductId === 10075) {// Основной товар Спирулина в таблетках скидка на  Хлорелла в таблетках
                        discountMultiplier = 0.8709;

                    }
                    else if (relatedProductId === 10001) {// Основной товарХлорелла в таблетках скидка на  Спирулина в таблетках 
                        discountMultiplier = 0.8465;

                    }


                } else if (weightKey === '100 г') {
                    discountMultiplier = 0.9073; // 9.27% скидка


                    if (relatedProductId == 10070) { // Основной товар Cпіруліна в порошку  скидка на Хлорела в порошку 
                        discountMultiplier = 0.9096; // 9.27% скидка

                    } else if (relatedProductId === 10063) {// Основной товар Хлорела в порошку скидка на спирулину в порошке

                        discountMultiplier = 0.8881; // 9.27% скидка
                    } else if (relatedProductId === 10075) {// Основной товар Спирулина в таблетках скидка на  Хлорелла в таблетках

                        discountMultiplier = 0.9073; // 9.27% скидка
                    }
                    else if (relatedProductId === 10001) {// Основной товарХлорелла в таблетках скидка на  Спирулина в таблетках 

                        discountMultiplier = 0.8915; // 9.27% скидка
                    }

                }

                const discountPrice = Math.round(basePrice * discountMultiplier);
                const originalPrice = Math.round(basePrice);

                $reklammaCard.find('.products__reklamma-price-new').text(discountPrice + ' грн');
                $reklammaCard.find('.products__reklamma-price-old').text(originalPrice + ' грн');
            } else {
                $reklammaCard.find('.products__reklamma-price-new').text('0 грн');
                $reklammaCard.find('.products__reklamma-price-old').text('0 грн');
            }

            $reklammaCard.find('.products__reklamma-btn').attr('data-variation-id', variation.variation_id || '');
            $reklammaCard.attr('data-related-variation-id', variation.variation_id || '');

            // Правильно формируем атрибут веса для корзины
            const attributeWeight = currentWeight
                ? String(currentWeight).replace(/\+/g, '-') + '-g'
                : '100-g';
            $reklammaCard.attr('data-related-weight', attributeWeight);

            // Обновляем общую цену после изменения рекомендованного товара
            updateTotalPrice();

            console.log(`Обновлён блок рекомендации: relatedProductType=${relatedProductType}, вес=${displayWeight}, variation_id=${variation.variation_id}, attributeWeight=${attributeWeight}`);
        }
        // Функция для обновления текста кнопки рекомендованного товара
        function updateRecommendedButton() {
            const $button = $box.find('.products__reklamma-btn');
            if (isRecommendedAdded) {
                $button.text('Видалити').addClass('remove-mode');
            } else {
                $button.text('ДОДАТИ ЗІ ЗНИЖКОЮ +').removeClass('remove-mode');
            }
        }

        // Инициализация вариаций
        function initializeVariations() {
            if (!variations || $.isEmptyObject(variations)) {
                console.error(`Нет данных для productType=${productType}, productId=${productId}`);
                $box.find('.weight-card').each(function () {
                    const weight = String($(this).data('weight'));
                    const price = $(this).data('price-single') || 0;
                    const variationId = $(this).data('variation-id') || '';
                    $(this).attr('data-price-single', price);
                    $(this).attr('data-variation-id', variationId);
                    console.log(`Вариация для веса ${weight}: price=${price}, variation_id=${variationId}`);
                });
                // Устанавливаем начальную цену из HTML
                const initialPrice = $box.find('.weight-card[data-weight="100"]').data('price-single') || 550;
                $box.find('.product-card__price').html(`${initialPrice} грн`);
                // Устанавливаем начальные значения для скрытых полей
                $box.find('.variation-id').val($box.find('.weight-card[data-weight="100"]').data('variation-id') || '10076');
                $box.find('.attribute-weight').val('100-g');
            } else {
                $box.find('.weight-card').each(function () {
                    const weight = String($(this).data('weight'));
                    const weightKey = weight.includes('+') ? weight + ' г' : weight + ' г';
                    const variation = variations[weightKey] || {};
                    const price = variation.price
                        ? parseFloat(variation.price.replace(/[^0-9.]/g, '')) || 0
                        : $(this).data('price-single') || 0;
                    const variationId = variation.variation_id || $(this).data('variation-id') || '';
                    $(this).attr('data-price-single', price);
                    $(this).attr('data-variation-id', variationId);
                    console.log(`Вариация для веса ${weightKey}: price=${price}, variation_id=${variationId}`);
                });
            }

            // Устанавливаем начальный вес 100 г
            if (['combo_tabletki', 'combo_poroshok'].includes(productType)) {
                currentWeight = '100+100';
                $box.find(`.weight-card[data-weight="${currentWeight}"]`).addClass('selected');
            } else {
                currentWeight = '100';
                $box.find(`.weight-card[data-weight="${currentWeight}"]`).addClass('selected');
            }

            $box.find('.products__action__but').show();
            $box.find('.product-card__choose').hide();

            updatePrice();
            updateVariationId();
            updateBuyButton();
            updateRelatedProduct();
            updateRecommendedButton();
        }

        // Обновление variation_id, product_id и attribute_weight
        function updateVariationId() {
            const cw = String(currentWeight || '');
            const weightKey = cw ? (cw.includes('+') ? cw + ' г' : cw + ' г') : '';
            const variationId = weightKey && variations[weightKey] ? variations[weightKey].variation_id || '' : '';
            const attributeWeight = cw ? cw.replace(/\+/g, '-') + '-g' : '';
            $box.find('.variation-id').val(variationId);
            $box.find('.attribute-weight').val(attributeWeight);
            $box.find('.product-id').val(productId);
            console.log(`Обновлена форма: productType=${productType}, productId=${productId}, variationId=${variationId}, attributeWeight=${attributeWeight}`);
            updateBuyButton();
        }

        // Обновление шорткода [viewBuyButton]
        function updateBuyButton() {
            const variationId = $box.find('.variation-id').val() || '';
            const $button = $box.find('.product-card__one-click').find('.single_add_to_cart_button');
            if ($button.length) {
                $button.attr('data-variation_id', variationId);
                $button.attr('data-productid', variationId);
                console.log(`Обновлена кнопка: productType=${productType}, data-variation_id=${variationId}`);
            }
        }

        // Выбор веса
        $box.find('.weight-card').on('click', function () {
            $box.find('.weight-card').removeClass('selected');
            $(this).addClass('selected');
            currentWeight = String($(this).data('weight'));
            console.log(`Выбран вес для ${productType}: ${currentWeight}`);

            $box.find('.products__action__but').show();
            $box.find('.product-card__choose').hide();

            updateVariationId();
            updatePrice();
            updateRelatedProduct(); // Обновляем рекомендацию при изменении веса
        });

        // Клик на кнопку "Обрати вагу"
        $box.find('.product-card__choose').on('click', function () {
            alert('Будь ласка, оберіть вагу продукту.');
        });

        // Управление количеством
        $box.find('.product-qty-minus').on('click', function (e) {
            e.preventDefault();
            let qty = parseInt($box.find('.product-qty-value').val()) || 1;
            if (qty > 1) {
                qty--;
                $box.find('.product-qty-value').val(qty);
                updatePrice();
            }
        });

        $box.find('.product-qty-plus').on('click', function (e) {
            e.preventDefault();
            let qty = parseInt($box.find('.product-qty-value').val()) || 1;
            qty++;
            $box.find('.product-qty-value').val(qty);
            updatePrice();
        });

        $box.find('.product-qty-value').on('input', function () {
            let qty = parseInt($(this).val());
            if (isNaN(qty) || qty < 1) {
                $(this).val(1);
            }
            updatePrice();
        });

        // Добавление основного товара в корзину
        /*    $box.find('.product-card__cart').on('click', function (e) {
                e.preventDefault();
                console.log('Кнопка нажата');
    
                const $localBox = $(this).closest('.product-layout'); // <-- Актуальный блок продукта!
                const productId = $localBox.find('.product-id').val();
                const variationId = $localBox.find('.variation-id').val();
                const quantity = $localBox.find('.product-qty-value').val();
                const attributeWeight = $localBox.find('.attribute-weight').val();
    
                if (!variationId) {
                    alert('Пожалуйста, выберите вес продукта.');
                    return;
                }
    
    
           
               // const productType = $localBox.data('product-type') || 'unknown';
    
    
                $.ajax({
                    url: '/?wc-ajax=add_to_cart',
                    type: 'POST',
                    data: {
                        product_id: productId,
                        variation_id: variationId,
                        quantity: quantity,
                        attribute_pa_weight: attributeWeight
                    },
                    success: function (response) {
                        console.log('Добавление прошло успешно:', response);
    
    
                        // Получаем данные о товаре из DOM
                        const productTitle = $localBox.find('.product-title').text().trim(); // заменишь на свой селектор
                        const attributeWeightLabel = $localBox.find('.attribute-weight').val();
    
                        // Показываем сообщение
                        const message = `${productTitle} (${attributeWeightLabel}) додано до кошика.`;
                        $('.cart-added-text').text(message);
                        $('.cart-add-success-message').fadeIn();
    
                        // Автоматическое скрытие через 6 секунд (если нужно)
                        setTimeout(() => {
                            $('.cart-add-success-message').fadeOut();
                        }, 6000);
                    },
                    error: function () {
                        alert('Произошла ошибка. Попробуйте еще раз.');
                    }
                });
            }); */



        $box.find('.product-card__cart').on('click', function (e) {
            e.preventDefault();
            console.log('Кнопка нажата');

            const $localBox = $(this).closest('.product-layout');
            const productId = $localBox.find('.product-id').val();
            const variationId = $localBox.find('.variation-id').val();
            const quantity = parseInt($localBox.find('.product-qty-value').val()) || 1;
            const attributeWeight = $localBox.find('.attribute-weight').val();
            const productType = $localBox.data('product-type') || 'unknown';
            const isRecommendedAdded = $localBox.find('.products__reklamma-btn').hasClass('remove-mode'); // Проверяем, добавлен ли рекомендованный товар

            if (!variationId) {
                alert('Пожалуйста, выберите вес продукта.');
                return;
            }
            function formatWeight(weight) {

                weight = weight.replace('-g', '');

                if (weight.match(/(\d+)[-+](\d+)/)) {
                    return weight.replace(/(\d+)[-+](\d+)/, '$1 г + $2 г');
                }
                // Для одиночного веса добавляем " г"
                return weight + ' г';
            }
            // Маппинг комбо-продуктов
            const comboMap = {
                combo_tabletki: {
                    '100+100': { comboId: 10089, productId: 10088 },
                    '250+250': { comboId: 10090, productId: 10088 },
                    '500+500': { comboId: 10091, productId: 10088 }
                },
                combo_poroshok: {
                    '100+100': { comboId: 10099, productId: 10098 },
                    '250+250': { comboId: 10100, productId: 10098 },
                    '500+500': { comboId: 10101, productId: 10098 }
                }
            };

            // Проверяем, нужно ли добавить комбо
            if (isRecommendedAdded && ['tabletki', 'poroshok', 'chlorella_tabletki', 'chlorella_poroshok'].includes(productType)) {
                // Определяем тип комбо на основе основного товара
                //const comboType = productType === 'tabletki' ? 'combo_tabletki' : 'combo_poroshok';
                const comboType = (productType === 'tabletki' || productType === 'chlorella_tabletki') ? 'combo_tabletki' : 'combo_poroshok';
                const weightKey = currentWeight.includes('+') ? currentWeight : currentWeight + '+' + currentWeight;
                const combo = comboMap[comboType][weightKey];



                if (!combo) {
                    alert('Ошибка: Неверный вес или тип комбо.');
                    return;
                }
                const weightForAttribute = weightKey.replace('+', '-') + '-g';

                // Формируем атрибут веса для комбо
                const comboVariations = productData.variations[comboType] || {};
                const comboVariation = comboVariations[weightKey + ' г'] || {};
                const formattedWeight = formatWeight(weightKey);
                const comboPrice = comboVariation.price
                    ? parseFloat(comboVariation.price.replace(/[^0-9.]/g, '')) || 0
                    : 0;

                console.log('=== Данные для добавления комбо ===');
                console.log('combo.productId:', combo.productId);
                console.log('combo.comboId:', combo.comboId);
                console.log('quantity:', quantity);
                console.log('attribute_pa_weight:', weightForAttribute);
                console.log('Ожидаемая цена комбо:', comboPrice);

                // AJAX-запрос для добавления комбо-продукта
                $.ajax({
                    url: '/?wc-ajax=add_to_cart',
                    type: 'POST',
                    data: {
                        'add-to-cart': combo.productId,

                        variation_id: combo.comboId,
                        quantity: quantity,
                        attribute_pa_weight: weightForAttribute
                    },
                    success: function (response) {
                        console.log('Добавление комбо прошло успешно:', response);

                        const productTitle = $localBox.find('.product-title').text().trim();
                        const message = `${productTitle} (${formattedWeight} г) додано до кошика.`;
                        $('.cart-added-text').text(message);
                        $('.cart-add-success-message').fadeIn();
                        setTimeout(() => {
                            $('.cart-add-success-message').fadeOut();
                        }, 6000);

                        // Обновляем количество товаров в корзине
                        if (response.fragments) {
                            // Заменяем фрагменты, возвращенные WooCommerce
                            $.each(response.fragments, function (key, value) {
                                $(key).replaceWith(value);
                            });
                        } else if (response.cart_contents_count !== undefined) {
                            // Если фрагментов нет, обновляем .cart-count вручную
                            const cartCount = response.cart_contents_count || 0;
                            if (cartCount > 0) {
                                $('.cart-count').text(cartCount).show();
                            } else {
                                $('.cart-count').hide();
                            }
                        }
                    },
                    error: function () {
                        alert('Произошла ошибка при добавлении комбо. Попробуйте еще раз.');
                    }
                });
            } else {
                // Обычный товар (не комбо или без рекомендованного)
                $.ajax({
                    url: '/?wc-ajax=add_to_cart',
                    type: 'POST',
                    data: {
                        'add-to-cart': productId,
                        variation_id: variationId,
                        quantity: quantity,
                        attribute_pa_weight: attributeWeight
                    },
                    success: function (response) {
                        console.log('Добавление прошло успешно:', response);
                        console.log('RAW ответ:', JSON.stringify(response));

                        // Обновляем количество товаров в корзине
                        if (response.fragments) {
                            // Заменяем фрагменты, возвращенные WooCommerce
                            $.each(response.fragments, function (key, value) {
                                console.log('Обновляем фрагмент:', key, value)
                                $(key).replaceWith(value);
                            });
                        } else if (response.cart_contents_count !== undefined) {
                            // Если фрагментов нет, обновляем .cart-count вручную
                            const cartCount = response.cart_contents_count || 0;
                            console.log('Обновляем cart-count:', cartCount);
                            if (cartCount > 0) {


                                $('.cart-count').text(cartCount).show();
                            } else {
                                $('.cart-count').hide();
                            }
                        }
                        const productTitle = $localBox.find('.product-title').text().trim();
                        const attributeWeightLabel = $localBox.find('.attribute-weight').val();
                        const formattedWeight = formatWeight(attributeWeight); // Форматируем вес для обычного товара
                        console.log(attributeWeight);
                        console.log(attributeWeightLabel);

                        const message = `${productTitle} (${formattedWeight}) додано до кошика.`;
                        $('.cart-added-text').text(message);
                        $('.cart-add-success-message').fadeIn();
                        setTimeout(() => {
                            $('.cart-add-success-message').fadeOut();
                        }, 6000);
                    },
                    error: function () {
                        alert('Произошла ошибка. Попробуйте еще раз.');
                    }
                });
            }
        });

        // Добавление/удаление рекомендованного товара
        $box.find('.products__reklamma-btn').on('click', function (e) {
            e.preventDefault();

            if (isRecommendedAdded) {
                // Удаляем рекомендованный товар (логически)
                isRecommendedAdded = false;
                updateRecommendedButton();
                updateTotalPrice();
                console.log('Рекомендованный товар удален из расчета');
                return;
            }

            // Добавляем рекомендованный товар
            const productId = $(this).data('product-id');
            const variationId = $(this).data('variation-id');
            const quantity = 1;
            const attributeWeight = $box.find('.products__reklamma-card').data('related-weight');

            if (!variationId) {
                alert('Пожалуйста, выберите вес продукта.');
                return;
            }

            // Отмечаем что рекомендованный товар добавлен
            isRecommendedAdded = true;
            updateRecommendedButton();
            updateTotalPrice();

            console.log('Рекомендованный товар добавлен к расчету');


        });

        initializeVariations();
    });


    $(document).ready(function () {
        // Применяем маску к billing_phone_coppy
        $("#billing_phone_coppy").inputmask({
            mask: ["+380 99 999 99 99", "099 999 99 99"], // Две маски: с +380 и без
            keepStatic: true, // Автоматически переключается между масками
            clearMaskOnLostFocus: false, // Маска сохраняется
            onBeforePaste: function (pastedValue, opts) {
                // Обрабатываем вставку автозаполнения
                let cleanValue = pastedValue.replace(/[\+\s()-]/g, "");
                if (cleanValue.startsWith("380")) {
                    return "+" + cleanValue; // Добавляем + для +380
                }
                return cleanValue;
            },
            onUnMask: function (maskedValue, unmaskedValue) {
                // Возвращаем очищенное значение
                let cleanValue = unmaskedValue.replace(/[\+\s()-]/g, "");
                return cleanValue; // Возвращаем полное значение, обработка ниже
            }
        });

        // Обновляем billing_phone при изменении billing_phone_coppy
        $("#billing_phone_coppy").on("input blur paste", function () {
            let inputValue = $(this).val();
            let cleanValue = inputValue.replace(/[\+\s()-]/g, "");

            // Удаляем префикс 380, если он есть
            if (cleanValue.startsWith("380")) {
                cleanValue = cleanValue.slice(3); // Оставляем только 9 цифр
            }

            // Устанавливаем очищенное значение в billing_phone
            $("#billing_phone").val(cleanValue);
        });

        // Инициализация значения billing_phone при загрузке
        let initialValue = $("#billing_phone_coppy").val();
        if (initialValue) {
            let cleanInitialValue = initialValue.replace(/[\+\s()-]/g, "");
            if (cleanInitialValue.startsWith("380")) {
                $("#billing_phone").val(cleanInitialValue.slice(3)); // Удаляем 380
            } else {
                $("#billing_phone").val(cleanInitialValue);
            }
        }
    });

    const doctorsSwiper = new Swiper('.doctors-swiper', {
        grid: { rows: 2, fill: 'row' },

        slidesPerView: 3,
        slidesPerGroup: 6,
        spaceBetween: 20,

        navigation: {
            nextEl: '.doctors-swiper-next',
            prevEl: '.doctors-swiper-prev',
        },

        breakpoints: {
            320: {
                slidesPerView: 2,
                slidesPerGroup: 6,
                spaceBetween: 15,
                grid: { rows: 3, fill: 'row' }
            },
            768: {
                slidesPerView: 2,
                slidesPerGroup: 4,
                spaceBetween: 18,
                grid: { rows: 2, fill: 'row' }
            },
            1024: {
                slidesPerView: 3,
                slidesPerGroup: 6,
                spaceBetween: 20,
                grid: { rows: 2, fill: 'row' }
            }
        },

        // <-- ключевая опция
        loop: false,
        rewind: true, // при клике next на последнем слайде вернёт на первый (и prev на первом — на последний). 

        grabCursor: true,
        keyboard: { enabled: true, onlyInViewport: true },
        mousewheel: { forceToAxis: true, sensitivity: 1 },
        speed: 400,
        simulateTouch: true,
        preventClicks: true,
        preventClicksPropagation: true,
        resistance: true,
        resistanceRatio: 0.85,
        threshold: 5,
        observer: true,
        observeParents: true,
    });

    // Доп. страховка для жеста (если пользователь свайпает ещё раз вправо когда уже на конце)
    doctorsSwiper.on('touchEnd', function () {
        // Если мы на конце и попытка — в сторону "next", перекидываем на 0
        if (this.isEnd && this.swipeDirection === 'next') {
            this.slideTo(0);
        }
    });

    // Хроллера


    jQuery(document).ready(function ($) {
        const $block = $('.block__three__spirulina');

        let currentWeight = '500'; // стартовый вес


        let activeTabId = $block.find('.tab-btn.active').attr('id');

        let productType;

        if (activeTabId === 'chlorella_poroshok' || activeTabId === 'chlorella_tabletki') {
            productType = activeTabId === 'chlorella_poroshok'
                ? 'chlorella_poroshok'
                : 'chlorella_tabletki';
        } else {
            productType = activeTabId === 'spirulina_poroshok'
                ? 'spirulina_poroshok'
                : 'spirulina_tabletki';
        }
        console.log('ТИП' + productType);
        console.log('activeTabId' + activeTabId);
        // Подготовка данных вариаций
        let variations = window.productData.variations[productType] || {};
        console.log(variations);
        // Функция пересчёта основной цены
        function updatePrice() {
            const qty = parseInt($block.find('.product-qty-value').val()) || 1;
            const weightKey = `${currentWeight} г`;
            const variant = variations[weightKey] || {};
            const base = variant.price
                ? parseFloat(variant.price.replace(/[^0-9.]/g, ''))
                : parseFloat($block.find(`.weight-card[data-weight="${currentWeight}"]`).data('price-single')) || 0;
            const total = Math.round(base * qty);
            $block.find('.product-card__price').text(`${total} грн`);
            updateTotalPrice();
            updateBuyButton();
            updateHiddenFields();
        }

        // Функция пересчёта общей цены (с учётом рекомендованного)
        function updateTotalPrice() {
            const qty = parseInt($block.find('.product-qty-value').val()) || 1;
            const weightKey = `${currentWeight} г`;
            const mainVariant = variations[weightKey] || {};
            const mainBase = mainVariant.price
                ? parseFloat(mainVariant.price.replace(/[^0-9.]/g, ''))
                : parseFloat($block.find(`.weight-card[data-weight="${currentWeight}"]`).data('price-single')) || 0;
            const mainTotal = Math.round(mainBase * qty);
            let sum = mainTotal;



            $block.find('.product-card__price').text(`${sum} грн`);
        }
        function updateBuyButton() {
            const $selectedWeightCard = $block.find('.weight-card.selected');
            const variationId = $selectedWeightCard.length ? $selectedWeightCard.attr('data-variation-id') || '' : '';
            const $button = $block.find('.product-card__one-click').find('.single_add_to_cart_button');
            if ($button.length) {
                $button.attr('data-variation_id', variationId);
                $button.attr('data-productid', variationId);
                console.log(`Обновлена кнопка: productType=${productType}, data-variation_id=${variationId}`);
            }
        }

        function updateHiddenFields() {
            const $selectedWeightCard = $block.find('.weight-card.selected');
            const variationId = $selectedWeightCard.length ? $selectedWeightCard.attr('data-variation-id') || '' : '';
            const weight = $selectedWeightCard.length ? $selectedWeightCard.data('weight') || '' : '';
            const attributeWeight = weight ? `${weight}-g` : '';

            // Получаем productId из активного таба
            const $activeTab = $block.find('.tab-btn.active');
            const productId = $activeTab.length ? $activeTab.attr('data-product-id') || '' : '';

            // Обновляем скрытые поля
            $block.find('input.product-id').val(productId);
            $block.find('input.variation-id').val(variationId);
            $block.find('input.attribute-weight').val(attributeWeight);

            console.log(`Обновлены скрытые поля: product-id=${productId}, variation-id=${variationId}, attribute-weight=${attributeWeight}`);
        }
        // Инициализация вариаций: заполняем data-атрибуты на карточках веса
        function initVariations() {
            $block.find('.weight-card').each(function () {
                const $wc = $(this);
                const w = String($wc.data('weight'));
                const key = `${w} г`;
                const varData = variations[key] || {};
                const price = varData.price
                    ? parseFloat(varData.price.replace(/[^0-9.]/g, ''))
                    : $wc.data('price-single') || 0;
                const vid = varData.variation_id || $wc.data('variation-id') || '';
                $wc.attr('data-price-single', price);
                $wc.attr('data-variation-id', vid);
                $wc.find('.weight-price').text(`${price} грн`);
            });

            // выделяем 100 г
            // если в разметке уже есть класс .selected, берем его, иначе – первый
            let $sel = $block.find('.weight-card.selected');
            if (!$sel.length) {
                $sel = $block.find('.weight-card').first().addClass('selected');
            }
            currentWeight = String($sel.data('weight'));


            updatePrice();
            updateBuyButton();
            updateHiddenFields();
        }

        // Смена веса
        $block.on('click', '.weight-card', function () {
            $block.find('.weight-card').removeClass('selected');
            $(this).addClass('selected');
            currentWeight = String($(this).data('weight'));
            initVariations();
            updateBuyButton();
            updateHiddenFields();
        });

        // Количество
        $block.find('.product-qty-minus').on('click', function (e) {
            e.preventDefault();
            let v = parseInt($block.find('.product-qty-value').val()) || 1;
            if (v > 1) {
                $block.find('.product-qty-value').val(--v);
                updatePrice();
            }
        });
        $block.find('.product-qty-plus').on('click', function (e) {
            e.preventDefault();
            let v = parseInt($block.find('.product-qty-value').val()) || 1;
            $block.find('.product-qty-value').val(++v);
            updatePrice();
        });
        $block.find('.product-qty-value').on('input', function () {
            let v = parseInt($(this).val());
            if (isNaN(v) || v < 1) v = 1;
            $(this).val(v);
            updatePrice();
        });

        // Переключение табов (tabletki/poroshok)
        $block.on('click', '.tab-btn', function () {
            $block.find('.tab-btn').removeClass('active');
            $(this).addClass('active');
            // скрываем/показываем секции
            let isPoro = false;
            const id = $(this).attr('id');
            // Проверяем, какой товар сейчас: хлорелла или спирулина
            if (id === 'chlorella_poroshok' || id === 'chlorella_tabletki') {
                isPoro = id === 'chlorella_poroshok';
                productType = isPoro ? 'chlorella_poroshok' : 'chlorella_tabletki';
            } else {
                // Если это спирулина
                isPoro = id === 'spirulina_poroshok';
                productType = isPoro ? 'spirulina_poroshok' : 'spirulina_tabletki';
            }
            variations = window.productData.variations[productType] || {};
            console.log(variations);
            $block.find('.tabletki-image, .tabletki-desc').toggle(!isPoro);
            $block.find('.poroshok-image, .poroshok-desc').toggle(isPoro);
            initVariations();
            updateBuyButton();
            updateHiddenFields();
        });

        // Кнопка «В корзину»
        $block.find('.product-card__cart').on('click', function (e) {
            e.preventDefault();
            const productId = $block.find('input.product-id').val();
            const variationId = $block.find('input.variation-id').val();
            const quantity = parseInt($block.find('.product-qty-value').val()) || 1;
            const attrW = $block.find('input.attribute-weight').val();
            function formatWeight(weight) {

                weight = weight.replace('-g', '');

                if (weight.match(/(\d+)[-+](\d+)/)) {
                    return weight.replace(/(\d+)[-+](\d+)/, '$1 г + $2 г');
                }
                // Для одиночного веса добавляем " г"
                return weight + ' г';
            }
            if (!variationId) {
                // Показываем кастомное уведомление об ошибке
                $('.cart-error-text').text('Будь ласка, оберіть вагу продукту.');
                $('.cart-error-message').addClass('show').fadeIn();

                // Автоматическое скрытие через 4 секунды
                setTimeout(() => {
                    $('.cart-error-message').fadeOut(() => {
                        $(this).removeClass('show');
                    });
                }, 4000);

                return;
            }

            $.ajax({
                url: '/?wc-ajax=add_to_cart',
                type: 'POST',
                data: {
                    'add-to-cart': productId,

                    variation_id: variationId,
                    quantity: quantity,
                    attribute_pa_weight: attrW
                },
                success: function (response) {
                    console.log('Добавление прошло успешно:', response);

                    console.log('Полный ответ AJAX:', response);
                    console.log('Fragments:', response.fragments);
                    console.log('Cart contents count:', response.cart_contents_count);
                    // Получаем данные о товаре из DOM
                    const productTitle = $block.find('.tab-btn.active').text().trim(); // заменишь на свой селектор
                    const attributeWeightLabel = $block.find('.attribute-weight').val();

                    // Показываем сообщение
                    const formattedWeight = formatWeight(attributeWeight);
                    const message = `${productTitle} (${attrW}) додано до кошика.`;
                    $('.cart-added-text').text(message);
                    $('.cart-add-success-message').fadeIn();

                    // Автоматическое скрытие через 6 секунд (если нужно)
                    setTimeout(() => {
                        $('.cart-add-success-message').fadeOut();
                    }, 6000);

                    if (window.location.pathname === '/cart/') {
                        location.reload();
                    }

                    // Обновляем количество товаров в корзине
                    if (response.fragments) {
                        // Заменяем фрагменты, возвращенные WooCommerce
                        $.each(response.fragments, function (key, value) {
                            $(key).replaceWith(value);
                        });
                    } else if (response.cart_contents_count !== undefined) {
                        // Если фрагментов нет, обновляем .cart-count вручную
                        const cartCount = response.cart_contents_count || 0;
                        if (cartCount > 0) {
                            $('.cart-count').text(cartCount).show();
                        } else {
                            $('.cart-count').hide();
                        }
                    }

                    // Триггер события для обновления других элементов корзины
                    $(document.body).trigger('wc_fragment_refresh');
                },
                error: function () {
                    alert('Произошла ошибка. Попробуйте еще раз.');
                }
            });
        });

        // Запуск инициализации
        initVariations();
        updatePrice();
    });

    // Маски


    //авторизация

    $(document).on("input change keyup", "#profilePhone, #new_imp_login_number", function () {
        let phoneValue = $(this).val();
        console.log("📌 Введено:", phoneValue);

        // Обновляем поле new_imp_login_number только если вводим в profilePhone
        if ($(this).attr("id") === "profilePhone") {
            console.log("🔄 Обновляем #new_imp_login_number:", phoneValue);
            $("#new_imp_login_number").val(phoneValue);
        }

        // Убираем все символы, кроме цифр
        let numbersOnly = phoneValue.replace(/\D/g, "");
        console.log("🔢 Только цифры:", numbersOnly);

        // Убираем +380, если есть
        if (numbersOnly.startsWith("380")) {
            numbersOnly = numbersOnly.substring(3);
            console.log("🚀 Убрали +380:", numbersOnly);
        }

        // Убираем ведущий ноль, если остался
        if (numbersOnly.startsWith("0")) {
            numbersOnly = numbersOnly.substring(1);
            console.log("✂️ Убрали ведущий ноль:", numbersOnly);
        }

        // Вставляем результат в old_imp_login_number
        $("#old_imp_login_number").val(numbersOnly);
        console.log("✅ Вставили в #old_imp_login_number:", numbersOnly);
    });


});

