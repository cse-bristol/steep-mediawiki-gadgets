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

  function navImgLink ($alt, $href, $src, $text='') {
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

  function navIconLink ($text, $href, $icon) {
    return Html::rawElement(
      'a',
      array(
	'href' => $href,
	'class' => 'nav-icon-link ' . $icon
      ),
      $text
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
	$this->navImgLink(
	  $this->siteName,
	  $this->homeHref,
	  $this->logoPath,
	  $this->getMsg('home')
	),
	$this->navIconLink(
	  $this->getMsg('all-projects'),
	  Skin::makeNSUrl(
	    $this->getMsg('all-projects-page'),
	    '',
	    NS_CATEGORY
	  ),
	  'all-projects'	
	),
	$this->navIconLink(
	  $this->getMsg('new-process-model'),
	  '/process-model',
	  'new-process-model'	
	),
	$this->navIconLink(
	  $this->getMsg('new-map'),
	  '/map',
	  'new-map'	
	),
	$this->navIconLink(
	  $this->getMsg('add-assets'),
	  $addAssetsTitle->getLinkUrl(),
	  'add-assets'	
	),
	$this->navIconLink(
	  $this->getMsg('manage-assets'),
	  Skin::makeNSUrl(
	    $this->getMsg('manage-assets-page'),
	    '',
	    NS_SPECIAL
	  ),
	  'manage-assets'	
	),
	$this->navIconLink(
	  $this->getMsg('manage-users'),
	  Skin::makeNSUrl(
	    $this->getMsg('manage-users-page'),
	    '',
	    NS_SPECIAL
	  ),
	  'manage-users'	
	)
  )
    );
  }

  public function lowerNavItems () {
    return join(
      array(
	$this->navIconLink(
	  $this->getMsg('about'),
	  Title::newFromText(
	    $this->getMsg('aboutpage')
	  )->getLinkUrl(),
	  'about'	
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
