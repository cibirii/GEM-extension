// ==UserScript==
// @name         Gemini_GEM_Access_Final_v2
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  极简悬浮窗：完美修复标题提取、完美隔离菜单，支持在二级菜单悬停显示 ❌ 一键移除自定义同步的 GEM
// @author       Your Name
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 1. 固定的内置基础数据
    const GEM_DATA = [
        {
            category: "艺术风格转换",
            items: [
                { id: "art_1", name: '拙稚手绘风格人物设定集', url: 'https://gemini.google.com/gem/e58eed81ca99', editUrl: 'https://gemini.google.com/gems/edit/e58eed81ca99' },
                { id: "art_2", name: '稚拙派人物设定集-仿超强真人设定GEM', url: 'https://gemini.google.com/gem/f4ba080b59a1', editUrl: 'https://gemini.google.com/gems/edit/f4ba080b59a1' },
                { id: "art_3", name: '万物手绘', url: 'https://gemini.google.com/gem/4ad79ac4f27e', editUrl: 'https://gemini.google.com/gems/edit/4ad79ac4f27e' },
                { id: "art_4", name: '图像风格分析GEM机', url: 'https://gemini.google.com/gem/45117de065dd', editUrl: 'https://gemini.google.com/gems/edit/45117de065dd' },
                { id: "art_5", name: '风格测试机', url: 'https://gemini.google.com/gem/441c3d3298b3', editUrl: 'https://gemini.google.com/gems/edit/441c3d3298b3' }
            ]
        },
        {
            category: "角色与潮玩设计",
            items: [
                { id: "toy_1", name: '荒诞角色 - 好故事', url: 'https://gemini.google.com/gem/1a8ac60f2d32', editUrl: 'https://gemini.google.com/gems/edit/1a8ac60f2d32' },
                { id: "toy_2", name: '艺术感角色卡-更动感-gpt2', url: 'https://gemini.google.com/gem/6776361891e5', editUrl: 'https://gemini.google.com/gems/edit/6776361891e5' },
                { id: "toy_3", name: '搪胶脸毛绒配件铸造炉-new', url: 'https://gemini.google.com/gem/2457e0344510', editUrl: 'https://gemini.google.com/gems/edit/2457e0344510' },
                { id: "toy_4", name: '随机扰动版：怪兽Prompt', url: 'https://gemini.google.com/gem/d48d9821b134', editUrl: 'https://gemini.google.com/gems/edit/d48d9821b134' },
                { id: "toy_5", name: '生成角色板-带骨架', url: 'https://gemini.google.com/gem/f9ab03efc87d', editUrl: 'https://gemini.google.com/gems/edit/f9ab03efc87d' },
                { id: "toy_6", name: '怪诞潮玩收藏家-上下文阻断', url: 'https://gemini.google.com/gem/ec0951ce9d10', editUrl: 'https://gemini.google.com/gems/edit/ec0951ce9d10' },
                { id: "toy_7", name: '顶级角色卡', url: 'https://gemini.google.com/gem/536f49b65f55', editUrl: 'https://gemini.google.com/gems/edit/536f49b65f55' },
                { id: "toy_8", name: '电影工业级真人角色全维设定集', url: 'https://gemini.google.com/gem/d46b904f47eb', editUrl: 'https://gemini.google.com/gems/edit/d46b904f47eb' },
                { id: "toy_9", name: '潮玩IP制造机', url: 'https://gemini.google.com/gem/88222da75f60', editUrl: 'https://gemini.google.com/gems/edit/88222da75f60' },
                { id: "toy_10", name: '并非千篇一律的角色-生成器-gpt2-牛！', url: 'https://gemini.google.com/gem/12105828a1bb', editUrl: 'https://gemini.google.com/gems/edit/12105828a1bb' },
                { id: "toy_11", name: 'IP角色节日场景GEM', url: 'https://gemini.google.com/gem/63464ac03a54', editUrl: 'https://gemini.google.com/gems/edit/63464ac03a54' },
                { id: "toy_12", name: '荒诞 9-Panel 视觉 关联但有趣', url: 'https://gemini.google.com/gem/03d9a39fdcaa', editUrl: 'https://gemini.google.com/gems/edit/03d9a39fdcaa' }
            ]
        },
        {
            category: "插画与设计",
            items: [
                { id: "design_1", name: '通用Knolling设计大师', url: 'https://gemini.google.com/gem/72a8f097a55c', editUrl: 'https://gemini.google.com/gems/edit/72a8f097a55c' },
                { id: "design_2", name: '品牌视觉LOGO-应用案例', url: 'https://gemini.google.com/gem/17093ebef222', editUrl: 'https://gemini.google.com/gems/edit/17093ebef222' },
                { id: "design_3", name: '包装设计三联', url: 'https://gemini.google.com/gem/561867ca74a2', editUrl: 'https://gemini.google.com/gems/edit/561867ca74a2' },
                { id: "design_4", name: 'Logo视觉灵感专家', url: 'https://gemini.google.com/gem/a18a3724f846', editUrl: 'https://gemini.google.com/gems/edit/a18a3724f846' }
            ]
        },
        {
            category: "其他",
            items: [
                { id: "other_1", name: '视觉资产拆解', url: 'https://gemini.google.com/gem/bd12362f9239', editUrl: 'https://gemini.google.com/gems/edit/bd12362f9239' },
                { id: "other_2", name: '视觉草图大师', url: 'https://gemini.google.com/gem/15807a597cf5', editUrl: 'https://gemini.google.com/gems/edit/15807a597cf5' }
            ]
        }
    ];

    // 获取动态添加的用户自定义 Gem 列表
    function getCustomGems() {
        try {
            return JSON.parse(localStorage.getItem('gem_custom_added') || '[]');
        } catch(e) { return []; }
    }

    // 移除指定的自定义同步 GEM
    function removeCustomGem(id) {
        let currentCustoms = getCustomGems();
        currentCustoms = currentCustoms.filter(item => item.id !== id);
        localStorage.setItem('gem_custom_added', JSON.stringify(currentCustoms));

        // 如果该项也在置顶中，同步在置顶中取消
        let pinned = getPinnedIds();
        if (pinned.includes(id)) {
            pinned = pinned.filter(pId => pId !== id);
            localStorage.setItem('gem_pinned_links', JSON.stringify(pinned));
        }

        // 让页面上对应的“同步至插件”按钮恢复可点状态
        const buttons = document.querySelectorAll('.gem-injected-sync-btn');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-custom-id') === id) {
                btn.style.background = '#1a73e8';
                btn.style.color = '#fff';
                btn.textContent = '➕ 同步至插件';
            }
        });

        refreshLayout();
    }

    // 组合全部数据（基础数据 + 自定义数据）
    function getFullGemData() {
        const dataCopy = JSON.parse(JSON.stringify(GEM_DATA));
        const customItems = getCustomGems();
        if (customItems.length > 0) {
            let targetCat = dataCopy.find(c => c.category === "其他") || dataCopy[dataCopy.length - 1];
            if (targetCat) {
                customItems.forEach(cItem => {
                    if (!targetCat.items.some(i => i.id === cItem.id)) {
                        // 标记它是个可以删除的自定义项
                        cItem.isCustom = true; 
                        targetCat.items.push(cItem);
                    }
                });
            }
        }
        return dataCopy;
    }

    // 从 localStorage 读取固定的置顶 GEM
    function getPinnedIds() {
        try {
            return JSON.parse(localStorage.getItem('gem_pinned_links') || '[]');
        } catch(e) { return []; }
    }

    function togglePin(id) {
        let pinned = getPinnedIds();
        if (pinned.includes(id)) {
            pinned = pinned.filter(pId => pId !== id);
        } else {
            pinned.push(id);
        }
        localStorage.setItem('gem_pinned_links', JSON.stringify(pinned));
        refreshLayout();
    }

    function refreshLayout() {
        const f = document.getElementById('gem-float'); if(f) f.remove();
        const s = document.getElementById('gem-sidebar-mod'); if(s) s.remove();
        const style = document.getElementById('gem-styles'); if(style) style.remove();
        injectAll(true);
    }

    function findItemById(id) {
        const allData = getFullGemData();
        for (let cat of allData) {
            let found = cat.items.find(i => i.id === id);
            if (found) return found;
        }
        return null;
    }

    // ================== 核心优化：完美解析真实标题 ==================
    function scanAndEnhanceMyGems() {
        if (!location.href.includes('/gems/view')) return;

        const gemLinks = document.querySelectorAll('a[href*="/gem/"]');
        
        gemLinks.forEach(link => {
            if (link.closest('#gem-float') || link.closest('#gem-sidebar-mod')) return;
            
            if (link.classList.contains('gem-processed')) return;
            link.classList.add('gem-processed');

            const href = link.getAttribute('href'); 
            const gemHash = href.split('/').pop();  
            if (!gemHash) return;

            // 💡【核心修正】：完美洗掉独立的首字和换行重复标题
            let gemName = "";
            let rawText = link.innerText.trim();

            if (rawText) {
                // 将文本按照换行、空格或制表符切散
                let tokens = rawText.split(/[\n\s\t]+/).map(t => t.trim()).filter(t => t.length > 0);
                
                if (tokens.length >= 2) {
                    // 核心逻辑：如果前两个词相同，或者第一个词是第二个词的开头单字（官方头像字特性）
                    if (tokens[0] === tokens[1] || tokens[1].startsWith(tokens[0])) {
                        // 直接舍弃掉第一个“伪首字头像”，从第二个开始重新拼接
                        gemName = tokens.slice(1).join(" ");
                    } else {
                        gemName = tokens.join(" ");
                    }
                } else {
                    gemName = tokens[0] || "未命名 Gem";
                }
            }

            // 二级清洗：防止有些文本结构里标题本身后面被拼上了大量长介绍摘要
            if (gemName.length > 40) {
                 gemName = gemName.substring(0, 35) + "...";
            }

            const fullUrl = `https://gemini.google.com/gem/${gemHash}`;
            const editUrl = `https://gemini.google.com/gems/edit/${gemHash}`;
            const customId = `custom_${gemHash}`;

            const rowContainer = link.closest('.gem-s-item-row, mat-list-item, [role="listitem"]') || link.parentElement;
            if (!rowContainer) return;

            const customGems = getCustomGems();
            const isAlreadyAdded = customGems.some(item => item.id === customId);

            const syncBtn = document.createElement('button');
            syncBtn.className = 'gem-injected-sync-btn'; 
            syncBtn.setAttribute('data-custom-id', customId); // 绑定ID便于后续状态联动恢复
            syncBtn.style.cssText = `
                margin-left: 15px;
                padding: 4px 10px;
                font-size: 12px;
                border-radius: 12px;
                border: 1px solid #1a73e8;
                background: ${isAlreadyAdded ? '#e8f0fe' : '#1a73e8'};
                color: ${isAlreadyAdded ? '#1a73e8' : '#fff'};
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
                z-index: 10;
                white-space: nowrap;
            `;
            syncBtn.textContent = isAlreadyAdded ? '✓ 已同步至插件' : '➕ 同步至插件';

            syncBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let currentCustoms = getCustomGems();
                const exists = currentCustoms.some(item => item.id === customId);

                if (!exists) {
                    currentCustoms.push({
                        id: customId,
                        name: gemName,
                        url: fullUrl,
                        editUrl: editUrl
                    });
                    localStorage.setItem('gem_custom_added', JSON.stringify(currentCustoms));
                    syncBtn.style.background = '#e8f0fe';
                    syncBtn.style.color = '#1a73e8';
                    syncBtn.textContent = '✓ 已同步至插件';
                    
                    refreshLayout();
                }
            });

            const actionZone = rowContainer.querySelector('.gem-action-group, [share], button[mat-icon-button]:last-child') || link;
            if (actionZone && actionZone !== link) {
                actionZone.parentNode.insertBefore(syncBtn, actionZone);
            } else {
                rowContainer.appendChild(syncBtn);
            }
        });
    }

    // ================== 界面渲染与注入 ==================
    function injectAll(forceShowMenu = false) {
        if (document.getElementById('gem-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'gem-styles';
        style.textContent = `
            #gem-float { position: fixed!important; top: 15px!important; right: 200px!important; z-index: 999999!important; padding-bottom: 20px!important; font-family: sans-serif; }
            .gem-f-btn { background: #1a73e8; color: #fff; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: 500; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
            .gem-f-menu { display: none; position: absolute; top: 35px; right: 0; background: #fff; min-width: 160px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; padding: 6px 0; border: 1px solid #dadce0; }
            #gem-float:hover .gem-f-menu, .gem-f-menu.gem-force-show { display: block!important; }
            .gem-f-category-node, .gem-f-direct-item { position: relative; padding: 8px 16px; color: #3c4043; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; text-decoration: none; }
            .gem-f-category-node:hover, .gem-f-direct-item:hover { background: #f1f3f4; color: #1a73e8; }
            .gem-f-category-node::after { content: "▶"; font-size: 9px; color: #80868b; margin-left: 8px; }
            .gem-sub-menu { display: none; position: absolute; top: -6px; right: 100%; background: #fff; min-width: 280px; max-height: 450px; overflow-y: auto; box-shadow: -4px 4px 12px rgba(0,0,0,0.15); border-radius: 8px; padding: 6px 0; border: 1px solid #dadce0; z-index: 100000; }
            .gem-f-category-node:hover .gem-sub-menu { display: block!important; }
            .gem-item-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 14px; position: relative; }
            .gem-item-row:hover { background: #f1f3f4; }
            .gem-f-item { text-decoration: none; color: #3c4043; font-size: 13px; flex-grow: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-right: 6px; }
            .gem-f-item:hover { color: #1a73e8; }
            .gem-action-group { display: flex; align-items: center; gap: 4px; }
            .gem-edit-link { text-decoration: none; color: #5f6368; font-size: 11px; padding: 2px 4px; border-radius: 4px; border: 1px solid #dadce0; white-space: nowrap; }
            .gem-edit-link:hover { background: #e8f0fe; color: #1a73e8; border-color: #d2e3fc; }
            
            /* ❌ 删除按钮样式与鼠标移入显示动画 */
            .gem-delete-btn { display: none; cursor: pointer; font-size: 11px; color: #d93025; background: #fce8e6; padding: 2px 6px; border-radius: 4px; border: 1px solid #fad2cf; font-weight: bold; margin-left: 2px; }
            .gem-delete-btn:hover { background: #a51d24; color: #fff; border-color: #a51d24; }
            .gem-item-row:hover .gem-delete-btn { display: inline-block!important; }

            .gem-pin-btn { cursor: pointer; font-size: 12px; filter: grayscale(100%); opacity: 0.5; transition: all 0.2s; padding: 2px; }
            .gem-pin-btn:hover, .gem-pin-btn.is-pinned { filter: grayscale(0%); opacity: 1; font-size: 13px; }
            .gem-divider { border-top: 1px solid #e8eaed; margin: 4px 0; }
            .gem-s-container { margin-bottom: 12px; }
            .gem-s-head { padding: 12px 24px 8px; font-size: 12px; font-weight: 700; color: #5f6368; text-transform: uppercase; letter-spacing: .8px; font-family: 'Google Sans', Arial, sans-serif; }
            .gem-s-item-row { display: flex; align-items: center; justify-content: space-between; padding-right: 12px; border-radius: 0 20px 20px 0; }
            .gem-s-item-row:hover { background: #f1f3f4; }
            .gem-s-item { padding: 8px 12px 8px 24px; color: #3c4043; text-decoration: none; font-size: 13px; display: flex; align-items: center; flex-grow: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-family: 'Google Sans', Arial, sans-serif; }
            .gem-s-item:hover { color: #1a73e8; }
            .gem-s-ico { margin-right: 8px; font-size: 14px; flex-shrink: 0; }
            .gem-s-txt { text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
        `;
        document.head.appendChild(style);

        const pinnedIds = getPinnedIds();
        const fullDataSource = getFullGemData(); 

        if (!document.getElementById('gem-float')) {
            const f = document.createElement('div');
            f.id = 'gem-float';
            
            const b = document.createElement('div');
            b.className = 'gem-f-btn';
            b.textContent = '💎 GEM';
            
            const m = document.createElement('div');
            m.className = 'gem-f-menu';
            if (forceShowMenu) m.classList.add('gem-force-show');

            f.addEventListener('mouseleave', () => m.classList.remove('gem-force-show'));
            
            const newDirect = document.createElement('a');
            newDirect.className = 'gem-f-direct-item';
            newDirect.style.fontWeight = 'bold';
            newDirect.textContent = '➕ New GEM';
            newDirect.href = 'https://gemini.google.com/gems/create';
            newDirect.target = '_blank';
            m.appendChild(newDirect);

            if (pinnedIds.length > 0) {
                const div = document.createElement('div');
                div.className = 'gem-divider';
                m.appendChild(div);

                pinnedIds.forEach(pId => {
                    const item = findItemById(pId);
                    if (item) {
                        const pinRow = document.createElement('div');
                        pinRow.className = 'gem-item-row';
                        
                        const pA = document.createElement('a');
                        pA.href = item.url;
                        pA.target = '_blank';
                        pA.className = 'gem-f-item';
                        pA.title = item.name;
                        pA.style.fontWeight = '500';
                        pA.textContent = '📌 ' + item.name;

                        const ag = document.createElement('div');
                        ag.className = 'gem-action-group';

                        const pEdit = document.createElement('a');
                        pEdit.href = item.editUrl;
                        pEdit.target = '_blank';
                        pEdit.className = 'gem-edit-link';
                        pEdit.textContent = '✎';

                        const pUnpin = document.createElement('span');
                        pUnpin.className = 'gem-pin-btn is-pinned';
                        pUnpin.textContent = '📌';
                        pUnpin.onclick = (e) => { e.preventDefault(); e.stopPropagation(); togglePin(item.id); };

                        ag.appendChild(pEdit);
                        ag.appendChild(pUnpin);
                        pinRow.appendChild(pA);
                        pinRow.appendChild(ag);
                        m.appendChild(pinRow);
                    }
                });
            }

            const div2 = document.createElement('div');
            div2.className = 'gem-divider';
            m.appendChild(div2);

            fullDataSource.forEach(cat => {
                const catNode = document.createElement('div');
                catNode.className = 'gem-f-category-node';
                catNode.textContent = cat.category;

                const subM = document.createElement('div');
                subM.className = 'gem-sub-menu';

                cat.items.forEach(l => {
                    const row = document.createElement('div');
                    row.className = 'gem-item-row';
                    
                    const a = document.createElement('a');
                    a.href = l.url;
                    a.target = '_blank';
                    a.className = 'gem-f-item';
                    a.textContent = l.name;
                    a.title = l.name;
                    
                    const actionGroup = document.createElement('div');
                    actionGroup.className = 'gem-action-group';

                    const editA = document.createElement('a');
                    editA.href = l.editUrl;
                    editA.target = '_blank';
                    editA.className = 'gem-edit-link';
                    editA.textContent = '✎ 编辑';
                    
                    const pinBtn = document.createElement('span');
                    pinBtn.className = 'gem-pin-btn' + (pinnedIds.includes(l.id) ? ' is-pinned' : '');
                    pinBtn.textContent = '📌';
                    pinBtn.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        togglePin(l.id);
                    };

                    actionGroup.appendChild(editA);
                    actionGroup.appendChild(pinBtn);

                    // 💡【新需求功能】：如果是自定义同步进来的项目，追加 ❌ 移除按钮
                    if (l.isCustom) {
                        const delBtn = document.createElement('span');
                        delBtn.className = 'gem-delete-btn';
                        delBtn.textContent = '✕';
                        delBtn.title = '从插件中移除此条同步';
                        delBtn.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm(`确定要从插件中移除“${l.name}”吗？`)) {
                                removeCustomGem(l.id);
                            }
                        };
                        actionGroup.appendChild(delBtn);
                    }

                    row.appendChild(a);
                    row.appendChild(actionGroup);
                    subM.appendChild(row);
                });

                catNode.appendChild(subM);
                m.appendChild(catNode);
            });
            
            f.appendChild(b);
            f.appendChild(m);
            document.body.appendChild(f);
        }

        if (!document.getElementById('gem-sidebar-mod')) {
            const nbLink = document.querySelector('a[href*="/notebooks/view"]');
            if (nbLink) {
                const targetContainer = nbLink.closest('gem-nav-list-item');
                if (targetContainer) {
                    const s = document.createElement('div');
                    s.id = 'gem-sidebar-mod';
                    s.className = 'gem-s-container';
                    
                    const h = document.createElement('div');
                    h.className = 'gem-s-head';
                    h.textContent = 'Pinned GEMs';
                    s.appendChild(h);
                    
                    if (pinnedIds.length === 0) {
                        const tip = document.createElement('div');
                        tip.style = 'padding: 4px 24px; font-size:12px; color:#aaaeB3; font-style:italic;';
                        tip.textContent = '暂无置顶，请在右上方💎GEM菜单中勾选📌';
                        s.appendChild(tip);
                    } else {
                        pinnedIds.forEach(pId => {
                            const l = findItemById(pId);
                            if (l) {
                                const sRow = document.createElement('div');
                                sRow.className = 'gem-s-item-row';

                                const a = document.createElement('a');
                                a.href = l.url;
                                a.target = '_blank';
                                a.className = 'gem-s-item';
                                a.title = l.name;

                                const icoSpan = document.createElement('span');
                                icoSpan.className = 'gem-s-ico';
                                icoSpan.textContent = '📌';
                                
                                const txtSpan = document.createElement('span');
                                txtSpan.className = 'gem-s-txt';
                                txtSpan.textContent = l.name;

                                a.appendChild(icoSpan);
                                a.appendChild(txtSpan);

                                const editA = document.createElement('a');
                                editA.href = l.editUrl;
                                editA.target = '_blank';
                                editA.className = 'gem-edit-link';
                                editA.textContent = '改';
                                editA.onclick = (e) => e.stopPropagation();

                                sRow.appendChild(a);
                                sRow.appendChild(editA);
                                s.appendChild(sRow);
                            }
                        });
                    }
                    
                    targetContainer.parentNode.insertBefore(s, targetContainer);
                }
            }
        }
    }

    const obs = new MutationObserver(() => {
        injectAll();
        scanAndEnhanceMyGems();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    
    injectAll();
    scanAndEnhanceMyGems();
})();