{pkgs, hostname, extraConfig} :
{
    networking.hostName = hostname;
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

    ## Empty the medaiwiki jobs queue
    systemd.services.runJobs = {
        startAt = "*-*-* *:*:*";
        script = "/run/current-system/sw/bin/mediawiki-main-runJobs";
    };

    ## Backup wiki database
    systemd.services.backup = {
        startAt = "daily";
        path = [
            pkgs.postgresql
            pkgs.gzip
            pkgs.gnutar
            pkgs.rsync
        ];
        script = ''
          BACKUP_DIR="/var/backup/$(date +%Y-%m-%d)"
          mkdir -p "$BACKUP_DIR"

          ## Database
          pg_dump mediawiki -U mediawiki > "$BACKUP_DIR/mediawiki.sql"

          ## Uploaded files
          cp -R /var/lib/mediawiki/uploaded-files "$BACKUP_DIR"

          ## Make a gzipped tar of the backup
          rm -f "$BACKUP_DIR.tar" "$BACKUP_DIR.tar.gz"
          tar --create -f "$BACKUP_DIR.tar" "$BACKUP_DIR"
          gzip "$BACKUP_DIR.tar"

          rm -rf "$BACKUP_DIR"

          ## Send it to bolt
          rsync -rvz /var/backup/ rsync://bolt/backup/${hostname}

          rm -f "$BACKUP_DIR.tar.gz"
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

    ## TODO: remove this once Parsoid is fixed in NixOS
    ##
    ## I've packaged Parsoid myself using node2nix, and then based this on the service definition from
    ## https://github.com/NixOS/nixpkgs/blob/5187c28f9192db77869f14d31c8f844e3859d463/nixos/modules/services/misc/parsoid.nix
    ##
    ## I'm also using the yaml confuration mechanism here.

    systemd.services.parsoid_0_6 = let
        conf = ''
        worker_heartbeat_timeout: 300000

        logging:
            level: info

        services:
          - module: lib/index.js
            entrypoint: apiServiceWorker
            conf:
                mwApis:
                 - uri: 'http://${hostname}.r.cse.org.uk/w/api.php'
                   domain: 'localhost'
        '';

        confFile = builtins.toFile "config.yaml" conf;

        parsoid = ((import ./parsoid) { pkgs = pkgs; }).package;

    in {
        description = "Bidirectional wikitext parser";
        wantedBy = [ "multi-user.target" ];
        after = [ "network.target" ];
        serviceConfig = {
            User = "nobody";
   	 ExecStart = "${parsoid}/lib/node_modules/parsoid-installed/node_modules/parsoid/bin/server.js --config ${confFile} -n 2";
        };
    };

    ## Used by Mediawiki VisualEditor extension
    ## TODO: broken as of NixOS 16.09. Enable once fixed.
    # services.parsoid = {
    #     enable = true;
    #     interface = "127.0.0.1";
    #     port = 8000;
    #     interwikis = {
    #         localhost = "http://localhost/w/api.php";
    #     };
    #     extraConfig = ''
    #       parsoidConfig.debug = true;
    #     '';
    # };

    services.httpd = {
        enable = true;
        adminAddr = "glenn.searby@cse.org.uk";
        extraConfig = "RedirectMatch ^/$ /wiki";
        servedFiles = [
            {
                file = ./favicon.ico;
                urlPath = "/favicon.ico";
            }
            {
                file = ./thermos-logo.svg;
                urlPath = "/thermos-logo.svg";
            }
        ];
        phpOptions = ''
        post_max_size = 100M;
        upload_max_filesize = 100M;
        '';

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

   	     logo = "/thermos-logo.svg";

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
   	         # ./Debug.php
   	         ./Skins.php
   	         ./Permissions.php
   	         ./WikiEditor.php
   	         ./VisualEditor.php
   	         ./SteepExtensions.php
                    ./FileUploads.php
                    ./Calendar.php
   	       ]) + "wfLoadExtension('Cite');"
   	       + extraConfig
               + ''
                   $wgInvalidUsernameCharacters = '!';
                   $wgUserrightsInterwikiDelimiter = '!';
               '';
   	 }
        ];
    };
}
