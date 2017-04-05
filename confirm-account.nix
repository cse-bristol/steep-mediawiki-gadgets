## Not sure if this big import is a good idea?
with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "mediawiki-confirm-account-REL1_27";
  src = fetchurl {
    url = "https://extdist.wmflabs.org/dist/extensions/ConfirmAccount-REL1_27-f156073.tar.gz";
    sha256 = "17j2xzmjpna7dp6m1gkvdr9hja6fqc5c68znb4g7w4n7kn5fxdks";
  };
  builder = builtins.toFile "builder.sh" ''
    source $stdenv/setup
    mkdir -p $out
    tar -xf $src -C $out
  '';
}
