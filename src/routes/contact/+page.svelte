<script>
	import Container from '$lib/common/Container.svelte';
</script>

<svelte:head>
	<title>RS - Contact</title>
</svelte:head>

<Container>
	<!-- Begin Mailchimp Signup Form -->
	<h2>Subscribe</h2>
	<p>Subscribe to receive emails about the latest articles, events & projects.</p>
	<div id="mc_embed_signup">
		<form
			action="https://github.us13.list-manage.com/subscribe/post?u=9686f238f91d4f6de32382fe3&amp;id=cf994d4ec5&amp;f_id=002cdbe2f0"
			method="post"
			id="mc-embedded-subscribe-form"
			name="mc-embedded-subscribe-form"
			class="validate"
			target="_self"
		>
			<div id="mc_embed_signup_scroll">
				<div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
				<div class="mc-field-group">
					<label for="mce-EMAIL">Email Address <span class="asterisk">*</span> </label>
					<input
						type="email"
						value=""
						name="EMAIL"
						class="required email"
						id="mce-EMAIL"
						required
					/>
					<span id="mce-EMAIL-HELPERTEXT" class="helper_text" />
				</div>
				<div id="mce-responses" class="clear foot">
					<div class="response" id="mce-error-response" style="display:none" />
					<div class="response" id="mce-success-response" style="display:none" />
				</div>
				<!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
				<div style="position: absolute; left: -5000px;" aria-hidden="true">
					<input type="text" name="b_9686f238f91d4f6de32382fe3_cf994d4ec5" tabindex="-1" value="" />
				</div>
				<div class="optionalParent">
					<div class="clear foot">
						<input
							type="submit"
							value="Subscribe"
							name="subscribe"
							id="mc-embedded-subscribe"
							class="button"
						/>
						<p class="brandingLogo">
							<a
								href="http://eepurl.com/ij4gmz"
								title="Mailchimp - email marketing made easy and fun"
								><img
									src="https://eep.io/mc-cdn-images/template_images/branding_logo_text_dark_dtp.svg"
								/></a
							>
						</p>
					</div>
				</div>
			</div>
		</form>
	</div>
	<!--End mc_embed_signup-->
</Container>

<style type="text/css">
	/* TODO - Update the form style */
	#mc_embed_signup {
		background: #fff;
	}
</style>
