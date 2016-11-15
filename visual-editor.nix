## Not sure if this big import is a good idea?
with import <nixpkgs> {};
	
stdenv.mkDerivation {
  name = "mediawiki-visual-editor-REL1_27";
  src = fetchurl {
    url = "https://extdist.wmflabs.org/dist/extensions/VisualEditor-REL1_27-9da5996.tar.gz";
    md5 = "6edf126370920efcff1e4796886109bf";
  };
  builder = builtins.toFile "builder.sh" ''
    source $stdenv/setup
    mkdir -p $out
    tar -xf $src -C $out
  '';
}
