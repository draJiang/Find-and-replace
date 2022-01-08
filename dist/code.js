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
                        toUIHTML.push({ 'id': item['node'].id, 'characters': item['node'].characters, 'start': index, 'end': index + msg.data.keyword.length });
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
                    loaded_fonts.push(font);
                    console.log('loadFontAsync');
                    yield figma.loadFontAsync(font);
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
        // console.log(target_Text_Node);
        target_Text_Node.forEach(item => {
            // console.log('target_Text_Node.forEach:');
            // console.log(item);
            if (item['ancestor_isVisible'] == false || item['ancestor_isLocked'] == true) {
            }
            else {
                var searchRegExp = new RegExp(data.data.keyword, 'g');
                // console.log(item);
                item['node'].characters = item['node'].characters.replace(searchRegExp, data.data.replace_word);
            }
        });
        // 替换完毕，通知 UI 更新
        figma.ui.postMessage({ 'type': 'replace' });
        console.log('target_Text_Node:');
        // console.log(target_Text_Node);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQSx5QkFBeUIseUJBQXlCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxzQkFBc0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0Msd0JBQXdCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRCwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0Msc0hBQXNIO0FBQzlKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsOENBQThDO0FBQzdFLDhFQUE4RSxvQ0FBb0M7QUFDbEg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDZCQUE2QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHlCQUF5QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msd0dBQXdHO0FBQzVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsK0JBQStCLG1CQUFtQjtBQUNsRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixvREFBb0Q7QUFDbkY7QUFDQTtBQUNBLCtCQUErQixxREFBcUQ7QUFDcEY7QUFDQTs7Ozs7Ozs7VUUvVEE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmQtYW5kLXJlcGxhY2UvLi9zcmMvY29kZS50cyIsIndlYnBhY2s6Ly9maW5kLWFuZC1yZXBsYWNlL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmluZC1hbmQtcmVwbGFjZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vbm9kZV9tb2R1bGVzL0BmaWdtYS9wbHVnaW4tdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cbmxldCB0YXJnZXRfVGV4dF9Ob2RlID0gW107IC8vIOWtmOWCqOespuWQiOaQnOe0ouadoeS7tueahCBURVhUIOWbvuWxglxubGV0IGxvYWRlZF9mb250cyA9IFtdO1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMDAsIGhlaWdodDogMzQwIH0pO1xuLy8gY29uc29sZS5sb2coJ2hlbGxvMicpXG5vblNlbGVjdGlvbkNoYW5nZSgpO1xuLy8g57uR5a6aIEZpZ21hIOWbvuWxgumAieaLqeWPmOWMluS6i+S7tlxuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4geyBvblNlbGVjdGlvbkNoYW5nZSgpOyB9KTtcbi8vIFVJIOWPkeadpea2iOaBr1xuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbiAgICAvLyBVSSDkuK3ngrnlh7vkuobmkJzntKJcbiAgICBpZiAobXNnLnR5cGUgPT09ICdzZWFyY2gnKSB7XG4gICAgICAgIC8vIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZF9sb2FkaW5nJyB9KVxuICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIC8vIOaJp+ihjOaQnOe0olxuICAgICAgICBmaW5kKG1zZy5kYXRhKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCB0YXJnZXRfVGV4dF9Ob2RlOicpO1xuICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXRfVGV4dF9Ob2RlKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2NvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGUubGVuZ3RoKTsnICsgdGFyZ2V0X1RleHRfTm9kZS5sZW5ndGgudG9TdHJpbmcoKSk7XG4gICAgICAgIGxldCB0b1VJSFRNTCA9IFtdOyAvLyDlrZjlgqjmlbDmja7vvIznlKjkuo7lj5HpgIHnu5kgVUlcbiAgICAgICAgaWYgKHRhcmdldF9UZXh0X05vZGUubGVuZ3RoID49IDApIHtcbiAgICAgICAgICAgIC8vIOWmguaenOWtmOWcqOespuWQiOaQnOe0ouadoeS7tueahCBURVhUIOWbvuWxglxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RhcmdldF9UZXh0X05vZGUuZm9yRWFjaDonKTtcbiAgICAgICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIC8vIOaehOW7uuaVsOaNru+8jOS8oOmAgee7mSBVSVxuICAgICAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOeUseS6juWNleS4qiBURVhUIOWbvuWxguWGheWPr+iDveWtmOWcqOWkmuS4quespuWQiOadoeS7tueahOWtl+espu+8jOaJgOS7pemcgOimgeW+queOr+afpeaJvlxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBpdGVtWydub2RlJ10uY2hhcmFjdGVycy5pbmRleE9mKG1zZy5kYXRhLmtleXdvcmQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2luZGV4OicpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlsIbmn6Xmib7nmoTlrZfnrKbotbflp4vjgIHnu4jmraLkvY3nva7lj5HpgIHnu5kgVUlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvVUlIVE1MLnB1c2goeyAnaWQnOiBpdGVtWydub2RlJ10uaWQsICdjaGFyYWN0ZXJzJzogaXRlbVsnbm9kZSddLmNoYXJhY3RlcnMsICdzdGFydCc6IGluZGV4LCAnZW5kJzogaW5kZXggKyBtc2cuZGF0YS5rZXl3b3JkLmxlbmd0aCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gaW5kZXggKyBtc2cuZGF0YS5rZXl3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaWYgOnRvVUlIVE1MOicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codG9VSUhUTUwpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnZmluZCcsICd0YXJnZXRfVGV4dF9Ob2RlJzogdG9VSUhUTUwgfSk7XG4gICAgICAgIGNvbnN0IGxvYWRGb250ID0gKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkgeyBteUxvYWRGb250QXN5bmModGFyZ2V0X1RleHRfTm9kZSk7IH0pO1xuICAgICAgICBsb2FkRm9udCgpO1xuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vmkJzntKLnu5PmnpzpoblcbiAgICBpZiAobXNnLnR5cGUgPT09ICdsaXN0T25DbGlrJykge1xuICAgICAgICBjb25zb2xlLmxvZygnY29kZSBqczpsaXN0T25DbGlrOicpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICB2YXIgdGFyZ2V0Tm9kZTtcbiAgICAgICAgY29uc29sZS5sb2coJ2ZvckVhY2g6Jyk7XG4gICAgICAgIC8vIOmBjeWOhuaQnOe0oue7k+aenFxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldF9UZXh0X05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhcmdldF9UZXh0X05vZGVbaV0uaWQpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLmRhdGEuaXRlbSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtc2cuZGF0YVsnaXRlbSddKTtcbiAgICAgICAgICAgIGlmICh0YXJnZXRfVGV4dF9Ob2RlW2ldWydub2RlJ10uaWQgPT0gbXNnLmRhdGFbJ2l0ZW0nXSkge1xuICAgICAgICAgICAgICAgIC8vIOaJvuWIsOeUqOaIt+eCueWHu+eahOWbvuWxglxuICAgICAgICAgICAgICAgIHRhcmdldE5vZGUgPT09IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXTtcbiAgICAgICAgICAgICAgICAvLyBGaWdtYSDop4blm77lrprkvY3liLDlr7nlupTlm77lsYJcbiAgICAgICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW3RhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXV0pO1xuICAgICAgICAgICAgICAgIC8vIEZpZ21hIOmAieS4reWvueW6lOaWh+acrFxuICAgICAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGVkVGV4dFJhbmdlID0geyAnbm9kZSc6IHRhcmdldF9UZXh0X05vZGVbaV1bJ25vZGUnXSwgJ3N0YXJ0JzogbXNnLmRhdGFbJ3N0YXJ0J10sICdlbmQnOiBtc2cuZGF0YVsnZW5kJ10gfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBVSSDkuK3ngrnlh7vkuobjgIzmm7/mjaLjgI3mjInpkq5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXBsYWNlJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVwbGFjZScpO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAvLyDmiafooYzmm7/mjaJcbiAgICAgICAgcmVwbGFjZShtc2cpO1xuICAgIH1cbn07XG4vLyDmn6Xmib7lm77lsYLkuIvnmoTmlofmnKzlm77lsYLvvIzovpPlhaUgZmlnbWEg5Zu+5bGC5a+56LGh77yM6L+U5Zue5om+5Yiw5omA5pyJ5paH5pys5Zu+5bGCXG5mdW5jdGlvbiBteUZpbmRUZXh0QWxsKG5vZGUsIG5vZGVfbGlzdCwgYW5jZXN0b3JfaXNMb2NrZWQsIGFuY2VzdG9yX2lzVmlzaWJsZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdteUZpbmRBbGwnKTtcbiAgICAvLyBjb25zb2xlLmxvZyhpc0xvY2tlZCk7XG4gICAgbGV0IGxvY2tlZCA9IGZhbHNlOyAvLyDlrZjlgqjmnIDnu4jnmoTnirbmgIFcbiAgICBsZXQgdmlzaWJsZSA9IHRydWU7XG4gICAgLy8g5aaC5p6c55uu5qCH5Zu+5bGC5pys6Lqr5bCx5pivIFRFWFQg5Zu+5bGCXG4gICAgaWYgKG5vZGUudHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgLy8gLy8g5paH5pys5Zu+5bGC5piv5ZCm6ZSB5a6a44CB6ZqQ6JeP77yfXG4gICAgICAgIC8vIGlmIChub2RlLmxvY2tlZCkge1xuICAgICAgICAvLyAgIC8vIOmUgeWumlxuICAgICAgICAvLyAgIGxvY2tlZCA9IHRydWVcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICBsb2NrZWQgPSBmYWxzZVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGlmIChub2RlLnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgLy8gICAvLyDpmpDol49cbiAgICAgICAgLy8gICB2aXNpYmxlID0gZmFsc2VcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICB2aXNpYmxlID0gdHJ1ZVxuICAgICAgICAvLyB9XG4gICAgICAgIC8vIC8vIOelluWFiOWbvuWxgueahOmUgeWumuOAgemakOiXj+eKtuaAgeS8mOWFiOe6p+mrmFxuICAgICAgICAvLyBpZiAoYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAvLyAgIC8vIOelluWFiOaYr+mUgeWumueKtuaAgVxuICAgICAgICAvLyAgIGxvY2tlZCA9IHRydWVcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAvLyDnpZblhYjpnZ7plIHlrprnirbmgIFcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlKSB7XG4gICAgICAgIC8vICAgLy8g56WW5YWI5piv6ZqQ6JeP54q25oCBXG4gICAgICAgIC8vICAgdmlzaWJsZSA9IGZhbHNlXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgLy8g56WW5YWI6Z2e6ZqQ6JeP54q25oCBXG4gICAgICAgIC8vIH1cbiAgICAgICAgbm9kZV9saXN0LnB1c2gobm9kZSk7XG4gICAgICAgIHJldHVybiBub2RlX2xpc3Q7XG4gICAgfVxuICAgIHZhciB0aGlzQ2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuICAgIC8vICDlpoLmnpzlvZPliY3oioLngrnkuIvlrZjlnKjlrZDoioLngrlcbiAgICBpZiAodGhpc0NoaWxkcmVuID09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyDlvZPliY3oioLngrnml6DlrZDoioLngrnvvIzlj6/og73mmK/lvaLnirblm77lsYJcbiAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICB9XG4gICAgLy8gaWYgKGFuY2VzdG9yX2lzTG9ja2VkID09IHRydWUpIHtcbiAgICAvLyAgIC8vIOelluWFiOaYr+mUgeWumueKtuaAgVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAvLyDnpZblhYjpnZ7plIHlrprnirbmgIFcbiAgICAvLyAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdGhpc0NoaWxkcmVuLmxvY2tlZFxuICAgIC8vIH1cbiAgICAvLyBpZiAoYW5jZXN0b3JfaXNWaXNpYmxlID09IGZhbHNlKSB7XG4gICAgLy8gICAvLyDnpZblhYjmmK/pmpDol4/nirbmgIFcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgLy8g56WW5YWI6Z2e6ZqQ6JeP54q25oCBXG4gICAgLy8gICBhbmNlc3Rvcl9pc1Zpc2libGUgPSB0aGlzQ2hpbGRyZW4udmlzaWJsZVxuICAgIC8vIH1cbiAgICAvLyDpgY3ljoblrZDoioLngrlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXNDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygndGhpc0NoaWxkcmVuOicpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXNDaGlsZHJlbik7XG4gICAgICAgIGlmICh0aGlzQ2hpbGRyZW4gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnISEhRVJSTyB0aGlzQ2hpbGRyZW49PXVuZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVfbGlzdDtcbiAgICAgICAgfVxuICAgICAgICAvLyDlpoLmnpzoioLngrnnmoTnsbvlnovkuLogVEVYVFxuICAgICAgICBpZiAodGhpc0NoaWxkcmVuW2ldLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICBub2RlX2xpc3QucHVzaCh0aGlzQ2hpbGRyZW5baV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5pivIFRFWFQg5Zu+5bGCXG4gICAgICAgICAgICAvLyDlpoLmnpzljIXlkKvlrZDlm77lsYJcbiAgICAgICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0uY2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hpbGRyZW5baV0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIOelluWFiOaYr+mUgeWumueKtuaAgVxuICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyAgIC8vIOelluWFiOmdnumUgeWumueKtuaAgVxuICAgICAgICAgICAgICAgICAgICAvLyAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdGhpc0NoaWxkcmVuW2ldLmxvY2tlZFxuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAvLyDnpZblhYjmmK/pmpDol4/nirbmgIFcbiAgICAgICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAvLyDnpZblhYjpnZ7pmpDol4/nirbmgIFcbiAgICAgICAgICAgICAgICAgICAgLy8gICBhbmNlc3Rvcl9pc1Zpc2libGUgPSB0aGlzQ2hpbGRyZW4udmlzaWJsZVxuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgIG5vZGVfbGlzdCA9IG15RmluZFRleHRBbGwodGhpc0NoaWxkcmVuW2ldLCBub2RlX2xpc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnbm9kZV9saXN0OicpO1xuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgcmV0dXJuIG5vZGVfbGlzdDtcbn1cbmZ1bmN0aW9uIG15TG9hZEZvbnRBc3luYyh0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbXlMb2FkRm9udEFzeW5jOicpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZXh0X2xheWVyX0xpc3QpO1xuICAgICAgICBmb3IgKGxldCBsYXllciBvZiB0ZXh0X2xheWVyX0xpc3QpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tJyk7XG4gICAgICAgICAgICAvLyDliqDovb3lrZfkvZNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYXllcjonKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxheWVyKTtcbiAgICAgICAgICAgIGxldCBmb250cyA9IGxheWVyWydub2RlJ10uZ2V0UmFuZ2VBbGxGb250TmFtZXMoMCwgbGF5ZXJbJ25vZGUnXVsnY2hhcmFjdGVycyddLmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9udHM6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmb250cyk7XG4gICAgICAgICAgICBmb3IgKGxldCBmb250IG9mIGZvbnRzKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZpbmQgZW5kIGxvYWQgZm9udDonKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbG9hZGVkX2ZvbnRzOicpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvYWRlZF9mb250cyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZvbnQ6Jyk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZm9udCk7XG4gICAgICAgICAgICAgICAgbGV0IGJpbmdvID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbG9hZGVkX2ZvbnQgb2YgbG9hZGVkX2ZvbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWRfZm9udFsnZmFtaWx5J10gPT0gZm9udFsnZmFtaWx5J10gJiYgbG9hZGVkX2ZvbnRbJ3N0eWxlJ10gPT0gZm9udFsnc3R5bGUnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmluZ28gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYmluZ28pO1xuICAgICAgICAgICAgICAgIGlmIChiaW5nbykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRlZF9mb250cy5wdXNoKGZvbnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbG9hZEZvbnRBc3luYycpO1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKGZvbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhteUZvbnQpO1xuICAgICAgICAvLyBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKG15Rm9udClcbiAgICB9KTtcbn1cbi8vIOaQnOe0olxuZnVuY3Rpb24gZmluZChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coJ2NvbmRlLnRzOmZpbmQ6Jyk7XG4gICAgLy8gY29uc29sZS5sb2coZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgIC8vIOa4heepuuWOhuWPsuaQnOe0ouaVsOaNru+8jOmHjeaWsOaQnOe0olxuICAgIHRhcmdldF9UZXh0X05vZGUgPSBbXTtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIHZhciBub2RlX2xpc3QgPSBbXTsgLy8g5a2Y5YKo55uu5qCH5YC8IOKAlOKAlCDpgInkuK3lm77lsYLkuK3vvIzmiYDmnInmlofmnKzlm77lsYJcbiAgICAvLyDlvZPliY3mnKrpgInkuK3lm77lsYLvvIzliJnlnKjlvZPliY3pobXpnaLmkJzntKJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIG5vZGVfbGlzdCA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRBbGwobiA9PiBuLnR5cGUgPT09IFwiVEVYVFwiKVxuICAgICAgICBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5jaGlsZHJlbjtcbiAgICAgICAgLy8gbm9kZV9saXN0ID0gbXlGaW5kVGV4dEFsbChmaWdtYS5jdXJyZW50UGFnZSwgbm9kZV9saXN0KVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8g5b2T5YmN5pyJ6YCJ5Lit5Zu+5bGC77yM5YiZ5Zyo6YCJ5Lit55qE5Zu+5bGC5Lit5pCc57SiXG4gICAgICAgIC8vIOWcqOW9k+WJjemAieS4reeahOWbvuWxguS4re+8jOaQnOe0ouaWh+acrOWbvuWxglxuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZmluZDpmb3Igc2VsZWN0aW9uJyk7XG4gICAgICAgIG5vZGVfbGlzdCA9IG15RmluZFRleHRBbGwoc2VsZWN0aW9uW2ldLCBub2RlX2xpc3QpO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZygnc2VsZWN0aW9uOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKHNlbGVjdGlvbik7XG4gICAgY29uc29sZS5sb2coJ0ZpbmQgZW5kOicpO1xuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVfbGlzdCk7XG4gICAgLy8g5Zyo5paH5pys5Zu+5bGC5Lit77yM5Yy56YWN5YWz6ZSu5a2XXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBub2RlX2xpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZV9saXN0W2pdWydub2RlJ10pO1xuICAgICAgICBpZiAobm9kZV9saXN0W2pdWydjaGFyYWN0ZXJzJ10uaW5kZXhPZihkYXRhLmtleXdvcmQpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIOaJvuWIsOWFs+mUruivjVxuICAgICAgICAgICAgbGV0IHRoaXNfcGFyZW50O1xuICAgICAgICAgICAgbGV0IGFuY2VzdG9yX2lzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBsZXQgYW5jZXN0b3JfaXNMb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChub2RlX2xpc3Rbal0ubG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc0xvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZV9saXN0W2pdLnZpc2libGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBhbmNlc3Rvcl9pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhbmNlc3Rvcl9pc1Zpc2libGUgPT0gZmFsc2UgfHwgYW5jZXN0b3JfaXNMb2NrZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOWbvuWxguacrOi6q+WwseaYr+mUgeWumuaIlumakOiXj+eKtuaAgVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g6I635Y+W56WW5YWI5YWD57Sg55qE54q25oCBXG4gICAgICAgICAgICAgICAgdGhpc19wYXJlbnQgPSBub2RlX2xpc3Rbal0ucGFyZW50O1xuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzX3BhcmVudC50eXBlICE9ICdQQUdFJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQubG9ja2VkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2VzdG9yX2lzTG9ja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpc19wYXJlbnQudmlzaWJsZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5jZXN0b3JfaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuY2VzdG9yX2lzVmlzaWJsZSA9PSBmYWxzZSB8fCBhbmNlc3Rvcl9pc0xvY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNfcGFyZW50ID0gdGhpc19wYXJlbnQucGFyZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0X1RleHRfTm9kZS5wdXNoKHsgJ25vZGUnOiBub2RlX2xpc3Rbal0sICdhbmNlc3Rvcl9pc1Zpc2libGUnOiBhbmNlc3Rvcl9pc1Zpc2libGUsICdhbmNlc3Rvcl9pc0xvY2tlZCc6IGFuY2VzdG9yX2lzTG9ja2VkIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8g5pu/5o2iXG5mdW5jdGlvbiByZXBsYWNlKGRhdGEpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVwbGFjZScpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgICAgIHRhcmdldF9UZXh0X05vZGUuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0YXJnZXRfVGV4dF9Ob2RlLmZvckVhY2g6Jyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtKTtcbiAgICAgICAgICAgIGlmIChpdGVtWydhbmNlc3Rvcl9pc1Zpc2libGUnXSA9PSBmYWxzZSB8fCBpdGVtWydhbmNlc3Rvcl9pc0xvY2tlZCddID09IHRydWUpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzZWFyY2hSZWdFeHAgPSBuZXcgUmVnRXhwKGRhdGEuZGF0YS5rZXl3b3JkLCAnZycpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGl0ZW0pO1xuICAgICAgICAgICAgICAgIGl0ZW1bJ25vZGUnXS5jaGFyYWN0ZXJzID0gaXRlbVsnbm9kZSddLmNoYXJhY3RlcnMucmVwbGFjZShzZWFyY2hSZWdFeHAsIGRhdGEuZGF0YS5yZXBsYWNlX3dvcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8g5pu/5o2i5a6M5q+V77yM6YCa55+lIFVJIOabtOaWsFxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7ICd0eXBlJzogJ3JlcGxhY2UnIH0pO1xuICAgICAgICBjb25zb2xlLmxvZygndGFyZ2V0X1RleHRfTm9kZTonKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0X1RleHRfTm9kZSk7XG4gICAgfSk7XG59XG4vLyBGaWdtYSDlm77lsYLpgInmi6nlj5jljJbml7bvvIzpgJrnn6UgVUkg5pi+56S65LiN5ZCM55qE5o+Q56S6XG5mdW5jdGlvbiBvblNlbGVjdGlvbkNoYW5nZSgpIHtcbiAgICB2YXIgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIC8vIOW9k+WJjeacqumAieS4reWbvuWxgu+8jOWImeWcqOW9k+WJjemhtemdouaQnOe0olxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09IDApIHtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyAndHlwZSc6ICdvblNlbGVjdGlvbkNoYW5nZScsICdzZWxlY3Rpb25QYWdlJzogdHJ1ZSB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgJ3R5cGUnOiAnb25TZWxlY3Rpb25DaGFuZ2UnLCAnc2VsZWN0aW9uUGFnZSc6IGZhbHNlIH0pO1xuICAgIH1cbn1cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvY29kZS50c1wiXSgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9