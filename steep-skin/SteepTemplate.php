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
      $this->header() . $this->content()
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
	'class' => 'mw-body'
      ),
      $this->contentActions->contentNavigation() . $this->breadcrumbs() . $this->bodyContent()
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

    function branding() {
        $greenCapitalLogo = Html::rawElement(
            'a',
            array(
                'href' => 'https://www.bristol2015.co.uk/',
                'class' => 'bristol-green-capital-2015-logo'
            ),
            Html::rawElement(
                'img',
                array(
                    'src' => '/mediawiki/extensions/steep-mediawiki-gadgets/Bristol 2015 Medium Logo_RGB.png',
                    'alt' => 'Bristol Green Capital 2015 logo'
                )
            )
        );
            
        $cseLogo = Html::rawElement(
            'a',
            array(
                'class' => 'cse-logo',
                'href' => 'https://www.cse.org.uk'
            ),
            Html::rawElement(
                'img',
                array(
                    'src' => '/mediawiki/extensions/steep-mediawiki-gadgets/CSE logo.png',
                    'alt' => 'Centre for Sustainable Energy logo'
                )
            )
        );

        $logoSeparator = Html::rawElement(
            'span',
            array(
                'class' => 'logo-separator'
            ),
            '&nbsp'
        );
        
        $logos = Html::rawElement(
            'div',
            array(
                'class' => 'bristol-green-capital-logos'
            ),
            $greenCapitalLogo . $logoSeparator . $cseLogo
        );

        $officialSupplier = Html::rawElement(
            'div',
            array(
                'class' => 'bristol-green-capital-official-supplier'
            ),
            'OFFICIAL SUPPLIER'
        );
        
        return Html::rawELement(
            'div',
            array(
                'class' => 'bristol-green-capital-branding'
            ),
            $logos . $officialSupplier
        );
    }

  function bottomRight() {
    return Html::rawElement(
      'div',
      array(
	'class' => 'right'
      ),
      $this->categoriesList() . $this->lastModified() . $this->branding()
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
    
    $this->navbar = new SteepNavbar($this->get('sidebar')['navigation'], $this->get('sitename'), $this->get('logopath'), $this->homeHref, $this->translator, $this->get('isPage'));
    $this->contentActions = new SteepContentActions($this->get('content_actions'), $this->get('viewurl'));
    
    $this->html('headelement');

    echo Html::rawElement(
      'div',
      array(
	'class' => 'container' . ($this->fullScreen ? '' : ' clutter') . ($this->hasContents ? ' contains-contents' : '') . ($this->get('isPage') ? ' content-page' : '')
      ),
      $this->top() . $this->bottom()
    );
    
    $this->printTrail();

    echo Html::closeElement('body');
    echo Html::closeElement('html');
  }
}
?>
