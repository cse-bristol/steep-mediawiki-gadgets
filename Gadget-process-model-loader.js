"use strict";

/*global mw*/

/*
 This gadget exists solely to load the main gadget on when the VisualEditor is enabled.

 If we didn't take this extra step, we'd end up loading the JS for the whole VisualEditor on every page.
 */
mw.libs.ve.addPlugin('ext.gadget.ProcessModel');
