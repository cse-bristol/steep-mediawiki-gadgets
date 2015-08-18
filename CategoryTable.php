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

  function el($element='div', array $attribs=array(), $contents='') {
    $this->getContext()->getOutput()->addElement($element, $attribs, $contents);
  }
  
  function view() {
    $this->el(
      'button',
      array(
	'id' => 'new-category-page'
      ),
      'New ' . $this->getTitle()->getText()
    );
    
    // ToDo title, new, sort, search
    
    parent::view();

    // ToDo table
    
    $this->addHelpLink('Help:Categories');
  }
}

?>
