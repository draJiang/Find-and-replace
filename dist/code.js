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
console.log('20220212');
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
                            toUIHTML.push({ 'id': item['node'].id, 'characters': item['node'].characters, 'start': index, 'end': index + msg.data.keyword.length, 'hasMissingFont': item['node'].hasMissingFont });
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
            // console.log('toUIHTML:');
            // console.log(toUIHTML);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG9EQUFvRDtBQUNuRjtBQUNBO0FBQ0EsK0JBQStCLHFEQUFxRDtBQUNwRjtBQUNBOzs7Ozs7OztVRWpiQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS8uL3NyYy9jb2RlLnRzIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQGZpZ21hL3BsdWdpbi10eXBpbmdzL2luZGV4LmQudHNcIiAvPlxubGV0IHRhcmdldF9UZXh0X05vZGUgPSBbXTsgLy8g5a2Y5YKo56ym5ZCI5pCc57Si5p2h5Lu255qEIFRFWFQg5Zu+5bGCXG5sZXQgbG9hZGVkX2ZvbnRzID0gW107XG5jb25zb2xlLmxvZygnMjAyMjAyMTInKTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzAwLCBoZWlnaHQ6IDM0MCB9KTtcbi8vIGNvbnNvbGUubG9nKCdoZWxsbzInKVxub25TZWxlY3Rpb25DaGFuZ2UoKTtcbi8vIOe7keWumiBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbkuovku7ZcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHsgb25TZWxlY3Rpb25DaGFuZ2UoKTsgfSk7XG4vLyBVSSDlj5HmnaXmtojmga9cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pCc57Si44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VhcmNoJykge1xuICAgICAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmRfbG9hZGluZycgfSlcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCcpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgLy8g5omn6KGM5pCc57SiXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBmaW5kKG1zZy5kYXRhKTsgfSwgMCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Nvc3QgaXM6JyArIChlbmQgLSBzdGFydCkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoIHRhcmdldF9UZXh0X05vZGU6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aCk7JyArIHRhcmdldF9UZXh0X05vZGUubGVuZ3RoLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgbGV0IHRvVUlIVE1MID0gW107IC8vIOWtmOWCqOaVsOaNru+8jOeUqOS6juWPkemAgee7mSBVSVxuICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGUubGVuZ3RoID49IDApIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlrZjlnKjnrKblkIjmkJzntKLmnaHku7bnmoQgVEVYVCDlm77lsYJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoOicpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLy8g5p6E5bu65pWw5o2u77yM5Lyg6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKogVEVYVCDlm77lsYLlhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGl0ZW1bJ25vZGUnXS5jaGFyYWN0ZXJzLmluZGV4T2YobXNnLmRhdGEua2V5d29yZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4OicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlsIbmn6Xmib7nmoTlrZfnrKbotbflp4vjgIHnu4jmraLkvY3nva7lj5HpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1VJSFRNTC5wdXNoKHsgJ2lkJzogaXRlbVsnbm9kZSddLmlkLCAnY2hhcmFjdGVycyc6IGl0ZW1bJ25vZGUnXS5jaGFyYWN0ZXJzLCAnc3RhcnQnOiBpbmRleCwgJ2VuZCc6IGluZGV4ICsgbXNnLmRhdGEua2V5d29yZC5sZW5ndGgsICdoYXNNaXNzaW5nRm9udCc6IGl0ZW1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4ICsgbXNnLmRhdGEua2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpZiA6dG9VSUhUTUw6Jyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codG9VSUhUTUwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RvVUlIVE1MOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codG9VSUhUTUwpO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ3RhcmdldF9UZXh0X05vZGUnOiB0b1VJSFRNTCB9KTtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRGb250ID0gKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgeyBteUxvYWRGb250QXN5bmModGFyZ2V0X1RleHRfTm9kZSk7IH0pO1xuICAgICAgICAgICAgbG9hZEZvbnQoKTtcbiAgICAgICAgfSwgMSk7XG4gICAgfVxuICAgIC8vIFVJIOS4reeCueWHu+aQnOe0oue7k+aenOmhuVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2xpc3RPbkNsaWsnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjb2RlIGpzOmxpc3RPbkNsaWs6Jyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIHZhciB0YXJnZXROb2RlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9yRWFjaDonKTtcbiAgICAgICAgLy8g6YGN5Y6G5pCc57Si57uT5p6cXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0X1RleHRfTm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXS5pZCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtc2cuZGF0YS5pdGVtKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZy5kYXRhWydpdGVtJ10pO1xuICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5pZCA9PSBtc2cuZGF0YVsnaXRlbSddKSB7XG4gICAgICAgICAgICAgICAgLy8g5om+5Yiw55So5oi354K55Ye755qE5Zu+5bGCXG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZSA9PT0gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOinhuWbvuWumuS9jeWIsOWvueW6lOWbvuWxglxuICAgICAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddXSk7XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6YCJ5Lit5a+55bqU5paH5pysXG4gICAgICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0ZWRUZXh0UmFuZ2UgPSB7ICdub2RlJzogdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLCAnc3RhcnQnOiBtc2cuZGF0YVsnc3RhcnQnXSwgJ2VuZCc6IG1zZy5kYXRhWydlbmQnXSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFVJIOS4reeCueWHu+S6huOAjOabv+aNouOAjeaMiemSrlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIC8vIOaJp+ihjOabv+aNolxuICAgICAgICByZXBsYWNlKG1zZyk7XG4gICAgfVxufTtcbi8vIOafpeaJvuWbvuWxguS4i+eahOaWh+acrOWbvuWxgu+8jOi+k+WFpSBmaWdtYSDlm77lsYLlr7nosaHvvIzov5Tlm57mib7liLDmiYDmnInmlofmnKzlm77lsYJcbmZ1bmN0aW9uIG15RmluZFRleHRBbGwobm9kZSwgbm9kZV9saXN0LCBhbmNlc3Rvcl9pc0xvY2tlZCwgYW5jZXN0b3JfaXNWaXNpYmxlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ215RmluZEFsbCcpO1xuICAgIC8vIGNvbnNvbGUubG9nKGlzTG9ja2VkKTtcbiAgICBsZXQgbG9ja2VkID0gZmFsc2U7IC8vIOWtmOWCqOacgOe7iOeahOeKtuaAgVxuICAgIGxldCB2aXNpYmxlID0gdHJ1ZTtcbiAgICAvLyDlpoLmnpznm67moIflm77lsYLmnKzouqvlsLHmmK8gVEVYVCDlm77lsYJcbiAgICBpZiAobm9kZS50eXBlID09ICdURVhUJykge1xuICAgICAgICAvLyAvLyDmlofmnKzlm77lsYLmmK/lkKbplIHlrprjgIHpmpDol4/vvJ9cbiAgICAgICAgLy8gaWYgKG5vZGUubG9ja2VkKSB7XG4gICAgICAgIC8vICAgLy8g6ZSB5a6aXG4gICAgICAgIC8vICAgbG9ja2VkID0gdHJ1ZVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgIGxvY2tlZCA9IGZhbHNlXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gaWYgKG5vZGUudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAvLyAgIC8vIOmakOiXj1xuICAgICAgICAvLyAgIHZpc2libGUgPSBmYWxzZVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgIHZpc2libGUgPSB0cnVlXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gLy8g56WW5YWI5Zu+5bGC55qE6ZSB5a6a44CB6ZqQ6JeP54q25oCB5LyY5YWI57qn6auYXG4gICAgICAgIC8vIGlmIChhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgIC8vICAgLy8g56WW5YWI5piv6ZSB5a6a54q25oCBXG4gICAgICAgIC8vICAgbG9ja2VkID0gdHJ1ZVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgIC8vIOelluWFiOmdnumUgeWumueKtuaAgVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgLy8gICAvLyDnpZblhYjmmK/pmpDol4/nirbmgIFcbiAgICAgICAgLy8gICB2aXNpYmxlID0gZmFsc2VcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAvLyDnpZblhYjpnZ7pmpDol4/nirbmgIFcbiAgICAgICAgLy8gfVxuICAgICAgICBub2RlX2xpc3QucHVzaChub2RlKTtcbiAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICB9XG4gICAgdmFyIHRoaXNDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgLy8gIOWmguaenOW9k+WJjeiKgueCueS4i+WtmOWcqOWtkOiKgueCuVxuICAgIGlmICh0aGlzQ2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIOW9k+WJjeiKgueCueaXoOWtkOiKgueCue+8jOWPr+iDveaYr+W9oueKtuWbvuWxglxuICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgIH1cbiAgICAvLyBpZiAoYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgIC8vICAgLy8g56WW5YWI5piv6ZSB5a6a54q25oCBXG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIC8vIOelluWFiOmdnumUgeWumueKtuaAgVxuICAgIC8vICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0aGlzQ2hpbGRyZW4ubG9ja2VkXG4gICAgLy8gfVxuICAgIC8vIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UpIHtcbiAgICAvLyAgIC8vIOelluWFiOaYr+makOiXj+eKtuaAgVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAvLyDnpZblhYjpnZ7pmpDol4/nirbmgIFcbiAgICAvLyAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRoaXNDaGlsZHJlbi52aXNpYmxlXG4gICAgLy8gfVxuICAgIC8vIOmBjeWOhuWtkOiKgueCuVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpc0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzQ2hpbGRyZW46JylcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpc0NoaWxkcmVuKTtcbiAgICAgICAgaWYgKHRoaXNDaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCchISFFUlJPIHRoaXNDaGlsZHJlbj09dW5kZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgICAgICB9XG4gICAgICAgIC8vIOWmguaenOiKgueCueeahOexu+Wei+S4uiBURVhUXG4gICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgIG5vZGVfbGlzdC5wdXNoKHRoaXNDaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3mmK8gVEVYVCDlm77lsYJcbiAgICAgICAgICAgIC8vIOWmguaenOWMheWQq+WtkOWbvuWxglxuICAgICAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS5jaGlsZHJlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgLy8g56WW5YWI5piv6ZSB5a6a54q25oCBXG4gICAgICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgLy8g56WW5YWI6Z2e6ZSB5a6a54q25oCBXG4gICAgICAgICAgICAgICAgICAgIC8vICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0aGlzQ2hpbGRyZW5baV0ubG9ja2VkXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIOelluWFiOaYr+makOiXj+eKtuaAgVxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIOelluWFiOmdnumakOiXj+eKtuaAgVxuICAgICAgICAgICAgICAgICAgICAvLyAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRoaXNDaGlsZHJlbi52aXNpYmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0ID0gbXlGaW5kVGV4dEFsbCh0aGlzQ2hpbGRyZW5baV0sIG5vZGVfbGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdub2RlX2xpc3Q6Jyk7XG4gICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICByZXR1cm4gbm9kZV9saXN0O1xufVxuLy8g5Yqg6L295a2X5L2TXG5mdW5jdGlvbiBteUxvYWRGb250QXN5bmModGV4dF9sYXllcl9MaXN0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ215TG9hZEZvbnRBc3luYzonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGV4dF9sYXllcl9MaXN0KTtcbiAgICAgICAgZm9yIChsZXQgbGF5ZXIgb2YgdGV4dF9sYXllcl9MaXN0KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLScpO1xuICAgICAgICAgICAgLy8g5Yqg6L295a2X5L2TXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbGF5ZXI6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsYXllcik7XG4gICAgICAgICAgICBsZXQgZm9udHMgPSBsYXllclsnbm9kZSddLmdldFJhbmdlQWxsRm9udE5hbWVzKDAsIGxheWVyWydub2RlJ11bJ2NoYXJhY3RlcnMnXS5sZW5ndGgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZvbnRzOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZm9udHMpO1xuICAgICAgICAgICAgZm9yIChsZXQgZm9udCBvZiBmb250cykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmaW5kIGVuZCBsb2FkIGZvbnQ6Jyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2xvYWRlZF9mb250czonKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2FkZWRfZm9udHMpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb250OicpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZvbnQpO1xuICAgICAgICAgICAgICAgIGxldCBiaW5nbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGxvYWRlZF9mb250IG9mIGxvYWRlZF9mb250cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkX2ZvbnRbJ2ZhbWlseSddID09IGZvbnRbJ2ZhbWlseSddICYmIGxvYWRlZF9mb250WydzdHlsZSddID09IGZvbnRbJ3N0eWxlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmdvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGJpbmdvKTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZ28pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDlrZfkvZPmmK/lkKbmlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxheWVyWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS4jeaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hhc01pc3NpbmdGb250Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZF9mb250cy5wdXNoKGZvbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2xvYWRGb250QXN5bmMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2cobXlGb250KTtcbiAgICAgICAgLy8gYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyhteUZvbnQpXG4gICAgfSk7XG59XG4vLyDmkJzntKJcbmZ1bmN0aW9uIGZpbmQoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdjb25kZS50czpmaW5kOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAvLyDmuIXnqbrljoblj7LmkJzntKLmlbDmja7vvIzph43mlrDmkJzntKJcbiAgICB0YXJnZXRfVGV4dF9Ob2RlID0gW107XG4gICAgdmFyIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICB2YXIgbm9kZV9saXN0ID0gW107IC8vIOWtmOWCqOebruagh+WAvCDigJTigJQg6YCJ5Lit5Zu+5bGC5Lit77yM5omA5pyJ5paH5pys5Zu+5bGCXG4gICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xuICAgICAgICAvLyBub2RlX2xpc3QgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsKG4gPT4gbi50eXBlID09PSBcIlRFWFRcIilcbiAgICAgICAgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyDlvZPliY3mnInpgInkuK3lm77lsYLvvIzliJnlnKjpgInkuK3nmoTlm77lsYLkuK3mkJzntKJcbiAgICAgICAgLy8g5Zyo5b2T5YmN6YCJ5Lit55qE5Zu+5bGC5Lit77yM5pCc57Si5paH5pys5Zu+5bGCXG4gICAgfVxuICAgIC8vIOmBjeWOhuiMg+WbtOWGheeahOWbvuWxgu+8jOiOt+WPliBURVhUIOWbvuWxglxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmaW5kOmZvciBzZWxlY3Rpb24nKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coc2VsZWN0aW9uW2ldKTtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdGlvbltpXS5jaGlsZHJlbik7XG4gICAgICAgIC8vIOWmguaenOWbvuWxguacrOi6q+WwseaYr+aWh+acrOWbvuWxglxuICAgICAgICBpZiAoc2VsZWN0aW9uW2ldLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICBub2RlX2xpc3QucHVzaChzZWxlY3Rpb25baV0pO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5rKh5pyJ5a2Q5Zu+5bGCXG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBpZiAoc2VsZWN0aW9uW2ldLmNoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBub2RlX2xpc3QgPSBub2RlX2xpc3QuY29uY2F0KHNlbGVjdGlvbltpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pKTtcbiAgICAgICAgLy8gbm9kZV9saXN0ID0gbm9kZV9saXN0LmNvbmNhdChzZWxlY3Rpb25baV0uZmluZEFsbFdpdGhDcml0ZXJpYSh7IHR5cGVzOiBbJ1RFWFQnXSB9KSlcbiAgICAgICAgLy8gbm9kZV9saXN0ID0gbXlGaW5kVGV4dEFsbChzZWxlY3Rpb25baV0sIG5vZGVfbGlzdClcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vZGVfbGlzdDonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coJ3NlbGVjdGlvbjonKTtcbiAgICAvLyBjb25zb2xlLmxvZyhzZWxlY3Rpb24pO1xuICAgIGNvbnNvbGUubG9nKCdGaW5kIGVuZDonKTtcbiAgICAvLyBjb25zb2xlLmxvZyhub2RlX2xpc3QpO1xuICAgIC8vIOWcqOaWh+acrOWbvuWxguS4re+8jOWMuemFjeWFs+mUruWtl1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbm9kZV9saXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdFtqXVsnbm9kZSddKTtcbiAgICAgICAgaWYgKG5vZGVfbGlzdFtqXVsnY2hhcmFjdGVycyddLmluZGV4T2YoZGF0YS5rZXl3b3JkKSA+IC0xKSB7XG4gICAgICAgICAgICAvLyDmib7liLDlhbPplK7or41cbiAgICAgICAgICAgIGxldCB0aGlzX3BhcmVudDtcbiAgICAgICAgICAgIGxldCBhbmNlc3Rvcl9pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzTG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAobm9kZV9saXN0W2pdLmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGVfbGlzdFtqXS52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlIHx8IGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/plIHlrprmiJbpmpDol4/nirbmgIFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOiOt+WPluelluWFiOWFg+e0oOeahOeKtuaAgVxuICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gbm9kZV9saXN0W2pdLnBhcmVudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpc19wYXJlbnQudHlwZSAhPSAnUEFHRScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LmxvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzX3BhcmVudCA9IHRoaXNfcGFyZW50LnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUucHVzaCh7ICdub2RlJzogbm9kZV9saXN0W2pdLCAnYW5jZXN0b3JfaXNWaXNpYmxlJzogYW5jZXN0b3JfaXNWaXNpYmxlLCAnYW5jZXN0b3JfaXNMb2NrZWQnOiBhbmNlc3Rvcl9pc0xvY2tlZCB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnZmluZCBlbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG59XG4vLyDmm7/mjaJcbmZ1bmN0aW9uIHJlcGxhY2UoZGF0YSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgbGV0IGhhc01pc3NpbmdGb250Q291bnQgPSAwO1xuICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmVwbGFjZSB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2g6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgICAgIGlmIChpdGVtWydhbmNlc3Rvcl9pc1Zpc2libGUnXSA9PSBmYWxzZSB8fCBpdGVtWydhbmNlc3Rvcl9pc0xvY2tlZCddID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyDlv73nlaXpmpDol4/jgIHplIHlrprnmoTlm77lsYJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub2RlOicpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW1bJ25vZGUnXVsnZm9udE5hbWUnXSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaXRlbVsnbm9kZSddLmhhc01pc3NpbmdGb250KTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVsnbm9kZSddLmhhc01pc3NpbmdGb250KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWtl+S9k+S4jeaUr+aMgVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGFzTWlzc2luZ0ZvbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgaGFzTWlzc2luZ0ZvbnRDb3VudCArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRTdHlsZSA9IGl0ZW1bJ25vZGUnXS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoWydpbmRlbnRhdGlvbicsICdsaXN0T3B0aW9ucyddKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RleHRTdHlsZTonKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGV4dFN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldFN0YXJ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldEVuZCA9IDA7IC8vIOiusOW9leS/ruaUueWtl+espuWQjueahOe0ouW8leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGVUZW1wID0gW107IC8vIOiusOW9leavj+S4quauteiQveagt+W8j+WcqOS/ruaUueWQjueahOagt+W8j+e0ouW8le+8iOWcqOabv+aNouWujOWtl+espuWQjumcgOimgeiuvue9ruWbnuS5i+WJjeeahOagt+W8j++8iVxuICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdF9vZmZzZXRFbmQgPSAwOyAvLyDorrDlvZXkuIrkuIDkuKrmrrXokL3nmoTmnKvlsL7ntKLlvJVcbiAgICAgICAgICAgICAgICAgICAgLy8g5pu/5o2i55uu5qCH5a2X56ymXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUseS6juWNleS4quauteiQveWGheWPr+iDveWtmOWcqOWkmuS4quespuWQiOadoeS7tueahOWtl+espu+8jOaJgOS7pemcgOimgeW+queOr+afpeaJvlxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bljLnphY3liLDnmoTlrZfnrKbnmoTntKLlvJVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBlbGVtZW50LmNoYXJhY3RlcnMuaW5kZXhPZihkYXRhLmRhdGEua2V5d29yZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOacieWMuemFjeeahOWtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXmlrDlrZfnrKbpnIDopoHmj5LlhaXnmoTkvY3nva5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluc2VydFN0YXJ0ID0gaW5kZXggKyBkYXRhLmRhdGEua2V5d29yZC5sZW5ndGggKyBlbGVtZW50WydzdGFydCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5zZXJ0U3RhcnQ6JyArIGluc2VydFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDpnIDopoHmm7/mjaLmiJDku6XkuIvlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5ld0NoYXJhY3RlcnMgPSBkYXRhLmRhdGEucmVwbGFjZV93b3JkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlnKjntKLlvJXlkI7mj5LlhaXmlrDlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVsnbm9kZSddLmluc2VydENoYXJhY3RlcnMoaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQsIG5ld0NoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7ntKLlvJXliKDpmaTml6flrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVsnbm9kZSddLmRlbGV0ZUNoYXJhY3RlcnMoaW5kZXggKyBlbGVtZW50WydzdGFydCddICsgb2Zmc2V0RW5kLCBpbnNlcnRTdGFydCArIG9mZnNldEVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvZmZzZXRTdGFydCA9IGxhc3Rfb2Zmc2V0RW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldEVuZCArPSBkYXRhLmRhdGEucmVwbGFjZV93b3JkLmxlbmd0aCAtIGRhdGEuZGF0YS5rZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3doaWxlIG9mZnNldFN0YXJ0OicgKyBvZmZzZXRTdGFydC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3doaWxlIG9mZnNldEVuZDonICsgb2Zmc2V0RW5kLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDorrDlvZXmo4DntKLliLDnm67moIflrZfnrKbnmoTntKLlvJXvvIzkuIvkuIDmrKEgd2hpbGUg5b6q546v5Zyo5q2k5L2N572u5ZCO5byA5aeL5p+l5om+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBkYXRhLmRhdGEua2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmsqHmnInljLnphY3nmoTlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIHdoaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnb2Zmc2V0U3RhcnQ6JyArIG9mZnNldFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ29mZnNldEVuZDonICsgb2Zmc2V0RW5kLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2VsZW1lbnQ6Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxldCB0aGlzU3RhcnQgPSBlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmICh0aGlzU3RhcnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgIHRoaXNTdGFydCA9IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChlbGVtZW50WydzdGFydCddID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgdGhpc1N0YXJ0ID09IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWwhuWNleS4quauteiQveeahOe8qei/m+OAgeW6j+WPt+agt+W8j+iusOW9leWIsOaVsOe7hOWGhVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVUZW1wLnB1c2goeyAnc3RhcnQnOiBsYXN0X29mZnNldEVuZCwgJ2VuZCc6IGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCAnaW5kZW50YXRpb24nOiBlbGVtZW50WydpbmRlbnRhdGlvbiddID4gMCA/IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gOiBlbGVtZW50WydpbmRlbnRhdGlvbiddLCAnbGlzdE9wdGlvbnMnOiBlbGVtZW50WydsaXN0T3B0aW9ucyddIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9vZmZzZXRFbmQgPSBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOiuvue9rue8qei/m1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlbVsnbm9kZSddLnNldFJhbmdlSW5kZW50YXRpb24oZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0LCBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgZWxlbWVudFsnaW5kZW50YXRpb24nXSA+IDAgPyBlbGVtZW50WydpbmRlbnRhdGlvbiddIC0gMSA6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10pXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAvLyDorr7nva7luo/lj7dcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0ZW1bJ25vZGUnXS5zZXRSYW5nZUxpc3RPcHRpb25zKGVsZW1lbnRbJ3N0YXJ0J10gKyBvZmZzZXRTdGFydCwgZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsIGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10pXG4gICAgICAgICAgICAgICAgICAgIH0pOyAvLyB0ZXh0U3R5bGUuZm9yRWFjaFxuICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7nvKnov5vjgIHluo/lj7dcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ+iuvue9rue8qei/m+OAgeW6j+WPt++8micpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzdHlsZVRlbXApO1xuICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZVRlbXAg6K6w5b2V5LqG5q+P5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP77yM6YGN5Y6G5pWw57uE5L2/5b6X5L+u5pS55a2X56ym5ZCO55qE5paH5pys5Zu+5bGC5qC35byP5LiN5Y+YXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlVGVtcC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVsnbm9kZSddLnNldFJhbmdlTGlzdE9wdGlvbnMoZWxlbWVudFsnc3RhcnQnXSwgZWxlbWVudFsnZW5kJ10sIGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbVsnbm9kZSddLnNldFJhbmdlSW5kZW50YXRpb24oZWxlbWVudFsnc3RhcnQnXSwgZWxlbWVudFsnZW5kJ10sIGVsZW1lbnRbJ2luZGVudGF0aW9uJ10pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAvLyB2YXIgc2VhcmNoUmVnRXhwID0gbmV3IFJlZ0V4cChkYXRhLmRhdGEua2V5d29yZCwgJ2cnKVxuICAgICAgICAgICAgICAgIC8vIC8vIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICAgICAgICAgIC8vIGl0ZW1bJ25vZGUnXS5jaGFyYWN0ZXJzID0gaXRlbVsnbm9kZSddLmNoYXJhY3RlcnMucmVwbGFjZShzZWFyY2hSZWdFeHAsIGRhdGEuZGF0YS5yZXBsYWNlX3dvcmQpXG4gICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgfSk7IC8vIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaFxuICAgICAgICAvLyDmm7/mjaLlrozmr5XvvIzpgJrnn6UgVUkg5pu05pawXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdoYXNNaXNzaW5nRm9udENvdW50JzogaGFzTWlzc2luZ0ZvbnRDb3VudCB9KTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGU6Jyk7XG4gICAgfSk7XG59IC8vIGFzeW5jIGZ1bmN0aW9uIHJlcGxhY2Vcbi8vIEZpZ21hIOWbvuWxgumAieaLqeWPmOWMluaXtu+8jOmAmuefpSBVSSDmmL7npLrkuI3lkIznmoTmj5DnpLpcbmZ1bmN0aW9uIG9uU2VsZWN0aW9uQ2hhbmdlKCkge1xuICAgIHZhciBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiB0cnVlIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogZmFsc2UgfSk7XG4gICAgfVxufVxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9jb2RlLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=