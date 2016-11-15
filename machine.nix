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

	 ## TODO: think about backups and upgrades
	 
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

		     ## TODO: allow file uploads
		     # enableUploads = "true";
		     # uploadDir = "";

		     defaultSkin = "Steep";
		     
		     skins = [
		         ./skins
		     ];

		     extensions = [
		         ./extensions
			 (import ./visual-editor.nix)
		     ];

		     ## TODO: fetch VisualEditor

		     extraConfig = ''
		         error_reporting(-1);
                         ini_set( 'display_startup_errors', 1 );
		         ini_set('display_errors', 1);
			 $wgShowSQLErrors = true;
			 $wgDebugDumpSql  = true;
			 $wgShowDBErrorBacktrace = true;
		       '' + builtins.foldl' (x: y: x + y) ""
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
