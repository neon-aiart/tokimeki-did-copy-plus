// ==UserScript==
// @name           Tokimeki DID Copy Plus
// @namespace      https://bsky.app/profile/neon-ai.art
// @homepage       https://neon-aiart.github.io/
// @icon           data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌈</text></svg>
// @version        1.5
// @description    Adds "Copy URL with DID" to the post menu on TOKIMEKI(Bluesky client).
// @description:ja TOKIMEKIのポストのメニューに「DIDでURLをコピー」を追加
// @author         ねおん
// @match          https://tokimeki.blue/*
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @license        PolyForm Noncommercial 1.0.0; https://polyformproject.org/licenses/noncommercial/1.0.0/
// ==/UserScript==

/**
 * ==============================================================================
 * IMPORTANT NOTICE / 重要事項
 * ==============================================================================
 * Copyright (c) 2025 ねおん (Neon)
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * * [JP] 本スクリプトは個人利用・非営利目的でのみ使用・改変が許可されます。
 * 無断転載、作者名の書き換え、およびクレジットの削除は固く禁じます。
 * 本スクリプトを改変・配布（フォーク）する場合は、必ず元の作者名（ねおん）
 * およびこのクレジット表記を維持してください。
 * * [EN] This script is licensed for personal and non-commercial use only.
 * Unauthorized re-uploading, modification of authorship, or removal of
 * author credits is strictly prohibited. If you fork this project, you MUST
 * retain the original credits and authorship.
 * ==============================================================================
 */

(function() {
    'use strict';

    const VERSION = '1.5';
    const STORE_KEY = 'tokimeki_copy_plus';
    let toastTimeoutId = null;
    const STANDARD_TOAST_POPOVER = true;    // Tokimeki標準トースト(Sonner)をPopover化
    const STANDARD_TOAST_THEMECOLOR = true; // Tokimeki標準トーストにテーマの色の適用

    // ========= グローバル変数 =========
    // ① メニュー要素のセレクタ
    const MENU_SELECTOR = 'dialog.timeline-menu';
    // ② 投稿要素のコンテナセレクタ
    const POST_CONTAINER_SELECTOR = 'article.timeline__item';
    // ③ メニューリスト要素: 新しいボタンを挿入するUL要素
    const MENU_LIST_SELECTOR = 'ul.timeline-menu-list';
    // ④ 独自のボタンを識別するためのクラス
    const CUSTOM_BUTTON_CLASS = 'did-copy-button';
    // ⑤ 既存のメニューボタンクラス（スタイル合わせ用）
    const BASE_BUTTON_CLASS = 'timeline-menu-list__button';
    // 赤色とホバーのスタイルを持つクラス
    const DANGER_COLOR_CLASS = 'timeline-menu-list__item--delete';

    // ========= 設定 =========

    const COPY_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
    `;

    // スタイル定義（GM_addStyle）
    GM_addStyle(`
        /* Font Awesome 6 Free */
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        /* Google Material Symbols & Icons (Rounded) */
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        /* Lucide Icons */
        @import url('https://cdn.jsdelivr.net/npm/lucide-static/icons/link.svg');

        /* アイコンのstrokeを直接赤色（var(--danger-color)）に固定 */
        li.${CUSTOM_BUTTON_CLASS}-li.${DANGER_COLOR_CLASS} button.${CUSTOM_BUTTON_CLASS} svg {
            stroke: var(--danger-color) !important;
        }

        /* popoverのデフォルトスタイル */
        .tcp-toast-mei[popover] {
            border: none;
            overflow: visible;
            background: none;
            margin: 0 auto;
            padding: 0;
            color: inherit;
            width: fit-content;
            height: 24px;
        }
    `);

    // 言語判定
    const getI18n = () => {
        const isJapanese = document.documentElement.lang === 'ja';
        return {
            buttonLabel: isJapanese ? 'DIDでURLをコピー' : 'Copy DID-based URL',
            successMsg: isJapanese ? 'DIDベースのURLをコピーしました！' : 'DID-based URL copied!',
            errorMsg: isJapanese ? 'コピーに失敗しました。' : 'Failed to copy URL.',
        };
    };

    // ========= トーストメッセージ =========
    function showToast(msg, isSuccess) {
        const toastId = 'tcp-toast-mei';
        console.log(`[TOAST] ${msg}`);

        if (toastTimeoutId) {
            clearTimeout(toastTimeoutId);
            toastTimeoutId = null;
        }

        const existingToast = document.getElementById(toastId);
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.id = toastId;
        toast.classList.add('tcp-toast-mei');

        // 魔法の属性: Chrome/Edge/Safari/Firefox(最新) 対応
        if (toast.showPopover) {
            toast.setAttribute('popover', 'manual');
        }

        let bgColor = isSuccess
            ? '#007bff'
            : isSuccess === false
                ? '#dc3545'
                : '#6c757d';

        toast.style.cssText = `
            position: fixed;
            /* 1. ブラウザのデフォルト位置をリセット */
            top: auto; right: auto; bottom: 0; left: 50%;
            margin: 0;
            /* 2. トーストとしての見た目: フェード前は y=0 */
            transform: translate(-50%, 0);
            background: ${bgColor}; color: white; padding: 4px 20px;
            border-radius: 14px; height: 24px; font-size: 14px;
            transition: opacity 1.0s ease, transform 1.0s ease; opacity: 0;
            display: flex;           /* Flexbox有効化 */
            align-items: center;     /* 垂直方向の中央揃え */
            justify-content: center; /* 水平方向の中央揃え */
            pointer-events: none;    /* トーストがクリックを邪魔しないように */
            white-space: nowrap;     /* 折り返し防止 */
            /* 3. popover特有のスタイルを強制リセット */
            border: none;
            box-sizing: border-box;
        `;

        // 常に body に追加（dialogを閉じても道連れにされない）
        document.body.appendChild(toast);

        // popoverとして表示
        if (toast.showPopover) {
            toast.showPopover();
        }
        // フェードインアニメーション
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, -16px)';
        }, 10);

        // 自動非表示
        if (isSuccess !== null) {
            toastTimeoutId = setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translate(-50%, 0)';
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        toast.remove();
                    }
                    toastTimeoutId = null;
                }, 1000);
            }, 3000);
        }
    }

    // ====================================
    // ユーティリティ関数
    // ====================================

    // AT URIをBlueskyの永続URLに変換
    function atUriToUrl(atUri) {
        if (!atUri || !atUri.startsWith('at://')) {
            return null;
        }

        // at://did:plc:xxxx/app.bsky.feed.post/rkey の形式を想定
        const parts = atUri.replace('at://', '').split('/');
        if (parts.length !== 3 || parts[1] !== 'app.bsky.feed.post') {
            return null;
        }

        // Bluesky公式クライアントのURL形式
        return `https://bsky.app/profile/${parts[0]}/post/${parts[2]}`;
    }

    // ====================================
    // メインロジック
    // ====================================

    function addCopyIconToMenu(menuDialog) {
        // メニューリスト要素を取得
        const menuList = menuDialog.querySelector(MENU_LIST_SELECTOR);
        // 既にアイコンが追加されていないかチェック
        if (!menuList || menuList.querySelector(`.${CUSTOM_BUTTON_CLASS}`)) {
            return;
        }

        const copyUrlLi = menuList.querySelector('.timeline-menu-list__item--copy-url');
        if (!copyUrlLi) {
            return;
        } // URLコピー項目がないメニューには追加しない

        // 投稿コンテナから atUri を取得
        const postContainer = menuDialog.closest(POST_CONTAINER_SELECTOR);
        if (!postContainer) {
            return;
        }

        // メニューの直近の content またはコンテナ内の最後の content を取得
        const contents = Array.from(postContainer.querySelectorAll('div.timeline__content[data-aturi]'));
        const atUri = contents.length > 0 ? contents[contents.length - 1].dataset.aturi : null;
        if (!atUri) {
            return;
        }

        const urlToCopy = atUriToUrl(atUri);

        // 最新の言語設定を取得
        const i18n = getI18n();

        // 既存のメニュー項目からスタイルを継承するためのLi要素を取得
        const existingItemLi = menuList.querySelector('li.timeline-menu-list__item');

        // 新しいメニュー項目 (<li>) を作成
        const newLi = document.createElement('li');
        newLi.className = (existingItemLi ? existingItemLi.className : 'timeline-menu-list__item') + ` ${CUSTOM_BUTTON_CLASS}-li ${DANGER_COLOR_CLASS}`;

        // ボタンの作成
        const newButton = document.createElement('button');
        newButton.className = `${BASE_BUTTON_CLASS} ${CUSTOM_BUTTON_CLASS}`;
        newButton.setAttribute('role', 'menuitem');

        // アイコンとテキスト
        newButton.innerHTML = `${COPY_SVG}<span class="text-danger">${i18n.buttonLabel}</span>`;

        newLi.appendChild(newButton);

        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            navigator.clipboard.writeText(urlToCopy)
                .then(() => {
                    showToast(i18n.successMsg, true);
                })
                .catch(err => {
                    showToast(i18n.errorMsg, false);
                });

            // メニューを閉じる
            menuDialog.remove();
        });

        // ターゲット項目の直後に挿入
        menuList.insertBefore(newLi, copyUrlLi.nextSibling);
    }

    // MutationObserver
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) {
                        continue;
                    } // 要素ノードでない場合はスキップ

                    // --- Tokimeki標準トースト(Sonner)をPopover化 ---

                    // セクションまたはol自体がSonner関連かチェック
                    const standardToast = node.closest('[data-sonner-toaster="true"]') ||
                                        (node.dataset && node.dataset.sonnerToaster === "true" ? node : null) ||
                                        node.querySelector('[data-sonner-toaster="true"]');

                    if (STANDARD_TOAST_POPOVER && standardToast && standardToast.showPopover && !standardToast.hasAttribute('popover')) {
                        // 1. Popover属性を付与してTop Layerへ飛ばす
                        standardToast.setAttribute('popover', 'manual');

                        // 2. スタイル調整
                        standardToast.style.position = 'fixed';
                        standardToast.style.background = 'none';
                        standardToast.style.border = 'none';
                        standardToast.style.height = '100%'; // 中身が見えるように全画面化
                        standardToast.style.pointerEvents = 'none';

                        // 3. テーマ適用（クラスではなく「色」を直接継承させる）
                        const appEl = document.querySelector('.app');
                        if (STANDARD_TOAST_THEMECOLOR && appEl) {
                            const style = getComputedStyle(appEl);
                            // Tokimekiの背景色と文字色の変数を取得
                            const bgColor = style.getPropertyValue('--bg-color-1') || 'var(--bg-color-1)';
                            const textColor = style.getPropertyValue('--primary-color') || 'var(--primary-color)';

                            // トーストの中身（li）に直接色を流し込む
                            const toastLi = standardToast.querySelector('li');
                            if (toastLi) {
                                toastLi.style.setProperty('background', bgColor, 'important');
                                toastLi.style.setProperty('color', textColor, 'important');
                                toastLi.style.setProperty('border', '2px solid var(--border-color-1)', 'important');
                            }
                        }

                        // 4. 表示開始
                        standardToast.showPopover();
                        // console.log('[TCP] Tokimeki Standard Toast rescued to Top Layer!');
                    }

                    /* --- [DEBUG] Tokimeki標準トーストの捕獲ロジック ---
                    // セクション「svelte-nbs0zk」または「aria-label="Notifications..."」を探す
                    const toastContainer = node.closest('.svelte-nbs0zk') || node.querySelector('.svelte-nbs0zk');

                    // 追加されたノード自体が ol か、中に ol を含んでいるかチェック
                    const toastOl = node.matches('ol') ? node : node.querySelector('ol');

                    if (toastOl) {
                        console.log('--- [DEBUG] Tokimeki Standard Toast Detected! ---');
                        console.log('Outer HTML:', toastOl.outerHTML);
                        console.log('Child Nodes:', toastOl.innerHTML);
                        console.dir(toastOl); // さらに詳細を見たい場合はこれ
                    }
                    */

                    // メニュー要素を特定
                    const menu = node.matches(MENU_SELECTOR) ? node : node.querySelector(MENU_SELECTOR);
                    if (menu) {
                        addCopyIconToMenu(menu);
                    }
                }
            }
        }
    });

    // 監視を開始
    observer.observe(document.body, { childList: true, subtree: true, });

    // GM_registerMenuCommand('キー設定', openSettings);

})();
