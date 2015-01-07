<?php

class IncludeSteepGadgets {
    static function HookParser($parser) {
        $parser->setHook("process-model", "IncludeSteepGadgets::ProcessModelRender");
        $parser->setHook("data-map", "IncludeSteepGadgets::MapRender");
        return true;
    }

    static function ProcessModelRender($input, $args, $parser, $frame) {
        return IncludeSteepGadgets::Render($args, "/process-model", "process-model");
    }

    static function MapRender($input, $args, $parser, $frame) {
        return IncludeSteepGadgets::Render($args, "/map", "data-map");
    }

    static function Render($args, $location, $tag) {
        if (isset($args['name'])) {

            if (isset($args['width'])) {
                $width = $args['width'];
            } else {
                $width = "100%";
            }

            if (isset($args['height'])) {
                $height = $args['height'];
            } else {
                $height = "600px";
            }
            
            $iframeAttrs = array(
                "src" => $location . "/?name=" . $args['name'],
                "style" => "width:" . $width . "; height:" . $height . "; display:inline-block;"
            );

            // This automatically escapes attribute values for us.          
            return Html::rawElement(
                "iframe",
                $iframeAttrs
            );
          
        } else {
            return "Attempt to include " . $tag . " without setting name attribute."; 
        }
    }
}

?>