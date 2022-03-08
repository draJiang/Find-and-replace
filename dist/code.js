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
let req_cout = 0; // 搜索结果数量
let node_list = []; // 存储所有 TEXT 图层
console.log('2022-03-08');
// 启动插件时显示 UI
figma.showUI(__html__, { width: 300, height: 340 });
// 获取是否选中图层
onSelectionChange();
// 绑定 Figma 图层选择变化事件
figma.on("selectionchange", () => { onSelectionChange(); });
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
    // 遍历范围内的图层，获取 TEXT 图层
    let len = selection.length;
    for (let i = 0; i < len; i++) {
        setTimeout(() => {
            // 如果图层本身就是文本图层
            if (selection[i].type == 'TEXT') {
                node_list.push(selection[i]);
            }
            else {
                // 如果图层下没有子图层
                //@ts-ignore
                if (selection[i].children == undefined) {
                }
                else {
                    // 获取文本图层
                    //@ts-ignore
                    node_list = node_list.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }));
                }
            }
        }, 10);
    }
    return node_list;
}
// 搜索：在文本图层中，匹配关键字
function findKeyWord(node_list, keyword) {
    // console.log('func findKeyWord begin');
    req_cout = 0; // 搜索结果数量
    let data_item_list = [];
    let data_temp;
    let node; // 记录遍历到的图层
    let len = node_list.length;
    let my_progress = 0; // 进度信息
    // 忽略大小写
    keyword = keyword.toLowerCase();
    // console.log('keyword:');
    // console.log(keyword);
    for (let i = 0; i < len; i++) {
        setTimeout(() => {
            my_progress++;
            figma.ui.postMessage({ 'type': 'find', 'done': false, 'my_progress': { 'index': my_progress, 'total': node_list.length } });
            node = node_list[i];
            let node_characters = node['characters'].toLowerCase();
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
                        data_temp = { 'id': node.id, 'characters': node.characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': node.hasMissingFont, 'ancestor_type': ancestor_type };
                        if (req_cout < 10) {
                            // 如果已经有搜索结果，则先发送一部分显示在 UI 中，提升搜索加载状态的体验
                            figma.ui.postMessage({ 'type': 'find', 'done': false, 'target_Text_Node': [data_temp] });
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
    console.log('func findKeyWord end');
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
            let keyword = data.data.keyword.toLowerCase(); // 关键字
            let newCharacters = data.data.replace_word; // 需要替换成以下字符
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
                                    let index;
                                    // 由于单个段落内可能存在多个符合条件的字符，所以需要循环查找
                                    while (true) {
                                        // 获取匹配到的字符的索引
                                        index = element.characters.toLowerCase().indexOf(keyword, position);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0IsdUJBQXVCO0FBQ3ZCLGlDQUFpQztBQUNqQyw2QkFBNkI7QUFDN0Isa0JBQWtCO0FBQ2xCLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0EseUJBQXlCLHlCQUF5QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msc0JBQXNCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLDBEQUEwRDtBQUNqRztBQUNBO0FBQ0EsMENBQTBDLGdCQUFnQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixTQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyw2RUFBNkU7QUFDdkgsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsNkVBQTZFO0FBQ2pILFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0ZBQW9GLGlCQUFpQjtBQUNyRztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBLG1DQUFtQyxnREFBZ0QsbURBQW1EO0FBQ3RJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsZ0lBQWdJO0FBQ3hLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQSxtREFBbUQsZ0VBQWdFO0FBQ25IO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsa0JBQWtCO0FBQ2xCLGNBQWM7QUFDZCxTQUFTLE9BQU87QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDLDJEQUEyRDtBQUMzRCx3REFBd0Q7QUFDeEQ7QUFDQSxrQ0FBa0MsSUFBSTtBQUN0QztBQUNBO0FBQ0E7QUFDQSxrREFBa0QsbURBQW1ELG1DQUFtQyw2Q0FBNkM7QUFDckw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRCxvREFBb0Q7QUFDcEQsd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMsc0NBQXNDO0FBQ3RDO0FBQ0EscURBQXFELDJLQUEySztBQUNoTztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLEdBQUc7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDLDhCQUE4QjtBQUM5QiwwQkFBMEI7QUFDMUIsK0NBQStDLG1EQUFtRCxvQ0FBb0MsOENBQThDO0FBQ3BMLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0wsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isb0RBQW9EO0FBQ25GO0FBQ0E7QUFDQSwrQkFBK0IscURBQXFEO0FBQ3BGO0FBQ0E7Ozs7Ozs7O1VFcFlBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AZmlnbWEvcGx1Z2luLXR5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5sZXQgdGFyZ2V0X1RleHRfTm9kZSA9IFtdOyAvLyDlrZjlgqjnrKblkIjmkJzntKLmnaHku7bnmoQgVEVYVCDlm77lsYJcbmxldCBsb2FkZWRfZm9udHMgPSBbXTsgLy8g5bey5Yqg6L2955qE5a2X5L2T5YiX6KGoXG5sZXQgZmlsZVR5cGUgPSBmaWdtYS5lZGl0b3JUeXBlOyAvLyDlvZPliY0gZmlnbWEg5paH5Lu257G75Z6L77yaZmlnbWEvZmlnamFtXG5sZXQgaGFzTWlzc2luZ0ZvbnRDb3VudCA9IDA7IC8vIOabv+aNouaXtuiusOW9leS4jeaUr+aMgeWtl+S9k+eahOaVsOmHj1xubGV0IHJlcV9jb3V0ID0gMDsgLy8g5pCc57Si57uT5p6c5pWw6YePXG5sZXQgbm9kZV9saXN0ID0gW107IC8vIOWtmOWCqOaJgOaciSBURVhUIOWbvuWxglxuY29uc29sZS5sb2coJzIwMjItMDMtMDgnKTtcbi8vIOWQr+WKqOaPkuS7tuaXtuaYvuekuiBVSVxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMDAsIGhlaWdodDogMzQwIH0pO1xuLy8g6I635Y+W5piv5ZCm6YCJ5Lit5Zu+5bGCXG5vblNlbGVjdGlvbkNoYW5nZSgpO1xuLy8g57uR5a6aIEZpZ21hIOWbvuWxgumAieaLqeWPmOWMluS6i+S7tlxuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4geyBvblNlbGVjdGlvbkNoYW5nZSgpOyB9KTtcbi8vIFVJIOWPkeadpea2iOaBr1xuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbiAgICAvLyBVSSDkuK3ngrnlh7vkuobjgIzmkJzntKLjgI3mjInpkq5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2gnKTtcbiAgICAgICAgLy8g6K6w5b2V6L+Q6KGM5pe26ZW/XG4gICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBsZXQgZmluZF9zdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAvLyDmiafooYzmkJzntKJcbiAgICAgICAgZmluZChtc2cuZGF0YSk7XG4gICAgICAgIGxldCBkb25lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCfjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgItmaW5kOicgKyAoZG9uZSAtIGZpbmRfc3RhcnQpLnRvU3RyaW5nKCkpO1xuICAgICAgICBsZXQgdG9IVE1MOyAvLyDlrZjlgqjopoHlj5Hnu5kgdWkudHN4IOeahOaVsOaNrlxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGxldCBmaW5kS2V5V29yZF9zdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgLy8g5Zyo5paH5pys5Zu+5bGC5Lit5Yy56YWN5YyF5ZCr5YWz6ZSu5a2X55qE5Zu+5bGCXG4gICAgICAgICAgICB0b0hUTUwgPSBmaW5kS2V5V29yZChub2RlX2xpc3QsIG1zZy5kYXRhLmtleXdvcmQpO1xuICAgICAgICAgICAgbGV0IGZpbmRLZXlXb3JkX2VuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi2ZpbmRLZXlXb3JkOicgKyAoZmluZEtleVdvcmRfZW5kIC0gZmluZEtleVdvcmRfc3RhcnQpLnRvU3RyaW5nKCkpO1xuICAgICAgICB9LCAyMCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8g5bCG5pCc57Si5pWw5o2u5Y+R6YCB57uZIHVpLnRzeFxuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZCcsICdkb25lJzogdHJ1ZSwgJ3RhcmdldF9UZXh0X05vZGUnOiB0b0hUTUwgfSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZpbmQgZW5kLGNvdW50OicpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcV9jb3V0KTtcbiAgICAgICAgICAgICAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2RvbmUnIH0pXG4gICAgICAgICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIsnICsgbXNnLmRhdGEua2V5d29yZCArICc6JyArIChlbmQgLSBzdGFydCkudG9TdHJpbmcoKSArICcgY291bnQ6JyArIHJlcV9jb3V0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIGlmIChyZXFfY291dCA+IDMwKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnJlc2l6ZSgzMDAsIDU0MCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMzApO1xuICAgICAgICB9LCA0MCk7XG4gICAgfVxuICAgIC8vIFVJIOS4reeCueWHu+aQnOe0oue7k+aenOmhuVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2xpc3RPbkNsaWsnKSB7XG4gICAgICAgIHZhciB0YXJnZXROb2RlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9yRWFjaDonKTtcbiAgICAgICAgLy8g6YGN5Y6G5pCc57Si57uT5p6cXG4gICAgICAgIGxldCBsZW4gPSB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5pZCA9PSBtc2cuZGF0YVsnaXRlbSddKSB7XG4gICAgICAgICAgICAgICAgLy8g5om+5Yiw55So5oi354K55Ye755qE5Zu+5bGCXG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZSA9PT0gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOinhuWbvuWumuS9jeWIsOWvueW6lOWbvuWxglxuICAgICAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddXSk7XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6YCJ5Lit5a+55bqU5paH5pysXG4gICAgICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0ZWRUZXh0UmFuZ2UgPSB7ICdub2RlJzogdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLCAnc3RhcnQnOiBtc2cuZGF0YVsnc3RhcnQnXSwgJ2VuZCc6IG1zZy5kYXRhWydlbmQnXSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFVJIOS4reeCueWHu+S6huOAjOabv+aNouOAjeaMiemSrlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb2RlLnRzIHJlcGxhY2UnKTtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgLy8g5omn6KGM5pu/5o2iXG4gICAgICAgIHJlcGxhY2UobXNnKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb2RlLnRzIHJlcGxhY2UgZG9uZScpO1xuICAgICAgICAgICAgICAgIC8vIOabv+aNouWujOavle+8jOmAmuefpSBVSSDmm7TmlrBcbiAgICAgICAgICAgICAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnLCAnZG9uZSc6IHRydWUsICdoYXNNaXNzaW5nRm9udENvdW50JzogaGFzTWlzc2luZ0ZvbnRDb3VudCB9KTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZygnY29kZS50cyByZXBsYWNlIGRvbmUnKTtcbiAgICAgICAgLy8gICAvLyDmm7/mjaLlrozmr5XvvIzpgJrnn6UgVUkg5pu05pawXG4gICAgICAgIC8vICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2RvbmUnOiB0cnVlLCAnaGFzTWlzc2luZ0ZvbnRDb3VudCc6IGhhc01pc3NpbmdGb250Q291bnQgfSk7XG4gICAgICAgIC8vIH0sIDMwKTtcbiAgICB9XG59O1xuLy8g5Yqg6L295a2X5L2TXG5mdW5jdGlvbiBteUxvYWRGb250QXN5bmModGV4dF9sYXllcl9MaXN0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ215TG9hZEZvbnRBc3luYzonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGV4dF9sYXllcl9MaXN0KTtcbiAgICAgICAgZm9yIChsZXQgbGF5ZXIgb2YgdGV4dF9sYXllcl9MaXN0KSB7XG4gICAgICAgICAgICBpZiAobGF5ZXJbJ25vZGUnXVsnY2hhcmFjdGVycyddLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLScpO1xuICAgICAgICAgICAgLy8g5Yqg6L295a2X5L2TXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsYXllcik7XG4gICAgICAgICAgICBsZXQgZm9udHMgPSBsYXllclsnbm9kZSddLmdldFJhbmdlQWxsRm9udE5hbWVzKDAsIGxheWVyWydub2RlJ11bJ2NoYXJhY3RlcnMnXS5sZW5ndGgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZvbnRzOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZm9udHMpO1xuICAgICAgICAgICAgZm9yIChsZXQgZm9udCBvZiBmb250cykge1xuICAgICAgICAgICAgICAgIGxldCBiaW5nbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGxvYWRlZF9mb250IG9mIGxvYWRlZF9mb250cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkX2ZvbnRbJ2ZhbWlseSddID09IGZvbnRbJ2ZhbWlseSddICYmIGxvYWRlZF9mb250WydzdHlsZSddID09IGZvbnRbJ3N0eWxlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmdvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGJpbmdvKTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZ28pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDlrZfkvZPmmK/lkKbmlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxheWVyWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS4jeaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hhc01pc3NpbmdGb250Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZF9mb250cy5wdXNoKGZvbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2xvYWRGb250QXN5bmMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2cobXlGb250KTtcbiAgICAgICAgLy8gYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyhteUZvbnQpXG4gICAgICAgIHJldHVybiAnZG9uZSc7XG4gICAgfSk7XG59XG4vLyDmib7lh7rmiYDmnInmlofmnKzlm77lsYJcbmZ1bmN0aW9uIGZpbmQoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdjb25kZS50czpmaW5kOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAvLyDmuIXnqbrljoblj7LmkJzntKLmlbDmja7vvIzph43mlrDmkJzntKJcbiAgICB0YXJnZXRfVGV4dF9Ob2RlID0gW107XG4gICAgLy8g5b2T5YmN6YCJ5Lit55qE5Zu+5bGCXG4gICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8g5b2T5YmN5pyJ6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo6YCJ5Lit55qE5Zu+5bGC5Lit5pCc57SiXG4gICAgICAgIC8vIOWcqOW9k+WJjemAieS4reeahOWbvuWxguS4re+8jOaQnOe0ouaWh+acrOWbvuWxglxuICAgIH1cbiAgICBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo5omA5pyJIFRFWFQg5Zu+5bGCXG4gICAgLy8g6YGN5Y6G6IyD5Zu05YaF55qE5Zu+5bGC77yM6I635Y+WIFRFWFQg5Zu+5bGCXG4gICAgbGV0IGxlbiA9IHNlbGVjdGlvbi5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIOWmguaenOWbvuWxguacrOi6q+WwseaYr+aWh+acrOWbvuWxglxuICAgICAgICAgICAgaWYgKHNlbGVjdGlvbltpXS50eXBlID09ICdURVhUJykge1xuICAgICAgICAgICAgICAgIG5vZGVfbGlzdC5wdXNoKHNlbGVjdGlvbltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLkuIvmsqHmnInlrZDlm77lsYJcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uW2ldLmNoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5paH5pys5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3QgPSBub2RlX2xpc3QuY29uY2F0KHNlbGVjdGlvbltpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGVfbGlzdDtcbn1cbi8vIOaQnOe0ou+8muWcqOaWh+acrOWbvuWxguS4re+8jOWMuemFjeWFs+mUruWtl1xuZnVuY3Rpb24gZmluZEtleVdvcmQobm9kZV9saXN0LCBrZXl3b3JkKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ2Z1bmMgZmluZEtleVdvcmQgYmVnaW4nKTtcbiAgICByZXFfY291dCA9IDA7IC8vIOaQnOe0oue7k+aenOaVsOmHj1xuICAgIGxldCBkYXRhX2l0ZW1fbGlzdCA9IFtdO1xuICAgIGxldCBkYXRhX3RlbXA7XG4gICAgbGV0IG5vZGU7IC8vIOiusOW9lemBjeWOhuWIsOeahOWbvuWxglxuICAgIGxldCBsZW4gPSBub2RlX2xpc3QubGVuZ3RoO1xuICAgIGxldCBteV9wcm9ncmVzcyA9IDA7IC8vIOi/m+W6puS/oeaBr1xuICAgIC8vIOW/veeVpeWkp+Wwj+WGmVxuICAgIGtleXdvcmQgPSBrZXl3b3JkLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gY29uc29sZS5sb2coJ2tleXdvcmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2coa2V5d29yZCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIG15X3Byb2dyZXNzKys7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZG9uZSc6IGZhbHNlLCAnbXlfcHJvZ3Jlc3MnOiB7ICdpbmRleCc6IG15X3Byb2dyZXNzLCAndG90YWwnOiBub2RlX2xpc3QubGVuZ3RoIH0gfSk7XG4gICAgICAgICAgICBub2RlID0gbm9kZV9saXN0W2ldO1xuICAgICAgICAgICAgbGV0IG5vZGVfY2hhcmFjdGVycyA9IG5vZGVbJ2NoYXJhY3RlcnMnXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKG5vZGVfY2hhcmFjdGVycy5pbmRleE9mKGtleXdvcmQpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyDmib7liLDlhbPplK7or40o5b+955Wl5aSn5bCP5YaZKVxuICAgICAgICAgICAgICAgIC8vIOWIpOaWreelluWFiOWbvuWxgueahOeKtuaAge+8jOWMheaLrOmakOiXj+OAgemUgeWumuOAgee7hOS7tuOAgeWunuS+i+WxnuaAp1xuICAgICAgICAgICAgICAgIGxldCB0aGlzX3BhcmVudDtcbiAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNMb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfdHlwZSA9ICcnOyAvLyDnu4Tku7Yv5a6e5L6LL+WFtuS7llxuICAgICAgICAgICAgICAgIGlmIChub2RlLmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSB8fCBhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOWbvuWxguacrOi6q+WwseaYr+mUgeWumuaIlumakOiXj+eKtuaAgVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W56WW5YWI5YWD57Sg55qE54q25oCBXG4gICAgICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzX3BhcmVudC50eXBlICE9ICdQQUdFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC50eXBlID09ICdDT01QT05FTlQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfdHlwZSA9ICdDT01QT05FTlQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnR5cGUgPT0gJ0lOU1RBTkNFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX3R5cGUgPSAnSU5TVEFOQ0UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkgJiYgYW5jZXN0b3JfdHlwZSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc19wYXJlbnQgPSB0aGlzX3BhcmVudC5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g5Y2V5Liq5Zu+5bGC55qE5pWw5o2u77yM5a2Y5YKo5YiwIHRhcmdldF9UZXh0X05vZGUg5Lit77yM5oul5pyJ5ZCO57ut55qE5pu/5o2i5bel5L2cXG4gICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5wdXNoKHsgJ25vZGUnOiBub2RlLCAnYW5jZXN0b3JfaXNWaXNpYmxlJzogYW5jZXN0b3JfaXNWaXNpYmxlLCAnYW5jZXN0b3JfaXNMb2NrZWQnOiBhbmNlc3Rvcl9pc0xvY2tlZCwgJ2FuY2VzdG9yX3R5cGUnOiBhbmNlc3Rvcl90eXBlIH0pO1xuICAgICAgICAgICAgICAgIC8vIOaehOW7uuaVsOaNru+8jOS8oOmAgee7mSBVSVxuICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBsZXQga2V5d29yZF9sZW5ndGggPSBrZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKogVEVYVCDlm77lsYLlhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBub2RlX2NoYXJhY3RlcnMuaW5kZXhPZihrZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlsIbmn6Xmib7nmoTlrZfnrKbotbflp4vjgIHnu4jmraLkvY3nva7lj5HpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOavj+S4quWFs+mUruWtl+eahOaVsOaNrlxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV90ZW1wID0geyAnaWQnOiBub2RlLmlkLCAnY2hhcmFjdGVycyc6IG5vZGUuY2hhcmFjdGVycywgJ3N0YXJ0JzogaW5kZXgsICdlbmQnOiBpbmRleCArIGtleXdvcmQubGVuZ3RoLCAnaGFzTWlzc2luZ0ZvbnQnOiBub2RlLmhhc01pc3NpbmdGb250LCAnYW5jZXN0b3JfdHlwZSc6IGFuY2VzdG9yX3R5cGUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXFfY291dCA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5bey57uP5pyJ5pCc57Si57uT5p6c77yM5YiZ5YWI5Y+R6YCB5LiA6YOo5YiG5pi+56S65ZyoIFVJIOS4re+8jOaPkOWNh+aQnOe0ouWKoOi9veeKtuaAgeeahOS9k+mqjFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZCcsICdkb25lJzogZmFsc2UsICd0YXJnZXRfVGV4dF9Ob2RlJzogW2RhdGFfdGVtcF0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2l0ZW1fbGlzdC5wdXNoKGRhdGFfdGVtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnu5/orqHmkJzntKLnu5PmnpzmlbDph49cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcV9jb3V0Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7mn6Xmib7nm67moIflrZfnrKbkuLLnmoTlgY/np7tcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBrZXl3b3JkX2xlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfSAvLyBpZlxuICAgICAgICAgICAgICAgIH0gLy8gd2hpbGVcbiAgICAgICAgICAgIH0gLy8gaWYgKG5vZGVbJ2NoYXJhY3RlcnMnXS5pbmRleE9mKGtleXdvcmQpID4gLTEpXG4gICAgICAgIH0sIDEwKTsgLy8gc2V0VGltZW91dFxuICAgIH1cbiAgICBjb25zb2xlLmxvZygnZnVuYyBmaW5kS2V5V29yZCBlbmQnKTtcbiAgICByZXR1cm4gZGF0YV9pdGVtX2xpc3Q7XG59XG4vLyDmm7/mjaJcbmZ1bmN0aW9uIHJlcGxhY2UoZGF0YSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgLy8g5aaC5p6c6KKr5pu/5o2i55qE5a2X56ym5pivICcnIOWImeS8mumZt+WFpeatu+W+queOr++8jOaJgOS7peimgeWIpOaWreS4gOS4i1xuICAgICAgICBpZiAoZGF0YS5kYXRhLmtleXdvcmQgPT0gJycpIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIGVudGVyIHRoZSBjaGFyYWN0ZXJzIHlvdSB3YW50IHRvIHJlcGxhY2UnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBteUxvYWRGb250QXN5bmModGFyZ2V0X1RleHRfTm9kZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBoYXNNaXNzaW5nRm9udENvdW50ID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBteV9wcm9ncmVzcyA9IDA7IC8vIOi/m+W6puS/oeaBr1xuICAgICAgICAgICAgbGV0IGtleXdvcmQgPSBkYXRhLmRhdGEua2V5d29yZC50b0xvd2VyQ2FzZSgpOyAvLyDlhbPplK7lrZdcbiAgICAgICAgICAgIGxldCBuZXdDaGFyYWN0ZXJzID0gZGF0YS5kYXRhLnJlcGxhY2Vfd29yZDsgLy8g6ZyA6KaB5pu/5o2i5oiQ5Lul5LiL5a2X56ymXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gbGVuOyBpLS07KSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbXlfcHJvZ3Jlc3MrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG15X3Byb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogZmFsc2UsICdteV9wcm9ncmVzcyc6IHsgJ2luZGV4JzogbXlfcHJvZ3Jlc3MsICd0b3RhbCc6IGxlbn0sJ2hhc01pc3NpbmdGb250Q291bnQnOmhhc01pc3NpbmdGb250Q291bnQgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ2FuY2VzdG9yX2lzVmlzaWJsZSddID09IGZhbHNlIHx8IHRhcmdldF9UZXh0X05vZGVbaV1bJ2FuY2VzdG9yX2lzTG9ja2VkJ10gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOW/veeVpemakOiXj+OAgemUgeWumueahOWbvuWxglxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddWydmb250TmFtZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5a2X5L2T5LiN5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdoYXNNaXNzaW5nRm9udCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhoYXNNaXNzaW5nRm9udENvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzTWlzc2luZ0ZvbnRDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRTdHlsZSA9IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoWydpbmRlbnRhdGlvbicsICdsaXN0T3B0aW9ucyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RleHRTdHlsZTonKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGV4dFN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFN0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldEVuZCA9IDA7IC8vIOiusOW9leS/ruaUueWtl+espuWQjueahOe0ouW8leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVUZW1wID0gW107IC8vIOiusOW9leavj+S4quauteiQveagt+W8j+WcqOS/ruaUueWQjueahOagt+W8j+e0ouW8le+8iOWcqOabv+aNouWujOWtl+espuWQjumcgOimgeiuvue9ruWbnuS5i+WJjeeahOagt+W8j++8iVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdF9vZmZzZXRFbmQgPSAwOyAvLyDorrDlvZXkuIrkuIDkuKrmrrXokL3nmoTmnKvlsL7ntKLlvJVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pu/5o2i55uu5qCH5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO5Y2V5Liq5q616JC95YaF5Y+v6IO95a2Y5Zyo5aSa5Liq56ym5ZCI5p2h5Lu255qE5a2X56ym77yM5omA5Lul6ZyA6KaB5b6q546v5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluWMuemFjeWIsOeahOWtl+espueahOe0ouW8lVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gZWxlbWVudC5jaGFyYWN0ZXJzLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihrZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pyJ5Yy56YWN55qE5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leaWsOWtl+espumcgOimgeaPkuWFpeeahOS9jee9rlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5zZXJ0U3RhcnQgPSBpbmRleCArIGtleXdvcmQubGVuZ3RoICsgZWxlbWVudFsnc3RhcnQnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luc2VydFN0YXJ0OicgKyBpbnNlcnRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Zyo57Si5byV5ZCO5o+S5YWl5paw5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5pbnNlcnRDaGFyYWN0ZXJzKGluc2VydFN0YXJ0ICsgb2Zmc2V0RW5kLCBuZXdDaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5qC55o2u57Si5byV5Yig6Zmk5pen5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5kZWxldGVDaGFyYWN0ZXJzKGluZGV4ICsgZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldEVuZCwgaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXlgY/np7vmlbDlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2Zmc2V0U3RhcnQgPSBsYXN0X29mZnNldEVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRFbmQgKz0gbmV3Q2hhcmFjdGVycy5sZW5ndGggLSBrZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3doaWxlIG9mZnNldFN0YXJ0OicgKyBvZmZzZXRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3doaWxlIG9mZnNldEVuZDonICsgb2Zmc2V0RW5kLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXmo4DntKLliLDnm67moIflrZfnrKbnmoTntKLlvJXvvIzkuIvkuIDmrKEgd2hpbGUg5b6q546v5Zyo5q2k5L2N572u5ZCO5byA5aeL5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBrZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOayoeacieWMuemFjeeahOWtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gd2hpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWwhuWNleS4quauteiQveeahOe8qei/m+OAgeW6j+WPt+agt+W8j+iusOW9leWIsOaVsOe7hOWGhVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVUZW1wLnB1c2goeyAnc3RhcnQnOiBsYXN0X29mZnNldEVuZCwgJ2VuZCc6IGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCAnaW5kZW50YXRpb24nOiBlbGVtZW50WydpbmRlbnRhdGlvbiddID4gMCA/IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gOiAwLCAnbGlzdE9wdGlvbnMnOiBlbGVtZW50WydsaXN0T3B0aW9ucyddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9vZmZzZXRFbmQgPSBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOiuvue9rue8qei/m1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlSW5kZW50YXRpb24oZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0LCBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgZWxlbWVudFsnaW5kZW50YXRpb24nXSA+IDAgPyBlbGVtZW50WydpbmRlbnRhdGlvbiddIC0gMSA6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyDorr7nva7luo/lj7dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5zZXRSYW5nZUxpc3RPcHRpb25zKGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRTdGFydCwgZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsIGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAvLyB0ZXh0U3R5bGUuZm9yRWFjaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7nvKnov5vjgIHluo/lj7dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGVUZW1wIOiusOW9leS6huavj+S4quauteiQveeahOe8qei/m+OAgeW6j+WPt+agt+W8j++8jOmBjeWOhuaVsOe7hOS9v+W+l+S/ruaUueWtl+espuWQjueahOaWh+acrOWbvuWxguagt+W8j+S4jeWPmFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVRlbXAuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOaWh+acrOS4uuepuu+8jOWImeS4jeaUr+aMgeiuvue9ruagt+W8j++8iOS8muaKpemUme+8iVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5jaGFyYWN0ZXJzICE9ICcnICYmIGVsZW1lbnRbJ2VuZCddID4gZWxlbWVudFsnc3RhcnQnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlTGlzdE9wdGlvbnMoZWxlbWVudFsnc3RhcnQnXSwgZWxlbWVudFsnZW5kJ10sIGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5zZXRSYW5nZUluZGVudGF0aW9uKGVsZW1lbnRbJ3N0YXJ0J10sIGVsZW1lbnRbJ2VuZCddLCBlbGVtZW50WydpbmRlbnRhdGlvbiddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogZmFsc2UsICdteV9wcm9ncmVzcyc6IHsgJ2luZGV4JzogbXlfcHJvZ3Jlc3MsICd0b3RhbCc6IGxlbiB9LCAnaGFzTWlzc2luZ0ZvbnRDb3VudCc6IGhhc01pc3NpbmdGb250Q291bnQgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHJlc29sdmUoJzEnKVxuICAgIH0pO1xufSAvLyBhc3luYyBmdW5jdGlvbiByZXBsYWNlXG4vLyBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbml7bvvIzpgJrnn6UgVUkg5pi+56S65LiN5ZCM55qE5o+Q56S6XG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZSgpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IGZhbHNlIH0pO1xuICAgIH1cbn1cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvY29kZS50c1wiXSgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9