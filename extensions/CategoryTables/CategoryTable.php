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
        'Latest',
        'Type',
        'Title'
        /*
          To sort based on watch status, we'd have to index that. This would be a fairly complicated task, so I'm leaving it out for now.
          'watched',
        */
    );

    private static function sortLatest($a, $b) {
	return $a->getTouched() - $b->getTouched();
    }

    private static function sortType($a, $b) {
	return $a->getNamespace() - $b->getNamespace();
    }

    private static function sortTitle($a, $b) {
	return strcasecmp($a->getText(), $b->getText());
    }

    public static function markStale(&$modifiedTimes) {
        $modifiedTimes['page'] = wfTimestampNow();
    }

    public static function drawCategoryAsTable($categoryPage) {
        $tablePage = new self(
            $categoryPage->getTitle(),
            $categoryPage->getOldID()
        );

        $tablePage->setContext($categoryPage->getContext());
        $tablePage->setParserOptions($categoryPage->getParserOptions());

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

        $output = $tablePage->getContext()->getOutput();
        $output->addModules('ext.category-tables');

        $tablePage->view();

        /*
          Returning false causes the original CategoryPage to return from its view method without doing anything itself.
        */
        return false;
    }

    function out($html) {
        $this->getContext()->getOutput()->addHTML($html);
    }

    function canEdit() {
        return $this->getTitle()->userCan(
            'edit',
            $this->getContext()->getUser(),
            'quick'
        );
    }

    function view() {
	$cat = Category::newFromTitle(
	    $this->getTitle()
	);

	$categoryContentsIterator = $cat->getMembers();

        /*
          Don't cache category pages in the browser (we would return a 304 stale otherwise).
        */
        global $wgHooks;
        $wgHooks['OutputPageCheckLastModified'][] = 'CategoryTable::markStale';

        parent::view();

	$this->getContext()->getOutput()->enableOOUI();


        if ($this->canEdit()) {
            $newCategoryPageConfig = array(
                'id' => 'new-category-page',
                'infusable' => true,
                'label' => 'Add Asset',
                'href' => '#'
            );

            Hooks::run(
                "CategoryTableAddToCategory",
                array(
                   &$newCategoryPageConfig,
                   $this->getContext()->getOutput(),
                   $this->getTitle()
                )
            );

            $this->out(
                new OOUI\ButtonWidget(
                    $newCategoryPageConfig
                )
            );
        }

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

	$categoryContents = array();
	$currentItem = $categoryContentsIterator->current();

	while ($currentItem != null) {
	    $categoryContents[] = $currentItem;
	    $categoryContentsIterator->next();
	    $currentItem = $categoryContentsIterator->current();
	}

	uksort(
	    $categoryContents,
	    "sort" + $this->$sort
	);

	if ($this->sortAscending) {
	    $categoryContents = array_reverse($categoryContents);
	}

        $this->out(
            $this->table(
		array_slice(
		    $categoryContents,
		    $offset * $pageSize,
		    $pageSize
		)
	    )
        );

        $this->pagination(count($categoryContents));

        $this->addHelpLink('Help:Categories');
    }

    function showMissingArticle() {
        // Overriding this method because we do not want to show the missing article message for categories..
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

    function table($categoryContents) {
        $rows = "";

	foreach ($categoryContents as $title) {
	    $rows .= $this->categoryContentsRow($title);
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

    function categoryContentsRow($title) {
        return Html::rawElement(
            'tr',
            array(),
            join(
                '',
                array(
                    $this->typeCell($title->getNSText() ?: 'Page'),
                    $this->titleCell(
			$title->getText(),
			$title->getLinkURL(),
			''
		    ),
                    $this->watchedCell($this->getContext()->getUser()->isWatched($title)),
                    $this->lastChangeCell($title->getTouched())
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
