<?php

class IncludeProcessModel {
    static function HookParser($parser) {
        $parser->setHook("process-model", "IncludeProcessModel::ProcessModelRender");
        return true;
    }

    static function ProcessModelRender($input, $args, $parser, $frame) {
        if (isset($args['name'])) {

            $iframeAttrs = array(
                "src" => "/process-model/?name=" . $args['name'],
                "style" => "width:100%; height:600px;"
            );

            // This automatically escapes attribute values for us.          
            return Html::rawElement(
                "iframe",
                $iframeAttrs
            );
          
        } else {
            return "Attempt to include process-model without setting name attribute."; 
        }
    }
}

?>