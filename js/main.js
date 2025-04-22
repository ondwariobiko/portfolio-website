;(function () {
    'use strict';

    // ==================== IMPROVEMENTS ====================
    // 1. Better mobile detection using modern API first
    const isMobile = {
        any: function() {
            return ( 
                navigator.maxTouchPoints > 0 ||
                navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)
            );
        }
    };

    // 2. Debounced resize handler
    const debounce = function(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    };

    // 3. Throttled scroll handler
    const throttle = function(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };
    // ==================== END IMPROVEMENTS ====================

    var mobileMenuOutsideClick = function() {
        $(document).click(function (e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ( $('body').hasClass('offcanvas') ) {
                    $('body').removeClass('offcanvas');
                    $('.js-fh5co-nav-toggle').removeClass('active');
                }
            }
        });
    };

    var offcanvasMenu = function() {
        $('#page').prepend('<div id="fh5co-offcanvas" />');
        $('#page').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white"><i></i></a>');
        
        // Clone menus once
        $('#fh5co-offcanvas')
            .append($('.menu-1 > ul').clone())
            .append($('.menu-2 > ul').clone())
            .find('.has-dropdown')
            .addClass('offcanvas-has-dropdown')
            .removeClass('has-dropdown');

        // Optimized hover handling
        $('.offcanvas-has-dropdown').hover(
            function(){ // mouseenter
                $(this)
                    .addClass('active')
                    .find('ul')
                    .stop(true, true)
                    .slideDown(500, 'easeOutExpo');
            }, 
            function(){ // mouseleave
                $(this)
                    .removeClass('active')
                    .find('ul')
                    .stop(true, true)
                    .slideUp(500, 'easeOutExpo');
            }
        );

        // Debounced resize
        $(window).on('resize', debounce(function(){
            if ( $('body').hasClass('offcanvas') ) {
                $('body').removeClass('offcanvas');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        }, 200));
    };

    var burgerMenu = function() {
        $('body').on('click', '.js-fh5co-nav-toggle', function(event){
            event.preventDefault();
            $(this).toggleClass('active');
            $('body').toggleClass('overflow offcanvas');
        });
    };

    var contentWayPoint = function() {
        var i = 0;
        $('.animate-box').waypoint(function(direction) {
            if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
                i++;
                $(this.element).addClass('item-animate');
                
                setTimeout(function(){
                    $('body .animate-box.item-animate').each(function(k){
                        var el = $(this);
                        setTimeout(function() {
                            var effect = el.data('animate-effect') || 'fadeInUp';
                            el.addClass(effect + ' animated-fast')
                              .removeClass('item-animate');
                        }, k * 200);
                    });
                }, 100);
            }
        }, { offset: '85%' });
    };

    var dropdown = function() {
        $('.has-dropdown').hover(
            function(){ // mouseenter
                $(this).find('.dropdown')
                    .css('display', 'block')
                    .addClass('animated-fast fadeInUpMenu');
            },
            function(){ // mouseleave
                $(this).find('.dropdown')
                    .css('display', 'none')
                    .removeClass('animated-fast fadeInUpMenu');
            }
        );
    };

    var goToTop = function() {
        $('.js-gotop').on('click', function(event){
            event.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 500, 'easeInOutExpo');
        });

        // Throttled scroll handler
        $(window).on('scroll', throttle(function(){
            $('.js-top').toggleClass('active', $(window).scrollTop() > 200);
        }, 100));
    };

    var loaderPage = function() {
        $(".fh5co-loader").fadeOut("slow");
    };

    var counter = function() {
        $('.js-counter').countTo({
            formatter: function (value, options) {
                return value.toFixed(options.decimals);
            },
        });
    };

    var sliderMain = function() {
        $('#fh5co-hero .flexslider').flexslider({
            animation: "fade",
            slideshowSpeed: 5000,
            directionNav: true,
            start: function(){
                setTimeout(function(){
                    $('.slider-text').removeClass('animated fadeInUp');
                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                }, 500);
            },
            before: function(){
                setTimeout(function(){
                    $('.slider-text').removeClass('animated fadeInUp');
                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                }, 500);
            }
        });
    };

    var stickyFunction = function() {
        var updateSticky = function() {
            var h = $('.image-content').outerHeight();
            $('.sticky-parent').css('height', h);

            if ($(window).width() <= 992 ) {
                $("#sticky_item").trigger("sticky_kit:detach");
            } else {
                $('.sticky-parent').removeClass('stick-detach');
                $("#sticky_item").trigger("sticky_kit:detach");
                $("#sticky_item").trigger("sticky_kit:unstick");
                $("#sticky_item").stick_in_parent();
            }
        };

        // Initial setup
        updateSticky();
        
        // Debounced resize
        $(window).on('resize', debounce(updateSticky, 200));
    };

    // Initialize everything
    $(function(){
        mobileMenuOutsideClick();
        offcanvasMenu();
        burgerMenu();
        contentWayPoint();
        sliderMain();
        dropdown();
        goToTop();
        loaderPage();
        stickyFunction();
        
        // Testimonial slider
        $('.testimonial-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true,
            autoplay: true,
            autoplaySpeed: 5000,
            prevArrow: '<button type="button" class="slick-prev">Previous</button>',
            nextArrow: '<button type="button" class="slick-next">Next</button>'
        });
    });

    // External links handler
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer'); // Security improvement
        }
    });

    // Right-click protection
    document.querySelectorAll('.image-item img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });

    // Favicon switcher
    function updateFavicon() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.head.append(
            document.querySelector(prefersDark ? 'link#dark-scheme-icon' : 'link#light-scheme-icon')
        );
    }
    window.matchMedia('(prefers-color-scheme: dark)').addListener(updateFavicon);
    updateFavicon();

    // Sticky navbar with throttling
    $(window).on('scroll', throttle(function() {
        const scrollTop = $(this).scrollTop();
        $('.fh5co-nav').toggleClass('sticky', scrollTop > 100);
        $('body').toggleClass('sticky-nav', scrollTop > 100);
    }, 100));
}());