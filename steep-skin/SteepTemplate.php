<?php

/**
 * This is where the HTML gets output.
 *
 * @ingroup Skins
 */

class SteepTemplate extends BaseTemplate {
  function getMsg ($msg) {
    return htmlspecialchars(
      $this->translator->translate($msg)
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
      $this->navbar->upperNavItems()
    );
  }

  function bottomLeft() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'left navbar'
      ),
      $this->navbar->lowerNavItems()
    );
  }

  function topRight() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'right'
      ),
      $this->header() . $this->contentActions->contentNavigation() . $this->content()
    );
  }

  function header() {
    $userTools = "";
    
    foreach ( $this->getPersonalTools() as $key => $item ) {
      if ($key === 'newmessages') {
	/*
	   Messages removed in this skin.
	 */
	continue;
      }
      
      $userTools = $userTools . $this->makeListItem($key, $item);
    }

    $search = Html::rawElement(
      'li',
      array(),
      $this->search()
    );

    return Html::rawElement(
      'ul',
      array(
	'class' => 'user-tools'
      ),
      $userTools . $search
    );
  }

  function search() {
    $input = Html::rawElement(
      'input',
      array(
	'type' => 'hidden',
	'name' => 'title',
	'value' => $this->get('searchTitle')
      )
    );

    $search_icon = Html::rawElement(
      'span',
      array(
	'class' => 'search-icon',
      )
    );
    
    return Html::rawElement(
      'form',
      array(
	'id' => 'searchform',
	'action' => $this->get('wgScript')
      ),
      $search_icon . $input . $this->makeSearchInput(array(
	'id' => 'searchInput',
	'placeholder' => $this->getMsg('search') . ' ' . $this->get('sitename')
      ))
    );
  }


  function content() {
    return Html::rawElement(
      'div',
      array(
	'id' => 'content',
	'class' => 'mw-body' . (($this->hasContents && (!$this->contentsHidden)) ? ' shrunk' : '')
      ),
      $this->title() . $this->bodyContent()
    );
  }

  function title() {
    return Html::rawElement(
      'h1',
      array(
	'id' => 'first-heading'
      ),
      $this->get('title')
    );
  }

  function bodyContent() {
    return Html::rawElement(
      'div',
      array(
	'id' => 'bodyContent',
	'class' => 'mw-body-content'
      ),
      $this->get('subtitle') . $this->get('undelete') . $this->bodyText()
    );
  }

  function bodyText() {
    $text = $this->get('bodytext');

    /*
       We rename this to prevent mediawiki.toc.js from fiddling with it.
     */
    $text = preg_replace(
      '/id=\"toc/',
      'id="table-of-contents',
      $text,
      1
    );

    if ($this->hasContents && $this->contentsHidden) {
      /*
	 Add the tochidden class.
       */
      return preg_replace(
	'/class=\"toc/',
	'class="toc tochidden',
	$text,
	1
      );
      
    } else {
      return $text;
    }
  }

  function subTitles() {
    $result = '';

    if ($this->has('subtitle')) {
      $result .= Html::rawElement(
	'div',
	array(
	  'id' => 'contentSub'
	),
	$this->get('subtitle')
      );
    }

    if ($this->has('undelete')) {
      $result .= Html::rawElement(
	'div',
	array(
	  'id' => 'contentSub2'
	),
	$this->get('undelete')
      );
    }

    return result;
  }

  function bottomRight() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'right last-modified'
      ),
      $this->get('lastmod')
    );
  }

  public function execute() {
    $this->hasContents = (preg_match('/id="toc"/', $this->get('bodytext')) === 1);
    $this->contentsHidden = $this->haveData('hidetoc') && ($this->get('hidetoc') == 1);
    
    $this->navbar = new SteepNavbar($this->get('sitename'), $this->get('logopath'), $this->data['nav_urls']['mainpage']['href'], $this->translator);
    $this->contentActions = new SteepContentActions($this->get('content_actions'), $this->get('viewurl'));
    
    $this->html('headelement');

    echo Html::rawElement(
      'div',
      array(
	'class' => 'container' . (($this->hasContents && $this->contentsHidden) ? '' : ' clutter')
      ),
      $this->top() . $this->bottom()
    );
    
    $this->printTrail();

    echo Html::closeElement('body');
    echo Html::closeElement('html');
  }
}
?>
