<?php

/*
 * This is where the HTML for the navbar down te side gets output.
 *
 * @ingroup Skins
 */

class SteepNavbar {
    private $excludedNavigation = array(
        'n-mainpage-description',
        'n-recentchanges',
        'n-randompage',
        'n-help'
    );

    function __construct($navigation, $siteName, $logoPath, $homeHref, $translator, $isPage) {
        $this->navItems = $navigation;
        $this->siteName = $siteName;
        $this->logoPath = $logoPath;
        $this->homeHref = htmlspecialchars($homeHref);
        $this->translator = $translator;
        $this->isPage = $isPage;
    }

    function getMsg ($msg) {
        return htmlspecialchars(
            $this->translator->translate($msg)
        );
    }

    function navImgLink ($alt, $href, $src, $text='') {
        $img = Html::rawElement(
            'img',
            array(
                'src' => $src,
                'alt' => $alt
            )
        );

        $div = Html::rawElement(
            'div',
            array(),
            $text ?: $alt
        );

        return Html::rawElement(
            'a',
            array(
                'href' => $href,
                'class' => 'nav-image-link'
            ),
            $img . $div
        );
    }

    function navIconLink ($text, $href, $icon) {
        return Html::rawElement(
            'a',
            array(
                'href' => $href,
                'class' => 'nav-icon-link ' . $icon
            ),
            $text
        );
    }

    function navLink ($text, $href) {
        return Html::rawElement(
            'a',
            array(
                'href' => $href,
                'class' => 'nav-text-link'
            ),
            $text
        );
    }

    function fullScreenToggle () {
        return Html::rawElement(
            'a',
            array(
                'class' => 'fullscreen-toggle'
            ),
            '&nbsp;'
        );
    }

    public function standardNavItems() {
        ## Items defined in Mediawiki:Sidebar navigation section.
        $sidebarNavigation = array();

        foreach ($this->navItems as $key => $item) {
            ## Ignore things we've listed at the top.
            if (!in_array($item['id'], $this->excludedNavigation)) {
                $itemClass = array_key_exists('class', $item) ? ' ' . $item['class'] : '';

                $sidebarNavigation[] = Html::rawElement(
                    'a',
                    array(
                        'id' => $item['id'],
                        'href' => $item['href'],
                        'class' => 'nav-icon-link ' . $itemClass
                    ),
                    $item['text']
                );
            }
		}

        return join('', $sidebarNavigation);
    }

    public function upperNavItems() {
        $addAssetsTitle = Title::newFromText(
            'Upload',
            MWNamespace::getCanonicalIndex('special')
        );

        return join(
            '',
            array(
                ($this->isPage ? $this->fullScreenToggle() : ''),
                $this->navImgLink(
                    $this->siteName,
                    $this->homeHref,
                    $this->logoPath,
                    $this->getMsg('home')
                ),
                $this->standardNavItems(),
                $this->navIconLink(
                    $this->getMsg('add-assets'),
                    $addAssetsTitle->getLinkUrl(),
                    'add-assets'
                ),
                $this->navIconLink(
                    $this->getMsg('manage-assets'),
                    SpecialPage::getTitleFor('Listfiles')->getLinkUrl(),
                    /*
                      We haven't yet defined this special page, so just using the files list for now.
                    */
                    /*
                      Skin::makeNSUrl(
                      $this->getMsg('manage-assets-page'),
                      '',
                      NS_SPECIAL
                      ),
                    */
                    'manage-assets'
                ),
                $this->navIconLink(
                    $this->getMsg('manage-users'),
                    Skin::makeNSUrl(
                        $this->getMsg('manage-users-page'),
                        '',
                        NS_SPECIAL
                    ),
                    'manage-users'
                )
            )
        );
    }

    public function lowerNavItems () {
        return join(
            array(
                $this->navIconLink(
                    $this->getMsg('about'),
                    Title::newFromText(
                        $this->getMsg('aboutpage')
                    )->getLinkUrl(),
                    'about'
                ),
                $this->navLink(
                    $this->getMsg('help'),
		    Title::newFromText(
			$this->getMsg('helppage')
		    )->getLinkUrl()
                ),
                $this->navLink(
                    $this->getMsg('privacy'),
                    Title::newFromText(
                        $this->getMsg('privacypage')
                    )->getLinkUrl()
                ),
                $this->navLink(
                    $this->getMsg('disclaimers'),
                    Title::newFromText(
                        $this->getMsg('disclaimerpage')
                    )->getLinkUrl()
                )
            )
        );
    }
}
?>
