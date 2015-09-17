<?php

/*
   Search for the following things inside a particular category:
   + Pages
   + Categories
   + Files
   + Process Models and Maps.

   Return the following columns:
   + Last change
   + Watched status (for Mediawiki items only)
   + Title
   + Text snippet
   + Type (Page/Category/...)

   Allow sorting on the Title, Type and Last Change.
 */
class CategoryContentSearch extends \CirrusSearch\Searcher {
  private static $sortTypes = array(
    'title' => 'string',
    'latest' => 'number',
    'type' => 'string'
  );

  public static $steepIndex = 'share';
  private static $steepType = 'snapshot';
  private static $steepCollections = array(
    'process-models',
    'maps',
    'shape-layers'
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
    $indices = array();

    foreach($this->namespaces as $n) {
      /*
	 It's not clear where the "_first" is actually supposed to come from, but it's present in te index.
       */
      $indices[] = $this->indexBaseName . "_" . CirrusSearch\Connection::getIndexSuffixForNamespace($n) . "_". "first";
    }

    $indices = array_unique($indices);

    $mediawikiFilter = CirrusSearch\Search\Filters::unify(
      array(
	/*
	   Filter based on namespace and category.
	 */
	new Elastica\Filter\Terms('namespace', $this->namespaces),
	new Elastica\Filter\Term(array(
	  'category.lowercase_keyword' => strtolower($this->category)
	))
      ),
      array()
    );

    $steepFilter = CirrusSearch\Search\Filters::unify(
      array(
	/*
	   Returns Steep process-models, maps and map data which belong to this project, and aren't deleted.
	 */
	new Elastica\Filter\Term(array(
	  'data.project' => $this->category
	)),
	
	new Elastica\Filter\Term(array(
	  'deleted' => 'false'
	)),
	
	new Elastica\Filter\Term(array(
	  '_type' => self::$steepType
	)),

	new Elastica\Filter\Terms('collection', self::$steepCollections)
      ),
      array()
    );

    $filter = new Elastica\Filter\Indices($mediawikiFilter, $indices);
    $filter->setNoMatchFilter($steepFilter);
    
    $query = Elastica\Query::create($filter);

    $query->setFrom($this->offset);
    $query->setSize($this->limit);

    $query->setSort(
      array(
	'_script' => array( 
	  /*
	     The Mediawiki and Steep indices contain different fields in their documents.
	     Try both the possible fields for each document.
	   */
	  'script' => $this->sortScript($sort),
	  'type' => self::$sortTypes[$sort],
	  'order' => $sortAscending ? 'asc' : 'desc'
	)
      )
    );

    $resultsType = new CirrusSearch\Search\FullTextResultsType(
      CirrusSearch\Search\FullTextResultsType::HIGHLIGHT_ALL
    );

    $query->setFields(array(
      'title',
      'namespace',
      'timestamp',
      'doc',
      'collection',
      '_timestamp',
      '_index'
    ));

    $highlightSource = array();
    $query->setHighlight(
      $resultsType->getHighlightingConfiguration($highlightSource)
    );

    $pageType = CirrusSearch\Connection::getPageType($indices[0], false);

    $search = new Elastica\Search($pageType->getIndex()->getClient());

    $search->addIndices($indices);
    $search->addType($pageType);
    
    $search->addIndex(self::$steepIndex);
    $search->addType(self::$steepType);

    return $search->search($query);
  }

  function sortScript($sort) {
    $isSteep = "(doc['_index'].value == '" . self::$steepIndex . "')";

    $parseMediawikiDate = "import java.text.SimpleDateFormat; import java.text.ParsePosition;";

    switch ($sort) {
      case 'title':
	return  $isSteep . " ? doc['doc.raw'].value : doc['title.keyword'].value.toLowerCase()";
	
      case 'latest':
	return $isSteep . " ? doc['_timestamp'].value : doc['timestamp'].value";

      case 'type':
	return $isSteep . " ? doc['collection'].value : String.valueOf(doc['namespace'].value)";
	
      default:
      throw new Exception("Unknown sort " . $sort);
    }
  }
}
?>
