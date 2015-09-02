<?php
/*
 * Outputs the HTML for the button-bar in the top-right of a page, which has the 'talk', 'edit' etc. links. 
 * @ingroup Skins
 */

class SteepContentActions {
  function __construct($actions) {
    $this->actions = $actions;
  }

  function actionExists($action) {
    return array_key_exists($action, $this->actions) && $this->actions[$action];
  }
  
  function contentNavigation() {
    $contentActionsMenu = '';

    foreach (array('talk', 've-edit', 'history', 'watch', 'unwatch') as $tab) {
      if ($this->actionExists($tab)) {
	$action = $this->contentAction($tab, $this->actions[$tab]);

	$contentActionsMenu .= $action;
      }
    }

    return Html::rawElement(
      'ul',
      array(
	'class' => 'content-actions'
      ),
      $contentActionsMenu . $this->contentActionsHamburger()
    );
  }

  function contentActionsHamburger() {
    $contentSubmenu = '';

    foreach(array('delete', 'move', 'protect', 'purge') as $tab) {
      if ($this->actionExists($tab)) {
	$contentSubmenu .= $this->contentAction($tab, $this->actions[$tab]);
      }
    }

    $expander = Html::rawElement(
      'div',
      array(
	'class' => 'content-submenu-expander'
      ),
      '...'
    );

    $submenu = Html::rawElement(
      'div',
      array(
	'class' => 'content-submenu-wrapper'
      ),
      Html::rawElement(
	'ul',
	array(
	  'class' => 'content-submenu-list'
	),
	$contentSubmenu
      )
    );

    return Html::rawElement(
      'li',
      array(
	'class' => 'content-submenu'
      ),
      $expander . $submenu
    );
  }

  function contentAction($tab, $data) {
    return Html::rawElement(
      'li',
      array(
	'class' => 'content-action',
	'id' => $data['id']
      ),
      Html::rawElement(
	'a',
	array(
	  'class' => ($data['class'] . ' ' ?: '') . 'content-action-link',
	  'href' => $data['href']
	)
      )
    );
  }
}  
?>