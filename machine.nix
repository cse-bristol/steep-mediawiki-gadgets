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

		     ## TODO: logo
  		     # logo = "put the logo somewhere";

		     ## TODO: allow file uploads
		     # enableUploads = "true";
		     # uploadDir = "";

		     ## TODO: steep skin, vector skin
		     # defaultSkin = "":
		     # skins = [];

		     ## TODO: visualeditor

		     ## TODO check through steep settings and see what we need
		     # See http://www.mediawiki.org/wiki/Manual:Configuration_settings
		     extraConfig = "";
		 }
	     ];
 	 };
     };
}
