## Before running this, you need to create passwords.nix and populate it with:
# {
#    dbMediawiki = "mediawiki user's password here";
#    dbRoot = "root password here";
# }
{
    network.description = "110 Thermos Wiki";

    thermosWiki =
     {pkgs, ...} :

     {
         networking.hostName = "thermos-wiki";
	 networking.domain = "r.cse.org.uk";
	 networking.firewall.allowedTCPPorts = [80];

	 ## Mediawiki data is stored in PostgreSQL.
	 services.postgresql = {
	     enable = true;
	     package = pkgs.postgresql;
	     
             authentication = pkgs.lib.mkForce ''
                 local mediawiki all ident map=mwusers
                 local all all ident
             '';
  
             identMap = ''
	         mwusers root mediawiki
		 mwusers wwwrun mediawiki
             '';
	 };

	 systemd.services.mkdirs = {
	     script = ''
	       mkdir -p /var/lib/mediawiki/uploaded-files
	       chown wwwrun:wwwrun -R /var/lib/mediawiki
	     '';
	     wantedBy = [ "multi-user.target" ];
	     description = "Sets up directories needed by Mediawiki.";
	 };

	 ## Used by Mediawiki VisualEditor extension
	 services.parsoid = {
	     enable = true;
 	     interface = "127.0.0.1";
	     port = 8000;
	     interwikis = {};
	 };

	 services.httpd = {
 	     enable = true;
 	     adminAddr = "glenn.searby@cse.org.uk";
	     extraSubservices = [
	         {
		     ## See https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/web-servers/apache-httpd/default.nix#L50
		     ## This mechanism isn't documented.
		     function = import ./mediawiki.nix;

		     serviceType = "mediawiki";

		     dbType = "postgres";
		     dbServer = "";
		     dbName = "mediawiki";
		     dbUser = "mediawiki";
		     emergencyContact = "glenn.searby@cse.org.uk";
		     siteName = "Thermos Wiki";

		     ## TODO: the Thermos logo is UGLY
  		     logo = "/w/skins/thermos.JPG";

		     ## Allow file uploads
		     enableUploads = true;
		     uploadDir = "/var/lib/mediawiki/uploaded-files";

		     defaultSkin = "Steep";
		     
		     skins = [
		         ./skins
		     ];

		     extensions = [
		         ./extensions
			 (import ./visual-editor.nix)
		     ];

		     extraConfig = builtins.foldl' (x: y: x + y) ""
		       (map builtins.readFile [
		         ./Skins.php
		         ./Permissions.php
		         ./WikiEditor.php
		         ./VisualEditor.php
		         ./SteepExtensions.php
		       ]);
		 }
	     ];
 	 };
     };
}
