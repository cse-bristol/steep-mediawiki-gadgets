## Before running this, you need to create passwords.nix and populate it with:
# {
#    dbMediawiki = "mediawiki user's password here";
#    dbRoot = "root password here";
# }
let machine-function = (import ./wiki-server-definition.nix);
in
{
    network.description = "737 GLA Smart Energy Wiki";

    gla-wiki = {pkgs, ...} : machine-function {inherit pkgs; hostname = "gla-wiki"; extraConfig = "$wgServer = 'https://london-smart-energy.cse.org.uk';";};
}
