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
var target_Text_Node = [];
figma.showUI(__html__, { width: 300, height: 340 });
// console.log('hello2')
onSelectionChange();
figma.on("selectionchange", () => { onSelectionChange(); });
figma.ui.onmessage = msg => {
    if (msg.type === 'search') {
        console.log('search');
        console.log(msg);
        var toUIHTML = find_and_replace(msg.data);
        console.log('search target_Text_Node:');
        console.log(toUIHTML);
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
    return __awaiter(this, void 0, void 0, function* () {
        console.log('conde.ts:find_and_replace:');
        figma.ui.postMessage({ 'type': 'find_loading' });
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
            node_list = yield myFindTextAll(selection[i], node_list);
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
        if (target_Text_Node.length > 0) {
            var toUIHTML = [];
            target_Text_Node.forEach(item => {
                console.log('target_Text_Node.forEach:');
                var position = 0;
                while (true) {
                    var index = item.characters.indexOf(data.keyword, position);
                    console.log('index:');
                    console.log(index);
                    if (index > -1) {
                        toUIHTML.push({ 'id': item.id, 'characters': item.characters, 'start': index, 'end': index + data.keyword.length });
                        position = index + data.keyword.length;
                        console.log(toUIHTML);
                        console.log(position);
                    }
                    else {
                        break;
                    }
                }
            });
            console.log('toUIHTML:');
            console.log(toUIHTML);
        }
        return toUIHTML;
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qix5QkFBeUI7QUFDbEQ7QUFDQTtBQUNBLG9DQUFvQyxzQkFBc0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsOENBQThDO0FBQzdFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw2QkFBNkI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQix5QkFBeUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQix3QkFBd0I7QUFDdkQ7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNCQUFzQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0Msa0dBQWtHO0FBQzFJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCwrQkFBK0IsbUJBQW1CO0FBQ2xEO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvREFBb0Q7QUFDbkY7QUFDQTtBQUNBLCtCQUErQixxREFBcUQ7QUFDcEY7QUFDQTs7Ozs7Ozs7VUU1TUE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2UvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0BmaWdtYS9wbHVnaW4tdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cbnZhciB0YXJnZXRfVGV4dF9Ob2RlID0gW107XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMwMCwgaGVpZ2h0OiAzNDAgfSk7XG4vLyBjb25zb2xlLmxvZygnaGVsbG8yJylcbm9uU2VsZWN0aW9uQ2hhbmdlKCk7XG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7IG9uU2VsZWN0aW9uQ2hhbmdlKCk7IH0pO1xuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbiAgICBpZiAobXNnLnR5cGUgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2gnKTtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgdmFyIHRvVUlIVE1MID0gZmluZF9hbmRfcmVwbGFjZShtc2cuZGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2ggdGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICAgICAgY29uc29sZS5sb2codG9VSUhUTUwpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ2ZpbmQnLCAndGFyZ2V0X1RleHRfTm9kZSc6IHRvVUlIVE1MIH0pO1xuICAgICAgICAvLyBmaWdtYS5jbG9zZVBsdWdpbigpXG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2xpc3RPbkNsaWsnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjb2RlIGpzOmxpc3RPbkNsaWs6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlWzBdKTtcbiAgICAgICAgdmFyIHRhcmdldE5vZGU7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmb3JFYWNoOicpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldF9UZXh0X05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV0uaWQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLmRhdGEuaXRlbSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtc2cuZGF0YVsnaXRlbSddKTtcbiAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldLmlkID09IG1zZy5kYXRhWydpdGVtJ10pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYmluZ28nKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlW2ldKTtcbiAgICAgICAgICAgICAgICB0YXJnZXROb2RlID09PSB0YXJnZXRfVGV4dF9Ob2RlW2ldO1xuICAgICAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbdGFyZ2V0X1RleHRfTm9kZVtpXV0pO1xuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGVkVGV4dFJhbmdlID0geyAnbm9kZSc6IHRhcmdldF9UZXh0X05vZGVbaV0sICdzdGFydCc6IG1zZy5kYXRhWydzdGFydCddLCAnZW5kJzogbXNnLmRhdGFbJ2VuZCddIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tJyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ3RhcmdldE5vZGU6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldE5vZGUpO1xuICAgICAgICAvLyB2YXIgdGV4dCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRPbmUobiA9PiBuLmlkID09PSBtc2cuaWQpXG4gICAgfVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYWNlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIHJlcGxhY2UobXNnKTtcbiAgICAgICAgLy8gY29uc3QgdGFyZ2V0X1RleHRfTm9kZSA9IGZpbmRfYW5kX3JlcGxhY2UobXNnLmRhdGEua2V5d29yZClcbiAgICB9XG59O1xuLy8g5p+l5om+5Zu+5bGC5LiL55qE5paH5pys5Zu+5bGC77yM6L6T5YWlIGZpZ21hIOWbvuWxguWvueixoe+8jOi/lOWbnuaJvuWIsOaJgOacieaWh+acrOWbvuWxglxuZnVuY3Rpb24gbXlGaW5kVGV4dEFsbChub2RlLCBub2RlX2xpc3QpIHtcbiAgICB2YXIgdGFnZXROb2RlO1xuICAgIGNvbnNvbGUubG9nKCdteUZpbmRBbGwnKTtcbiAgICAvLyDlpoLmnpznm67moIflm77lsYLmnKzouqvlsLHmmK9cbiAgICBpZiAobm9kZS50eXBlID09ICdURVhUJykge1xuICAgICAgICBub2RlX2xpc3QucHVzaChub2RlKTtcbiAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICB9XG4gICAgdmFyIHRoaXNDaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XG4gICAgLy8gIOWmguaenOW9k+WJjeiKgueCueS4i+WtmOWcqOWtkOiKgueCuVxuICAgIGNvbnNvbGUubG9nKHRoaXNDaGlsZHJlbik7XG4gICAgaWYgKHRoaXNDaGlsZHJlbiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8g5b2T5YmN6IqC54K55peg5a2Q6IqC54K577yM5Y+v6IO95piv5b2i54q25Zu+5bGCXG4gICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpc0NoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGlzQ2hpbGRyZW46Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXNDaGlsZHJlbik7XG4gICAgICAgIGlmICh0aGlzQ2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnISEhRVJSTyB0aGlzQ2hpbGRyZW49PXVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICAgICAgfVxuICAgICAgICAvLyDlpoLmnpzoioLngrnnmoTnsbvlnovkuLogVEVYVFxuICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmV0dXJuIHRoaXNDaGlsZHJlbltpXTonKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXNDaGlsZHJlbltpXSk7XG4gICAgICAgICAgICBub2RlX2xpc3QucHVzaCh0aGlzQ2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5pivIFRFWFQg5Zu+5bGCXG4gICAgICAgICAgICAvLyDlpoLmnpzljIXlkKvlrZDlm77lsYJcbiAgICAgICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0uY2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn6YCS5b2SJyk7XG4gICAgICAgICAgICAgICAgICAgIHRhZ2V0Tm9kZSA9IG15RmluZFRleHRBbGwodGhpc0NoaWxkcmVuW2ldLCBub2RlX2xpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZygnbm9kZV9saXN0OicpO1xuICAgIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgcmV0dXJuIG5vZGVfbGlzdDtcbn1cbmZ1bmN0aW9uIG15TG9hZEZvbnRBc3luYyhteUZvbnQpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXlMb2FkRm9udEFzeW5jOicpO1xuICAgICAgICBjb25zb2xlLmxvZyhteUZvbnQpO1xuICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Rm9udCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmaW5kX2FuZF9yZXBsYWNlKGRhdGEpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnY29uZGUudHM6ZmluZF9hbmRfcmVwbGFjZTonKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdmaW5kX2xvYWRpbmcnIH0pO1xuICAgICAgICB0YXJnZXRfVGV4dF9Ob2RlID0gW107XG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIHZhciBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo55uu5qCH5YC8IOKAlOKAlCDpgInkuK3lm77lsYLkuK3vvIzmiYDmnInmlofmnKzlm77lsYJcbiAgICAgICAgLy8g5b2T5YmN5pyq6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo5b2T5YmN6aG16Z2i5pCc57SiXG4gICAgICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8g5b2T5YmN5pyJ6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo6YCJ5Lit55qE5Zu+5bGC5Lit5pCc57SiXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGlvbjonKTtcbiAgICAgICAgY29uc29sZS5sb2coc2VsZWN0aW9uKTtcbiAgICAgICAgLy8g5Zyo5b2T5YmN6YCJ5Lit55qE5Zu+5bGC5Lit77yM5pCc57Si5paH5pys5Zu+5bGCXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmluZF9hbmRfcmVwbGFjZTpmb3Igc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICAvLyB2YXIgdGV4dE5vZGUgPSBteUZpbmRUZXh0QWxsKHNlbGVjdGlvbltpXSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGlvbltpXSk7XG4gICAgICAgICAgICBub2RlX2xpc3QgPSB5aWVsZCBteUZpbmRUZXh0QWxsKHNlbGVjdGlvbltpXSwgbm9kZV9saXN0KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZygnRmluZCBlbmQ6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgICAgIC8vIOiOt+WPluaJgOacieaWh+acrOWbvuWxgueahOaWh+acrO+8jOaJuemHj+WFs+mUruWtl++8jOiOt+WPluespuWQiOWFs+mUruWtl+eahOWbvuWxguWIl+ihqFxuICAgICAgICAvLyB2YXIgdGFyZ2V0X1RleHRfTm9kZSA9W11cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBub2RlX2xpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChub2RlX2xpc3Rbal1bJ2NoYXJhY3RlcnMnXS5pbmRleE9mKGRhdGEua2V5d29yZCkgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWIsOWFs+mUruivjVxuICAgICAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUucHVzaChub2RlX2xpc3Rbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGZpZ21hLmxvYWRGb250QXN5bmModGFyZ2V0X1RleHRfTm9kZVswXS5mb250TmFtZSlcbiAgICAgICAgY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGU6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgICAgICBpZiAodGFyZ2V0X1RleHRfTm9kZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgdG9VSUhUTUwgPSBbXTtcbiAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZS5mb3JFYWNoOicpO1xuICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5jaGFyYWN0ZXJzLmluZGV4T2YoZGF0YS5rZXl3b3JkLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbmRleDonKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9VSUhUTUwucHVzaCh7ICdpZCc6IGl0ZW0uaWQsICdjaGFyYWN0ZXJzJzogaXRlbS5jaGFyYWN0ZXJzLCAnc3RhcnQnOiBpbmRleCwgJ2VuZCc6IGluZGV4ICsgZGF0YS5rZXl3b3JkLmxlbmd0aCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBkYXRhLmtleXdvcmQubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codG9VSUhUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0b1VJSFRNTDonKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvVUlIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9VSUhUTUw7XG4gICAgfSk7XG59XG5mdW5jdGlvbiByZXBsYWNlKGRhdGEpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVwbGFjZScpO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgLy8gdmFyIHRhcmdldF9UZXh0X05vZGUgPSBbXVxuICAgICAgICAvLyDlsIbnrKblkIjmnaHku7bnmoTlm77lsYLkuK3nmoTmjIflrprmlofmnKzmm7/mjaLmiJDnm67moIflgLxcbiAgICAgICAgLy8gdmFyIG15Zm9udCA9IHRhcmdldF9UZXh0X05vZGVbMF0uZm9udE5hbWVcbiAgICAgICAgLy8gYXdhaXQgbXlMb2FkRm9udEFzeW5jKG15Zm9udClcbiAgICAgICAgLy8gYXdhaXQgZmlnbWEubG9hZEZvbnRBc3luYyhteWZvbnQpXG4gICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaCgoaXRlbSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGUuZm9yRWFjaDonKTtcbiAgICAgICAgICAgIGNvbnN0IGZvbnRzID0gaXRlbS5nZXRSYW5nZUFsbEZvbnROYW1lcygwLCBpdGVtLmNoYXJhY3RlcnMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZm9udCBvZiBmb250cykge1xuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtLmNoYXJhY3RlcnMpO1xuICAgICAgICAgICAgdmFyIHNlYXJjaFJlZ0V4cCA9IG5ldyBSZWdFeHAoZGF0YS5kYXRhLmtleXdvcmQsICdnJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgICAgIGl0ZW0uY2hhcmFjdGVycyA9IGl0ZW0uY2hhcmFjdGVycy5yZXBsYWNlKHNlYXJjaFJlZ0V4cCwgZGF0YS5kYXRhLnJlcGxhY2Vfd29yZCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdyZXBsYWNlJyB9KTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGU6Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gb25TZWxlY3Rpb25DaGFuZ2UoKSB7XG4gICAgdmFyIHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IHRydWUgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ29uU2VsZWN0aW9uQ2hhbmdlJywgJ3NlbGVjdGlvblBhZ2UnOiBmYWxzZSB9KTtcbiAgICB9XG59XG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL2NvZGUudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==