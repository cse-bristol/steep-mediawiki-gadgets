let machine =
     { config, pkgs, ...} :
     { deployment.targetEnv = "libvirtd";
       deployment.libvirtd.imageDir = "/pool/nixops";
       deployment.libvirtd.headless = true;
       deployment.libvirtd.memorySize = 2048;

       # This is important:
       # NixOps needs to connect to machines over the network to configure them
       # To do this it needs to get their network address
       # That means it needs to ask the 'backend' for a machine's address
       # In libvirtd, this means letting libvirtd be in charge of DHCP
       # In our network, libvirtd is /not/ in charge of DHCP, so we can do r.cse.org.uk
       # SO the machine must be connected to two networks
       # nixops will talk to it on network "default", and our workstations on "cse-internal"
       # these names are network names setup inside libvirtd
       # which you can poke at with virsh qemu:///system or virt-manager
       deployment.libvirtd.networks = [ "default" "cse-internal" ];
     };
in
{
  thermosWiki = machine;
}
