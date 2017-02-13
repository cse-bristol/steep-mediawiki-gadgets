## Before running this, you need to create passwords.nix and populate it with:
# {
#    dbMediawiki = "mediawiki user's password here";
#    dbRoot = "root password here";
# }
let machine-function = (import ./wiki-server-definition.nix);
in
{
    network.description = "110 Thermos Wiki Test";

    thermos-wiki-test = {pkgs, ...} : machine-function {inherit pkgs; hostname = "thermos-wiki-test"; extraConfig = "";};
}
