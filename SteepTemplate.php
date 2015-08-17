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
    
    return Html::rawElement(
      'form',
      array(
	'ie' => 'searchform',
	'action' => $this->get('wgScript')
      ),
      $input . $this->makeSearchInput(array(
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
	'class' => 'mw-body' . ($this->hasHiddenContents() ? ' shrunk' : '')
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

  function hasContents() {
    if (!defined($this->hasContents)) {
      $this->hasContents = (preg_match('/id="toc"/', $this->get('bodytext')) === 1);
    } 
    
    return $this->hasContents;
  }

  function contentsHidden() {
    return $this->get('hidetoc') == 1;
  }

  /*
     This page has enough sections to have a table of contents, but the user has hidden it.
   */
  function hasHiddenContents() {
    return $this->hasContents() && $this->contentsHidden();
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

    if ($this->hasHiddenContents()) {
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
	'class' => 'right'
      ),
      $this->get('lastmod')
    );
  }

  public function execute() {
    $this->navbar = new SteepNavbar($this->get('sitename'), $this->get('logopath'), $this->data['nav_urls']['mainpage']['href'], $this->translator);
    $this->contentActions = new SteepContentActions($this->get('content_actions'));
    
    $this->html('headelement');

    echo Html::rawElement(
      'div',
      array(
	'class' => 'container' . ($this->hasHiddenContents() ? '' : ' clutter')
      ),
      $this->top() . $this->bottom()
    );
    
    $this->printTrail();

    echo Html::closeElement('body');
    echo Html::closeElement('html');
  }
}
?>
