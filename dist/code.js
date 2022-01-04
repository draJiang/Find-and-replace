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
let target_Text_Node = [];
figma.showUI(__html__, { width: 300, height: 340 });
// console.log('hello2')
onSelectionChange();
figma.on("selectionchange", () => { onSelectionChange(); });
figma.ui.onmessage = msg => {
    if (msg.type === 'search') {
        figma.ui.postMessage({ 'type': 'find_loading' });
        console.log('search');
        console.log(msg);
        find_and_replace(msg.data);
        console.log('search target_Text_Node:');
        console.log(target_Text_Node);
        console.log('console.log(target_Text_Node.length);' + target_Text_Node.length.toString());
        let toUIHTML = [];
        if (target_Text_Node.length >= 0) {
            target_Text_Node.forEach(item => {
                console.log('target_Text_Node.forEach:');
                var position = 0;
                while (true) {
                    var index = item.characters.indexOf(msg.data.keyword, position);
                    console.log('index:');
                    console.log(index);
                    if (index > -1) {
                        toUIHTML.push({ 'id': item.id, 'characters': item.characters, 'start': index, 'end': index + msg.data.keyword.length });
                        position = index + msg.data.keyword.length;
                    }
                    else {
                        break;
                    }
                }
            });
            console.log('if :toUIHTML:');
            console.log(toUIHTML);
        }
        figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': toUIHTML });
        // figma.closePlugin()
    }
    if (msg.type === 'listOnClik') {
        console.log('code js:listOnClik:');
        console.log(msg);
        console.log(target_Text_Node);
        console.log(target_Text_Node[0]);
        var targetNode;
        console.log('forEach:');
        for (var i = 0; i < target_Text_Node.length; i++) {
            console.log(target_Text_Node[i].id);
            // console.log(msg.data.item);
            console.log(msg.data['item']);
            if (target_Text_Node[i].id == msg.data['item']) {
                console.log('bingo');
                console.log(target_Text_Node[i]);
                targetNode === target_Text_Node[i];
                figma.viewport.scrollAndZoomIntoView([target_Text_Node[i]]);
                figma.currentPage.selectedTextRange = { 'node': target_Text_Node[i], 'start': msg.data['start'], 'end': msg.data['end'] };
                break;
            }
            console.log('------');
        }
        console.log('targetNode:');
        console.log(targetNode);
        // var text = figma.currentPage.findOne(n => n.id === msg.id)
    }
    if (msg.type === 'replace') {
        console.log('replace');
        console.log(msg);
        replace(msg);
        // const target_Text_Node = find_and_replace(msg.data.keyword)
    }
};
// 查找图层下的文本图层，输入 figma 图层对象，返回找到所有文本图层
function myFindTextAll(node, node_list) {
    var tagetNode;
    console.log('myFindAll');
    // 如果目标图层本身就是
    if (node.type == 'TEXT') {
        node_list.push(node);
        return node_list;
    }
    var thisChildren = node.children;
    //  如果当前节点下存在子节点
    console.log(thisChildren);
    if (thisChildren == undefined) {
        // 当前节点无子节点，可能是形状图层
        return node_list;
    }
    for (var i = 0; i < thisChildren.length; i++) {
        console.log('thisChildren:');
        console.log(thisChildren);
        if (thisChildren == undefined) {
            console.log('!!!ERRO thisChildren==undefined');
            return node_list;
        }
        // 如果节点的类型为 TEXT
        if (thisChildren[i].type == 'TEXT') {
            console.log('return thisChildren[i]:');
            console.log(thisChildren[i]);
            node_list.push(thisChildren[i]);
        }
        else {
            // 如果不是 TEXT 图层
            // 如果包含子图层
            if (thisChildren[i].children != null) {
                if (thisChildren[i].children.length > 0) {
                    console.log('递归');
                    tagetNode = myFindTextAll(thisChildren[i], node_list);
                }
            }
        }
    }
    console.log('node_list:');
    console.log(node_list);
    return node_list;
}
function myLoadFontAsync(myFont) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('myLoadFontAsync:');
        console.log(myFont);
        yield figma.loadFontAsync(myFont);
    });
}
function find_and_replace(data) {
    console.log('conde.ts:find_and_replace:');
    target_Text_Node = [];
    var selection = figma.currentPage.selection;
    var node_list = []; // 存储目标值 —— 选中图层中，所有文本图层
    // 当前未选中图层，则在当前页面搜索
    if (selection.length == 0) {
        selection = figma.currentPage.children;
    }
    else {
        // 当前有选中图层，则在选中的图层中搜索
    }
    console.log('selection:');
    console.log(selection);
    // 在当前选中的图层中，搜索文本图层
    for (var i = 0; i < selection.length; i++) {
        console.log('find_and_replace:for selection');
        // var textNode = myFindTextAll(selection[i])
        console.log(selection[i]);
        node_list = myFindTextAll(selection[i], node_list);
    }
    console.log('Find end:');
    console.log(node_list);
    // 获取所有文本图层的文本，批量关键字，获取符合关键字的图层列表
    // var target_Text_Node =[]
    for (var j = 0; j < node_list.length; j++) {
        if (node_list[j]['characters'].indexOf(data.keyword) > -1) {
            // 找到关键词
            target_Text_Node.push(node_list[j]);
        }
    }
    // figma.loadFontAsync(target_Text_Node[0].fontName)
    console.log('target_Text_Node:');
    console.log(target_Text_Node);
    console.log('target_Text_Node:');
    console.log(target_Text_Node);
    // return target_Text_Node
}
function replace(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('replace');
        console.log(data);
        // var target_Text_Node = []
        // 将符合条件的图层中的指定文本替换成目标值
        // var myfont = target_Text_Node[0].fontName
        // await myLoadFontAsync(myfont)
        // await figma.loadFontAsync(myfont)
        target_Text_Node.forEach((item) => __awaiter(this, void 0, void 0, function* () {
            console.log('target_Text_Node.forEach:');
            const fonts = item.getRangeAllFontNames(0, item.characters.length);
            for (const font of fonts) {
                yield figma.loadFontAsync(font);
            }
            console.log(item.characters);
            var searchRegExp = new RegExp(data.data.keyword, 'g');
            console.log(item);
            item.characters = item.characters.replace(searchRegExp, data.data.replace_word);
        }));
        figma.ui.postMessage({ 'type': 'replace' });
        console.log('target_Text_Node:');
        console.log(target_Text_Node);
    });
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDQTtBQUNBLG9DQUFvQyxzQkFBc0I7QUFDMUQ7QUFDQTtBQUNBLCtCQUErQix3QkFBd0I7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxzR0FBc0c7QUFDOUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiw4Q0FBOEM7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHlCQUF5QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzQkFBc0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isb0RBQW9EO0FBQ25GO0FBQ0E7QUFDQSwrQkFBK0IscURBQXFEO0FBQ3BGO0FBQ0E7Ozs7Ozs7O1VFM01BO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AZmlnbWEvcGx1Z2luLXR5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5sZXQgdGFyZ2V0X1RleHRfTm9kZSA9IFtdO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMDAsIGhlaWdodDogMzQwIH0pO1xuLy8gY29uc29sZS5sb2coJ2hlbGxvMicpXG5vblNlbGVjdGlvbkNoYW5nZSgpO1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4geyBvblNlbGVjdGlvbkNoYW5nZSgpOyB9KTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VhcmNoJykge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmRfbG9hZGluZycgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2gnKTtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgZmluZF9hbmRfcmVwbGFjZShtc2cuZGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2ggdGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aCk7JyArIHRhcmdldF9UZXh0X05vZGUubGVuZ3RoLnRvU3RyaW5nKCkpO1xuICAgICAgICBsZXQgdG9VSUhUTUwgPSBbXTtcbiAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGUubGVuZ3RoID49IDApIHtcbiAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoOicpO1xuICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5jaGFyYWN0ZXJzLmluZGV4T2YobXNnLmRhdGEua2V5d29yZCwgcG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaW5kZXg6Jyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvVUlIVE1MLnB1c2goeyAnaWQnOiBpdGVtLmlkLCAnY2hhcmFjdGVycyc6IGl0ZW0uY2hhcmFjdGVycywgJ3N0YXJ0JzogaW5kZXgsICdlbmQnOiBpbmRleCArIG1zZy5kYXRhLmtleXdvcmQubGVuZ3RoIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSBpbmRleCArIG1zZy5kYXRhLmtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpZiA6dG9VSUhUTUw6Jyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b1VJSFRNTCk7XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kJywgJ3RhcmdldF9UZXh0X05vZGUnOiB0b1VJSFRNTCB9KTtcbiAgICAgICAgLy8gZmlnbWEuY2xvc2VQbHVnaW4oKVxuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICdsaXN0T25DbGlrJykge1xuICAgICAgICBjb25zb2xlLmxvZygnY29kZSBqczpsaXN0T25DbGlrOicpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVswXSk7XG4gICAgICAgIHZhciB0YXJnZXROb2RlO1xuICAgICAgICBjb25zb2xlLmxvZygnZm9yRWFjaDonKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldLmlkKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZy5kYXRhLml0ZW0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnLmRhdGFbJ2l0ZW0nXSk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZVtpXS5pZCA9PSBtc2cuZGF0YVsnaXRlbSddKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2JpbmdvJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXSk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Tm9kZSA9PT0gdGFyZ2V0X1RleHRfTm9kZVtpXTtcbiAgICAgICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW3RhcmdldF9UZXh0X05vZGVbaV1dKTtcbiAgICAgICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3RlZFRleHRSYW5nZSA9IHsgJ25vZGUnOiB0YXJnZXRfVGV4dF9Ob2RlW2ldLCAnc3RhcnQnOiBtc2cuZGF0YVsnc3RhcnQnXSwgJ2VuZCc6IG1zZy5kYXRhWydlbmQnXSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCd0YXJnZXROb2RlOicpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXROb2RlKTtcbiAgICAgICAgLy8gdmFyIHRleHQgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kT25lKG4gPT4gbi5pZCA9PT0gbXNnLmlkKVxuICAgIH1cbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXBsYWNlJykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVwbGFjZScpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICByZXBsYWNlKG1zZyk7XG4gICAgICAgIC8vIGNvbnN0IHRhcmdldF9UZXh0X05vZGUgPSBmaW5kX2FuZF9yZXBsYWNlKG1zZy5kYXRhLmtleXdvcmQpXG4gICAgfVxufTtcbi8vIOafpeaJvuWbvuWxguS4i+eahOaWh+acrOWbvuWxgu+8jOi+k+WFpSBmaWdtYSDlm77lsYLlr7nosaHvvIzov5Tlm57mib7liLDmiYDmnInmlofmnKzlm77lsYJcbmZ1bmN0aW9uIG15RmluZFRleHRBbGwobm9kZSwgbm9kZV9saXN0KSB7XG4gICAgdmFyIHRhZ2V0Tm9kZTtcbiAgICBjb25zb2xlLmxvZygnbXlGaW5kQWxsJyk7XG4gICAgLy8g5aaC5p6c55uu5qCH5Zu+5bGC5pys6Lqr5bCx5pivXG4gICAgaWYgKG5vZGUudHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgbm9kZV9saXN0LnB1c2gobm9kZSk7XG4gICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgfVxuICAgIHZhciB0aGlzQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIC8vICDlpoLmnpzlvZPliY3oioLngrnkuIvlrZjlnKjlrZDoioLngrlcbiAgICBjb25zb2xlLmxvZyh0aGlzQ2hpbGRyZW4pO1xuICAgIGlmICh0aGlzQ2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIOW9k+WJjeiKgueCueaXoOWtkOiKgueCue+8jOWPr+iDveaYr+W9oueKtuWbvuWxglxuICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXNDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zb2xlLmxvZygndGhpc0NoaWxkcmVuOicpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzQ2hpbGRyZW4pO1xuICAgICAgICBpZiAodGhpc0NoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyEhIUVSUk8gdGhpc0NoaWxkcmVuPT11bmRlZmluZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgICAgIH1cbiAgICAgICAgLy8g5aaC5p6c6IqC54K555qE57G75Z6L5Li6IFRFWFRcbiAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS50eXBlID09ICdURVhUJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JldHVybiB0aGlzQ2hpbGRyZW5baV06Jyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzQ2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgbm9kZV9saXN0LnB1c2godGhpc0NoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIOWmguaenOS4jeaYryBURVhUIOWbvuWxglxuICAgICAgICAgICAgLy8g5aaC5p6c5YyF5ZCr5a2Q5Zu+5bGCXG4gICAgICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLmNoaWxkcmVuICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+mAkuW9kicpO1xuICAgICAgICAgICAgICAgICAgICB0YWdldE5vZGUgPSBteUZpbmRUZXh0QWxsKHRoaXNDaGlsZHJlbltpXSwgbm9kZV9saXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2coJ25vZGVfbGlzdDonKTtcbiAgICBjb25zb2xlLmxvZyhub2RlX2xpc3QpO1xuICAgIHJldHVybiBub2RlX2xpc3Q7XG59XG5mdW5jdGlvbiBteUxvYWRGb250QXN5bmMobXlGb250KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ215TG9hZEZvbnRBc3luYzonKTtcbiAgICAgICAgY29uc29sZS5sb2cobXlGb250KTtcbiAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhteUZvbnQpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZmluZF9hbmRfcmVwbGFjZShkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbmRlLnRzOmZpbmRfYW5kX3JlcGxhY2U6Jyk7XG4gICAgdGFyZ2V0X1RleHRfTm9kZSA9IFtdO1xuICAgIHZhciBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgdmFyIG5vZGVfbGlzdCA9IFtdOyAvLyDlrZjlgqjnm67moIflgLwg4oCU4oCUIOmAieS4reWbvuWxguS4re+8jOaJgOacieaWh+acrOWbvuWxglxuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2UuY2hpbGRyZW47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyDlvZPliY3mnInpgInkuK3lm77lsYLvvIzliJnlnKjpgInkuK3nmoTlm77lsYLkuK3mkJzntKJcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ3NlbGVjdGlvbjonKTtcbiAgICBjb25zb2xlLmxvZyhzZWxlY3Rpb24pO1xuICAgIC8vIOWcqOW9k+WJjemAieS4reeahOWbvuWxguS4re+8jOaQnOe0ouaWh+acrOWbvuWxglxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmaW5kX2FuZF9yZXBsYWNlOmZvciBzZWxlY3Rpb24nKTtcbiAgICAgICAgLy8gdmFyIHRleHROb2RlID0gbXlGaW5kVGV4dEFsbChzZWxlY3Rpb25baV0pXG4gICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGlvbltpXSk7XG4gICAgICAgIG5vZGVfbGlzdCA9IG15RmluZFRleHRBbGwoc2VsZWN0aW9uW2ldLCBub2RlX2xpc3QpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnRmluZCBlbmQ6Jyk7XG4gICAgY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICAvLyDojrflj5bmiYDmnInmlofmnKzlm77lsYLnmoTmlofmnKzvvIzmibnph4/lhbPplK7lrZfvvIzojrflj5bnrKblkIjlhbPplK7lrZfnmoTlm77lsYLliJfooahcbiAgICAvLyB2YXIgdGFyZ2V0X1RleHRfTm9kZSA9W11cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5vZGVfbGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAobm9kZV9saXN0W2pdWydjaGFyYWN0ZXJzJ10uaW5kZXhPZihkYXRhLmtleXdvcmQpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIOaJvuWIsOWFs+mUruivjVxuICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5wdXNoKG5vZGVfbGlzdFtqXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gZmlnbWEubG9hZEZvbnRBc3luYyh0YXJnZXRfVGV4dF9Ob2RlWzBdLmZvbnROYW1lKVxuICAgIGNvbnNvbGUubG9nKCd0YXJnZXRfVGV4dF9Ob2RlOicpO1xuICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgIGNvbnNvbGUubG9nKCd0YXJnZXRfVGV4dF9Ob2RlOicpO1xuICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgIC8vIHJldHVybiB0YXJnZXRfVGV4dF9Ob2RlXG59XG5mdW5jdGlvbiByZXBsYWNlKGRhdGEpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVwbGFjZScpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgLy8gdmFyIHRhcmdldF9UZXh0X05vZGUgPSBbXVxuICAgICAgICAvLyDlsIbnrKblkIjmnaHku7bnmoTlm77lsYLkuK3nmoTmjIflrprmlofmnKzmm7/mjaLmiJDnm67moIflgLxcbiAgICAgICAgLy8gdmFyIG15Zm9udCA9IHRhcmdldF9UZXh0X05vZGVbMF0uZm9udE5hbWVcbiAgICAgICAgLy8gYXdhaXQgbXlMb2FkRm9udEFzeW5jKG15Zm9udClcbiAgICAgICAgLy8gYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyhteWZvbnQpXG4gICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaCgoaXRlbSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGUuZm9yRWFjaDonKTtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRzID0gaXRlbS5nZXRSYW5nZUFsbEZvbnROYW1lcygwLCBpdGVtLmNoYXJhY3RlcnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZm9udCBvZiBmb250cykge1xuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtLmNoYXJhY3RlcnMpO1xuICAgICAgICAgICAgdmFyIHNlYXJjaFJlZ0V4cCA9IG5ldyBSZWdFeHAoZGF0YS5kYXRhLmtleXdvcmQsICdnJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgICAgIGl0ZW0uY2hhcmFjdGVycyA9IGl0ZW0uY2hhcmFjdGVycy5yZXBsYWNlKHNlYXJjaFJlZ0V4cCwgZGF0YS5kYXRhLnJlcGxhY2Vfd29yZCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJyB9KTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGU6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gb25TZWxlY3Rpb25DaGFuZ2UoKSB7XG4gICAgdmFyIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IHRydWUgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiBmYWxzZSB9KTtcbiAgICB9XG59XG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL2NvZGUudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==