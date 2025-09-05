<section class="block__four__spirulina container main__5">
    <div class="block__four__header">
        <h2 class="block__four__title title_mob"> Чесні відгуки<br><span class="color__green title_mob">наших клієнтів
            </span>
        </h2>

        <div class="block__four__sub">
            <p class="block__four__desc">8 років роботи та понад 75 000 клієнтів. Ознайомтесь з їхніми відгуками</p>
        </div>
    </div>

    <div class="four-swiper-wrap  ">
        <div class="swiper four-swiper2">
            <div class="swiper-wrapper">
                <div class="swiper-slide four-card5">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/img/chollera/otziv_1.webp" alt="ЗОЖ"
                        class="four-card-img5">

                </div>
                <div class="swiper-slide four-card5">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/img/chollera/otziv_2.webp"
                        alt="Схуднення" class="four-card-img5">

                </div>
                <div class="swiper-slide four-card5">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/img/chollera/otziv_3.webp"
                        alt="Спортсменам" class="four-card-img5">

                </div>
                <div class="swiper-slide four-card5">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/img/chollera/otziv_4.webp"
                        alt="Спортсменам" class="four-card-img">

                </div>

                <div class="swiper-slide four-card5">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/img/chollera/otziv_1.webp"
                        alt="Спортсменам" class="four-card-img">

                </div>

                <div class="swiper-slide four-card5">
                    <img src="<?php echo get_template_directory_uri() ?>/assets/img/chollera/otziv_2.webp"
                        alt="Спортсменам" class="four-card-img">

                </div>
            </div>




        </div>
        <div class="four-swiper-controls">
            <div class=" four-swiper-prev">
                <img src="<?php echo get_template_directory_uri() ?>/assets/img/chollera/navigator_left.png" alt="prev">
            </div>
            <div class="swiper-pagination"></div>
            <div class="  four-swiper-next">
                <img src="<?php echo get_template_directory_uri() ?>/assets/img/chollera/navigator_right.png"
                    alt="next">
            </div>
        </div>
    </div>



  
</section>


<script>
        document.addEventListener('DOMContentLoaded', function () {
        new Swiper('.four-swiper2', {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 20,
                loop: true,

                // Параметры для iOS/macOS
                touchEventsTarget: 'container',
                simulateTouch: true,
                touchRatio: 1,
                touchAngle: 45,
                grabCursor: true,
                // Отключаем дорогостоящие наблюдатели прогресса видимости
                watchSlidesProgress: false,
                watchSlidesVisibility: false,
                lazy: false,
                preloadImages: true,
                // Предотвращение конфликтов
                touchStartPreventDefault: false,
                touchMoveStopPropagation: false,
                preventClicks: false,
                preventClicksPropagation: false,
                // Пассивные слушатели для лучшей прокрутки на Safari
                passiveListeners: true,

                // Специфичные настройки для iOS
                touchStartForcePreventDefault: false,
                touchReleaseOnEdges: true,

                navigation: {
                    nextEl: '.four-swiper-next',
                    prevEl: '.four-swiper-prev'
                },

                breakpoints: {
                    320: {
                        slidesPerView: 1.5,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 1.5,
                        spaceBetween: 18,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    }
                },
                on: {
                    init: function () {
                        this.update();
                    },
                    touchStart: function () {
                        this.allowTouchMove = true;
                    }
                }
            });

        });
</script>