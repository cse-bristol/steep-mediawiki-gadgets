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
        return IncludeSteepGadgets::Render($args, "/energy-efficiency-planner", "data-map");
    }

    static function Render($args, $location, $tag) {
        if (isset($args['name'])) {

            $iframeAttrs = array(
                "src" => $location . "/?name=" . $args['name'],
                "style" => "width:100%; height:600px;"
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