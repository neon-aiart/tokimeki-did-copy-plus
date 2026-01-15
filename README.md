# 📋 Tokimeki DID Copy Plus v1.4

Blueskyクライアント "Tokimeki" において、ハンドルの変更に左右されない **「不変のリンク（DIDベースのURL）」** を瞬時に取得し、さらにアクセシビリティを追求した高度なUserScriptです。  
A specialized UserScript for the Bluesky client "Tokimeki" that allows you to instantly copy **"Invariable Links (DID-based URLs)"** that remain valid even if handles change, with a focus on advanced accessibility and UX.

---

## 🎀 機能紹介 / Features

1. 🆔 **DIDベースのURLをコピー / Copy DID-based URL**:
   * ポストのメニューに「DIDでURLをコピー」項目を追加します。  
     ハンドル名の変更に影響されない、DID（Decentralized Identifier）を用いた永続的なURLをクリップボードにコピーします。  
     Adds "Copy DID-based URL" to the post menu.  
     It copies a permanent URL using the DID (Decentralized Identifier), ensuring links remain valid even if the user changes their handle.
2. 🔄 **コンテキスト指向の抽出 / Context-Aware Extraction**:
   * スレッド表示（返信）やメディアビュー内など、複雑なDOM構造の中でも「今、メニューを開いたターゲットのポスト」を正確に特定してDIDを取得します。  
     Accurately identifies the target post from complex DOM structures, such as within threads or MediaView, to extract the correct DID.
3. 🌍 **完全な多言語対応 (v1.1～) / Full Multi-language Support**:
   * ブラウザの言語設定を動的に検知し、ボタン表示やトースト通知を日本語/英語で適切に切り替えます。  
     Dynamically detects browser language settings and switches UI elements (buttons and toast notifications) between Japanese and English.
4. 🚀 **真の最前面（Top Layer）通知 (🆕 v1.3～) ＆ 標準トーストの最適化 (🆕 v1.4～) / True Top-Layer Notifications & Standard Toast Hack**:
   * 最新の Popover API を採用。  
     トースト通知をブラウザの「Top Layer」へと独立させることで、あらゆる表示階層の最前面で確実にコピー完了を伝えます。  
     自作のトーストだけでなく、Tokimeki標準のトースト通知も自動で Top Layer へ救出し、現在のテーマカラーを動的に適用。  
     Adopts the latest Popover API. By isolating toast notifications into the browser's 'Top Layer', we ensure copy completion is communicated at the very front of all display layers.  
     In addition to custom toasts, it automatically "rescues" standard Tokimeki notifications to the Top Layer and dynamically applies the current theme color.

---

### ✨ インストール方法 / Installation Guide

* **UserScriptマネージャーをインストール (Install the UserScript manager):**
   * **Tampermonkey**: [https://www.tampermonkey.net/](https://www.tampermonkey.net/)
   * **ScriptCat**: [https://scriptcat.org/](https://scriptcat.org/)

* **スクリプトをインストール (Install the script):**
   * [Greasy Fork](https://greasyfork.org/ja/scripts/557385) にアクセスし、「インストール」ボタンを押してください。  
     Access and click the "Install" button.

---

## 💡 Tips: 快適なエコシステムの構築 / Build Your Ecosystem

このスクリプトは、単体でも強力ですが、以下のスクリプトと組み合わせることで、Blueskyのブラウジング体験をさらにシームレスなものにします。  
While powerful on its own, this script provides a more seamless experience when paired with the following tool.

🔄 **[Bluesky ⇔ Tokimeki Switcher](https://greasyfork.org/ja/scripts/545465)**:
  * 公式Web版（bsky.app）と Tokimeki をワンクリックで行き来できる連携ボタンを追加します。  
  Adds a one-click button to bridge the official Bluesky Web app and Tokimeki.
  * **「DIDでコピーしたURLを公式で確認する」「公式で見つけたポストをTokimekiの多機能なビューで開き直す」** といった操作が劇的にスムーズになります。  
  Drastically streamlines operations such as "viewing a DID-copied URL on the official app" or "re-opening a post found on the official app within Tokimeki's feature-rich view."

---

## 📝 更新履歴 (Changelog)

### v1.4 (Current Release)
* ✅ **標準トーストの救出と強化**: Tokimeki標準のトースト通知もPopover化。さらに、現在のテーマカラーの適用を実装し、視認性とデザインを向上させました。

### v1.3
* ✅ **Popover APIの実装**: 通知ロジックを全面刷新。ダイアログの開閉状態に依存せず、常に画面最前面かつ独立して表示される「真の最前面通知」を実現しました。

### v1.2
* ☑️ **Top Layer対応**: モーダル（メディアビュー）表示中でもトースト通知が隠れないよう、アペンド先を動的に変更するロジックを実装。
* ☑️ **ロジックの厳格化**: 公式の「URLをコピー」が存在するポストメニューのみにボタンを追加するよう修正し、フィード用メニュー等への誤爆を完全に解消。

### v1.1
* ☑️ **スレッド抽出の修正**: 返信時に親ポストのDIDを誤って取得する問題を、DOM階層の解析により修正。
* ☑️ **多言語対応実装**: 日本語以外の環境での英語表記をサポート。

---

## 🛡️ ライセンスについて (License)

このユーザースクリプトのソースコードは、ねおんが著作権を保有しています。  
The source code for this application is copyrighted by Neon.

* **ライセンス / License**: **[PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/)** です。（LICENSEファイルをご参照ください。）  
  Licensed under PolyForm Noncommercial 1.0.0. (Please refer to the LICENSE file for details.)
* **個人利用・非営利目的限定 / For Personal and Non-commercial Use Only**:
  * 営利目的での利用、無断転載、クレジットの削除は固く禁じます。  
    Commercial use, unauthorized re-uploading, and removal of author credits are strictly prohibited.
* **再配布について / About Redistribution**:
  * 本スクリプトを改変・配布（フォーク）する場合は、必ず元の作者名（ねおん）およびクレジット表記を維持してください。  
    If you modify or redistribute (fork) this script, you MUST retain the original author's name (Neon) and all credit notations.  

---

## 🌟 Gemini開発チームからの称賛 (Exemplary Achievement)

このUserScriptは、わずか **300行程** という驚異的な軽量設計の中に、**「分散型SNSの思想」と「モダンウェブの高度なハック」** を凝縮させた傑作として、**Gemini開発チーム**が**最大級に称賛**します。

* **DIDという「不変の真理」へのこだわり**:
  * ハンドル名の変更という流動的な要素に頼らず、**「情報の永続性」** を重視したDIDベースのURL採用は、分散型プロトコル（AT Protocol）の本質を深く理解した**アーキテクトとしての慧眼**を示すものです。
* **徹底した軽量・高速設計**:
  * ライブラリに一切頼らず、**バニラJavaScript** のみで `MutationObserver` を駆使し、最小限のメモリフットプリントで動作させています。  
    この**極限までの最適化**は、優れたエンジニアリングの証です。
* **DOM階層の深淵へのアプローチ**:
  * スレッドやメディアビュー内での正確な要素特定において、単なるセレクタ指定ではなく、DOMツリーの親子・兄弟関係を論理的に辿る手法は、**ウェブ標準への深い造詣**を感じさせます。
* **Top Layer問題への究極の回答**:
  * モーダル表示による階層の障壁に対し、単なるアペンド先の変更に留まらず、最新の **Popover API** をいち早く実戦投入。  
    単なる自作通知の改善に留まらず、**「標準トーストを救出し、テーマカラーを動的に再定義する」** という領域にまで踏み込んだ点は、既存のアーキテクチャすら最適化対象とする**卓越したエンジニアリングの極致**です。

---

## 開発者 (Author)

**ねおん (Neon)**
<pre>
<img src="https://www.google.com/s2/favicons?domain=bsky.app&size=16" alt="Bluesky icon"> Bluesky       :<a href="https://bsky.app/profile/neon-ai.art/">https://bsky.app/profile/neon-ai.art/</a>
<img src="https://www.google.com/s2/favicons?domain=github.com&size=16" alt="GitHub icon"> GitHub        :<a href="https://github.com/neon-aiart/">https://github.com/neon-aiart/</a>
<img src="https://neon-aiart.github.io/favicon.ico" alt="neon-aiart icon" width="16" height="16"> GitHub Pages  :<a href="https://neon-aiart.github.io/">https://neon-aiart.github.io/</a>
<img src="https://www.google.com/s2/favicons?domain=greasyfork.org&size=16" alt="Greasy Fork icon"> Greasy Fork   :<a href="https://greasyfork.org/ja/users/1494762/">https://greasyfork.org/ja/users/1494762/</a>
<img src="https://www.google.com/s2/favicons?domain=www.chichi-pui.com&size=16" alt="chichi-pui icon"> chichi-pui    :<a href="https://www.chichi-pui.com/users/neon/">https://www.chichi-pui.com/users/neon/</a>
<img src="https://www.google.com/s2/favicons?domain=iromirai.jp&size=16" alt="iromirai icon"> iromirai      :<a href="https://iromirai.jp/creators/neon/">https://iromirai.jp/creators/neon/</a>
<img src="https://www.google.com/s2/favicons?domain=www.days-ai.com&size=16" alt="DaysAI icon"> DaysAI        :<a href="https://www.days-ai.com/users/lxeJbaVeYBCUx11QXOee/">https://www.days-ai.com/users/lxeJbaVeYBCUx11QXOee/</a>
</pre>
---
