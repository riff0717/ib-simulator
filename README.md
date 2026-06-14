# ib-simulator
このリポジトリは https://github.com/uy0311/innovative-balance のシミュレーターです。

開発環境（概要）

このプロジェクトは静的ファイルをホストする形で動作します。開発には Docker と docker-compose を推奨します。Docker を使わない簡易的な手動手順も下に記載していますが、CI/CD や本番イメージ作成は Docker 前提です。

前提条件

- Docker（推奨）
- docker-compose（環境によっては Docker の compose plugin を使用）
- make（オプション、Makefile が存在する場合）

ローカルでの開発サーバ起動（Docker 推奨）

1. Docker が利用可能な場合（推奨）:

   # compose v2 (docker compose) を使う例
   docker compose up --build -d

   # または古い docker-compose を使う場合
   docker-compose up --build -d

   ブラウザで http://localhost:8080/ を開き、hoi4-innova.html を確認してください。

2. Docker が使えない場合（手動）:

   プロジェクトのルートで静的ファイルを確認したいだけであれば、python3 による簡易サーバを手動で起動できます（注意: これは簡易確認用で、本番用途には適しません）。

   cd /path/to/repo
   python3 -m http.server 8080

   その後ブラウザで http://localhost:8080/ を開いてください。

トラブルシュート

- Docker をコマンド実行する権限がない場合、ホストへ Docker をインストールし、現在のユーザーを docker グループへ追加してください:

  sudo usermod -aG docker $USER
  newgrp docker

- ポート 8080 が既に使われている場合は別ポートを指定して起動してください（例: python3 -m http.server 9000、あるいは docker run の -p マッピングを変更）。

プロダクション用イメージのビルド

  make build
  docker run --rm -p 8080:80 ib-simulator:latest

（start-dev.sh は削除されました。自動起動スクリプトが必要な場合は代替スクリプトを作成してください。）
