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
console.log('2022-03-26');
// 启动插件时显示 UI
figma.showUI(__html__, { width: 300, height: 400 });
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
        var targetNode;
        // console.log('forEach:');
        // 搜索结果是否在当前页面
        let currentPage = figma.currentPage;
        let click_obj_target_page_id = msg['data']['page'];
        if (currentPage['id'] != click_obj_target_page_id) {
            // 点击对象不在当前页面，跳转到对应页面
            let document_children = figma.root.children;
            for (let index = 0; index < document_children.length; index++) {
                if (document_children[index]['id'] == click_obj_target_page_id) {
                    figma.currentPage = document_children[index];
                    break;
                }
            }
        }
        // 遍历搜索结果
        let len = target_Text_Node.length;
        for (var i = 0; i < len; i++) {
            if (target_Text_Node[i]['node'].id == msg.data['item']) {
                // 找到用户点击的图层
                targetNode === target_Text_Node[i]['node'];
                // Figma 视图定位到对应图层
                figma.viewport.scrollAndZoomIntoView([target_Text_Node[i]['node']]);
                // Figma 选中对应文本
                figma.currentPage.selectedTextRange = { 'node': target_Text_Node[i]['node'], 'start': msg.data['start'], 'end': msg.data['end'] };
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
        // setTimeout(() => {
        //   console.log('code.ts replace done');
        //   // 替换完毕，通知 UI 更新
        //   figma.ui.postMessage({ 'type': 'replace', 'done': true, 'hasMissingFontCount': hasMissingFontCount });
        // }, 30);
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
        //@ts-ignore
        figma.skipInvisibleInstanceChildren = true; // 忽略隐藏的图层
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
                        figma.ui.postMessage({ 'type': 'replace', 'done': false, 'my_progress': { 'index': my_progress, 'total': len }, 'hasMissingFontCount': hasMissingFontCount });
                    }, 10);
                }
            }, 0);
        });
        // resolve('1')
    });
} // async function replace
// Figma 图层选择变化时，通知 UI 显示不同的提示
function onSelectionChange() {
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
    console.log(figma.currentPage);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1EO0FBQ25ELG9EQUFvRDtBQUNwRCx3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDLHNDQUFzQztBQUN0QztBQUNBLHFEQUFxRCwyS0FBMks7QUFDaE87QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxHQUFHO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyw4QkFBOEI7QUFDOUIsMEJBQTBCO0FBQzFCLCtDQUErQyxtREFBbUQsb0NBQW9DLDhDQUE4QztBQUNwTCxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG9EQUFvRDtBQUNuRjtBQUNBO0FBQ0EsK0JBQStCLHFEQUFxRDtBQUNwRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qix1RUFBdUU7QUFDckc7Ozs7Ozs7O1VFamVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AZmlnbWEvcGx1Z2luLXR5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5sZXQgdGFyZ2V0X1RleHRfTm9kZSA9IFtdOyAvLyDlrZjlgqjnrKblkIjmkJzntKLmnaHku7bnmoQgVEVYVCDlm77lsYJcbmxldCBsb2FkZWRfZm9udHMgPSBbXTsgLy8g5bey5Yqg6L2955qE5a2X5L2T5YiX6KGoXG5sZXQgZmlsZVR5cGUgPSBmaWdtYS5lZGl0b3JUeXBlOyAvLyDlvZPliY0gZmlnbWEg5paH5Lu257G75Z6L77yaZmlnbWEvZmlnamFtXG5sZXQgaGFzTWlzc2luZ0ZvbnRDb3VudCA9IDA7IC8vIOabv+aNouaXtuiusOW9leS4jeaUr+aMgeWtl+S9k+eahOaVsOmHj1xubGV0IHNldGluZ19BYSA9IGZhbHNlOyAvLyDmmK/lkKbljLrliIblpKflsI/lhplcbmxldCBmaW5kX2FsbCA9IGZhbHNlOyAvLyDmmK/lkKbmkJzntKLmlbTkuKrmlofmoaNcbmxldCByZXFfY291dCA9IDA7IC8vIOaQnOe0oue7k+aenOaVsOmHj1xubGV0IG5vZGVfbGlzdCA9IFtdOyAvLyDlrZjlgqjmiYDmnIkgVEVYVCDlm77lsYJcbmNvbnNvbGUubG9nKCcyMDIyLTAzLTI2Jyk7XG4vLyDlkK/liqjmj5Lku7bml7bmmL7npLogVUlcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzAwLCBoZWlnaHQ6IDQwMCB9KTtcbi8vIOiOt+WPluaYr+WQpumAieS4reWbvuWxglxub25TZWxlY3Rpb25DaGFuZ2UoKTtcbi8vIOe7keWumiBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbkuovku7ZcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHsgb25TZWxlY3Rpb25DaGFuZ2UoKTsgfSk7XG4vLyDpgInkuK3nmoTpobXpnaLlj5HnlJ/lj5jljJZcbmZpZ21hLm9uKFwiY3VycmVudHBhZ2VjaGFuZ2VcIiwgKCkgPT4ge1xuICAgIG9uQ3VycmVudHBhZ2VjaGFuZ2UoKTtcbn0pO1xuLy8gVUkg5Y+R5p2l5raI5oGvXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIC8vIFVJIOS4reeCueWHu+S6huOAjOaQnOe0ouOAjeaMiemSrlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCcpO1xuICAgICAgICAvLyDorrDlvZXov5DooYzml7bplb9cbiAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGxldCBmaW5kX3N0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIC8vIOaJp+ihjOaQnOe0olxuICAgICAgICBmaW5kKG1zZy5kYXRhKTtcbiAgICAgICAgbGV0IGRvbmUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi2ZpbmQ6JyArIChkb25lIC0gZmluZF9zdGFydCkudG9TdHJpbmcoKSk7XG4gICAgICAgIGxldCB0b0hUTUw7IC8vIOWtmOWCqOimgeWPkee7mSB1aS50c3gg55qE5pWw5o2uXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZpbmRLZXlXb3JkX3N0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAvLyDlnKjmlofmnKzlm77lsYLkuK3ljLnphY3ljIXlkKvlhbPplK7lrZfnmoTlm77lsYJcbiAgICAgICAgICAgIHRvSFRNTCA9IGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwgbXNnLmRhdGEua2V5d29yZCk7XG4gICAgICAgICAgICBsZXQgZmluZEtleVdvcmRfZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn44CL44CL44CL44CL44CL44CL44CL44CL44CL44CLZmluZEtleVdvcmQ6JyArIChmaW5kS2V5V29yZF9lbmQgLSBmaW5kS2V5V29yZF9zdGFydCkudG9TdHJpbmcoKSk7XG4gICAgICAgIH0sIDIwKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlsIbmkJzntKLmlbDmja7lj5HpgIHnu5kgdWkudHN4XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ2RvbmUnOiB0cnVlLCAndGFyZ2V0X1RleHRfTm9kZSc6IHRvSFRNTCB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmluZCBlbmQsY291bnQ6Jyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVxX2NvdXQpO1xuICAgICAgICAgICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZG9uZScgfSlcbiAgICAgICAgICAgICAgICBsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAiycgKyBtc2cuZGF0YS5rZXl3b3JkICsgJzonICsgKGVuZCAtIHN0YXJ0KS50b1N0cmluZygpICsgJyBjb3VudDonICsgcmVxX2NvdXQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcV9jb3V0ID4gMzApIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucmVzaXplKDMwMCwgNTQwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAzMCk7XG4gICAgICAgIH0sIDQwKTtcbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75pCc57Si57uT5p6c6aG5XG4gICAgaWYgKG1zZy50eXBlID09PSAnbGlzdE9uQ2xpaycpIHtcbiAgICAgICAgdmFyIHRhcmdldE5vZGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3JFYWNoOicpO1xuICAgICAgICAvLyDmkJzntKLnu5PmnpzmmK/lkKblnKjlvZPliY3pobXpnaJcbiAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XG4gICAgICAgIGxldCBjbGlja19vYmpfdGFyZ2V0X3BhZ2VfaWQgPSBtc2dbJ2RhdGEnXVsncGFnZSddO1xuICAgICAgICBpZiAoY3VycmVudFBhZ2VbJ2lkJ10gIT0gY2xpY2tfb2JqX3RhcmdldF9wYWdlX2lkKSB7XG4gICAgICAgICAgICAvLyDngrnlh7vlr7nosaHkuI3lnKjlvZPliY3pobXpnaLvvIzot7PovazliLDlr7nlupTpobXpnaJcbiAgICAgICAgICAgIGxldCBkb2N1bWVudF9jaGlsZHJlbiA9IGZpZ21hLnJvb3QuY2hpbGRyZW47XG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZG9jdW1lbnRfY2hpbGRyZW4ubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50X2NoaWxkcmVuW2luZGV4XVsnaWQnXSA9PSBjbGlja19vYmpfdGFyZ2V0X3BhZ2VfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBkb2N1bWVudF9jaGlsZHJlbltpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyDpgY3ljobmkJzntKLnu5PmnpxcbiAgICAgICAgbGV0IGxlbiA9IHRhcmdldF9UZXh0X05vZGUubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmlkID09IG1zZy5kYXRhWydpdGVtJ10pIHtcbiAgICAgICAgICAgICAgICAvLyDmib7liLDnlKjmiLfngrnlh7vnmoTlm77lsYJcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlID09PSB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ107XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6KeG5Zu+5a6a5L2N5Yiw5a+55bqU5Zu+5bGCXG4gICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFt0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ11dKTtcbiAgICAgICAgICAgICAgICAvLyBGaWdtYSDpgInkuK3lr7nlupTmlofmnKxcbiAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3RlZFRleHRSYW5nZSA9IHsgJ25vZGUnOiB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10sICdzdGFydCc6IG1zZy5kYXRhWydzdGFydCddLCAnZW5kJzogbXNnLmRhdGFbJ2VuZCddIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pu/5o2i44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvZGUudHMgcmVwbGFjZScpO1xuICAgICAgICAvLyDmiafooYzmm7/mjaJcbiAgICAgICAgcmVwbGFjZShtc2cpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvZGUudHMgcmVwbGFjZSBkb25lJyk7XG4gICAgICAgICAgICAgICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICAgICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogdHJ1ZSwgJ2hhc01pc3NpbmdGb250Q291bnQnOiBoYXNNaXNzaW5nRm9udENvdW50IH0pO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCdjb2RlLnRzIHJlcGxhY2UgZG9uZScpO1xuICAgICAgICAvLyAgIC8vIOabv+aNouWujOavle+8jOmAmuefpSBVSSDmm7TmlrBcbiAgICAgICAgLy8gICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnLCAnZG9uZSc6IHRydWUsICdoYXNNaXNzaW5nRm9udENvdW50JzogaGFzTWlzc2luZ0ZvbnRDb3VudCB9KTtcbiAgICAgICAgLy8gfSwgMzApO1xuICAgIH1cbiAgICAvLyBVSSDkuK3ov5vooYzmkJzntKLorr7nva5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdoYW5kbGVfc2V0aW5nX2NsaWNrJykge1xuICAgICAgICBzd2l0Y2ggKG1zZ1snZGF0YSddWyd0eXBlJ10pIHtcbiAgICAgICAgICAgIGNhc2UgJ3NldGluZ19BYSc6XG4gICAgICAgICAgICAgICAgc2V0aW5nX0FhID0gbXNnWydkYXRhJ11bJ2RhdGEnXVsnY2hlY2tlZCddO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZmluZF9hbGwnOlxuICAgICAgICAgICAgICAgIGZpbmRfYWxsID0gbXNnWydkYXRhJ11bJ2RhdGEnXVsnY2hlY2tlZCddO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG4vLyDliqDovb3lrZfkvZNcbmZ1bmN0aW9uIG15TG9hZEZvbnRBc3luYyh0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXlMb2FkRm9udEFzeW5jOicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXh0X2xheWVyX0xpc3QpO1xuICAgICAgICBmb3IgKGxldCBsYXllciBvZiB0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICAgICAgICAgIGlmIChsYXllclsnbm9kZSddWydjaGFyYWN0ZXJzJ10ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tJyk7XG4gICAgICAgICAgICAvLyDliqDovb3lrZfkvZNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxheWVyKTtcbiAgICAgICAgICAgIGxldCBmb250cyA9IGxheWVyWydub2RlJ10uZ2V0UmFuZ2VBbGxGb250TmFtZXMoMCwgbGF5ZXJbJ25vZGUnXVsnY2hhcmFjdGVycyddLmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9udHM6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmb250cyk7XG4gICAgICAgICAgICBmb3IgKGxldCBmb250IG9mIGZvbnRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJpbmdvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbG9hZGVkX2ZvbnQgb2YgbG9hZGVkX2ZvbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWRfZm9udFsnZmFtaWx5J10gPT0gZm9udFsnZmFtaWx5J10gJiYgbG9hZGVkX2ZvbnRbJ3N0eWxlJ10gPT0gZm9udFsnc3R5bGUnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmluZ28gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYmluZ28pO1xuICAgICAgICAgICAgICAgIGlmIChiaW5nbykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWtl+S9k+aYr+WQpuaUr+aMgVxuICAgICAgICAgICAgICAgICAgICBpZiAobGF5ZXJbJ25vZGUnXS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LiN5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGFzTWlzc2luZ0ZvbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkX2ZvbnRzLnB1c2goZm9udCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbG9hZEZvbnRBc3luYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhmb250KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhteUZvbnQpO1xuICAgICAgICAvLyBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Rm9udClcbiAgICAgICAgcmV0dXJuICdkb25lJztcbiAgICB9KTtcbn1cbi8vIOaJvuWHuuaJgOacieaWh+acrOWbvuWxglxuZnVuY3Rpb24gZmluZChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbmRlLnRzOmZpbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2coZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIC8vIOa4heepuuWOhuWPsuaQnOe0ouaVsOaNru+8jOmHjeaWsOaQnOe0olxuICAgIHRhcmdldF9UZXh0X05vZGUgPSBbXTtcbiAgICBpZiAoZmluZF9hbGwpIHtcbiAgICAgICAgLy/mkJzntKLmlbTkuKrmlofmoaNcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGxldCBzZWxlY3Rpb24gPSBmaWdtYS5yb290LmNoaWxkcmVuO1xuICAgICAgICBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo5omA5pyJIFRFWFQg5Zu+5bGCXG4gICAgICAgIGxldCBub2RlX2xpc3RfdGVtcDtcbiAgICAgICAgbGV0IGpzb25fZGF0YV90ZW1wO1xuICAgICAgICBsZXQgbGVuID0gc2VsZWN0aW9uLmxlbmd0aDtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGZpZ21hLnNraXBJbnZpc2libGVJbnN0YW5jZUNoaWxkcmVuID0gdHJ1ZTsgLy8g5b+955Wl6ZqQ6JeP55qE5Zu+5bGCXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGVfbGlzdF90ZW1wID0gW107XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLkuIvmsqHmnInlrZDlm77lsYJcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uW2ldLmNoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5paH5pys5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3RfdGVtcCA9IHNlbGVjdGlvbltpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pO1xuICAgICAgICAgICAgICAgICAgICBqc29uX2RhdGFfdGVtcCA9IHsgJ3BhZ2UnOiBzZWxlY3Rpb25baV1bJ25hbWUnXSwgJ3BhZ2VfaWQnOiBzZWxlY3Rpb25baV1bJ2lkJ10sICdub2RlX2xpc3QnOiBub2RlX2xpc3RfdGVtcCB9O1xuICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3QucHVzaChqc29uX2RhdGFfdGVtcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyDlvZPliY3pgInkuK3nmoTlm77lsYJcbiAgICAgICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8g5b2T5YmN5pyJ6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo6YCJ5Lit55qE5Zu+5bGC5Lit5pCc57SiXG4gICAgICAgICAgICAvLyDlnKjlvZPliY3pgInkuK3nmoTlm77lsYLkuK3vvIzmkJzntKLmlofmnKzlm77lsYJcbiAgICAgICAgfVxuICAgICAgICBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo5omA5pyJIFRFWFQg5Zu+5bGCXG4gICAgICAgIC8vIGxldCBjaGlsZHJlbl9saXN0ID0gW10gICAgLy8g5ouG5YiG5Zu+5bGC77yM6YCQ5Liq5pCc57Si77yM6YG/5YWN55WM6Z2i6ZW/5pe26Ze05oyC6LW3XG4gICAgICAgIGxldCBsZW4gPSBzZWxlY3Rpb24ubGVuZ3RoO1xuICAgICAgICBsZXQgbm9kZV9saXN0X3RlbXAgPSBbXTtcbiAgICAgICAgbGV0IGpzb25fZGF0YV90ZW1wO1xuICAgICAgICAvLyDpgY3ljobojIPlm7TlhoXnmoTlm77lsYLvvIzojrflj5YgVEVYVCDlm77lsYJcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGZpZ21hLnNraXBJbnZpc2libGVJbnN0YW5jZUNoaWxkcmVuID0gdHJ1ZTsgLy8g5b+955Wl6ZqQ6JeP55qE5Zu+5bGCXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOWbvuWxguacrOi6q+WwseaYr+aWh+acrOWbvuWxglxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb25baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0X3RlbXAucHVzaChzZWxlY3Rpb25baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5rKh5pyJ5a2Q5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uW2ldLmNoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5paH5pys5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVfbGlzdF90ZW1wID0gbm9kZV9saXN0X3RlbXAuY29uY2F0KHNlbGVjdGlvbltpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlX2xpc3QgPSBbeyAncGFnZSc6IGZpZ21hLmN1cnJlbnRQYWdlWyduYW1lJ10sICdwYWdlX2lkJzogZmlnbWEuY3VycmVudFBhZ2VbJ2lkJ10sICdub2RlX2xpc3QnOiBub2RlX2xpc3RfdGVtcCB9XTtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyByZXR1cm4gbm9kZV9saXN0XG59XG4vLyDmkJzntKLvvJrlnKjmlofmnKzlm77lsYLkuK3vvIzljLnphY3lhbPplK7lrZdcbmZ1bmN0aW9uIGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwga2V5d29yZCkge1xuICAgIGNvbnNvbGUubG9nKCdmdW5jIGZpbmRLZXlXb3JkIGJlZ2luJyk7XG4gICAgcmVxX2NvdXQgPSAwOyAvLyDmkJzntKLnu5PmnpzmlbDph49cbiAgICBsZXQgZGF0YV9pdGVtX2xpc3QgPSBbXTtcbiAgICBsZXQgZGF0YV90ZW1wO1xuICAgIGxldCBub2RlOyAvLyDorrDlvZXpgY3ljobliLDnmoTlm77lsYJcbiAgICBsZXQgbGVuID0gbm9kZV9saXN0Lmxlbmd0aDtcbiAgICBsZXQgbXlfcHJvZ3Jlc3MgPSAwOyAvLyDov5vluqbkv6Hmga9cbiAgICAvLyDlv73nlaXlpKflsI/lhplcbiAgICBpZiAoc2V0aW5nX0FhICE9IHRydWUpIHtcbiAgICAgICAga2V5d29yZCA9IGtleXdvcmQudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coJ2tleXdvcmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2coa2V5d29yZCk7XG4gICAgbGV0IG5vZGVfbGVuX3N1bSA9IDA7XG4gICAgbm9kZV9saXN0LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIG5vZGVfbGVuX3N1bSArPSBpdGVtWydub2RlX2xpc3QnXS5sZW5ndGg7XG4gICAgfSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsZXQgbGlzdF9sZW5ndGggPSBub2RlX2xpc3RbaV1bJ25vZGVfbGlzdCddLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsaXN0X2xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBteV9wcm9ncmVzcysrO1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZCcsICdkb25lJzogZmFsc2UsICdteV9wcm9ncmVzcyc6IHsgJ2luZGV4JzogbXlfcHJvZ3Jlc3MsICd0b3RhbCc6IG5vZGVfbGVuX3N1bSB9IH0pO1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlX2xpc3RbaV1bJ25vZGVfbGlzdCddW2pdO1xuICAgICAgICAgICAgICAgIGxldCBub2RlX2NoYXJhY3RlcnM7XG4gICAgICAgICAgICAgICAgLy8g5b+955Wl5aSn5bCP5YaZXG4gICAgICAgICAgICAgICAgaWYgKHNldGluZ19BYSAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVfY2hhcmFjdGVycyA9IG5vZGVbJ2NoYXJhY3RlcnMnXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9jaGFyYWN0ZXJzID0gbm9kZVsnY2hhcmFjdGVycyddO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZV9jaGFyYWN0ZXJzLmluZGV4T2Yoa2V5d29yZCkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDmib7liLDlhbPplK7or40o5b+955Wl5aSn5bCP5YaZKVxuICAgICAgICAgICAgICAgICAgICAvLyDliKTmlq3npZblhYjlm77lsYLnmoTnirbmgIHvvIzljIXmi6zpmpDol4/jgIHplIHlrprjgIHnu4Tku7bjgIHlrp7kvovlsZ7mgKdcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoaXNfcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzTG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmNlc3Rvcl90eXBlID0gJyc7IC8vIOe7hOS7ti/lrp7kvosv5YW25LuWXG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSB8fCBhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/plIHlrprmiJbpmpDol4/nirbmgIFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluelluWFiOWFg+e0oOeahOeKtuaAgVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc19wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzX3BhcmVudC50eXBlICE9ICdQQUdFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC5sb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQudHlwZSA9PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl90eXBlID0gJ0NPTVBPTkVOVCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC50eXBlID09ICdJTlNUQU5DRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfdHlwZSA9ICdJTlNUQU5DRSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlIHx8IGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpICYmIGFuY2VzdG9yX3R5cGUgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzX3BhcmVudCA9IHRoaXNfcGFyZW50LnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8g5Y2V5Liq5Zu+5bGC55qE5pWw5o2u77yM5a2Y5YKo5YiwIHRhcmdldF9UZXh0X05vZGUg5Lit77yM5oul5pyJ5ZCO57ut55qE5pu/5o2i5bel5L2cXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUucHVzaCh7ICdub2RlJzogbm9kZSwgJ2FuY2VzdG9yX2lzVmlzaWJsZSc6IGFuY2VzdG9yX2lzVmlzaWJsZSwgJ2FuY2VzdG9yX2lzTG9ja2VkJzogYW5jZXN0b3JfaXNMb2NrZWQsICdhbmNlc3Rvcl90eXBlJzogYW5jZXN0b3JfdHlwZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5p6E5bu65pWw5o2u77yM5Lyg6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXl3b3JkX2xlbmd0aCA9IGtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO5Y2V5LiqIFRFWFQg5Zu+5bGC5YaF5Y+v6IO95a2Y5Zyo5aSa5Liq56ym5ZCI5p2h5Lu255qE5a2X56ym77yM5omA5Lul6ZyA6KaB5b6q546v5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IG5vZGVfY2hhcmFjdGVycy5pbmRleE9mKGtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5p+l5om+55qE5a2X56ym6LW35aeL44CB57uI5q2i5L2N572u5Y+R6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5q+P5Liq5YWz6ZSu5a2X55qE5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV90ZW1wID0geyAncGFnZV9uYW1lJzogbm9kZV9saXN0W2ldWydwYWdlJ10sICdwYWdlX2lkJzogbm9kZV9saXN0W2ldWydwYWdlX2lkJ10sICdpZCc6IG5vZGUuaWQsICdjaGFyYWN0ZXJzJzogbm9kZS5jaGFyYWN0ZXJzLCAnc3RhcnQnOiBpbmRleCwgJ2VuZCc6IGluZGV4ICsga2V5d29yZC5sZW5ndGgsICdoYXNNaXNzaW5nRm9udCc6IG5vZGUuaGFzTWlzc2luZ0ZvbnQsICdhbmNlc3Rvcl90eXBlJzogYW5jZXN0b3JfdHlwZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXFfY291dCA8IDIwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOW3sue7j+acieaQnOe0oue7k+aenO+8jOWImeWFiOWPkemAgeS4gOmDqOWIhuaYvuekuuWcqCBVSSDkuK3vvIzmj5DljYfmkJzntKLliqDovb3nirbmgIHnmoTkvZPpqoxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ2RvbmUnOiBmYWxzZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbm9kZV9sZW5fc3VtIH0sICd0YXJnZXRfVGV4dF9Ob2RlJzogW2RhdGFfdGVtcF0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2l0ZW1fbGlzdC5wdXNoKGRhdGFfdGVtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOe7n+iuoeaQnOe0oue7k+aenOaVsOmHj1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcV9jb3V0Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6+572u5p+l5om+55uu5qCH5a2X56ym5Liy55qE5YGP56e7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBpbmRleCArIGtleXdvcmRfbGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBpZlxuICAgICAgICAgICAgICAgICAgICB9IC8vIHdoaWxlXG4gICAgICAgICAgICAgICAgfSAvLyBpZiAobm9kZVsnY2hhcmFjdGVycyddLmluZGV4T2Yoa2V5d29yZCkgPiAtMSlcbiAgICAgICAgICAgIH0sIDEwKTsgLy8gc2V0VGltZW91dFxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhX2l0ZW1fbGlzdDtcbn1cbi8vIOabv+aNolxuZnVuY3Rpb24gcmVwbGFjZShkYXRhKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlcGxhY2UnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICAvLyDlpoLmnpzooqvmm7/mjaLnmoTlrZfnrKbmmK8gJycg5YiZ5Lya6Zm35YWl5q275b6q546v77yM5omA5Lul6KaB5Yik5pat5LiA5LiLXG4gICAgICAgIGlmIChkYXRhLmRhdGEua2V5d29yZCA9PSAnJykge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KCdQbGVhc2UgZW50ZXIgdGhlIGNoYXJhY3RlcnMgeW91IHdhbnQgdG8gcmVwbGFjZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG15TG9hZEZvbnRBc3luYyh0YXJnZXRfVGV4dF9Ob2RlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGhhc01pc3NpbmdGb250Q291bnQgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IHRhcmdldF9UZXh0X05vZGUubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IG15X3Byb2dyZXNzID0gMDsgLy8g6L+b5bqm5L+h5oGvXG4gICAgICAgICAgICBsZXQga2V5d29yZCA9IGRhdGEuZGF0YS5rZXl3b3JkOyAvLyDlhbPplK7lrZdcbiAgICAgICAgICAgIGxldCBuZXdDaGFyYWN0ZXJzID0gZGF0YS5kYXRhLnJlcGxhY2Vfd29yZDsgLy8g6ZyA6KaB5pu/5o2i5oiQ5Lul5LiL5a2X56ymXG4gICAgICAgICAgICAvLyDlv73nlaXlpKflsI/lhplcbiAgICAgICAgICAgIGlmIChzZXRpbmdfQWEgIT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGtleXdvcmQgPSBrZXl3b3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gbGVuOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXlfcHJvZ3Jlc3MrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG15X3Byb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogZmFsc2UsICdteV9wcm9ncmVzcyc6IHsgJ2luZGV4JzogbXlfcHJvZ3Jlc3MsICd0b3RhbCc6IGxlbn0sJ2hhc01pc3NpbmdGb250Q291bnQnOmhhc01pc3NpbmdGb250Q291bnQgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ2FuY2VzdG9yX2lzVmlzaWJsZSddID09IGZhbHNlIHx8IHRhcmdldF9UZXh0X05vZGVbaV1bJ2FuY2VzdG9yX2lzTG9ja2VkJ10gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOW/veeVpemakOiXj+OAgemUgeWumueahOWbvuWxglxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddWydmb250TmFtZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2X5L2T5LiN5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdoYXNNaXNzaW5nRm9udCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhoYXNNaXNzaW5nRm9udENvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzTWlzc2luZ0ZvbnRDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRTdHlsZSA9IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoWydpbmRlbnRhdGlvbicsICdsaXN0T3B0aW9ucyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RleHRTdHlsZTonKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGV4dFN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFN0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldEVuZCA9IDA7IC8vIOiusOW9leS/ruaUueWtl+espuWQjueahOe0ouW8leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVUZW1wID0gW107IC8vIOiusOW9leavj+S4quauteiQveagt+W8j+WcqOS/ruaUueWQjueahOagt+W8j+e0ouW8le+8iOWcqOabv+aNouWujOWtl+espuWQjumcgOimgeiuvue9ruWbnuS5i+WJjeeahOagt+W8j++8iVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdF9vZmZzZXRFbmQgPSAwOyAvLyDorrDlvZXkuIrkuIDkuKrmrrXokL3nmoTmnKvlsL7ntKLlvJVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pu/5o2i55uu5qCH5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW1lbnRfY2hhcmFjdGVycyA9IGVsZW1lbnQuY2hhcmFjdGVycztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXRpbmdfQWEgIT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRfY2hhcmFjdGVycyA9IGVsZW1lbnRfY2hhcmFjdGVycy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO5Y2V5Liq5q616JC95YaF5Y+v6IO95a2Y5Zyo5aSa5Liq56ym5ZCI5p2h5Lu255qE5a2X56ym77yM5omA5Lul6ZyA6KaB5b6q546v5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluWMuemFjeWIsOeahOWtl+espueahOe0ouW8lVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZWxlbWVudF9jaGFyYWN0ZXJzLmluZGV4T2Yoa2V5d29yZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOacieWMuemFjeeahOWtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXmlrDlrZfnrKbpnIDopoHmj5LlhaXnmoTkvY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluc2VydFN0YXJ0ID0gaW5kZXggKyBrZXl3b3JkLmxlbmd0aCArIGVsZW1lbnRbJ3N0YXJ0J107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbnNlcnRTdGFydDonICsgaW5zZXJ0U3RhcnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWcqOe0ouW8leWQjuaPkuWFpeaWsOWtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaW5zZXJ0Q2hhcmFjdGVycyhpbnNlcnRTdGFydCArIG9mZnNldEVuZCwgbmV3Q2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOagueaNrue0ouW8leWIoOmZpOaXp+Wtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uZGVsZXRlQ2hhcmFjdGVycyhpbmRleCArIGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRFbmQsIGluc2VydFN0YXJ0ICsgb2Zmc2V0RW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5YGP56e75pWw5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9mZnNldFN0YXJ0ID0gbGFzdF9vZmZzZXRFbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0RW5kICs9IG5ld0NoYXJhY3RlcnMubGVuZ3RoIC0ga2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGlsZSBvZmZzZXRTdGFydDonICsgb2Zmc2V0U3RhcnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGlsZSBvZmZzZXRFbmQ6JyArIG9mZnNldEVuZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5qOA57Si5Yiw55uu5qCH5a2X56ym55qE57Si5byV77yM5LiL5LiA5qyhIHdoaWxlIOW+queOr+WcqOatpOS9jee9ruWQjuW8gOWni+afpeaJvlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4ICsga2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmsqHmnInljLnphY3nmoTlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIHdoaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlsIbljZXkuKrmrrXokL3nmoTnvKnov5vjgIHluo/lj7fmoLflvI/orrDlvZXliLDmlbDnu4TlhoVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlVGVtcC5wdXNoKHsgJ3N0YXJ0JzogbGFzdF9vZmZzZXRFbmQsICdlbmQnOiBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgJ2luZGVudGF0aW9uJzogZWxlbWVudFsnaW5kZW50YXRpb24nXSA+IDAgPyBlbGVtZW50WydpbmRlbnRhdGlvbiddIDogMCwgJ2xpc3RPcHRpb25zJzogZWxlbWVudFsnbGlzdE9wdGlvbnMnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rfb2Zmc2V0RW5kID0gZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyDorr7nva7nvKnov5tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5zZXRSYW5nZUluZGVudGF0aW9uKGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRTdGFydCwgZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsIGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gPiAwID8gZWxlbWVudFsnaW5kZW50YXRpb24nXSAtIDEgOiBlbGVtZW50WydpbmRlbnRhdGlvbiddKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8g6K6+572u5bqP5Y+3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uc2V0UmFuZ2VMaXN0T3B0aW9ucyhlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnQsIGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCBlbGVtZW50WydsaXN0T3B0aW9ucyddKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsgLy8gdGV4dFN0eWxlLmZvckVhY2hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6+572u57yp6L+b44CB5bqP5Y+3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0eWxlVGVtcCDorrDlvZXkuobmr4/kuKrmrrXokL3nmoTnvKnov5vjgIHluo/lj7fmoLflvI/vvIzpgY3ljobmlbDnu4Tkvb/lvpfkv67mlLnlrZfnrKblkI7nmoTmlofmnKzlm77lsYLmoLflvI/kuI3lj5hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVUZW1wLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzmlofmnKzkuLrnqbrvvIzliJnkuI3mlK/mjIHorr7nva7moLflvI/vvIjkvJrmiqXplJnvvIlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uY2hhcmFjdGVycyAhPSAnJyAmJiBlbGVtZW50WydlbmQnXSA+IGVsZW1lbnRbJ3N0YXJ0J10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5zZXRSYW5nZUxpc3RPcHRpb25zKGVsZW1lbnRbJ3N0YXJ0J10sIGVsZW1lbnRbJ2VuZCddLCBlbGVtZW50WydsaXN0T3B0aW9ucyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uc2V0UmFuZ2VJbmRlbnRhdGlvbihlbGVtZW50WydzdGFydCddLCBlbGVtZW50WydlbmQnXSwgZWxlbWVudFsnaW5kZW50YXRpb24nXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnLCAnZG9uZSc6IGZhbHNlLCAnbXlfcHJvZ3Jlc3MnOiB7ICdpbmRleCc6IG15X3Byb2dyZXNzLCAndG90YWwnOiBsZW4gfSwgJ2hhc01pc3NpbmdGb250Q291bnQnOiBoYXNNaXNzaW5nRm9udENvdW50IH0pO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyByZXNvbHZlKCcxJylcbiAgICB9KTtcbn0gLy8gYXN5bmMgZnVuY3Rpb24gcmVwbGFjZVxuLy8gRmlnbWEg5Zu+5bGC6YCJ5oup5Y+Y5YyW5pe277yM6YCa55+lIFVJIOaYvuekuuS4jeWQjOeahOaPkOekulxuZnVuY3Rpb24gb25TZWxlY3Rpb25DaGFuZ2UoKSB7XG4gICAgdmFyIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IHRydWUgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiBmYWxzZSB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBvbkN1cnJlbnRwYWdlY2hhbmdlKCkge1xuICAgIGNvbnNvbGUubG9nKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uQ3VycmVudHBhZ2VjaGFuZ2UnLCAnY3VycmVudFBhZ2UnOiBmaWdtYS5jdXJyZW50UGFnZVsnaWQnXSB9KVxufVxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9jb2RlLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=