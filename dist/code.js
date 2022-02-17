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
console.log('20220217');
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
        // 执行搜索
        setTimeout(() => { find(msg.data); }, 0);
        setTimeout(() => {
            let end = new Date().getTime();
            console.log('cost is:' + (end - start).toString());
            console.log('search target_Text_Node:');
            // console.log(target_Text_Node);
            console.log('console.log(target_Text_Node.length);' + target_Text_Node.length.toString());
            let toUIHTML = []; // 存储数据，用于发送给 UI
            if (target_Text_Node.length >= 0) {
                // 如果存在符合搜索条件的 TEXT 图层
                // console.log('target_Text_Node.forEach:');
                // console.log(target_Text_Node);
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
                            toUIHTML.push({ 'id': item['node'].id, 'characters': item['node'].characters, 'start': index, 'end': index + msg.data.keyword.length, 'hasMissingFont': item['node'].hasMissingFont, 'ancestor_type': item['ancestor_type'] });
                            position = index + msg.data.keyword.length;
                        }
                        else {
                            break;
                        }
                    }
                });
                // console.log('if :toUIHTML:');
                // console.log(toUIHTML);
            }
            console.log('toUIHTML:');
            console.log(toUIHTML);
            figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': toUIHTML });
            const loadFont = () => __awaiter(this, void 0, void 0, function* () { myLoadFontAsync(target_Text_Node); });
            loadFont();
        }, 1);
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
    }
    else {
        // 当前有选中图层，则在选中的图层中搜索
        // 在当前选中的图层中，搜索文本图层
    }
    // 遍历范围内的图层，获取 TEXT 图层
    for (let i = 0; i < selection.length; i++) {
        // console.log('find:for selection');
        // console.log(selection[i]);
        //@ts-ignore
        // console.log(selection[i].children);
        // 如果图层本身就是文本图层
        if (selection[i].type == 'TEXT') {
            node_list.push(selection[i]);
            continue;
        }
        // 如果图层下没有子图层
        //@ts-ignore
        if (selection[i].children == undefined) {
            continue;
        }
        // @ts-ignore
        node_list = node_list.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }));
        // node_list = node_list.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }))
        // node_list = myFindTextAll(selection[i], node_list)
        // console.log('node_list:');
        // console.log(node_list);
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
            let ancestor_type = '';
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
                    if (this_parent.type == 'COMPONENT') {
                        ancestor_type = 'COMPONENT';
                    }
                    if (this_parent.type == 'INSTANCE') {
                        ancestor_type = 'INSTANCE';
                    }
                    if ((ancestor_isVisible == false || ancestor_isLocked == true) && ancestor_type != '') {
                        // 如果祖先元素是锁定或隐藏状态,且组件元素是组件或实例，则跳出循环
                        break;
                    }
                    else {
                        this_parent = this_parent.parent;
                    }
                }
            }
            target_Text_Node.push({ 'node': node_list[j], 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked, 'ancestor_type': ancestor_type });
        }
    }
    // console.log('find end:');
    // console.log(target_Text_Node);
}
// 替换
function replace(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('replace');
        // console.log(data);
        console.log(target_Text_Node);
        let hasMissingFontCount = 0;
        target_Text_Node.forEach(item => {
            // console.log('replace target_Text_Node.forEach:');
            // console.log(item);
            if (item['ancestor_isVisible'] == false || item['ancestor_isLocked'] == true) {
                // 忽略隐藏、锁定的图层
            }
            else {
                console.log('node:');
                // console.log(item['node']['fontName']);
                // console.log(item['node'].hasMissingFont);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSwrQkFBK0IsK0RBQStEO0FBQzlGO0FBQ0EsS0FBSztBQUNMLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG9EQUFvRDtBQUNuRjtBQUNBO0FBQ0EsK0JBQStCLHFEQUFxRDtBQUNwRjtBQUNBOzs7Ozs7OztVRTFiQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS8uL3NyYy9jb2RlLnRzIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQGZpZ21hL3BsdWdpbi10eXBpbmdzL2luZGV4LmQudHNcIiAvPlxubGV0IHRhcmdldF9UZXh0X05vZGUgPSBbXTsgLy8g5a2Y5YKo56ym5ZCI5pCc57Si5p2h5Lu255qEIFRFWFQg5Zu+5bGCXG5sZXQgbG9hZGVkX2ZvbnRzID0gW107XG5sZXQgZmlsZVR5cGUgPSBmaWdtYS5lZGl0b3JUeXBlO1xuY29uc29sZS5sb2coJzIwMjIwMjE3Jyk7XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMwMCwgaGVpZ2h0OiAzNDAgfSk7XG4vLyBjb25zb2xlLmxvZygnaGVsbG8yJylcbm9uU2VsZWN0aW9uQ2hhbmdlKCk7XG4vLyDnu5HlrpogRmlnbWEg5Zu+5bGC6YCJ5oup5Y+Y5YyW5LqL5Lu2XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7IG9uU2VsZWN0aW9uQ2hhbmdlKCk7IH0pO1xuLy8gVUkg5Y+R5p2l5raI5oGvXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIC8vIFVJIOS4reeCueWHu+S6huOAjOaQnOe0ouOAjeaMiemSrlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3NlYXJjaCcpIHtcbiAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kX2xvYWRpbmcnIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2gnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIC8vIOaJp+ihjOaQnOe0olxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgZmluZChtc2cuZGF0YSk7IH0sIDApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb3N0IGlzOicgKyAoZW5kIC0gc3RhcnQpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCB0YXJnZXRfVGV4dF9Ob2RlOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZS5sZW5ndGgpOycgKyB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGxldCB0b1VJSFRNTCA9IFtdOyAvLyDlrZjlgqjmlbDmja7vvIznlKjkuo7lj5HpgIHnu5kgVUlcbiAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5a2Y5Zyo56ym5ZCI5pCc57Si5p2h5Lu255qEIFRFWFQg5Zu+5bGCXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGUuZm9yRWFjaDonKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIC8vIOaehOW7uuaVsOaNru+8jOS8oOmAgee7mSBVSVxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO5Y2V5LiqIFRFWFQg5Zu+5bGC5YaF5Y+v6IO95a2Y5Zyo5aSa5Liq56ym5ZCI5p2h5Lu255qE5a2X56ym77yM5omA5Lul6ZyA6KaB5b6q546v5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBpdGVtWydub2RlJ10uY2hhcmFjdGVycy5pbmRleE9mKG1zZy5kYXRhLmtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleDonKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5p+l5om+55qE5a2X56ym6LW35aeL44CB57uI5q2i5L2N572u5Y+R6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9VSUhUTUwucHVzaCh7ICdpZCc6IGl0ZW1bJ25vZGUnXS5pZCwgJ2NoYXJhY3RlcnMnOiBpdGVtWydub2RlJ10uY2hhcmFjdGVycywgJ3N0YXJ0JzogaW5kZXgsICdlbmQnOiBpbmRleCArIG1zZy5kYXRhLmtleXdvcmQubGVuZ3RoLCAnaGFzTWlzc2luZ0ZvbnQnOiBpdGVtWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQsICdhbmNlc3Rvcl90eXBlJzogaXRlbVsnYW5jZXN0b3JfdHlwZSddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBtc2cuZGF0YS5rZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2lmIDp0b1VJSFRNTDonKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0b1VJSFRNTCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndG9VSUhUTUw6Jyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b1VJSFRNTCk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAndGFyZ2V0X1RleHRfTm9kZSc6IHRvVUlIVE1MIH0pO1xuICAgICAgICAgICAgY29uc3QgbG9hZEZvbnQgPSAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7IG15TG9hZEZvbnRBc3luYyh0YXJnZXRfVGV4dF9Ob2RlKTsgfSk7XG4gICAgICAgICAgICBsb2FkRm9udCgpO1xuICAgICAgICB9LCAxKTtcbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75pCc57Si57uT5p6c6aG5XG4gICAgaWYgKG1zZy50eXBlID09PSAnbGlzdE9uQ2xpaycpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NvZGUganM6bGlzdE9uQ2xpazonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgdmFyIHRhcmdldE5vZGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb3JFYWNoOicpO1xuICAgICAgICAvLyDpgY3ljobmkJzntKLnu5PmnpxcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldLmlkKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZy5kYXRhLml0ZW0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLmRhdGFbJ2l0ZW0nXSk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmlkID09IG1zZy5kYXRhWydpdGVtJ10pIHtcbiAgICAgICAgICAgICAgICAvLyDmib7liLDnlKjmiLfngrnlh7vnmoTlm77lsYJcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlID09PSB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ107XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6KeG5Zu+5a6a5L2N5Yiw5a+55bqU5Zu+5bGCXG4gICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFt0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ11dKTtcbiAgICAgICAgICAgICAgICAvLyBGaWdtYSDpgInkuK3lr7nlupTmlofmnKxcbiAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3RlZFRleHRSYW5nZSA9IHsgJ25vZGUnOiB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10sICdzdGFydCc6IG1zZy5kYXRhWydzdGFydCddLCAnZW5kJzogbXNnLmRhdGFbJ2VuZCddIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pu/5o2i44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlcGxhY2UnKTtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgLy8g5omn6KGM5pu/5o2iXG4gICAgICAgIHJlcGxhY2UobXNnKTtcbiAgICB9XG59O1xuLy8g5p+l5om+5Zu+5bGC5LiL55qE5paH5pys5Zu+5bGC77yM6L6T5YWlIGZpZ21hIOWbvuWxguWvueixoe+8jOi/lOWbnuaJvuWIsOaJgOacieaWh+acrOWbvuWxglxuZnVuY3Rpb24gbXlGaW5kVGV4dEFsbChub2RlLCBub2RlX2xpc3QsIGFuY2VzdG9yX2lzTG9ja2VkLCBhbmNlc3Rvcl9pc1Zpc2libGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnbXlGaW5kQWxsJyk7XG4gICAgLy8gY29uc29sZS5sb2coaXNMb2NrZWQpO1xuICAgIGxldCBsb2NrZWQgPSBmYWxzZTsgLy8g5a2Y5YKo5pyA57uI55qE54q25oCBXG4gICAgbGV0IHZpc2libGUgPSB0cnVlO1xuICAgIC8vIOWmguaenOebruagh+WbvuWxguacrOi6q+WwseaYryBURVhUIOWbvuWxglxuICAgIGlmIChub2RlLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgIC8vIC8vIOaWh+acrOWbvuWxguaYr+WQpumUgeWumuOAgemakOiXj++8n1xuICAgICAgICAvLyBpZiAobm9kZS5sb2NrZWQpIHtcbiAgICAgICAgLy8gICAvLyDplIHlrppcbiAgICAgICAgLy8gICBsb2NrZWQgPSB0cnVlXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgbG9ja2VkID0gZmFsc2VcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBpZiAobm9kZS52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgIC8vICAgLy8g6ZqQ6JePXG4gICAgICAgIC8vICAgdmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgdmlzaWJsZSA9IHRydWVcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyAvLyDnpZblhYjlm77lsYLnmoTplIHlrprjgIHpmpDol4/nirbmgIHkvJjlhYjnuqfpq5hcbiAgICAgICAgLy8gaWYgKGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgLy8gICAvLyDnpZblhYjmmK/plIHlrprnirbmgIFcbiAgICAgICAgLy8gICBsb2NrZWQgPSB0cnVlXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgLy8g56WW5YWI6Z2e6ZSB5a6a54q25oCBXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAvLyAgIC8vIOelluWFiOaYr+makOiXj+eKtuaAgVxuICAgICAgICAvLyAgIHZpc2libGUgPSBmYWxzZVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgIC8vIOelluWFiOmdnumakOiXj+eKtuaAgVxuICAgICAgICAvLyB9XG4gICAgICAgIG5vZGVfbGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgIH1cbiAgICB2YXIgdGhpc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAvLyAg5aaC5p6c5b2T5YmN6IqC54K55LiL5a2Y5Zyo5a2Q6IqC54K5XG4gICAgaWYgKHRoaXNDaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8g5b2T5YmN6IqC54K55peg5a2Q6IqC54K577yM5Y+v6IO95piv5b2i54q25Zu+5bGCXG4gICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgfVxuICAgIC8vIGlmIChhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgLy8gICAvLyDnpZblhYjmmK/plIHlrprnirbmgIFcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgLy8g56WW5YWI6Z2e6ZSB5a6a54q25oCBXG4gICAgLy8gICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRoaXNDaGlsZHJlbi5sb2NrZWRcbiAgICAvLyB9XG4gICAgLy8gaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSkge1xuICAgIC8vICAgLy8g56WW5YWI5piv6ZqQ6JeP54q25oCBXG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIC8vIOelluWFiOmdnumakOiXj+eKtuaAgVxuICAgIC8vICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gdGhpc0NoaWxkcmVuLnZpc2libGVcbiAgICAvLyB9XG4gICAgLy8g6YGN5Y6G5a2Q6IqC54K5XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXNDaGlsZHJlbjonKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzQ2hpbGRyZW4pO1xuICAgICAgICBpZiAodGhpc0NoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyEhIUVSUk8gdGhpc0NoaWxkcmVuPT11bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5aaC5p6c6IqC54K555qE57G75Z6L5Li6IFRFWFRcbiAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS50eXBlID09ICdURVhUJykge1xuICAgICAgICAgICAgbm9kZV9saXN0LnB1c2godGhpc0NoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIOWmguaenOS4jeaYryBURVhUIOWbvuWxglxuICAgICAgICAgICAgLy8g5aaC5p6c5YyF5ZCr5a2Q5Zu+5bGCXG4gICAgICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLmNoaWxkcmVuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAvLyDnpZblhYjmmK/plIHlrprnirbmgIFcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAvLyDnpZblhYjpnZ7plIHlrprnirbmgIFcbiAgICAgICAgICAgICAgICAgICAgLy8gICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRoaXNDaGlsZHJlbltpXS5sb2NrZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgLy8g56WW5YWI5piv6ZqQ6JeP54q25oCBXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgLy8g56WW5YWI6Z2e6ZqQ6JeP54q25oCBXG4gICAgICAgICAgICAgICAgICAgIC8vICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gdGhpc0NoaWxkcmVuLnZpc2libGVcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3QgPSBteUZpbmRUZXh0QWxsKHRoaXNDaGlsZHJlbltpXSwgbm9kZV9saXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coJ25vZGVfbGlzdDonKTtcbiAgICAvLyBjb25zb2xlLmxvZyhub2RlX2xpc3QpO1xuICAgIHJldHVybiBub2RlX2xpc3Q7XG59XG4vLyDliqDovb3lrZfkvZNcbmZ1bmN0aW9uIG15TG9hZEZvbnRBc3luYyh0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXlMb2FkRm9udEFzeW5jOicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXh0X2xheWVyX0xpc3QpO1xuICAgICAgICBmb3IgKGxldCBsYXllciBvZiB0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tJyk7XG4gICAgICAgICAgICAvLyDliqDovb3lrZfkvZNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYXllcjonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxheWVyKTtcbiAgICAgICAgICAgIGxldCBmb250cyA9IGxheWVyWydub2RlJ10uZ2V0UmFuZ2VBbGxGb250TmFtZXMoMCwgbGF5ZXJbJ25vZGUnXVsnY2hhcmFjdGVycyddLmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9udHM6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmb250cyk7XG4gICAgICAgICAgICBmb3IgKGxldCBmb250IG9mIGZvbnRzKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZpbmQgZW5kIGxvYWQgZm9udDonKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbG9hZGVkX2ZvbnRzOicpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvYWRlZF9mb250cyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZvbnQ6Jyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZm9udCk7XG4gICAgICAgICAgICAgICAgbGV0IGJpbmdvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbG9hZGVkX2ZvbnQgb2YgbG9hZGVkX2ZvbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWRfZm9udFsnZmFtaWx5J10gPT0gZm9udFsnZmFtaWx5J10gJiYgbG9hZGVkX2ZvbnRbJ3N0eWxlJ10gPT0gZm9udFsnc3R5bGUnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmluZ28gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYmluZ28pO1xuICAgICAgICAgICAgICAgIGlmIChiaW5nbykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWtl+S9k+aYr+WQpuaUr+aMgVxuICAgICAgICAgICAgICAgICAgICBpZiAobGF5ZXJbJ25vZGUnXS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5LiN5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGFzTWlzc2luZ0ZvbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkX2ZvbnRzLnB1c2goZm9udCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbG9hZEZvbnRBc3luYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhmb250KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhteUZvbnQpO1xuICAgICAgICAvLyBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Rm9udClcbiAgICB9KTtcbn1cbi8vIOaQnOe0olxuZnVuY3Rpb24gZmluZChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbmRlLnRzOmZpbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2coZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIC8vIOa4heepuuWOhuWPsuaQnOe0ouaVsOaNru+8jOmHjeaWsOaQnOe0olxuICAgIHRhcmdldF9UZXh0X05vZGUgPSBbXTtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIHZhciBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo55uu5qCH5YC8IOKAlOKAlCDpgInkuK3lm77lsYLkuK3vvIzmiYDmnInmlofmnKzlm77lsYJcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIG5vZGVfbGlzdCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRBbGwobiA9PiBuLnR5cGUgPT09IFwiVEVYVFwiKVxuICAgICAgICBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIOW9k+WJjeaciemAieS4reWbvuWxgu+8jOWImeWcqOmAieS4reeahOWbvuWxguS4reaQnOe0olxuICAgICAgICAvLyDlnKjlvZPliY3pgInkuK3nmoTlm77lsYLkuK3vvIzmkJzntKLmlofmnKzlm77lsYJcbiAgICB9XG4gICAgLy8g6YGN5Y6G6IyD5Zu05YaF55qE5Zu+5bGC77yM6I635Y+WIFRFWFQg5Zu+5bGCXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZpbmQ6Zm9yIHNlbGVjdGlvbicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3Rpb25baV0pO1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgLy8gY29uc29sZS5sb2coc2VsZWN0aW9uW2ldLmNoaWxkcmVuKTtcbiAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5pys6Lqr5bCx5piv5paH5pys5Zu+5bGCXG4gICAgICAgIGlmIChzZWxlY3Rpb25baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgIG5vZGVfbGlzdC5wdXNoKHNlbGVjdGlvbltpXSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyDlpoLmnpzlm77lsYLkuIvmsqHmnInlrZDlm77lsYJcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGlmIChzZWxlY3Rpb25baV0uY2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIG5vZGVfbGlzdCA9IG5vZGVfbGlzdC5jb25jYXQoc2VsZWN0aW9uW2ldLmZpbmRBbGxXaXRoQ3JpdGVyaWEoeyB0eXBlczogWydURVhUJ10gfSkpO1xuICAgICAgICAvLyBub2RlX2xpc3QgPSBub2RlX2xpc3QuY29uY2F0KHNlbGVjdGlvbltpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pKVxuICAgICAgICAvLyBub2RlX2xpc3QgPSBteUZpbmRUZXh0QWxsKHNlbGVjdGlvbltpXSwgbm9kZV9saXN0KVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm9kZV9saXN0OicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlX2xpc3QpO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnc2VsZWN0aW9uOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdGlvbik7XG4gICAgY29uc29sZS5sb2coJ0ZpbmQgZW5kOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgLy8g5Zyo5paH5pys5Zu+5bGC5Lit77yM5Yy56YWN5YWz6ZSu5a2XXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBub2RlX2xpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0W2pdWydub2RlJ10pO1xuICAgICAgICBpZiAobm9kZV9saXN0W2pdWydjaGFyYWN0ZXJzJ10uaW5kZXhPZihkYXRhLmtleXdvcmQpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIOaJvuWIsOWFs+mUruivjVxuICAgICAgICAgICAgbGV0IHRoaXNfcGFyZW50O1xuICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNMb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCBhbmNlc3Rvcl90eXBlID0gJyc7XG4gICAgICAgICAgICBpZiAobm9kZV9saXN0W2pdLmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGVfbGlzdFtqXS52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlIHx8IGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/plIHlrprmiJbpmpDol4/nirbmgIFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOiOt+WPluelluWFiOWFg+e0oOeahOeKtuaAgVxuICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gbm9kZV9saXN0W2pdLnBhcmVudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpc19wYXJlbnQudHlwZSAhPSAnUEFHRScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC50eXBlID09ICdDT01QT05FTlQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl90eXBlID0gJ0NPTVBPTkVOVCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnR5cGUgPT0gJ0lOU1RBTkNFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfdHlwZSA9ICdJTlNUQU5DRSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkgJiYgYW5jZXN0b3JfdHlwZSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c56WW5YWI5YWD57Sg5piv6ZSB5a6a5oiW6ZqQ6JeP54q25oCBLOS4lOe7hOS7tuWFg+e0oOaYr+e7hOS7tuaIluWunuS+i++8jOWImei3s+WHuuW+queOr1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzX3BhcmVudCA9IHRoaXNfcGFyZW50LnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUucHVzaCh7ICdub2RlJzogbm9kZV9saXN0W2pdLCAnYW5jZXN0b3JfaXNWaXNpYmxlJzogYW5jZXN0b3JfaXNWaXNpYmxlLCAnYW5jZXN0b3JfaXNMb2NrZWQnOiBhbmNlc3Rvcl9pc0xvY2tlZCwgJ2FuY2VzdG9yX3R5cGUnOiBhbmNlc3Rvcl90eXBlIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdmaW5kIGVuZDonKTtcbiAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbn1cbi8vIOabv+aNolxuZnVuY3Rpb24gcmVwbGFjZShkYXRhKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlcGxhY2UnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICBsZXQgaGFzTWlzc2luZ0ZvbnRDb3VudCA9IDA7XG4gICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXBsYWNlIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaDonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICAgICAgaWYgKGl0ZW1bJ2FuY2VzdG9yX2lzVmlzaWJsZSddID09IGZhbHNlIHx8IGl0ZW1bJ2FuY2VzdG9yX2lzTG9ja2VkJ10gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIOW/veeVpemakOiXj+OAgemUgeWumueahOWbvuWxglxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ25vZGU6Jyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaXRlbVsnbm9kZSddWydmb250TmFtZSddKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5a2X5L2T5LiN5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoYXNNaXNzaW5nRm9udCcpO1xuICAgICAgICAgICAgICAgICAgICBoYXNNaXNzaW5nRm9udENvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dFN0eWxlID0gaXRlbVsnbm9kZSddLmdldFN0eWxlZFRleHRTZWdtZW50cyhbJ2luZGVudGF0aW9uJywgJ2xpc3RPcHRpb25zJ10pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGV4dFN0eWxlOicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0ZXh0U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0U3RhcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0RW5kID0gMDsgLy8g6K6w5b2V5L+u5pS55a2X56ym5ZCO55qE57Si5byV5YGP56e75pWw5YC8XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHlsZVRlbXAgPSBbXTsgLy8g6K6w5b2V5q+P5Liq5q616JC95qC35byP5Zyo5L+u5pS55ZCO55qE5qC35byP57Si5byV77yI5Zyo5pu/5o2i5a6M5a2X56ym5ZCO6ZyA6KaB6K6+572u5Zue5LmL5YmN55qE5qC35byP77yJXG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0X29mZnNldEVuZCA9IDA7IC8vIOiusOW9leS4iuS4gOS4quauteiQveeahOacq+Wwvue0ouW8lVxuICAgICAgICAgICAgICAgICAgICAvLyDmm7/mjaLnm67moIflrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO5Y2V5Liq5q616JC95YaF5Y+v6IO95a2Y5Zyo5aSa5Liq56ym5ZCI5p2h5Lu255qE5a2X56ym77yM5omA5Lul6ZyA6KaB5b6q546v5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluWMuemFjeWIsOeahOWtl+espueahOe0ouW8lVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGVsZW1lbnQuY2hhcmFjdGVycy5pbmRleE9mKGRhdGEuZGF0YS5rZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pyJ5Yy56YWN55qE5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leaWsOWtl+espumcgOimgeaPkuWFpeeahOS9jee9rlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5zZXJ0U3RhcnQgPSBpbmRleCArIGRhdGEuZGF0YS5rZXl3b3JkLmxlbmd0aCArIGVsZW1lbnRbJ3N0YXJ0J107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbnNlcnRTdGFydDonICsgaW5zZXJ0U3RhcnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmcgOimgeabv+aNouaIkOS7peS4i+Wtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3Q2hhcmFjdGVycyA9IGRhdGEuZGF0YS5yZXBsYWNlX3dvcmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWcqOe0ouW8leWQjuaPkuWFpeaWsOWtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtWydub2RlJ10uaW5zZXJ0Q2hhcmFjdGVycyhpbnNlcnRTdGFydCArIG9mZnNldEVuZCwgbmV3Q2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOagueaNrue0ouW8leWIoOmZpOaXp+Wtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtWydub2RlJ10uZGVsZXRlQ2hhcmFjdGVycyhpbmRleCArIGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRFbmQsIGluc2VydFN0YXJ0ICsgb2Zmc2V0RW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5YGP56e75pWw5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9mZnNldFN0YXJ0ID0gbGFzdF9vZmZzZXRFbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0RW5kICs9IGRhdGEuZGF0YS5yZXBsYWNlX3dvcmQubGVuZ3RoIC0gZGF0YS5kYXRhLmtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2hpbGUgb2Zmc2V0U3RhcnQ6JyArIG9mZnNldFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2hpbGUgb2Zmc2V0RW5kOicgKyBvZmZzZXRFbmQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leajgOe0ouWIsOebruagh+Wtl+espueahOe0ouW8le+8jOS4i+S4gOasoSB3aGlsZSDlvqrnjq/lnKjmraTkvY3nva7lkI7lvIDlp4vmn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBpbmRleCArIGRhdGEuZGF0YS5rZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOayoeacieWMuemFjeeahOWtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gd2hpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvZmZzZXRTdGFydDonICsgb2Zmc2V0U3RhcnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnb2Zmc2V0RW5kOicgKyBvZmZzZXRFbmQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZWxlbWVudDonKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0IHRoaXNTdGFydCA9IGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRTdGFydFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKHRoaXNTdGFydCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgdGhpc1N0YXJ0ID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVsZW1lbnRbJ3N0YXJ0J10gPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB0aGlzU3RhcnQgPT0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5Y2V5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP6K6w5b2V5Yiw5pWw57uE5YaFXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVRlbXAucHVzaCh7ICdzdGFydCc6IGxhc3Rfb2Zmc2V0RW5kLCAnZW5kJzogZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsICdpbmRlbnRhdGlvbic6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gPiAwID8gZWxlbWVudFsnaW5kZW50YXRpb24nXSA6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10sICdsaXN0T3B0aW9ucyc6IGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0X29mZnNldEVuZCA9IGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8g6K6+572u57yp6L+bXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVtWydub2RlJ10uc2V0UmFuZ2VJbmRlbnRhdGlvbihlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnQsIGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCBlbGVtZW50WydpbmRlbnRhdGlvbiddID4gMCA/IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gLSAxIDogZWxlbWVudFsnaW5kZW50YXRpb24nXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOiuvue9ruW6j+WPt1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlbVsnbm9kZSddLnNldFJhbmdlTGlzdE9wdGlvbnMoZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0LCBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSlcbiAgICAgICAgICAgICAgICAgICAgfSk7IC8vIHRleHRTdHlsZS5mb3JFYWNoXG4gICAgICAgICAgICAgICAgICAgIC8vIOiuvue9rue8qei/m+OAgeW6j+WPt1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygn6K6+572u57yp6L+b44CB5bqP5Y+377yaJyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHN0eWxlVGVtcCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0eWxlVGVtcCDorrDlvZXkuobmr4/kuKrmrrXokL3nmoTnvKnov5vjgIHluo/lj7fmoLflvI/vvIzpgY3ljobmlbDnu4Tkvb/lvpfkv67mlLnlrZfnrKblkI7nmoTmlofmnKzlm77lsYLmoLflvI/kuI3lj5hcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVUZW1wLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtWydub2RlJ10uc2V0UmFuZ2VMaXN0T3B0aW9ucyhlbGVtZW50WydzdGFydCddLCBlbGVtZW50WydlbmQnXSwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtWydub2RlJ10uc2V0UmFuZ2VJbmRlbnRhdGlvbihlbGVtZW50WydzdGFydCddLCBlbGVtZW50WydlbmQnXSwgZWxlbWVudFsnaW5kZW50YXRpb24nXSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgIC8vIHZhciBzZWFyY2hSZWdFeHAgPSBuZXcgUmVnRXhwKGRhdGEuZGF0YS5rZXl3b3JkLCAnZycpXG4gICAgICAgICAgICAgICAgLy8gLy8gY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgICAgICAgICAgLy8gaXRlbVsnbm9kZSddLmNoYXJhY3RlcnMgPSBpdGVtWydub2RlJ10uY2hhcmFjdGVycy5yZXBsYWNlKHNlYXJjaFJlZ0V4cCwgZGF0YS5kYXRhLnJlcGxhY2Vfd29yZClcbiAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICB9KTsgLy8gdGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoXG4gICAgICAgIC8vIOabv+aNouWujOavle+8jOmAmuefpSBVSSDmm7TmlrBcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2hhc01pc3NpbmdGb250Q291bnQnOiBoYXNNaXNzaW5nRm9udENvdW50IH0pO1xuICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICB9KTtcbn0gLy8gYXN5bmMgZnVuY3Rpb24gcmVwbGFjZVxuLy8gRmlnbWEg5Zu+5bGC6YCJ5oup5Y+Y5YyW5pe277yM6YCa55+lIFVJIOaYvuekuuS4jeWQjOeahOaPkOekulxuZnVuY3Rpb24gb25TZWxlY3Rpb25DaGFuZ2UoKSB7XG4gICAgdmFyIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IHRydWUgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiBmYWxzZSB9KTtcbiAgICB9XG59XG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL2NvZGUudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==