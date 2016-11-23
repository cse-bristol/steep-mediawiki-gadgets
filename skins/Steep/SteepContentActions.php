<?php
/*
 * Outputs the HTML for the button-bar in the top-right of a page, which has the 'talk', 'edit' etc. links.
 * @ingroup Skins
 */

class SteepContentActions {
    function __construct($actions, $viewUrl) {
	$this->actions = $actions;
	$this->viewUrl = $viewUrl;
    }

    function actionExists($action) {
	return array_key_exists($action, $this->actions) && $this->actions[$action];
    }

    function contentNavigation() {
	$contentActionsMenu = '';



	foreach (array('talk', 've-edit', 'history', 'watch', 'unwatch') as $tab) {
	    if ($tab == 've-edit' && !$this->actionExists($tab)) {
		$tab = 'edit';
	    }

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
	    $contentActionsMenu . $this->contentActionsHamburger() . $this->viewLink()
	);
    }

    function viewLink() {
	if ($this->viewUrl) {
	    return Html::rawElement(
		'a',
		array(
		    'class' => 'back-to-page',
		    'href' => $this->viewUrl
		),
		wfMessage('steep-view-link')->text()
	    );

	} else {
	    return '';
	}
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
	    '&nbsp;'
	);

	if ($contentSubmenu) {
	    $submenu = Html::rawElement(
		'ul',
		array(
		    'class' => 'content-submenu-list'
		),
		$contentSubmenu
	    );
	} else {
	    $submenu = '';
	}

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
