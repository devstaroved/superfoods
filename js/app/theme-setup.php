<?php
     function spirulina_theme_setup() {

        add_theme_support('custom-logo');
        add_theme_support('post-thumbnails');
        add_theme_support('title-tag');
  
        add_theme_support('widgets');
        add_theme_support('woocommerce');
        register_nav_menu('main', 'Главное меню в хедере');
        register_nav_menu('footer', 'Меню в футере');
       
        add_theme_support( 'post-formats', array( 'audio', 'image', 'video', 'gallery', 'quote' ));
         

        load_theme_textdomain('spirulina-new');
    }

    add_action('after_setup_theme', 'spirulina_theme_setup');
 
// 1) Регистрируем и подключаем стили и скрипты
function spirulina_enqueue_assets() {
    // Google-fonts
    wp_enqueue_script(
        'masked-input',
        get_template_directory_uri() . '/assets/js/library/jquery.inputmask.min.js',
        ['jquery'], // Зависимость от jQuery
        '1.4.1', // Укажите версию библиотеки или null, если не важна
        
        true // Подключать в футере
    );
    // Основные стили
    wp_enqueue_style(
        'spirulina-styles',
        get_template_directory_uri() . '/assets/css/style.css',
        array(), // зависимости (если есть), например: array('bootstrap')
        '1.2'     // версия
    );


    wp_enqueue_style(
        'spirulina-styles-mob',
        get_template_directory_uri() . '/assets/css/responsive.css',
        array(), // зависимости (если есть), например: array('bootstrap')
        '1.2'     // версия
    );

 
 
    if (is_cart()) {
        wp_enqueue_script(
            'custom-cart',
            get_template_directory_uri() . '/assets/js/app/carts.js',
            ['jquery', 'jquery-maskedinput'],
            null,
            true
        );
        $coupons = WC()->cart->get_coupons();
        $coupon_data = [];
        foreach ($coupons as $code => $coupon) {
            $discount_type = $coupon->get_discount_type();
            $coupon_amount = $coupon->get_amount();
            $discount_display = $discount_type === 'percent' ? $coupon_amount . '%' : wc_price($coupon_amount);
            $coupon_data[$code] = [
                'display' => "Купон на {$discount_display} знижки",
                'code' => $code
            ];
        }
        wp_localize_script('custom-cart', 'wc_cart_params', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'template_url' => get_template_directory_uri(),
            'shop_url' => get_permalink(wc_get_page_id('shop')),
            'coupons' => $coupon_data,
            'currency_symbol' => get_woocommerce_currency_symbol(), // Добавляем символ валюты
            'thousand_separator' => wc_get_price_thousand_separator(), // Разделитель тысяч
            'decimal_separator' => wc_get_price_decimal_separator(), // Десятичный разделитель
            'decimals' => wc_get_price_decimals() // Количество десятичных знаков
        ]);
    }
 
   
  /*  $products = [
        ['id' => 10001, 'type' => 'tabletki'],
        ['id' => 10063, 'type' => 'poroshok'],
    ];*/

    $products = [
        ['id' => 10001, 'type' => 'tabletki'],
        ['id' => 10063, 'type' => 'poroshok'],

        ['id' => 10075 , 'type' => 'chlorella_tabletki'],
        ['id' => 10070  , 'type' => 'chlorella_poroshok'],
        ['id' => 10088 , 'type' => 'combo_tabletki'],
        ['id' => 10098, 'type' => 'combo_poroshok'],
 
    ];


    $variations_data = [];
    foreach ($products as $product) {
        $variations_data[$product['type']] = get_product_variations($product['id']);
    }

    wp_enqueue_script('custom-product-script', get_template_directory_uri() . '/assets/js/app/spirulina.js', ['jquery'], null, true);
    wp_localize_script('custom-product-script', 'productData', [
        'variations' => $variations_data,
        'ajax_url' => admin_url('admin-ajax.php'),
    ]);
    

 
    wp_enqueue_style(
        'spirulina-swiper',
        get_template_directory_uri() . '/assets/js/library/swiper-bundle.min.css',
        [],
        null
    );
    wp_enqueue_script(
        'spirulina-swiper-js',
        get_template_directory_uri() . '/assets/js/library/swiper-bundle.min.js',
        ['jquery'],
        null,
        true
    );
 
}
add_action('wp_enqueue_scripts', 'spirulina_enqueue_assets');
 
 
 