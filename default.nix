{ pkgs ? import <nixpkgs> { system = builtins.currentSystem; } }:
let
  node2nix = import ./node2nix.nix { inherit pkgs; };
  nodeDependencies = node2nix.package.override {
    preInstallPhases = "skipChromiumDownload";

    skipChromiumDownload = ''
      export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
    '';
  };

  dist = pkgs.stdenv.mkDerivation rec {
    name = "pdf-resume-builder";
    src = nodeDependencies;
    buildInputs = [ pkgs.nodejs ];
    buildPhase = ''
      cp -r $src/lib/node_modules/${name}/* .
      export PATH="${nodeDependencies}/.bin:$PATH"
      npm run build
    '';
    installPhase = ''
      mkdir -p $out/
      cp -r dist/* $out
    '';
  };
in
pkgs.writeShellScriptBin "pdf-resume-builder" ''
  export PUPPETEER_EXECUTABLE_PATH=${pkgs.chromium.outPath}/bin/chromium
  ${pkgs.nodePackages.http-server}/bin/http-server --port 7777 ${dist} & HPID=$!
  ${nodeDependencies}/bin/pdf-resume-builder
  kill -n 9 ''${HPID}
''
