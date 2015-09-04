<?php

/*
   Search for the following things inside a particular category:
   + Pages
   + Categories
   + Files
   + ToDo Process Models and Maps.

   Return the following columns:
   + Last change
   + ToDo Watched status
   + Title
   + Text snippet
   + Type (Page/Category/...)

   Allow sorting on the above columns (exept for Text snippet).
 */
class CategoryContentSearch extends \CirrusSearch\Searcher {
  private static $sortLookup = array(
    'title' => 'title.keyword',
    'latest' => 'timestamp',
    'watched' => 'timestamp',
    'type' => 'namespace'
  );
  
  public static function create($offset, $limit, $page) {
    return new self($offset, $limit, $page);
  }
  
  function __construct($offset, $limit, $page) {
    $user = $page->getContext()->getUser();

    parent::__construct(
      $offset,
      $limit,
      array(
	MWNamespace::getCanonicalIndex(''),
	MWNamespace::getCanonicalIndex('file'),
	MWNamespace::getCanonicalIndex('category')
      ),
      $user
    );

    $this->indexBaseName = wfWikiId();

    $this->offset = $offset;
    $this->limit = $limit;

    $this->category = $page->getTitle()->getText();
    $this->request = $page->getContext()->getRequest();
  }

  /*
     Returns an Elastica\ResultSet
   */
  function search($sort, $sortAscending) {
    $query = Elastica\Query::create(
      /*
	 Filter based on namespace and category.
       */
      
      CirrusSearch\Search\Filters::unify(array(
	new Elastica\Filter\Terms('namespace', $this->namespaces),
	new Elastica\Filter\Term(array(
	  'category.lowercase_keyword' => strtolower($this->category)
	))
      ))
    );

    $query->setFrom($this->offset);
    $query->setSize($this->limit);

    $query->setSort(array(
      self::$sortLookup[$sort] => ($sortAscending ? 'asc' : 'desc')
    ));

    $resultsType = new CirrusSearch\Search\FullTextResultsType(
      CirrusSearch\Search\FullTextResultsType::HIGHLIGHT_ALL
    );

    $query->setParam('_source', $resultsType->getSourceFiltering());
    $query->setParam('fields', $resultsType->getFields());

    $query->setHighlight(
      $resultsType->getHighlightingConfiguration()
    );

    $indexes = array();

    foreach($this->namespaces as $n) {
      // It's not clear where the "_first" is actually supposed to come from, but it's present in te index.
      $indexes[] = $this->indexBaseName . "_" . CirrusSearch\Connection::getIndexSuffixForNamespace($n) . "_". "first";
    }

    $indexes = array_unique($indexes);

    $pageType = CirrusSearch\Connection::getPageType($indexes[0], false);

    $search = $pageType->createSearch($query);

    foreach(array_slice($indexes, 1) as $i) {
      $search->addIndex($i);
    }

    return $search->search();
  }
}
?>
