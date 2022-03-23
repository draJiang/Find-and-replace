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
console.log('2022-03-23');
// 启动插件时显示 UI
figma.showUI(__html__, { width: 300, height: 400 });
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
    // let children_list = []    // 拆分图层，逐个搜索，避免界面长时间挂起
    let len = selection.length;
    // 拆分图层，逐个搜索，避免界面长时间挂起
    // for (let j = 0; j < len; j++) {
    //   //@ts-ignore
    //   console.log(selection[j].children);
    //   //@ts-ignore
    //   if (selection[j].children == undefined) {
    //     children_list = children_list.concat(selection[j])
    //   } else {
    //     // 如果图层下有子图层
    //     //@ts-ignore
    //     for (let k = 0; k < selection[j].children.length; k++) {
    //       //@ts-ignore
    //       const element = selection[j].children[k];
    //       console.log('element:');
    //       console.log(element);
    //       console.log(element.children);
    //       if (element.children == undefined) {
    //         // 如果图层下没有子图层
    //         children_list = children_list.concat(element)
    //         console.log('children_list');
    //       } else {
    //         // 如果图层下有子图层
    //         children_list = children_list.concat(element.children)
    //       }
    //     }
    //   }
    // }
    // for (let i = 0; i < children_list.length; i++) {
    //   setTimeout(() => {
    //     // 如果图层本身就是文本图层
    //     if (children_list[i].type == 'TEXT') {
    //       node_list.push(children_list[i])
    //     } else {
    //       // 如果图层下没有子图层
    //       //@ts-ignore
    //       if (children_list[i].children == undefined) {
    //       } else {
    //         // 获取文本图层
    //         console.log('findAllWithCriteria:');
    //         console.log(children_list[i]['name']);
    //         //@ts-ignore
    //         node_list = node_list.concat(children_list[i].findAllWithCriteria({ types: ['TEXT'] }))
    //       }
    //     }
    //   }, 10);
    // }
    // 遍历范围内的图层，获取 TEXT 图层
    //@ts-ignore
    figma.skipInvisibleInstanceChildren = true; // 忽略隐藏的图层
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
                    console.log('findAllWithCriteria:');
                    console.log(selection[i]['name']);
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
                        if (req_cout < 20) {
                            // 如果已经有搜索结果，则先发送一部分显示在 UI 中，提升搜索加载状态的体验
                            figma.ui.postMessage({ 'type': 'find', 'done': false, 'my_progress': { 'index': my_progress, 'total': len }, 'target_Text_Node': [data_temp] });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHNDQUFzQztBQUN0QztBQUNBLHFEQUFxRCwyS0FBMks7QUFDaE87QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxHQUFHO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyw4QkFBOEI7QUFDOUIsMEJBQTBCO0FBQzFCLCtDQUErQyxtREFBbUQsb0NBQW9DLDhDQUE4QztBQUNwTCxxQkFBcUI7QUFDckI7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG9EQUFvRDtBQUNuRjtBQUNBO0FBQ0EsK0JBQStCLHFEQUFxRDtBQUNwRjtBQUNBOzs7Ozs7OztVRXRiQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS8uL3NyYy9jb2RlLnRzIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQGZpZ21hL3BsdWdpbi10eXBpbmdzL2luZGV4LmQudHNcIiAvPlxubGV0IHRhcmdldF9UZXh0X05vZGUgPSBbXTsgLy8g5a2Y5YKo56ym5ZCI5pCc57Si5p2h5Lu255qEIFRFWFQg5Zu+5bGCXG5sZXQgbG9hZGVkX2ZvbnRzID0gW107IC8vIOW3suWKoOi9veeahOWtl+S9k+WIl+ihqFxubGV0IGZpbGVUeXBlID0gZmlnbWEuZWRpdG9yVHlwZTsgLy8g5b2T5YmNIGZpZ21hIOaWh+S7tuexu+Wei++8mmZpZ21hL2ZpZ2phbVxubGV0IGhhc01pc3NpbmdGb250Q291bnQgPSAwOyAvLyDmm7/mjaLml7borrDlvZXkuI3mlK/mjIHlrZfkvZPnmoTmlbDph49cbmxldCByZXFfY291dCA9IDA7IC8vIOaQnOe0oue7k+aenOaVsOmHj1xubGV0IG5vZGVfbGlzdCA9IFtdOyAvLyDlrZjlgqjmiYDmnIkgVEVYVCDlm77lsYJcbmNvbnNvbGUubG9nKCcyMDIyLTAzLTIzJyk7XG4vLyDlkK/liqjmj5Lku7bml7bmmL7npLogVUlcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzAwLCBoZWlnaHQ6IDQwMCB9KTtcbi8vIOiOt+WPluaYr+WQpumAieS4reWbvuWxglxub25TZWxlY3Rpb25DaGFuZ2UoKTtcbi8vIOe7keWumiBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbkuovku7ZcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHsgb25TZWxlY3Rpb25DaGFuZ2UoKTsgfSk7XG4vLyBVSSDlj5HmnaXmtojmga9cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pCc57Si44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VhcmNoJykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoJyk7XG4gICAgICAgIC8vIOiusOW9lei/kOihjOaXtumVv1xuICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgbGV0IGZpbmRfc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgLy8g5omn6KGM5pCc57SiXG4gICAgICAgIGZpbmQobXNnLmRhdGEpO1xuICAgICAgICBsZXQgZG9uZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygn44CL44CL44CL44CL44CL44CL44CL44CL44CL44CLZmluZDonICsgKGRvbmUgLSBmaW5kX3N0YXJ0KS50b1N0cmluZygpKTtcbiAgICAgICAgbGV0IHRvSFRNTDsgLy8g5a2Y5YKo6KaB5Y+R57uZIHVpLnRzeCDnmoTmlbDmja5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmluZEtleVdvcmRfc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIC8vIOWcqOaWh+acrOWbvuWxguS4reWMuemFjeWMheWQq+WFs+mUruWtl+eahOWbvuWxglxuICAgICAgICAgICAgdG9IVE1MID0gZmluZEtleVdvcmQobm9kZV9saXN0LCBtc2cuZGF0YS5rZXl3b3JkKTtcbiAgICAgICAgICAgIGxldCBmaW5kS2V5V29yZF9lbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgItmaW5kS2V5V29yZDonICsgKGZpbmRLZXlXb3JkX2VuZCAtIGZpbmRLZXlXb3JkX3N0YXJ0KS50b1N0cmluZygpKTtcbiAgICAgICAgfSwgMjApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWwhuaQnOe0ouaVsOaNruWPkemAgee7mSB1aS50c3hcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZG9uZSc6IHRydWUsICd0YXJnZXRfVGV4dF9Ob2RlJzogdG9IVE1MIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGaW5kIGVuZCxjb3VudDonKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXFfY291dCk7XG4gICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdkb25lJyB9KVxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn44CL44CL44CL44CL44CL44CL44CL44CL44CL44CLJyArIG1zZy5kYXRhLmtleXdvcmQgKyAnOicgKyAoZW5kIC0gc3RhcnQpLnRvU3RyaW5nKCkgKyAnIGNvdW50OicgKyByZXFfY291dC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBpZiAocmVxX2NvdXQgPiAzMCkge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5yZXNpemUoMzAwLCA1NDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDMwKTtcbiAgICAgICAgfSwgNDApO1xuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vmkJzntKLnu5PmnpzpoblcbiAgICBpZiAobXNnLnR5cGUgPT09ICdsaXN0T25DbGlrJykge1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZvckVhY2g6Jyk7XG4gICAgICAgIC8vIOmBjeWOhuaQnOe0oue7k+aenFxuICAgICAgICBsZXQgbGVuID0gdGFyZ2V0X1RleHRfTm9kZS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaWQgPT0gbXNnLmRhdGFbJ2l0ZW0nXSkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWIsOeUqOaIt+eCueWHu+eahOWbvuWxglxuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUgPT09IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXTtcbiAgICAgICAgICAgICAgICAvLyBGaWdtYSDop4blm77lrprkvY3liLDlr7nlupTlm77lsYJcbiAgICAgICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW3RhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXV0pO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOmAieS4reWvueW6lOaWh+acrFxuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGVkVGV4dFJhbmdlID0geyAnbm9kZSc6IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXSwgJ3N0YXJ0JzogbXNnLmRhdGFbJ3N0YXJ0J10sICdlbmQnOiBtc2cuZGF0YVsnZW5kJ10gfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vkuobjgIzmm7/mjaLjgI3mjInpkq5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXBsYWNlJykge1xuICAgICAgICBjb25zb2xlLmxvZygnY29kZS50cyByZXBsYWNlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIC8vIOaJp+ihjOabv+aNolxuICAgICAgICByZXBsYWNlKG1zZykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29kZS50cyByZXBsYWNlIGRvbmUnKTtcbiAgICAgICAgICAgICAgICAvLyDmm7/mjaLlrozmr5XvvIzpgJrnn6UgVUkg5pu05pawXG4gICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2RvbmUnOiB0cnVlLCAnaGFzTWlzc2luZ0ZvbnRDb3VudCc6IGhhc01pc3NpbmdGb250Q291bnQgfSk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ2NvZGUudHMgcmVwbGFjZSBkb25lJyk7XG4gICAgICAgIC8vICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICAvLyAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogdHJ1ZSwgJ2hhc01pc3NpbmdGb250Q291bnQnOiBoYXNNaXNzaW5nRm9udENvdW50IH0pO1xuICAgICAgICAvLyB9LCAzMCk7XG4gICAgfVxufTtcbi8vIOWKoOi9veWtl+S9k1xuZnVuY3Rpb24gbXlMb2FkRm9udEFzeW5jKHRleHRfbGF5ZXJfTGlzdCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdteUxvYWRGb250QXN5bmM6Jyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRleHRfbGF5ZXJfTGlzdCk7XG4gICAgICAgIGZvciAobGV0IGxheWVyIG9mIHRleHRfbGF5ZXJfTGlzdCkge1xuICAgICAgICAgICAgaWYgKGxheWVyWydub2RlJ11bJ2NoYXJhY3RlcnMnXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLS0nKTtcbiAgICAgICAgICAgIC8vIOWKoOi9veWtl+S9k1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobGF5ZXIpO1xuICAgICAgICAgICAgbGV0IGZvbnRzID0gbGF5ZXJbJ25vZGUnXS5nZXRSYW5nZUFsbEZvbnROYW1lcygwLCBsYXllclsnbm9kZSddWydjaGFyYWN0ZXJzJ10ubGVuZ3RoKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb250czonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZvbnRzKTtcbiAgICAgICAgICAgIGZvciAobGV0IGZvbnQgb2YgZm9udHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmluZ28gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBsb2FkZWRfZm9udCBvZiBsb2FkZWRfZm9udHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvYWRlZF9mb250WydmYW1pbHknXSA9PSBmb250WydmYW1pbHknXSAmJiBsb2FkZWRfZm9udFsnc3R5bGUnXSA9PSBmb250WydzdHlsZSddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiaW5nbyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhiaW5nbyk7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmdvKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5a2X5L2T5piv5ZCm5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXllclsnbm9kZSddLmhhc01pc3NpbmdGb250KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDkuI3mlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoYXNNaXNzaW5nRm9udCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5pSv5oyBXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkZWRfZm9udHMucHVzaChmb250KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2FkRm9udEFzeW5jJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKGZvbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG15Rm9udCk7XG4gICAgICAgIC8vIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMobXlGb250KVxuICAgICAgICByZXR1cm4gJ2RvbmUnO1xuICAgIH0pO1xufVxuLy8g5om+5Ye65omA5pyJ5paH5pys5Zu+5bGCXG5mdW5jdGlvbiBmaW5kKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZygnY29uZGUudHM6ZmluZDonKTtcbiAgICAvLyBjb25zb2xlLmxvZyhmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgLy8g5riF56m65Y6G5Y+y5pCc57Si5pWw5o2u77yM6YeN5paw5pCc57SiXG4gICAgdGFyZ2V0X1RleHRfTm9kZSA9IFtdO1xuICAgIC8vIOW9k+WJjemAieS4reeahOWbvuWxglxuICAgIGxldCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xuICAgICAgICBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIOW9k+WJjeaciemAieS4reWbvuWxgu+8jOWImeWcqOmAieS4reeahOWbvuWxguS4reaQnOe0olxuICAgICAgICAvLyDlnKjlvZPliY3pgInkuK3nmoTlm77lsYLkuK3vvIzmkJzntKLmlofmnKzlm77lsYJcbiAgICB9XG4gICAgbm9kZV9saXN0ID0gW107IC8vIOWtmOWCqOaJgOaciSBURVhUIOWbvuWxglxuICAgIC8vIGxldCBjaGlsZHJlbl9saXN0ID0gW10gICAgLy8g5ouG5YiG5Zu+5bGC77yM6YCQ5Liq5pCc57Si77yM6YG/5YWN55WM6Z2i6ZW/5pe26Ze05oyC6LW3XG4gICAgbGV0IGxlbiA9IHNlbGVjdGlvbi5sZW5ndGg7XG4gICAgLy8g5ouG5YiG5Zu+5bGC77yM6YCQ5Liq5pCc57Si77yM6YG/5YWN55WM6Z2i6ZW/5pe26Ze05oyC6LW3XG4gICAgLy8gZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKykge1xuICAgIC8vICAgLy9AdHMtaWdub3JlXG4gICAgLy8gICBjb25zb2xlLmxvZyhzZWxlY3Rpb25bal0uY2hpbGRyZW4pO1xuICAgIC8vICAgLy9AdHMtaWdub3JlXG4gICAgLy8gICBpZiAoc2VsZWN0aW9uW2pdLmNoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgIC8vICAgICBjaGlsZHJlbl9saXN0ID0gY2hpbGRyZW5fbGlzdC5jb25jYXQoc2VsZWN0aW9uW2pdKVxuICAgIC8vICAgfSBlbHNlIHtcbiAgICAvLyAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5pyJ5a2Q5Zu+5bGCXG4gICAgLy8gICAgIC8vQHRzLWlnbm9yZVxuICAgIC8vICAgICBmb3IgKGxldCBrID0gMDsgayA8IHNlbGVjdGlvbltqXS5jaGlsZHJlbi5sZW5ndGg7IGsrKykge1xuICAgIC8vICAgICAgIC8vQHRzLWlnbm9yZVxuICAgIC8vICAgICAgIGNvbnN0IGVsZW1lbnQgPSBzZWxlY3Rpb25bal0uY2hpbGRyZW5ba107XG4gICAgLy8gICAgICAgY29uc29sZS5sb2coJ2VsZW1lbnQ6Jyk7XG4gICAgLy8gICAgICAgY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgLy8gICAgICAgY29uc29sZS5sb2coZWxlbWVudC5jaGlsZHJlbik7XG4gICAgLy8gICAgICAgaWYgKGVsZW1lbnQuY2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gICAgICAgICAvLyDlpoLmnpzlm77lsYLkuIvmsqHmnInlrZDlm77lsYJcbiAgICAvLyAgICAgICAgIGNoaWxkcmVuX2xpc3QgPSBjaGlsZHJlbl9saXN0LmNvbmNhdChlbGVtZW50KVxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ2NoaWxkcmVuX2xpc3QnKTtcbiAgICAvLyAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5pyJ5a2Q5Zu+5bGCXG4gICAgLy8gICAgICAgICBjaGlsZHJlbl9saXN0ID0gY2hpbGRyZW5fbGlzdC5jb25jYXQoZWxlbWVudC5jaGlsZHJlbilcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbl9saXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAvLyAgICAgLy8g5aaC5p6c5Zu+5bGC5pys6Lqr5bCx5piv5paH5pys5Zu+5bGCXG4gICAgLy8gICAgIGlmIChjaGlsZHJlbl9saXN0W2ldLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgLy8gICAgICAgbm9kZV9saXN0LnB1c2goY2hpbGRyZW5fbGlzdFtpXSlcbiAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAvLyDlpoLmnpzlm77lsYLkuIvmsqHmnInlrZDlm77lsYJcbiAgICAvLyAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAvLyAgICAgICBpZiAoY2hpbGRyZW5fbGlzdFtpXS5jaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAvLyAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgLy8g6I635Y+W5paH5pys5Zu+5bGCXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnZmluZEFsbFdpdGhDcml0ZXJpYTonKTtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGNoaWxkcmVuX2xpc3RbaV1bJ25hbWUnXSk7XG4gICAgLy8gICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAvLyAgICAgICAgIG5vZGVfbGlzdCA9IG5vZGVfbGlzdC5jb25jYXQoY2hpbGRyZW5fbGlzdFtpXS5maW5kQWxsV2l0aENyaXRlcmlhKHsgdHlwZXM6IFsnVEVYVCddIH0pKVxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSwgMTApO1xuICAgIC8vIH1cbiAgICAvLyDpgY3ljobojIPlm7TlhoXnmoTlm77lsYLvvIzojrflj5YgVEVYVCDlm77lsYJcbiAgICAvL0B0cy1pZ25vcmVcbiAgICBmaWdtYS5za2lwSW52aXNpYmxlSW5zdGFuY2VDaGlsZHJlbiA9IHRydWU7IC8vIOW/veeVpemakOiXj+eahOWbvuWxglxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/mlofmnKzlm77lsYJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICBub2RlX2xpc3QucHVzaChzZWxlY3Rpb25baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5rKh5pyJ5a2Q5Zu+5bGCXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbltpXS5jaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluaWh+acrOWbvuWxglxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluZEFsbFdpdGhDcml0ZXJpYTonKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZWN0aW9uW2ldWyduYW1lJ10pO1xuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0ID0gbm9kZV9saXN0LmNvbmNhdChzZWxlY3Rpb25baV0uZmluZEFsbFdpdGhDcml0ZXJpYSh7IHR5cGVzOiBbJ1RFWFQnXSB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMCk7XG4gICAgfVxuICAgIHJldHVybiBub2RlX2xpc3Q7XG59XG4vLyDmkJzntKLvvJrlnKjmlofmnKzlm77lsYLkuK3vvIzljLnphY3lhbPplK7lrZdcbmZ1bmN0aW9uIGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwga2V5d29yZCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdmdW5jIGZpbmRLZXlXb3JkIGJlZ2luJyk7XG4gICAgcmVxX2NvdXQgPSAwOyAvLyDmkJzntKLnu5PmnpzmlbDph49cbiAgICBsZXQgZGF0YV9pdGVtX2xpc3QgPSBbXTtcbiAgICBsZXQgZGF0YV90ZW1wO1xuICAgIGxldCBub2RlOyAvLyDorrDlvZXpgY3ljobliLDnmoTlm77lsYJcbiAgICBsZXQgbGVuID0gbm9kZV9saXN0Lmxlbmd0aDtcbiAgICBsZXQgbXlfcHJvZ3Jlc3MgPSAwOyAvLyDov5vluqbkv6Hmga9cbiAgICAvLyDlv73nlaXlpKflsI/lhplcbiAgICBrZXl3b3JkID0ga2V5d29yZC50b0xvd2VyQ2FzZSgpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdrZXl3b3JkOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKGtleXdvcmQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBteV9wcm9ncmVzcysrO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ2RvbmUnOiBmYWxzZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbm9kZV9saXN0Lmxlbmd0aCB9IH0pO1xuICAgICAgICAgICAgbm9kZSA9IG5vZGVfbGlzdFtpXTtcbiAgICAgICAgICAgIGxldCBub2RlX2NoYXJhY3RlcnMgPSBub2RlWydjaGFyYWN0ZXJzJ10udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmIChub2RlX2NoYXJhY3RlcnMuaW5kZXhPZihrZXl3b3JkKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8g5om+5Yiw5YWz6ZSu6K+NKOW/veeVpeWkp+Wwj+WGmSlcbiAgICAgICAgICAgICAgICAvLyDliKTmlq3npZblhYjlm77lsYLnmoTnirbmgIHvvIzljIXmi6zpmpDol4/jgIHplIHlrprjgIHnu4Tku7bjgIHlrp7kvovlsZ7mgKdcbiAgICAgICAgICAgICAgICBsZXQgdGhpc19wYXJlbnQ7XG4gICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzTG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IGFuY2VzdG9yX3R5cGUgPSAnJzsgLy8g57uE5Lu2L+WunuS+iy/lhbbku5ZcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5sb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChub2RlLnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/plIHlrprmiJbpmpDol4/nirbmgIFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluelluWFiOWFg+e0oOeahOeKtuaAgVxuICAgICAgICAgICAgICAgICAgICB0aGlzX3BhcmVudCA9IG5vZGUucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpc19wYXJlbnQudHlwZSAhPSAnUEFHRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC5sb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQudHlwZSA9PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX3R5cGUgPSAnQ09NUE9ORU5UJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzX3BhcmVudC50eXBlID09ICdJTlNUQU5DRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl90eXBlID0gJ0lOU1RBTkNFJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlIHx8IGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpICYmIGFuY2VzdG9yX3R5cGUgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gdGhpc19wYXJlbnQucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOWNleS4quWbvuWxgueahOaVsOaNru+8jOWtmOWCqOWIsCB0YXJnZXRfVGV4dF9Ob2RlIOS4re+8jOaLpeacieWQjue7reeahOabv+aNouW3peS9nFxuICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUucHVzaCh7ICdub2RlJzogbm9kZSwgJ2FuY2VzdG9yX2lzVmlzaWJsZSc6IGFuY2VzdG9yX2lzVmlzaWJsZSwgJ2FuY2VzdG9yX2lzTG9ja2VkJzogYW5jZXN0b3JfaXNMb2NrZWQsICdhbmNlc3Rvcl90eXBlJzogYW5jZXN0b3JfdHlwZSB9KTtcbiAgICAgICAgICAgICAgICAvLyDmnoTlu7rmlbDmja7vvIzkvKDpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGtleXdvcmRfbGVuZ3RoID0ga2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g55Sx5LqO5Y2V5LiqIFRFWFQg5Zu+5bGC5YaF5Y+v6IO95a2Y5Zyo5aSa5Liq56ym5ZCI5p2h5Lu255qE5a2X56ym77yM5omA5Lul6ZyA6KaB5b6q546v5p+l5om+XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gbm9kZV9jaGFyYWN0ZXJzLmluZGV4T2Yoa2V5d29yZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5p+l5om+55qE5a2X56ym6LW35aeL44CB57uI5q2i5L2N572u5Y+R6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmr4/kuKrlhbPplK7lrZfnmoTmlbDmja5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFfdGVtcCA9IHsgJ2lkJzogbm9kZS5pZCwgJ2NoYXJhY3RlcnMnOiBub2RlLmNoYXJhY3RlcnMsICdzdGFydCc6IGluZGV4LCAnZW5kJzogaW5kZXggKyBrZXl3b3JkLmxlbmd0aCwgJ2hhc01pc3NpbmdGb250Jzogbm9kZS5oYXNNaXNzaW5nRm9udCwgJ2FuY2VzdG9yX3R5cGUnOiBhbmNlc3Rvcl90eXBlIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxX2NvdXQgPCAyMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWmguaenOW3sue7j+acieaQnOe0oue7k+aenO+8jOWImeWFiOWPkemAgeS4gOmDqOWIhuaYvuekuuWcqCBVSSDkuK3vvIzmj5DljYfmkJzntKLliqDovb3nirbmgIHnmoTkvZPpqoxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZG9uZSc6IGZhbHNlLCAnbXlfcHJvZ3Jlc3MnOiB7ICdpbmRleCc6IG15X3Byb2dyZXNzLCAndG90YWwnOiBsZW4gfSwgJ3RhcmdldF9UZXh0X05vZGUnOiBbZGF0YV90ZW1wXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFfaXRlbV9saXN0LnB1c2goZGF0YV90ZW1wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOe7n+iuoeaQnOe0oue7k+aenOaVsOmHj1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxX2NvdXQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiuvue9ruafpeaJvuebruagh+Wtl+espuS4sueahOWBj+enu1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBpbmRleCArIGtleXdvcmRfbGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9IC8vIGlmXG4gICAgICAgICAgICAgICAgfSAvLyB3aGlsZVxuICAgICAgICAgICAgfSAvLyBpZiAobm9kZVsnY2hhcmFjdGVycyddLmluZGV4T2Yoa2V5d29yZCkgPiAtMSlcbiAgICAgICAgfSwgMTApOyAvLyBzZXRUaW1lb3V0XG4gICAgfVxuICAgIHJldHVybiBkYXRhX2l0ZW1fbGlzdDtcbn1cbi8vIOabv+aNolxuZnVuY3Rpb24gcmVwbGFjZShkYXRhKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3JlcGxhY2UnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICAvLyDlpoLmnpzooqvmm7/mjaLnmoTlrZfnrKbmmK8gJycg5YiZ5Lya6Zm35YWl5q275b6q546v77yM5omA5Lul6KaB5Yik5pat5LiA5LiLXG4gICAgICAgIGlmIChkYXRhLmRhdGEua2V5d29yZCA9PSAnJykge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KCdQbGVhc2UgZW50ZXIgdGhlIGNoYXJhY3RlcnMgeW91IHdhbnQgdG8gcmVwbGFjZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG15TG9hZEZvbnRBc3luYyh0YXJnZXRfVGV4dF9Ob2RlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGhhc01pc3NpbmdGb250Q291bnQgPSAwO1xuICAgICAgICAgICAgbGV0IGxlbiA9IHRhcmdldF9UZXh0X05vZGUubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IG15X3Byb2dyZXNzID0gMDsgLy8g6L+b5bqm5L+h5oGvXG4gICAgICAgICAgICBsZXQga2V5d29yZCA9IGRhdGEuZGF0YS5rZXl3b3JkLnRvTG93ZXJDYXNlKCk7IC8vIOWFs+mUruWtl1xuICAgICAgICAgICAgbGV0IG5ld0NoYXJhY3RlcnMgPSBkYXRhLmRhdGEucmVwbGFjZV93b3JkOyAvLyDpnIDopoHmm7/mjaLmiJDku6XkuIvlrZfnrKZcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBsZW47IGktLTspIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBteV9wcm9ncmVzcysrO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXlfcHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2RvbmUnOiBmYWxzZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbGVufSwnaGFzTWlzc2luZ0ZvbnRDb3VudCc6aGFzTWlzc2luZ0ZvbnRDb3VudCAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnYW5jZXN0b3JfaXNWaXNpYmxlJ10gPT0gZmFsc2UgfHwgdGFyZ2V0X1RleHRfTm9kZVtpXVsnYW5jZXN0b3JfaXNMb2NrZWQnXSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5b+955Wl6ZqQ6JeP44CB6ZSB5a6a55qE5Zu+5bGCXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ11bJ2ZvbnROYW1lJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlrZfkvZPkuI3mlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2hhc01pc3NpbmdGb250Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGhhc01pc3NpbmdGb250Q291bnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNNaXNzaW5nRm9udENvdW50ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dFN0eWxlID0gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmdldFN0eWxlZFRleHRTZWdtZW50cyhbJ2luZGVudGF0aW9uJywgJ2xpc3RPcHRpb25zJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndGV4dFN0eWxlOicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXh0U3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0U3RhcnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0RW5kID0gMDsgLy8g6K6w5b2V5L+u5pS55a2X56ym5ZCO55qE57Si5byV5YGP56e75pWw5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHlsZVRlbXAgPSBbXTsgLy8g6K6w5b2V5q+P5Liq5q616JC95qC35byP5Zyo5L+u5pS55ZCO55qE5qC35byP57Si5byV77yI5Zyo5pu/5o2i5a6M5a2X56ym5ZCO6ZyA6KaB6K6+572u5Zue5LmL5YmN55qE5qC35byP77yJXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsYXN0X29mZnNldEVuZCA9IDA7IC8vIOiusOW9leS4iuS4gOS4quauteiQveeahOacq+Wwvue0ouW8lVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmm7/mjaLnm67moIflrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDnlLHkuo7ljZXkuKrmrrXokL3lhoXlj6/og73lrZjlnKjlpJrkuKrnrKblkIjmnaHku7bnmoTlrZfnrKbvvIzmiYDku6XpnIDopoHlvqrnjq/mn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6I635Y+W5Yy56YWN5Yiw55qE5a2X56ym55qE57Si5byVXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBlbGVtZW50LmNoYXJhY3RlcnMudG9Mb3dlckNhc2UoKS5pbmRleE9mKGtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmnInljLnphY3nmoTlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5paw5a2X56ym6ZyA6KaB5o+S5YWl55qE5L2N572uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnNlcnRTdGFydCA9IGluZGV4ICsga2V5d29yZC5sZW5ndGggKyBlbGVtZW50WydzdGFydCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5zZXJ0U3RhcnQ6JyArIGluc2VydFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlnKjntKLlvJXlkI7mj5LlhaXmlrDlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmluc2VydENoYXJhY3RlcnMoaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQsIG5ld0NoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7ntKLlvJXliKDpmaTml6flrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmRlbGV0ZUNoYXJhY3RlcnMoaW5kZXggKyBlbGVtZW50WydzdGFydCddICsgb2Zmc2V0RW5kLCBpbnNlcnRTdGFydCArIG9mZnNldEVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvZmZzZXRTdGFydCA9IGxhc3Rfb2Zmc2V0RW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldEVuZCArPSBuZXdDaGFyYWN0ZXJzLmxlbmd0aCAtIGtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2hpbGUgb2Zmc2V0U3RhcnQ6JyArIG9mZnNldFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2hpbGUgb2Zmc2V0RW5kOicgKyBvZmZzZXRFbmQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leajgOe0ouWIsOebruagh+Wtl+espueahOe0ouW8le+8jOS4i+S4gOasoSB3aGlsZSDlvqrnjq/lnKjmraTkvY3nva7lkI7lvIDlp4vmn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBpbmRleCArIGtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rKh5pyJ5Yy56YWN55qE5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyB3aGlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5Y2V5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP6K6w5b2V5Yiw5pWw57uE5YaFXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVRlbXAucHVzaCh7ICdzdGFydCc6IGxhc3Rfb2Zmc2V0RW5kLCAnZW5kJzogZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsICdpbmRlbnRhdGlvbic6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gPiAwID8gZWxlbWVudFsnaW5kZW50YXRpb24nXSA6IDAsICdsaXN0T3B0aW9ucyc6IGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X29mZnNldEVuZCA9IGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8g6K6+572u57yp6L+bXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uc2V0UmFuZ2VJbmRlbnRhdGlvbihlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnQsIGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCBlbGVtZW50WydpbmRlbnRhdGlvbiddID4gMCA/IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gLSAxIDogZWxlbWVudFsnaW5kZW50YXRpb24nXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOiuvue9ruW6j+WPt1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlTGlzdE9wdGlvbnMoZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0LCBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7IC8vIHRleHRTdHlsZS5mb3JFYWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiuvue9rue8qei/m+OAgeW6j+WPt1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZVRlbXAg6K6w5b2V5LqG5q+P5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP77yM6YGN5Y6G5pWw57uE5L2/5b6X5L+u5pS55a2X56ym5ZCO55qE5paH5pys5Zu+5bGC5qC35byP5LiN5Y+YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlVGVtcC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5paH5pys5Li656m677yM5YiZ5LiN5pSv5oyB6K6+572u5qC35byP77yI5Lya5oql6ZSZ77yJXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmNoYXJhY3RlcnMgIT0gJycgJiYgZWxlbWVudFsnZW5kJ10gPiBlbGVtZW50WydzdGFydCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uc2V0UmFuZ2VMaXN0T3B0aW9ucyhlbGVtZW50WydzdGFydCddLCBlbGVtZW50WydlbmQnXSwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlSW5kZW50YXRpb24oZWxlbWVudFsnc3RhcnQnXSwgZWxlbWVudFsnZW5kJ10sIGVsZW1lbnRbJ2luZGVudGF0aW9uJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2RvbmUnOiBmYWxzZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbGVuIH0sICdoYXNNaXNzaW5nRm9udENvdW50JzogaGFzTWlzc2luZ0ZvbnRDb3VudCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmVzb2x2ZSgnMScpXG4gICAgfSk7XG59IC8vIGFzeW5jIGZ1bmN0aW9uIHJlcGxhY2Vcbi8vIEZpZ21hIOWbvuWxgumAieaLqeWPmOWMluaXtu+8jOmAmuefpSBVSSDmmL7npLrkuI3lkIznmoTmj5DnpLpcbmZ1bmN0aW9uIG9uU2VsZWN0aW9uQ2hhbmdlKCkge1xuICAgIHZhciBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiB0cnVlIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogZmFsc2UgfSk7XG4gICAgfVxufVxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9jb2RlLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=