<?php
/**
 * ASL Email Templates
 *
 * Overrides WooCommerce email templates with custom ASL-branded versions
 * that use the headless frontend URLs instead of WordPress admin URLs.
 *
 * @package ASL_Frontend_Settings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class ASL_Email_Templates {

	private static $instance = null;

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_filter( 'woocommerce_locate_template', array( $this, 'override_woocommerce_template' ), 10, 3 );
		add_filter( 'woocommerce_currency_symbol', array( $this, 'replace_aed_currency_symbol' ), 10, 2 );
		add_filter( 'woocommerce_email_footer_text', array( $this, 'remove_app_promo_from_footer' ), 999 );
		add_filter( 'woocommerce_email_mobile_messaging', '__return_empty_string' );
		add_action( 'init', array( $this, 'remove_mobile_app_banner' ) );
	}

	public function remove_app_promo_from_footer( $footer_text ) {
		$footer_text = preg_replace( '/<p[^>]*>.*?Process your orders on the go.*?<\/p>/is', '', $footer_text );
		$footer_text = preg_replace( '/<p[^>]*>.*?Get the app.*?<\/p>/is', '', $footer_text );
		$footer_text = preg_replace( '/Process your orders on the go.*?Get the app[^<]*/is', '', $footer_text );
		return trim( $footer_text );
	}

	public function remove_mobile_app_banner() {
		remove_all_actions( 'woocommerce_email_mobile_messaging' );
	}

	public function replace_aed_currency_symbol( $currency_symbol, $currency ) {
		if ( 'AED' === $currency ) {
			return 'AED';
		}
		return $currency_symbol;
	}

	public function override_woocommerce_template( $template, $template_name, $template_path ) {
		if ( strpos( $template_name, 'emails/' ) !== 0 ) {
			return $template;
		}

		$plugin_template = ASL_SETTINGS_PATH . 'woocommerce/' . $template_name;

		if ( file_exists( $plugin_template ) ) {
			return $plugin_template;
		}

		return $template;
	}
}

ASL_Email_Templates::get_instance();
