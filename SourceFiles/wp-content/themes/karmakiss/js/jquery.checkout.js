(function( window, $, undefined ) {

	$.yit_checkout = function( options, element ) {
		this.element = $( element );
		this._init( options );
	};

	$.yit_checkout.defaults	= {
		steps    : 4,
		elements : {
			steps : $('#checkout .checkout-step'),
			sections: $('#page-header a'),
			ship_to_billing : {
				billing: $('#shiptobilling_bill-checkbox'),
				shipping: $('#shiptobilling-checkbox')
			},
			submit: $('#place_order')
		}
    };

	$.yit_checkout.prototype = {
		_init : function( options ) {
			this.options = $.extend( true, {}, $.yit_checkout.defaults, options );
			this.current_step = this.options.elements.steps.filter('.current');
			this.user_logged_in = this.options.elements.steps.filter('.user_logged_in').length > 0;
			
			this._initEvents();
			this._initLabels();
		},
		
		_initLabels : function() {
			var buttons = this.element.find('input[data-alternativelabel]');
			buttons.each(function(){
				$(this).data({
					billing: $(this).val(),
					shipping: $(this).data('alternativelabel')
				});
			});
		},
		
		_initEvents : function() {
			var elements = this.options.elements;
			var self = this;
			
			//sections
			elements.sections.on('click', function(e){
				var new_step = $(this).data('step');
				var current_step = self.current_step.data('step');
				e.preventDefault();									
				if( self._validateChangeStep( current_step, new_step ) && current_step > new_step ) {
					self._gotoStep(new_step);
				}
			});
			
			//next, prev
			elements.steps.on('click', '.next, .prev', function(e){
				e.preventDefault();
				
				var new_step = $(this).data('next');
				var current_step = self.current_step.data('step');
				
				if( self._validateChangeStep( current_step, new_step ) ) {
					self._gotoStep(new_step);
				}
			});

			//form submit
			elements.submit.on('click', function(e){
				$('.alert-box.warning').remove();
				$(document).ajaxStop(function(){
				if ($('.alert-box.warning').length > 0) {
					e.preventDefault();
				
					var new_step = 1;
					var current_step = 4;
				
					if( self._validateChangeStep( current_step, new_step ) ) {
						self._gotoStep(new_step);
					}

				}
				});				
			});

            //shiptobilling
            elements.ship_to_billing.billing.on('change', function(e){

                var value = $(this).prop('checked');
                var woocommerce_version = elements.ship_to_billing.shipping.data('woocommerce-version');

                if( typeof woocommerce_version != 'undefined' && woocommerce_version >= '2.1' ){
                    value = ( value == true ) ? false : true;
                }

                elements.ship_to_billing.shipping.prop('checked', value).change();
            });

            elements.ship_to_billing.shipping.on('change', function(e){
                var woocommerce_version = elements.ship_to_billing.shipping.data('woocommerce-version');
                var value = $(this).prop('checked');

                if( typeof woocommerce_version != 'undefined' && woocommerce_version >= '2.1' ){
                    value = ( value == true ) ? false : true;
                }

                elements.ship_to_billing.billing.prop('checked', value);
                self._updateBillingShippingLabels( value );
            });


            //activate tooltip in payment method
			this.element.on('slide_change', function(e, data){
				if( data.step == 4 ) {
					var payment_method = $(this).find('input[name=payment_method]:checked');
					$(this).find('div.payment_box.' + $(payment_method).attr('ID')).slideDown(250);
				}
			});

            this.element.on( 'click', '.payment_methods input.input-radio', function() {
                if ( $('.payment_methods input.input-radio').length > 1 ) {
                    $('div.payment_box').filter(':visible').slideUp(250);
                    if ($(this).is(':checked')) {
                        $('div.payment_box.' + $(this).attr('ID')).slideDown(250);
                    }
                } else {
                    $('div.payment_box').show();
                }
            });
		},
		
		_updateBillingShippingLabels : function( value ) {
			var next_step = this.options.elements.steps.filter('[data-step=1]').find('input.next');
			var prev_step = this.options.elements.steps.filter('[data-step=3]').find('input.prev');
			
			if( value ) {
				next_step.val( next_step.data('billing') ).data('next', 4);
				prev_step.val( prev_step.data('billing') ).data('next', 2);
			} else {
				next_step.val( next_step.data('shipping') ).data('next', 4);
				prev_step.val( prev_step.data('shipping') ).data('next', 2);
			}
		},
		
		_validateChangeStep : function( old_step, new_step ) {
			steps = this.options.steps;

			if( old_step < new_step && new_step <= steps ) {
				return this._validateStep( new_step );
			} else if( this.user_logged_in && new_step > 1 && new_step < old_step ) {
				return this._validateStep( new_step );
			} else if( !this.user_logged_in && new_step > 0 && new_step < old_step ) {
				return this._validateStep( new_step );
			} else {
				return false;
			}
		},
		
		_validateStep : function( step ) {
			return true;
		},
		
		_gotoStep : function( step ) {
			var element  = this.element;
			var new_step = this.options.elements.steps.filter('[data-step='+ step + ']');
			
			this.current_step.fadeOut('slow', function(){
				new_step.fadeIn('slow').addClass('current');
				$(this).removeClass('current');
				
				element.trigger('slide_change', { step: step });
			});
			this._updateSection( step );
			this.current_step = new_step;
		},
		
		_updateSection : function( step ) {
			//this.options.elements.sections.removeClass('current').filter('[data-step='+ step + ']').addClass('current');
			
			var sections = this.options.elements.sections;
			
			sections.removeClass('current')
					.filter('[data-step='+ step + ']')
					.addClass('current');					
		},
		
	};

	$.fn.yit_checkout = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );

			this.each(function() {
				var instance = $.data( this, 'yit_checkout' );
				if ( !instance ) {
					console.error( "cannot call methods on yit_checkout prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					console.error( "no such method '" + options + "' for yit_checkout instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		} 
		else {
			this.each(function() {
				var instance = $.data( this, 'yit_checkout' );
				if ( !instance ) {
					$.data( this, 'yit_checkout', new $.yit_checkout( options, this ) );
				}
			});
		}
		return this;
	};


})( window, jQuery );