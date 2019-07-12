$(document).ready(function($){
	var $L = 1200,
		$navigation = $('#navbar'),
		$cart_trigger = $('#cart-trigger'),
		$hamburger_icon = $('#hamburger-menu'),
		$cart = $('#cart'),
        $shadow_layer = $('.overlay'),
        $search = $('#search');

	//open menu and close cart
	$hamburger_icon.on('click', function(event){
		event.preventDefault();
		$cart.removeClass('speed-in');
		toggle_sidebar($navigation, $shadow_layer, $('body'));
	});

	//open cart and close menu
	$cart_trigger.on('click', function(event){
		event.preventDefault();
		$navigation.removeClass('speed-in');
		toggle_sidebar($cart, $shadow_layer, $('body'));
	});

	//close cart or menu
	$shadow_layer.on('click', function(){
		$shadow_layer.removeClass('is-visible');
		// firefox
		if( $cart.hasClass('speed-in') ) {
			$cart.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
			$navigation.removeClass('speed-in');
		} else {
			$navigation.removeClass('speed-in').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
			$cart.removeClass('speed-in');
		}
	});

	//move navbar and search bar on desktop and mobile
    move( $navigation, $search, $L);
    

	$(window).on('resize', function(){
		move( $navigation, $search, $L);
		
		if( $(window).width() >= $L && $navigation.hasClass('speed-in')) {
			$navigation.removeClass('speed-in');
			$shadow_layer.removeClass('is-visible');
            $('body').removeClass('overflow-hidden');
		}

	});
});

function toggle_sidebar ($sidebar, $background_layer, $body) {
	if( $sidebar.hasClass('speed-in') ) {
		// firefox
		$sidebar.removeClass('speed-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$body.removeClass('overflow-hidden');
		});
		$background_layer.removeClass('is-visible');

	} else {
		$sidebar.addClass('speed-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			$body.addClass('overflow-hidden');
		});
		$background_layer.addClass('is-visible');
	}
}

function move( $nav, $s, $MQ) {
    $s.css("display", "block");
	if ( $(window).width() >= $MQ ) {
        $nav.detach();
        $s.detach();
        $nav.appendTo('header');
        $s.appendTo('header');
        $('.cont').addClass("container");
	} else {
        $nav.detach();
        $s.detach();
        $nav.insertAfter('header');
        $s.appendTo('#navbar');
        $('.cont').removeClass("container");
	}
}