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
	'class' => 'mw-body' . ($this->hasContents ? ' contains-contents' : '') . ($this->get('isPage') ? ' page' : '')
      ),
      $this->breadcrumbs() . $this->bodyContent()
    );
  }

  function breadcrumbs() {
    /*
       Start with a 'home' link.
     */
    $breadcrumbs = $this->crumb(
      $this->getMsg('home'),
      $this->homeHref,
      false
    );

    /*
       Split the title on '/' and make each part a link.

       This is like namespaces, except:
       + The pages don't actually have to exist.
       + Pages earlier in the breadcrumbsd are assumed to be categories.
     */
    $mwTitle = $this->get('mwTitle');
    $titleParts = explode('/', $mwTitle->getText());
    $last = count($titleParts) - 1;

    $titleSoFar = '';
    
    foreach ($titleParts as $i => $titlePart) {
      $isLast = $i === $last;

      if ($titleSoFar) {
	$titleSoFar .= '/';
      }
      $titleSoFar .= $titlePart;
      
      $mwTitlePart = Title::newFromText(
	$titleSoFar,
	$isLast ? $mwTitle->getNamespace() : NS_CATEGORY
      );
      
      $breadcrumbs .= $this->crumb(
	$titlePart,
	$mwTitlePart->getLinkUrl(),
	$isLast
      );
    }
    
    return Html::rawElement(
      'h1',
      array(
	'id' => 'first-heading'
      ),
      $breadcrumbs
    );
  }

  function crumb($text, $link, $isLast) {
    return Html::rawElement(
      'a',
      array(
	'href' => $link,
	'class' => $isLast ? 'self-breadcrumb' : 'ancestor-breadcrumb'
      ),
      Html::rawElement(
	'span',
	array(),
	$text
      )
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

    if ($this->hasContents && $this->fullScreen) {
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

  function categoriesList() {
    if (count($this->get('categoryLinks')) == 0) {
      return '';
    }
    
    $header = Html::rawElement(
      'h2',
      array(),
      wfMessage('pagecategories')
    );

    $linksList = Html::rawElement(
      'div',
      array(
	'class' => 'mw-normal-catlinks'
      ),
      join('', $this->get('categoryLinks'))
    );

    $more = Html::rawElement(
      'a',
      array(
	'href' => urlencode(wfMessage('pagecategorieslink')),
	'class' => 'see-more-categories'
      ),
      wfMessage('see-more-categories')
    );

    return Html::rawElement(
      'div',
      array(
	'id' => 'catlinks',
	'class' => 'catlinks'
      ),
      $header . $linksList . $more
    );
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
    $euEmblem = Html::rawElement(
      'img',
      array(
	'src' => "data:image/svg+xml;charset=utf8,%3C?xml version='1.0' standalone='no'?%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' width='810' height='540'%3E%3Cdesc%3EEuropean flag%3C/desc%3E %3Cdefs%3E%3Cg id='s'%3E%3Cg id='c'%3E%3Cpath id='t' d='M0,0v1h0.5z' transform='translate(0,-1)rotate(18)'/%3E%3Cuse xlink:href='%23t' transform='scale(-1,1)'/%3E%3C/g%3E%3Cg id='a'%3E%3Cuse xlink:href='%23c' transform='rotate(72)'/%3E%3Cuse xlink:href='%23c' transform='rotate(144)'/%3E%3C/g%3E%3Cuse xlink:href='%23a' transform='scale(-1,1)'/%3E%3C/g%3E%3C/defs%3E %3Crect fill='%23039' width='810' height='540'/%3E%3Cg fill='%23fc0' transform='scale(30)translate(13.5,9)'%3E%3Cuse xlink:href='%23s' y='-6'/%3E%3Cuse xlink:href='%23s' y='6'/%3E%3Cg id='l'%3E%3Cuse xlink:href='%23s' x='-6'/%3E%3Cuse xlink:href='%23s' transform='rotate(150)translate(0,6)rotate(66)'/%3E%3Cuse xlink:href='%23s' transform='rotate(120)translate(0,6)rotate(24)'/%3E%3Cuse xlink:href='%23s' transform='rotate(60)translate(0,6)rotate(12)'/%3E%3Cuse xlink:href='%23s' transform='rotate(30)translate(0,6)rotate(42)'/%3E%3C/g%3E%3Cuse xlink:href='%23l' transform='scale(-1,1)'/%3E%3C/g%3E %3C/svg%3E",
	'alt' => 'Flag of European Union'
      )
    );

    $euText = Html::rawElement(
      'div',
      array(
	'class' => 'eu-funding'
      ),
      'This project has received funding from the European Union’s Seventh Framework Programme for research, technological development and demonstration under grant agreement no 314277.'
    );

    $euLogo = Html::rawElement(
      'div',
      array(
	'class' => 'eu-logo'
      ),
      $euEmblem . $euText
    );
    
    return Html::rawElement(
      'div',
      array(
	'class' => 'right'
      ),
      $this->categoriesList() . $this->lastModified() . $euLogo
    );
  }

  function lastModified() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'last-modified'
      ),
      $this->get('lastmod')
    );
  }

  public function execute() {
    $this->hasContents = (preg_match('/id="toc"/', $this->get('bodytext')) === 1);
    $this->fullScreen = $this->haveData('hidetoc') && ($this->get('hidetoc') == 1);
    $this->homeHref = $this->data['nav_urls']['mainpage']['href'];
    
    $this->navbar = new SteepNavbar($this->get('sitename'), $this->get('logopath'), $this->homeHref, $this->translator, $this->get('isPage'));
    $this->contentActions = new SteepContentActions($this->get('content_actions'), $this->get('viewurl'));
    
    $this->html('headelement');

    echo Html::rawElement(
      'div',
      array(
	'class' => 'container' . ($this->fullScreen ? '' : ' clutter')
      ),
      $this->top() . $this->bottom()
    );
    
    $this->printTrail();

    echo Html::closeElement('body');
    echo Html::closeElement('html');
  }
}
?>
