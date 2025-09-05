<section class="block__three__spirulina container ">
    <div class="block__three__spirulina_text">
        <h2 class="block__three__spirulina_title title_mob">Замов <span class="color__green">свій формат</span>
            Хлорели — легко і зручно</h2>
    </div>


    <div class="products__tabs ">
        <div class="tabs-buttons">
            <button class="tab-btn active" data-product-id="10075" id="chlorella_tabletki">Хлорела в
                таблетках</button>
            <button class="tab-btn" data-product-id="10070" id="chlorella_poroshok">Хлорела в порошку</button>
        </div>
    </div>
    <div class="product-content">
        <div class="product-image-block">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/chollera/products.png"
                alt="Спирулина в таблетках" class="product-image-fixed tabletki-image">
            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/chollera/products-poroch.png"
                alt="Спирулина в порошке" class="product-image-fixed poroshok-image" style="display: none;">
        </div>
        <div class="product-info-block">
            <p class="product-description tabletki-desc">
                Хлорела у таблетках значно зручніша у вживанні: просто запийте її водою зранку натщесрце за 20-30 хв до
                першого прийому їжі
            </p>
            <p class="product-description poroshok-desc" style="display: none;">
                Хлорела у порошку швидше засвоюється, зручніша у вживанні: чайна ложка з гіркою на склянку води
                кімнатної температури, розмішати, дати настоятись 10хв і випити.  Краще зранку натщесрце за 20-30 хв до
                першого прийому їжі
            </p>
            <form class="cart-form" method="post" action="<?php echo esc_url(wc_get_cart_url()); ?>">
                <input type="hidden" name="add-to-cart" value="" class="product-id">
                <input type="hidden" name="variation_id" value="" class="variation-id">
                <input type="hidden" name="attribute_weight" value="" class="attribute-weight">
                <div class="product-weights">
                    <div class="weight-card" data-weight="100" data-variation-id="" data-price-single="">
                        <span class="weight-chollera">100 г</span>
                        <span class="weight-desc">Вистачає на 20 днів.<br>1 порція — 24 грн</span>
                        <span class="weight-line"></span>
                        <span class="weight-price"></span>
                        <span class="weight-check">
                            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/chollera/ri_checkbox-circle-fill.png"
                                alt="Спирулина в таблетках">
                        </span>
                    </div>
                    <div class="weight-card" data-weight="250" data-variation-id="" data-price-single="">
                        <span class="weight-chollera">250 г</span>
                        <span class="weight-desc">Вистачає на 50 днів.<br>1 порція — 19 грн</span>
                        <span class="weight-line"></span>
                        <span class="weight-price"></span>
                        <span class="weight-check">
                            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/chollera/ri_checkbox-circle-fill.png"
                                alt="Спирулина в таблетках">
                        </span>
                    </div>
                    <div class="weight-card selected" data-weight="500" data-variation-id="" data-price-single="">
                        <span class="weight-chollera">500 г</span>
                        <span class="weight-desc">Вистачає на 100 днів.<br>1 порція — 18 грн</span>
                        <span class="weight-line"></span>
                        <span class="weight-price"></span>
                        <span class="weight-check">
                            <img src="<?php echo get_template_directory_uri(); ?>/assets/img/chollera/ri_checkbox-circle-fill.png"
                                alt="Спирулина в таблетках">
                        </span>
                    </div>
                </div>
                <div class="product-card__price-block">
                    <span class="product-card__label">Вартість:</span>
                    <span class="product-card__price"> 0 грн</span>
                </div>
                <div class="product-card__actions">

                    <input type="hidden" class="product-id" value=" ">
                    <input type="hidden" class="variation-id" value="">
                    <input type="hidden" class="attribute-weight" value="">

                    <div class="products__action__but">
                        <div class="product-card__quantity">
                            <button type="button" class="quantity-btn product-qty-minus">-</button>
                            <input type="number" class="quantity-input product-qty-value" value="1" min="1">
                            <button type="button" class="quantity-btn product-qty-plus">+</button>
                        </div>
                        <div class="product-card__one-click"><?php echo do_shortcode('[viewBuyButton id="10"]'); ?>
                        </div>

                    </div>
                    <button type="button" class="product-card__cart"><span class="cart-icon"></span>ДОДАТИ В
                        КОРЗИНУ</button>
                </div>
                <!-- <button type="submit" class="add-to-cart-mobile">ДОДАТИ У КОШИК</button> -->
            </form>
        </div>
    </div>
</section>