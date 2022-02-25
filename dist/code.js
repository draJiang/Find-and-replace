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
let loaded_fonts = [];
let fileType = figma.editorType;
let req_cout = 0;
let node_list = []; // 存储所有 TEXT 图层
// let toHTML = []                         // 存储传送给 UI 的符合搜索条件的 TEXT 图层信息
console.log('2022-02-25');
figma.showUI(__html__, { width: 300, height: 340 });
// console.log('hello2')
onSelectionChange();
// 绑定 Figma 图层选择变化事件
figma.on("selectionchange", () => { onSelectionChange(); });
// UI 发来消息
figma.ui.onmessage = msg => {
    // UI 中点击了「搜索」按钮
    if (msg.type === 'search') {
        // figma.ui.postMessage({ 'type': 'find_loading' })
        console.log('search');
        // console.log(msg);
        let start = new Date().getTime();
        let find_start = new Date().getTime();
        // 执行搜索
        find(msg.data);
        let find_end = new Date().getTime();
        console.log('》》》》》》》》》》find:' + (find_end - find_start).toString());
        // console.log('figma.ui.onmessage node_list&msg');
        // console.log(node_list);
        // console.log(msg.data);
        // console.log('search target_Text_Node:');
        let toHTML;
        setTimeout(() => {
            // console.log('findKeyWord begin');
            // console.log(node_list);
            let findKeyWord_start = new Date().getTime();
            toHTML = findKeyWord(node_list, msg.data.keyword);
            let findKeyWord_end = new Date().getTime();
            console.log('》》》》》》》》》》findKeyWord:' + (findKeyWord_end - findKeyWord_start).toString());
            // console.log('findKeyWord end');
        }, 20);
        setTimeout(() => {
            setTimeout(() => {
                // console.log('toHTML:');
                // console.log(toHTML);
                figma.ui.postMessage({ 'type': 'find', 'find_end': true, 'target_Text_Node': toHTML });
                console.log('Find end:');
                // figma.ui.postMessage({ 'type': 'find_end' })
                console.log(req_cout);
                figma.ui.postMessage({ 'type': 'find_end' });
                let end = new Date().getTime();
                console.log('》》》》》》》》》》' + msg.data.keyword + ':' + (end - start).toString());
            }, 30);
        }, 40);
    }
    // UI 中点击搜索结果项
    if (msg.type === 'listOnClik') {
        // console.log('code js:listOnClik:');
        // console.log(msg);
        var targetNode;
        // console.log('forEach:');
        // 遍历搜索结果
        for (var i = 0; i < target_Text_Node.length; i++) {
            // console.log(target_Text_Node[i].id);
            // console.log(msg.data.item);
            // console.log(msg.data['item']);
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
        // console.log('replace');
        console.log(msg);
        // 执行替换
        replace(msg);
    }
};
// 查找图层下的文本图层，输入 figma 图层对象，返回找到所有文本图层
function myFindTextAll(node, node_list, ancestor_isLocked, ancestor_isVisible) {
    // console.log('myFindAll');
    // console.log(isLocked);
    let locked = false; // 存储最终的状态
    let visible = true;
    // 如果目标图层本身就是 TEXT 图层
    if (node.type == 'TEXT') {
        // // 文本图层是否锁定、隐藏？
        // if (node.locked) {
        //   // 锁定
        //   locked = true
        // } else {
        //   locked = false
        // }
        // if (node.visible == false) {
        //   // 隐藏
        //   visible = false
        // } else {
        //   visible = true
        // }
        // // 祖先图层的锁定、隐藏状态优先级高
        // if (ancestor_isLocked == true) {
        //   // 祖先是锁定状态
        //   locked = true
        // } else {
        //   // 祖先非锁定状态
        // }
        // if (ancestor_isVisible == false) {
        //   // 祖先是隐藏状态
        //   visible = false
        // } else {
        //   // 祖先非隐藏状态
        // }
        node_list.push(node);
        return node_list;
    }
    var thisChildren = node.children;
    //  如果当前节点下存在子节点
    if (thisChildren == undefined) {
        // 当前节点无子节点，可能是形状图层
        return node_list;
    }
    // if (ancestor_isLocked == true) {
    //   // 祖先是锁定状态
    // } else {
    //   // 祖先非锁定状态
    //   ancestor_isLocked = thisChildren.locked
    // }
    // if (ancestor_isVisible == false) {
    //   // 祖先是隐藏状态
    // } else {
    //   // 祖先非隐藏状态
    //   ancestor_isVisible = thisChildren.visible
    // }
    // 遍历子节点
    for (let i = 0; i < thisChildren.length; i++) {
        // console.log('thisChildren:')
        // console.log(thisChildren);
        if (thisChildren == undefined) {
            console.log('!!!ERRO thisChildren==undefined');
            return node_list;
        }
        // 如果节点的类型为 TEXT
        if (thisChildren[i].type == 'TEXT') {
            node_list.push(thisChildren[i]);
        }
        else {
            // 如果不是 TEXT 图层
            // 如果包含子图层
            if (thisChildren[i].children != null) {
                if (thisChildren[i].children.length > 0) {
                    // if (ancestor_isLocked == true) {
                    //   // 祖先是锁定状态
                    // } else {
                    //   // 祖先非锁定状态
                    //   ancestor_isLocked = thisChildren[i].locked
                    // }
                    // if (ancestor_isVisible == false) {
                    //   // 祖先是隐藏状态
                    // } else {
                    //   // 祖先非隐藏状态
                    //   ancestor_isVisible = thisChildren.visible
                    // }
                    node_list = myFindTextAll(thisChildren[i], node_list);
                }
            }
        }
    }
    // console.log('node_list:');
    // console.log(node_list);
    return node_list;
}
// 加载字体
function myLoadFontAsync(text_layer_List) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log('myLoadFontAsync:');
        // console.log(text_layer_List);
        for (let layer of text_layer_List) {
            // console.log('----------');
            // 加载字体
            // console.log('layer:');
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
    });
}
// 搜索
function find(data) {
    console.log('conde.ts:find:');
    // console.log(figma.currentPage);
    // 清空历史搜索数据，重新搜索
    target_Text_Node = [];
    let selection = figma.currentPage.selection;
    // 当前未选中图层，则在当前页面搜索
    if (selection.length == 0) {
        // node_list = figma.currentPage.findAll(n => n.type === "TEXT")
        selection = figma.currentPage.children;
    }
    else {
        // 当前有选中图层，则在选中的图层中搜索
        // 在当前选中的图层中，搜索文本图层
    }
    node_list = [];
    let findAllWithCriteria_sum = 0;
    // 遍历范围内的图层，获取 TEXT 图层
    let len = selection.length;
    for (let i = 0; i < len; i++) {
        setTimeout(() => {
            // 如果图层本身就是文本图层
            if (selection[i].type == 'TEXT') {
                node_list.push(selection[i]);
                // let bingo_nodes = findKeyWord(node_list, data.keyword)
            }
            else {
                // 如果图层下没有子图层
                //@ts-ignore
                if (selection[i].children == undefined) {
                }
                else {
                    let start = new Date().getTime();
                    //@ts-ignore
                    node_list = node_list.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }));
                    // console.log(' find timeout node_list:');
                    // console.log(node_list);
                    let end = new Date().getTime();
                    findAllWithCriteria_sum += end - start;
                    console.log('》》》》》》》》》》findAllWithCriteria:' + (end - start).toString() + 'sum:' + findAllWithCriteria_sum.toString());
                }
            }
        }, 10);
    }
    // console.log('selection:');
    // console.log(selection);
    return node_list;
}
// 替换
function replace(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('replace');
        // console.log(data);
        // console.log(target_Text_Node);
        let hasMissingFontCount = 0;
        yield myLoadFontAsync(target_Text_Node);
        target_Text_Node.forEach(item => {
            // console.log('replace target_Text_Node.forEach:');
            // console.log(item);
            if (item['ancestor_isVisible'] == false || item['ancestor_isLocked'] == true) {
                // 忽略隐藏、锁定的图层
            }
            else {
                // console.log(item['node']['fontName']);
                // console.log(item['node'].hasMissingFont);
                if (item['node'].hasMissingFont) {
                    // 字体不支持
                    console.log('hasMissingFont');
                    hasMissingFontCount += 1;
                }
                else {
                    let textStyle = item['node'].getStyledTextSegments(['indentation', 'listOptions']);
                    // console.log('textStyle:');
                    // console.log(textStyle);
                    let offsetStart = 0;
                    let offsetEnd = 0; // 记录修改字符后的索引偏移数值
                    let styleTemp = []; // 记录每个段落样式在修改后的样式索引（在替换完字符后需要设置回之前的样式）
                    let last_offsetEnd = 0; // 记录上一个段落的末尾索引
                    // 替换目标字符
                    textStyle.forEach(element => {
                        let position = 0;
                        // 由于单个段落内可能存在多个符合条件的字符，所以需要循环查找
                        while (true) {
                            // 获取匹配到的字符的索引
                            var index = element.characters.indexOf(data.data.keyword, position);
                            if (index > -1) {
                                // 有匹配的字符
                                // 记录新字符需要插入的位置
                                let insertStart = index + data.data.keyword.length + element['start'];
                                // console.log('insertStart:' + insertStart.toString());
                                // 需要替换成以下字符
                                let newCharacters = data.data.replace_word;
                                // 在索引后插入新字符
                                item['node'].insertCharacters(insertStart + offsetEnd, newCharacters);
                                // 根据索引删除旧字符
                                item['node'].deleteCharacters(index + element['start'] + offsetEnd, insertStart + offsetEnd);
                                // 记录偏移数值
                                // offsetStart = last_offsetEnd
                                offsetEnd += data.data.replace_word.length - data.data.keyword.length;
                                // console.log('while offsetStart:' + offsetStart.toString());
                                // console.log('while offsetEnd:' + offsetEnd.toString());
                                // 记录检索到目标字符的索引，下一次 while 循环在此位置后开始查找
                                position = index + data.data.keyword.length;
                            }
                            else {
                                // 没有匹配的字符
                                break;
                            } // else
                        } // while
                        // console.log('offsetStart:' + offsetStart.toString());
                        // console.log('offsetEnd:' + offsetEnd.toString());
                        // console.log('element:');
                        // console.log(element);
                        // let thisStart = element['start'] + offsetStart
                        // if (thisStart < 0) {
                        //   thisStart = 0
                        // }
                        // if (element['start'] == 0) {
                        //   thisStart == 0
                        // }
                        // 将单个段落的缩进、序号样式记录到数组内
                        styleTemp.push({ 'start': last_offsetEnd, 'end': element['end'] + offsetEnd, 'indentation': element['indentation'] > 0 ? element['indentation'] : element['indentation'], 'listOptions': element['listOptions'] });
                        last_offsetEnd = element['end'] + offsetEnd;
                        // // 设置缩进
                        // item['node'].setRangeIndentation(element['start'] + offsetStart, element['end'] + offsetEnd, element['indentation'] > 0 ? element['indentation'] - 1 : element['indentation'])
                        // // 设置序号
                        // item['node'].setRangeListOptions(element['start'] + offsetStart, element['end'] + offsetEnd, element['listOptions'])
                    }); // textStyle.forEach
                    // 设置缩进、序号
                    // console.log('设置缩进、序号：');
                    // console.log(styleTemp);
                    // styleTemp 记录了每个段落的缩进、序号样式，遍历数组使得修改字符后的文本图层样式不变
                    styleTemp.forEach(element => {
                        item['node'].setRangeListOptions(element['start'], element['end'], element['listOptions']);
                        item['node'].setRangeIndentation(element['start'], element['end'], element['indentation']);
                    });
                } // else
                // var searchRegExp = new RegExp(data.data.keyword, 'g')
                // // console.log(item);
                // item['node'].characters = item['node'].characters.replace(searchRegExp, data.data.replace_word)
            } // else
        }); // target_Text_Node.forEach
        // 替换完毕，通知 UI 更新
        figma.ui.postMessage({ 'type': 'replace', 'hasMissingFontCount': hasMissingFontCount });
        console.log('target_Text_Node:');
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
function findKeyWord(node_list, keyword) {
    console.log('func findKeyWord begin');
    req_cout = 0;
    // 在文本图层中，匹配关键字
    let data_item;
    let data_item_list = [];
    let data_temp;
    let node; // 记录遍历到的图层
    let len = node_list.length;
    let my_progress = 0;
    for (let i = 0; i < len; i++) {
        setTimeout(() => {
            my_progress++;
            figma.ui.postMessage({ 'type': 'loading', 'my_progress': { 'index': my_progress, 'total': node_list.length } });
            node = node_list[i];
            if (node['characters'].indexOf(keyword) > -1) {
                // 找到关键词
                let this_parent;
                let ancestor_isVisible = true;
                let ancestor_isLocked = false;
                let ancestor_type = '';
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
                // 单个图层的数据
                data_item = { 'node': node, 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked, 'ancestor_type': ancestor_type };
                target_Text_Node.push(data_item);
                // 构建数据，传送给 UI
                let position = 0;
                let index = 0;
                let keyword_length = keyword.length;
                while (index >= 0) {
                    // 由于单个 TEXT 图层内可能存在多个符合条件的字符，所以需要循环查找
                    index = node.characters.indexOf(keyword, position);
                    // console.log('index:');
                    // console.log(index);
                    if (index > -1) {
                        // 将查找的字符起始、终止位置发送给 UI
                        // figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': [{ 'id': data_item['node'].id, 'characters': data_item['node'].characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': data_item['node'].hasMissingFont }] })
                        // console.log('func findKeyWord finded');
                        // 每个关键字的数据
                        data_temp = { 'id': node.id, 'characters': node.characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': node.hasMissingFont, 'ancestor_type': ancestor_type };
                        if (req_cout < 10) {
                            figma.ui.postMessage({ 'type': 'find', 'find_end': false, 'target_Text_Node': [data_temp] });
                        }
                        else {
                            data_item_list.push(data_temp);
                        }
                        req_cout++;
                        // console.log('count:' + req_cout.toString());
                        // // 加载字体
                        // myLoadFontAsync([{ 'id': data_item['node'].id, 'characters': data_item['node'].characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': data_item['node'].hasMissingFont }])
                        position = index + keyword_length;
                    }
                }
                // console.log('postMessage');
                // return { 'node': node_list[j], 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked }
            }
        }, 10);
    }
    // node_list.forEach(element => {
    // });
    // for (var j = 0; j < node_list.length; j++) {
    // }
    // console.log('find end:');
    // console.log(target_Text_Node);
    console.log('func findKeyWord end');
    // console.log(data_item_list);
    // toHTML = data_item_list
    return data_item_list;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsdUNBQXVDLDJLQUEySyxHQUFHO0FBQ3ZRO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQSxtREFBbUQsb0VBQW9FO0FBQ3ZIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLDJLQUEySztBQUN6TjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsUUFBUTtBQUNSLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUV6ZUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2UvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0BmaWdtYS9wbHVnaW4tdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cbmxldCB0YXJnZXRfVGV4dF9Ob2RlID0gW107IC8vIOWtmOWCqOespuWQiOaQnOe0ouadoeS7tueahCBURVhUIOWbvuWxglxubGV0IGxvYWRlZF9mb250cyA9IFtdO1xubGV0IGZpbGVUeXBlID0gZmlnbWEuZWRpdG9yVHlwZTtcbmxldCByZXFfY291dCA9IDA7XG5sZXQgbm9kZV9saXN0ID0gW107IC8vIOWtmOWCqOaJgOaciSBURVhUIOWbvuWxglxuLy8gbGV0IHRvSFRNTCA9IFtdICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtmOWCqOS8oOmAgee7mSBVSSDnmoTnrKblkIjmkJzntKLmnaHku7bnmoQgVEVYVCDlm77lsYLkv6Hmga9cbmNvbnNvbGUubG9nKCcyMDIyLTAyLTI1Jyk7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMwMCwgaGVpZ2h0OiAzNDAgfSk7XG4vLyBjb25zb2xlLmxvZygnaGVsbG8yJylcbm9uU2VsZWN0aW9uQ2hhbmdlKCk7XG4vLyDnu5HlrpogRmlnbWEg5Zu+5bGC6YCJ5oup5Y+Y5YyW5LqL5Lu2XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7IG9uU2VsZWN0aW9uQ2hhbmdlKCk7IH0pO1xuLy8gVUkg5Y+R5p2l5raI5oGvXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIC8vIFVJIOS4reeCueWHu+S6huOAjOaQnOe0ouOAjeaMiemSrlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kX2xvYWRpbmcnIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2gnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGxldCBmaW5kX3N0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIC8vIOaJp+ihjOaQnOe0olxuICAgICAgICBmaW5kKG1zZy5kYXRhKTtcbiAgICAgICAgbGV0IGZpbmRfZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCfjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgItmaW5kOicgKyAoZmluZF9lbmQgLSBmaW5kX3N0YXJ0KS50b1N0cmluZygpKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZpZ21hLnVpLm9ubWVzc2FnZSBub2RlX2xpc3QmbXNnJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZy5kYXRhKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3NlYXJjaCB0YXJnZXRfVGV4dF9Ob2RlOicpO1xuICAgICAgICBsZXQgdG9IVE1MO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmaW5kS2V5V29yZCBiZWdpbicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICAgICAgICAgIGxldCBmaW5kS2V5V29yZF9zdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdG9IVE1MID0gZmluZEtleVdvcmQobm9kZV9saXN0LCBtc2cuZGF0YS5rZXl3b3JkKTtcbiAgICAgICAgICAgIGxldCBmaW5kS2V5V29yZF9lbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgItmaW5kS2V5V29yZDonICsgKGZpbmRLZXlXb3JkX2VuZCAtIGZpbmRLZXlXb3JkX3N0YXJ0KS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmaW5kS2V5V29yZCBlbmQnKTtcbiAgICAgICAgfSwgMjApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0b0hUTUw6Jyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codG9IVE1MKTtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZmluZF9lbmQnOiB0cnVlLCAndGFyZ2V0X1RleHRfTm9kZSc6IHRvSFRNTCB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmluZCBlbmQ6Jyk7XG4gICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kX2VuZCcgfSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXFfY291dCk7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kX2VuZCcgfSk7XG4gICAgICAgICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIsnICsgbXNnLmRhdGEua2V5d29yZCArICc6JyArIChlbmQgLSBzdGFydCkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9LCAzMCk7XG4gICAgICAgIH0sIDQwKTtcbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75pCc57Si57uT5p6c6aG5XG4gICAgaWYgKG1zZy50eXBlID09PSAnbGlzdE9uQ2xpaycpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvZGUganM6bGlzdE9uQ2xpazonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgdmFyIHRhcmdldE5vZGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3JFYWNoOicpO1xuICAgICAgICAvLyDpgY3ljobmkJzntKLnu5PmnpxcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldLmlkKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZy5kYXRhLml0ZW0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLmRhdGFbJ2l0ZW0nXSk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmlkID09IG1zZy5kYXRhWydpdGVtJ10pIHtcbiAgICAgICAgICAgICAgICAvLyDmib7liLDnlKjmiLfngrnlh7vnmoTlm77lsYJcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlID09PSB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ107XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6KeG5Zu+5a6a5L2N5Yiw5a+55bqU5Zu+5bGCXG4gICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFt0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ11dKTtcbiAgICAgICAgICAgICAgICAvLyBGaWdtYSDpgInkuK3lr7nlupTmlofmnKxcbiAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3RlZFRleHRSYW5nZSA9IHsgJ25vZGUnOiB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10sICdzdGFydCc6IG1zZy5kYXRhWydzdGFydCddLCAnZW5kJzogbXNnLmRhdGFbJ2VuZCddIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pu/5o2i44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlcGxhY2UnKTtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgLy8g5omn6KGM5pu/5o2iXG4gICAgICAgIHJlcGxhY2UobXNnKTtcbiAgICB9XG59O1xuLy8g5p+l5om+5Zu+5bGC5LiL55qE5paH5pys5Zu+5bGC77yM6L6T5YWlIGZpZ21hIOWbvuWxguWvueixoe+8jOi/lOWbnuaJvuWIsOaJgOacieaWh+acrOWbvuWxglxuZnVuY3Rpb24gbXlGaW5kVGV4dEFsbChub2RlLCBub2RlX2xpc3QsIGFuY2VzdG9yX2lzTG9ja2VkLCBhbmNlc3Rvcl9pc1Zpc2libGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnbXlGaW5kQWxsJyk7XG4gICAgLy8gY29uc29sZS5sb2coaXNMb2NrZWQpO1xuICAgIGxldCBsb2NrZWQgPSBmYWxzZTsgLy8g5a2Y5YKo5pyA57uI55qE54q25oCBXG4gICAgbGV0IHZpc2libGUgPSB0cnVlO1xuICAgIC8vIOWmguaenOebruagh+WbvuWxguacrOi6q+WwseaYryBURVhUIOWbvuWxglxuICAgIGlmIChub2RlLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgIC8vIC8vIOaWh+acrOWbvuWxguaYr+WQpumUgeWumuOAgemakOiXj++8n1xuICAgICAgICAvLyBpZiAobm9kZS5sb2NrZWQpIHtcbiAgICAgICAgLy8gICAvLyDplIHlrppcbiAgICAgICAgLy8gICBsb2NrZWQgPSB0cnVlXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgbG9ja2VkID0gZmFsc2VcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBpZiAobm9kZS52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgIC8vICAgLy8g6ZqQ6JePXG4gICAgICAgIC8vICAgdmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgdmlzaWJsZSA9IHRydWVcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyAvLyDnpZblhYjlm77lsYLnmoTplIHlrprjgIHpmpDol4/nirbmgIHkvJjlhYjnuqfpq5hcbiAgICAgICAgLy8gaWYgKGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgLy8gICAvLyDnpZblhYjmmK/plIHlrprnirbmgIFcbiAgICAgICAgLy8gICBsb2NrZWQgPSB0cnVlXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgLy8g56WW5YWI6Z2e6ZSB5a6a54q25oCBXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAvLyAgIC8vIOelluWFiOaYr+makOiXj+eKtuaAgVxuICAgICAgICAvLyAgIHZpc2libGUgPSBmYWxzZVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgIC8vIOelluWFiOmdnumakOiXj+eKtuaAgVxuICAgICAgICAvLyB9XG4gICAgICAgIG5vZGVfbGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgIH1cbiAgICB2YXIgdGhpc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAvLyAg5aaC5p6c5b2T5YmN6IqC54K55LiL5a2Y5Zyo5a2Q6IqC54K5XG4gICAgaWYgKHRoaXNDaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8g5b2T5YmN6IqC54K55peg5a2Q6IqC54K577yM5Y+v6IO95piv5b2i54q25Zu+5bGCXG4gICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgfVxuICAgIC8vIGlmIChhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgLy8gICAvLyDnpZblhYjmmK/plIHlrprnirbmgIFcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgLy8g56WW5YWI6Z2e6ZSB5a6a54q25oCBXG4gICAgLy8gICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRoaXNDaGlsZHJlbi5sb2NrZWRcbiAgICAvLyB9XG4gICAgLy8gaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSkge1xuICAgIC8vICAgLy8g56WW5YWI5piv6ZqQ6JeP54q25oCBXG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIC8vIOelluWFiOmdnumakOiXj+eKtuaAgVxuICAgIC8vICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gdGhpc0NoaWxkcmVuLnZpc2libGVcbiAgICAvLyB9XG4gICAgLy8g6YGN5Y6G5a2Q6IqC54K5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXNDaGlsZHJlbjonKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzQ2hpbGRyZW4pO1xuICAgICAgICBpZiAodGhpc0NoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyEhIUVSUk8gdGhpc0NoaWxkcmVuPT11bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5aaC5p6c6IqC54K555qE57G75Z6L5Li6IFRFWFRcbiAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS50eXBlID09ICdURVhUJykge1xuICAgICAgICAgICAgbm9kZV9saXN0LnB1c2godGhpc0NoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIOWmguaenOS4jeaYryBURVhUIOWbvuWxglxuICAgICAgICAgICAgLy8g5aaC5p6c5YyF5ZCr5a2Q5Zu+5bGCXG4gICAgICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLmNoaWxkcmVuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAvLyDnpZblhYjmmK/plIHlrprnirbmgIFcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAvLyDnpZblhYjpnZ7plIHlrprnirbmgIFcbiAgICAgICAgICAgICAgICAgICAgLy8gICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRoaXNDaGlsZHJlbltpXS5sb2NrZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgLy8g56WW5YWI5piv6ZqQ6JeP54q25oCBXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgLy8g56WW5YWI6Z2e6ZqQ6JeP54q25oCBXG4gICAgICAgICAgICAgICAgICAgIC8vICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gdGhpc0NoaWxkcmVuLnZpc2libGVcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3QgPSBteUZpbmRUZXh0QWxsKHRoaXNDaGlsZHJlbltpXSwgbm9kZV9saXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coJ25vZGVfbGlzdDonKTtcbiAgICAvLyBjb25zb2xlLmxvZyhub2RlX2xpc3QpO1xuICAgIHJldHVybiBub2RlX2xpc3Q7XG59XG4vLyDliqDovb3lrZfkvZNcbmZ1bmN0aW9uIG15TG9hZEZvbnRBc3luYyh0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbXlMb2FkRm9udEFzeW5jOicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXh0X2xheWVyX0xpc3QpO1xuICAgICAgICBmb3IgKGxldCBsYXllciBvZiB0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tJyk7XG4gICAgICAgICAgICAvLyDliqDovb3lrZfkvZNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYXllcjonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxheWVyKTtcbiAgICAgICAgICAgIGxldCBmb250cyA9IGxheWVyWydub2RlJ10uZ2V0UmFuZ2VBbGxGb250TmFtZXMoMCwgbGF5ZXJbJ25vZGUnXVsnY2hhcmFjdGVycyddLmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9udHM6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmb250cyk7XG4gICAgICAgICAgICBmb3IgKGxldCBmb250IG9mIGZvbnRzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJpbmdvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbG9hZGVkX2ZvbnQgb2YgbG9hZGVkX2ZvbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWRfZm9udFsnZmFtaWx5J10gPT0gZm9udFsnZmFtaWx5J10gJiYgbG9hZGVkX2ZvbnRbJ3N0eWxlJ10gPT0gZm9udFsnc3R5bGUnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmluZ28gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYmluZ28pO1xuICAgICAgICAgICAgICAgIGlmIChiaW5nbykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWtl+S9k+aYr+WQpuaUr+aMgVxuICAgICAgICAgICAgICAgICAgICBpZiAobGF5ZXJbJ25vZGUnXS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LiN5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGFzTWlzc2luZ0ZvbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkX2ZvbnRzLnB1c2goZm9udCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbG9hZEZvbnRBc3luYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhmb250KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhteUZvbnQpO1xuICAgICAgICAvLyBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Rm9udClcbiAgICB9KTtcbn1cbi8vIOaQnOe0olxuZnVuY3Rpb24gZmluZChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbmRlLnRzOmZpbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2coZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIC8vIOa4heepuuWOhuWPsuaQnOe0ouaVsOaNru+8jOmHjeaWsOaQnOe0olxuICAgIHRhcmdldF9UZXh0X05vZGUgPSBbXTtcbiAgICBsZXQgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gbm9kZV9saXN0ID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZEFsbChuID0+IG4udHlwZSA9PT0gXCJURVhUXCIpXG4gICAgICAgIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8g5b2T5YmN5pyJ6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo6YCJ5Lit55qE5Zu+5bGC5Lit5pCc57SiXG4gICAgICAgIC8vIOWcqOW9k+WJjemAieS4reeahOWbvuWxguS4re+8jOaQnOe0ouaWh+acrOWbvuWxglxuICAgIH1cbiAgICBub2RlX2xpc3QgPSBbXTtcbiAgICBsZXQgZmluZEFsbFdpdGhDcml0ZXJpYV9zdW0gPSAwO1xuICAgIC8vIOmBjeWOhuiMg+WbtOWGheeahOWbvuWxgu+8jOiOt+WPliBURVhUIOWbvuWxglxuICAgIGxldCBsZW4gPSBzZWxlY3Rpb24ubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/mlofmnKzlm77lsYJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICBub2RlX2xpc3QucHVzaChzZWxlY3Rpb25baV0pO1xuICAgICAgICAgICAgICAgIC8vIGxldCBiaW5nb19ub2RlcyA9IGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwgZGF0YS5rZXl3b3JkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5rKh5pyJ5a2Q5Zu+5bGCXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbltpXS5jaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0ID0gbm9kZV9saXN0LmNvbmNhdChzZWxlY3Rpb25baV0uZmluZEFsbFdpdGhDcml0ZXJpYSh7IHR5cGVzOiBbJ1RFWFQnXSB9KSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCcgZmluZCB0aW1lb3V0IG5vZGVfbGlzdDonKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICBmaW5kQWxsV2l0aENyaXRlcmlhX3N1bSArPSBlbmQgLSBzdGFydDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi+OAi2ZpbmRBbGxXaXRoQ3JpdGVyaWE6JyArIChlbmQgLSBzdGFydCkudG9TdHJpbmcoKSArICdzdW06JyArIGZpbmRBbGxXaXRoQ3JpdGVyaWFfc3VtLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTApO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnc2VsZWN0aW9uOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdGlvbik7XG4gICAgcmV0dXJuIG5vZGVfbGlzdDtcbn1cbi8vIOabv+aNolxuZnVuY3Rpb24gcmVwbGFjZShkYXRhKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlcGxhY2UnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICBsZXQgaGFzTWlzc2luZ0ZvbnRDb3VudCA9IDA7XG4gICAgICAgIHlpZWxkIG15TG9hZEZvbnRBc3luYyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlcGxhY2UgdGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgICAgICBpZiAoaXRlbVsnYW5jZXN0b3JfaXNWaXNpYmxlJ10gPT0gZmFsc2UgfHwgaXRlbVsnYW5jZXN0b3JfaXNMb2NrZWQnXSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgLy8g5b+955Wl6ZqQ6JeP44CB6ZSB5a6a55qE5Zu+5bGCXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtWydub2RlJ11bJ2ZvbnROYW1lJ10pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCk7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDlrZfkvZPkuI3mlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hhc01pc3NpbmdGb250Jyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc01pc3NpbmdGb250Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0U3R5bGUgPSBpdGVtWydub2RlJ10uZ2V0U3R5bGVkVGV4dFNlZ21lbnRzKFsnaW5kZW50YXRpb24nLCAnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZXh0U3R5bGU6Jyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRleHRTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRTdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRFbmQgPSAwOyAvLyDorrDlvZXkv67mlLnlrZfnrKblkI7nmoTntKLlvJXlgY/np7vmlbDlgLxcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlVGVtcCA9IFtdOyAvLyDorrDlvZXmr4/kuKrmrrXokL3moLflvI/lnKjkv67mlLnlkI7nmoTmoLflvI/ntKLlvJXvvIjlnKjmm7/mjaLlrozlrZfnrKblkI7pnIDopoHorr7nva7lm57kuYvliY3nmoTmoLflvI/vvIlcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3Rfb2Zmc2V0RW5kID0gMDsgLy8g6K6w5b2V5LiK5LiA5Liq5q616JC955qE5pyr5bC+57Si5byVXG4gICAgICAgICAgICAgICAgICAgIC8vIOabv+aNouebruagh+Wtl+esplxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGUuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKrmrrXokL3lhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5Yy56YWN5Yiw55qE5a2X56ym55qE57Si5byVXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZWxlbWVudC5jaGFyYWN0ZXJzLmluZGV4T2YoZGF0YS5kYXRhLmtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmnInljLnphY3nmoTlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5paw5a2X56ym6ZyA6KaB5o+S5YWl55qE5L2N572uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnNlcnRTdGFydCA9IGluZGV4ICsgZGF0YS5kYXRhLmtleXdvcmQubGVuZ3RoICsgZWxlbWVudFsnc3RhcnQnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luc2VydFN0YXJ0OicgKyBpbnNlcnRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6ZyA6KaB5pu/5o2i5oiQ5Lul5LiL5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdDaGFyYWN0ZXJzID0gZGF0YS5kYXRhLnJlcGxhY2Vfd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Zyo57Si5byV5ZCO5o+S5YWl5paw5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5pbnNlcnRDaGFyYWN0ZXJzKGluc2VydFN0YXJ0ICsgb2Zmc2V0RW5kLCBuZXdDaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5qC55o2u57Si5byV5Yig6Zmk5pen5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5kZWxldGVDaGFyYWN0ZXJzKGluZGV4ICsgZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldEVuZCwgaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXlgY/np7vmlbDlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2Zmc2V0U3RhcnQgPSBsYXN0X29mZnNldEVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRFbmQgKz0gZGF0YS5kYXRhLnJlcGxhY2Vfd29yZC5sZW5ndGggLSBkYXRhLmRhdGEua2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGlsZSBvZmZzZXRTdGFydDonICsgb2Zmc2V0U3RhcnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGlsZSBvZmZzZXRFbmQ6JyArIG9mZnNldEVuZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5qOA57Si5Yiw55uu5qCH5a2X56ym55qE57Si5byV77yM5LiL5LiA5qyhIHdoaWxlIOW+queOr+WcqOatpOS9jee9ruWQjuW8gOWni+afpeaJvlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4ICsgZGF0YS5kYXRhLmtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rKh5pyJ5Yy56YWN55qE5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyB3aGlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ29mZnNldFN0YXJ0OicgKyBvZmZzZXRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvZmZzZXRFbmQ6JyArIG9mZnNldEVuZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdlbGVtZW50OicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQgdGhpc1N0YXJ0ID0gZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAodGhpc1N0YXJ0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB0aGlzU3RhcnQgPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZWxlbWVudFsnc3RhcnQnXSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHRoaXNTdGFydCA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlsIbljZXkuKrmrrXokL3nmoTnvKnov5vjgIHluo/lj7fmoLflvI/orrDlvZXliLDmlbDnu4TlhoVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlVGVtcC5wdXNoKHsgJ3N0YXJ0JzogbGFzdF9vZmZzZXRFbmQsICdlbmQnOiBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgJ2luZGVudGF0aW9uJzogZWxlbWVudFsnaW5kZW50YXRpb24nXSA+IDAgPyBlbGVtZW50WydpbmRlbnRhdGlvbiddIDogZWxlbWVudFsnaW5kZW50YXRpb24nXSwgJ2xpc3RPcHRpb25zJzogZWxlbWVudFsnbGlzdE9wdGlvbnMnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rfb2Zmc2V0RW5kID0gZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyDorr7nva7nvKnov5tcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0ZW1bJ25vZGUnXS5zZXRSYW5nZUluZGVudGF0aW9uKGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRTdGFydCwgZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsIGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gPiAwID8gZWxlbWVudFsnaW5kZW50YXRpb24nXSAtIDEgOiBlbGVtZW50WydpbmRlbnRhdGlvbiddKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8g6K6+572u5bqP5Y+3XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVtWydub2RlJ10uc2V0UmFuZ2VMaXN0T3B0aW9ucyhlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnQsIGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCBlbGVtZW50WydsaXN0T3B0aW9ucyddKVxuICAgICAgICAgICAgICAgICAgICB9KTsgLy8gdGV4dFN0eWxlLmZvckVhY2hcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6+572u57yp6L+b44CB5bqP5Y+3XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCforr7nva7nvKnov5vjgIHluo/lj7fvvJonKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3R5bGVUZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGVUZW1wIOiusOW9leS6huavj+S4quauteiQveeahOe8qei/m+OAgeW6j+WPt+agt+W8j++8jOmBjeWOhuaVsOe7hOS9v+W+l+S/ruaUueWtl+espuWQjueahOaWh+acrOWbvuWxguagt+W8j+S4jeWPmFxuICAgICAgICAgICAgICAgICAgICBzdHlsZVRlbXAuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5zZXRSYW5nZUxpc3RPcHRpb25zKGVsZW1lbnRbJ3N0YXJ0J10sIGVsZW1lbnRbJ2VuZCddLCBlbGVtZW50WydsaXN0T3B0aW9ucyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5zZXRSYW5nZUluZGVudGF0aW9uKGVsZW1lbnRbJ3N0YXJ0J10sIGVsZW1lbnRbJ2VuZCddLCBlbGVtZW50WydpbmRlbnRhdGlvbiddKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgICAgICAgICAgLy8gdmFyIHNlYXJjaFJlZ0V4cCA9IG5ldyBSZWdFeHAoZGF0YS5kYXRhLmtleXdvcmQsICdnJylcbiAgICAgICAgICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgICAgICAgICAvLyBpdGVtWydub2RlJ10uY2hhcmFjdGVycyA9IGl0ZW1bJ25vZGUnXS5jaGFyYWN0ZXJzLnJlcGxhY2Uoc2VhcmNoUmVnRXhwLCBkYXRhLmRhdGEucmVwbGFjZV93b3JkKVxuICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgIH0pOyAvLyB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2hcbiAgICAgICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnLCAnaGFzTWlzc2luZ0ZvbnRDb3VudCc6IGhhc01pc3NpbmdGb250Q291bnQgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0YXJnZXRfVGV4dF9Ob2RlOicpO1xuICAgIH0pO1xufSAvLyBhc3luYyBmdW5jdGlvbiByZXBsYWNlXG4vLyBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbml7bvvIzpgJrnn6UgVUkg5pi+56S65LiN5ZCM55qE5o+Q56S6XG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZSgpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IGZhbHNlIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwga2V5d29yZCkge1xuICAgIGNvbnNvbGUubG9nKCdmdW5jIGZpbmRLZXlXb3JkIGJlZ2luJyk7XG4gICAgcmVxX2NvdXQgPSAwO1xuICAgIC8vIOWcqOaWh+acrOWbvuWxguS4re+8jOWMuemFjeWFs+mUruWtl1xuICAgIGxldCBkYXRhX2l0ZW07XG4gICAgbGV0IGRhdGFfaXRlbV9saXN0ID0gW107XG4gICAgbGV0IGRhdGFfdGVtcDtcbiAgICBsZXQgbm9kZTsgLy8g6K6w5b2V6YGN5Y6G5Yiw55qE5Zu+5bGCXG4gICAgbGV0IGxlbiA9IG5vZGVfbGlzdC5sZW5ndGg7XG4gICAgbGV0IG15X3Byb2dyZXNzID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgbXlfcHJvZ3Jlc3MrKztcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnbG9hZGluZycsICdteV9wcm9ncmVzcyc6IHsgJ2luZGV4JzogbXlfcHJvZ3Jlc3MsICd0b3RhbCc6IG5vZGVfbGlzdC5sZW5ndGggfSB9KTtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlX2xpc3RbaV07XG4gICAgICAgICAgICBpZiAobm9kZVsnY2hhcmFjdGVycyddLmluZGV4T2Yoa2V5d29yZCkgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWIsOWFs+mUruivjVxuICAgICAgICAgICAgICAgIGxldCB0aGlzX3BhcmVudDtcbiAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNMb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgYW5jZXN0b3JfdHlwZSA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSB8fCBhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOWbvuWxguacrOi6q+WwseaYr+mUgeWumuaIlumakOiXj+eKtuaAgVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W56WW5YWI5YWD57Sg55qE54q25oCBXG4gICAgICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzX3BhcmVudC50eXBlICE9ICdQQUdFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC50eXBlID09ICdDT01QT05FTlQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfdHlwZSA9ICdDT01QT05FTlQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnR5cGUgPT0gJ0lOU1RBTkNFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX3R5cGUgPSAnSU5TVEFOQ0UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkgJiYgYW5jZXN0b3JfdHlwZSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc19wYXJlbnQgPSB0aGlzX3BhcmVudC5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g5Y2V5Liq5Zu+5bGC55qE5pWw5o2uXG4gICAgICAgICAgICAgICAgZGF0YV9pdGVtID0geyAnbm9kZSc6IG5vZGUsICdhbmNlc3Rvcl9pc1Zpc2libGUnOiBhbmNlc3Rvcl9pc1Zpc2libGUsICdhbmNlc3Rvcl9pc0xvY2tlZCc6IGFuY2VzdG9yX2lzTG9ja2VkLCAnYW5jZXN0b3JfdHlwZSc6IGFuY2VzdG9yX3R5cGUgfTtcbiAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLnB1c2goZGF0YV9pdGVtKTtcbiAgICAgICAgICAgICAgICAvLyDmnoTlu7rmlbDmja7vvIzkvKDpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGtleXdvcmRfbGVuZ3RoID0ga2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO5Y2V5LiqIFRFWFQg5Zu+5bGC5YaF5Y+v6IO95a2Y5Zyo5aSa5Liq56ym5ZCI5p2h5Lu255qE5a2X56ym77yM5omA5Lul6ZyA6KaB5b6q546v5p+l5om+XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbm9kZS5jaGFyYWN0ZXJzLmluZGV4T2Yoa2V5d29yZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5kZXg6Jyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWwhuafpeaJvueahOWtl+espui1t+Wni+OAgee7iOatouS9jee9ruWPkemAgee7mSBVSVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ3RhcmdldF9UZXh0X05vZGUnOiBbeyAnaWQnOiBkYXRhX2l0ZW1bJ25vZGUnXS5pZCwgJ2NoYXJhY3RlcnMnOiBkYXRhX2l0ZW1bJ25vZGUnXS5jaGFyYWN0ZXJzLCAnc3RhcnQnOiBpbmRleCwgJ2VuZCc6IGluZGV4ICsga2V5d29yZC5sZW5ndGgsICdoYXNNaXNzaW5nRm9udCc6IGRhdGFfaXRlbVsnbm9kZSddLmhhc01pc3NpbmdGb250IH1dIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZnVuYyBmaW5kS2V5V29yZCBmaW5kZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOavj+S4quWFs+mUruWtl+eahOaVsOaNrlxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YV90ZW1wID0geyAnaWQnOiBub2RlLmlkLCAnY2hhcmFjdGVycyc6IG5vZGUuY2hhcmFjdGVycywgJ3N0YXJ0JzogaW5kZXgsICdlbmQnOiBpbmRleCArIGtleXdvcmQubGVuZ3RoLCAnaGFzTWlzc2luZ0ZvbnQnOiBub2RlLmhhc01pc3NpbmdGb250LCAnYW5jZXN0b3JfdHlwZSc6IGFuY2VzdG9yX3R5cGUgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXFfY291dCA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ2ZpbmRfZW5kJzogZmFsc2UsICd0YXJnZXRfVGV4dF9Ob2RlJzogW2RhdGFfdGVtcF0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2l0ZW1fbGlzdC5wdXNoKGRhdGFfdGVtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXFfY291dCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvdW50OicgKyByZXFfY291dC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOWKoOi9veWtl+S9k1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbXlMb2FkRm9udEFzeW5jKFt7ICdpZCc6IGRhdGFfaXRlbVsnbm9kZSddLmlkLCAnY2hhcmFjdGVycyc6IGRhdGFfaXRlbVsnbm9kZSddLmNoYXJhY3RlcnMsICdzdGFydCc6IGluZGV4LCAnZW5kJzogaW5kZXggKyBrZXl3b3JkLmxlbmd0aCwgJ2hhc01pc3NpbmdGb250JzogZGF0YV9pdGVtWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQgfV0pXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4ICsga2V5d29yZF9sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Bvc3RNZXNzYWdlJyk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIHsgJ25vZGUnOiBub2RlX2xpc3Rbal0sICdhbmNlc3Rvcl9pc1Zpc2libGUnOiBhbmNlc3Rvcl9pc1Zpc2libGUsICdhbmNlc3Rvcl9pc0xvY2tlZCc6IGFuY2VzdG9yX2lzTG9ja2VkIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTApO1xuICAgIH1cbiAgICAvLyBub2RlX2xpc3QuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAvLyB9KTtcbiAgICAvLyBmb3IgKHZhciBqID0gMDsgaiA8IG5vZGVfbGlzdC5sZW5ndGg7IGorKykge1xuICAgIC8vIH1cbiAgICAvLyBjb25zb2xlLmxvZygnZmluZCBlbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgY29uc29sZS5sb2coJ2Z1bmMgZmluZEtleVdvcmQgZW5kJyk7XG4gICAgLy8gY29uc29sZS5sb2coZGF0YV9pdGVtX2xpc3QpO1xuICAgIC8vIHRvSFRNTCA9IGRhdGFfaXRlbV9saXN0XG4gICAgcmV0dXJuIGRhdGFfaXRlbV9saXN0O1xufVxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9jb2RlLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=