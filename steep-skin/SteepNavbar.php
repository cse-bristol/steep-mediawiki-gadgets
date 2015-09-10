<?php

/*
 * This is where the HTML for the navbar down te side gets output.
 *
 * @ingroup Skins
 */

class SteepNavbar {
  function __construct($siteName, $logoPath, $homeHref, $translator) {
    $this->siteName = $siteName;
    $this->logoPath = $logoPath;
    $this->homeHref = htmlspecialchars($homeHref);
    $this->translator = $translator;
  }

  function getMsg ($msg) {
    return htmlspecialchars(
      $this->translator->translate($msg)
    );
  }

  function navIcon ($alt, $href, $src, $text='') {
    $img = Html::rawElement(
      'img',
      array(
	'src' => $src,
	'alt' => $alt
      )
    );

    $div = Html::rawElement(
      'div',
      array(),
      $text ?: $alt
    );

    return Html::rawElement(
      'a',
      array(
	'href' => $href,
	'class' => 'nav-image-link'
      ),
      $img . $div
    );
  }

  function navLink ($text, $href) {
    return Html::rawElement(
      'a',
      array(
	'href' => $href,
	'class' => 'nav-text-link'
      ),
      $text
    );
  }

  public function upperNavItems () {
    $addAssetsTitle = Title::newFromText(
      'Upload',
      MWNamespace::getCanonicalIndex('special')      
    );

    return join(
      '',
      array(
	$this->navIcon(
	  $this->siteName,
	  $this->homeHref,
	  $this->logoPath,
	  $this->getMsg('home')
	),
	$this->navIcon(
	  $this->getMsg('all-projects'),
	  Skin::makeNSUrl(
	    $this->getMsg('all-projects-page'),
	    '',
	    NS_CATEGORY
	  ),
	  ''
	),
	$this->navIcon(
	  $this->getMsg('new-process-model'),
	  '/process-model',
	  ''
	),
	$this->navIcon(
	  $this->getMsg('new-map'),
	  '/map',
	  ''
	),
	$this->navIcon(
	  $this->getMsg('add-assets'),
	  $addAssetsTitle->getLinkUrl(),
	  ''
	),
	$this->navIcon(
	  $this->getMsg('manage-assets'),
	  Skin::makeNSUrl(
	    $this->getMsg('manage-assets-page'),
	    '',
	    NS_SPECIAL
	  ),	  
	  ''
	),
	$this->navIcon(
	  $this->getMsg('manage-users'),
	  '',
	  ''
	)
      )
    );
  }

  public function lowerNavItems () {
    return join(
      array(
	$this->navIcon(
	  $this->getMsg('about'),
	  Title::newFromText(
	    $this->getMsg('aboutpage')
	  )->getLinkUrl(),
	  ''
	),
	$this->navLink(
	  $this->getMsg('help'),
	  $this->getMsg('helppage')
	),
	$this->navLink(
	  $this->getMsg('privacy'),
	  Title::newFromText(
	    $this->getMsg('privacypage')
	  )->getLinkUrl()	  
	),
	$this->navLink(
	  $this->getMsg('disclaimers'),
	  Title::newFromText(
	    $this->getMsg('disclaimerpage')
	  )->getLinkUrl()
	)
      )
    );
  }  
}
?>
