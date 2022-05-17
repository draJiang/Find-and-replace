/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />
let target_Text_Node = []; // 存储符合搜索条件的 TEXT 图层
let loaded_fonts = []; // 已加载的字体列表
let fileType = figma.editorType; // 当前 figma 文件类型：figma/figjam
let hasMissingFontCount = 0; // 替换时记录不支持字体的数量
let seting_Aa = false; // 是否区分大小写
let find_all = false; // 是否搜索整个文档
let req_cout = 0; // 搜索结果数量
let node_list = []; // 存储所有 TEXT 图层
let currentPage = figma.currentPage; // 存储当前页面
//@ts-ignore
figma.skipInvisibleInstanceChildren = true; // 忽略隐藏的图层
console.log('2022-05-12 12:28');
// 启动插件时显示 UI
//@ts-ignore
figma.showUI(__html__, { themeColors: true, width: 300, height: 400 });
// 获取是否选中图层
onSelectionChange();
// 绑定 Figma 图层选择变化事件
figma.on("selectionchange", () => { onSelectionChange(); });
// 选中的页面发生变化
figma.on("currentpagechange", () => {
    onCurrentpagechange();
});
// UI 发来消息
figma.ui.onmessage = msg => {
    // UI 中点击了「搜索」按钮
    if (msg.type === 'search') {
        console.log('search');
        // 记录运行时长
        let start = new Date().getTime();
        let find_start = new Date().getTime();
        // 执行搜索
        find(msg.data);
        let done = new Date().getTime();
        console.log('》》》》》》》》》》find:' + (done - find_start).toString());
        let toHTML; // 存储要发给 ui.tsx 的数据
        setTimeout(() => {
            let findKeyWord_start = new Date().getTime();
            // 在文本图层中匹配包含关键字的图层
            toHTML = findKeyWord(node_list, msg.data.keyword);
            let findKeyWord_end = new Date().getTime();
            console.log('》》》》》》》》》》findKeyWord:' + (findKeyWord_end - findKeyWord_start).toString());
        }, 20);
        setTimeout(() => {
            setTimeout(() => {
                // 将搜索数据发送给 ui.tsx
                figma.ui.postMessage({ 'type': 'find', 'done': true, 'target_Text_Node': toHTML });
                console.log('Find end,count:');
                console.log(req_cout);
                // figma.ui.postMessage({ 'type': 'done' })
                let end = new Date().getTime();
                console.log('》》》》》》》》》》' + msg.data.keyword + ':' + (end - start).toString() + ' count:' + req_cout.toString());
                if (req_cout > 30) {
                    figma.ui.resize(300, 540);
                }
            }, 30);
        }, 40);
    }
    // UI 中点击搜索结果项
    if (msg.type === 'listOnClik') {
        let msg_data = msg['data'];
        let targetNode;
        // 搜索结果是否在当前页面
        let click_obj_target_page_id = msg_data['page'];
        if (currentPage['id'] != click_obj_target_page_id) {
            // 点击对象不在当前页面，跳转到对应页面
            let document_children = figma.root.children;
            let document_children_length = document_children.length;
            for (let index = document_children_length - 1; index > -1; index--) {
                if (document_children[index]['id'] == click_obj_target_page_id) {
                    figma.currentPage = document_children[index];
                    break;
                }
            }
        }
        // 遍历搜索结果
        let len = target_Text_Node.length;
        for (let i = len - 1; i > -1; i--) {
            if (target_Text_Node[i]['node'].id == msg_data['item']) {
                // 找到用户点击的图层
                targetNode = target_Text_Node[i]['node'];
                // Figma 视图定位到对应图层
                figma.viewport.scrollAndZoomIntoView([targetNode]);
                // Figma 选中对应文本
                figma.currentPage.selectedTextRange = { 'node': targetNode, 'start': msg_data['start'], 'end': msg_data['end'] };
                break;
            }
        }
    }
    // UI 中点击了「替换」按钮
    if (msg.type === 'replace') {
        console.log('code.ts replace');
        // 执行替换
        replace(msg).then(() => {
            setTimeout(() => {
                console.log('code.ts replace done');
                // 替换完毕，通知 UI 更新
                // figma.ui.postMessage({ 'type': 'replace', 'done': true, 'hasMissingFontCount': hasMissingFontCount });
            }, 100);
        });
    }
    // UI 中进行搜索设置
    if (msg.type === 'handle_seting_click') {
        switch (msg['data']['type']) {
            case 'seting_Aa':
                seting_Aa = msg['data']['data']['checked'];
                break;
            case 'find_all':
                find_all = msg['data']['data']['checked'];
                break;
            default:
                break;
        }
    }
};
// 加载字体
function myLoadFontAsync(text_layer_List) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('myLoadFontAsync:');
        // console.log(text_layer_List);
        for (let layer of text_layer_List) {
            if (layer['node']['characters'].length == 0) {
                continue;
            }
            // console.log('----------');
            // 加载字体
            // console.log(layer);
            let fonts = layer['node'].getRangeAllFontNames(0, layer['node']['characters'].length);
            // console.log('fonts:');
            // console.log(fonts);
            for (let font of fonts) {
                let bingo = false;
                for (let loaded_font of loaded_fonts) {
                    if (loaded_font['family'] == font['family'] && loaded_font['style'] == font['style']) {
                        bingo = true;
                        break;
                    }
                }
                // console.log(bingo);
                if (bingo) {
                    continue;
                }
                else {
                    // 字体是否支持
                    if (layer['node'].hasMissingFont) {
                        // 不支持
                        console.log('hasMissingFont');
                    }
                    else {
                        // 支持
                        loaded_fonts.push(font);
                        console.log('loadFontAsync');
                        yield figma.loadFontAsync(font);
                    }
                }
            }
        }
        // console.log(myFont);
        // await figma.loadFontAsync(myFont)
        return 'done';
    });
}
// 找出所有文本图层
function find(data) {
    console.log('conde.ts:find:');
    // console.log(figma.currentPage);
    // 清空历史搜索数据，重新搜索
    target_Text_Node = [];
    if (find_all) {
        //搜索整个文档
        //@ts-ignore
        let selection = figma.root.children;
        node_list = []; // 存储所有 TEXT 图层
        let node_list_temp;
        let json_data_temp;
        let len = selection.length;
        for (let i = 0; i < len; i++) {
            node_list_temp = [];
            setTimeout(() => {
                // 如果图层下没有子图层
                //@ts-ignore
                if (selection[i].children == undefined) {
                }
                else {
                    // 获取文本图层
                    //@ts-ignore
                    node_list_temp = selection[i].findAllWithCriteria({ types: ['TEXT'] });
                    json_data_temp = { 'page': selection[i]['name'], 'page_id': selection[i]['id'], 'node_list': node_list_temp };
                    node_list.push(json_data_temp);
                }
            }, 10);
        }
    }
    else {
        // 当前选中的图层
        let selection = figma.currentPage.selection;
        // 当前未选中图层，则在当前页面搜索
        if (selection.length == 0) {
            selection = figma.currentPage.children;
        }
        else {
            // 当前有选中图层，则在选中的图层中搜索
            // 在当前选中的图层中，搜索文本图层
        }
        node_list = []; // 存储所有 TEXT 图层
        // let children_list = []    // 拆分图层，逐个搜索，避免界面长时间挂起
        let len = selection.length;
        let node_list_temp = [];
        let json_data_temp;
        // 遍历范围内的图层，获取 TEXT 图层
        //@ts-ignore
        figma.skipInvisibleInstanceChildren = true; // 忽略隐藏的图层
        for (let i = 0; i < len; i++) {
            setTimeout(() => {
                // 如果图层本身就是文本图层
                if (selection[i].type == 'TEXT') {
                    node_list_temp.push(selection[i]);
                }
                else {
                    // 如果图层下没有子图层
                    //@ts-ignore
                    if (selection[i].children == undefined) {
                    }
                    else {
                        // 获取文本图层
                        //@ts-ignore
                        node_list_temp = node_list_temp.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }));
                    }
                }
                node_list = [{ 'page': figma.currentPage['name'], 'page_id': figma.currentPage['id'], 'node_list': node_list_temp }];
            }, 10);
        }
    }
    // return node_list
}
// 搜索：在文本图层中，匹配关键字
function findKeyWord(node_list, keyword) {
    console.log('func findKeyWord begin');
    req_cout = 0; // 搜索结果数量
    let data_item_list = [];
    let data_temp;
    let node; // 记录遍历到的图层
    let len = node_list.length;
    let my_progress = 0; // 进度信息
    // 忽略大小写
    if (seting_Aa != true) {
        keyword = keyword.toLowerCase();
    }
    // console.log('keyword:');
    // console.log(keyword);
    let node_len_sum = 0;
    node_list.forEach(item => {
        node_len_sum += item['node_list'].length;
    });
    for (let i = 0; i < len; i++) {
        let list_length = node_list[i]['node_list'].length;
        for (let j = 0; j < list_length; j++) {
            setTimeout(() => {
                my_progress++;
                figma.ui.postMessage({ 'type': 'find', 'done': false, 'my_progress': { 'index': my_progress, 'total': node_len_sum } });
                node = node_list[i]['node_list'][j];
                let node_characters;
                // 忽略大小写
                if (seting_Aa != true) {
                    node_characters = node['characters'].toLowerCase();
                }
                else {
                    node_characters = node['characters'];
                }
                if (node_characters.indexOf(keyword) > -1) {
                    // 找到关键词(忽略大小写)
                    // 判断祖先图层的状态，包括隐藏、锁定、组件、实例属性
                    let this_parent;
                    let ancestor_isVisible = true;
                    let ancestor_isLocked = false;
                    let ancestor_type = ''; // 组件/实例/其他
                    if (node.locked == true) {
                        ancestor_isLocked = true;
                    }
                    if (node.visible == false) {
                        ancestor_isVisible = false;
                    }
                    if (ancestor_isVisible == false || ancestor_isLocked == true) {
                        // 如果图层本身就是锁定或隐藏状态
                    }
                    else {
                        // 获取祖先元素的状态
                        this_parent = node.parent;
                        while (this_parent.type != 'PAGE') {
                            if (this_parent.locked == true) {
                                ancestor_isLocked = true;
                            }
                            if (this_parent.visible == false) {
                                ancestor_isVisible = false;
                            }
                            if (this_parent.type == 'COMPONENT') {
                                ancestor_type = 'COMPONENT';
                            }
                            if (this_parent.type == 'INSTANCE') {
                                ancestor_type = 'INSTANCE';
                            }
                            if ((ancestor_isVisible == false || ancestor_isLocked == true) && ancestor_type != '') {
                                break;
                            }
                            else {
                                this_parent = this_parent.parent;
                            }
                        }
                    }
                    // 单个图层的数据，存储到 target_Text_Node 中，拥有后续的替换工作
                    target_Text_Node.push({ 'node': node, 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked, 'ancestor_type': ancestor_type });
                    // 构建数据，传送给 UI
                    let position = 0;
                    let index = 0;
                    let keyword_length = keyword.length;
                    while (index >= 0) {
                        // 由于单个 TEXT 图层内可能存在多个符合条件的字符，所以需要循环查找
                        index = node_characters.indexOf(keyword, position);
                        if (index > -1) {
                            // 将查找的字符起始、终止位置发送给 UI
                            // 每个关键字的数据
                            data_temp = { 'page_name': node_list[i]['page'], 'page_id': node_list[i]['page_id'], 'id': node.id, 'characters': node.characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': node.hasMissingFont, 'ancestor_type': ancestor_type };
                            if (req_cout < 20) {
                                // 如果已经有搜索结果，则先发送一部分显示在 UI 中，提升搜索加载状态的体验
                                figma.ui.postMessage({ 'type': 'find', 'done': false, 'my_progress': { 'index': my_progress, 'total': node_len_sum }, 'target_Text_Node': [data_temp] });
                            }
                            else {
                                data_item_list.push(data_temp);
                            }
                            // 统计搜索结果数量
                            req_cout++;
                            // 设置查找目标字符串的偏移
                            position = index + keyword_length;
                        } // if
                    } // while
                } // if (node['characters'].indexOf(keyword) > -1)
            }, 10); // setTimeout
        }
    }
    return data_item_list;
}
// 替换
function replace(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('replace');
        // console.log(data);
        // console.log(target_Text_Node);
        // 如果被替换的字符是 '' 则会陷入死循环，所以要判断一下
        if (data.data.keyword == '') {
            figma.notify('Please enter the characters you want to replace');
            return;
        }
        myLoadFontAsync(target_Text_Node).then(() => {
            hasMissingFontCount = 0;
            let len = target_Text_Node.length;
            let my_progress = 0; // 进度信息
            let keyword = data.data.keyword; // 关键字
            let newCharacters = data.data.replace_word; // 需要替换成以下字符
            // 忽略大小写
            if (seting_Aa != true) {
                keyword = keyword.toLowerCase();
            }
            setTimeout(() => {
                for (let i = len; i--;) {
                    setTimeout(() => {
                        my_progress++;
                        // console.log(my_progress);
                        // figma.ui.postMessage({ 'type': 'replace', 'done': false, 'my_progress': { 'index': my_progress, 'total': len},'hasMissingFontCount':hasMissingFontCount  });
                        if (target_Text_Node[i]['ancestor_isVisible'] == false || target_Text_Node[i]['ancestor_isLocked'] == true) {
                            // 忽略隐藏、锁定的图层
                        }
                        else {
                            // console.log(target_Text_Node[i]['node']['fontName']);
                            // console.log(target_Text_Node[i]['node'].hasMissingFont);
                            if (target_Text_Node[i]['node'].hasMissingFont) {
                                // 字体不支持
                                // console.log('hasMissingFont');
                                // console.log(hasMissingFontCount);
                                hasMissingFontCount += 1;
                            }
                            else {
                                let textStyle = target_Text_Node[i]['node'].getStyledTextSegments(['indentation', 'listOptions']);
                                // console.log('textStyle:');
                                // console.log(textStyle);
                                let offsetStart = 0;
                                let offsetEnd = 0; // 记录修改字符后的索引偏移数值
                                let styleTemp = []; // 记录每个段落样式在修改后的样式索引（在替换完字符后需要设置回之前的样式）
                                let last_offsetEnd = 0; // 记录上一个段落的末尾索引
                                // 替换目标字符
                                textStyle.forEach(element => {
                                    // console.log(element);
                                    let position = 0;
                                    let element_characters = element.characters;
                                    let index;
                                    if (seting_Aa != true) {
                                        element_characters = element_characters.toLowerCase();
                                    }
                                    // 由于单个段落内可能存在多个符合条件的字符，所以需要循环查找
                                    while (true) {
                                        // 获取匹配到的字符的索引
                                        index = element_characters.indexOf(keyword, position);
                                        if (index > -1) {
                                            // 有匹配的字符
                                            // 记录新字符需要插入的位置
                                            let insertStart = index + keyword.length + element['start'];
                                            // console.log('insertStart:' + insertStart.toString());
                                            // 在索引后插入新字符
                                            target_Text_Node[i]['node'].insertCharacters(insertStart + offsetEnd, newCharacters);
                                            // 根据索引删除旧字符
                                            target_Text_Node[i]['node'].deleteCharacters(index + element['start'] + offsetEnd, insertStart + offsetEnd);
                                            // 记录偏移数值
                                            // offsetStart = last_offsetEnd
                                            offsetEnd += newCharacters.length - keyword.length;
                                            // console.log('while offsetStart:' + offsetStart.toString());
                                            // console.log('while offsetEnd:' + offsetEnd.toString());
                                            // 记录检索到目标字符的索引，下一次 while 循环在此位置后开始查找
                                            position = index + keyword.length;
                                        }
                                        else {
                                            // 没有匹配的字符
                                            break;
                                        } // else
                                    } // while
                                    // 将单个段落的缩进、序号样式记录到数组内
                                    styleTemp.push({ 'start': last_offsetEnd, 'end': element['end'] + offsetEnd, 'indentation': element['indentation'] > 0 ? element['indentation'] : 0, 'listOptions': element['listOptions'] });
                                    last_offsetEnd = element['end'] + offsetEnd;
                                    // // 设置缩进
                                    // target_Text_Node[i]['node'].setRangeIndentation(element['start'] + offsetStart, element['end'] + offsetEnd, element['indentation'] > 0 ? element['indentation'] - 1 : element['indentation'])
                                    // // 设置序号
                                    // target_Text_Node[i]['node'].setRangeListOptions(element['start'] + offsetStart, element['end'] + offsetEnd, element['listOptions'])
                                }); // textStyle.forEach
                                // 设置缩进、序号
                                // styleTemp 记录了每个段落的缩进、序号样式，遍历数组使得修改字符后的文本图层样式不变
                                styleTemp.forEach(element => {
                                    // console.log(element);
                                    // console.log(target_Text_Node[i]['node']);
                                    // 如果文本为空，则不支持设置样式（会报错）
                                    if (target_Text_Node[i]['node'].characters != '' && element['end'] > element['start']) {
                                        // console.log(element);
                                        // console.log(target_Text_Node[i]['node']);
                                        target_Text_Node[i]['node'].setRangeListOptions(element['start'], element['end'], element['listOptions']);
                                        target_Text_Node[i]['node'].setRangeIndentation(element['start'], element['end'], element['indentation']);
                                    }
                                });
                            } // else
                        } // else
                        let is_done = false;
                        if (my_progress >= len) {
                            console.log('my_progress==len-1');
                            // console.log(my_progress);
                            // console.log(len);
                            is_done = true;
                        }
                        else {
                        }
                        figma.ui.postMessage({ 'type': 'replace', 'done': is_done, 'my_progress': { 'index': my_progress, 'total': len }, 'hasMissingFontCount': hasMissingFontCount });
                    }, 10);
                }
            }, 0);
        });
        // resolve('1')
    });
} // async function replace
// Figma 图层选择变化时，通知 UI 显示不同的提示
function onSelectionChange() {
    console.log('onSelectionChange');
    var selection = figma.currentPage.selection;
    // 当前未选中图层，则在当前页面搜索
    if (selection.length == 0) {
        figma.ui.postMessage({ 'type': 'onSelectionChange', 'selectionPage': true });
    }
    else {
        figma.ui.postMessage({ 'type': 'onSelectionChange', 'selectionPage': false });
    }
}
function onCurrentpagechange() {
    // console.log(figma.currentPage);
    currentPage = figma.currentPage;
    // figma.ui.postMessage({ 'type': 'onCurrentpagechange', 'currentPage': figma.currentPage['id'] })
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/code.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFtRDtBQUNuRCxvREFBb0Q7QUFDcEQsd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQyxzQ0FBc0M7QUFDdEM7QUFDQSxxREFBcUQsMktBQTJLO0FBQ2hPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsR0FBRztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakMsOEJBQThCO0FBQzlCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MscURBQXFELG9DQUFvQyw4Q0FBOEM7QUFDdEwscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG9EQUFvRDtBQUNuRjtBQUNBO0FBQ0EsK0JBQStCLHFEQUFxRDtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHVFQUF1RTtBQUNyRzs7Ozs7Ozs7VUV6ZUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2UvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0BmaWdtYS9wbHVnaW4tdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cbmxldCB0YXJnZXRfVGV4dF9Ob2RlID0gW107IC8vIOWtmOWCqOespuWQiOaQnOe0ouadoeS7tueahCBURVhUIOWbvuWxglxubGV0IGxvYWRlZF9mb250cyA9IFtdOyAvLyDlt7LliqDovb3nmoTlrZfkvZPliJfooahcbmxldCBmaWxlVHlwZSA9IGZpZ21hLmVkaXRvclR5cGU7IC8vIOW9k+WJjSBmaWdtYSDmlofku7bnsbvlnovvvJpmaWdtYS9maWdqYW1cbmxldCBoYXNNaXNzaW5nRm9udENvdW50ID0gMDsgLy8g5pu/5o2i5pe26K6w5b2V5LiN5pSv5oyB5a2X5L2T55qE5pWw6YePXG5sZXQgc2V0aW5nX0FhID0gZmFsc2U7IC8vIOaYr+WQpuWMuuWIhuWkp+Wwj+WGmVxubGV0IGZpbmRfYWxsID0gZmFsc2U7IC8vIOaYr+WQpuaQnOe0ouaVtOS4quaWh+aho1xubGV0IHJlcV9jb3V0ID0gMDsgLy8g5pCc57Si57uT5p6c5pWw6YePXG5sZXQgbm9kZV9saXN0ID0gW107IC8vIOWtmOWCqOaJgOaciSBURVhUIOWbvuWxglxubGV0IGN1cnJlbnRQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7IC8vIOWtmOWCqOW9k+WJjemhtemdolxuLy9AdHMtaWdub3JlXG5maWdtYS5za2lwSW52aXNpYmxlSW5zdGFuY2VDaGlsZHJlbiA9IHRydWU7IC8vIOW/veeVpemakOiXj+eahOWbvuWxglxuY29uc29sZS5sb2coJzIwMjItMDUtMTIgMTI6MjgnKTtcbi8vIOWQr+WKqOaPkuS7tuaXtuaYvuekuiBVSVxuLy9AdHMtaWdub3JlXG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgdGhlbWVDb2xvcnM6IHRydWUsIHdpZHRoOiAzMDAsIGhlaWdodDogNDAwIH0pO1xuLy8g6I635Y+W5piv5ZCm6YCJ5Lit5Zu+5bGCXG5vblNlbGVjdGlvbkNoYW5nZSgpO1xuLy8g57uR5a6aIEZpZ21hIOWbvuWxgumAieaLqeWPmOWMluS6i+S7tlxuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4geyBvblNlbGVjdGlvbkNoYW5nZSgpOyB9KTtcbi8vIOmAieS4reeahOmhtemdouWPkeeUn+WPmOWMllxuZmlnbWEub24oXCJjdXJyZW50cGFnZWNoYW5nZVwiLCAoKSA9PiB7XG4gICAgb25DdXJyZW50cGFnZWNoYW5nZSgpO1xufSk7XG4vLyBVSSDlj5HmnaXmtojmga9cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pCc57Si44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VhcmNoJykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoJyk7XG4gICAgICAgIC8vIOiusOW9lei/kOihjOaXtumVv1xuICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgbGV0IGZpbmRfc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgLy8g5omn6KGM5pCc57SiXG4gICAgICAgIGZpbmQobXNnLmRhdGEpO1xuICAgICAgICBsZXQgZG9uZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygn44CL44CL44CL44CL44CL44CL44CL44CL44CL44CLZmluZDonICsgKGRvbmUgLSBmaW5kX3N0YXJ0KS50b1N0cmluZygpKTtcbiAgICAgICAgbGV0IHRvSFRNTDsgLy8g5a2Y5YKo6KaB5Y+R57uZIHVpLnRzeCDnmoTmlbDmja5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmluZEtleVdvcmRfc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIC8vIOWcqOaWh+acrOWbvuWxguS4reWMuemFjeWMheWQq+WFs+mUruWtl+eahOWbvuWxglxuICAgICAgICAgICAgdG9IVE1MID0gZmluZEtleVdvcmQobm9kZV9saXN0LCBtc2cuZGF0YS5rZXl3b3JkKTtcbiAgICAgICAgICAgIGxldCBmaW5kS2V5V29yZF9lbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgItmaW5kS2V5V29yZDonICsgKGZpbmRLZXlXb3JkX2VuZCAtIGZpbmRLZXlXb3JkX3N0YXJ0KS50b1N0cmluZygpKTtcbiAgICAgICAgfSwgMjApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWwhuaQnOe0ouaVsOaNruWPkemAgee7mSB1aS50c3hcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZG9uZSc6IHRydWUsICd0YXJnZXRfVGV4dF9Ob2RlJzogdG9IVE1MIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGaW5kIGVuZCxjb3VudDonKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXFfY291dCk7XG4gICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdkb25lJyB9KVxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn44CL44CL44CL44CL44CL44CL44CL44CL44CL44CLJyArIG1zZy5kYXRhLmtleXdvcmQgKyAnOicgKyAoZW5kIC0gc3RhcnQpLnRvU3RyaW5nKCkgKyAnIGNvdW50OicgKyByZXFfY291dC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBpZiAocmVxX2NvdXQgPiAzMCkge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5yZXNpemUoMzAwLCA1NDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDMwKTtcbiAgICAgICAgfSwgNDApO1xuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vmkJzntKLnu5PmnpzpoblcbiAgICBpZiAobXNnLnR5cGUgPT09ICdsaXN0T25DbGlrJykge1xuICAgICAgICBsZXQgbXNnX2RhdGEgPSBtc2dbJ2RhdGEnXTtcbiAgICAgICAgbGV0IHRhcmdldE5vZGU7XG4gICAgICAgIC8vIOaQnOe0oue7k+aenOaYr+WQpuWcqOW9k+WJjemhtemdolxuICAgICAgICBsZXQgY2xpY2tfb2JqX3RhcmdldF9wYWdlX2lkID0gbXNnX2RhdGFbJ3BhZ2UnXTtcbiAgICAgICAgaWYgKGN1cnJlbnRQYWdlWydpZCddICE9IGNsaWNrX29ial90YXJnZXRfcGFnZV9pZCkge1xuICAgICAgICAgICAgLy8g54K55Ye75a+56LGh5LiN5Zyo5b2T5YmN6aG16Z2i77yM6Lez6L2s5Yiw5a+55bqU6aG16Z2iXG4gICAgICAgICAgICBsZXQgZG9jdW1lbnRfY2hpbGRyZW4gPSBmaWdtYS5yb290LmNoaWxkcmVuO1xuICAgICAgICAgICAgbGV0IGRvY3VtZW50X2NoaWxkcmVuX2xlbmd0aCA9IGRvY3VtZW50X2NoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gZG9jdW1lbnRfY2hpbGRyZW5fbGVuZ3RoIC0gMTsgaW5kZXggPiAtMTsgaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudF9jaGlsZHJlbltpbmRleF1bJ2lkJ10gPT0gY2xpY2tfb2JqX3RhcmdldF9wYWdlX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlID0gZG9jdW1lbnRfY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8g6YGN5Y6G5pCc57Si57uT5p6cXG4gICAgICAgIGxldCBsZW4gPSB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IGxlbiAtIDE7IGkgPiAtMTsgaS0tKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmlkID09IG1zZ19kYXRhWydpdGVtJ10pIHtcbiAgICAgICAgICAgICAgICAvLyDmib7liLDnlKjmiLfngrnlh7vnmoTlm77lsYJcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlID0gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOinhuWbvuWumuS9jeWIsOWvueW6lOWbvuWxglxuICAgICAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbdGFyZ2V0Tm9kZV0pO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOmAieS4reWvueW6lOaWh+acrFxuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGVkVGV4dFJhbmdlID0geyAnbm9kZSc6IHRhcmdldE5vZGUsICdzdGFydCc6IG1zZ19kYXRhWydzdGFydCddLCAnZW5kJzogbXNnX2RhdGFbJ2VuZCddIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pu/5o2i44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvZGUudHMgcmVwbGFjZScpO1xuICAgICAgICAvLyDmiafooYzmm7/mjaJcbiAgICAgICAgcmVwbGFjZShtc2cpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvZGUudHMgcmVwbGFjZSBkb25lJyk7XG4gICAgICAgICAgICAgICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICAgICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogdHJ1ZSwgJ2hhc01pc3NpbmdGb250Q291bnQnOiBoYXNNaXNzaW5nRm9udENvdW50IH0pO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFVJIOS4rei/m+ihjOaQnOe0ouiuvue9rlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2hhbmRsZV9zZXRpbmdfY2xpY2snKSB7XG4gICAgICAgIHN3aXRjaCAobXNnWydkYXRhJ11bJ3R5cGUnXSkge1xuICAgICAgICAgICAgY2FzZSAnc2V0aW5nX0FhJzpcbiAgICAgICAgICAgICAgICBzZXRpbmdfQWEgPSBtc2dbJ2RhdGEnXVsnZGF0YSddWydjaGVja2VkJ107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmaW5kX2FsbCc6XG4gICAgICAgICAgICAgICAgZmluZF9hbGwgPSBtc2dbJ2RhdGEnXVsnZGF0YSddWydjaGVja2VkJ107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufTtcbi8vIOWKoOi9veWtl+S9k1xuZnVuY3Rpb24gbXlMb2FkRm9udEFzeW5jKHRleHRfbGF5ZXJfTGlzdCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdteUxvYWRGb250QXN5bmM6Jyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRleHRfbGF5ZXJfTGlzdCk7XG4gICAgICAgIGZvciAobGV0IGxheWVyIG9mIHRleHRfbGF5ZXJfTGlzdCkge1xuICAgICAgICAgICAgaWYgKGxheWVyWydub2RlJ11bJ2NoYXJhY3RlcnMnXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLS0nKTtcbiAgICAgICAgICAgIC8vIOWKoOi9veWtl+S9k1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobGF5ZXIpO1xuICAgICAgICAgICAgbGV0IGZvbnRzID0gbGF5ZXJbJ25vZGUnXS5nZXRSYW5nZUFsbEZvbnROYW1lcygwLCBsYXllclsnbm9kZSddWydjaGFyYWN0ZXJzJ10ubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb250czonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZvbnRzKTtcbiAgICAgICAgICAgIGZvciAobGV0IGZvbnQgb2YgZm9udHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmluZ28gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBsb2FkZWRfZm9udCBvZiBsb2FkZWRfZm9udHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRlZF9mb250WydmYW1pbHknXSA9PSBmb250WydmYW1pbHknXSAmJiBsb2FkZWRfZm9udFsnc3R5bGUnXSA9PSBmb250WydzdHlsZSddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5nbyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhiaW5nbyk7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmdvKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5a2X5L2T5piv5ZCm5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXllclsnbm9kZSddLmhhc01pc3NpbmdGb250KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDkuI3mlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoYXNNaXNzaW5nRm9udCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkZWRfZm9udHMucHVzaChmb250KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2FkRm9udEFzeW5jJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKGZvbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG15Rm9udCk7XG4gICAgICAgIC8vIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMobXlGb250KVxuICAgICAgICByZXR1cm4gJ2RvbmUnO1xuICAgIH0pO1xufVxuLy8g5om+5Ye65omA5pyJ5paH5pys5Zu+5bGCXG5mdW5jdGlvbiBmaW5kKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZygnY29uZGUudHM6ZmluZDonKTtcbiAgICAvLyBjb25zb2xlLmxvZyhmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgLy8g5riF56m65Y6G5Y+y5pCc57Si5pWw5o2u77yM6YeN5paw5pCc57SiXG4gICAgdGFyZ2V0X1RleHRfTm9kZSA9IFtdO1xuICAgIGlmIChmaW5kX2FsbCkge1xuICAgICAgICAvL+aQnOe0ouaVtOS4quaWh+aho1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLnJvb3QuY2hpbGRyZW47XG4gICAgICAgIG5vZGVfbGlzdCA9IFtdOyAvLyDlrZjlgqjmiYDmnIkgVEVYVCDlm77lsYJcbiAgICAgICAgbGV0IG5vZGVfbGlzdF90ZW1wO1xuICAgICAgICBsZXQganNvbl9kYXRhX3RlbXA7XG4gICAgICAgIGxldCBsZW4gPSBzZWxlY3Rpb24ubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBub2RlX2xpc3RfdGVtcCA9IFtdO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5rKh5pyJ5a2Q5Zu+5bGCXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbltpXS5jaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluaWh+acrOWbvuWxglxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0X3RlbXAgPSBzZWxlY3Rpb25baV0uZmluZEFsbFdpdGhDcml0ZXJpYSh7IHR5cGVzOiBbJ1RFWFQnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAganNvbl9kYXRhX3RlbXAgPSB7ICdwYWdlJzogc2VsZWN0aW9uW2ldWyduYW1lJ10sICdwYWdlX2lkJzogc2VsZWN0aW9uW2ldWydpZCddLCAnbm9kZV9saXN0Jzogbm9kZV9saXN0X3RlbXAgfTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0LnB1c2goanNvbl9kYXRhX3RlbXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8g5b2T5YmN6YCJ5Lit55qE5Zu+5bGCXG4gICAgICAgIGxldCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgICAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIOW9k+WJjeaciemAieS4reWbvuWxgu+8jOWImeWcqOmAieS4reeahOWbvuWxguS4reaQnOe0olxuICAgICAgICAgICAgLy8g5Zyo5b2T5YmN6YCJ5Lit55qE5Zu+5bGC5Lit77yM5pCc57Si5paH5pys5Zu+5bGCXG4gICAgICAgIH1cbiAgICAgICAgbm9kZV9saXN0ID0gW107IC8vIOWtmOWCqOaJgOaciSBURVhUIOWbvuWxglxuICAgICAgICAvLyBsZXQgY2hpbGRyZW5fbGlzdCA9IFtdICAgIC8vIOaLhuWIhuWbvuWxgu+8jOmAkOS4quaQnOe0ou+8jOmBv+WFjeeVjOmdoumVv+aXtumXtOaMgui1t1xuICAgICAgICBsZXQgbGVuID0gc2VsZWN0aW9uLmxlbmd0aDtcbiAgICAgICAgbGV0IG5vZGVfbGlzdF90ZW1wID0gW107XG4gICAgICAgIGxldCBqc29uX2RhdGFfdGVtcDtcbiAgICAgICAgLy8g6YGN5Y6G6IyD5Zu05YaF55qE5Zu+5bGC77yM6I635Y+WIFRFWFQg5Zu+5bGCXG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBmaWdtYS5za2lwSW52aXNpYmxlSW5zdGFuY2VDaGlsZHJlbiA9IHRydWU7IC8vIOW/veeVpemakOiXj+eahOWbvuWxglxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/mlofmnKzlm77lsYJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uW2ldLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVfbGlzdF90ZW1wLnB1c2goc2VsZWN0aW9uW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOWbvuWxguS4i+ayoeacieWtkOWbvuWxglxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbltpXS5jaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluaWh+acrOWbvuWxglxuICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3RfdGVtcCA9IG5vZGVfbGlzdF90ZW1wLmNvbmNhdChzZWxlY3Rpb25baV0uZmluZEFsbFdpdGhDcml0ZXJpYSh7IHR5cGVzOiBbJ1RFWFQnXSB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZV9saXN0ID0gW3sgJ3BhZ2UnOiBmaWdtYS5jdXJyZW50UGFnZVsnbmFtZSddLCAncGFnZV9pZCc6IGZpZ21hLmN1cnJlbnRQYWdlWydpZCddLCAnbm9kZV9saXN0Jzogbm9kZV9saXN0X3RlbXAgfV07XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gcmV0dXJuIG5vZGVfbGlzdFxufVxuLy8g5pCc57Si77ya5Zyo5paH5pys5Zu+5bGC5Lit77yM5Yy56YWN5YWz6ZSu5a2XXG5mdW5jdGlvbiBmaW5kS2V5V29yZChub2RlX2xpc3QsIGtleXdvcmQpIHtcbiAgICBjb25zb2xlLmxvZygnZnVuYyBmaW5kS2V5V29yZCBiZWdpbicpO1xuICAgIHJlcV9jb3V0ID0gMDsgLy8g5pCc57Si57uT5p6c5pWw6YePXG4gICAgbGV0IGRhdGFfaXRlbV9saXN0ID0gW107XG4gICAgbGV0IGRhdGFfdGVtcDtcbiAgICBsZXQgbm9kZTsgLy8g6K6w5b2V6YGN5Y6G5Yiw55qE5Zu+5bGCXG4gICAgbGV0IGxlbiA9IG5vZGVfbGlzdC5sZW5ndGg7XG4gICAgbGV0IG15X3Byb2dyZXNzID0gMDsgLy8g6L+b5bqm5L+h5oGvXG4gICAgLy8g5b+955Wl5aSn5bCP5YaZXG4gICAgaWYgKHNldGluZ19BYSAhPSB0cnVlKSB7XG4gICAgICAgIGtleXdvcmQgPSBrZXl3b3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdrZXl3b3JkOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKGtleXdvcmQpO1xuICAgIGxldCBub2RlX2xlbl9zdW0gPSAwO1xuICAgIG5vZGVfbGlzdC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBub2RlX2xlbl9zdW0gKz0gaXRlbVsnbm9kZV9saXN0J10ubGVuZ3RoO1xuICAgIH0pO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IGxpc3RfbGVuZ3RoID0gbm9kZV9saXN0W2ldWydub2RlX2xpc3QnXS5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGlzdF9sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbXlfcHJvZ3Jlc3MrKztcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZG9uZSc6IGZhbHNlLCAnbXlfcHJvZ3Jlc3MnOiB7ICdpbmRleCc6IG15X3Byb2dyZXNzLCAndG90YWwnOiBub2RlX2xlbl9zdW0gfSB9KTtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZV9saXN0W2ldWydub2RlX2xpc3QnXVtqXTtcbiAgICAgICAgICAgICAgICBsZXQgbm9kZV9jaGFyYWN0ZXJzO1xuICAgICAgICAgICAgICAgIC8vIOW/veeVpeWkp+Wwj+WGmVxuICAgICAgICAgICAgICAgIGlmIChzZXRpbmdfQWEgIT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlX2NoYXJhY3RlcnMgPSBub2RlWydjaGFyYWN0ZXJzJ10udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVfY2hhcmFjdGVycyA9IG5vZGVbJ2NoYXJhY3RlcnMnXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVfY2hhcmFjdGVycy5pbmRleE9mKGtleXdvcmQpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5om+5Yiw5YWz6ZSu6K+NKOW/veeVpeWkp+Wwj+WGmSlcbiAgICAgICAgICAgICAgICAgICAgLy8g5Yik5pat56WW5YWI5Zu+5bGC55qE54q25oCB77yM5YyF5ous6ZqQ6JeP44CB6ZSB5a6a44CB57uE5Lu244CB5a6e5L6L5bGe5oCnXG4gICAgICAgICAgICAgICAgICAgIGxldCB0aGlzX3BhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmNlc3Rvcl9pc0xvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfdHlwZSA9ICcnOyAvLyDnu4Tku7Yv5a6e5L6LL+WFtuS7llxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5sb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5pys6Lqr5bCx5piv6ZSB5a6a5oiW6ZqQ6JeP54q25oCBXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bnpZblhYjlhYPntKDnmoTnirbmgIFcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpc19wYXJlbnQudHlwZSAhPSAnUEFHRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQubG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnR5cGUgPT0gJ0NPTVBPTkVOVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfdHlwZSA9ICdDT01QT05FTlQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQudHlwZSA9PSAnSU5TVEFOQ0UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX3R5cGUgPSAnSU5TVEFOQ0UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSB8fCBhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSAmJiBhbmNlc3Rvcl90eXBlICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc19wYXJlbnQgPSB0aGlzX3BhcmVudC5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIOWNleS4quWbvuWxgueahOaVsOaNru+8jOWtmOWCqOWIsCB0YXJnZXRfVGV4dF9Ob2RlIOS4re+8jOaLpeacieWQjue7reeahOabv+aNouW3peS9nFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLnB1c2goeyAnbm9kZSc6IG5vZGUsICdhbmNlc3Rvcl9pc1Zpc2libGUnOiBhbmNlc3Rvcl9pc1Zpc2libGUsICdhbmNlc3Rvcl9pc0xvY2tlZCc6IGFuY2VzdG9yX2lzTG9ja2VkLCAnYW5jZXN0b3JfdHlwZSc6IGFuY2VzdG9yX3R5cGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaehOW7uuaVsOaNru+8jOS8oOmAgee7mSBVSVxuICAgICAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICBsZXQga2V5d29yZF9sZW5ndGggPSBrZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUseS6juWNleS4qiBURVhUIOWbvuWxguWGheWPr+iDveWtmOWcqOWkmuS4quespuWQiOadoeS7tueahOWtl+espu+8jOaJgOS7pemcgOimgeW+queOr+afpeaJvlxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBub2RlX2NoYXJhY3RlcnMuaW5kZXhPZihrZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWwhuafpeaJvueahOWtl+espui1t+Wni+OAgee7iOatouS9jee9ruWPkemAgee7mSBVSVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOavj+S4quWFs+mUruWtl+eahOaVsOaNrlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFfdGVtcCA9IHsgJ3BhZ2VfbmFtZSc6IG5vZGVfbGlzdFtpXVsncGFnZSddLCAncGFnZV9pZCc6IG5vZGVfbGlzdFtpXVsncGFnZV9pZCddLCAnaWQnOiBub2RlLmlkLCAnY2hhcmFjdGVycyc6IG5vZGUuY2hhcmFjdGVycywgJ3N0YXJ0JzogaW5kZXgsICdlbmQnOiBpbmRleCArIGtleXdvcmQubGVuZ3RoLCAnaGFzTWlzc2luZ0ZvbnQnOiBub2RlLmhhc01pc3NpbmdGb250LCAnYW5jZXN0b3JfdHlwZSc6IGFuY2VzdG9yX3R5cGUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxX2NvdXQgPCAyMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzlt7Lnu4/mnInmkJzntKLnu5PmnpzvvIzliJnlhYjlj5HpgIHkuIDpg6jliIbmmL7npLrlnKggVUkg5Lit77yM5o+Q5Y2H5pCc57Si5Yqg6L2954q25oCB55qE5L2T6aqMXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZCcsICdkb25lJzogZmFsc2UsICdteV9wcm9ncmVzcyc6IHsgJ2luZGV4JzogbXlfcHJvZ3Jlc3MsICd0b3RhbCc6IG5vZGVfbGVuX3N1bSB9LCAndGFyZ2V0X1RleHRfTm9kZSc6IFtkYXRhX3RlbXBdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV9pdGVtX2xpc3QucHVzaChkYXRhX3RlbXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnu5/orqHmkJzntKLnu5PmnpzmlbDph49cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXFfY291dCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiuvue9ruafpeaJvuebruagh+Wtl+espuS4sueahOWBj+enu1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBrZXl3b3JkX2xlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gaWZcbiAgICAgICAgICAgICAgICAgICAgfSAvLyB3aGlsZVxuICAgICAgICAgICAgICAgIH0gLy8gaWYgKG5vZGVbJ2NoYXJhY3RlcnMnXS5pbmRleE9mKGtleXdvcmQpID4gLTEpXG4gICAgICAgICAgICB9LCAxMCk7IC8vIHNldFRpbWVvdXRcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGF0YV9pdGVtX2xpc3Q7XG59XG4vLyDmm7/mjaJcbmZ1bmN0aW9uIHJlcGxhY2UoZGF0YSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgLy8g5aaC5p6c6KKr5pu/5o2i55qE5a2X56ym5pivICcnIOWImeS8mumZt+WFpeatu+W+queOr++8jOaJgOS7peimgeWIpOaWreS4gOS4i1xuICAgICAgICBpZiAoZGF0YS5kYXRhLmtleXdvcmQgPT0gJycpIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIGVudGVyIHRoZSBjaGFyYWN0ZXJzIHlvdSB3YW50IHRvIHJlcGxhY2UnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBteUxvYWRGb250QXN5bmModGFyZ2V0X1RleHRfTm9kZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBoYXNNaXNzaW5nRm9udENvdW50ID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBteV9wcm9ncmVzcyA9IDA7IC8vIOi/m+W6puS/oeaBr1xuICAgICAgICAgICAgbGV0IGtleXdvcmQgPSBkYXRhLmRhdGEua2V5d29yZDsgLy8g5YWz6ZSu5a2XXG4gICAgICAgICAgICBsZXQgbmV3Q2hhcmFjdGVycyA9IGRhdGEuZGF0YS5yZXBsYWNlX3dvcmQ7IC8vIOmcgOimgeabv+aNouaIkOS7peS4i+Wtl+esplxuICAgICAgICAgICAgLy8g5b+955Wl5aSn5bCP5YaZXG4gICAgICAgICAgICBpZiAoc2V0aW5nX0FhICE9IHRydWUpIHtcbiAgICAgICAgICAgICAgICBrZXl3b3JkID0ga2V5d29yZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGxlbjsgaS0tOykge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG15X3Byb2dyZXNzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhteV9wcm9ncmVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnLCAnZG9uZSc6IGZhbHNlLCAnbXlfcHJvZ3Jlc3MnOiB7ICdpbmRleCc6IG15X3Byb2dyZXNzLCAndG90YWwnOiBsZW59LCdoYXNNaXNzaW5nRm9udENvdW50JzpoYXNNaXNzaW5nRm9udENvdW50ICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydhbmNlc3Rvcl9pc1Zpc2libGUnXSA9PSBmYWxzZSB8fCB0YXJnZXRfVGV4dF9Ob2RlW2ldWydhbmNlc3Rvcl9pc0xvY2tlZCddID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlv73nlaXpmpDol4/jgIHplIHlrprnmoTlm77lsYJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXVsnZm9udE5hbWUnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmhhc01pc3NpbmdGb250KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmhhc01pc3NpbmdGb250KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtl+S9k+S4jeaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaGFzTWlzc2luZ0ZvbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaGFzTWlzc2luZ0ZvbnRDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc01pc3NpbmdGb250Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0U3R5bGUgPSB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uZ2V0U3R5bGVkVGV4dFNlZ21lbnRzKFsnaW5kZW50YXRpb24nLCAnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZXh0U3R5bGU6Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRleHRTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRTdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRFbmQgPSAwOyAvLyDorrDlvZXkv67mlLnlrZfnrKblkI7nmoTntKLlvJXlgY/np7vmlbDlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlVGVtcCA9IFtdOyAvLyDorrDlvZXmr4/kuKrmrrXokL3moLflvI/lnKjkv67mlLnlkI7nmoTmoLflvI/ntKLlvJXvvIjlnKjmm7/mjaLlrozlrZfnrKblkI7pnIDopoHorr7nva7lm57kuYvliY3nmoTmoLflvI/vvIlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3Rfb2Zmc2V0RW5kID0gMDsgLy8g6K6w5b2V5LiK5LiA5Liq5q616JC955qE5pyr5bC+57Si5byVXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOabv+aNouebruagh+Wtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGUuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50X2NoYXJhY3RlcnMgPSBlbGVtZW50LmNoYXJhY3RlcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0aW5nX0FhICE9IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50X2NoYXJhY3RlcnMgPSBlbGVtZW50X2NoYXJhY3RlcnMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUseS6juWNleS4quauteiQveWGheWPr+iDveWtmOWcqOWkmuS4quespuWQiOadoeS7tueahOWtl+espu+8jOaJgOS7pemcgOimgeW+queOr+afpeaJvlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bljLnphY3liLDnmoTlrZfnrKbnmoTntKLlvJVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGVsZW1lbnRfY2hhcmFjdGVycy5pbmRleE9mKGtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmnInljLnphY3nmoTlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5paw5a2X56ym6ZyA6KaB5o+S5YWl55qE5L2N572uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnNlcnRTdGFydCA9IGluZGV4ICsga2V5d29yZC5sZW5ndGggKyBlbGVtZW50WydzdGFydCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5zZXJ0U3RhcnQ6JyArIGluc2VydFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlnKjntKLlvJXlkI7mj5LlhaXmlrDlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmluc2VydENoYXJhY3RlcnMoaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQsIG5ld0NoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7ntKLlvJXliKDpmaTml6flrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmRlbGV0ZUNoYXJhY3RlcnMoaW5kZXggKyBlbGVtZW50WydzdGFydCddICsgb2Zmc2V0RW5kLCBpbnNlcnRTdGFydCArIG9mZnNldEVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvZmZzZXRTdGFydCA9IGxhc3Rfb2Zmc2V0RW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldEVuZCArPSBuZXdDaGFyYWN0ZXJzLmxlbmd0aCAtIGtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2hpbGUgb2Zmc2V0U3RhcnQ6JyArIG9mZnNldFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2hpbGUgb2Zmc2V0RW5kOicgKyBvZmZzZXRFbmQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leajgOe0ouWIsOebruagh+Wtl+espueahOe0ouW8le+8jOS4i+S4gOasoSB3aGlsZSDlvqrnjq/lnKjmraTkvY3nva7lkI7lvIDlp4vmn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBpbmRleCArIGtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rKh5pyJ5Yy56YWN55qE5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyB3aGlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5Y2V5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP6K6w5b2V5Yiw5pWw57uE5YaFXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVRlbXAucHVzaCh7ICdzdGFydCc6IGxhc3Rfb2Zmc2V0RW5kLCAnZW5kJzogZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsICdpbmRlbnRhdGlvbic6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gPiAwID8gZWxlbWVudFsnaW5kZW50YXRpb24nXSA6IDAsICdsaXN0T3B0aW9ucyc6IGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X29mZnNldEVuZCA9IGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8g6K6+572u57yp6L+bXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uc2V0UmFuZ2VJbmRlbnRhdGlvbihlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnQsIGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCBlbGVtZW50WydpbmRlbnRhdGlvbiddID4gMCA/IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gLSAxIDogZWxlbWVudFsnaW5kZW50YXRpb24nXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOiuvue9ruW6j+WPt1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlTGlzdE9wdGlvbnMoZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0LCBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7IC8vIHRleHRTdHlsZS5mb3JFYWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiuvue9rue8qei/m+OAgeW6j+WPt1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZVRlbXAg6K6w5b2V5LqG5q+P5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP77yM6YGN5Y6G5pWw57uE5L2/5b6X5L+u5pS55a2X56ym5ZCO55qE5paH5pys5Zu+5bGC5qC35byP5LiN5Y+YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlVGVtcC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5paH5pys5Li656m677yM5YiZ5LiN5pSv5oyB6K6+572u5qC35byP77yI5Lya5oql6ZSZ77yJXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmNoYXJhY3RlcnMgIT0gJycgJiYgZWxlbWVudFsnZW5kJ10gPiBlbGVtZW50WydzdGFydCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uc2V0UmFuZ2VMaXN0T3B0aW9ucyhlbGVtZW50WydzdGFydCddLCBlbGVtZW50WydlbmQnXSwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlSW5kZW50YXRpb24oZWxlbWVudFsnc3RhcnQnXSwgZWxlbWVudFsnZW5kJ10sIGVsZW1lbnRbJ2luZGVudGF0aW9uJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlzX2RvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChteV9wcm9ncmVzcyA+PSBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbXlfcHJvZ3Jlc3M9PWxlbi0xJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXlfcHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNfZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogaXNfZG9uZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbGVuIH0sICdoYXNNaXNzaW5nRm9udENvdW50JzogaGFzTWlzc2luZ0ZvbnRDb3VudCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmVzb2x2ZSgnMScpXG4gICAgfSk7XG59IC8vIGFzeW5jIGZ1bmN0aW9uIHJlcGxhY2Vcbi8vIEZpZ21hIOWbvuWxgumAieaLqeWPmOWMluaXtu+8jOmAmuefpSBVSSDmmL7npLrkuI3lkIznmoTmj5DnpLpcbmZ1bmN0aW9uIG9uU2VsZWN0aW9uQ2hhbmdlKCkge1xuICAgIGNvbnNvbGUubG9nKCdvblNlbGVjdGlvbkNoYW5nZScpO1xuICAgIHZhciBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiB0cnVlIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogZmFsc2UgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gb25DdXJyZW50cGFnZWNoYW5nZSgpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgY3VycmVudFBhZ2UgPSBmaWdtYS5jdXJyZW50UGFnZTtcbiAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uQ3VycmVudHBhZ2VjaGFuZ2UnLCAnY3VycmVudFBhZ2UnOiBmaWdtYS5jdXJyZW50UGFnZVsnaWQnXSB9KVxufVxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9jb2RlLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=