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
        // console.log(target_Text_Node);
        console.log('console.log(target_Text_Node.length);' + target_Text_Node.length.toString());
        let toUIHTML = [];
        if (target_Text_Node.length >= 0) {
            console.log('target_Text_Node.forEach:');
            target_Text_Node.forEach(item => {
                var position = 0;
                while (true) {
                    var index = item.characters.indexOf(msg.data.keyword, position);
                    // console.log('index:');
                    // console.log(index);
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
            // console.log('return thisChildren[i]:');
            // console.log(thisChildren[i]);
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
    // console.log('node_list:');
    // console.log(node_list);
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
        node_list = figma.currentPage.findAll(n => n.type === "TEXT");
    }
    else {
        // 当前有选中图层，则在选中的图层中搜索
        // 在当前选中的图层中，搜索文本图层
        for (var i = 0; i < selection.length; i++) {
            console.log('find_and_replace:for selection');
            // var textNode = myFindTextAll(selection[i])
            console.log(selection[i]);
            node_list = myFindTextAll(selection[i], node_list);
        }
    }
    // console.log('selection:');
    // console.log(selection);
    console.log('Find end:');
    // console.log(node_list);
    // 获取所有文本图层的文本，批量关键字，获取符合关键字的图层列表
    // var target_Text_Node =[]
    for (var j = 0; j < node_list.length; j++) {
        if (node_list[j]['characters'].indexOf(data.keyword) > -1) {
            // 找到关键词
            target_Text_Node.push(node_list[j]);
        }
    }
    // figma.loadFontAsync(target_Text_Node[0].fontName)
    // console.log('target_Text_Node:');
    // console.log(target_Text_Node);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDQTtBQUNBLG9DQUFvQyxzQkFBc0I7QUFDMUQ7QUFDQTtBQUNBLCtCQUErQix3QkFBd0I7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxzR0FBc0c7QUFDOUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLCtCQUErQiw4Q0FBOEM7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHlCQUF5QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isc0JBQXNCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzQkFBc0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isb0RBQW9EO0FBQ25GO0FBQ0E7QUFDQSwrQkFBK0IscURBQXFEO0FBQ3BGO0FBQ0E7Ozs7Ozs7O1VFeE1BO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2Uvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL25vZGVfbW9kdWxlcy9AZmlnbWEvcGx1Z2luLXR5cGluZ3MvaW5kZXguZC50c1wiIC8+XG5sZXQgdGFyZ2V0X1RleHRfTm9kZSA9IFtdO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMDAsIGhlaWdodDogMzQwIH0pO1xuLy8gY29uc29sZS5sb2coJ2hlbGxvMicpXG5vblNlbGVjdGlvbkNoYW5nZSgpO1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4geyBvblNlbGVjdGlvbkNoYW5nZSgpOyB9KTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4gICAgaWYgKG1zZy50eXBlID09PSAnc2VhcmNoJykge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmRfbG9hZGluZycgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2gnKTtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgZmluZF9hbmRfcmVwbGFjZShtc2cuZGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2ggdGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlLmxlbmd0aCk7JyArIHRhcmdldF9UZXh0X05vZGUubGVuZ3RoLnRvU3RyaW5nKCkpO1xuICAgICAgICBsZXQgdG9VSUhUTUwgPSBbXTtcbiAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGUubGVuZ3RoID49IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2g6Jyk7XG4gICAgICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBpdGVtLmNoYXJhY3RlcnMuaW5kZXhPZihtc2cuZGF0YS5rZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleDonKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9VSUhUTUwucHVzaCh7ICdpZCc6IGl0ZW0uaWQsICdjaGFyYWN0ZXJzJzogaXRlbS5jaGFyYWN0ZXJzLCAnc3RhcnQnOiBpbmRleCwgJ2VuZCc6IGluZGV4ICsgbXNnLmRhdGEua2V5d29yZC5sZW5ndGggfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGluZGV4ICsgbXNnLmRhdGEua2V5d29yZC5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2lmIDp0b1VJSFRNTDonKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvVUlIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAndGFyZ2V0X1RleHRfTm9kZSc6IHRvVUlIVE1MIH0pO1xuICAgICAgICAvLyBmaWdtYS5jbG9zZVBsdWdpbigpXG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2xpc3RPbkNsaWsnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb2RlIGpzOmxpc3RPbkNsaWs6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlWzBdKTtcbiAgICAgICAgdmFyIHRhcmdldE5vZGU7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmb3JFYWNoOicpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldF9UZXh0X05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV0uaWQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLmRhdGEuaXRlbSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cuZGF0YVsnaXRlbSddKTtcbiAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldLmlkID09IG1zZy5kYXRhWydpdGVtJ10pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYmluZ28nKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldKTtcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlID09PSB0YXJnZXRfVGV4dF9Ob2RlW2ldO1xuICAgICAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbdGFyZ2V0X1RleHRfTm9kZVtpXV0pO1xuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGVkVGV4dFJhbmdlID0geyAnbm9kZSc6IHRhcmdldF9UZXh0X05vZGVbaV0sICdzdGFydCc6IG1zZy5kYXRhWydzdGFydCddLCAnZW5kJzogbXNnLmRhdGFbJ2VuZCddIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ3RhcmdldE5vZGU6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldE5vZGUpO1xuICAgICAgICAvLyB2YXIgdGV4dCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUobiA9PiBuLmlkID09PSBtc2cuaWQpXG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIHJlcGxhY2UobXNnKTtcbiAgICAgICAgLy8gY29uc3QgdGFyZ2V0X1RleHRfTm9kZSA9IGZpbmRfYW5kX3JlcGxhY2UobXNnLmRhdGEua2V5d29yZClcbiAgICB9XG59O1xuLy8g5p+l5om+5Zu+5bGC5LiL55qE5paH5pys5Zu+5bGC77yM6L6T5YWlIGZpZ21hIOWbvuWxguWvueixoe+8jOi/lOWbnuaJvuWIsOaJgOacieaWh+acrOWbvuWxglxuZnVuY3Rpb24gbXlGaW5kVGV4dEFsbChub2RlLCBub2RlX2xpc3QpIHtcbiAgICB2YXIgdGFnZXROb2RlO1xuICAgIGNvbnNvbGUubG9nKCdteUZpbmRBbGwnKTtcbiAgICAvLyDlpoLmnpznm67moIflm77lsYLmnKzouqvlsLHmmK9cbiAgICBpZiAobm9kZS50eXBlID09ICdURVhUJykge1xuICAgICAgICBub2RlX2xpc3QucHVzaChub2RlKTtcbiAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICB9XG4gICAgdmFyIHRoaXNDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgLy8gIOWmguaenOW9k+WJjeiKgueCueS4i+WtmOWcqOWtkOiKgueCuVxuICAgIGNvbnNvbGUubG9nKHRoaXNDaGlsZHJlbik7XG4gICAgaWYgKHRoaXNDaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8g5b2T5YmN6IqC54K55peg5a2Q6IqC54K577yM5Y+v6IO95piv5b2i54q25Zu+5bGCXG4gICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpc0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGlzQ2hpbGRyZW46Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXNDaGlsZHJlbik7XG4gICAgICAgIGlmICh0aGlzQ2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnISEhRVJSTyB0aGlzQ2hpbGRyZW49PXVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICAgICAgfVxuICAgICAgICAvLyDlpoLmnpzoioLngrnnmoTnsbvlnovkuLogVEVYVFxuICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygncmV0dXJuIHRoaXNDaGlsZHJlbltpXTonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXNDaGlsZHJlbltpXSk7XG4gICAgICAgICAgICBub2RlX2xpc3QucHVzaCh0aGlzQ2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5pivIFRFWFQg5Zu+5bGCXG4gICAgICAgICAgICAvLyDlpoLmnpzljIXlkKvlrZDlm77lsYJcbiAgICAgICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0uY2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn6YCS5b2SJyk7XG4gICAgICAgICAgICAgICAgICAgIHRhZ2V0Tm9kZSA9IG15RmluZFRleHRBbGwodGhpc0NoaWxkcmVuW2ldLCBub2RlX2xpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnbm9kZV9saXN0OicpO1xuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgcmV0dXJuIG5vZGVfbGlzdDtcbn1cbmZ1bmN0aW9uIG15TG9hZEZvbnRBc3luYyhteUZvbnQpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXlMb2FkRm9udEFzeW5jOicpO1xuICAgICAgICBjb25zb2xlLmxvZyhteUZvbnQpO1xuICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Rm9udCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmaW5kX2FuZF9yZXBsYWNlKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZygnY29uZGUudHM6ZmluZF9hbmRfcmVwbGFjZTonKTtcbiAgICB0YXJnZXRfVGV4dF9Ob2RlID0gW107XG4gICAgdmFyIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICB2YXIgbm9kZV9saXN0ID0gW107IC8vIOWtmOWCqOebruagh+WAvCDigJTigJQg6YCJ5Lit5Zu+5bGC5Lit77yM5omA5pyJ5paH5pys5Zu+5bGCXG4gICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPT0gMCkge1xuICAgICAgICBub2RlX2xpc3QgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsKG4gPT4gbi50eXBlID09PSBcIlRFWFRcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyDlvZPliY3mnInpgInkuK3lm77lsYLvvIzliJnlnKjpgInkuK3nmoTlm77lsYLkuK3mkJzntKJcbiAgICAgICAgLy8g5Zyo5b2T5YmN6YCJ5Lit55qE5Zu+5bGC5Lit77yM5pCc57Si5paH5pys5Zu+5bGCXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluZF9hbmRfcmVwbGFjZTpmb3Igc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICAvLyB2YXIgdGV4dE5vZGUgPSBteUZpbmRUZXh0QWxsKHNlbGVjdGlvbltpXSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGlvbltpXSk7XG4gICAgICAgICAgICBub2RlX2xpc3QgPSBteUZpbmRUZXh0QWxsKHNlbGVjdGlvbltpXSwgbm9kZV9saXN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnc2VsZWN0aW9uOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdGlvbik7XG4gICAgY29uc29sZS5sb2coJ0ZpbmQgZW5kOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgLy8g6I635Y+W5omA5pyJ5paH5pys5Zu+5bGC55qE5paH5pys77yM5om56YeP5YWz6ZSu5a2X77yM6I635Y+W56ym5ZCI5YWz6ZSu5a2X55qE5Zu+5bGC5YiX6KGoXG4gICAgLy8gdmFyIHRhcmdldF9UZXh0X05vZGUgPVtdXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBub2RlX2xpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKG5vZGVfbGlzdFtqXVsnY2hhcmFjdGVycyddLmluZGV4T2YoZGF0YS5rZXl3b3JkKSA+IC0xKSB7XG4gICAgICAgICAgICAvLyDmib7liLDlhbPplK7or41cbiAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUucHVzaChub2RlX2xpc3Rbal0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGZpZ21hLmxvYWRGb250QXN5bmModGFyZ2V0X1RleHRfTm9kZVswXS5mb250TmFtZSlcbiAgICAvLyBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbn1cbmZ1bmN0aW9uIHJlcGxhY2UoZGF0YSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAvLyB2YXIgdGFyZ2V0X1RleHRfTm9kZSA9IFtdXG4gICAgICAgIC8vIOWwhuespuWQiOadoeS7tueahOWbvuWxguS4reeahOaMh+WumuaWh+acrOabv+aNouaIkOebruagh+WAvFxuICAgICAgICAvLyB2YXIgbXlmb250ID0gdGFyZ2V0X1RleHRfTm9kZVswXS5mb250TmFtZVxuICAgICAgICAvLyBhd2FpdCBteUxvYWRGb250QXN5bmMobXlmb250KVxuICAgICAgICAvLyBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Zm9udClcbiAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoKChpdGVtKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoOicpO1xuICAgICAgICAgICAgY29uc3QgZm9udHMgPSBpdGVtLmdldFJhbmdlQWxsRm9udE5hbWVzKDAsIGl0ZW0uY2hhcmFjdGVycy5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmb250IG9mIGZvbnRzKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhmb250KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0uY2hhcmFjdGVycyk7XG4gICAgICAgICAgICB2YXIgc2VhcmNoUmVnRXhwID0gbmV3IFJlZ0V4cChkYXRhLmRhdGEua2V5d29yZCwgJ2cnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICAgICAgaXRlbS5jaGFyYWN0ZXJzID0gaXRlbS5jaGFyYWN0ZXJzLnJlcGxhY2Uoc2VhcmNoUmVnRXhwLCBkYXRhLmRhdGEucmVwbGFjZV93b3JkKTtcbiAgICAgICAgfSkpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZSgpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IGZhbHNlIH0pO1xuICAgIH1cbn1cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvY29kZS50c1wiXSgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9