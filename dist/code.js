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
    // UI 中进行搜索设置
    if (msg.type === 'handle_seting_click') {
        seting_Aa = msg['data']['data']['checked'];
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
    if (seting_Aa != true) {
        keyword = keyword.toLowerCase();
    }
    // console.log('keyword:');
    // console.log(keyword);
    for (let i = 0; i < len; i++) {
        setTimeout(() => {
            my_progress++;
            figma.ui.postMessage({ 'type': 'find', 'done': false, 'my_progress': { 'index': my_progress, 'total': node_list.length } });
            node = node_list[i];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QThDO0FBQ3BMLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0wsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isb0RBQW9EO0FBQ25GO0FBQ0E7QUFDQSwrQkFBK0IscURBQXFEO0FBQ3BGO0FBQ0E7Ozs7Ozs7O1VFNVpBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AZmlnbWEvcGx1Z2luLXR5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5sZXQgdGFyZ2V0X1RleHRfTm9kZSA9IFtdOyAvLyDlrZjlgqjnrKblkIjmkJzntKLmnaHku7bnmoQgVEVYVCDlm77lsYJcbmxldCBsb2FkZWRfZm9udHMgPSBbXTsgLy8g5bey5Yqg6L2955qE5a2X5L2T5YiX6KGoXG5sZXQgZmlsZVR5cGUgPSBmaWdtYS5lZGl0b3JUeXBlOyAvLyDlvZPliY0gZmlnbWEg5paH5Lu257G75Z6L77yaZmlnbWEvZmlnamFtXG5sZXQgaGFzTWlzc2luZ0ZvbnRDb3VudCA9IDA7IC8vIOabv+aNouaXtuiusOW9leS4jeaUr+aMgeWtl+S9k+eahOaVsOmHj1xubGV0IHNldGluZ19BYSA9IGZhbHNlOyAvLyDmmK/lkKbljLrliIblpKflsI/lhplcbmxldCByZXFfY291dCA9IDA7IC8vIOaQnOe0oue7k+aenOaVsOmHj1xubGV0IG5vZGVfbGlzdCA9IFtdOyAvLyDlrZjlgqjmiYDmnIkgVEVYVCDlm77lsYJcbmNvbnNvbGUubG9nKCcyMDIyLTAzLTIzJyk7XG4vLyDlkK/liqjmj5Lku7bml7bmmL7npLogVUlcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzAwLCBoZWlnaHQ6IDQwMCB9KTtcbi8vIOiOt+WPluaYr+WQpumAieS4reWbvuWxglxub25TZWxlY3Rpb25DaGFuZ2UoKTtcbi8vIOe7keWumiBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbkuovku7ZcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsICgpID0+IHsgb25TZWxlY3Rpb25DaGFuZ2UoKTsgfSk7XG4vLyBVSSDlj5HmnaXmtojmga9cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgLy8gVUkg5Lit54K55Ye75LqG44CM5pCc57Si44CN5oyJ6ZKuXG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VhcmNoJykge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoJyk7XG4gICAgICAgIC8vIOiusOW9lei/kOihjOaXtumVv1xuICAgICAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgbGV0IGZpbmRfc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgLy8g5omn6KGM5pCc57SiXG4gICAgICAgIGZpbmQobXNnLmRhdGEpO1xuICAgICAgICBsZXQgZG9uZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBjb25zb2xlLmxvZygn44CL44CL44CL44CL44CL44CL44CL44CL44CL44CLZmluZDonICsgKGRvbmUgLSBmaW5kX3N0YXJ0KS50b1N0cmluZygpKTtcbiAgICAgICAgbGV0IHRvSFRNTDsgLy8g5a2Y5YKo6KaB5Y+R57uZIHVpLnRzeCDnmoTmlbDmja5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmluZEtleVdvcmRfc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIC8vIOWcqOaWh+acrOWbvuWxguS4reWMuemFjeWMheWQq+WFs+mUruWtl+eahOWbvuWxglxuICAgICAgICAgICAgdG9IVE1MID0gZmluZEtleVdvcmQobm9kZV9saXN0LCBtc2cuZGF0YS5rZXl3b3JkKTtcbiAgICAgICAgICAgIGxldCBmaW5kS2V5V29yZF9lbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgIvjgItmaW5kS2V5V29yZDonICsgKGZpbmRLZXlXb3JkX2VuZCAtIGZpbmRLZXlXb3JkX3N0YXJ0KS50b1N0cmluZygpKTtcbiAgICAgICAgfSwgMjApO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIOWwhuaQnOe0ouaVsOaNruWPkemAgee7mSB1aS50c3hcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZG9uZSc6IHRydWUsICd0YXJnZXRfVGV4dF9Ob2RlJzogdG9IVE1MIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGaW5kIGVuZCxjb3VudDonKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXFfY291dCk7XG4gICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdkb25lJyB9KVxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn44CL44CL44CL44CL44CL44CL44CL44CL44CL44CLJyArIG1zZy5kYXRhLmtleXdvcmQgKyAnOicgKyAoZW5kIC0gc3RhcnQpLnRvU3RyaW5nKCkgKyAnIGNvdW50OicgKyByZXFfY291dC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBpZiAocmVxX2NvdXQgPiAzMCkge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5yZXNpemUoMzAwLCA1NDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDMwKTtcbiAgICAgICAgfSwgNDApO1xuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vmkJzntKLnu5PmnpzpoblcbiAgICBpZiAobXNnLnR5cGUgPT09ICdsaXN0T25DbGlrJykge1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZvckVhY2g6Jyk7XG4gICAgICAgIC8vIOmBjeWOhuaQnOe0oue7k+aenFxuICAgICAgICBsZXQgbGVuID0gdGFyZ2V0X1RleHRfTm9kZS5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaWQgPT0gbXNnLmRhdGFbJ2l0ZW0nXSkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWIsOeUqOaIt+eCueWHu+eahOWbvuWxglxuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUgPT09IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXTtcbiAgICAgICAgICAgICAgICAvLyBGaWdtYSDop4blm77lrprkvY3liLDlr7nlupTlm77lsYJcbiAgICAgICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW3RhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXV0pO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOmAieS4reWvueW6lOaWh+acrFxuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGVkVGV4dFJhbmdlID0geyAnbm9kZSc6IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXSwgJ3N0YXJ0JzogbXNnLmRhdGFbJ3N0YXJ0J10sICdlbmQnOiBtc2cuZGF0YVsnZW5kJ10gfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vkuobjgIzmm7/mjaLjgI3mjInpkq5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXBsYWNlJykge1xuICAgICAgICBjb25zb2xlLmxvZygnY29kZS50cyByZXBsYWNlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIC8vIOaJp+ihjOabv+aNolxuICAgICAgICByZXBsYWNlKG1zZykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29kZS50cyByZXBsYWNlIGRvbmUnKTtcbiAgICAgICAgICAgICAgICAvLyDmm7/mjaLlrozmr5XvvIzpgJrnn6UgVUkg5pu05pawXG4gICAgICAgICAgICAgICAgLy8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2RvbmUnOiB0cnVlLCAnaGFzTWlzc2luZ0ZvbnRDb3VudCc6IGhhc01pc3NpbmdGb250Q291bnQgfSk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coJ2NvZGUudHMgcmVwbGFjZSBkb25lJyk7XG4gICAgICAgIC8vICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICAvLyAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAncmVwbGFjZScsICdkb25lJzogdHJ1ZSwgJ2hhc01pc3NpbmdGb250Q291bnQnOiBoYXNNaXNzaW5nRm9udENvdW50IH0pO1xuICAgICAgICAvLyB9LCAzMCk7XG4gICAgfVxuICAgIC8vIFVJIOS4rei/m+ihjOaQnOe0ouiuvue9rlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2hhbmRsZV9zZXRpbmdfY2xpY2snKSB7XG4gICAgICAgIHNldGluZ19BYSA9IG1zZ1snZGF0YSddWydkYXRhJ11bJ2NoZWNrZWQnXTtcbiAgICB9XG59O1xuLy8g5Yqg6L295a2X5L2TXG5mdW5jdGlvbiBteUxvYWRGb250QXN5bmModGV4dF9sYXllcl9MaXN0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ215TG9hZEZvbnRBc3luYzonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGV4dF9sYXllcl9MaXN0KTtcbiAgICAgICAgZm9yIChsZXQgbGF5ZXIgb2YgdGV4dF9sYXllcl9MaXN0KSB7XG4gICAgICAgICAgICBpZiAobGF5ZXJbJ25vZGUnXVsnY2hhcmFjdGVycyddLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLScpO1xuICAgICAgICAgICAgLy8g5Yqg6L295a2X5L2TXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsYXllcik7XG4gICAgICAgICAgICBsZXQgZm9udHMgPSBsYXllclsnbm9kZSddLmdldFJhbmdlQWxsRm9udE5hbWVzKDAsIGxheWVyWydub2RlJ11bJ2NoYXJhY3RlcnMnXS5sZW5ndGgpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZvbnRzOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZm9udHMpO1xuICAgICAgICAgICAgZm9yIChsZXQgZm9udCBvZiBmb250cykge1xuICAgICAgICAgICAgICAgIGxldCBiaW5nbyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGxvYWRlZF9mb250IG9mIGxvYWRlZF9mb250cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkX2ZvbnRbJ2ZhbWlseSddID09IGZvbnRbJ2ZhbWlseSddICYmIGxvYWRlZF9mb250WydzdHlsZSddID09IGZvbnRbJ3N0eWxlJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJpbmdvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGJpbmdvKTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZ28pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDlrZfkvZPmmK/lkKbmlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxheWVyWydub2RlJ10uaGFzTWlzc2luZ0ZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOS4jeaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hhc01pc3NpbmdGb250Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmlK/mjIFcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZF9mb250cy5wdXNoKGZvbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2xvYWRGb250QXN5bmMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2cobXlGb250KTtcbiAgICAgICAgLy8gYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyhteUZvbnQpXG4gICAgICAgIHJldHVybiAnZG9uZSc7XG4gICAgfSk7XG59XG4vLyDmib7lh7rmiYDmnInmlofmnKzlm77lsYJcbmZ1bmN0aW9uIGZpbmQoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdjb25kZS50czpmaW5kOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAvLyDmuIXnqbrljoblj7LmkJzntKLmlbDmja7vvIzph43mlrDmkJzntKJcbiAgICB0YXJnZXRfVGV4dF9Ob2RlID0gW107XG4gICAgLy8g5b2T5YmN6YCJ5Lit55qE5Zu+5bGCXG4gICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8g5b2T5YmN5pyJ6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo6YCJ5Lit55qE5Zu+5bGC5Lit5pCc57SiXG4gICAgICAgIC8vIOWcqOW9k+WJjemAieS4reeahOWbvuWxguS4re+8jOaQnOe0ouaWh+acrOWbvuWxglxuICAgIH1cbiAgICBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo5omA5pyJIFRFWFQg5Zu+5bGCXG4gICAgLy8gbGV0IGNoaWxkcmVuX2xpc3QgPSBbXSAgICAvLyDmi4bliIblm77lsYLvvIzpgJDkuKrmkJzntKLvvIzpgb/lhY3nlYzpnaLplb/ml7bpl7TmjILotbdcbiAgICBsZXQgbGVuID0gc2VsZWN0aW9uLmxlbmd0aDtcbiAgICAvLyDpgY3ljobojIPlm7TlhoXnmoTlm77lsYLvvIzojrflj5YgVEVYVCDlm77lsYJcbiAgICAvL0B0cy1pZ25vcmVcbiAgICBmaWdtYS5za2lwSW52aXNpYmxlSW5zdGFuY2VDaGlsZHJlbiA9IHRydWU7IC8vIOW/veeVpemakOiXj+eahOWbvuWxglxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlm77lsYLmnKzouqvlsLHmmK/mlofmnKzlm77lsYJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICBub2RlX2xpc3QucHVzaChzZWxlY3Rpb25baV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5LiL5rKh5pyJ5a2Q5Zu+5bGCXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbltpXS5jaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOiOt+WPluaWh+acrOWbvuWxglxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAgICAgbm9kZV9saXN0ID0gbm9kZV9saXN0LmNvbmNhdChzZWxlY3Rpb25baV0uZmluZEFsbFdpdGhDcml0ZXJpYSh7IHR5cGVzOiBbJ1RFWFQnXSB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMCk7XG4gICAgfVxuICAgIHJldHVybiBub2RlX2xpc3Q7XG59XG4vLyDmkJzntKLvvJrlnKjmlofmnKzlm77lsYLkuK3vvIzljLnphY3lhbPplK7lrZdcbmZ1bmN0aW9uIGZpbmRLZXlXb3JkKG5vZGVfbGlzdCwga2V5d29yZCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdmdW5jIGZpbmRLZXlXb3JkIGJlZ2luJyk7XG4gICAgcmVxX2NvdXQgPSAwOyAvLyDmkJzntKLnu5PmnpzmlbDph49cbiAgICBsZXQgZGF0YV9pdGVtX2xpc3QgPSBbXTtcbiAgICBsZXQgZGF0YV90ZW1wO1xuICAgIGxldCBub2RlOyAvLyDorrDlvZXpgY3ljobliLDnmoTlm77lsYJcbiAgICBsZXQgbGVuID0gbm9kZV9saXN0Lmxlbmd0aDtcbiAgICBsZXQgbXlfcHJvZ3Jlc3MgPSAwOyAvLyDov5vluqbkv6Hmga9cbiAgICAvLyDlv73nlaXlpKflsI/lhplcbiAgICBpZiAoc2V0aW5nX0FhICE9IHRydWUpIHtcbiAgICAgICAga2V5d29yZCA9IGtleXdvcmQudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2coJ2tleXdvcmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2coa2V5d29yZCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIG15X3Byb2dyZXNzKys7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAnZG9uZSc6IGZhbHNlLCAnbXlfcHJvZ3Jlc3MnOiB7ICdpbmRleCc6IG15X3Byb2dyZXNzLCAndG90YWwnOiBub2RlX2xpc3QubGVuZ3RoIH0gfSk7XG4gICAgICAgICAgICBub2RlID0gbm9kZV9saXN0W2ldO1xuICAgICAgICAgICAgbGV0IG5vZGVfY2hhcmFjdGVycztcbiAgICAgICAgICAgIC8vIOW/veeVpeWkp+Wwj+WGmVxuICAgICAgICAgICAgaWYgKHNldGluZ19BYSAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgbm9kZV9jaGFyYWN0ZXJzID0gbm9kZVsnY2hhcmFjdGVycyddLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBub2RlX2NoYXJhY3RlcnMgPSBub2RlWydjaGFyYWN0ZXJzJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZV9jaGFyYWN0ZXJzLmluZGV4T2Yoa2V5d29yZCkgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWIsOWFs+mUruivjSjlv73nlaXlpKflsI/lhpkpXG4gICAgICAgICAgICAgICAgLy8g5Yik5pat56WW5YWI5Zu+5bGC55qE54q25oCB77yM5YyF5ous6ZqQ6JeP44CB6ZSB5a6a44CB57uE5Lu244CB5a6e5L6L5bGe5oCnXG4gICAgICAgICAgICAgICAgbGV0IHRoaXNfcGFyZW50O1xuICAgICAgICAgICAgICAgIGxldCBhbmNlc3Rvcl9pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGxldCBhbmNlc3Rvcl9pc0xvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCBhbmNlc3Rvcl90eXBlID0gJyc7IC8vIOe7hOS7ti/lrp7kvosv5YW25LuWXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNMb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobm9kZS52aXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlIHx8IGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5Zu+5bGC5pys6Lqr5bCx5piv6ZSB5a6a5oiW6ZqQ6JeP54q25oCBXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bnpZblhYjlhYPntKDnmoTnirbmgIFcbiAgICAgICAgICAgICAgICAgICAgdGhpc19wYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXNfcGFyZW50LnR5cGUgIT0gJ1BBR0UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQubG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNfcGFyZW50LnR5cGUgPT0gJ0NPTVBPTkVOVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmNlc3Rvcl90eXBlID0gJ0NPTVBPTkVOVCc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQudHlwZSA9PSAnSU5TVEFOQ0UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfdHlwZSA9ICdJTlNUQU5DRSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSB8fCBhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSAmJiBhbmNlc3Rvcl90eXBlICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzX3BhcmVudCA9IHRoaXNfcGFyZW50LnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDljZXkuKrlm77lsYLnmoTmlbDmja7vvIzlrZjlgqjliLAgdGFyZ2V0X1RleHRfTm9kZSDkuK3vvIzmi6XmnInlkI7nu63nmoTmm7/mjaLlt6XkvZxcbiAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLnB1c2goeyAnbm9kZSc6IG5vZGUsICdhbmNlc3Rvcl9pc1Zpc2libGUnOiBhbmNlc3Rvcl9pc1Zpc2libGUsICdhbmNlc3Rvcl9pc0xvY2tlZCc6IGFuY2VzdG9yX2lzTG9ja2VkLCAnYW5jZXN0b3JfdHlwZSc6IGFuY2VzdG9yX3R5cGUgfSk7XG4gICAgICAgICAgICAgICAgLy8g5p6E5bu65pWw5o2u77yM5Lyg6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIGxldCBrZXl3b3JkX2xlbmd0aCA9IGtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOeUseS6juWNleS4qiBURVhUIOWbvuWxguWGheWPr+iDveWtmOWcqOWkmuS4quespuWQiOadoeS7tueahOWtl+espu+8jOaJgOS7pemcgOimgeW+queOr+afpeaJvlxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IG5vZGVfY2hhcmFjdGVycy5pbmRleE9mKGtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWwhuafpeaJvueahOWtl+espui1t+Wni+OAgee7iOatouS9jee9ruWPkemAgee7mSBVSVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5q+P5Liq5YWz6ZSu5a2X55qE5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhX3RlbXAgPSB7ICdpZCc6IG5vZGUuaWQsICdjaGFyYWN0ZXJzJzogbm9kZS5jaGFyYWN0ZXJzLCAnc3RhcnQnOiBpbmRleCwgJ2VuZCc6IGluZGV4ICsga2V5d29yZC5sZW5ndGgsICdoYXNNaXNzaW5nRm9udCc6IG5vZGUuaGFzTWlzc2luZ0ZvbnQsICdhbmNlc3Rvcl90eXBlJzogYW5jZXN0b3JfdHlwZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcV9jb3V0IDwgMjApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzlt7Lnu4/mnInmkJzntKLnu5PmnpzvvIzliJnlhYjlj5HpgIHkuIDpg6jliIbmmL7npLrlnKggVUkg5Lit77yM5o+Q5Y2H5pCc57Si5Yqg6L2954q25oCB55qE5L2T6aqMXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ2RvbmUnOiBmYWxzZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbGVuIH0sICd0YXJnZXRfVGV4dF9Ob2RlJzogW2RhdGFfdGVtcF0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhX2l0ZW1fbGlzdC5wdXNoKGRhdGFfdGVtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDnu5/orqHmkJzntKLnu5PmnpzmlbDph49cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcV9jb3V0Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7mn6Xmib7nm67moIflrZfnrKbkuLLnmoTlgY/np7tcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBrZXl3b3JkX2xlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfSAvLyBpZlxuICAgICAgICAgICAgICAgIH0gLy8gd2hpbGVcbiAgICAgICAgICAgIH0gLy8gaWYgKG5vZGVbJ2NoYXJhY3RlcnMnXS5pbmRleE9mKGtleXdvcmQpID4gLTEpXG4gICAgICAgIH0sIDEwKTsgLy8gc2V0VGltZW91dFxuICAgIH1cbiAgICByZXR1cm4gZGF0YV9pdGVtX2xpc3Q7XG59XG4vLyDmm7/mjaJcbmZ1bmN0aW9uIHJlcGxhY2UoZGF0YSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgLy8g5aaC5p6c6KKr5pu/5o2i55qE5a2X56ym5pivICcnIOWImeS8mumZt+WFpeatu+W+queOr++8jOaJgOS7peimgeWIpOaWreS4gOS4i1xuICAgICAgICBpZiAoZGF0YS5kYXRhLmtleXdvcmQgPT0gJycpIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeSgnUGxlYXNlIGVudGVyIHRoZSBjaGFyYWN0ZXJzIHlvdSB3YW50IHRvIHJlcGxhY2UnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBteUxvYWRGb250QXN5bmModGFyZ2V0X1RleHRfTm9kZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBoYXNNaXNzaW5nRm9udENvdW50ID0gMDtcbiAgICAgICAgICAgIGxldCBsZW4gPSB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBteV9wcm9ncmVzcyA9IDA7IC8vIOi/m+W6puS/oeaBr1xuICAgICAgICAgICAgbGV0IGtleXdvcmQgPSBkYXRhLmRhdGEua2V5d29yZDsgLy8g5YWz6ZSu5a2XXG4gICAgICAgICAgICBsZXQgbmV3Q2hhcmFjdGVycyA9IGRhdGEuZGF0YS5yZXBsYWNlX3dvcmQ7IC8vIOmcgOimgeabv+aNouaIkOS7peS4i+Wtl+esplxuICAgICAgICAgICAgLy8g5b+955Wl5aSn5bCP5YaZXG4gICAgICAgICAgICBpZiAoc2V0aW5nX0FhICE9IHRydWUpIHtcbiAgICAgICAgICAgICAgICBrZXl3b3JkID0ga2V5d29yZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGxlbjsgaS0tOykge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG15X3Byb2dyZXNzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhteV9wcm9ncmVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnLCAnZG9uZSc6IGZhbHNlLCAnbXlfcHJvZ3Jlc3MnOiB7ICdpbmRleCc6IG15X3Byb2dyZXNzLCAndG90YWwnOiBsZW59LCdoYXNNaXNzaW5nRm9udENvdW50JzpoYXNNaXNzaW5nRm9udENvdW50ICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydhbmNlc3Rvcl9pc1Zpc2libGUnXSA9PSBmYWxzZSB8fCB0YXJnZXRfVGV4dF9Ob2RlW2ldWydhbmNlc3Rvcl9pc0xvY2tlZCddID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlv73nlaXpmpDol4/jgIHplIHlrprnmoTlm77lsYJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXVsnZm9udE5hbWUnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmhhc01pc3NpbmdGb250KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmhhc01pc3NpbmdGb250KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWtl+S9k+S4jeaUr+aMgVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaGFzTWlzc2luZ0ZvbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaGFzTWlzc2luZ0ZvbnRDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc01pc3NpbmdGb250Q291bnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0U3R5bGUgPSB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uZ2V0U3R5bGVkVGV4dFNlZ21lbnRzKFsnaW5kZW50YXRpb24nLCAnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0ZXh0U3R5bGU6Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRleHRTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRTdGFydCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRFbmQgPSAwOyAvLyDorrDlvZXkv67mlLnlrZfnrKblkI7nmoTntKLlvJXlgY/np7vmlbDlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlVGVtcCA9IFtdOyAvLyDorrDlvZXmr4/kuKrmrrXokL3moLflvI/lnKjkv67mlLnlkI7nmoTmoLflvI/ntKLlvJXvvIjlnKjmm7/mjaLlrozlrZfnrKblkI7pnIDopoHorr7nva7lm57kuYvliY3nmoTmoLflvI/vvIlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3Rfb2Zmc2V0RW5kID0gMDsgLy8g6K6w5b2V5LiK5LiA5Liq5q616JC955qE5pyr5bC+57Si5byVXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOabv+aNouebruagh+Wtl+esplxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGUuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbGVtZW50X2NoYXJhY3RlcnMgPSBlbGVtZW50LmNoYXJhY3RlcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0aW5nX0FhICE9IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50X2NoYXJhY3RlcnMgPSBlbGVtZW50X2NoYXJhY3RlcnMudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOeUseS6juWNleS4quauteiQveWGheWPr+iDveWtmOWcqOWkmuS4quespuWQiOadoeS7tueahOWtl+espu+8jOaJgOS7pemcgOimgeW+queOr+afpeaJvlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDojrflj5bljLnphY3liLDnmoTlrZfnrKbnmoTntKLlvJVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGVsZW1lbnRfY2hhcmFjdGVycy5pbmRleE9mKGtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmnInljLnphY3nmoTlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6K6w5b2V5paw5a2X56ym6ZyA6KaB5o+S5YWl55qE5L2N572uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbnNlcnRTdGFydCA9IGluZGV4ICsga2V5d29yZC5sZW5ndGggKyBlbGVtZW50WydzdGFydCddO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW5zZXJ0U3RhcnQ6JyArIGluc2VydFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDlnKjntKLlvJXlkI7mj5LlhaXmlrDlrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmluc2VydENoYXJhY3RlcnMoaW5zZXJ0U3RhcnQgKyBvZmZzZXRFbmQsIG5ld0NoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmoLnmja7ntKLlvJXliKDpmaTml6flrZfnrKZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmRlbGV0ZUNoYXJhY3RlcnMoaW5kZXggKyBlbGVtZW50WydzdGFydCddICsgb2Zmc2V0RW5kLCBpbnNlcnRTdGFydCArIG9mZnNldEVuZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leWBj+enu+aVsOWAvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvZmZzZXRTdGFydCA9IGxhc3Rfb2Zmc2V0RW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldEVuZCArPSBuZXdDaGFyYWN0ZXJzLmxlbmd0aCAtIGtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2hpbGUgb2Zmc2V0U3RhcnQ6JyArIG9mZnNldFN0YXJ0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnd2hpbGUgb2Zmc2V0RW5kOicgKyBvZmZzZXRFbmQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiusOW9leajgOe0ouWIsOebruagh+Wtl+espueahOe0ouW8le+8jOS4i+S4gOasoSB3aGlsZSDlvqrnjq/lnKjmraTkvY3nva7lkI7lvIDlp4vmn6Xmib5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBpbmRleCArIGtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rKh5pyJ5Yy56YWN55qE5a2X56ymXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyB3aGlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5Y2V5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP6K6w5b2V5Yiw5pWw57uE5YaFXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZVRlbXAucHVzaCh7ICdzdGFydCc6IGxhc3Rfb2Zmc2V0RW5kLCAnZW5kJzogZWxlbWVudFsnZW5kJ10gKyBvZmZzZXRFbmQsICdpbmRlbnRhdGlvbic6IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gPiAwID8gZWxlbWVudFsnaW5kZW50YXRpb24nXSA6IDAsICdsaXN0T3B0aW9ucyc6IGVsZW1lbnRbJ2xpc3RPcHRpb25zJ10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X29mZnNldEVuZCA9IGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy8g6K6+572u57yp6L+bXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uc2V0UmFuZ2VJbmRlbnRhdGlvbihlbGVtZW50WydzdGFydCddICsgb2Zmc2V0U3RhcnQsIGVsZW1lbnRbJ2VuZCddICsgb2Zmc2V0RW5kLCBlbGVtZW50WydpbmRlbnRhdGlvbiddID4gMCA/IGVsZW1lbnRbJ2luZGVudGF0aW9uJ10gLSAxIDogZWxlbWVudFsnaW5kZW50YXRpb24nXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8vIOiuvue9ruW6j+WPt1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlTGlzdE9wdGlvbnMoZWxlbWVudFsnc3RhcnQnXSArIG9mZnNldFN0YXJ0LCBlbGVtZW50WydlbmQnXSArIG9mZnNldEVuZCwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7IC8vIHRleHRTdHlsZS5mb3JFYWNoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiuvue9rue8qei/m+OAgeW6j+WPt1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZVRlbXAg6K6w5b2V5LqG5q+P5Liq5q616JC955qE57yp6L+b44CB5bqP5Y+35qC35byP77yM6YGN5Y6G5pWw57uE5L2/5b6X5L+u5pS55a2X56ym5ZCO55qE5paH5pys5Zu+5bGC5qC35byP5LiN5Y+YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlVGVtcC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c5paH5pys5Li656m677yM5YiZ5LiN5pSv5oyB6K6+572u5qC35byP77yI5Lya5oql6ZSZ77yJXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLmNoYXJhY3RlcnMgIT0gJycgJiYgZWxlbWVudFsnZW5kJ10gPiBlbGVtZW50WydzdGFydCddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uc2V0UmFuZ2VMaXN0T3B0aW9ucyhlbGVtZW50WydzdGFydCddLCBlbGVtZW50WydlbmQnXSwgZWxlbWVudFsnbGlzdE9wdGlvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZVtpXVsnbm9kZSddLnNldFJhbmdlSW5kZW50YXRpb24oZWxlbWVudFsnc3RhcnQnXSwgZWxlbWVudFsnZW5kJ10sIGVsZW1lbnRbJ2luZGVudGF0aW9uJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJywgJ2RvbmUnOiBmYWxzZSwgJ215X3Byb2dyZXNzJzogeyAnaW5kZXgnOiBteV9wcm9ncmVzcywgJ3RvdGFsJzogbGVuIH0sICdoYXNNaXNzaW5nRm9udENvdW50JzogaGFzTWlzc2luZ0ZvbnRDb3VudCB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmVzb2x2ZSgnMScpXG4gICAgfSk7XG59IC8vIGFzeW5jIGZ1bmN0aW9uIHJlcGxhY2Vcbi8vIEZpZ21hIOWbvuWxgumAieaLqeWPmOWMluaXtu+8jOmAmuefpSBVSSDmmL7npLrkuI3lkIznmoTmj5DnpLpcbmZ1bmN0aW9uIG9uU2VsZWN0aW9uQ2hhbmdlKCkge1xuICAgIHZhciBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiB0cnVlIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogZmFsc2UgfSk7XG4gICAgfVxufVxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9jb2RlLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=