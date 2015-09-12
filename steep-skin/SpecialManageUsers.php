<?php

class SpecialManageUsers extends UnlistedSpecialPage {
  function __construct() {
    parent::__construct('ManageUsers');
  }

  function getGroupName() {
    return 'users';
  }

  function execute() {
    $pages = SpecialPageFactory::getUsablePages($this->getUser());

    $userPages = array();
    
    foreach($pages as $page) {
      if ($page->getFinalGroupName() === 'users') {
	$userPages[] = $page;
      }
    }

    $out = $this->getOutput();

    $out->addHtml($this->pageList($userPages));
  }

  function pageList($userPages) {
    $li = array();

    forEach($userPages as $page) {
      $li[] = $this->pageLink($page);
    }
    
    return Html::rawElement(
      'ul',
      array(),
      join(
	'',
	$li
      )
    );
  }

  function pageLink($page) {
    return Html::rawElement(
      'li',
      array(),
      Linker::linkKnown(
	$page->getTitle(),
	htmlspecialchars($page->getDescription())
      )
    );
  }
}

?>
