<?php

/**
 * Skin file for Steep skin
 *
 * @file
 * @ingroup Skins
 */
class SkinSteep extends SkinTemplate {
  var $skinname = 'steep',
  $stylename = 'Steep',
  $template = 'SteepTemplate',
  $useHeadElement = true;

  public function initPage(OutputPage $out)  {
    parent::initPage($out);
    $out->addModules('skins.steep.js');
  }

  function setupSkinUserCss(OutputPage $out) {
    parent::setupSkinUserCss($out);

    $out->addModuleStyles(
      array(
        'skins.steep.styles'
      )
    );
  }

  public function doEditSectionLink(Title $nt, $section, $tooltip = NULL, $lang = false) {
    return '';
  }

  protected function prepareQuickTemplate() {
    $template = parent::prepareQuickTemplate();

    $template->set(
      'hidetoc', 
      $this->getRequest()->getCookie('hidetoc')
    );

    $action = $this->getRequest()->getVal('action');
    $isTalk = $this->getTitle()->isTalkPage();
    $viewLink = $this->getTitle()->getSubjectPage()->getLinkURL();

    $template->set(
      'viewurl',
      ($action === 'history' || $isTalk) ? $viewLink : ''
    );

    $template->set(
      'isPage',
      $this->getTitle()->isContentPage()
    );

    $template->set(
      'categoryLinks',
      $this->getOutput()->getCategoryLinks()['normal']
    );
   
    return $template;
  }
}
