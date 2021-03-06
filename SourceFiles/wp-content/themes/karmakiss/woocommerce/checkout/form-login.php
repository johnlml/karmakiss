<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>
<?php if ( is_user_logged_in() ) return; ?>

<div class="medium-6 columns">
	<div class="register clearfix">
		<h3>New and unregistered <span>customers</span></h3>
		<p><?php the_field( 'checkout-guest-text', 'options' ); ?></p>
		<form method="post" class="guest_checkout">
			<p class="form-row small-9 columns">
				<input type="email" class="input-text" name="email" placeholder="E-mail address" id="guest_email" />
			</p>                                                
			<p class="form-row small-3 columns">
				<input type="submit" class="button next" value="Continue" data-next="2" onclick="sendResultToMailChimp(this);" />
			</p>
                        <input id="subscribeToMailchimp" name="subscribeToMailchimp" type="checkbox" checked /> 
                        <label for="subscribeToMailchimp">I would like to receive exclusive promotions and discounts from Karma Kiss.</label>
		</form>
	</div>
</div>
<div style="visibility: hidden; position: absolute; bottom: 0; right: 0;"><?php echo do_shortcode('[woochimp_form]'); ?></div>
<style>
    
</style>
<script type="text/javascript">
function sendResultToMailChimp(){
    if( jQuery('#subscribeToMailchimp:checked').length > 0 ){
        jQuery('#woochimp_registration_form_shortcode #woochimp_shortcode_subscription_email').val( jQuery('form.guest_checkout #guest_email').val() );
        jQuery('#woochimp_shortcode_subscription_submit').click();            
    }

}    
</script>
<div class="medium-6 columns">
	<div class="login clearfix">
		<h3>Registered <span>customers</span></h3>
		<form method="post" class="login_checkout">
			<p class="form-row large-12 columns">
				<input type="text" class="input-text" name="username" placeholder="E-mail address" id="username" />
			</p>
			<p class="form-row large-12 columns">
				<input class="input-text" type="password" name="password" placeholder="Password" id="password" />
			</p>
			<p class="form-row large-12 columns">
                <?php wp_nonce_field( 'woocommerce-login' ) ?>
				<input type="hidden" name="redirect" value="<?php echo get_permalink(wc_get_page_id('checkout')) ?>" />
				<input type="submit" class="button" name="login" value="<?php _e('Login', 'yit'); ?>" />
			</p>
			<p class="form-row large-12 columns form-row-last">
				<a class="lost_password" href="<?php echo esc_url( wp_lostpassword_url( home_url() ) ); ?>"><?php _e('Lost Password?', 'yit'); ?></a>
			</p>
		</form>
	</div>
</div>