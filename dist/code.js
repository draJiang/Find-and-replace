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
figma.showUI(__html__, { width: 300, height: 340 });
// console.log('hello2')
onSelectionChange();
// 绑定 Figma 图层选择变化事件
figma.on("selectionchange", () => { onSelectionChange(); });
// UI 发来消息
figma.ui.onmessage = msg => {
    // UI 中点击了搜索
    if (msg.type === 'search') {
        // figma.ui.postMessage({ 'type': 'find_loading' })
        console.log('search');
        console.log(msg);
        // 执行搜索
        find(msg.data);
        console.log('search target_Text_Node:');
        // console.log(target_Text_Node);
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
                    var index = item.characters.indexOf(msg.data.keyword, position);
                    // console.log('index:');
                    // console.log(index);
                    if (index > -1) {
                        // 将查找的字符起始、终止位置发送给 UI
                        toUIHTML.push({ 'id': item.id, 'characters': item.characters, 'start': index, 'end': index + msg.data.keyword.length });
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
        figma.ui.postMessage({ 'type': 'find', 'target_Text_Node': toUIHTML });
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
            if (target_Text_Node[i].id == msg.data['item']) {
                // 找到用户点击的图层
                targetNode === target_Text_Node[i];
                // Figma 视图定位到对应图层
                figma.viewport.scrollAndZoomIntoView([target_Text_Node[i]]);
                // Figma 选中对应文本
                figma.currentPage.selectedTextRange = { 'node': target_Text_Node[i], 'start': msg.data['start'], 'end': msg.data['end'] };
                break;
            }
        }
    }
    // UI 中点击了「替换」按钮
    if (msg.type === 'replace') {
        console.log('replace');
        console.log(msg);
        // 执行替换
        replace(msg);
    }
};
// 查找图层下的文本图层，输入 figma 图层对象，返回找到所有文本图层
function myFindTextAll(node, node_list) {
    var tagetNode;
    // console.log('myFindAll');
    // 如果目标图层本身就是 TEXT 图层
    if (node.type == 'TEXT') {
        node_list.push(node);
        return node_list;
    }
    var thisChildren = node.children;
    //  如果当前节点下存在子节点
    if (thisChildren == undefined) {
        // 当前节点无子节点，可能是形状图层
        return node_list;
    }
    // 遍历子节点
    for (var i = 0; i < thisChildren.length; i++) {
        // console.log('thisChildren:')
        // console.log(thisChildren);
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
// 搜索
function find(data) {
    console.log('conde.ts:find:');
    // 清空历史搜索数据，重新搜索
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
            // console.log('find:for selection');
            node_list = myFindTextAll(selection[i], node_list);
        }
    }
    // console.log('selection:');
    // console.log(selection);
    console.log('Find end:');
    // console.log(node_list);
    // 在文本图层中，匹配关键字
    for (var j = 0; j < node_list.length; j++) {
        if (node_list[j]['characters'].indexOf(data.keyword) > -1) {
            // 找到关键词
            target_Text_Node.push(node_list[j]);
        }
    }
}
// 替换
function replace(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('replace');
        console.log(data);
        target_Text_Node.forEach((item) => __awaiter(this, void 0, void 0, function* () {
            // console.log('target_Text_Node.forEach:');
            // 加载字体
            const fonts = item.getRangeAllFontNames(0, item.characters.length);
            for (const font of fonts) {
                yield figma.loadFontAsync(font);
            }
            // console.log(item.characters);
            var searchRegExp = new RegExp(data.data.keyword, 'g');
            // console.log(item);
            item.characters = item.characters.replace(searchRegExp, data.data.replace_word);
        }));
        // 替换完毕，通知 UI 更新
        figma.ui.postMessage({ 'type': 'replace' });
        console.log('target_Text_Node:');
        console.log(target_Text_Node);
    });
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0IseUJBQXlCLHlCQUF5QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msc0JBQXNCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLHdCQUF3QjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLHNHQUFzRztBQUM5STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLDhDQUE4QztBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IseUJBQXlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNCQUFzQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvREFBb0Q7QUFDbkY7QUFDQTtBQUNBLCtCQUErQixxREFBcUQ7QUFDcEY7QUFDQTs7Ozs7Ozs7VUV2TUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2UvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0BmaWdtYS9wbHVnaW4tdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cbmxldCB0YXJnZXRfVGV4dF9Ob2RlID0gW107IC8vIOWtmOWCqOespuWQiOaQnOe0ouadoeS7tueahCBURVhUIOWbvuWxglxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMDAsIGhlaWdodDogMzQwIH0pO1xuLy8gY29uc29sZS5sb2coJ2hlbGxvMicpXG5vblNlbGVjdGlvbkNoYW5nZSgpO1xuLy8g57uR5a6aIEZpZ21hIOWbvuWxgumAieaLqeWPmOWMluS6i+S7tlxuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4geyBvblNlbGVjdGlvbkNoYW5nZSgpOyB9KTtcbi8vIFVJIOWPkeadpea2iOaBr1xuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbiAgICAvLyBVSSDkuK3ngrnlh7vkuobmkJzntKJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZF9sb2FkaW5nJyB9KVxuICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIC8vIOaJp+ihjOaQnOe0olxuICAgICAgICBmaW5kKG1zZy5kYXRhKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCB0YXJnZXRfVGV4dF9Ob2RlOicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUubGVuZ3RoKTsnICsgdGFyZ2V0X1RleHRfTm9kZS5sZW5ndGgudG9TdHJpbmcoKSk7XG4gICAgICAgIGxldCB0b1VJSFRNTCA9IFtdOyAvLyDlrZjlgqjmlbDmja7vvIznlKjkuo7lj5HpgIHnu5kgVUlcbiAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGUubGVuZ3RoID49IDApIHtcbiAgICAgICAgICAgIC8vIOWmguaenOWtmOWcqOespuWQiOaQnOe0ouadoeS7tueahCBURVhUIOWbvuWxglxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGUuZm9yRWFjaDonKTtcbiAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIC8vIOaehOW7uuaVsOaNru+8jOS8oOmAgee7mSBVSVxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOeUseS6juWNleS4qiBURVhUIOWbvuWxguWGheWPr+iDveWtmOWcqOWkmuS4quespuWQiOadoeS7tueahOWtl+espu+8jOaJgOS7pemcgOimgeW+queOr+afpeaJvlxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBpdGVtLmNoYXJhY3RlcnMuaW5kZXhPZihtc2cuZGF0YS5rZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbmRleDonKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5bCG5p+l5om+55qE5a2X56ym6LW35aeL44CB57uI5q2i5L2N572u5Y+R6YCB57uZIFVJXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VJSFRNTC5wdXNoKHsgJ2lkJzogaXRlbS5pZCwgJ2NoYXJhY3RlcnMnOiBpdGVtLmNoYXJhY3RlcnMsICdzdGFydCc6IGluZGV4LCAnZW5kJzogaW5kZXggKyBtc2cuZGF0YS5rZXl3b3JkLmxlbmd0aCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBtc2cuZGF0YS5rZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaWYgOnRvVUlIVE1MOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codG9VSUhUTUwpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZCcsICd0YXJnZXRfVGV4dF9Ob2RlJzogdG9VSUhUTUwgfSk7XG4gICAgfVxuICAgIC8vIFVJIOS4reeCueWHu+aQnOe0oue7k+aenOmhuVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2xpc3RPbkNsaWsnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb2RlIGpzOmxpc3RPbkNsaWs6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIHZhciB0YXJnZXROb2RlO1xuICAgICAgICBjb25zb2xlLmxvZygnZm9yRWFjaDonKTtcbiAgICAgICAgLy8g6YGN5Y6G5pCc57Si57uT5p6cXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0X1RleHRfTm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZVtpXS5pZCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtc2cuZGF0YS5pdGVtKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1zZy5kYXRhWydpdGVtJ10pO1xuICAgICAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGVbaV0uaWQgPT0gbXNnLmRhdGFbJ2l0ZW0nXSkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWIsOeUqOaIt+eCueWHu+eahOWbvuWxglxuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUgPT09IHRhcmdldF9UZXh0X05vZGVbaV07XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6KeG5Zu+5a6a5L2N5Yiw5a+55bqU5Zu+5bGCXG4gICAgICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFt0YXJnZXRfVGV4dF9Ob2RlW2ldXSk7XG4gICAgICAgICAgICAgICAgLy8gRmlnbWEg6YCJ5Lit5a+55bqU5paH5pysXG4gICAgICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0ZWRUZXh0UmFuZ2UgPSB7ICdub2RlJzogdGFyZ2V0X1RleHRfTm9kZVtpXSwgJ3N0YXJ0JzogbXNnLmRhdGFbJ3N0YXJ0J10sICdlbmQnOiBtc2cuZGF0YVsnZW5kJ10gfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vkuobjgIzmm7/mjaLjgI3mjInpkq5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXBsYWNlJykge1xuICAgICAgICBjb25zb2xlLmxvZygncmVwbGFjZScpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAvLyDmiafooYzmm7/mjaJcbiAgICAgICAgcmVwbGFjZShtc2cpO1xuICAgIH1cbn07XG4vLyDmn6Xmib7lm77lsYLkuIvnmoTmlofmnKzlm77lsYLvvIzovpPlhaUgZmlnbWEg5Zu+5bGC5a+56LGh77yM6L+U5Zue5om+5Yiw5omA5pyJ5paH5pys5Zu+5bGCXG5mdW5jdGlvbiBteUZpbmRUZXh0QWxsKG5vZGUsIG5vZGVfbGlzdCkge1xuICAgIHZhciB0YWdldE5vZGU7XG4gICAgLy8gY29uc29sZS5sb2coJ215RmluZEFsbCcpO1xuICAgIC8vIOWmguaenOebruagh+WbvuWxguacrOi6q+WwseaYryBURVhUIOWbvuWxglxuICAgIGlmIChub2RlLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgIG5vZGVfbGlzdC5wdXNoKG5vZGUpO1xuICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgIH1cbiAgICB2YXIgdGhpc0NoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcbiAgICAvLyAg5aaC5p6c5b2T5YmN6IqC54K55LiL5a2Y5Zyo5a2Q6IqC54K5XG4gICAgaWYgKHRoaXNDaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8g5b2T5YmN6IqC54K55peg5a2Q6IqC54K577yM5Y+v6IO95piv5b2i54q25Zu+5bGCXG4gICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgfVxuICAgIC8vIOmBjeWOhuWtkOiKgueCuVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpc0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzQ2hpbGRyZW46JylcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpc0NoaWxkcmVuKTtcbiAgICAgICAgaWYgKHRoaXNDaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCchISFFUlJPIHRoaXNDaGlsZHJlbj09dW5kZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gbm9kZV9saXN0O1xuICAgICAgICB9XG4gICAgICAgIC8vIOWmguaenOiKgueCueeahOexu+Wei+S4uiBURVhUXG4gICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0udHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyZXR1cm4gdGhpc0NoaWxkcmVuW2ldOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpc0NoaWxkcmVuW2ldKTtcbiAgICAgICAgICAgIG5vZGVfbGlzdC5wdXNoKHRoaXNDaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3mmK8gVEVYVCDlm77lsYJcbiAgICAgICAgICAgIC8vIOWmguaenOWMheWQq+WtkOWbvuWxglxuICAgICAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS5jaGlsZHJlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNDaGlsZHJlbltpXS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhZ2V0Tm9kZSA9IG15RmluZFRleHRBbGwodGhpc0NoaWxkcmVuW2ldLCBub2RlX2xpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnbm9kZV9saXN0OicpO1xuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgcmV0dXJuIG5vZGVfbGlzdDtcbn1cbmZ1bmN0aW9uIG15TG9hZEZvbnRBc3luYyhteUZvbnQpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXlMb2FkRm9udEFzeW5jOicpO1xuICAgICAgICBjb25zb2xlLmxvZyhteUZvbnQpO1xuICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Rm9udCk7XG4gICAgfSk7XG59XG4vLyDmkJzntKJcbmZ1bmN0aW9uIGZpbmQoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKCdjb25kZS50czpmaW5kOicpO1xuICAgIC8vIOa4heepuuWOhuWPsuaQnOe0ouaVsOaNru+8jOmHjeaWsOaQnOe0olxuICAgIHRhcmdldF9UZXh0X05vZGUgPSBbXTtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIHZhciBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo55uu5qCH5YC8IOKAlOKAlCDpgInkuK3lm77lsYLkuK3vvIzmiYDmnInmlofmnKzlm77lsYJcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIG5vZGVfbGlzdCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRBbGwobiA9PiBuLnR5cGUgPT09IFwiVEVYVFwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIOW9k+WJjeaciemAieS4reWbvuWxgu+8jOWImeWcqOmAieS4reeahOWbvuWxguS4reaQnOe0olxuICAgICAgICAvLyDlnKjlvZPliY3pgInkuK3nmoTlm77lsYLkuK3vvIzmkJzntKLmlofmnKzlm77lsYJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmaW5kOmZvciBzZWxlY3Rpb24nKTtcbiAgICAgICAgICAgIG5vZGVfbGlzdCA9IG15RmluZFRleHRBbGwoc2VsZWN0aW9uW2ldLCBub2RlX2xpc3QpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKCdzZWxlY3Rpb246Jyk7XG4gICAgLy8gY29uc29sZS5sb2coc2VsZWN0aW9uKTtcbiAgICBjb25zb2xlLmxvZygnRmluZCBlbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0KTtcbiAgICAvLyDlnKjmlofmnKzlm77lsYLkuK3vvIzljLnphY3lhbPplK7lrZdcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5vZGVfbGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICBpZiAobm9kZV9saXN0W2pdWydjaGFyYWN0ZXJzJ10uaW5kZXhPZihkYXRhLmtleXdvcmQpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIOaJvuWIsOWFs+mUruivjVxuICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5wdXNoKG5vZGVfbGlzdFtqXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyDmm7/mjaJcbmZ1bmN0aW9uIHJlcGxhY2UoZGF0YSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2goKGl0ZW0pID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2g6Jyk7XG4gICAgICAgICAgICAvLyDliqDovb3lrZfkvZNcbiAgICAgICAgICAgIGNvbnN0IGZvbnRzID0gaXRlbS5nZXRSYW5nZUFsbEZvbnROYW1lcygwLCBpdGVtLmNoYXJhY3RlcnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZm9udCBvZiBmb250cykge1xuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtLmNoYXJhY3RlcnMpO1xuICAgICAgICAgICAgdmFyIHNlYXJjaFJlZ0V4cCA9IG5ldyBSZWdFeHAoZGF0YS5kYXRhLmtleXdvcmQsICdnJyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgICAgIGl0ZW0uY2hhcmFjdGVycyA9IGl0ZW0uY2hhcmFjdGVycy5yZXBsYWNlKHNlYXJjaFJlZ0V4cCwgZGF0YS5kYXRhLnJlcGxhY2Vfd29yZCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgfSk7XG59XG4vLyBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbml7bvvIzpgJrnn6UgVUkg5pi+56S65LiN5ZCM55qE5o+Q56S6XG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZSgpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IGZhbHNlIH0pO1xuICAgIH1cbn1cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvY29kZS50c1wiXSgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9