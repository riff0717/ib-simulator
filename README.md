# ib-simulator
https://github.com/uy0311/innovative-balance のシミュレーターです

Docker での開発手順:

1. 開発サーバ起動（nginxでホスト、カレントディレクトリをマウント）

   ./start-dev.sh

   または

   make dev

2. ブラウザで http://localhost:8080/ を開き、hoi4-innova.html を確認してください。

注意とトラブルシュート:
- リモート環境で sudo が必要な場合は、ホストに Docker をインストールし、現在のユーザーを docker グループに追加してください（管理者権限が必要）。

  sudo usermod -aG docker $USER
  newgrp docker

- Docker が使えない環境では start-dev.sh は Docker を想定しています。開発サーバを手動で起動する場合は、Docker を使うか独自に静的サーバを用意してください。

プロダクション用イメージをビルドする場合:

   make build
   docker run --rm -p 8080:80 ib-simulator:latest

