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
let toHTML = []; // 存储传送给 UI 的符合搜索条件的 TEXT 图层信息
console.log('202202192154');
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
        find(msg.data);
        // console.log('figma.ui.onmessage node_list&msg');
        // console.log(node_list);
        // console.log(msg.data);
        // console.log('search target_Text_Node:');
        let toHTML;
        setTimeout(() => {
            // console.log('findKeyWord begin');
            // console.log(node_list);
            toHTML = findKeyWord(node_list, msg.data.keyword);
            // console.log('findKeyWord end');
        }, 20);
        setTimeout(() => {
            setTimeout(() => {
                // console.log('toHTML:');
                // console.log(toHTML);
                figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': toHTML });
                console.log('Find end:');
                // figma.ui.postMessage({ 'type': 'find_end' })
                let end = new Date().getTime();
                console.log('cost is:' + (end - start).toString());
                console.log(req_cout);
                figma.ui.postMessage({ 'type': 'find_end' });
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
    // 遍历范围内的图层，获取 TEXT 图层
    for (let i = 0; i < selection.length; i++) {
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
                    //@ts-ignore
                    node_list = node_list.concat(selection[i].findAllWithCriteria({ types: ['TEXT'] }));
                    // console.log(' find timeout node_list:');
                    // console.log(node_list);
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
    node_list.forEach(element => {
        setTimeout(() => {
            if (element['characters'].indexOf(keyword) > -1) {
                // 找到关键词
                let this_parent;
                let ancestor_isVisible = true;
                let ancestor_isLocked = false;
                let ancestor_type = '';
                if (element.locked == true) {
                    ancestor_isLocked = true;
                }
                if (element.visible == false) {
                    ancestor_isVisible = false;
                }
                if (ancestor_isVisible == false || ancestor_isLocked == true) {
                    // 如果图层本身就是锁定或隐藏状态
                }
                else {
                    // 获取祖先元素的状态
                    this_parent = element.parent;
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
                data_item = { 'node': element, 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked, 'ancestor_type': ancestor_type };
                target_Text_Node.push(data_item);
                // 构建数据，传送给 UI
                var position = 0;
                while (true) {
                    // 由于单个 TEXT 图层内可能存在多个符合条件的字符，所以需要循环查找
                    var index = data_item['node'].characters.indexOf(keyword, position);
                    // console.log('index:');
                    // console.log(index);
                    if (index > -1) {
                        // 将查找的字符起始、终止位置发送给 UI
                        // figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': [{ 'id': data_item['node'].id, 'characters': data_item['node'].characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': data_item['node'].hasMissingFont }] })
                        // console.log('func findKeyWord finded');
                        data_item_list.push({ 'id': data_item['node'].id, 'characters': data_item['node'].characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': data_item['node'].hasMissingFont, 'ancestor_type': data_item['ancestor_type'] });
                        req_cout += 1;
                        // console.log('count:' + req_cout.toString());
                        // // 加载字体
                        // myLoadFontAsync([{ 'id': data_item['node'].id, 'characters': data_item['node'].characters, 'start': index, 'end': index + keyword.length, 'hasMissingFont': data_item['node'].hasMissingFont }])
                        position = index + keyword.length;
                    }
                    else {
                        break;
                    }
                }
                // console.log('postMessage');
                // return { 'node': node_list[j], 'ancestor_isVisible': ancestor_isVisible, 'ancestor_isLocked': ancestor_isLocked }
            }
        }, 10);
    });
    // for (var j = 0; j < node_list.length; j++) {
    // }
    // console.log('find end:');
    // console.log(target_Text_Node);
    console.log('func findKeyWord end');
    // console.log(data_item_list);
    toHTML = data_item_list;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELHVDQUF1QywyS0FBMkssR0FBRztBQUN2UTtBQUNBLDhDQUE4Qyx3TkFBd047QUFDdFE7QUFDQTtBQUNBO0FBQ0EsOENBQThDLDJLQUEySztBQUN6TjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztVRTdjQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS8uL3NyYy9jb2RlLnRzIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQGZpZ21hL3BsdWdpbi10eXBpbmdzL2luZGV4LmQudHNcIiAvPlxubGV0IHRhcmdldF9UZXh0X05vZGUgPSBbXTsgLy8g5a2Y5YKo56ym5ZCI5pCc57Si5p2h5Lu255qEIFRFWFQg5Zu+5bGCXG5sZXQgbG9hZGVkX2ZvbnRzID0gW107XG5sZXQgZmlsZVR5cGUgPSBmaWdtYS5lZGl0b3JUeXBlO1xubGV0IHJlcV9jb3V0ID0gMDtcbmxldCBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo5omA5pyJIFRFWFQg5Zu+5bGCXG5sZXQgdG9IVE1MID0gW107IC8vIOWtmOWCqOS8oOmAgee7mSBVSSDnmoTnrKblkIjmkJzntKLmnaHku7bnmoQgVEVYVCDlm77lsYLkv6Hmga9cbmNvbnNvbGUubG9nKCcyMDIyMDIxOTIxNTQnKTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzAwLCBoZWlnaHQ6IDM0MCB9KTtcbi8vIGNvbnNvbGUubG9nKCdoZWxsbzInKVxub25TZWxlY3Rpb25DaGFuZ2UoKTtcbi8vIOe7keWumiBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbkuovku7ZcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHsgb25TZWxlY3Rpb25DaGFuZ2UoKTsgfSk7XG4vLyBVSSDlj5HmnaXmtojmga9cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pCc57Si44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VhcmNoJykge1xuICAgICAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmRfbG9hZGluZycgfSlcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCcpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgLy8g5omn6KGM5pCc57SiXG4gICAgICAgIGZpbmQobXNnLmRhdGEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZmlnbWEudWkub25tZXNzYWdlIG5vZGVfbGlzdCZtc2cnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLmRhdGEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2VhcmNoIHRhcmdldF9UZXh0X05vZGU6Jyk7XG4gICAgICAgIGxldCB0b0hUTUw7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZpbmRLZXlXb3JkIGJlZ2luJyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlX2xpc3QpO1xuICAgICAgICAgICAgdG9IVE1MID0gZmluZEtleVdvcmQobm9kZV9saXN0LCBtc2cuZGF0YS5rZXl3b3JkKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmaW5kS2V5V29yZCBlbmQnKTtcbiAgICAgICAgfSwgMjApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0b0hUTUw6Jyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codG9IVE1MKTtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAndGFyZ2V0X1RleHRfTm9kZSc6IHRvSFRNTCB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmluZCBlbmQ6Jyk7XG4gICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kX2VuZCcgfSlcbiAgICAgICAgICAgICAgICBsZXQgZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Nvc3QgaXM6JyArIChlbmQgLSBzdGFydCkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVxX2NvdXQpO1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZF9lbmQnIH0pO1xuICAgICAgICAgICAgfSwgMzApO1xuICAgICAgICB9LCA0MCk7XG4gICAgfVxuICAgIC8vIFVJIOS4reeCueWHu+aQnOe0oue7k+aenOmhuVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2xpc3RPbkNsaWsnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjb2RlIGpzOmxpc3RPbkNsaWs6Jyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIHZhciB0YXJnZXROb2RlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9yRWFjaDonKTtcbiAgICAgICAgLy8g6YGN5Y6G5pCc57Si57uT5p6cXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0X1RleHRfTm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXS5pZCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtc2cuZGF0YS5pdGVtKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZy5kYXRhWydpdGVtJ10pO1xuICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5pZCA9PSBtc2cuZGF0YVsnaXRlbSddKSB7XG4gICAgICAgICAgICAgICAgLy8g5om+5Yiw55So5oi354K55Ye755qE5Zu+5bGCXG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZSA9PT0gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOinhuWbvuWumuS9jeWIsOWvueW6lOWbvuWxglxuICAgICAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddXSk7XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6YCJ5Lit5a+55bqU5paH5pysXG4gICAgICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0ZWRUZXh0UmFuZ2UgPSB7ICdub2RlJzogdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLCAnc3RhcnQnOiBtc2cuZGF0YVsnc3RhcnQnXSwgJ2VuZCc6IG1zZy5kYXRhWydlbmQnXSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFVJIOS4reeCueWHu+S6huOAjOabv+aNouOAjeaMiemSrlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIC8vIOaJp+ihjOabv+aNolxuICAgICAgICByZXBsYWNlKG1zZyk7XG4gICAgfVxufTtcbi8vIOafpeaJvuWbvuWxguS4i+eahOaWh+acrOWbvuWxgu+8jOi+k+WFpSBmaWdtYSDlm77lsYLlr7nosaHvvIzov5Tlm57mib7liLDmiYDmnInmlofmnKzlm77lsYJcbmZ1bmN0aW9uIG15RmluZFRleHRBbGwobm9kZSwgbm9kZV9saXN0LCBhbmNlc3Rvcl9pc0xvY2tlZCwgYW5jZXN0b3JfaXNWaXNpYmxlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ215RmluZEFsbCcpO1xuICAgIC8vIGNvbnNvbGUubG9nKGlzTG9ja2VkKTtcbiAgICBsZXQgbG9ja2VkID0gZmFsc2U7IC8vIOWtmOWCqOacgOe7iOeahOeKtuaAgVxuICAgIGxldCB2aXNpYmxlID0gdHJ1ZTtcbiAgICAvLyDlpoLmnpznm67moIflm77lsYLmnKzouqvlsLHmmK8gVEVYVCDlm77lsYJcbiAgICBpZiAobm9kZS50eXBlID09ICdURVhUJykge1xuICAgICAgICAvLyAvLyDmlofmnKzlm77lsYLmmK/lkKbplIHlrprjgIHpmpDol4/vvJ9cbiAgICAgICAgLy8gaWYgKG5vZGUubG9ja2VkKSB7XG4gICAgICAgIC8vICAgLy8g6ZSB5a6aXG4gICAgICAgIC8vICAgbG9ja2VkID0gdHJ1ZVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgIGxvY2tlZCA9IGZhbHNlXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gaWYgKG5vZGUudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAvLyAgIC8vIOmakOiXj1xuICAgICAgICAvLyAgIHZpc2libGUgPSBmYWxzZVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgIHZpc2libGUgPSB0cnVlXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gLy8g56WW5YWI5Zu+5bGC55qE6ZSB5a6a44CB6ZqQ6JeP54q25oCB5LyY5YWI57qn6auYXG4gICAgICAgIC8vIGlmIChhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgIC8vICAgLy8g56WW5YWI5piv6ZSB5a6a54q25oCBXG4gICAgICAgIC8vICAgbG9ja2VkID0gdHJ1ZVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgIC8vIOelluWFiOmdnumUgeWumueKtuaAgVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgLy8gICAvLyDnpZblhYjmmK/pmpDol4/nirbmgIFcbiAgICAgICAgLy8gICB2aXNpYmxlID0gZmFsc2VcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAvLyDnpZblhYjpnZ7pmpDol4/nirbmgIFcbiAgICAgICAgLy8gfVxuICAgICAgICBub2RlX2xpc3QucHVzaChub2RlKTtcbiAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICB9XG4gICAgdmFyIHRoaXNDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgLy8gIOWmguaenOW9k+WJjeiKgueCueS4i+WtmOWcqOWtkOiKgueCuVxuICAgIGlmICh0aGlzQ2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIOW9k+WJjeiKgueCueaXoOWtkOiKgueCue+8jOWPr+iDveaYr+W9oueKtuWbvuWxglxuICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgIH1cbiAgICAvLyBpZiAoYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgIC8vICAgLy8g56WW5YWI5piv6ZSB5a6a54q25oCBXG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIC8vIOelluWFiOmdnumUgeWumueKtuaAgVxuICAgIC8vICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0aGlzQ2hpbGRyZW4ubG9ja2VkXG4gICAgLy8gfVxuICAgIC8vIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UpIHtcbiAgICAvLyAgIC8vIOelluWFiOaYr+makOiXj+eKtuaAgVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAvLyDnpZblhYjpnZ7pmpDol4/nirbmgIFcbiAgICAvLyAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRoaXNDaGlsZHJlbi52aXNpYmxlXG4gICAgLy8gfVxuICAgIC8vIOmBjeWOhuWtkOiKgueCuVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpc0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzQ2hpbGRyZW46JylcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpc0NoaWxkcmVuKTtcbiAgICAgICAgaWYgKHRoaXNDaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCchISFFUlJPIHRoaXNDaGlsZHJlbj09dW5kZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgICAgICB9XG4gICAgICAgIC8vIOWmguaenOiKgueCueeahOexu+Wei+S4uiBURVhUXG4gICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgIG5vZGVfbGlzdC5wdXNoKHRoaXNDaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3mmK8gVEVYVCDlm77lsYJcbiAgICAgICAgICAgIC8vIOWmguaenOWMheWQq+WtkOWbvuWxglxuICAgICAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS5jaGlsZHJlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgLy8g56WW5YWI5piv6ZSB5a6a54q25oCBXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgLy8g56WW5YWI6Z2e6ZSB5a6a54q25oCBXG4gICAgICAgICAgICAgICAgICAgIC8vICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0aGlzQ2hpbGRyZW5baV0ubG9ja2VkXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIOelluWFiOaYr+makOiXj+eKtuaAgVxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIOelluWFiOmdnumakOiXj+eKtuaAgVxuICAgICAgICAgICAgICAgICAgICAvLyAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRoaXNDaGlsZHJlbi52aXNpYmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0ID0gbXlGaW5kVGV4dEFsbCh0aGlzQ2hpbGRyZW5baV0sIG5vZGVfbGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdub2RlX2xpc3Q6Jyk7XG4gICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICByZXR1cm4gbm9kZV9saXN0O1xufVxuLy8g5Yqg6L295a2X5L2TXG5mdW5jdGlvbiBteUxvYWRGb250QXN5bmModGV4dF9sYXllcl9MaXN0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ215TG9hZEZvbnRBc3luYzonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGV4dF9sYXllcl9MaXN0KTtcbiAgICAgICAgZm9yIChsZXQgbGF5ZXIgb2YgdGV4dF9sYXllcl9MaXN0KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLScpO1xuICAgICAgICAgICAgLy8g5Yqg6L295a2X5L2TXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGF5ZXI6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsYXllcik7XG4gICAgICAgICAgICBsZXQgZm9udHMgPSBsYXllclsnbm9kZSddLmdldFJhbmdlQWxsRm9udE5hbWVzKDAsIGxheWVyWydub2RlJ11bJ2NoYXJhY3RlcnMnXS5sZW5ndGgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZvbnRzOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZm9udHMpO1xuICAgICAgICAgICAgZm9yIChsZXQgZm9udCBvZiBmb250cykge1xuICAgICAgICAgICAgICAgIGxldCBiaW5nbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGxvYWRlZF9mb250IG9mIGxvYWRlZF9mb250cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkX2ZvbnRbJ2ZhbWlseSddID09IGZvbnRbJ2ZhbWlseSddICYmIGxvYWRlZF9mb250WydzdHlsZSddID09IGZvbnRbJ3N0eWxlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmdvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGJpbmdvKTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZ28pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDlrZfkvZPmmK/lkKbmlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxheWVyWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS4jeaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hhc01pc3NpbmdGb250Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZF9mb250cy5wdXNoKGZvbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2xvYWRGb250QXN5bmMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2cobXlGb250KTtcbiAgICAgICAgLy8gYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyhteUZvbnQpXG4gICAgfSk7XG59XG4vLyDmkJzntKJcbmZ1bmN0aW9uIGZpbmQoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdjb25kZS50czpmaW5kOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAvLyDmuIXnqbrljoblj7LmkJzntKLmlbDmja7vvIzph43mlrDmkJzntKJcbiAgICB0YXJnZXRfVGV4dF9Ob2RlID0gW107XG4gICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIG5vZGVfbGlzdCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRBbGwobiA9PiBuLnR5cGUgPT09IFwiVEVYVFwiKVxuICAgICAgICBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIOW9k+WJjeaciemAieS4reWbvuWxgu+8jOWImeWcqOmAieS4reeahOWbvuWxguS4reaQnOe0olxuICAgICAgICAvLyDlnKjlvZPliY3pgInkuK3nmoTlm77lsYLkuK3vvIzmkJzntKLmlofmnKzlm77lsYJcbiAgICB9XG4gICAgbm9kZV9saXN0ID0gW107XG4gICAgLy8g6YGN5Y6G6IyD5Zu05YaF55qE5Zu+5bGC77yM6I635Y+WIFRFWFQg5Zu+5bGCXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/mlofmnKzlm77lsYJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICBub2RlX2xpc3QucHVzaChzZWxlY3Rpb25baV0pO1xuICAgICAgICAgICAgICAgIC8vIGxldCBiaW5nb19ub2RlcyA9IGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwgZGF0YS5rZXl3b3JkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5rKh5pyJ5a2Q5Zu+5bGCXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbltpXS5jaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBub2RlX2xpc3QgPSBub2RlX2xpc3QuY29uY2F0KHNlbGVjdGlvbltpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJyBmaW5kIHRpbWVvdXQgbm9kZV9saXN0OicpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub2RlX2xpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTApO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnc2VsZWN0aW9uOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdGlvbik7XG4gICAgcmV0dXJuIG5vZGVfbGlzdDtcbn1cbi8vIOabv+aNolxuZnVuY3Rpb24gcmVwbGFjZShkYXRhKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlcGxhY2UnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICBsZXQgaGFzTWlzc2luZ0ZvbnRDb3VudCA9IDA7XG4gICAgICAgIHlpZWxkIG15TG9hZEZvbnRBc3luYyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3JlcGxhY2UgdGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaXRlbSk7XG4gICAgICAgICAgICBpZiAoaXRlbVsnYW5jZXN0b3JfaXNWaXNpYmxlJ10gPT0gZmFsc2UgfHwgaXRlbVsnYW5jZXN0b3JfaXNMb2NrZWQnXSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgLy8g5b+955Wl6ZqQ6JeP44CB6ZSB5a6a55qE5Zu+5bGCXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtWydub2RlJ11bJ2ZvbnROYW1lJ10pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCk7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDlrZfkvZPkuI3mlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hhc01pc3NpbmdGb250Jyk7XG4gICAgICAgICAgICAgICAgICAgIGhhc01pc3NpbmdGb250Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0U3R5bGUgPSBpdGVtWydub2RlJ10uZ2V0U3R5bGVkVGV4dFNlZ21lbnRzKFsnaW5kZW50YXRpb24nLCAnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZXh0U3R5bGU6Jyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRleHRTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRTdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRFbmQgPSAwOyAvLyDorrDlvZXkv67mlLnlrZfnrKblkI7nmoTntKLlvJXlgY/np7vmlbDlgLxcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlVGVtcCA9IFtdOyAvLyDorrDlvZXmr4/kuKrmrrXokL3moLflvI/lnKjkv67mlLnlkI7nmoTmoLflvI/ntKLlvJXvvIjlnKjmm7/mjaLlrozlrZfnrKblkI7pnIDopoHorr7nva7lm57kuYvliY3nmoTmoLflvI/vvIlcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3Rfb2Zmc2V0RW5kID0gMDsgLy8g6K6w5b2V5LiK5LiA5Liq5q616JC955qE5pyr5bC+57Si5byVXG4gICAgICAgICAgICAgICAgICAgIC8vIOabv+aNouebruagh+Wtl+esplxuICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGUuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKrmrrXokL3lhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5Yy56YWN5Yiw55qE5a2X56ym55qE57Si5byVXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZWxlbWVudC5jaGFyYWN0ZXJzLmluZGV4T2YoZGF0YS5kYXRhLmtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmnInljLnphY3nmoTlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5paw5a2X56ym6ZyA6KaB5o+S5YWl55qE5L2N572uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnNlcnRTdGFydCA9IGluZGV4ICsgZGF0YS5kYXRhLmtleXdvcmQubGVuZ3RoICsgZWxlbWVudFsnc3RhcnQnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luc2VydFN0YXJ0OicgKyBpbnNlcnRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6ZyA6KaB5pu/5o2i5oiQ5Lul5LiL5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdDaGFyYWN0ZXJzID0gZGF0YS5kYXRhLnJlcGxhY2Vfd29yZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5Zyo57Si5byV5ZCO5o+S5YWl5paw5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5pbnNlcnRDaGFyYWN0ZXJzKGluc2VydFN0YXJ0ICsgb2Zmc2V0RW5kLCBuZXdDaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5qC55o2u57Si5byV5Yig6Zmk5pen5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5kZWxldGVDaGFyYWN0ZXJzKGluZGV4ICsgZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldEVuZCwgaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXlgY/np7vmlbDlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2Zmc2V0U3RhcnQgPSBsYXN0X29mZnNldEVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXRFbmQgKz0gZGF0YS5kYXRhLnJlcGxhY2Vfd29yZC5sZW5ndGggLSBkYXRhLmRhdGEua2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGlsZSBvZmZzZXRTdGFydDonICsgb2Zmc2V0U3RhcnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd3aGlsZSBvZmZzZXRFbmQ6JyArIG9mZnNldEVuZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5qOA57Si5Yiw55uu5qCH5a2X56ym55qE57Si5byV77yM5LiL5LiA5qyhIHdoaWxlIOW+queOr+WcqOatpOS9jee9ruWQjuW8gOWni+afpeaJvlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4ICsgZGF0YS5kYXRhLmtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rKh5pyJ5Yy56YWN55qE5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyB3aGlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ29mZnNldFN0YXJ0OicgKyBvZmZzZXRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvZmZzZXRFbmQ6JyArIG9mZnNldEVuZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdlbGVtZW50OicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQgdGhpc1N0YXJ0ID0gZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAodGhpc1N0YXJ0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICB0aGlzU3RhcnQgPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZWxlbWVudFsnc3RhcnQnXSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHRoaXNTdGFydCA9PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlsIbljZXkuKrmrrXokL3nmoTnvKnov5vjgIHluo/lj7fmoLflvI/orrDlvZXliLDmlbDnu4TlhoVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlVGVtcC5wdXNoKHsgJ3N0YXJ0JzogbGFzdF9vZmZzZXRFbmQsICdlbmQnOiBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgJ2luZGVudGF0aW9uJzogZWxlbWVudFsnaW5kZW50YXRpb24nXSA+IDAgPyBlbGVtZW50WydpbmRlbnRhdGlvbiddIDogZWxlbWVudFsnaW5kZW50YXRpb24nXSwgJ2xpc3RPcHRpb25zJzogZWxlbWVudFsnbGlzdE9wdGlvbnMnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rfb2Zmc2V0RW5kID0gZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyDorr7nva7nvKnov5tcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0ZW1bJ25vZGUnXS5zZXRSYW5nZUluZGVudGF0aW9uKGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRTdGFydCwgZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsIGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gPiAwID8gZWxlbWVudFsnaW5kZW50YXRpb24nXSAtIDEgOiBlbGVtZW50WydpbmRlbnRhdGlvbiddKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8g6K6+572u5bqP5Y+3XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpdGVtWydub2RlJ10uc2V0UmFuZ2VMaXN0T3B0aW9ucyhlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnQsIGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCBlbGVtZW50WydsaXN0T3B0aW9ucyddKVxuICAgICAgICAgICAgICAgICAgICB9KTsgLy8gdGV4dFN0eWxlLmZvckVhY2hcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6+572u57yp6L+b44CB5bqP5Y+3XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCforr7nva7nvKnov5vjgIHluo/lj7fvvJonKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc3R5bGVUZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGVUZW1wIOiusOW9leS6huavj+S4quauteiQveeahOe8qei/m+OAgeW6j+WPt+agt+W8j++8jOmBjeWOhuaVsOe7hOS9v+W+l+S/ruaUueWtl+espuWQjueahOaWh+acrOWbvuWxguagt+W8j+S4jeWPmFxuICAgICAgICAgICAgICAgICAgICBzdHlsZVRlbXAuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5zZXRSYW5nZUxpc3RPcHRpb25zKGVsZW1lbnRbJ3N0YXJ0J10sIGVsZW1lbnRbJ2VuZCddLCBlbGVtZW50WydsaXN0T3B0aW9ucyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5zZXRSYW5nZUluZGVudGF0aW9uKGVsZW1lbnRbJ3N0YXJ0J10sIGVsZW1lbnRbJ2VuZCddLCBlbGVtZW50WydpbmRlbnRhdGlvbiddKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgICAgICAgICAgLy8gdmFyIHNlYXJjaFJlZ0V4cCA9IG5ldyBSZWdFeHAoZGF0YS5kYXRhLmtleXdvcmQsICdnJylcbiAgICAgICAgICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgICAgICAgICAvLyBpdGVtWydub2RlJ10uY2hhcmFjdGVycyA9IGl0ZW1bJ25vZGUnXS5jaGFyYWN0ZXJzLnJlcGxhY2Uoc2VhcmNoUmVnRXhwLCBkYXRhLmRhdGEucmVwbGFjZV93b3JkKVxuICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgIH0pOyAvLyB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2hcbiAgICAgICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnLCAnaGFzTWlzc2luZ0ZvbnRDb3VudCc6IGhhc01pc3NpbmdGb250Q291bnQgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0YXJnZXRfVGV4dF9Ob2RlOicpO1xuICAgIH0pO1xufSAvLyBhc3luYyBmdW5jdGlvbiByZXBsYWNlXG4vLyBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbml7bvvIzpgJrnn6UgVUkg5pi+56S65LiN5ZCM55qE5o+Q56S6XG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZSgpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IGZhbHNlIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwga2V5d29yZCkge1xuICAgIGNvbnNvbGUubG9nKCdmdW5jIGZpbmRLZXlXb3JkIGJlZ2luJyk7XG4gICAgcmVxX2NvdXQgPSAwO1xuICAgIC8vIOWcqOaWh+acrOWbvuWxguS4re+8jOWMuemFjeWFs+mUruWtl1xuICAgIGxldCBkYXRhX2l0ZW07XG4gICAgbGV0IGRhdGFfaXRlbV9saXN0ID0gW107XG4gICAgbm9kZV9saXN0LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVsZW1lbnRbJ2NoYXJhY3RlcnMnXS5pbmRleE9mKGtleXdvcmQpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyDmib7liLDlhbPplK7or41cbiAgICAgICAgICAgICAgICBsZXQgdGhpc19wYXJlbnQ7XG4gICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzTG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX3R5cGUgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5sb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/plIHlrprmiJbpmpDol4/nirbmgIFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluelluWFiOWFg+e0oOeahOeKtuaAgVxuICAgICAgICAgICAgICAgICAgICB0aGlzX3BhcmVudCA9IGVsZW1lbnQucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpc19wYXJlbnQudHlwZSAhPSAnUEFHRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC5sb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQudHlwZSA9PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX3R5cGUgPSAnQ09NUE9ORU5UJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC50eXBlID09ICdJTlNUQU5DRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl90eXBlID0gJ0lOU1RBTkNFJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlIHx8IGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpICYmIGFuY2VzdG9yX3R5cGUgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gdGhpc19wYXJlbnQucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRhdGFfaXRlbSA9IHsgJ25vZGUnOiBlbGVtZW50LCAnYW5jZXN0b3JfaXNWaXNpYmxlJzogYW5jZXN0b3JfaXNWaXNpYmxlLCAnYW5jZXN0b3JfaXNMb2NrZWQnOiBhbmNlc3Rvcl9pc0xvY2tlZCwgJ2FuY2VzdG9yX3R5cGUnOiBhbmNlc3Rvcl90eXBlIH07XG4gICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5wdXNoKGRhdGFfaXRlbSk7XG4gICAgICAgICAgICAgICAgLy8g5p6E5bu65pWw5o2u77yM5Lyg6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKogVEVYVCDlm77lsYLlhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZGF0YV9pdGVtWydub2RlJ10uY2hhcmFjdGVycy5pbmRleE9mKGtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4OicpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlsIbmn6Xmib7nmoTlrZfnrKbotbflp4vjgIHnu4jmraLkvY3nva7lj5HpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZCcsICd0YXJnZXRfVGV4dF9Ob2RlJzogW3sgJ2lkJzogZGF0YV9pdGVtWydub2RlJ10uaWQsICdjaGFyYWN0ZXJzJzogZGF0YV9pdGVtWydub2RlJ10uY2hhcmFjdGVycywgJ3N0YXJ0JzogaW5kZXgsICdlbmQnOiBpbmRleCArIGtleXdvcmQubGVuZ3RoLCAnaGFzTWlzc2luZ0ZvbnQnOiBkYXRhX2l0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCB9XSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2Z1bmMgZmluZEtleVdvcmQgZmluZGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2l0ZW1fbGlzdC5wdXNoKHsgJ2lkJzogZGF0YV9pdGVtWydub2RlJ10uaWQsICdjaGFyYWN0ZXJzJzogZGF0YV9pdGVtWydub2RlJ10uY2hhcmFjdGVycywgJ3N0YXJ0JzogaW5kZXgsICdlbmQnOiBpbmRleCArIGtleXdvcmQubGVuZ3RoLCAnaGFzTWlzc2luZ0ZvbnQnOiBkYXRhX2l0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCwgJ2FuY2VzdG9yX3R5cGUnOiBkYXRhX2l0ZW1bJ2FuY2VzdG9yX3R5cGUnXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcV9jb3V0ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY291bnQ6JyArIHJlcV9jb3V0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8g5Yqg6L295a2X5L2TXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBteUxvYWRGb250QXN5bmMoW3sgJ2lkJzogZGF0YV9pdGVtWydub2RlJ10uaWQsICdjaGFyYWN0ZXJzJzogZGF0YV9pdGVtWydub2RlJ10uY2hhcmFjdGVycywgJ3N0YXJ0JzogaW5kZXgsICdlbmQnOiBpbmRleCArIGtleXdvcmQubGVuZ3RoLCAnaGFzTWlzc2luZ0ZvbnQnOiBkYXRhX2l0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCB9XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBrZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdwb3N0TWVzc2FnZScpO1xuICAgICAgICAgICAgICAgIC8vIHJldHVybiB7ICdub2RlJzogbm9kZV9saXN0W2pdLCAnYW5jZXN0b3JfaXNWaXNpYmxlJzogYW5jZXN0b3JfaXNWaXNpYmxlLCAnYW5jZXN0b3JfaXNMb2NrZWQnOiBhbmNlc3Rvcl9pc0xvY2tlZCB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwKTtcbiAgICB9KTtcbiAgICAvLyBmb3IgKHZhciBqID0gMDsgaiA8IG5vZGVfbGlzdC5sZW5ndGg7IGorKykge1xuICAgIC8vIH1cbiAgICAvLyBjb25zb2xlLmxvZygnZmluZCBlbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgY29uc29sZS5sb2coJ2Z1bmMgZmluZEtleVdvcmQgZW5kJyk7XG4gICAgLy8gY29uc29sZS5sb2coZGF0YV9pdGVtX2xpc3QpO1xuICAgIHRvSFRNTCA9IGRhdGFfaXRlbV9saXN0O1xuICAgIHJldHVybiBkYXRhX2l0ZW1fbGlzdDtcbn1cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvY29kZS50c1wiXSgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9