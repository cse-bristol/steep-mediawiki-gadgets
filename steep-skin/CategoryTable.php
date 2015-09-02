<?php

/*
   CategoryTable draws a category as a sortable, paged table instead of a list.

   Subcategories, pages and files are all displayed in the same table, with a column to distinguish their type.

   We do this by both hooking into and extending CategoryPage.
 */
class CategoryTable extends Article {

  public static function hook() {
    $wgHooks['CategoryPageView'][] = 'CategoryTable::drawCategoryAsTable';
  }

  public static function drawCategoryAsTable($categoryPage) {
    $tablePage = new self(
      $categoryPage->getTitle(),
      $categoryPage->getOldID()
    );

    $tablePage->setContext($categoryPage->getContext());
    $tablePage->setParserOptions($categoryPage->getParserOptions());

    /*
       Article also includes the following internal state, which we haven't copied over.

       These appear to be set inside Article:view() rather than pushed in from outside, so we should be ok.
       
       // mContent
       // mContentObject
       // mContentLoaded
       // mRedirectedFrom
       // mRedirectUrl
       // mRevIdFetched
       // mRevision
       // mParseOutput
     */

   
    $tablePage->view();
   
    /*
       Returning false causes the original CategoryPage to return from its view method without doing anything itself.
     */
    return false;
  }

  function out($html) {
    $this->getContext()->getOutput()->addHTML($html);
  }
  
  function view() {
    $this->getContext()->getOutput()->enableOOUI();
    
    $this->out(
      new OOUI\ButtonWidget(
	array(
	  'id' => 'new-category-page',
	  'infusable' => true,
	  'label' => 'New ' . $this->getTitle()->getText(),
	  'href' => '#'
	)
      )
    );

    $this->out(
      Html::rawElement(
	'form',
	array(
	  'class' => 'search-form'
	),
	Html::rawElement(
	  'input',
	  array(
	    'type' => 'search',
	    'name' => 'search',
	    'placeholder' => 'Find',

	  )
	)
      )
    );

    $api = new ApiMain(
      new DerivativeRequest( 
        $this->getContext()->getRequest(),
        array(
	  'action' => 'query',
	  'list' => 'search',
	  'srsearch' => 'incategory:' . $this->getTitle()->getText(),
	  'srlimit' => 10,
	  'srnamespace' => join(
	    '|',
	    array(
	      MWNamespace::getCanonicalIndex(''),
	      MWNamespace::getCanonicalIndex('file'),
	      MWNamespace::getCanonicalIndex('category')
	    )
	  )
	),
        true
      )
    );

    $api->execute();

    $rows = "";

    foreach ($api->getResult()->getResultData()['query']['search'] as $key => $row) {
      if (is_numeric($key)) {
	$rows .= $this->categoryContentsRow($row);
      }
    }

    $this->out(
      Html::rawElement(
	'table',
	array(
	  'class' => 'category-contents'
	),
	Html::rawElement(
	  'tbody',
	  array(),
	  $rows
	)
      )
    );
    
    parent::view();

    $this->addHelpLink('Help:Categories');
  }

  function categoryContentsRow($row) {
    $title = Title::newFromText($row['title'], $row['ns']);

    $watched = $this->getContext()->getUser()->isWatched($title);
    
    return Html::rawElement(
      'tr',
      array(),
      join(
	'',
	array(
	  $this->cell(
	    '&nbsp;',
	    array(
	      'class' => 'type ' . ($title->getNSText() ?: 'Page')
	    )
	  ),
	  $this->cell(
	    Html::rawElement(
	      'a',
	      array(
		'href' => $title->getLinkURL()
	      ),
	      $title->getText()
	    ),
	    array(
	      'class' => 'link expand'
	    )
	  ),
	  $this->cell(
	    '&nbsp;',
	    array(
	      'class' => 'watched-status ' . ($watched ? 'watched' : 'unwatched')
	    )
	  ),
	  $this->cell(
	    $this->getContext()->getLanguage()->date(
	      $row['timestamp']
	    ),
	    array(
	      'class' => 'last-change'
	    )
	  )
	)
      )
    );
  }

  function cell($content, $params = array()) {
    return Html::rawElement(
      'td',
      $params,
      $content
    );
  }
}

?>
