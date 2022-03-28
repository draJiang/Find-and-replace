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
console.log(figma.root);
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
        console.log(msg);
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
        console.log(msg);
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
                        console.log(node_list_temp);
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
    console.log(node_list);
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
    for (let i = len - 1; i > -1; i--) {
        for (let j = node_list[i]['node_list'].length - 1; j >= 0; j--) {
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
                                console.log('data_temp:');
                                console.log(data_temp);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRCxvREFBb0Q7QUFDcEQsd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQyxzQ0FBc0M7QUFDdEM7QUFDQSxxREFBcUQsMktBQTJLO0FBQ2hPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsR0FBRztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakMsOEJBQThCO0FBQzlCLDBCQUEwQjtBQUMxQiwrQ0FBK0MsbURBQW1ELG9DQUFvQyw4Q0FBOEM7QUFDcEwscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvREFBb0Q7QUFDbkY7QUFDQTtBQUNBLCtCQUErQixxREFBcUQ7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsdUVBQXVFO0FBQ3JHOzs7Ozs7OztVRXZlQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS8uL3NyYy9jb2RlLnRzIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQGZpZ21hL3BsdWdpbi10eXBpbmdzL2luZGV4LmQudHNcIiAvPlxubGV0IHRhcmdldF9UZXh0X05vZGUgPSBbXTsgLy8g5a2Y5YKo56ym5ZCI5pCc57Si5p2h5Lu255qEIFRFWFQg5Zu+5bGCXG5sZXQgbG9hZGVkX2ZvbnRzID0gW107IC8vIOW3suWKoOi9veeahOWtl+S9k+WIl+ihqFxubGV0IGZpbGVUeXBlID0gZmlnbWEuZWRpdG9yVHlwZTsgLy8g5b2T5YmNIGZpZ21hIOaWh+S7tuexu+Wei++8mmZpZ21hL2ZpZ2phbVxubGV0IGhhc01pc3NpbmdGb250Q291bnQgPSAwOyAvLyDmm7/mjaLml7borrDlvZXkuI3mlK/mjIHlrZfkvZPnmoTmlbDph49cbmxldCBzZXRpbmdfQWEgPSBmYWxzZTsgLy8g5piv5ZCm5Yy65YiG5aSn5bCP5YaZXG5sZXQgZmluZF9hbGwgPSBmYWxzZTsgLy8g5piv5ZCm5pCc57Si5pW05Liq5paH5qGjXG5sZXQgcmVxX2NvdXQgPSAwOyAvLyDmkJzntKLnu5PmnpzmlbDph49cbmxldCBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo5omA5pyJIFRFWFQg5Zu+5bGCXG5jb25zb2xlLmxvZygnMjAyMi0wMy0yNicpO1xuY29uc29sZS5sb2coZmlnbWEucm9vdCk7XG4vLyDlkK/liqjmj5Lku7bml7bmmL7npLogVUlcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzAwLCBoZWlnaHQ6IDQwMCB9KTtcbi8vIOiOt+WPluaYr+WQpumAieS4reWbvuWxglxub25TZWxlY3Rpb25DaGFuZ2UoKTtcbi8vIOe7keWumiBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbkuovku7ZcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHsgb25TZWxlY3Rpb25DaGFuZ2UoKTsgfSk7XG4vLyDpgInkuK3nmoTpobXpnaLlj5HnlJ/lj5jljJZcbmZpZ21hLm9uKFwiY3VycmVudHBhZ2VjaGFuZ2VcIiwgKCkgPT4ge1xuICAgIG9uQ3VycmVudHBhZ2VjaGFuZ2UoKTtcbn0pO1xuLy8gVUkg5Y+R5p2l5raI5oGvXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIC8vIFVJIOS4reeCueWHu+S6huOAjOaQnOe0ouOAjeaMiemSrlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCcpO1xuICAgICAgICAvLyDorrDlvZXov5DooYzml7bplb9cbiAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGxldCBmaW5kX3N0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIC8vIOaJp+ihjOaQnOe0olxuICAgICAgICBmaW5kKG1zZy5kYXRhKTtcbiAgICAgICAgbGV0IGRvbmUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi2ZpbmQ6JyArIChkb25lIC0gZmluZF9zdGFydCkudG9TdHJpbmcoKSk7XG4gICAgICAgIGxldCB0b0hUTUw7IC8vIOWtmOWCqOimgeWPkee7mSB1aS50c3gg55qE5pWw5o2uXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZpbmRLZXlXb3JkX3N0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAvLyDlnKjmlofmnKzlm77lsYLkuK3ljLnphY3ljIXlkKvlhbPplK7lrZfnmoTlm77lsYJcbiAgICAgICAgICAgIHRvSFRNTCA9IGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwgbXNnLmRhdGEua2V5d29yZCk7XG4gICAgICAgICAgICBsZXQgZmluZEtleVdvcmRfZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn44CL44CL44CL44CL44CL44CL44CL44CL44CL44CLZmluZEtleVdvcmQ6JyArIChmaW5kS2V5V29yZF9lbmQgLSBmaW5kS2V5V29yZF9zdGFydCkudG9TdHJpbmcoKSk7XG4gICAgICAgIH0sIDIwKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlsIbmkJzntKLmlbDmja7lj5HpgIHnu5kgdWkudHN4XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ2RvbmUnOiB0cnVlLCAndGFyZ2V0X1RleHRfTm9kZSc6IHRvSFRNTCB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmluZCBlbmQsY291bnQ6Jyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVxX2NvdXQpO1xuICAgICAgICAgICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZG9uZScgfSlcbiAgICAgICAgICAgICAgICBsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAiycgKyBtc2cuZGF0YS5rZXl3b3JkICsgJzonICsgKGVuZCAtIHN0YXJ0KS50b1N0cmluZygpICsgJyBjb3VudDonICsgcmVxX2NvdXQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcV9jb3V0ID4gMzApIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucmVzaXplKDMwMCwgNTQwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAzMCk7XG4gICAgICAgIH0sIDQwKTtcbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75pCc57Si57uT5p6c6aG5XG4gICAgaWYgKG1zZy50eXBlID09PSAnbGlzdE9uQ2xpaycpIHtcbiAgICAgICAgdmFyIHRhcmdldE5vZGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3JFYWNoOicpO1xuICAgICAgICAvLyDmkJzntKLnu5PmnpzmmK/lkKblnKjlvZPliY3pobXpnaJcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgbGV0IGN1cnJlbnRQYWdlID0gZmlnbWEuY3VycmVudFBhZ2U7XG4gICAgICAgIGxldCBjbGlja19vYmpfdGFyZ2V0X3BhZ2VfaWQgPSBtc2dbJ2RhdGEnXVsncGFnZSddO1xuICAgICAgICBpZiAoY3VycmVudFBhZ2VbJ2lkJ10gIT0gY2xpY2tfb2JqX3RhcmdldF9wYWdlX2lkKSB7XG4gICAgICAgICAgICAvLyDngrnlh7vlr7nosaHkuI3lnKjlvZPliY3pobXpnaLvvIzot7PovazliLDlr7nlupTpobXpnaJcbiAgICAgICAgICAgIGxldCBkb2N1bWVudF9jaGlsZHJlbiA9IGZpZ21hLnJvb3QuY2hpbGRyZW47XG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZG9jdW1lbnRfY2hpbGRyZW4ubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50X2NoaWxkcmVuW2luZGV4XVsnaWQnXSA9PSBjbGlja19vYmpfdGFyZ2V0X3BhZ2VfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2UgPSBkb2N1bWVudF9jaGlsZHJlbltpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyDpgY3ljobmkJzntKLnu5PmnpxcbiAgICAgICAgbGV0IGxlbiA9IHRhcmdldF9UZXh0X05vZGUubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmlkID09IG1zZy5kYXRhWydpdGVtJ10pIHtcbiAgICAgICAgICAgICAgICAvLyDmib7liLDnlKjmiLfngrnlh7vnmoTlm77lsYJcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlID09PSB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ107XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6KeG5Zu+5a6a5L2N5Yiw5a+55bqU5Zu+5bGCXG4gICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFt0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ11dKTtcbiAgICAgICAgICAgICAgICAvLyBGaWdtYSDpgInkuK3lr7nlupTmlofmnKxcbiAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3RlZFRleHRSYW5nZSA9IHsgJ25vZGUnOiB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10sICdzdGFydCc6IG1zZy5kYXRhWydzdGFydCddLCAnZW5kJzogbXNnLmRhdGFbJ2VuZCddIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pu/5o2i44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvZGUudHMgcmVwbGFjZScpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAvLyDmiafooYzmm7/mjaJcbiAgICAgICAgcmVwbGFjZShtc2cpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvZGUudHMgcmVwbGFjZSBkb25lJyk7XG4gICAgICAgICAgICAgICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICAgICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogdHJ1ZSwgJ2hhc01pc3NpbmdGb250Q291bnQnOiBoYXNNaXNzaW5nRm9udENvdW50IH0pO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCdjb2RlLnRzIHJlcGxhY2UgZG9uZScpO1xuICAgICAgICAvLyAgIC8vIOabv+aNouWujOavle+8jOmAmuefpSBVSSDmm7TmlrBcbiAgICAgICAgLy8gICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnLCAnZG9uZSc6IHRydWUsICdoYXNNaXNzaW5nRm9udENvdW50JzogaGFzTWlzc2luZ0ZvbnRDb3VudCB9KTtcbiAgICAgICAgLy8gfSwgMzApO1xuICAgIH1cbiAgICAvLyBVSSDkuK3ov5vooYzmkJzntKLorr7nva5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdoYW5kbGVfc2V0aW5nX2NsaWNrJykge1xuICAgICAgICBzd2l0Y2ggKG1zZ1snZGF0YSddWyd0eXBlJ10pIHtcbiAgICAgICAgICAgIGNhc2UgJ3NldGluZ19BYSc6XG4gICAgICAgICAgICAgICAgc2V0aW5nX0FhID0gbXNnWydkYXRhJ11bJ2RhdGEnXVsnY2hlY2tlZCddO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZmluZF9hbGwnOlxuICAgICAgICAgICAgICAgIGZpbmRfYWxsID0gbXNnWydkYXRhJ11bJ2RhdGEnXVsnY2hlY2tlZCddO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG4vLyDliqDovb3lrZfkvZNcbmZ1bmN0aW9uIG15TG9hZEZvbnRBc3luYyh0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXlMb2FkRm9udEFzeW5jOicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXh0X2xheWVyX0xpc3QpO1xuICAgICAgICBmb3IgKGxldCBsYXllciBvZiB0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICAgICAgICAgIGlmIChsYXllclsnbm9kZSddWydjaGFyYWN0ZXJzJ10ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tJyk7XG4gICAgICAgICAgICAvLyDliqDovb3lrZfkvZNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxheWVyKTtcbiAgICAgICAgICAgIGxldCBmb250cyA9IGxheWVyWydub2RlJ10uZ2V0UmFuZ2VBbGxGb250TmFtZXMoMCwgbGF5ZXJbJ25vZGUnXVsnY2hhcmFjdGVycyddLmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9udHM6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmb250cyk7XG4gICAgICAgICAgICBmb3IgKGxldCBmb250IG9mIGZvbnRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJpbmdvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbG9hZGVkX2ZvbnQgb2YgbG9hZGVkX2ZvbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWRfZm9udFsnZmFtaWx5J10gPT0gZm9udFsnZmFtaWx5J10gJiYgbG9hZGVkX2ZvbnRbJ3N0eWxlJ10gPT0gZm9udFsnc3R5bGUnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmluZ28gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYmluZ28pO1xuICAgICAgICAgICAgICAgIGlmIChiaW5nbykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWtl+S9k+aYr+WQpuaUr+aMgVxuICAgICAgICAgICAgICAgICAgICBpZiAobGF5ZXJbJ25vZGUnXS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LiN5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGFzTWlzc2luZ0ZvbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkX2ZvbnRzLnB1c2goZm9udCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbG9hZEZvbnRBc3luYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhmb250KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhteUZvbnQpO1xuICAgICAgICAvLyBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Rm9udClcbiAgICAgICAgcmV0dXJuICdkb25lJztcbiAgICB9KTtcbn1cbi8vIOaJvuWHuuaJgOacieaWh+acrOWbvuWxglxuZnVuY3Rpb24gZmluZChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbmRlLnRzOmZpbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2coZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIC8vIOa4heepuuWOhuWPsuaQnOe0ouaVsOaNru+8jOmHjeaWsOaQnOe0olxuICAgIHRhcmdldF9UZXh0X05vZGUgPSBbXTtcbiAgICBpZiAoZmluZF9hbGwpIHtcbiAgICAgICAgLy/mkJzntKLmlbTkuKrmlofmoaNcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGxldCBzZWxlY3Rpb24gPSBmaWdtYS5yb290LmNoaWxkcmVuO1xuICAgICAgICBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo5omA5pyJIFRFWFQg5Zu+5bGCXG4gICAgICAgIGxldCBub2RlX2xpc3RfdGVtcDtcbiAgICAgICAgbGV0IGpzb25fZGF0YV90ZW1wO1xuICAgICAgICBsZXQgbGVuID0gc2VsZWN0aW9uLmxlbmd0aDtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGZpZ21hLnNraXBJbnZpc2libGVJbnN0YW5jZUNoaWxkcmVuID0gdHJ1ZTsgLy8g5b+955Wl6ZqQ6JeP55qE5Zu+5bGCXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGVfbGlzdF90ZW1wID0gW107XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLkuIvmsqHmnInlrZDlm77lsYJcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uW2ldLmNoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5paH5pys5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3RfdGVtcCA9IHNlbGVjdGlvbltpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pO1xuICAgICAgICAgICAgICAgICAgICBqc29uX2RhdGFfdGVtcCA9IHsgJ3BhZ2UnOiBzZWxlY3Rpb25baV1bJ25hbWUnXSwgJ3BhZ2VfaWQnOiBzZWxlY3Rpb25baV1bJ2lkJ10sICdub2RlX2xpc3QnOiBub2RlX2xpc3RfdGVtcCB9O1xuICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3QucHVzaChqc29uX2RhdGFfdGVtcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyDlvZPliY3pgInkuK3nmoTlm77lsYJcbiAgICAgICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8g5b2T5YmN5pyJ6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo6YCJ5Lit55qE5Zu+5bGC5Lit5pCc57SiXG4gICAgICAgICAgICAvLyDlnKjlvZPliY3pgInkuK3nmoTlm77lsYLkuK3vvIzmkJzntKLmlofmnKzlm77lsYJcbiAgICAgICAgfVxuICAgICAgICBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo5omA5pyJIFRFWFQg5Zu+5bGCXG4gICAgICAgIC8vIGxldCBjaGlsZHJlbl9saXN0ID0gW10gICAgLy8g5ouG5YiG5Zu+5bGC77yM6YCQ5Liq5pCc57Si77yM6YG/5YWN55WM6Z2i6ZW/5pe26Ze05oyC6LW3XG4gICAgICAgIGxldCBsZW4gPSBzZWxlY3Rpb24ubGVuZ3RoO1xuICAgICAgICBsZXQgbm9kZV9saXN0X3RlbXAgPSBbXTtcbiAgICAgICAgbGV0IGpzb25fZGF0YV90ZW1wO1xuICAgICAgICAvLyDpgY3ljobojIPlm7TlhoXnmoTlm77lsYLvvIzojrflj5YgVEVYVCDlm77lsYJcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGZpZ21hLnNraXBJbnZpc2libGVJbnN0YW5jZUNoaWxkcmVuID0gdHJ1ZTsgLy8g5b+955Wl6ZqQ6JeP55qE5Zu+5bGCXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOWbvuWxguacrOi6q+WwseaYr+aWh+acrOWbvuWxglxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb25baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0X3RlbXAucHVzaChzZWxlY3Rpb25baV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5rKh5pyJ5a2Q5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uW2ldLmNoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5paH5pys5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVfbGlzdF90ZW1wID0gbm9kZV9saXN0X3RlbXAuY29uY2F0KHNlbGVjdGlvbltpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5vZGVfbGlzdF90ZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlX2xpc3QgPSBbeyAncGFnZSc6IGZpZ21hLmN1cnJlbnRQYWdlWyduYW1lJ10sICdwYWdlX2lkJzogZmlnbWEuY3VycmVudFBhZ2VbJ2lkJ10sICdub2RlX2xpc3QnOiBub2RlX2xpc3RfdGVtcCB9XTtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyByZXR1cm4gbm9kZV9saXN0XG59XG4vLyDmkJzntKLvvJrlnKjmlofmnKzlm77lsYLkuK3vvIzljLnphY3lhbPplK7lrZdcbmZ1bmN0aW9uIGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwga2V5d29yZCkge1xuICAgIGNvbnNvbGUubG9nKCdmdW5jIGZpbmRLZXlXb3JkIGJlZ2luJyk7XG4gICAgY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICByZXFfY291dCA9IDA7IC8vIOaQnOe0oue7k+aenOaVsOmHj1xuICAgIGxldCBkYXRhX2l0ZW1fbGlzdCA9IFtdO1xuICAgIGxldCBkYXRhX3RlbXA7XG4gICAgbGV0IG5vZGU7IC8vIOiusOW9lemBjeWOhuWIsOeahOWbvuWxglxuICAgIGxldCBsZW4gPSBub2RlX2xpc3QubGVuZ3RoO1xuICAgIGxldCBteV9wcm9ncmVzcyA9IDA7IC8vIOi/m+W6puS/oeaBr1xuICAgIC8vIOW/veeVpeWkp+Wwj+WGmVxuICAgIGlmIChzZXRpbmdfQWEgIT0gdHJ1ZSkge1xuICAgICAgICBrZXl3b3JkID0ga2V5d29yZC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygna2V5d29yZDonKTtcbiAgICAvLyBjb25zb2xlLmxvZyhrZXl3b3JkKTtcbiAgICBsZXQgbm9kZV9sZW5fc3VtID0gMDtcbiAgICBub2RlX2xpc3QuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgbm9kZV9sZW5fc3VtICs9IGl0ZW1bJ25vZGVfbGlzdCddLmxlbmd0aDtcbiAgICB9KTtcbiAgICBmb3IgKGxldCBpID0gbGVuIC0gMTsgaSA+IC0xOyBpLS0pIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IG5vZGVfbGlzdFtpXVsnbm9kZV9saXN0J10ubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIG15X3Byb2dyZXNzKys7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ2RvbmUnOiBmYWxzZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbm9kZV9sZW5fc3VtIH0gfSk7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGVfbGlzdFtpXVsnbm9kZV9saXN0J11bal07XG4gICAgICAgICAgICAgICAgbGV0IG5vZGVfY2hhcmFjdGVycztcbiAgICAgICAgICAgICAgICAvLyDlv73nlaXlpKflsI/lhplcbiAgICAgICAgICAgICAgICBpZiAoc2V0aW5nX0FhICE9IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9jaGFyYWN0ZXJzID0gbm9kZVsnY2hhcmFjdGVycyddLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBub2RlX2NoYXJhY3RlcnMgPSBub2RlWydjaGFyYWN0ZXJzJ107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlX2NoYXJhY3RlcnMuaW5kZXhPZihrZXl3b3JkKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaJvuWIsOWFs+mUruivjSjlv73nlaXlpKflsI/lhpkpXG4gICAgICAgICAgICAgICAgICAgIC8vIOWIpOaWreelluWFiOWbvuWxgueahOeKtuaAge+8jOWMheaLrOmakOiXj+OAgemUgeWumuOAgee7hOS7tuOAgeWunuS+i+WxnuaAp1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGhpc19wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhbmNlc3Rvcl9pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNMb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX3R5cGUgPSAnJzsgLy8g57uE5Lu2L+WunuS+iy/lhbbku5ZcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUubG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlIHx8IGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOWbvuWxguacrOi6q+WwseaYr+mUgeWumuaIlumakOiXj+eKtuaAgVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W56WW5YWI5YWD57Sg55qE54q25oCBXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzX3BhcmVudCA9IG5vZGUucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXNfcGFyZW50LnR5cGUgIT0gJ1BBR0UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC50eXBlID09ICdDT01QT05FTlQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX3R5cGUgPSAnQ09NUE9ORU5UJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnR5cGUgPT0gJ0lOU1RBTkNFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl90eXBlID0gJ0lOU1RBTkNFJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkgJiYgYW5jZXN0b3JfdHlwZSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gdGhpc19wYXJlbnQucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyDljZXkuKrlm77lsYLnmoTmlbDmja7vvIzlrZjlgqjliLAgdGFyZ2V0X1RleHRfTm9kZSDkuK3vvIzmi6XmnInlkI7nu63nmoTmm7/mjaLlt6XkvZxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5wdXNoKHsgJ25vZGUnOiBub2RlLCAnYW5jZXN0b3JfaXNWaXNpYmxlJzogYW5jZXN0b3JfaXNWaXNpYmxlLCAnYW5jZXN0b3JfaXNMb2NrZWQnOiBhbmNlc3Rvcl9pc0xvY2tlZCwgJ2FuY2VzdG9yX3R5cGUnOiBhbmNlc3Rvcl90eXBlIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyDmnoTlu7rmlbDmja7vvIzkvKDpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleXdvcmRfbGVuZ3RoID0ga2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKogVEVYVCDlm77lsYLlhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbm9kZV9jaGFyYWN0ZXJzLmluZGV4T2Yoa2V5d29yZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlsIbmn6Xmib7nmoTlrZfnrKbotbflp4vjgIHnu4jmraLkvY3nva7lj5HpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmr4/kuKrlhbPplK7lrZfnmoTmlbDmja5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX3RlbXAgPSB7ICdwYWdlX25hbWUnOiBub2RlX2xpc3RbaV1bJ3BhZ2UnXSwgJ3BhZ2VfaWQnOiBub2RlX2xpc3RbaV1bJ3BhZ2VfaWQnXSwgJ2lkJzogbm9kZS5pZCwgJ2NoYXJhY3RlcnMnOiBub2RlLmNoYXJhY3RlcnMsICdzdGFydCc6IGluZGV4LCAnZW5kJzogaW5kZXggKyBrZXl3b3JkLmxlbmd0aCwgJ2hhc01pc3NpbmdGb250Jzogbm9kZS5oYXNNaXNzaW5nRm9udCwgJ2FuY2VzdG9yX3R5cGUnOiBhbmNlc3Rvcl90eXBlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcV9jb3V0IDwgMjApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5bey57uP5pyJ5pCc57Si57uT5p6c77yM5YiZ5YWI5Y+R6YCB5LiA6YOo5YiG5pi+56S65ZyoIFVJIOS4re+8jOaPkOWNh+aQnOe0ouWKoOi9veeKtuaAgeeahOS9k+mqjFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZG9uZSc6IGZhbHNlLCAnbXlfcHJvZ3Jlc3MnOiB7ICdpbmRleCc6IG15X3Byb2dyZXNzLCAndG90YWwnOiBub2RlX2xlbl9zdW0gfSwgJ3RhcmdldF9UZXh0X05vZGUnOiBbZGF0YV90ZW1wXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RhdGFfdGVtcDonKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YV90ZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFfaXRlbV9saXN0LnB1c2goZGF0YV90ZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g57uf6K6h5pCc57Si57uT5p6c5pWw6YePXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxX2NvdXQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7mn6Xmib7nm67moIflrZfnrKbkuLLnmoTlgY/np7tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4ICsga2V5d29yZF9sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGlmXG4gICAgICAgICAgICAgICAgICAgIH0gLy8gd2hpbGVcbiAgICAgICAgICAgICAgICB9IC8vIGlmIChub2RlWydjaGFyYWN0ZXJzJ10uaW5kZXhPZihrZXl3b3JkKSA+IC0xKVxuICAgICAgICAgICAgfSwgMTApOyAvLyBzZXRUaW1lb3V0XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGFfaXRlbV9saXN0O1xufVxuLy8g5pu/5o2iXG5mdW5jdGlvbiByZXBsYWNlKGRhdGEpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVwbGFjZScpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgICAgIC8vIOWmguaenOiiq+abv+aNoueahOWtl+espuaYryAnJyDliJnkvJrpmbflhaXmrbvlvqrnjq/vvIzmiYDku6XopoHliKTmlq3kuIDkuItcbiAgICAgICAgaWYgKGRhdGEuZGF0YS5rZXl3b3JkID09ICcnKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBlbnRlciB0aGUgY2hhcmFjdGVycyB5b3Ugd2FudCB0byByZXBsYWNlJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbXlMb2FkRm9udEFzeW5jKHRhcmdldF9UZXh0X05vZGUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaGFzTWlzc2luZ0ZvbnRDb3VudCA9IDA7XG4gICAgICAgICAgICBsZXQgbGVuID0gdGFyZ2V0X1RleHRfTm9kZS5sZW5ndGg7XG4gICAgICAgICAgICBsZXQgbXlfcHJvZ3Jlc3MgPSAwOyAvLyDov5vluqbkv6Hmga9cbiAgICAgICAgICAgIGxldCBrZXl3b3JkID0gZGF0YS5kYXRhLmtleXdvcmQ7IC8vIOWFs+mUruWtl1xuICAgICAgICAgICAgbGV0IG5ld0NoYXJhY3RlcnMgPSBkYXRhLmRhdGEucmVwbGFjZV93b3JkOyAvLyDpnIDopoHmm7/mjaLmiJDku6XkuIvlrZfnrKZcbiAgICAgICAgICAgIC8vIOW/veeVpeWkp+Wwj+WGmVxuICAgICAgICAgICAgaWYgKHNldGluZ19BYSAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAga2V5d29yZCA9IGtleXdvcmQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBsZW47IGktLTspIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBteV9wcm9ncmVzcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXlfcHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2RvbmUnOiBmYWxzZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbGVufSwnaGFzTWlzc2luZ0ZvbnRDb3VudCc6aGFzTWlzc2luZ0ZvbnRDb3VudCAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnYW5jZXN0b3JfaXNWaXNpYmxlJ10gPT0gZmFsc2UgfHwgdGFyZ2V0X1RleHRfTm9kZVtpXVsnYW5jZXN0b3JfaXNMb2NrZWQnXSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5b+955Wl6ZqQ6JeP44CB6ZSB5a6a55qE5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ11bJ2ZvbnROYW1lJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZfkvZPkuI3mlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2hhc01pc3NpbmdGb250Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGhhc01pc3NpbmdGb250Q291bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNNaXNzaW5nRm9udENvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dFN0eWxlID0gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmdldFN0eWxlZFRleHRTZWdtZW50cyhbJ2luZGVudGF0aW9uJywgJ2xpc3RPcHRpb25zJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndGV4dFN0eWxlOicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXh0U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0U3RhcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0RW5kID0gMDsgLy8g6K6w5b2V5L+u5pS55a2X56ym5ZCO55qE57Si5byV5YGP56e75pWw5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHlsZVRlbXAgPSBbXTsgLy8g6K6w5b2V5q+P5Liq5q616JC95qC35byP5Zyo5L+u5pS55ZCO55qE5qC35byP57Si5byV77yI5Zyo5pu/5o2i5a6M5a2X56ym5ZCO6ZyA6KaB6K6+572u5Zue5LmL5YmN55qE5qC35byP77yJXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0X29mZnNldEVuZCA9IDA7IC8vIOiusOW9leS4iuS4gOS4quauteiQveeahOacq+Wwvue0ouW8lVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmm7/mjaLnm67moIflrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbWVudF9jaGFyYWN0ZXJzID0gZWxlbWVudC5jaGFyYWN0ZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNldGluZ19BYSAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudF9jaGFyYWN0ZXJzID0gZWxlbWVudF9jaGFyYWN0ZXJzLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKrmrrXokL3lhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5Yy56YWN5Yiw55qE5a2X56ym55qE57Si5byVXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBlbGVtZW50X2NoYXJhY3RlcnMuaW5kZXhPZihrZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pyJ5Yy56YWN55qE5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leaWsOWtl+espumcgOimgeaPkuWFpeeahOS9jee9rlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5zZXJ0U3RhcnQgPSBpbmRleCArIGtleXdvcmQubGVuZ3RoICsgZWxlbWVudFsnc3RhcnQnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luc2VydFN0YXJ0OicgKyBpbnNlcnRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Zyo57Si5byV5ZCO5o+S5YWl5paw5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5pbnNlcnRDaGFyYWN0ZXJzKGluc2VydFN0YXJ0ICsgb2Zmc2V0RW5kLCBuZXdDaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5qC55o2u57Si5byV5Yig6Zmk5pen5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5kZWxldGVDaGFyYWN0ZXJzKGluZGV4ICsgZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldEVuZCwgaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXlgY/np7vmlbDlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2Zmc2V0U3RhcnQgPSBsYXN0X29mZnNldEVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRFbmQgKz0gbmV3Q2hhcmFjdGVycy5sZW5ndGggLSBrZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3doaWxlIG9mZnNldFN0YXJ0OicgKyBvZmZzZXRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3doaWxlIG9mZnNldEVuZDonICsgb2Zmc2V0RW5kLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXmo4DntKLliLDnm67moIflrZfnrKbnmoTntKLlvJXvvIzkuIvkuIDmrKEgd2hpbGUg5b6q546v5Zyo5q2k5L2N572u5ZCO5byA5aeL5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBrZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOayoeacieWMuemFjeeahOWtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gd2hpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWwhuWNleS4quauteiQveeahOe8qei/m+OAgeW6j+WPt+agt+W8j+iusOW9leWIsOaVsOe7hOWGhVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVUZW1wLnB1c2goeyAnc3RhcnQnOiBsYXN0X29mZnNldEVuZCwgJ2VuZCc6IGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCAnaW5kZW50YXRpb24nOiBlbGVtZW50WydpbmRlbnRhdGlvbiddID4gMCA/IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gOiAwLCAnbGlzdE9wdGlvbnMnOiBlbGVtZW50WydsaXN0T3B0aW9ucyddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9vZmZzZXRFbmQgPSBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOiuvue9rue8qei/m1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlSW5kZW50YXRpb24oZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0LCBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgZWxlbWVudFsnaW5kZW50YXRpb24nXSA+IDAgPyBlbGVtZW50WydpbmRlbnRhdGlvbiddIC0gMSA6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyDorr7nva7luo/lj7dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5zZXRSYW5nZUxpc3RPcHRpb25zKGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRTdGFydCwgZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsIGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAvLyB0ZXh0U3R5bGUuZm9yRWFjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7nvKnov5vjgIHluo/lj7dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGVUZW1wIOiusOW9leS6huavj+S4quauteiQveeahOe8qei/m+OAgeW6j+WPt+agt+W8j++8jOmBjeWOhuaVsOe7hOS9v+W+l+S/ruaUueWtl+espuWQjueahOaWh+acrOWbvuWxguagt+W8j+S4jeWPmFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVRlbXAuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOaWh+acrOS4uuepuu+8jOWImeS4jeaUr+aMgeiuvue9ruagt+W8j++8iOS8muaKpemUme+8iVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5jaGFyYWN0ZXJzICE9ICcnICYmIGVsZW1lbnRbJ2VuZCddID4gZWxlbWVudFsnc3RhcnQnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlTGlzdE9wdGlvbnMoZWxlbWVudFsnc3RhcnQnXSwgZWxlbWVudFsnZW5kJ10sIGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5zZXRSYW5nZUluZGVudGF0aW9uKGVsZW1lbnRbJ3N0YXJ0J10sIGVsZW1lbnRbJ2VuZCddLCBlbGVtZW50WydpbmRlbnRhdGlvbiddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogZmFsc2UsICdteV9wcm9ncmVzcyc6IHsgJ2luZGV4JzogbXlfcHJvZ3Jlc3MsICd0b3RhbCc6IGxlbiB9LCAnaGFzTWlzc2luZ0ZvbnRDb3VudCc6IGhhc01pc3NpbmdGb250Q291bnQgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHJlc29sdmUoJzEnKVxuICAgIH0pO1xufSAvLyBhc3luYyBmdW5jdGlvbiByZXBsYWNlXG4vLyBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbml7bvvIzpgJrnn6UgVUkg5pi+56S65LiN5ZCM55qE5o+Q56S6XG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZSgpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IGZhbHNlIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG9uQ3VycmVudHBhZ2VjaGFuZ2UoKSB7XG4gICAgY29uc29sZS5sb2coZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25DdXJyZW50cGFnZWNoYW5nZScsICdjdXJyZW50UGFnZSc6IGZpZ21hLmN1cnJlbnRQYWdlWydpZCddIH0pXG59XG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL2NvZGUudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==