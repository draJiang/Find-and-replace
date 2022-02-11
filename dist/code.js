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
console.log('2022-02-09');
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
        console.log(msg);
        // 执行搜索
        find(msg.data);
        console.log('search target_Text_Node:');
        console.log(target_Text_Node);
        console.log('console.log(target_Text_Node.length);' + target_Text_Node.length.toString());
        let toUIHTML = []; // 存储数据，用于发送给 UI
        if (target_Text_Node.length >= 0) {
            // 如果存在符合搜索条件的 TEXT 图层
            // console.log('target_Text_Node.forEach:');
            target_Text_Node.forEach(item => {
                var position = 0;
                // 构建数据，传送给 UI
                while (true) {
                    // 由于单个 TEXT 图层内可能存在多个符合条件的字符，所以需要循环查找
                    var index = item['node'].characters.indexOf(msg.data.keyword, position);
                    // console.log('index:');
                    // console.log(index);
                    if (index > -1) {
                        // 将查找的字符起始、终止位置发送给 UI
                        toUIHTML.push({ 'id': item['node'].id, 'characters': item['node'].characters, 'start': index, 'end': index + msg.data.keyword.length, 'hasMissingFont': item['node'].hasMissingFont });
                        position = index + msg.data.keyword.length;
                    }
                    else {
                        break;
                    }
                }
            });
            console.log('if :toUIHTML:');
            // console.log(toUIHTML);
        }
        figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': toUIHTML });
        const loadFont = () => __awaiter(this, void 0, void 0, function* () { myLoadFontAsync(target_Text_Node); });
        loadFont();
    }
    // UI 中点击搜索结果项
    if (msg.type === 'listOnClik') {
        console.log('code js:listOnClik:');
        console.log(msg);
        var targetNode;
        console.log('forEach:');
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
        console.log('myLoadFontAsync:');
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
                // console.log('find end load font:');
                // console.log('loaded_fonts:');
                // console.log(loaded_fonts);
                // console.log('font:');
                // console.log(font);
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
    var selection = figma.currentPage.selection;
    var node_list = []; // 存储目标值 —— 选中图层中，所有文本图层
    // 当前未选中图层，则在当前页面搜索
    if (selection.length == 0) {
        // node_list = figma.currentPage.findAll(n => n.type === "TEXT")
        selection = figma.currentPage.children;
        // node_list = myFindTextAll(figma.currentPage, node_list)
    }
    else {
        // 当前有选中图层，则在选中的图层中搜索
        // 在当前选中的图层中，搜索文本图层
    }
    for (let i = 0; i < selection.length; i++) {
        // console.log('find:for selection');
        node_list = myFindTextAll(selection[i], node_list);
    }
    // console.log('selection:');
    // console.log(selection);
    console.log('Find end:');
    // console.log(node_list);
    // 在文本图层中，匹配关键字
    for (var j = 0; j < node_list.length; j++) {
        // console.log(node_list[j]['node']);
        if (node_list[j]['characters'].indexOf(data.keyword) > -1) {
            // 找到关键词
            let this_parent;
            let ancestor_isVisible = true;
            let ancestor_isLocked = false;
            if (node_list[j].locked == true) {
                ancestor_isLocked = true;
            }
            if (node_list[j].visible == false) {
                ancestor_isVisible = false;
            }
            if (ancestor_isVisible == false || ancestor_isLocked == true) {
                // 如果图层本身就是锁定或隐藏状态
            }
            else {
                // 获取祖先元素的状态
                this_parent = node_list[j].parent;
                while (this_parent.type != 'PAGE') {
                    if (this_parent.locked == true) {
                        ancestor_isLocked = true;
                    }
                    if (this_parent.visible == false) {
                        ancestor_isVisible = false;
                    }
                    if (ancestor_isVisible == false || ancestor_isLocked == true) {
                        break;
                    }
                    else {
                        this_parent = this_parent.parent;
                    }
                }
            }
            target_Text_Node.push({ 'node': node_list[j], 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked });
        }
    }
}
// 替换
function replace(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('replace');
        // console.log(data);
        console.log(target_Text_Node);
        let hasMissingFontCount = 0;
        target_Text_Node.forEach(item => {
            console.log('replace target_Text_Node.forEach:');
            console.log(item);
            if (item['ancestor_isVisible'] == false || item['ancestor_isLocked'] == true) {
                // 忽略隐藏、锁定的图层
            }
            else {
                console.log('node:');
                console.log(item['node']['fontName']);
                console.log(item['node'].hasMissingFont);
                if (item['node'].hasMissingFont) {
                    // 字体不支持
                    console.log('hasMissingFont');
                    hasMissingFontCount += 1;
                }
                else {
                    let textStyle = item['node'].getStyledTextSegments(['indentation', 'listOptions']);
                    console.log('textStyle:');
                    console.log(textStyle);
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
                                console.log('insertStart:' + insertStart.toString());
                                // 需要替换成以下字符
                                let newCharacters = data.data.replace_word;
                                // 在索引后插入新字符
                                item['node'].insertCharacters(insertStart + offsetEnd, newCharacters);
                                // 根据索引删除旧字符
                                item['node'].deleteCharacters(index + element['start'] + offsetEnd, insertStart + offsetEnd);
                                // 记录偏移数值
                                // offsetStart = last_offsetEnd
                                offsetEnd += data.data.replace_word.length - data.data.keyword.length;
                                console.log('while offsetStart:' + offsetStart.toString());
                                console.log('while offsetEnd:' + offsetEnd.toString());
                                // 记录检索到目标字符的索引，下一次 while 循环在此位置后开始查找
                                position = index + data.data.keyword.length;
                            }
                            else {
                                // 没有匹配的字符
                                break;
                            } // else
                        } // while
                        console.log('offsetStart:' + offsetStart.toString());
                        console.log('offsetEnd:' + offsetEnd.toString());
                        console.log('element:');
                        console.log(element);
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
                    console.log('设置缩进、序号：');
                    console.log(styleTemp);
                    // styleTemp 记录了每个段落的缩进、序号样式，遍历数组使得修改字符后的文本图层样式不变
                    styleTemp.forEach(element => {
                        console.log('indentation' + element['indentation'].toString());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHNCQUFzQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyx3QkFBd0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFELDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxxS0FBcUs7QUFDN007QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiw4Q0FBOEM7QUFDN0UsOEVBQThFLG9DQUFvQztBQUNsSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsNkJBQTZCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IseUJBQXlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyx3R0FBd0c7QUFDNUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDLHdDQUF3QztBQUN4Qyw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLGdNQUFnTTtBQUN6TztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLEdBQUc7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLFNBQVMsR0FBRztBQUNaO0FBQ0EsK0JBQStCLCtEQUErRDtBQUM5RjtBQUNBLEtBQUs7QUFDTCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvREFBb0Q7QUFDbkY7QUFDQTtBQUNBLCtCQUErQixxREFBcUQ7QUFDcEY7QUFDQTs7Ozs7Ozs7VUV0WkE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2UvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0BmaWdtYS9wbHVnaW4tdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cbmxldCB0YXJnZXRfVGV4dF9Ob2RlID0gW107IC8vIOWtmOWCqOespuWQiOaQnOe0ouadoeS7tueahCBURVhUIOWbvuWxglxubGV0IGxvYWRlZF9mb250cyA9IFtdO1xuY29uc29sZS5sb2coJzIwMjItMDItMDknKTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzAwLCBoZWlnaHQ6IDM0MCB9KTtcbi8vIGNvbnNvbGUubG9nKCdoZWxsbzInKVxub25TZWxlY3Rpb25DaGFuZ2UoKTtcbi8vIOe7keWumiBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbkuovku7ZcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHsgb25TZWxlY3Rpb25DaGFuZ2UoKTsgfSk7XG4vLyBVSSDlj5HmnaXmtojmga9cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pCc57Si44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VhcmNoJykge1xuICAgICAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmRfbG9hZGluZycgfSlcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAvLyDmiafooYzmkJzntKJcbiAgICAgICAgZmluZChtc2cuZGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2ggdGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aCk7JyArIHRhcmdldF9UZXh0X05vZGUubGVuZ3RoLnRvU3RyaW5nKCkpO1xuICAgICAgICBsZXQgdG9VSUhUTUwgPSBbXTsgLy8g5a2Y5YKo5pWw5o2u77yM55So5LqO5Y+R6YCB57uZIFVJXG4gICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aCA+PSAwKSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlrZjlnKjnrKblkIjmkJzntKLmnaHku7bnmoQgVEVYVCDlm77lsYJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2g6Jyk7XG4gICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAvLyDmnoTlu7rmlbDmja7vvIzkvKDpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKogVEVYVCDlm77lsYLlhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbVsnbm9kZSddLmNoYXJhY3RlcnMuaW5kZXhPZihtc2cuZGF0YS5rZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleDonKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5p+l5om+55qE5a2X56ym6LW35aeL44CB57uI5q2i5L2N572u5Y+R6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VJSFRNTC5wdXNoKHsgJ2lkJzogaXRlbVsnbm9kZSddLmlkLCAnY2hhcmFjdGVycyc6IGl0ZW1bJ25vZGUnXS5jaGFyYWN0ZXJzLCAnc3RhcnQnOiBpbmRleCwgJ2VuZCc6IGluZGV4ICsgbXNnLmRhdGEua2V5d29yZC5sZW5ndGgsICdoYXNNaXNzaW5nRm9udCc6IGl0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBtc2cuZGF0YS5rZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaWYgOnRvVUlIVE1MOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codG9VSUhUTUwpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZCcsICd0YXJnZXRfVGV4dF9Ob2RlJzogdG9VSUhUTUwgfSk7XG4gICAgICAgIGNvbnN0IGxvYWRGb250ID0gKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgeyBteUxvYWRGb250QXN5bmModGFyZ2V0X1RleHRfTm9kZSk7IH0pO1xuICAgICAgICBsb2FkRm9udCgpO1xuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vmkJzntKLnu5PmnpzpoblcbiAgICBpZiAobXNnLnR5cGUgPT09ICdsaXN0T25DbGlrJykge1xuICAgICAgICBjb25zb2xlLmxvZygnY29kZSBqczpsaXN0T25DbGlrOicpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZTtcbiAgICAgICAgY29uc29sZS5sb2coJ2ZvckVhY2g6Jyk7XG4gICAgICAgIC8vIOmBjeWOhuaQnOe0oue7k+aenFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldF9UZXh0X05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV0uaWQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLmRhdGEuaXRlbSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtc2cuZGF0YVsnaXRlbSddKTtcbiAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaWQgPT0gbXNnLmRhdGFbJ2l0ZW0nXSkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWIsOeUqOaIt+eCueWHu+eahOWbvuWxglxuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUgPT09IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXTtcbiAgICAgICAgICAgICAgICAvLyBGaWdtYSDop4blm77lrprkvY3liLDlr7nlupTlm77lsYJcbiAgICAgICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW3RhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXV0pO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOmAieS4reWvueW6lOaWh+acrFxuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGVkVGV4dFJhbmdlID0geyAnbm9kZSc6IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXSwgJ3N0YXJ0JzogbXNnLmRhdGFbJ3N0YXJ0J10sICdlbmQnOiBtc2cuZGF0YVsnZW5kJ10gfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vkuobjgIzmm7/mjaLjgI3mjInpkq5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXBsYWNlJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVwbGFjZScpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAvLyDmiafooYzmm7/mjaJcbiAgICAgICAgcmVwbGFjZShtc2cpO1xuICAgIH1cbn07XG4vLyDmn6Xmib7lm77lsYLkuIvnmoTmlofmnKzlm77lsYLvvIzovpPlhaUgZmlnbWEg5Zu+5bGC5a+56LGh77yM6L+U5Zue5om+5Yiw5omA5pyJ5paH5pys5Zu+5bGCXG5mdW5jdGlvbiBteUZpbmRUZXh0QWxsKG5vZGUsIG5vZGVfbGlzdCwgYW5jZXN0b3JfaXNMb2NrZWQsIGFuY2VzdG9yX2lzVmlzaWJsZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdteUZpbmRBbGwnKTtcbiAgICAvLyBjb25zb2xlLmxvZyhpc0xvY2tlZCk7XG4gICAgbGV0IGxvY2tlZCA9IGZhbHNlOyAvLyDlrZjlgqjmnIDnu4jnmoTnirbmgIFcbiAgICBsZXQgdmlzaWJsZSA9IHRydWU7XG4gICAgLy8g5aaC5p6c55uu5qCH5Zu+5bGC5pys6Lqr5bCx5pivIFRFWFQg5Zu+5bGCXG4gICAgaWYgKG5vZGUudHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgLy8gLy8g5paH5pys5Zu+5bGC5piv5ZCm6ZSB5a6a44CB6ZqQ6JeP77yfXG4gICAgICAgIC8vIGlmIChub2RlLmxvY2tlZCkge1xuICAgICAgICAvLyAgIC8vIOmUgeWumlxuICAgICAgICAvLyAgIGxvY2tlZCA9IHRydWVcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICBsb2NrZWQgPSBmYWxzZVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGlmIChub2RlLnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgLy8gICAvLyDpmpDol49cbiAgICAgICAgLy8gICB2aXNpYmxlID0gZmFsc2VcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICB2aXNpYmxlID0gdHJ1ZVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIC8vIOelluWFiOWbvuWxgueahOmUgeWumuOAgemakOiXj+eKtuaAgeS8mOWFiOe6p+mrmFxuICAgICAgICAvLyBpZiAoYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAvLyAgIC8vIOelluWFiOaYr+mUgeWumueKtuaAgVxuICAgICAgICAvLyAgIGxvY2tlZCA9IHRydWVcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAvLyDnpZblhYjpnZ7plIHlrprnirbmgIFcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgIC8vICAgLy8g56WW5YWI5piv6ZqQ6JeP54q25oCBXG4gICAgICAgIC8vICAgdmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgLy8g56WW5YWI6Z2e6ZqQ6JeP54q25oCBXG4gICAgICAgIC8vIH1cbiAgICAgICAgbm9kZV9saXN0LnB1c2gobm9kZSk7XG4gICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgfVxuICAgIHZhciB0aGlzQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIC8vICDlpoLmnpzlvZPliY3oioLngrnkuIvlrZjlnKjlrZDoioLngrlcbiAgICBpZiAodGhpc0NoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyDlvZPliY3oioLngrnml6DlrZDoioLngrnvvIzlj6/og73mmK/lvaLnirblm77lsYJcbiAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICB9XG4gICAgLy8gaWYgKGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAvLyAgIC8vIOelluWFiOaYr+mUgeWumueKtuaAgVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAvLyDnpZblhYjpnZ7plIHlrprnirbmgIFcbiAgICAvLyAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdGhpc0NoaWxkcmVuLmxvY2tlZFxuICAgIC8vIH1cbiAgICAvLyBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlKSB7XG4gICAgLy8gICAvLyDnpZblhYjmmK/pmpDol4/nirbmgIFcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgLy8g56WW5YWI6Z2e6ZqQ6JeP54q25oCBXG4gICAgLy8gICBhbmNlc3Rvcl9pc1Zpc2libGUgPSB0aGlzQ2hpbGRyZW4udmlzaWJsZVxuICAgIC8vIH1cbiAgICAvLyDpgY3ljoblrZDoioLngrlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXNDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndGhpc0NoaWxkcmVuOicpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXNDaGlsZHJlbik7XG4gICAgICAgIGlmICh0aGlzQ2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnISEhRVJSTyB0aGlzQ2hpbGRyZW49PXVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICAgICAgfVxuICAgICAgICAvLyDlpoLmnpzoioLngrnnmoTnsbvlnovkuLogVEVYVFxuICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICBub2RlX2xpc3QucHVzaCh0aGlzQ2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5pivIFRFWFQg5Zu+5bGCXG4gICAgICAgICAgICAvLyDlpoLmnpzljIXlkKvlrZDlm77lsYJcbiAgICAgICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0uY2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIOelluWFiOaYr+mUgeWumueKtuaAgVxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIOelluWFiOmdnumUgeWumueKtuaAgVxuICAgICAgICAgICAgICAgICAgICAvLyAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdGhpc0NoaWxkcmVuW2ldLmxvY2tlZFxuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAvLyDnpZblhYjmmK/pmpDol4/nirbmgIFcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAvLyDnpZblhYjpnZ7pmpDol4/nirbmgIFcbiAgICAgICAgICAgICAgICAgICAgLy8gICBhbmNlc3Rvcl9pc1Zpc2libGUgPSB0aGlzQ2hpbGRyZW4udmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgIG5vZGVfbGlzdCA9IG15RmluZFRleHRBbGwodGhpc0NoaWxkcmVuW2ldLCBub2RlX2xpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnbm9kZV9saXN0OicpO1xuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgcmV0dXJuIG5vZGVfbGlzdDtcbn1cbi8vIOWKoOi9veWtl+S9k1xuZnVuY3Rpb24gbXlMb2FkRm9udEFzeW5jKHRleHRfbGF5ZXJfTGlzdCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdteUxvYWRGb250QXN5bmM6Jyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRleHRfbGF5ZXJfTGlzdCk7XG4gICAgICAgIGZvciAobGV0IGxheWVyIG9mIHRleHRfbGF5ZXJfTGlzdCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLS0nKTtcbiAgICAgICAgICAgIC8vIOWKoOi9veWtl+S9k1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xheWVyOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobGF5ZXIpO1xuICAgICAgICAgICAgbGV0IGZvbnRzID0gbGF5ZXJbJ25vZGUnXS5nZXRSYW5nZUFsbEZvbnROYW1lcygwLCBsYXllclsnbm9kZSddWydjaGFyYWN0ZXJzJ10ubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb250czonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZvbnRzKTtcbiAgICAgICAgICAgIGZvciAobGV0IGZvbnQgb2YgZm9udHMpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZmluZCBlbmQgbG9hZCBmb250OicpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsb2FkZWRfZm9udHM6Jyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9hZGVkX2ZvbnRzKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9udDonKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmb250KTtcbiAgICAgICAgICAgICAgICBsZXQgYmluZ28gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBsb2FkZWRfZm9udCBvZiBsb2FkZWRfZm9udHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRlZF9mb250WydmYW1pbHknXSA9PSBmb250WydmYW1pbHknXSAmJiBsb2FkZWRfZm9udFsnc3R5bGUnXSA9PSBmb250WydzdHlsZSddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5nbyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhiaW5nbyk7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmdvKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5a2X5L2T5piv5ZCm5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXllclsnbm9kZSddLmhhc01pc3NpbmdGb250KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDkuI3mlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoYXNNaXNzaW5nRm9udCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkZWRfZm9udHMucHVzaChmb250KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2FkRm9udEFzeW5jJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKGZvbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG15Rm9udCk7XG4gICAgICAgIC8vIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMobXlGb250KVxuICAgIH0pO1xufVxuLy8g5pCc57SiXG5mdW5jdGlvbiBmaW5kKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZygnY29uZGUudHM6ZmluZDonKTtcbiAgICAvLyBjb25zb2xlLmxvZyhmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgLy8g5riF56m65Y6G5Y+y5pCc57Si5pWw5o2u77yM6YeN5paw5pCc57SiXG4gICAgdGFyZ2V0X1RleHRfTm9kZSA9IFtdO1xuICAgIHZhciBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgdmFyIG5vZGVfbGlzdCA9IFtdOyAvLyDlrZjlgqjnm67moIflgLwg4oCU4oCUIOmAieS4reWbvuWxguS4re+8jOaJgOacieaWh+acrOWbvuWxglxuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gbm9kZV9saXN0ID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZEFsbChuID0+IG4udHlwZSA9PT0gXCJURVhUXCIpXG4gICAgICAgIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuO1xuICAgICAgICAvLyBub2RlX2xpc3QgPSBteUZpbmRUZXh0QWxsKGZpZ21hLmN1cnJlbnRQYWdlLCBub2RlX2xpc3QpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyDlvZPliY3mnInpgInkuK3lm77lsYLvvIzliJnlnKjpgInkuK3nmoTlm77lsYLkuK3mkJzntKJcbiAgICAgICAgLy8g5Zyo5b2T5YmN6YCJ5Lit55qE5Zu+5bGC5Lit77yM5pCc57Si5paH5pys5Zu+5bGCXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmaW5kOmZvciBzZWxlY3Rpb24nKTtcbiAgICAgICAgbm9kZV9saXN0ID0gbXlGaW5kVGV4dEFsbChzZWxlY3Rpb25baV0sIG5vZGVfbGlzdCk7XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdzZWxlY3Rpb246Jyk7XG4gICAgLy8gY29uc29sZS5sb2coc2VsZWN0aW9uKTtcbiAgICBjb25zb2xlLmxvZygnRmluZCBlbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICAvLyDlnKjmlofmnKzlm77lsYLkuK3vvIzljLnphY3lhbPplK7lrZdcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5vZGVfbGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlX2xpc3Rbal1bJ25vZGUnXSk7XG4gICAgICAgIGlmIChub2RlX2xpc3Rbal1bJ2NoYXJhY3RlcnMnXS5pbmRleE9mKGRhdGEua2V5d29yZCkgPiAtMSkge1xuICAgICAgICAgICAgLy8g5om+5Yiw5YWz6ZSu6K+NXG4gICAgICAgICAgICBsZXQgdGhpc19wYXJlbnQ7XG4gICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCBhbmNlc3Rvcl9pc0xvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG5vZGVfbGlzdFtqXS5sb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlX2xpc3Rbal0udmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSB8fCBhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5pys6Lqr5bCx5piv6ZSB5a6a5oiW6ZqQ6JeP54q25oCBXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDojrflj5bnpZblhYjlhYPntKDnmoTnirbmgIFcbiAgICAgICAgICAgICAgICB0aGlzX3BhcmVudCA9IG5vZGVfbGlzdFtqXS5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXNfcGFyZW50LnR5cGUgIT0gJ1BBR0UnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC5sb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlIHx8IGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc19wYXJlbnQgPSB0aGlzX3BhcmVudC5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLnB1c2goeyAnbm9kZSc6IG5vZGVfbGlzdFtqXSwgJ2FuY2VzdG9yX2lzVmlzaWJsZSc6IGFuY2VzdG9yX2lzVmlzaWJsZSwgJ2FuY2VzdG9yX2lzTG9ja2VkJzogYW5jZXN0b3JfaXNMb2NrZWQgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyDmm7/mjaJcbmZ1bmN0aW9uIHJlcGxhY2UoZGF0YSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgbGV0IGhhc01pc3NpbmdGb250Q291bnQgPSAwO1xuICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmVwbGFjZSB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2g6Jyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgICAgIGlmIChpdGVtWydhbmNlc3Rvcl9pc1Zpc2libGUnXSA9PSBmYWxzZSB8fCBpdGVtWydhbmNlc3Rvcl9pc0xvY2tlZCddID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyDlv73nlaXpmpDol4/jgIHplIHlrprnmoTlm77lsYJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub2RlOicpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW1bJ25vZGUnXVsnZm9udE5hbWUnXSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbVsnbm9kZSddLmhhc01pc3NpbmdGb250KTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVsnbm9kZSddLmhhc01pc3NpbmdGb250KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWtl+S9k+S4jeaUr+aMgVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGFzTWlzc2luZ0ZvbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFzTWlzc2luZ0ZvbnRDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRTdHlsZSA9IGl0ZW1bJ25vZGUnXS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoWydpbmRlbnRhdGlvbicsICdsaXN0T3B0aW9ucyddKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RleHRTdHlsZTonKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGV4dFN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFN0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldEVuZCA9IDA7IC8vIOiusOW9leS/ruaUueWtl+espuWQjueahOe0ouW8leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVUZW1wID0gW107IC8vIOiusOW9leavj+S4quauteiQveagt+W8j+WcqOS/ruaUueWQjueahOagt+W8j+e0ouW8le+8iOWcqOabv+aNouWujOWtl+espuWQjumcgOimgeiuvue9ruWbnuS5i+WJjeeahOagt+W8j++8iVxuICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdF9vZmZzZXRFbmQgPSAwOyAvLyDorrDlvZXkuIrkuIDkuKrmrrXokL3nmoTmnKvlsL7ntKLlvJVcbiAgICAgICAgICAgICAgICAgICAgLy8g5pu/5o2i55uu5qCH5a2X56ymXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUseS6juWNleS4quauteiQveWGheWPr+iDveWtmOWcqOWkmuS4quespuWQiOadoeS7tueahOWtl+espu+8jOaJgOS7pemcgOimgeW+queOr+afpeaJvlxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bljLnphY3liLDnmoTlrZfnrKbnmoTntKLlvJVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBlbGVtZW50LmNoYXJhY3RlcnMuaW5kZXhPZihkYXRhLmRhdGEua2V5d29yZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOacieWMuemFjeeahOWtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXmlrDlrZfnrKbpnIDopoHmj5LlhaXnmoTkvY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluc2VydFN0YXJ0ID0gaW5kZXggKyBkYXRhLmRhdGEua2V5d29yZC5sZW5ndGggKyBlbGVtZW50WydzdGFydCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5zZXJ0U3RhcnQ6JyArIGluc2VydFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpnIDopoHmm7/mjaLmiJDku6XkuIvlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NoYXJhY3RlcnMgPSBkYXRhLmRhdGEucmVwbGFjZV93b3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlnKjntKLlvJXlkI7mj5LlhaXmlrDlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVsnbm9kZSddLmluc2VydENoYXJhY3RlcnMoaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQsIG5ld0NoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7ntKLlvJXliKDpmaTml6flrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVsnbm9kZSddLmRlbGV0ZUNoYXJhY3RlcnMoaW5kZXggKyBlbGVtZW50WydzdGFydCddICsgb2Zmc2V0RW5kLCBpbnNlcnRTdGFydCArIG9mZnNldEVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvZmZzZXRTdGFydCA9IGxhc3Rfb2Zmc2V0RW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldEVuZCArPSBkYXRhLmRhdGEucmVwbGFjZV93b3JkLmxlbmd0aCAtIGRhdGEuZGF0YS5rZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3doaWxlIG9mZnNldFN0YXJ0OicgKyBvZmZzZXRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3doaWxlIG9mZnNldEVuZDonICsgb2Zmc2V0RW5kLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXmo4DntKLliLDnm67moIflrZfnrKbnmoTntKLlvJXvvIzkuIvkuIDmrKEgd2hpbGUg5b6q546v5Zyo5q2k5L2N572u5ZCO5byA5aeL5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBkYXRhLmRhdGEua2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmsqHmnInljLnphY3nmoTlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIHdoaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb2Zmc2V0U3RhcnQ6JyArIG9mZnNldFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29mZnNldEVuZDonICsgb2Zmc2V0RW5kLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VsZW1lbnQ6Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCB0aGlzU3RhcnQgPSBlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzU3RhcnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHRoaXNTdGFydCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChlbGVtZW50WydzdGFydCddID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgdGhpc1N0YXJ0ID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWwhuWNleS4quauteiQveeahOe8qei/m+OAgeW6j+WPt+agt+W8j+iusOW9leWIsOaVsOe7hOWGhVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVUZW1wLnB1c2goeyAnc3RhcnQnOiBsYXN0X29mZnNldEVuZCwgJ2VuZCc6IGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCAnaW5kZW50YXRpb24nOiBlbGVtZW50WydpbmRlbnRhdGlvbiddID4gMCA/IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gOiBlbGVtZW50WydpbmRlbnRhdGlvbiddLCAnbGlzdE9wdGlvbnMnOiBlbGVtZW50WydsaXN0T3B0aW9ucyddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9vZmZzZXRFbmQgPSBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOiuvue9rue8qei/m1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlbVsnbm9kZSddLnNldFJhbmdlSW5kZW50YXRpb24oZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0LCBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgZWxlbWVudFsnaW5kZW50YXRpb24nXSA+IDAgPyBlbGVtZW50WydpbmRlbnRhdGlvbiddIC0gMSA6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyDorr7nva7luo/lj7dcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0ZW1bJ25vZGUnXS5zZXRSYW5nZUxpc3RPcHRpb25zKGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRTdGFydCwgZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsIGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10pXG4gICAgICAgICAgICAgICAgICAgIH0pOyAvLyB0ZXh0U3R5bGUuZm9yRWFjaFxuICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7nvKnov5vjgIHluo/lj7dcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+iuvue9rue8qei/m+OAgeW6j+WPt++8micpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdHlsZVRlbXApO1xuICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZVRlbXAg6K6w5b2V5LqG5q+P5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP77yM6YGN5Y6G5pWw57uE5L2/5b6X5L+u5pS55a2X56ym5ZCO55qE5paH5pys5Zu+5bGC5qC35byP5LiN5Y+YXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlVGVtcC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2luZGVudGF0aW9uJyArIGVsZW1lbnRbJ2luZGVudGF0aW9uJ10udG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtWydub2RlJ10uc2V0UmFuZ2VMaXN0T3B0aW9ucyhlbGVtZW50WydzdGFydCddLCBlbGVtZW50WydlbmQnXSwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtWydub2RlJ10uc2V0UmFuZ2VJbmRlbnRhdGlvbihlbGVtZW50WydzdGFydCddLCBlbGVtZW50WydlbmQnXSwgZWxlbWVudFsnaW5kZW50YXRpb24nXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgIC8vIHZhciBzZWFyY2hSZWdFeHAgPSBuZXcgUmVnRXhwKGRhdGEuZGF0YS5rZXl3b3JkLCAnZycpXG4gICAgICAgICAgICAgICAgLy8gLy8gY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgICAgICAgICAgLy8gaXRlbVsnbm9kZSddLmNoYXJhY3RlcnMgPSBpdGVtWydub2RlJ10uY2hhcmFjdGVycy5yZXBsYWNlKHNlYXJjaFJlZ0V4cCwgZGF0YS5kYXRhLnJlcGxhY2Vfd29yZClcbiAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICB9KTsgLy8gdGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoXG4gICAgICAgIC8vIOabv+aNouWujOavle+8jOmAmuefpSBVSSDmm7TmlrBcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2hhc01pc3NpbmdGb250Q291bnQnOiBoYXNNaXNzaW5nRm9udENvdW50IH0pO1xuICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICB9KTtcbn0gLy8gYXN5bmMgZnVuY3Rpb24gcmVwbGFjZVxuLy8gRmlnbWEg5Zu+5bGC6YCJ5oup5Y+Y5YyW5pe277yM6YCa55+lIFVJIOaYvuekuuS4jeWQjOeahOaPkOekulxuZnVuY3Rpb24gb25TZWxlY3Rpb25DaGFuZ2UoKSB7XG4gICAgdmFyIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IHRydWUgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiBmYWxzZSB9KTtcbiAgICB9XG59XG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL2NvZGUudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==