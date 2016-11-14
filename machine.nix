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

	 ## TODO: think about backups?
	 
	 ## Mediawiki data is stored in MySQL.
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
		     serviceType = "mediawiki";

		     dbType = "postgres";
		     dbServer = "";
		     dbName = "mediawiki";
		     dbUser = "mediawiki";
		     emergencyContact = "glenn.searby@cse.org.uk";
		     siteName = "Thermos Wiki";

		     ## TODO: get the thermos logo
		     ## TODO: this isn't working anyway
  		     logo = ./steep-logo.png;

		     ## TODO fonts aren't loading - dunno why?

		     ## TODO: include the steep icons

		     ## TODO: allow file uploads
		     # enableUploads = "true";
		     # uploadDir = "";

		     defaultSkin = "steep";
		     
		     skins = [
		         ./skins
		     ];

		     ## TODO: visualeditor

		     ## TODO check through steep settings and see what we need
		     ## I should remove all the other stuff and just include some .php files?		     
		     # See http://www.mediawiki.org/wiki/Manual:Configuration_settings
		     extraConfig = ''
		         wfLoadSkins(array(
			     'steep',
			     'Vector'
			 ));
		     '';
		 }
	     ];
 	 };
     };
}
