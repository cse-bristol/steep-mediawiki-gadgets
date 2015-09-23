<?php

/*
   CategoryTable draws a category as a sortable, paged table instead of a list.

   Subcategories, pages and files are all displayed in the same table, with a column to distinguish their type.

   We do this by both hooking into and extending CategoryPage.
 */
class CategoryTable extends Article {
  // This many results per page.
  private $pageSize = 10;
  // Our current page.
  private $page = 1;
  // We'll show this many pages either side of the current page, if they're available.
  private $pagesToShow = 3;

  /*
     $sort is the current sort option.
     $sortAscending is the direction of sort.
     $sortOptions are the possible sort columns.
   */
  private $sort = 'latest';
  private $sortAscending = false;
  private static $sortOptions = array(
    'latest',
    'type',
    'title'
    /*
       To sort based on watch status, we'd have to index that. This would be a fairly complicated task, so I'm leaving it out for now.
       'watched',
     */
  );

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

    $tablePage->isProjectsPage = $categoryPage->getTitle() == 'Category:Projects';

    $req = $page = $tablePage->getContext()->getRequest();

    $page = $req->getInt('page');

    if ($page) {
      $tablePage->page = $page;
    }
    
    $ascending = $req->getText('sortAscending');
    
    if (!is_null($ascending)) {
      $ascending = ($ascending === 'true');
      
      $tablePage->sortAscending = $ascending;
    }

    $sort = $req->getText('sort');

    if ($sort && in_array($sort, self::$sortOptions)) {
      $tablePage->sort = $sort;
    }

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
    parent::view();
    
    $this->getContext()->getOutput()->enableOOUI();

    $this->out(
      new OOUI\ButtonWidget(
	array(
	  'id' => 'new-category-page',
	  'infusable' => true,
	  'label' => $this->isProjectsPage ? 'New Project' : 'Add Asset',
	  'href' => '#'
	)
      )
    );

    $this->out(
      $this->viewSort()
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

    $search = CategoryContentSearch::create(
      $this->pageSize * ($this->page - 1),
      $this->pageSize,
      $this
    );

    $searchResults = $search->search($this->sort, $this->sortAscending);

    $this->out(
      $this->table($searchResults)
    );

    $this->pagination($searchResults->getTotalHits());
    
    $this->addHelpLink('Help:Categories');
  }

  function viewSort() {
    $widget = new OOUI\DropdownInputWidget(
      array(
	'id' => 'sort-category-table',
	'infusable' => true
      )
    );

    $widget->setOptions(
      array(
	array('data' => 'Latest'),
	/*
	   Watched status is not current implemented, see comment above.
	   array('data' => 'Watched'),
	 */
	array('data' => 'Type'),
	array('data' => 'Title')
      )
    );

    $widget->setValue(
      ucfirst($this->sort)
    );

    return $widget;
  }

  function table($searchResults) {
    $rows = "";

    while ($current = $searchResults->current()) {
      $highlights = $current->getHighlights();
      
      if (array_key_exists('text', $highlights)) {
	$highlightText = $highlights['text'][0];
	
      } else {
	$highlightText = '';
      }

      $rows .= $this->categorycontentsrow(
	$current->getFields(),
	$highlightText,
	$current->getIndex() === CategoryContentSearch::$steepIndex
      );

      $searchResults->next();
    }
    
    return Html::rawElement(
      'table',
      array(
	'class' => 'category-contents',
	'cellspacing' => '0',
	'cellpadding' => '0'
     ),
      Html::rawElement(
	'tbody',
	array(),
	$rows
      )
    );
  }

  function categoryContentsRow($row, $highlight, $isSteep) {
    if ($isSteep) {
      $type = $row['collection'][0];

      $titleText = $row['doc'][0];

      if ($type === 'process-models') {
	$link = '/process-model/?name=' . $titleText;
      } else if ($type === 'maps') {
	$link = '/map/?name=' . $map;
      } else {
	$link = '';
      }
      
      $watched = false;
      $timestamp = $row['_timestamp'];
      // Convert from ElasticSearch format to a Unix timestamp...
      $timestamp = round($timestamp / 1000);
      // ...and then to a Mediawiki timestamp.
      $timestamp = wfTimestamp(TS_MW, $timestamp);

    } else {
      $title = Title::newFromText($row['title'][0], $row['namespace'][0]);

      $type = $title->getNSText() ?: 'Page';
      
      if ($this->isProjectsPage && $type === 'Category') {
	$type = 'Project';
      }

      $titleText = $title->getText();
      $link = $title->getLinkURL();

      $watched = $this->getContext()->getUser()->isWatched($title);
      $timestamp = $row['timestamp'][0];
    }

    return Html::rawElement(
      'tr',
      array(),
      join(
	'',
	array(
	  $this->typeCell($type),
	  $this->titleCell($titleText, $link, $highlight),	  
	  $this->watchedCell($watched),
	  $this->lastChangeCell($timestamp)
	)
      )
    );
  }

  function typeCell($type) {
    return $this->cell(
      '&nbsp;',
      array(
	'class' => 'type ' . $type
      )
    );
  }

  function titleCell($title, $link, $highlight) {
    if ($highlight) {
      // Search 'highlight' - a relevent snippet of text from the document.
      $highlightText = Html::rawElement(
	'span',
	array(
	  'class' => 'search-snippet'
	),
	$highlight
      );
    } else {
      $highlightText = '';
    }

    $props = array();

    if ($link) {
      $props['href'] = $link;
    }
		     
    return $this->cell(
      join(
	'',
	array(
	  // Title
	  Html::rawElement(
	    'a',
	    $props,
	    $title
	  ),

	  $highlightText
	)
      ),
      array(
	'class' => 'title-column expand'
      )
    );
  }

  function watchedCell($watched) {
    return $this->cell(
      '&nbsp;',
      array(
	'class' => 'watched-status ' . ($watched ? 'watched' : 'unwatched')
      )
    );
  }

  function lastChangeCell($timestamp) {
    if ($timestamp) {
      $dateString = $this->getContext()->getLanguage()->date(
	$timestamp
      );
    } else {
      $dateString = '';
    }
    
    return $this->cell(
      $dateString,
      array(
	'class' => 'last-change'
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

  function pagination($hits) {
    if ($hits <= $this->pageSize) {
      return;
    }

    $lastPage = ceil($hits / $this->pageSize);

    $pageLinks = '';

    if ($this->page > 1) {
      $pageLinks .= $this->paginationLink($this->page - 1, 'Prev');

      $pagesBefore = range(
	max(
	  $this->page - $this->pagesToShow,
	  1
	),
	$this->page - 1
      );

      foreach ($pagesBefore as $i => $p) {
	$pageLinks .= $this->paginationLink($p);
      };      
    }

    $pageLinks .= Html::rawElement(
      'span',
      array(),
      $this->page . ' of ' . $lastPage
    );

    if ($this->page < $lastPage) {
      $pagesAfter = range(
	$this->page + 1,
	min(
	  $this->page + $this->pagesToShow,
	  $lastPage
	)
      );
      
      foreach ($pagesAfter as $p) {
	$pageLinks .= $this->paginationLink($p);
      }

      $pageLinks .= $this->paginationLink($this->page + 1, 'More');
    }

    $this->out(
      Html::rawElement(
	'div',
	array(
	  'class' => 'pagination'
	),
	$pageLinks
      )
    );
  }

  function paginationLink($page, $content = null, $params = array()) {
    $query = $this->getContext()->getRequest()->getQueryValues();
    $query['page'] = $page;
    
    $params['href'] = "?" . http_build_query($query);

    if (!$content) {
      $content = $page;
    }
    
    return Html::rawElement(
      'a',
      $params,
      $content
    );
  }
}

?>
