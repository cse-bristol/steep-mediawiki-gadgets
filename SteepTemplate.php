<?php

/**
 * This is where the HTML gets output.
 *
 * @ingroup Skins
 */

class SteepTemplate extends BaseTemplate {
  function navIcon ($alt, $href, $src) {
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
      $alt
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

  function getMsg ($msg) {
    return htmlspecialchars(
      $this->translator->translate($msg)
    );
  }

  function upperNavItems () {
    return join(
      '',
      array(
	$this->navIcon(
	  $this->get('sitename'),
	  htmlspecialchars($this->data['nav_urls']['mainpage']['href']),
	  $this->get('logopath')
	),
	$this->navIcon(
	  'Projects',
	  Skin::makeNSUrl("Projects", '', NS_CATEGORY),
	  ''
	),
	$this->navIcon(
	  'New Process Model',
	  '/process-model',
	  ''
	),
	$this->navIcon(
	  'New Map',
	  '/map',
	  ''
	),
	$this->navIcon(
	  'Add Assets',
	  '',
	  ''
	),
	$this->navIcon(
	  'Manage Assets',
	  '',
	  ''
	),
	$this->navIcon(
	  'Users',
	  '',
	  ''
	)
      )
    );
  }

  function lowerNavItems () {
    return join(
      array(
	$this->navIcon(
	  'About',
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

  function top() {
    return Html::rawELement(
      'div',
      array(
	'class' => 'top'
      ),
      $this->topLeft() . $this->topRight()
    );
  }

  function bottom() {
    return Html::rawELement(
      'div',
      array(
	'class' => 'bottom'
      ),
      $this->bottomLeft() . $this->bottomRight()
    );
  }

  function topLeft() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'left navbar'
      ),
      $this->upperNavItems()
    );
  }

  function bottomLeft() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'left navbar'
      ),
      $this->lowerNavItems()
    );
  }

  function topRight() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'right'
      ),
      ''
    );
  }

  function bottomRight() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'right'
      ),
      $this->get('lastmod')
    );
  }

  public function execute() {
    $this->html('headelement');

    echo Html::rawElement(
      'div',
      array(
	'class' => 'container'
      ),
      $this->top() . $this->bottom()
    );
    
    $this->printTrail();

    echo Html::closeElement('body');
    echo Html::closeElement('html');
  }
}
?>
